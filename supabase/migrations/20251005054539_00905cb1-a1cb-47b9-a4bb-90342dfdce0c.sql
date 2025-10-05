-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Allow public insert" ON public.waitlist_users;

-- Create a proper public insert policy that allows anyone to insert
CREATE POLICY "Enable public insert for waitlist_users"
  ON public.waitlist_users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);