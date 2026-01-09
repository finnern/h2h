import { useState, useCallback } from 'react';
import { getSupabaseWithSession, getCurrentSessionId } from '@/lib/supabaseWithSession';

export interface ProfileData {
  coupleNames: string;
  anniversary?: string;
  historyOptIn: boolean;
}

export interface MemoriesData {
  coreEvents?: string;
  sharedValues?: string;
  constraints?: string;
}

export const useProfileData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get session-aware Supabase client and current session ID
  const supabase = getSupabaseWithSession();
  const sessionId = getCurrentSessionId();

  const saveProfileAndTriggerProduction = useCallback(async (
    profileData: ProfileData,
    memoriesData: MemoriesData,
    coupleData: Record<string, unknown>
  ) => {
    if (!sessionId) {
      throw new Error('Session not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Upsert profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert(
          {
            session_id: sessionId,
            couple_names: profileData.coupleNames,
            anniversary: profileData.anniversary || null,
            history_opt_in: profileData.historyOptIn,
            updated_at: new Date().toISOString(),
          },
          { 
            onConflict: 'session_id',
            ignoreDuplicates: false 
          }
        )
        .select()
        .single();

      if (profileError) {
        console.error('Profile upsert error:', profileError);
        throw new Error('Failed to save profile data');
      }

      console.log('Profile saved:', profile);

      // 2. Save memories if opt-in
      if (profileData.historyOptIn && profile) {
        const { error: memoriesError } = await supabase
          .from('memories')
          .upsert(
            {
              profile_id: profile.id,
              core_events: memoriesData.coreEvents || null,
              shared_values: memoriesData.sharedValues || null,
              constraints: memoriesData.constraints || null,
              updated_at: new Date().toISOString(),
            },
            { 
              onConflict: 'profile_id',
              ignoreDuplicates: false 
            }
          );

        if (memoriesError) {
          console.error('Memories upsert error:', memoriesError);
          // Non-blocking - continue even if memories fail
        }
      }

      // 3. Trigger the n8n webhook via edge function
      const { data: triggerData, error: triggerError } = await supabase.functions.invoke(
        'trigger-production',
        {
          body: {
            profile_id: profile?.id,
            couple_data: coupleData,
            memories: memoriesData,
            history_opt_in: profileData.historyOptIn,
          },
        }
      );

      if (triggerError) {
        console.error('Trigger production error:', triggerError);
        // Non-blocking - the local generation can still work
        return { profile, triggerData: null };
      }

      console.log('Production triggered:', triggerData);

      // n8n returns { success: true, data: { cards: [...] } }
      // Extract cards directly - response is already parsed JSON
      const n8nCards = triggerData?.data?.cards || null;
      
      return { profile, triggerData, n8nCards };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  return {
    saveProfileAndTriggerProduction,
    isLoading,
    error,
    sessionId,
  };
};
