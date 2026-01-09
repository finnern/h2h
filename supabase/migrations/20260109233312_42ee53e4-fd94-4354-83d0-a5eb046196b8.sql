-- Drop all existing vulnerable RLS policies
DROP POLICY IF EXISTS "Allow select by session_id" ON public.profiles;
DROP POLICY IF EXISTS "Allow update by session_id" ON public.profiles;
DROP POLICY IF EXISTS "Allow insert with session_id" ON public.profiles;

DROP POLICY IF EXISTS "Allow select memories by profile" ON public.memories;
DROP POLICY IF EXISTS "Allow update memories by profile" ON public.memories;
DROP POLICY IF EXISTS "Allow insert memories" ON public.memories;

DROP POLICY IF EXISTS "Allow select orders via profile" ON public.orders;
DROP POLICY IF EXISTS "Allow update orders via profile" ON public.orders;
DROP POLICY IF EXISTS "Allow insert orders via profile" ON public.orders;

-- Create secure RLS policies for profiles table
-- Users can only see their own profile (matched by session_id header)
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (
    session_id = current_setting('request.headers', true)::json->>'x-session-id'
  );

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (
    session_id = current_setting('request.headers', true)::json->>'x-session-id'
  );

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (
    session_id = current_setting('request.headers', true)::json->>'x-session-id'
  );

CREATE POLICY "Users can delete own profile" ON public.profiles
  FOR DELETE USING (
    session_id = current_setting('request.headers', true)::json->>'x-session-id'
  );

-- Create secure RLS policies for memories table
-- Users can only access memories linked to their profile
CREATE POLICY "Users can view own memories" ON public.memories
  FOR SELECT USING (
    profile_id IN (
      SELECT id FROM public.profiles 
      WHERE session_id = current_setting('request.headers', true)::json->>'x-session-id'
    )
  );

CREATE POLICY "Users can insert own memories" ON public.memories
  FOR INSERT WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles 
      WHERE session_id = current_setting('request.headers', true)::json->>'x-session-id'
    )
  );

CREATE POLICY "Users can update own memories" ON public.memories
  FOR UPDATE USING (
    profile_id IN (
      SELECT id FROM public.profiles 
      WHERE session_id = current_setting('request.headers', true)::json->>'x-session-id'
    )
  );

CREATE POLICY "Users can delete own memories" ON public.memories
  FOR DELETE USING (
    profile_id IN (
      SELECT id FROM public.profiles 
      WHERE session_id = current_setting('request.headers', true)::json->>'x-session-id'
    )
  );

-- Create secure RLS policies for orders table
-- Users can only access orders linked to their profile
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (
    profile_id IN (
      SELECT id FROM public.profiles 
      WHERE session_id = current_setting('request.headers', true)::json->>'x-session-id'
    )
  );

CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles 
      WHERE session_id = current_setting('request.headers', true)::json->>'x-session-id'
    )
  );

CREATE POLICY "Users can update own orders" ON public.orders
  FOR UPDATE USING (
    profile_id IN (
      SELECT id FROM public.profiles 
      WHERE session_id = current_setting('request.headers', true)::json->>'x-session-id'
    )
  );

CREATE POLICY "Users can delete own orders" ON public.orders
  FOR DELETE USING (
    profile_id IN (
      SELECT id FROM public.profiles 
      WHERE session_id = current_setting('request.headers', true)::json->>'x-session-id'
    )
  );