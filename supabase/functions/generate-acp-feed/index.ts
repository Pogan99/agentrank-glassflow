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

    // Get all active products
    const { data: products, error: productsError } = await supabaseClient
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (productsError) throw productsError;

    // Generate feed data in ChatGPT Shopping format
    const feedItems = products.map((product: any) => ({
      id: product.shopify_product_id,
      title: product.title,
      description: product.description || product.body_html,
      link: `https://shop.example.com/products/${product.handle}`,
      image_link: product.featured_image,
      additional_image_link: product.images?.data?.slice(1, 11).map((img: any) => img.src) || [],
      price: `${product.price} ${product.currency}`,
      availability: product.inventory_quantity > 0 ? 'in stock' : 'out of stock',
      brand: product.vendor,
      condition: 'new',
      product_type: product.product_type,
      google_product_category: '',
      gtin: '',
      mpn: '',
      item_group_id: product.shopify_product_id,
    }));

    // Calculate feed stats
    const productsIncluded = products.filter((p: any) => p.acp_compliant).length;
    const productsExcluded = products.length - productsIncluded;
    const averageScore = products.reduce((sum: number, p: any) => sum + p.acp_score, 0) / products.length;

    // Store feed as JSON
    const feedData = {
      version: '2.4',
      generated_at: new Date().toISOString(),
      items: feedItems,
      total_count: products.length,
      acp_compliant_count: productsIncluded,
    };

    const feedUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/acp-feeds/${userId}/feed.json`;

    // Upload feed to storage
    const { error: uploadError } = await supabaseClient.storage
      .from('acp-feeds')
      .upload(`${userId}/feed.json`, JSON.stringify(feedData, null, 2), {
        contentType: 'application/json',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Upsert feed record
    const { data: feed, error: feedError } = await supabaseClient
      .from('acp_feeds')
      .upsert([{
        user_id: userId,
        feed_url: feedUrl,
        feed_data: feedData,
        products_included: productsIncluded,
        products_excluded: productsExcluded,
        overall_score: Math.round(averageScore),
        last_generated_at: new Date().toISOString(),
        next_sync_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }], { onConflict: 'user_id' })
      .select()
      .single();

    if (feedError) throw feedError;

    return new Response(
      JSON.stringify({
        success: true,
        feedUrl,
        productsIncluded,
        productsExcluded,
        overallScore: Math.round(averageScore),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error generating feed:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
