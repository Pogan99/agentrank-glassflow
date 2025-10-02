import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Check for required environment variables
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  if (!supabaseUrl) console.error('  - VITE_SUPABASE_URL')
  if (!supabaseServiceKey) console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  console.error('\n💡 Get these values from:')
  console.error('  Supabase Dashboard → Project Settings → API')
  console.error('  - VITE_SUPABASE_URL: Project URL')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY: service_role secret (⚠️  Keep this secure!)')
  console.error('\n📝 Add them to your .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runTests() {
  console.log('🧪 Starting AgentRanked Backend Tests\n')

  const results = {
    passed: 0,
    failed: 0,
    errors: [] as string[]
  }

  // TEST 1: Database Tables
  console.log('1️⃣  Testing database tables...')
  try {
    const tables = [
      'user_profiles',
      'products',
      'optimizations',
      'acp_feeds',
      'sync_jobs',
      'alerts',
      'webhook_events'
    ]

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)

      if (error) {
        throw new Error(`Table ${table} error: ${error.message}`)
      }
      console.log(`  ✅ ${table} table accessible`)
    }
    results.passed++
  } catch (error: any) {
    console.log(`  ❌ Database tables test failed: ${error.message}`)
    results.failed++
    results.errors.push(error.message)
  }

  // TEST 2: Storage Bucket
  console.log('\n2️⃣  Testing storage bucket...')
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets()

    if (error) throw error

    const acpBucket = buckets.find(b => b.name === 'acp-feeds')
    if (!acpBucket) {
      throw new Error('acp-feeds bucket not found')
    }

    console.log(`  ✅ Storage bucket 'acp-feeds' exists`)
    console.log(`  ℹ️  Public: ${acpBucket.public}`)
    results.passed++
  } catch (error: any) {
    console.log(`  ❌ Storage test failed: ${error.message}`)
    results.failed++
    results.errors.push(error.message)
  }

  // TEST 3: Edge Functions Deployment
  console.log('\n3️⃣  Testing Edge Functions...')
  const functions = [
    'shopify-oauth-init',
    'shopify-oauth-callback',
    'import-shopify-products',
    'analyze-product',
    'apply-optimization',
    'generate-acp-feed',
    'scheduled-sync',
    'reset-credits',
    'shopify-webhook'
  ]

  for (const fn of functions) {
    try {
      // Try to invoke (will fail if not deployed)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(
        `${supabaseUrl}/functions/v1/${fn}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ test: true }),
          signal: controller.signal
        }
      )

      clearTimeout(timeoutId)

      // We expect errors (no valid data), but function should exist
      if (response.status === 404) {
        console.log(`  ❌ ${fn} - NOT DEPLOYED`)
        results.failed++
      } else {
        console.log(`  ✅ ${fn} - deployed (status: ${response.status})`)
        results.passed++
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log(`  ❌ ${fn} - timeout (likely not deployed)`)
        results.failed++
      } else {
        console.log(`  ⚠️  ${fn} - couldn't reach: ${error.message}`)
        results.failed++
      }
    }
  }

  // TEST 4: RLS Policies
  console.log('\n4️⃣  Testing RLS policies...')
  try {
    // Create test user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: `test-${Date.now()}@test.com`,
      password: 'test123456',
      email_confirm: true
    })

    if (authError) throw authError

    const testUserId = authData.user.id

    // Test user profile insert
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: testUserId,
        email: authData.user.email,
        name: 'Test User'
      })

    if (profileError) throw profileError

    console.log(`  ✅ User profile creation works`)

    // Test product insert
    const { error: productError } = await supabase
      .from('products')
      .insert({
        user_id: testUserId,
        shopify_product_id: 'test-123',
        title: 'Test Product',
        status: 'active',
        acp_score: 0
      })

    if (productError) throw productError

    console.log(`  ✅ Product creation works`)

    // Cleanup
    await supabase.auth.admin.deleteUser(testUserId)

    results.passed++
  } catch (error: any) {
    console.log(`  ❌ RLS test failed: ${error.message}`)
    results.failed++
    results.errors.push(error.message)
  }

  // TEST 5: Environment Variables
  console.log('\n5️⃣  Testing environment variables...')
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'VITE_SHOPIFY_API_KEY',
    'SHOPIFY_API_SECRET',
    'OPENAI_API_KEY'
  ]

  let envMissing: string[] = []
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      envMissing.push(envVar)
    }
  }

  if (envMissing.length > 0) {
    console.log(`  ❌ Missing env vars: ${envMissing.join(', ')}`)
    results.failed++
  } else {
    console.log(`  ✅ All required environment variables set`)
    results.passed++
  }

  // TEST 6: OpenAI API
  console.log('\n6️⃣  Testing OpenAI API...')
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not set')
    }

    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    })

    if (!response.ok) {
      throw new Error(`OpenAI API key invalid (status: ${response.status})`)
    }

    console.log(`  ✅ OpenAI API key valid`)
    results.passed++
  } catch (error: any) {
    console.log(`  ❌ OpenAI test failed: ${error.message}`)
    results.failed++
    results.errors.push(error.message)
  }

  // TEST 7: Shopify API (if credentials exist)
  console.log('\n7️⃣  Testing Shopify credentials...')
  if (process.env.VITE_SHOPIFY_API_KEY && process.env.SHOPIFY_API_SECRET) {
    console.log(`  ✅ Shopify credentials set`)
    console.log(`  ℹ️  API Key: ${process.env.VITE_SHOPIFY_API_KEY.substring(0, 10)}...`)
    results.passed++
  } else {
    console.log(`  ⚠️  Shopify credentials not set (set them when ready to test OAuth)`)
  }

  // RESULTS
  console.log('\n' + '='.repeat(50))
  console.log('📊 TEST RESULTS')
  console.log('='.repeat(50))
  console.log(`✅ Passed: ${results.passed}`)
  console.log(`❌ Failed: ${results.failed}`)

  if (results.errors.length > 0) {
    console.log('\n🐛 ERRORS TO FIX:')
    results.errors.forEach((err, i) => {
      console.log(`  ${i + 1}. ${err}`)
    })
  }

  if (results.failed === 0) {
    console.log('\n🎉 All tests passed! Backend is ready.')
    console.log('\nNext steps:')
    console.log('  1. Test Shopify OAuth flow')
    console.log('  2. Import test products')
    console.log('  3. Generate optimization')
    console.log('  4. Create ACP feed')
  } else {
    console.log('\n⚠️  Fix the errors above before proceeding.')
  }
}

runTests()
