-- Drop the insecure public policies
DROP POLICY IF EXISTS "Allow public select" ON public.waitlist_users;
DROP POLICY IF EXISTS "Allow public update" ON public.waitlist_users;

-- Create admin role enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create user_roles table for admin access
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Only admins can manage roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Security definer function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Secure function to validate a referral code exists (without exposing emails)
CREATE OR REPLACE FUNCTION public.validate_referral_code(code text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.waitlist_users
    WHERE referral_code = code
  );
$$;

-- Secure function to check if email already exists
CREATE OR REPLACE FUNCTION public.check_waitlist_email_exists(email_address text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'exists', true,
    'id', id,
    'referral_code', referral_code,
    'invite_count', invite_count
  )
  INTO result
  FROM public.waitlist_users
  WHERE email = email_address;
  
  IF result IS NULL THEN
    result := jsonb_build_object('exists', false);
  END IF;
  
  RETURN result;
END;
$$;

-- Secure function to increment referral count
CREATE OR REPLACE FUNCTION public.increment_referral_count(code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.waitlist_users
  SET invite_count = COALESCE(invite_count, 0) + 1
  WHERE referral_code = code;
END;
$$;

-- Policy: Admins can view all waitlist users
CREATE POLICY "Admins can view all waitlist users"
ON public.waitlist_users
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Admins can update waitlist users
CREATE POLICY "Admins can update waitlist users"
ON public.waitlist_users
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Admins can delete waitlist users
CREATE POLICY "Admins can delete waitlist users"
ON public.waitlist_users
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));