import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-shopify-hmac-sha256, x-shopify-topic, x-shopify-shop-domain',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const hmac = req.headers.get('x-shopify-hmac-sha256');
    const topic = req.headers.get('x-shopify-topic');
    const shopDomain = req.headers.get('x-shopify-shop-domain');
    
    if (!hmac || !topic || !shopDomain) {
      throw new Error('Missing required headers');
    }

    const rawBody = await req.text();
    
    // Verify webhook signature
    const webhookSecret = Deno.env.get('SHOPIFY_WEBHOOK_SECRET');
    if (webhookSecret) {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(webhookSecret);
      const msgData = encoder.encode(rawBody);
      
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      
      const signature = await crypto.subtle.sign('HMAC', key, msgData);
      const generatedHmac = btoa(String.fromCharCode(...new Uint8Array(signature)));
      
      if (generatedHmac !== hmac) {
        throw new Error('Invalid webhook signature');
      }
    }

    const payload = JSON.parse(rawBody);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find user by shop domain
    const { data: profile, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select('id')
      .eq('shopify_shop_domain', shopDomain)
      .single();

    if (profileError || !profile) {
      console.log('Shop not found:', shopDomain);
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Store webhook event
    await supabaseClient
      .from('webhook_events')
      .insert({
        user_id: profile.id,
        event_type: topic,
        shopify_topic: topic,
        payload: payload,
      });

    // Process webhook based on topic
    if (topic === 'products/create' || topic === 'products/update') {
      // Handle product update
      const productData = {
        user_id: profile.id,
        shopify_product_id: payload.id.toString(),
        title: payload.title,
        description: payload.body_html,
        body_html: payload.body_html,
        vendor: payload.vendor,
        product_type: payload.product_type,
        tags: payload.tags?.split(',').map((t: string) => t.trim()) || [],
        price: parseFloat(payload.variants?.[0]?.price || '0'),
        inventory_quantity: payload.variants?.[0]?.inventory_quantity || 0,
        images: { data: payload.images },
        featured_image: payload.image?.src,
        handle: payload.handle,
        status: payload.status,
        published_at: payload.published_at,
        last_synced_at: new Date().toISOString(),
      };

      await supabaseClient
        .from('products')
        .upsert(productData, {
          onConflict: 'user_id,shopify_product_id',
        });
    } else if (topic === 'products/delete') {
      // Handle product deletion
      await supabaseClient
        .from('products')
        .delete()
        .eq('user_id', profile.id)
        .eq('shopify_product_id', payload.id.toString());
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
