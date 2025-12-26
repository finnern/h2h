-- Create profiles table with session tracking support
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  couple_names TEXT,
  anniversary DATE,
  history_opt_in BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT profiles_identifier_check CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- Create memories table linked to profiles
CREATE TABLE public.memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  core_events TEXT,
  shared_values TEXT,
  constraints TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table to track deck requests
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Profiles policies: users can manage their own data OR by session_id
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Anyone can create profile" ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- Memories policies
CREATE POLICY "Users can view own memories" ON public.memories
  FOR SELECT USING (
    profile_id IN (
      SELECT id FROM public.profiles 
      WHERE (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
            (auth.uid() IS NULL AND session_id IS NOT NULL)
    )
  );

CREATE POLICY "Anyone can create memories" ON public.memories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own memories" ON public.memories
  FOR UPDATE USING (
    profile_id IN (
      SELECT id FROM public.profiles 
      WHERE (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
            (auth.uid() IS NULL AND session_id IS NOT NULL)
    )
  );

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (profile_id IN (SELECT id FROM public.profiles WHERE session_id IS NOT NULL))
  );

CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own orders" ON public.orders
  FOR UPDATE USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (profile_id IN (SELECT id FROM public.profiles WHERE session_id IS NOT NULL))
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_memories_updated_at
  BEFORE UPDATE ON public.memories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_session_id ON public.profiles(session_id);
CREATE INDEX idx_memories_profile_id ON public.memories(profile_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_profile_id ON public.orders(profile_id);