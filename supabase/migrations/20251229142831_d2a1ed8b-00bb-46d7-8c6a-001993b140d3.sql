-- Fix: Remove vulnerable session-based SELECT policies that allow public data exposure
-- The current policies check "session_id IS NOT NULL" which allows ANY anonymous user 
-- to read ALL records where session_id exists (RLS cannot access client-side localStorage)

-- Drop vulnerable SELECT policies for profiles
DROP POLICY IF EXISTS "Session users can view own profile" ON public.profiles;

-- Drop vulnerable SELECT policies for memories  
DROP POLICY IF EXISTS "Session users can view own memories" ON public.memories;

-- Drop vulnerable SELECT policies for orders
DROP POLICY IF EXISTS "Session users can view own orders" ON public.orders;

-- Also drop the vulnerable UPDATE and DELETE policies since they have the same issue
-- (allows operating on ANY record where session_id IS NOT NULL)
DROP POLICY IF EXISTS "Session users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Session users can delete own profile" ON public.profiles;
DROP POLICY IF EXISTS "Session users can update own memories" ON public.memories;
DROP POLICY IF EXISTS "Session users can delete own memories" ON public.memories;
DROP POLICY IF EXISTS "Session users can update own orders" ON public.orders;
DROP POLICY IF EXISTS "Session users can delete own orders" ON public.orders;