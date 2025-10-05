-- First, let's see what's blocking the insert by checking current policies
-- Drop all INSERT policies completely
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'waitlist_users' 
        AND cmd = 'INSERT'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.waitlist_users', pol.policyname);
    END LOOP;
END $$;

-- Now create a completely open INSERT policy for anonymous and authenticated users
CREATE POLICY "waitlist_open_insert"
ON public.waitlist_users
FOR INSERT
TO public
WITH CHECK (true);