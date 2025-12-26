-- Add unique constraint on session_id for upsert support
CREATE UNIQUE INDEX idx_profiles_session_id_unique ON public.profiles(session_id) WHERE session_id IS NOT NULL;

-- Add unique constraint on profile_id for memories upsert
CREATE UNIQUE INDEX idx_memories_profile_id_unique ON public.memories(profile_id);