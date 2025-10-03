// supabase/functions/generate-acp-feed/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { userId } = await req.json()
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  // Get user and products
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
  
  if (!products || !profile) {
    return new Response(JSON.stringify({ error: 'No data found' }), { status: 404 })
  }
  
  // Build ACP feed
  const acpFeed: {
    version: string;
    merchant: any;
    products: any[];
  } = {
    version: "1.0",
    merchant: {
      id: userId,
      name: profile.name,
      website: `https://${profile.shopify_shop_domain}`,
      privacy_policy: `https://${profile.shopify_shop_domain}/policies/privacy-policy`,
      terms_of_service: `https://${profile.shopify_shop_domain}/policies/terms-of-service`
    },
    products: []
  }
  
  let includedCount = 0
  let excludedCount = 0
  const validationErrors = []
  
  for (const product of products) {
    // Check minimum requirements
    if (!product.title || !product.description || !product.featured_image || !product.price) {
      excludedCount++
      validationErrors.push({
        product_id: product.id,
        product_title: product.title,
        reasons: [
          !product.title && 'Missing title',
          !product.description && 'Missing description',
          !product.featured_image && 'Missing image',
          !product.price && 'Missing price'
        ].filter(Boolean)
      })
      continue
    }
    
    acpFeed.products.push({
      id: product.shopify_product_id,
      enable_search: true,
      enable_checkout: false, // Shopify handles checkout
      title: product.title,
      description: product.description,
      link: `https://${profile.shopify_shop_domain}/products/${product.handle}`,
      image_link: product.featured_image,
      additional_image_link: product.images?.slice(1).map((img: any) => img.src) || [],
      price: `${product.price} ${product.currency}`,
      availability: product.inventory_quantity > 0 ? 'in_stock' : 'out_of_stock',
      brand: product.vendor || profile.name,
      condition: 'new',
      product_category: product.product_type,
      gtin: product.shopify_variant_id, // fallback
      tags: product.tags || []
    })
    
    includedCount++
  }
  
  // Calculate overall score
  const overallScore = Math.round((includedCount / (includedCount + excludedCount)) * 100)
  
  // Upload feed to Supabase Storage
  const feedJson = JSON.stringify(acpFeed, null, 2)
  const feedPath = `feeds/${userId}/acp-feed.json`
  
  const { data: uploadData } = await supabase.storage
    .from('acp-feeds')
    .upload(feedPath, feedJson, {
      contentType: 'application/json',
      upsert: true
    })
  
  const { data: { publicUrl } } = supabase.storage
    .from('acp-feeds')
    .getPublicUrl(feedPath)
  
  // Save feed metadata
  await supabase.from('acp_feeds').upsert({
    user_id: userId,
    feed_url: publicUrl,
    feed_data: acpFeed,
    products_included: includedCount,
    products_excluded: excludedCount,
    overall_score: overallScore,
    validation_errors: validationErrors,
    last_generated_at: new Date().toISOString(),
    last_validated_at: new Date().toISOString()
  }, {
    onConflict: 'user_id'
  })
  
  // Update product ACP compliance flags
  for (const product of products) {
    const isCompliant = acpFeed.products.some(p => p.id === product.shopify_product_id)
    await supabase.from('products').update({
      acp_compliant: isCompliant,
      acp_score: isCompliant ? 100 : 50
    }).eq('id', product.id)
  }
  
  return new Response(JSON.stringify({
    feed_url: publicUrl,
    products_included: includedCount,
    products_excluded: excludedCount,
    overall_score: overallScore,
    validation_errors: validationErrors
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
})