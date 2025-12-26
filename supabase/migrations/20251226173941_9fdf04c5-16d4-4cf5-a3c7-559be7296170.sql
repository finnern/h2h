-- Add DELETE policies for profiles, memories, and orders tables
-- These match the existing SELECT/UPDATE policy patterns

-- DELETE policy for profiles
CREATE POLICY "Users can delete own profile" ON public.profiles
  FOR DELETE USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- DELETE policy for memories
CREATE POLICY "Users can delete own memories" ON public.memories
  FOR DELETE USING (
    profile_id IN (
      SELECT id FROM public.profiles 
      WHERE (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
            (auth.uid() IS NULL AND session_id IS NOT NULL)
    )
  );

-- DELETE policy for orders
CREATE POLICY "Users can delete own orders" ON public.orders
  FOR DELETE USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (profile_id IN (SELECT id FROM public.profiles WHERE session_id IS NOT NULL))
  );