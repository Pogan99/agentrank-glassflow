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
    const { optimizationId, fields } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get optimization and product
    const { data: optimization, error: optimizationError } = await supabaseClient
      .from('optimizations')
      .select('*, products(*), user_profiles(shopify_shop_domain, shopify_access_token)')
      .eq('id', optimizationId)
      .single();

    if (optimizationError || !optimization) {
      throw new Error('Optimization not found');
    }

    const profile = optimization.user_profiles as any;
    const product = optimization.products as any;

    if (!profile.shopify_access_token) {
      throw new Error('Shopify not connected');
    }

    // Prepare update data
    const updateData: any = {};
    
    if (fields.includes('title') && optimization.after_data.title) {
      updateData.title = optimization.after_data.title;
    }
    if (fields.includes('description') && optimization.after_data.description) {
      updateData.body_html = optimization.after_data.description;
    }
    if (fields.includes('tags') && optimization.after_data.tags) {
      updateData.tags = optimization.after_data.tags.join(', ');
    }

    // Update product in Shopify
    const shopifyUrl = `https://${profile.shopify_shop_domain}/admin/api/2024-01/products/${product.shopify_product_id}.json`;
    const shopifyResponse = await fetch(shopifyUrl, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': profile.shopify_access_token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product: updateData,
      }),
    });

    if (!shopifyResponse.ok) {
      const errorText = await shopifyResponse.text();
      throw new Error(`Shopify API error: ${errorText}`);
    }

    // Update local product
    const localUpdateData: any = {};
    if (fields.includes('title')) localUpdateData.title = optimization.after_data.title;
    if (fields.includes('description')) {
      localUpdateData.description = optimization.after_data.description;
      localUpdateData.body_html = optimization.after_data.description;
    }
    if (fields.includes('tags')) localUpdateData.tags = optimization.after_data.tags;

    await supabaseClient
      .from('products')
      .update(localUpdateData)
      .eq('id', product.id);

    // Mark optimization as applied
    await supabaseClient
      .from('optimizations')
      .update({
        applied: true,
        applied_fields: fields,
        applied_at: new Date().toISOString(),
      })
      .eq('id', optimizationId);

    return new Response(
      JSON.stringify({
        success: true,
        fieldsApplied: fields,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error applying optimization:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
