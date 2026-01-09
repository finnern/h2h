import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const SESSION_KEY = 'h2h_session_id';

/**
 * Get or create a session ID for the current browser session.
 * This is stored in localStorage to persist across page reloads.
 */
const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    // Generate a cryptographically secure session ID
    sessionId = `sess_${crypto.randomUUID()}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
};

/**
 * Creates a Supabase client with the session ID included in headers.
 * This is required for RLS policies to validate that users can only
 * access their own data.
 * 
 * The x-session-id header is read by RLS policies using:
 * current_setting('request.headers', true)::json->>'x-session-id'
 */
export const createSupabaseWithSession = (): SupabaseClient<Database> => {
  const sessionId = getOrCreateSessionId();
  
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'x-session-id': sessionId,
      },
    },
  });
};

/**
 * Singleton instance of the Supabase client with session headers.
 * Use this for all database operations that need RLS session validation.
 */
let supabaseWithSessionInstance: SupabaseClient<Database> | null = null;

export const getSupabaseWithSession = (): SupabaseClient<Database> => {
  if (!supabaseWithSessionInstance) {
    supabaseWithSessionInstance = createSupabaseWithSession();
  }
  return supabaseWithSessionInstance;
};

/**
 * Get the current session ID (useful for passing to edge functions)
 */
export const getCurrentSessionId = (): string => {
  return getOrCreateSessionId();
};
