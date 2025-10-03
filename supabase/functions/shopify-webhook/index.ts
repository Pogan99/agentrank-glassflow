// supabase/functions/shopify-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts"

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  // Verify webhook signature
  const hmac = req.headers.get('X-Shopify-Hmac-Sha256')
  const topic = req.headers.get('X-Shopify-Topic')
  const shop = req.headers.get('X-Shopify-Shop-Domain')
  
  const body = await req.text()
  const hash = createHmac('sha256', Deno.env.get('SHOPIFY_WEBHOOK_SECRET')!)
    .update(body)
    .digest('base64')
  
  if (hash !== hmac) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  const payload = JSON.parse(body)
  
  // Find user by shop domain
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('shopify_shop_domain', shop)
    .single()
  
  if (!profile) {
    return new Response('User not found', { status: 404 })
  }
  
  // Log webhook event
  await supabase.from('webhook_events').insert({
    user_id: profile.id,
    event_type: topic,
    shopify_topic: topic,
    payload
  })
  
  // Handle different webhook types
  switch (topic) {
    case 'products/create':
    case 'products/update':
      await handleProductUpdate(supabase, profile.id, payload)
      break
      
    case 'products/delete':
      await handleProductDelete(supabase, profile.id, payload)
      break
      
    case 'inventory_levels/update':
      await handleInventoryUpdate(supabase, profile.id, payload)
      break
  }
  
  return new Response('OK', { status: 200 })
})

async function handleProductUpdate(supabase: any, userId: string, payload: any) {
  await supabase.from('products').upsert({
    user_id: userId,
    shopify_product_id: payload.id.toString(),
    title: payload.title,
    description: payload.body_html?.replace(/<[^>]*>/g, ''), // strip HTML
    body_html: payload.body_html,
    vendor: payload.vendor,
    product_type: payload.product_type,
    tags: payload.tags.split(',').map((t: string) => t.trim()),
    handle: payload.handle,
    status: payload.status,
    featured_image: payload.image?.src,
    images: payload.images?.map((img: any) => ({ src: img.src, alt: img.alt })),
    price: parseFloat(payload.variants[0]?.price || '0'),
    inventory_quantity: payload.variants[0]?.inventory_quantity || 0,
    last_synced_at: new Date().toISOString()
  }, {
    onConflict: 'user_id,shopify_product_id'
  })
  
  // Trigger feed regeneration
  await supabase.functions.invoke('generate-acp-feed', {
    body: { userId }
  })
}

async function handleProductDelete(supabase: any, userId: string, payload: any) {
  await supabase.from('products')
    .delete()
    .eq('user_id', userId)
    .eq('shopify_product_id', payload.id.toString())
  
  // Trigger feed regeneration
  await supabase.functions.invoke('generate-acp-feed', {
    body: { userId }
  })
}

async function handleInventoryUpdate(supabase: any, userId: string, payload: any) {
  // Update inventory for variant
  await supabase.from('products')
    .update({
      inventory_quantity: payload.available,
      last_synced_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('shopify_variant_id', payload.inventory_item_id.toString())
}