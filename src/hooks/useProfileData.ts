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
        console.log("Ignoriere DB-Fehler, weiter gehts zu Hertz:", profileError);
        // NICHT throwen!
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



      // NACHHER (Der direkte Weg zu n8n)
// Wir senden die Daten direkt an n8n, statt über die blockierte Supabase-Funktion
const response = await fetch('https://finnern.app.n8n.cloud/webhook/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    profile_id: profile?.id,
    // Falls n8n mehr Infos braucht (z.B. Sprache), kannst du sie hier hinzufügen:
    // language: "de", 
  })
});

let triggerData = null;
let triggerError = null;

if (response.ok) {
  triggerData = await response.json();
} else {
  triggerError = new Error('n8n Verbindung fehlgeschlagen');
}

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
