import { useState, useCallback } from 'react';
import { getSupabaseWithSession, getCurrentSessionId } from '@/lib/supabaseWithSession';

export interface ProfileData {
  coupleNames: string;
  anniversary?: string;
  historyOptIn: boolean;
  partner1?: string;
  partner2?: string;
}

export interface MemoriesData {
  coreEvents?: string;
  sharedValues?: string;
  constraints?: string;
}

export const useProfileData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabaseWithSession();
  const sessionId = getCurrentSessionId();

  const saveProfileAndTriggerProduction = useCallback(async ({
    profileData,
    memoriesData,
    coupleData
  }: {
    profileData: ProfileData;
    memoriesData: MemoriesData;
    coupleData: Record<string, unknown>;
  }) => {
    
    if (!sessionId) {
      throw new Error('Session not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, ensure profile exists in database for session validation
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('session_id', sessionId)
        .maybeSingle();

      let profileId: string;

      if (existingProfile) {
        profileId = existingProfile.id;
        // Update existing profile
        await supabase
          .from('profiles')
          .update({
            couple_names: profileData.coupleNames,
            anniversary: profileData.anniversary || null,
            history_opt_in: profileData.historyOptIn,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profileId);
      } else {
        // Create new profile with session_id
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            session_id: sessionId,
            couple_names: profileData.coupleNames,
            anniversary: profileData.anniversary || null,
            history_opt_in: profileData.historyOptIn,
          })
          .select('id')
          .single();

        if (insertError || !newProfile) {
          throw new Error('Failed to create profile');
        }
        profileId = newProfile.id;
      }

      // Call the Edge Function instead of direct n8n webhook
      const { data: triggerData, error: triggerError } = await supabase.functions.invoke('trigger-production', {
        body: {
          profile_id: profileId,
          session_id: sessionId,
          couple_names: profileData.coupleNames,
          couple_data: coupleData,
          memories: memoriesData,
          history_opt_in: profileData.historyOptIn,
        }
      });

      if (triggerError) {
        throw new Error(triggerError.message || 'Processing failed');
      }

      // Extract cards from response
      const n8nCards = triggerData?.data?.cards || triggerData?.cards || triggerData;

      return { 
        profile: { id: profileId, ...profileData }, 
        triggerData, 
        n8nCards 
      };

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error in production trigger:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, supabase]);

  return {
    saveProfileAndTriggerProduction,
    isLoading,
    error
  };
};
