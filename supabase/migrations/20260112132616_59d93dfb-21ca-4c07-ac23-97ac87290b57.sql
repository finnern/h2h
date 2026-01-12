-- Drop existing RESTRICTIVE policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

-- Create new PERMISSIVE policies for profiles (session_id based)
CREATE POLICY "Allow session insert profile" ON profiles
  FOR INSERT TO anon, authenticated
  WITH CHECK (session_id = (current_setting('request.headers', true)::json->>'x-session-id'));

CREATE POLICY "Allow session select profile" ON profiles
  FOR SELECT TO anon, authenticated
  USING (session_id = (current_setting('request.headers', true)::json->>'x-session-id'));

CREATE POLICY "Allow session update profile" ON profiles
  FOR UPDATE TO anon, authenticated
  USING (session_id = (current_setting('request.headers', true)::json->>'x-session-id'));

-- Drop existing RESTRICTIVE policies on memories
DROP POLICY IF EXISTS "Users can view own memories" ON memories;
DROP POLICY IF EXISTS "Users can insert own memories" ON memories;
DROP POLICY IF EXISTS "Users can update own memories" ON memories;
DROP POLICY IF EXISTS "Users can delete own memories" ON memories;

-- Create new PERMISSIVE policies for memories (via profile's session_id)
CREATE POLICY "Allow session insert memories" ON memories
  FOR INSERT TO anon, authenticated
  WITH CHECK (profile_id IN (
    SELECT id FROM profiles 
    WHERE session_id = (current_setting('request.headers', true)::json->>'x-session-id')
  ));

CREATE POLICY "Allow session select memories" ON memories
  FOR SELECT TO anon, authenticated
  USING (profile_id IN (
    SELECT id FROM profiles 
    WHERE session_id = (current_setting('request.headers', true)::json->>'x-session-id')
  ));

CREATE POLICY "Allow session update memories" ON memories
  FOR UPDATE TO anon, authenticated
  USING (profile_id IN (
    SELECT id FROM profiles 
    WHERE session_id = (current_setting('request.headers', true)::json->>'x-session-id')
  ));