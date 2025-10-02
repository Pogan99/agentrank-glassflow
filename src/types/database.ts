export type UserPlan = 'free' | 'starter' | 'pro';
export type BillingCycle = 'monthly' | 'yearly';
export type ProductStatus = 'active' | 'draft' | 'archived';
export type JobType = 'product_import' | 'feed_generation' | 'scheduled_sync';
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';
export type AlertType = 'sync_failed' | 'validation_error' | 'credit_limit' | 'feed_issue';
export type AlertSeverity = 'info' | 'warning' | 'error';

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  plan: UserPlan;
  billing_cycle: BillingCycle;
  stripe_customer_id: string | null;
  
  // Shopify connection
  shopify_shop_domain: string | null;
  shopify_access_token: string | null;
  shopify_scope: string | null;
  
  // Usage tracking
  optimization_credits_used: number;
  optimization_credits_limit: number;
  credits_reset_at: string;
  
  // Status
  onboarding_completed: boolean;
  last_sync_at: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  
  shopify_product_id: string;
  shopify_variant_id: string | null;
  
  title: string;
  description: string | null;
  body_html: string | null;
  vendor: string | null;
  product_type: string | null;
  tags: string[];
  
  price: number | null;
  compare_at_price: number | null;
  currency: string;
  
  inventory_quantity: number;
  inventory_policy: string | null;
  
  images: Record<string, any> | null;
  featured_image: string | null;
  
  seo_title: string | null;
  seo_description: string | null;
  handle: string | null;
  
  status: ProductStatus | null;
  published_at: string | null;
  
  acp_compliant: boolean;
  acp_score: number;
  missing_fields: string[];
  
  last_synced_at: string;
  created_at: string;
  updated_at: string;
}

export interface Optimization {
  id: string;
  user_id: string;
  product_id: string;
  
  before_data: Record<string, any>;
  after_data: Record<string, any>;
  
  reasoning: Record<string, any> | null;
  image_analysis: Record<string, any> | null;
  confidence_scores: Record<string, any> | null;
  
  applied: boolean;
  applied_fields: string[] | null;
  applied_at: string | null;
  
  created_at: string;
}

export interface ACPFeed {
  id: string;
  user_id: string;
  
  feed_url: string;
  feed_data: Record<string, any>;
  
  products_included: number;
  products_excluded: number;
  overall_score: number;
  
  validation_errors: Record<string, any> | null;
  validation_warnings: Record<string, any> | null;
  
  last_generated_at: string;
  last_validated_at: string | null;
  next_sync_at: string | null;
  
  created_at: string;
}

export interface SyncJob {
  id: string;
  user_id: string;
  
  job_type: JobType;
  status: JobStatus;
  
  total_items: number;
  processed_items: number;
  
  result_data: Record<string, any> | null;
  error_message: string | null;
  
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  
  alert_type: AlertType;
  severity: AlertSeverity;
  
  title: string;
  message: string;
  action_url: string | null;
  
  products_affected: string[] | null;
  
  read: boolean;
  dismissed: boolean;
  
  created_at: string;
}

export interface WebhookEvent {
  id: string;
  user_id: string | null;
  
  event_type: string;
  shopify_topic: string;
  payload: Record<string, any>;
  
  processed: boolean;
  processed_at: string | null;
  error_message: string | null;
  
  created_at: string;
}
