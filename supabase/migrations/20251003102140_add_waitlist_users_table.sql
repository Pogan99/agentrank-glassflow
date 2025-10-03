-- Create waitlist users table for public beta referrals
CREATE TABLE IF NOT EXISTS public.waitlist_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  referral_code TEXT NOT NULL UNIQUE,
  invited_by TEXT,
  invite_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable row level security so we can scope access explicitly.
ALTER TABLE public.waitlist_users ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public waitlist form).
CREATE POLICY "Allow public insert" ON public.waitlist_users
  FOR INSERT
  USING (true)
  WITH CHECK (true);

-- Allow anonymous updates so we can increment invite counts as referrals join.
CREATE POLICY "Allow public update" ON public.waitlist_users
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow anonymous reads so the client can fetch its referral status.
CREATE POLICY "Allow public select" ON public.waitlist_users
  FOR SELECT
  USING (true);

-- Helpful indexes for lookups by email and referral code.
CREATE INDEX IF NOT EXISTS idx_waitlist_users_email ON public.waitlist_users (email);
CREATE INDEX IF NOT EXISTS idx_waitlist_users_referral_code ON public.waitlist_users (referral_code);
