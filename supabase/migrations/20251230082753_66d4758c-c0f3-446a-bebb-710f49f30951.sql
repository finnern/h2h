-- Drop existing restrictive RLS policies on orders
DROP POLICY IF EXISTS "Authenticated users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can update own orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can delete own orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- Create new permissive policies for anonymous users using profile_id linked to session_id
-- Allow insert if the profile_id belongs to a profile with a valid session_id
CREATE POLICY "Allow insert orders via profile"
ON public.orders
FOR INSERT
WITH CHECK (
  profile_id IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = profile_id 
    AND profiles.session_id IS NOT NULL
  )
);

-- Allow select for orders linked to profiles with session_id
CREATE POLICY "Allow select orders via profile"
ON public.orders
FOR SELECT
USING (
  profile_id IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = profile_id 
    AND profiles.session_id IS NOT NULL
  )
);

-- Allow update for orders linked to profiles with session_id  
CREATE POLICY "Allow update orders via profile"
ON public.orders
FOR UPDATE
USING (
  profile_id IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = profile_id 
    AND profiles.session_id IS NOT NULL
  )
);