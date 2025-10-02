-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro')),
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  stripe_customer_id TEXT,
  
  -- Shopify connection
  shopify_shop_domain TEXT UNIQUE,
  shopify_access_token TEXT,
  shopify_scope TEXT,
  
  -- Usage tracking
  optimization_credits_used INTEGER DEFAULT 0,
  optimization_credits_limit INTEGER DEFAULT 30,
  credits_reset_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 day',
  
  -- Status
  onboarding_completed BOOLEAN DEFAULT FALSE,
  last_sync_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shopify products cache
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  
  shopify_product_id TEXT NOT NULL,
  shopify_variant_id TEXT,
  
  title TEXT NOT NULL,
  description TEXT,
  body_html TEXT,
  vendor TEXT,
  product_type TEXT,
  tags TEXT[],
  
  price NUMERIC(10,2),
  compare_at_price NUMERIC(10,2),
  currency TEXT DEFAULT 'USD',
  
  inventory_quantity INTEGER DEFAULT 0,
  inventory_policy TEXT,
  
  images JSONB,
  featured_image TEXT,
  
  seo_title TEXT,
  seo_description TEXT,
  handle TEXT,
  
  status TEXT CHECK (status IN ('active', 'draft', 'archived')),
  published_at TIMESTAMPTZ,
  
  acp_compliant BOOLEAN DEFAULT FALSE,
  acp_score INTEGER DEFAULT 0,
  missing_fields TEXT[],
  
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, shopify_product_id)
);

CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_acp_compliant ON products(acp_compliant);
CREATE INDEX idx_products_status ON products(status);

-- Optimization suggestions
CREATE TABLE optimizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  
  before_data JSONB NOT NULL,
  after_data JSONB NOT NULL,
  
  reasoning JSONB,
  image_analysis JSONB,
  confidence_scores JSONB,
  
  applied BOOLEAN DEFAULT FALSE,
  applied_fields TEXT[],
  applied_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_optimizations_user_product ON optimizations(user_id, product_id);
CREATE INDEX idx_optimizations_applied ON optimizations(applied);

-- ACP feeds
CREATE TABLE acp_feeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  
  feed_url TEXT NOT NULL,
  feed_data JSONB NOT NULL,
  
  products_included INTEGER DEFAULT 0,
  products_excluded INTEGER DEFAULT 0,
  overall_score INTEGER DEFAULT 0,
  
  validation_errors JSONB,
  validation_warnings JSONB,
  
  last_generated_at TIMESTAMPTZ DEFAULT NOW(),
  last_validated_at TIMESTAMPTZ,
  next_sync_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Sync jobs
CREATE TABLE sync_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  
  job_type TEXT CHECK (job_type IN ('product_import', 'feed_generation', 'scheduled_sync')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  
  total_items INTEGER DEFAULT 0,
  processed_items INTEGER DEFAULT 0,
  
  result_data JSONB,
  error_message TEXT,
  
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sync_jobs_user_status ON sync_jobs(user_id, status);

-- Alerts
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  
  alert_type TEXT CHECK (alert_type IN ('sync_failed', 'validation_error', 'credit_limit', 'feed_issue')),
  severity TEXT CHECK (severity IN ('info', 'warning', 'error')),
  
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  
  products_affected UUID[],
  
  read BOOLEAN DEFAULT FALSE,
  dismissed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_user_read ON alerts(user_id, read);

-- Webhook events
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  event_type TEXT NOT NULL,
  shopify_topic TEXT NOT NULL,
  payload JSONB NOT NULL,
  
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_webhook_events_processed ON webhook_events(processed, created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for products table
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_profiles table
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE acp_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Products policies
CREATE POLICY "Users can view own products"
  ON products FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  USING (auth.uid() = user_id);

-- Optimizations policies
CREATE POLICY "Users can view own optimizations"
  ON optimizations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own optimizations"
  ON optimizations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own optimizations"
  ON optimizations FOR UPDATE
  USING (auth.uid() = user_id);

-- ACP feeds policies
CREATE POLICY "Users can view own feed"
  ON acp_feeds FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feed"
  ON acp_feeds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feed"
  ON acp_feeds FOR UPDATE
  USING (auth.uid() = user_id);

-- Sync jobs policies
CREATE POLICY "Users can view own sync jobs"
  ON sync_jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sync jobs"
  ON sync_jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Alerts policies
CREATE POLICY "Users can view own alerts"
  ON alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts"
  ON alerts FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts"
  ON alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Webhook events policies (allow service to insert)
CREATE POLICY "Service can insert webhooks"
  ON webhook_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own webhooks"
  ON webhook_events FOR SELECT
  USING (auth.uid() = user_id);

-- Create storage bucket for ACP feeds
INSERT INTO storage.buckets (id, name, public)
VALUES ('acp-feeds', 'acp-feeds', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own feeds
CREATE POLICY "Users can upload own feeds"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'acp-feeds' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public read access
CREATE POLICY "Public can read feeds"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'acp-feeds');

-- Allow users to update their own feeds
CREATE POLICY "Users can update own feeds"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'acp-feeds' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own feeds
CREATE POLICY "Users can delete own feeds"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'acp-feeds' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );