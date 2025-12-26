-- 1. Drop partial indexes that are incompatible with ON CONFLICT
DROP INDEX IF EXISTS idx_profiles_session_id_unique;
DROP INDEX IF EXISTS idx_memories_profile_id_unique;

-- 2. Create proper UNIQUE CONSTRAINTS that PostgreSQL accepts for ON CONFLICT
ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_session_id_unique UNIQUE (session_id);

ALTER TABLE public.memories 
  ADD CONSTRAINT memories_profile_id_unique UNIQUE (profile_id);