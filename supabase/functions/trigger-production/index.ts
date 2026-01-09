import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// UUID v4 regex pattern for validation
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Validate that a string is a valid UUID
function isValidUUID(str: unknown): boolean {
  return typeof str === 'string' && UUID_REGEX.test(str);
}

// Validate couple_data object structure
function isValidCoupleData(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  // Allow any object but ensure it's not too large (prevent DoS)
  const jsonStr = JSON.stringify(data);
  return jsonStr.length <= 10000; // Max 10KB for couple data
}

// Validate memories object structure
function isValidMemories(data: unknown): boolean {
  if (data === null || data === undefined) return true; // Optional field
  if (typeof data !== 'object') return false;
  const jsonStr = JSON.stringify(data);
  return jsonStr.length <= 50000; // Max 50KB for memories
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.error('Invalid method:', req.method);
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get the webhook URL directly from secrets - use exactly as configured
    const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
    if (!n8nWebhookUrl) {
      console.error('N8N_WEBHOOK_URL is not configured');
      return new Response(
        JSON.stringify({ error: 'Webhook URL not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Calling n8n URL:', n8nWebhookUrl);

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      console.error('Invalid JSON in request body');
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { profile_id, couple_data, memories, history_opt_in, session_id } = requestBody;

    // Validate session_id (required for ownership verification)
    if (!session_id || typeof session_id !== 'string') {
      console.error('Missing or invalid session_id');
      return new Response(
        JSON.stringify({ error: 'Session required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate session_id format (reasonable length check)
    if (session_id.length > 100 || session_id.length < 10) {
      console.error('Invalid session_id format');
      return new Response(
        JSON.stringify({ error: 'Invalid session format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate profile_id (required, must be UUID)
    if (!isValidUUID(profile_id)) {
      console.error('Invalid or missing profile_id:', profile_id);
      return new Response(
        JSON.stringify({ error: 'Invalid profile_id: must be a valid UUID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate couple_data
    if (!isValidCoupleData(couple_data)) {
      console.error('Invalid couple_data format or size');
      return new Response(
        JSON.stringify({ error: 'Invalid couple_data: must be an object under 10KB' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate memories
    if (!isValidMemories(memories)) {
      console.error('Invalid memories format or size');
      return new Response(
        JSON.stringify({ error: 'Invalid memories: must be an object under 50KB' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate history_opt_in (must be boolean if provided)
    if (history_opt_in !== undefined && typeof history_opt_in !== 'boolean') {
      console.error('Invalid history_opt_in:', history_opt_in);
      return new Response(
        JSON.stringify({ error: 'Invalid history_opt_in: must be a boolean' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Received valid trigger-production request:', { profile_id, history_opt_in });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify that the profile exists AND belongs to this session (ownership check)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, session_id')
      .eq('id', profile_id)
      .eq('session_id', session_id)
      .single();

    if (profileError || !profileData) {
      console.error('Profile not found or session mismatch:', profileError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if this is a returning customer (has previous orders)
    let isReturningCustomer = false;
    const { data: previousOrders, error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .eq('profile_id', profile_id)
      .limit(1);

    if (ordersError) {
      console.error('Error checking previous orders:', ordersError);
    } else {
      isReturningCustomer = (previousOrders?.length || 0) > 0;
    }

    // Prepare payload for n8n
    const payload = {
      action: "preview",
      user_id: profile_id,
      couple_data,
      memories: history_opt_in ? memories : null,
      is_returning_customer: isReturningCustomer,
    };

    console.log('Sending payload to n8n:', JSON.stringify(payload, null, 2));

    // Send POST request to n8n webhook
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('n8n webhook error - Status:', n8nResponse.status, 'Response:', errorText);
      return new Response(
        JSON.stringify({ error: 'Webhook request failed', status: n8nResponse.status, details: errorText }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const n8nData = await n8nResponse.json().catch(() => ({}));
    console.log('n8n response:', n8nData);

    return new Response(
      JSON.stringify({ success: true, data: n8nData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in trigger-production function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
