import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Test an Edge Function with a custom payload
 */
export async function testFunction(
  functionName: string,
  payload: any = {},
  options: { verbose?: boolean; headers?: Record<string, string> } = {}
) {
  const { verbose = true, headers = {} } = options

  if (verbose) {
    console.log(`\n🧪 Testing function: ${functionName}`)
    console.log(`📦 Payload:`, JSON.stringify(payload, null, 2))
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/${functionName}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(payload)
      }
    )

    const contentType = response.headers.get('content-type')
    const responseData = contentType?.includes('application/json')
      ? await response.json()
      : await response.text()

    if (verbose) {
      console.log(`✅ Status: ${response.status}`)
      console.log(`📄 Response:`, typeof responseData === 'string'
        ? responseData
        : JSON.stringify(responseData, null, 2)
      )
    }

    return {
      success: response.ok,
      status: response.status,
      data: responseData,
      headers: Object.fromEntries(response.headers.entries())
    }
  } catch (error: any) {
    if (verbose) {
      console.log(`❌ Error:`, error.message)
    }
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Test Shopify OAuth Init
 */
export async function testShopifyOAuthInit(shop: string = 'test-store.myshopify.com') {
  return testFunction('shopify-oauth-init', { shop })
}

/**
 * Test Shopify OAuth Callback
 */
export async function testShopifyOAuthCallback(code: string = 'test-code', shop: string = 'test-store.myshopify.com') {
  return testFunction('shopify-oauth-callback', { code, shop })
}

/**
 * Test Import Shopify Products
 */
export async function testImportShopifyProducts(userId: string) {
  return testFunction('import-shopify-products', { userId })
}

/**
 * Test Analyze Product
 */
export async function testAnalyzeProduct(productId: string) {
  return testFunction('analyze-product', { productId })
}

/**
 * Test Apply Optimization
 */
export async function testApplyOptimization(optimizationId: string) {
  return testFunction('apply-optimization', { optimizationId })
}

/**
 * Test Generate ACP Feed
 */
export async function testGenerateACPFeed(userId: string) {
  return testFunction('generate-acp-feed', { userId })
}

/**
 * Test Scheduled Sync
 */
export async function testScheduledSync() {
  return testFunction('scheduled-sync', {})
}

/**
 * Test Reset Credits
 */
export async function testResetCredits() {
  return testFunction('reset-credits', {})
}

/**
 * Test Shopify Webhook
 */
export async function testShopifyWebhook(topic: string, payload: any) {
  return testFunction('shopify-webhook', payload, {
    headers: {
      'X-Shopify-Topic': topic,
      'X-Shopify-Hmac-Sha256': 'test-hmac',
      'X-Shopify-Shop-Domain': 'test-store.myshopify.com'
    }
  })
}

/**
 * Create a test user for testing
 */
export async function createTestUser(email?: string) {
  const testEmail = email || `test-${Date.now()}@test.com`

  console.log(`\n👤 Creating test user: ${testEmail}`)

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: 'test123456',
    email_confirm: true
  })

  if (authError) {
    console.log(`❌ Failed to create user: ${authError.message}`)
    return null
  }

  const userId = authData.user.id
  console.log(`✅ User created with ID: ${userId}`)

  // Create profile
  const { error: profileError } = await supabase
    .from('user_profiles')
    .insert({
      id: userId,
      email: testEmail,
      name: 'Test User',
      credits_remaining: 20
    })

  if (profileError) {
    console.log(`❌ Failed to create profile: ${profileError.message}`)
    await supabase.auth.admin.deleteUser(userId)
    return null
  }

  console.log(`✅ Profile created`)

  return {
    userId,
    email: testEmail,
    password: 'test123456'
  }
}

/**
 * Create a test product for testing
 */
export async function createTestProduct(userId: string) {
  console.log(`\n📦 Creating test product for user: ${userId}`)

  const { data, error } = await supabase
    .from('products')
    .insert({
      user_id: userId,
      shopify_product_id: `test-${Date.now()}`,
      title: 'Test Product',
      description: 'A test product for testing',
      status: 'active',
      acp_score: 50,
      product_data: {
        variants: [{ id: 1, title: 'Default', price: '29.99' }],
        images: [{ src: 'https://example.com/test.jpg' }]
      }
    })
    .select()
    .single()

  if (error) {
    console.log(`❌ Failed to create product: ${error.message}`)
    return null
  }

  console.log(`✅ Product created with ID: ${data.id}`)
  return data
}

