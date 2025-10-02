// supabase/functions/shopify-oauth-callback/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const shop = url.searchParams.get('shop')
  const state = url.searchParams.get('state')
  
  // Verify state/nonce
  
  // Exchange code for access token
  const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: Deno.env.get('SHOPIFY_API_KEY'),
      client_secret: Deno.env.get('SHOPIFY_API_SECRET'),
      code
    })
  })
  
  const { access_token, scope } = await tokenResponse.json()
  
  // Get user ID from session
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY')
  )
  
  const { data: { user } } = await supabase.auth.getUser(req.headers.get('Authorization'))
  
  // Save to database
  await supabase.from('user_profiles').upsert({
    id: user.id,
    shopify_shop_domain: shop,
    shopify_access_token: access_token,
    shopify_scope: scope
  })
  
  // Trigger product import job
  await supabase.functions.invoke('import-shopify-products', {
    body: { userId: user.id }
  })
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})