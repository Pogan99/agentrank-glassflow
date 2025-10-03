// supabase/functions/reset-credits/index.ts
// Run daily at midnight
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  const now = new Date()
  
  // Reset credits for users whose reset date has passed
  await supabase.from('user_profiles')
    .update({
      optimization_credits_used: 0,
      credits_reset_at: new Date(now.getTime() + 24*60*60*1000).toISOString()
    })
    .lt('credits_reset_at', now.toISOString())
  
  return new Response(JSON.stringify({ success: true }))
})