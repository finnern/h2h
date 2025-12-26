import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
    if (!n8nWebhookUrl) {
      console.error('N8N_WEBHOOK_URL is not configured');
      return new Response(
        JSON.stringify({ error: 'Webhook URL not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { profile_id, couple_data, memories, history_opt_in } = await req.json();

    console.log('Received trigger-production request:', { profile_id, history_opt_in });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if this is a returning customer (has previous orders)
    let isReturningCustomer = false;
    if (profile_id) {
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
    }

    // Prepare payload for n8n
    const payload = {
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
      console.error('n8n webhook error:', n8nResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Webhook request failed', details: errorText }),
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in trigger-production function:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
