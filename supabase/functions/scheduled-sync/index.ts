// supabase/functions/scheduled-sync/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  const now = new Date()
  
  // Get users due for sync based on their plan
  const { data: users } = await supabase
    .from('user_profiles')
    .select('*')
    .not('shopify_shop_domain', 'is', null)
    .or(`
      and(plan.eq.free,last_sync_at.lt.${new Date(now.getTime() - 24*60*60*1000).toISOString()}),
      and(plan.eq.starter,last_sync_at.lt.${new Date(now.getTime() - 24*60*60*1000).toISOString()}),
      and(plan.eq.pro,last_sync_at.lt.${new Date(now.getTime() - 60*60*1000).toISOString()})
    `)
  
  if (!users) {
    return new Response(JSON.stringify({ success: true, users_synced: 0 }))
  }
  
  for (const user of users) {
    try {
      // Trigger product sync
      await supabase.functions.invoke('import-shopify-products', {
        body: { userId: user.id }
      })
      
      // Update last sync timestamp
      await supabase.from('user_profiles').update({
        last_sync_at: now.toISOString()
      }).eq('id', user.id)
      
    } catch (error) {
      console.error(`Sync failed for user ${user.id}:`, error)
      
      // Create alert
      await supabase.from('alerts').insert({
        user_id: user.id,
        alert_type: 'sync_failed',
        severity: 'error',
        title: 'Sync failed',
        message: 'Unable to sync products from Shopify. Please reconnect your store.',
        action_url: '/dashboard/settings'
      })
    }
  }
  
  return new Response(JSON.stringify({ 
    success: true, 
    users_synced: users.length 
  }))
})