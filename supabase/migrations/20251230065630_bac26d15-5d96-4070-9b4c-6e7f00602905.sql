-- Drop existing restrictive policies on profiles
DROP POLICY IF EXISTS "Anyone can create profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can delete own profile" ON profiles;

-- Create new permissive policies for session-based access
CREATE POLICY "Allow insert with session_id" ON profiles
  FOR INSERT WITH CHECK (session_id IS NOT NULL);

CREATE POLICY "Allow select by session_id" ON profiles
  FOR SELECT USING (session_id IS NOT NULL);

CREATE POLICY "Allow update by session_id" ON profiles
  FOR UPDATE USING (session_id IS NOT NULL);

-- Drop existing restrictive policies on memories
DROP POLICY IF EXISTS "Anyone can create memories" ON memories;
DROP POLICY IF EXISTS "Authenticated users can view own memories" ON memories;
DROP POLICY IF EXISTS "Authenticated users can update own memories" ON memories;
DROP POLICY IF EXISTS "Authenticated users can delete own memories" ON memories;

-- Create new permissive policies for memories (linked to profile)
CREATE POLICY "Allow insert memories" ON memories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select memories by profile" ON memories
  FOR SELECT USING (true);

CREATE POLICY "Allow update memories by profile" ON memories
  FOR UPDATE USING (true);