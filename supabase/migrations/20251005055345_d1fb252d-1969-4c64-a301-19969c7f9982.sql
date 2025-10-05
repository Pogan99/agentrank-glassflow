-- Completely disable RLS temporarily to test, then re-enable with proper policies
ALTER TABLE public.waitlist_users DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.waitlist_users ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'waitlist_users'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.waitlist_users', pol.policyname);
    END LOOP;
END $$;

-- Create INSERT policy that explicitly allows anonymous and authenticated users
CREATE POLICY "Enable insert for anon and authenticated users"
ON public.waitlist_users
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create SELECT policy for admins only
CREATE POLICY "Enable read access for admins"
ON public.waitlist_users
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create UPDATE policy for admins only
CREATE POLICY "Enable update for admins"
ON public.waitlist_users
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create DELETE policy for admins only
CREATE POLICY "Enable delete for admins"
ON public.waitlist_users
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));