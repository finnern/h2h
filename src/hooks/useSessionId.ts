import { useState, useEffect } from 'react';

const SESSION_KEY = 'h2h_session_id';

const generateSessionId = (): string => {
  // Use cryptographically secure random UUID instead of predictable Math.random()
  return `sess_${crypto.randomUUID()}`;
};

export const useSessionId = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    let storedSessionId = localStorage.getItem(SESSION_KEY);
    
    if (!storedSessionId) {
      storedSessionId = generateSessionId();
      localStorage.setItem(SESSION_KEY, storedSessionId);
    }
    
    setSessionId(storedSessionId);
  }, []);

  return sessionId;
};
