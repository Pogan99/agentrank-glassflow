-- Create waitlist users table for public beta referrals
CREATE TABLE IF NOT EXISTS public.waitlist_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  referral_code TEXT NOT NULL UNIQUE,
  invited_by TEXT,
  invite_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE public.waitlist_users ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public waitlist form)
CREATE POLICY "Allow public insert" ON public.waitlist_users
  FOR INSERT
  WITH CHECK (true);

-- Allow anonymous updates so we can increment invite counts
CREATE POLICY "Allow public update" ON public.waitlist_users
  FOR UPDATE
  USING (true);

-- Allow anonymous reads so the client can fetch referral status
CREATE POLICY "Allow public select" ON public.waitlist_users
  FOR SELECT
  USING (true);

-- Helpful indexes for lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_users_email ON public.waitlist_users (email);
CREATE INDEX IF NOT EXISTS idx_waitlist_users_referral_code ON public.waitlist_users (referral_code);