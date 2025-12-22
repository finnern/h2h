import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "de";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    "header.tagline": "The Sync Engine for Couples",
    
    // Tuner Section
    "tuner.title": "The Tuner",
    "tuner.subtitle": "Tune your frequency to sync your hearts",
    "tuner.partnerA": "Partner A",
    "tuner.partnerB": "Partner B",
    "tuner.enterName": "Enter name...",
    "tuner.lifecycle": "Relationship Lifecycle",
    "tuner.selectPhase": "Select your phase...",
    "tuner.lifecycle.freshSpark": "Fresh Spark (0-2y)",
    "tuner.lifecycle.deepGroove": "Deep Groove (3-7y)",
    "tuner.lifecycle.vintageGold": "Vintage Gold (8y+)",
    "tuner.lifecycle.navigatingStorms": "Navigating Storms",
    "tuner.frequency": "Frequency",
    "tuner.scientific": "Scientific",
    "tuner.spiritual": "Spiritual",
    "tuner.roots": "Where are your roots?",
    "tuner.rootsPlaceholder": "e.g., Swabian, Berlin, USA/German mix...",
    "tuner.season": "What season are you navigating together?",
    "tuner.seasonPlaceholder": "e.g., New baby, career shift, moving...",
    "tuner.insights": "What else do you feel comfortable sharing with us to dial in the questions even closer to your situation?",
    "tuner.insightsPlaceholder": "Share anything that might help us understand your unique journey together...",
    "tuner.syncing": "Syncing...",
    "tuner.generate": "SYNC / GENERATE DECK",
    
    // Card Grid
    "cards.personalized": "Your Personalized Deck",
    "cards.sample": "Sample the Experience",
    "cards.personalizedDesc": "Review your cards and share your feedback",
    "cards.sampleDesc": "Click any card to flip and explore both sides",
    
    // Card Footer
    "card.passOk": "Pass/Not today is OK.",
    "card.remember": "What do we want to remember from this?",
    
    // Conversion Footer
    "footer.sampleTitle": "This was just a 4-card sample",
    "footer.sampleDesc": "The full ritual is 52 cards—one for every date night of the year. A premium physical deck, personalized to your journey together.",
    "footer.cards": "52 cards",
    "footer.reserveTitle": "Reserve First Batch",
    "footer.reservePrice": "€5 Priority Down Payment",
    "footer.reserved": "Reserved!",
    "footer.secureBtn": "Secure My Deck",
    "footer.vipAccess": "VIP access to launch & exclusive content",
    "footer.notifyTitle": "Notify Me",
    "footer.notifyDesc": "Join the waitlist for updates",
    "footer.onList": "You're on the list!",
    "footer.joinWaitlist": "Join Waitlist",
    "footer.emailPlaceholder": "your@email.com",
    
    // Toasts
    "toast.reserved": "Reserved! 🎉",
    "toast.reservedDesc": "You're on the priority list for the first batch.",
    "toast.joined": "You're on the list!",
    "toast.joinedDesc": "We'll notify you when Hertz an Hertz launches.",
    
    // Accordions
    "accordion.about": "About / How to Play",
    "accordion.tuner": "⚡️ Tune Frequency",
  },
  de: {
    // Header
    "header.tagline": "Die Synchronisations-Engine für Paare",
    
    // Tuner Section
    "tuner.title": "Der Tuner",
    "tuner.subtitle": "Stimme deine Frequenz ab, um eure Herzen zu synchronisieren",
    "tuner.partnerA": "Partner A",
    "tuner.partnerB": "Partner B",
    "tuner.enterName": "Name eingeben...",
    "tuner.lifecycle": "Beziehungsphase",
    "tuner.selectPhase": "Wähle eure Phase...",
    "tuner.lifecycle.freshSpark": "Frischer Funke (0-2 Jahre)",
    "tuner.lifecycle.deepGroove": "Tiefe Verbindung (3-7 Jahre)",
    "tuner.lifecycle.vintageGold": "Goldene Jahre (8+)",
    "tuner.lifecycle.navigatingStorms": "Durch Stürme navigieren",
    "tuner.frequency": "Frequenz",
    "tuner.scientific": "Wissenschaftlich",
    "tuner.spiritual": "Spirituell",
    "tuner.roots": "Wo sind eure Wurzeln?",
    "tuner.rootsPlaceholder": "z.B. Schwäbisch, Berlin, USA/Deutsch gemischt...",
    "tuner.season": "Welche Jahreszeit durchlebt ihr gerade gemeinsam?",
    "tuner.seasonPlaceholder": "z.B. Neues Baby, Karrierewechsel, Umzug...",
    "tuner.insights": "Was möchtet ihr noch mit uns teilen, damit wir die Fragen noch besser auf eure Situation abstimmen können?",
    "tuner.insightsPlaceholder": "Teilt alles, was uns helfen könnte, eure einzigartige Reise zu verstehen...",
    "tuner.syncing": "Synchronisiere...",
    "tuner.generate": "SYNCHRONISIEREN / DECK ERSTELLEN",
    
    // Card Grid
    "cards.personalized": "Euer Personalisiertes Deck",
    "cards.sample": "Probiere das Erlebnis",
    "cards.personalizedDesc": "Schaut euch eure Karten an und teilt euer Feedback",
    "cards.sampleDesc": "Klicke auf eine Karte, um sie umzudrehen",
    
    // Card Footer
    "card.passOk": "Passen/Nicht heute ist OK.",
    "card.remember": "Was wollen wir uns davon merken?",
    
    // Conversion Footer
    "footer.sampleTitle": "Das war nur ein 4-Karten-Sample",
    "footer.sampleDesc": "Das vollständige Ritual umfasst 52 Karten—eine für jeden Date-Abend des Jahres. Ein hochwertiges physisches Deck, personalisiert auf eure gemeinsame Reise.",
    "footer.cards": "52 Karten",
    "footer.reserveTitle": "Erste Auflage reservieren",
    "footer.reservePrice": "€5 Prioritäts-Anzahlung",
    "footer.reserved": "Reserviert!",
    "footer.secureBtn": "Mein Deck sichern",
    "footer.vipAccess": "VIP-Zugang zum Launch & exklusive Inhalte",
    "footer.notifyTitle": "Benachrichtige mich",
    "footer.notifyDesc": "Trage dich in die Warteliste ein",
    "footer.onList": "Du bist auf der Liste!",
    "footer.joinWaitlist": "Warteliste beitreten",
    "footer.emailPlaceholder": "deine@email.de",
    
    // Toasts
    "toast.reserved": "Reserviert! 🎉",
    "toast.reservedDesc": "Du bist auf der Prioritätsliste für die erste Auflage.",
    "toast.joined": "Du bist auf der Liste!",
    "toast.joinedDesc": "Wir benachrichtigen dich, wenn Hertz an Hertz startet.",
    
    // Accordions
    "accordion.about": "Über / Spielanleitung",
    "accordion.tuner": "⚡️ Frequenz Tunen",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("de");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
