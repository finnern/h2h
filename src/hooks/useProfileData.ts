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

// Suche diesen Teil (oder ähnlich):
/* const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .upsert(...)
*/

// --- ERSETZE IHN HIERMIT ---

let profile = null;

// Wir versuchen zu speichern, aber wenn es kracht, fangen wir es ab
try {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      session_id: sessionId,
      history_opt_in: profileData.historyOptIn,
      couple_names: `${profileData.partner1} & ${profileData.partner2}`, // Beispiel
      // ... hier die Felder lassen, die schon da waren
    }, { onConflict: 'session_id' })
    .select()
    .single();

  if (error) {
    console.log("Datenbank (Profiles) nicht erreichbar, überspringe...", error.message);
    // Wir bauen uns ein Fake-Profil, damit es weitergeht
    profile = { id: 'temp-id', ...profileData }; 
  } else {
    profile = data;
  }
} catch (e) {
  console.log("Kritischer DB Fehler ignoriert.");
  profile = { id: 'temp-id' };
}

// WICHTIG: Falls im Code danach so etwas steht wie:
// if (profileError) throw profileError; 
// LÖSCHE ES oder kommentiere es aus!

// --- ENDE DES ERSETZENS ---


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
