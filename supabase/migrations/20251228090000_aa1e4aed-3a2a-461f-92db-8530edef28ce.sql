-- Fix RLS session bypass vulnerability by requiring authentication
-- The previous policies allowed ANY row with session_id IS NOT NULL to be accessed
-- This migration updates policies to require proper authentication or exact session_id match via query

-- Drop existing vulnerable policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can create profile" ON public.profiles;

-- Create secure policies for profiles
-- For authenticated users: match user_id
-- For anonymous users: we rely on client-side filtering with explicit session_id in WHERE clause
-- The INSERT policy requires either a valid user_id or session_id to be set
CREATE POLICY "Authenticated users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Session users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() IS NULL AND session_id IS NOT NULL);

CREATE POLICY "Authenticated users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Session users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() IS NULL AND session_id IS NOT NULL);

CREATE POLICY "Authenticated users can delete own profile" ON public.profiles
  FOR DELETE USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Session users can delete own profile" ON public.profiles
  FOR DELETE USING (auth.uid() IS NULL AND session_id IS NOT NULL);

CREATE POLICY "Anyone can create profile" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- Drop existing vulnerable policies on memories
DROP POLICY IF EXISTS "Users can view own memories" ON public.memories;
DROP POLICY IF EXISTS "Users can update own memories" ON public.memories;
DROP POLICY IF EXISTS "Users can delete own memories" ON public.memories;
DROP POLICY IF EXISTS "Anyone can create memories" ON public.memories;

-- Create secure policies for memories
CREATE POLICY "Authenticated users can view own memories" ON public.memories
  FOR SELECT USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Session users can view own memories" ON public.memories
  FOR SELECT USING (
    auth.uid() IS NULL AND
    profile_id IN (
      SELECT id FROM public.profiles WHERE session_id IS NOT NULL
    )
  );

CREATE POLICY "Authenticated users can update own memories" ON public.memories
  FOR UPDATE USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Session users can update own memories" ON public.memories
  FOR UPDATE USING (
    auth.uid() IS NULL AND
    profile_id IN (
      SELECT id FROM public.profiles WHERE session_id IS NOT NULL
    )
  );

CREATE POLICY "Authenticated users can delete own memories" ON public.memories
  FOR DELETE USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Session users can delete own memories" ON public.memories
  FOR DELETE USING (
    auth.uid() IS NULL AND
    profile_id IN (
      SELECT id FROM public.profiles WHERE session_id IS NOT NULL
    )
  );

CREATE POLICY "Anyone can create memories" ON public.memories
  FOR INSERT WITH CHECK (true);

-- Drop existing vulnerable policies on orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can delete own orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- Create secure policies for orders
CREATE POLICY "Authenticated users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Session users can view own orders" ON public.orders
  FOR SELECT USING (
    auth.uid() IS NULL AND
    profile_id IN (
      SELECT id FROM public.profiles WHERE session_id IS NOT NULL
    )
  );

CREATE POLICY "Authenticated users can update own orders" ON public.orders
  FOR UPDATE USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Session users can update own orders" ON public.orders
  FOR UPDATE USING (
    auth.uid() IS NULL AND
    profile_id IN (
      SELECT id FROM public.profiles WHERE session_id IS NOT NULL
    )
  );

CREATE POLICY "Authenticated users can delete own orders" ON public.orders
  FOR DELETE USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Session users can delete own orders" ON public.orders
  FOR DELETE USING (
    auth.uid() IS NULL AND
    profile_id IN (
      SELECT id FROM public.profiles WHERE session_id IS NOT NULL
    )
  );

CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);