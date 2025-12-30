import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validate cards array structure
function isValidCards(data: unknown): boolean {
  if (!Array.isArray(data)) return false;
  if (data.length === 0 || data.length > 10) return false;
  
  const jsonStr = JSON.stringify(data);
  if (jsonStr.length > 50000) return false; // Max 50KB
  
  return data.every(card => 
    typeof card === 'object' && 
    card !== null &&
    typeof card.archetype === 'string' &&
    typeof card.questions === 'object' &&
    card.questions !== null
  );
}

// Validate session_id format (must match the format from useSessionId hook)
function isValidSessionId(sessionId: unknown): boolean {
  if (typeof sessionId !== 'string') return false;
  // Session ID format: sess_<timestamp>_<random>
  const sessionPattern = /^sess_\d+_[a-z0-9]+$/;
  return sessionPattern.test(sessionId) && sessionId.length <= 50;
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
    const n8nOrderUrl = Deno.env.get('N8N_ORDER_URL');
    if (!n8nOrderUrl) {
      console.error('N8N_ORDER_URL is not configured');
      return new Response(
        JSON.stringify({ error: 'Order service unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      console.error('Invalid JSON in request body');
      return new Response(
        JSON.stringify({ error: 'Invalid request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { cards, language, session_id } = requestBody;

    // Validate session_id is provided and valid format
    if (!isValidSessionId(session_id)) {
      console.error('Invalid or missing session_id');
      return new Response(
        JSON.stringify({ error: 'Valid session required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate cards
    if (!isValidCards(cards)) {
      console.error('Invalid cards format or size');
      return new Response(
        JSON.stringify({ error: 'Invalid card data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate language
    if (language && typeof language !== 'string') {
      console.error('Invalid language:', language);
      return new Response(
        JSON.stringify({ error: 'Invalid language' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role for verification
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the session_id corresponds to a valid profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('session_id', session_id)
      .single();

    if (profileError || !profile) {
      console.error('Profile not found for session:', session_id);
      return new Response(
        JSON.stringify({ error: 'Session not found' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting: Check for recent orders from this profile (max 3 per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentOrders, error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .eq('profile_id', profile.id)
      .gte('created_at', oneHourAgo);

    if (!ordersError && recentOrders && recentOrders.length >= 3) {
      console.error('Rate limit exceeded for profile:', profile.id);
      return new Response(
        JSON.stringify({ error: 'Too many orders. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create order record before calling n8n
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        profile_id: profile.id,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Failed to create order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Created order:', order.id, 'for profile:', profile.id);

    // Prepare payload for n8n with order tracking
    const payload = {
      action: "order",
      order_id: order.id,
      profile_id: profile.id,
      cards,
      language: language || 'de',
      ordered_at: new Date().toISOString(),
    };

    console.log('Sending order payload to n8n for order:', order.id);

    // Send POST request to n8n order webhook
    const n8nResponse = await fetch(n8nOrderUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('n8n order webhook error:', n8nResponse.status, errorText);
      
      // Update order status to failed
      await supabase
        .from('orders')
        .update({ status: 'failed' })
        .eq('id', order.id);
      
      return new Response(
        JSON.stringify({ error: 'Order processing failed' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const n8nData = await n8nResponse.json().catch(() => ({}));
    console.log('n8n order response for order:', order.id);

    // Update order status to processing
    await supabase
      .from('orders')
      .update({ status: 'processing' })
      .eq('id', order.id);

    return new Response(
      JSON.stringify({ success: true, order_id: order.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in order-production function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