/**
 * Clean up test user and all related data
 */
export async function cleanupTestUser(userId: string) {
  console.log(`\n🧹 Cleaning up test user: ${userId}`)

  // Delete in reverse order of dependencies
  await supabase.from('webhook_events').delete().eq('user_id', userId)
  await supabase.from('alerts').delete().eq('user_id', userId)
  await supabase.from('sync_jobs').delete().eq('user_id', userId)
  await supabase.from('acp_feeds').delete().eq('user_id', userId)
  await supabase.from('optimizations').delete().eq('user_id', userId)
  await supabase.from('products').delete().eq('user_id', userId)
  await supabase.from('user_profiles').delete().eq('id', userId)
  await supabase.auth.admin.deleteUser(userId)

  console.log(`✅ Test user cleaned up`)
}

/**
 * Run a complete integration test flow
 */
export async function runIntegrationTest() {
  console.log('\n🚀 Starting Integration Test Flow\n')
  console.log('=' .repeat(50))

  // 1. Create test user
  const user = await createTestUser()
  if (!user) {
    console.log('\n❌ Integration test failed: Could not create user')
    return
  }

  try {
    // 2. Create test product
    const product = await createTestProduct(user.userId)
    if (!product) {
      console.log('\n❌ Integration test failed: Could not create product')
      return
    }

    // 3. Test analyze product
    console.log('\n📊 Testing product analysis...')
    const analyzeResult = await testAnalyzeProduct(product.id)

    // 4. Test ACP feed generation
    console.log('\n📝 Testing ACP feed generation...')
    const feedResult = await testGenerateACPFeed(user.userId)

    // 5. Summary
    console.log('\n' + '='.repeat(50))
    console.log('📊 Integration Test Summary')
    console.log('='.repeat(50))
    console.log(`✅ User created: ${user.email}`)
    console.log(`✅ Product created: ${product.title}`)
    console.log(`${analyzeResult.success ? '✅' : '❌'} Product analysis: ${analyzeResult.status}`)
    console.log(`${feedResult.success ? '✅' : '❌'} Feed generation: ${feedResult.status}`)

  } finally {
    // Cleanup
    await cleanupTestUser(user.userId)
  }
}

/**
 * Check all Edge Functions deployment status
 */
export async function checkFunctionsDeployment() {
  console.log('\n🔍 Checking Edge Functions Deployment\n')
  console.log('=' .repeat(50))

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

  const results = []

  for (const fn of functions) {
    const result = await testFunction(fn, { test: true }, { verbose: false })
    const deployed = result.status !== 404
    results.push({ name: fn, deployed, status: result.status })

    console.log(`${deployed ? '✅' : '❌'} ${fn.padEnd(30)} - ${result.status || 'unreachable'}`)
  }

  const deployedCount = results.filter(r => r.deployed).length
  console.log('\n' + '='.repeat(50))
  console.log(`📊 Deployed: ${deployedCount}/${functions.length} functions`)

  return results
}

// CLI Usage
if (import.meta.main) {
  const command = Deno.args[0]

  switch (command) {
    case 'check':
      await checkFunctionsDeployment()
      break
    case 'integration':
      await runIntegrationTest()
      break
    case 'test':
      const functionName = Deno.args[1]
      const payload = Deno.args[2] ? JSON.parse(Deno.args[2]) : {}
      await testFunction(functionName, payload)
      break
    default:
      console.log(`
Usage:
  deno run --allow-net --allow-env debug-functions.ts <command>

Commands:
  check                     - Check all Edge Functions deployment status
  integration              - Run complete integration test
  test <function> [payload] - Test specific function with optional payload

Examples:
  deno run --allow-net --allow-env debug-functions.ts check
  deno run --allow-net --allow-env debug-functions.ts integration
  deno run --allow-net --allow-env debug-functions.ts test analyze-product '{"productId":"123"}'
      `)
  }
}
