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

  // Wir holen die Session, nutzen aber die DB gerade nicht aktiv zum Schreiben
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
    
    // Sicherheitscheck
    if (!sessionId) {
      throw new Error('Session not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      // --- BYPASS AKTIV ---
      // Wir überspringen das Speichern in Supabase komplett, um den 401 Fehler zu vermeiden.
      console.log("Hertz-Modus: Datenbank übersprungen, sende direkt an n8n...");

      // Wir simulieren ein gespeichertes Profil
      const profile = {
        id: sessionId,
        ...profileData
      };

      // 2. Direktes Senden an n8n (Hertz an Hertz)
      console.log("Rufe n8n Webhook...");
      const response = await fetch('https://finnern.app.n8n.cloud/webhook/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile_id: profile.id,
          session_id: sessionId,
          couple_names: profileData.coupleNames,
          couple_data: coupleData,
          memories: memoriesData,
          history_opt_in: profileData.historyOptIn,
        })
      });

      if (!response.ok) {
        throw new Error(`n8n Verbindung fehlgeschlagen: ${response.status}`);
      }

      const triggerData = await response.json();
      console.log('n8n Antwort erhalten:', triggerData);

      // n8n gibt normalerweise { cards: [...] } zurück oder direkt das Array
      // Wir stellen sicher, dass wir das Format passend zurückgeben
      const n8nCards = triggerData.cards || triggerData;

      return { profile, triggerData, n8nCards };

    } catch (err: any) {
      console.error('Fehler im Hertz-Prozess:', err);
      setError(err.message || 'Ein unbekannter Fehler ist aufgetreten');
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
