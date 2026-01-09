import { useState, useEffect } from 'react';
import { getCurrentSessionId } from '@/lib/supabaseWithSession';

const SESSION_KEY = 'h2h_session_id';

const generateSessionId = (): string => {
  // Use cryptographically secure random UUID instead of predictable Math.random()
  return `sess_${crypto.randomUUID()}`;
};

export const useSessionId = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Use the centralized session ID from supabaseWithSession
    // This ensures the same session ID is used for RLS validation
    const currentSessionId = getCurrentSessionId();
    setSessionId(currentSessionId);
  }, []);

  return sessionId;
};
