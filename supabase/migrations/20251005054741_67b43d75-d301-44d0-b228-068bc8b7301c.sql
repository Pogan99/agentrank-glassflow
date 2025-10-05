-- Drop ALL existing INSERT policies on waitlist_users
DROP POLICY IF EXISTS "Allow public insert" ON public.waitlist_users;
DROP POLICY IF EXISTS "Enable public insert for waitlist_users" ON public.waitlist_users;

-- Create a simple, permissive INSERT policy that allows anyone (including anonymous users)
CREATE POLICY "waitlist_users_public_insert_policy"
  ON public.waitlist_users
  AS PERMISSIVE
  FOR INSERT
  WITH CHECK (true);