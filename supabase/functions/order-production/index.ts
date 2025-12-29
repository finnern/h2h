import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
        JSON.stringify({ error: 'Order URL not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    const { cards, language } = requestBody;

    // Validate cards
    if (!isValidCards(cards)) {
      console.error('Invalid cards format or size');
      return new Response(
        JSON.stringify({ error: 'Invalid cards: must be an array of card objects' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate language
    if (language && typeof language !== 'string') {
      console.error('Invalid language:', language);
      return new Response(
        JSON.stringify({ error: 'Invalid language: must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Received valid order-production request with', cards.length, 'cards');

    // Prepare payload for n8n
    const payload = {
      action: "order",
      cards,
      language: language || 'de',
      ordered_at: new Date().toISOString(),
    };

    console.log('Sending order payload to n8n:', JSON.stringify(payload, null, 2));

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
      return new Response(
        JSON.stringify({ error: 'Order request failed' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const n8nData = await n8nResponse.json().catch(() => ({}));
    console.log('n8n order response:', n8nData);

    return new Response(
      JSON.stringify({ success: true, data: n8nData }),
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
