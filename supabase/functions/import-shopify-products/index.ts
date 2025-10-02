import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user profile with Shopify credentials
    const { data: profile, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select('shopify_shop_domain, shopify_access_token')
      .eq('id', userId)
      .single();

    if (profileError || !profile?.shopify_access_token) {
      throw new Error('Shopify not connected');
    }

    // Create sync job
    const { data: job, error: jobError } = await supabaseClient
      .from('sync_jobs')
      .insert({
        user_id: userId,
        job_type: 'product_import',
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (jobError) throw jobError;

    // Fetch products from Shopify
    const shopifyUrl = `https://${profile.shopify_shop_domain}/admin/api/2024-01/products.json`;
    const shopifyResponse = await fetch(shopifyUrl, {
      headers: {
        'X-Shopify-Access-Token': profile.shopify_access_token,
        'Content-Type': 'application/json',
      },
    });

    if (!shopifyResponse.ok) {
      throw new Error(`Shopify API error: ${shopifyResponse.statusText}`);
    }

    const { products } = await shopifyResponse.json();

    // Process and insert products
    let processedCount = 0;
    for (const product of products) {
      try {
        // Calculate ACP compliance
        const missingFields = [];
        if (!product.title || product.title.length < 10) missingFields.push('title');
        if (!product.body_html || product.body_html.length < 100) missingFields.push('description');
        if (!product.images || product.images.length === 0) missingFields.push('images');
        if (!product.vendor) missingFields.push('vendor');
        
        const acpScore = Math.max(0, 100 - (missingFields.length * 25));
        const acpCompliant = acpScore >= 75;

        const productData = {
          user_id: userId,
          shopify_product_id: product.id.toString(),
          shopify_variant_id: product.variants?.[0]?.id?.toString(),
          title: product.title,
          description: product.body_html,
          body_html: product.body_html,
          vendor: product.vendor,
          product_type: product.product_type,
          tags: product.tags?.split(',').map((t: string) => t.trim()) || [],
          price: parseFloat(product.variants?.[0]?.price || '0'),
          compare_at_price: parseFloat(product.variants?.[0]?.compare_at_price || '0'),
          currency: 'USD',
          inventory_quantity: product.variants?.[0]?.inventory_quantity || 0,
          inventory_policy: product.variants?.[0]?.inventory_policy,
          images: { data: product.images },
          featured_image: product.image?.src,
          seo_title: product.title,
          seo_description: product.body_html?.substring(0, 160),
          handle: product.handle,
          status: product.status,
          published_at: product.published_at,
          acp_compliant: acpCompliant,
          acp_score: acpScore,
          missing_fields: missingFields,
          last_synced_at: new Date().toISOString(),
        };

        await supabaseClient
          .from('products')
          .upsert(productData, {
            onConflict: 'user_id,shopify_product_id',
          });

        processedCount++;
      } catch (error) {
        console.error('Error processing product:', error);
      }
    }

    // Update sync job
    await supabaseClient
      .from('sync_jobs')
      .update({
        status: 'completed',
        total_items: products.length,
        processed_items: processedCount,
        completed_at: new Date().toISOString(),
        result_data: {
          imported: processedCount,
          skipped: products.length - processedCount,
        },
      })
      .eq('id', job.id);

    // Update user profile
    await supabaseClient
      .from('user_profiles')
      .update({
        last_sync_at: new Date().toISOString(),
      })
      .eq('id', userId);

    return new Response(
      JSON.stringify({
        success: true,
        jobId: job.id,
        productsImported: processedCount,
        totalProducts: products.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error importing products:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
