// supabase/functions/apply-optimization/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { optimizationId, selectedFields, userId } = await req.json()
  // selectedFields = ['title', 'description', 'tags']
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  // Check credits
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('optimization_credits_used, optimization_credits_limit, shopify_shop_domain, shopify_access_token')
    .eq('id', userId)
    .single()
  
  if (!profile) {
    return new Response(JSON.stringify({ error: 'Profile not found' }), { status: 404 })
  }
  
  if (profile.optimization_credits_used >= profile.optimization_credits_limit) {
    return new Response(JSON.stringify({
      error: 'Optimization limit reached. Upgrade your plan.'
    }), { status: 429 })
  }
  
  // Get optimization
  const { data: optimization } = await supabase
    .from('optimizations')
    .select('*, products(*)')
    .eq('id', optimizationId)
    .single()
  
  const product = optimization.products
  
  // Build update payload for Shopify
  const updateData: any = {}
  
  if (selectedFields.includes('title')) {
    updateData.title = optimization.after_data.title
  }
  if (selectedFields.includes('description')) {
    updateData.body_html = `<p>${optimization.after_data.description.replace(/\n/g, '</p><p>')}</p>`
  }
  if (selectedFields.includes('tags')) {
    updateData.tags = optimization.after_data.tags.join(',')
  }
  if (selectedFields.includes('brand') && optimization.after_data.brand) {
    updateData.vendor = optimization.after_data.brand
  }
  
  // Push to Shopify
  const shopifyResponse = await fetch(
    `https://${profile.shopify_shop_domain}/admin/api/2024-01/products/${product.shopify_product_id}.json`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': profile.shopify_access_token
      },
      body: JSON.stringify({ product: updateData })
    }
  )
  
  if (!shopifyResponse.ok) {
    throw new Error('Failed to update Shopify product')
  }
  
  // Update local database
  await supabase.from('products').update({
    ...updateData,
    updated_at: new Date().toISOString()
  }).eq('id', product.id)
  
  // Mark optimization applied
  await supabase.from('optimizations').update({
    applied: true,
    applied_fields: selectedFields,
    applied_at: new Date().toISOString()
  }).eq('id', optimizationId)
  
  // Increment credit usage
  await supabase.from('user_profiles').update({
    optimization_credits_used: profile.optimization_credits_used + 1
  }).eq('id', userId)
  
  // Trigger feed regeneration
  await supabase.functions.invoke('generate-acp-feed', {
    body: { userId }
  })
  
  return new Response(JSON.stringify({ success: true }))
})