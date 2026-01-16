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
    "tuner.historyOptIn": "Save our journey? Allow Hertz an Hertz to remember this context for future decks.",
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
    "footer.sampleTitle": "This was just a glimpse",
    "footer.sampleDesc": "A beautifully crafted card set for your shared journey. Discover impulses for genuine connection – at your own pace.",
    "footer.cards": "unique cards",
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

    // About Page
    "about.title": "About Hertz an Hertz",
    "about.subtitle": "Where science meets heartbeat—and technology meets tradition.",
    "about.intro.p1": "Welcome to Hertz an Hertz. We believe that love is more than just a fleeting feeling. It is physics—a vibration that needs nurturing.",
    "about.intro.p2": "Our philosophy is based on a fascinating discovery by physicist Christiaan Huygens in 1665: He observed that two pendulum clocks hanging from the same wooden beam eventually adjust their swings to match each other perfectly. He called this phenomenon synchronization.",
    "about.intro.p3": "In a relationship, you are these two clocks. And Hertz an Hertz is the sounding board that connects you, helping you find your shared rhythm.",
    "about.back": "Back",
    "about.council.title": "The \"Council of the Wise\": Our Global DNA",
    "about.council.intro": "This card deck is not a random product. It is the result of a deep analysis of the world's leading relationship experts. Our Artificial Intelligence was not trained on simplistic calendar mottos, but on the \"gold standards\" of modern couples therapy—both international and European.",
    "about.council.subtitle": "Every card you hold in your hand is based on the principles of these thought leaders:",
    "about.pioneers.title": "The International Pioneers",
    "about.pioneers.gottman": "Drs. John & Julie Gottman (The Seven Principles for Making Marriage Work): The architects of the famous \"Love Lab.\" From them comes the concept of \"Love Maps.\" Our questions help you constantly update these internal maps of your partner, because we know: You can only deeply love what you truly know.",
    "about.pioneers.perel": "Esther Perel (Mating in Captivity): She explores the eternal tension between safety and adventure. Her wisdom flows into our deep questions to preserve the mystery in your relationship and prevent everything from suffocating in routine.",
    "about.pioneers.johnson": "Dr. Sue Johnson (Hold Me Tight): The founder of Emotionally Focused Therapy (EFT). Her work teaches us that behind almost every argument lies one anxious question: \"Are you really there for me?\" Our cards create the safe space to answer this question together.",
    "about.pioneers.real": "Terry Real (The New Rules of Marriage): He coined modern \"Us-Consciousness.\" His strategies help us shift from an egocentric battle to a collaborative partnership—becoming a team.",
    "about.european.title": "The European Grounding",
    "about.european.intro": "To integrate grounded perspectives and cultural nuance, we rely on leading voices from the German-speaking world:",
    "about.european.stahl": "Stefanie Stahl (The Child in You): Essential for working with the \"Inner Child.\" Our prompts help distinguish: Is my adult self speaking right now, or an old wound from the past?",
    "about.european.mary": "Michael Mary (The 5 Lies of Love): Our anchor for healthy realism. He teaches us that expectations are negotiable and conflicts do not mean the end. This relieves the pressure.",
    "about.european.holzberg": "Oskar Holzberg (Key Sentences of Love): The master of everyday life. His observations flow into our micro-rituals, ensuring love survives amidst dishwashing, job stress, and raising children.",
    "about.tech.title": "The Technology: Your Story in Safe Hands",
    "about.tech.intro": "Here, modern analysis meets human need. Our AI uses this concentrated expertise as a flexible toolbox to find the right prompts for you. Yet we know: Technology—especially AI—can feel intimidating. That's why we operate on the principle of absolute sovereignty over your data.",
    "about.tech.card1.title": "1. Works Without Baring Your Soul",
    "about.tech.card1.text": "You don't have to tell the AI anything about yourselves if you don't want to. Even without specific knowledge of your personal situation, the system generates wonderful impulses. Why? Because the universal principles of Gottman, Perel, or Stahl are so strong that they enrich every relationship.",
    "about.tech.card2.title": "2. The Turbo Charge: Tailor-Made",
    "about.tech.card2.text": "However, if you choose to give the AI context (e.g., \"We just became parents\" or \"We are navigating a loss\"), it can refine the questions. Instead of generic advice, you receive prompts that start exactly where you currently are.",
    "about.tech.card3.title": "3. Our Safety Promise",
    "about.tech.card3.subtitle": "Your privacy is our highest asset.",
    "about.tech.card3.noTraining": "No AI Training: None of your inputs are used to train the AI. Your data stays with you.",
    "about.tech.card3.gdpr": "GDPR Compliance: We strictly adhere to the General Data Protection Regulation.",
    "about.tech.card3.dataEconomy": "Data Economy: Your information is only stored securely encrypted if you explicitly wish it—for example, to develop further, even more fitting card decks for you later. Otherwise, the rule applies: What happens in the moment, stays in the moment.",
    "about.soul.title": "The Soul: Grandfather Hartschierle's Legacy",
    "about.soul.p1": "Yet science, data, and algorithms are often loud and fast. Sometimes love needs the exact opposite: Silence, slowness, and humility.",
    "about.soul.intro": "May we introduce: Grandfather Hartschierle.",
    "about.soul.p2": "He was by no means a relationship expert in the classical sense. On the contrary: He avoided the hustle and bustle of people. He withdrew as a hermit into the solitude of a cave deep in the Black Forest to find answers there that get drowned out in the noise of everyday life.",
    "about.soul.p3": "He was an observer who drew his wisdom not from books, but from the rustling of the treetops, the moss on the stones, and the eternal cycle of nature. He taught us that answers often lie not in hectic exchange, but in enduring silence together.",
    "about.soul.p4": "In Hertz an Hertz, he is the resting pole. He doesn't ask you to talk, but simply to be present. His cards are invitations to calmness:",
    "about.soul.quote": "\"Listen to the forest. In the silence, thoughts clarify—and therein, you finally hear the other person's heart beating again.\"",
    "about.visual.title": "The Visual Roots: The Real Painter \"Hartschierle\"",
    "about.visual.text": "The visual soul of our project is based on the unique style of a real 19th-century painter from Schramberg, Germany, known historically as \"Hartschierle.\" We use his naive yet character-rich folk art to give our modern technology deep, regional roots.",
    "about.visual.link": "Learn more about the historical Hartschierle →",
    "about.cta.title": "Ready to Find Your Rhythm?",
    "about.cta.text": "Let Hertz an Hertz become the resonating board for your relationship. Try our sample deck or reserve your personalized cards today.",
    "about.cta.button": "Start Syncing",
    "about.conclusion.title": "Your Pillar for a Living Relationship",
    "about.conclusion.p1": "Synchronization doesn't mean you have to march in perfect unison all the time.",
    "about.conclusion.p2": "It's about finding your way back to each other after dissonance. It's about mechanisms that help you absorb life's challenges and get back into resonance. Hertz an Hertz aims to be one of the supporting pillars that aids you in this.",
    "about.conclusion.p3": "Find your rhythm. So that what we all long for can emerge: A love that grows and thrives.",
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
    "tuner.historyOptIn": "Unsere Reise speichern? Erlaube Hertz an Hertz, diesen Kontext für zukünftige Decks zu merken.",
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
    "footer.sampleTitle": "Das war nur ein kleiner Einblick",
    "footer.sampleDesc": "Ein hochwertig gefertigtes Kartenset für eure gemeinsame Reise. Entdeckt Impulse für echte Verbindung – ganz flexibel in eurem eigenen Rhythmus.",
    "footer.cards": "einzigartige Karten",
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

    // About Page
    "about.title": "Über Hertz an Hertz",
    "about.subtitle": "Wo Wissenschaft auf Herzschlag trifft – und Technologie auf Tradition.",
    "about.intro.p1": "Willkommen bei Hertz an Hertz. Wir glauben, dass Liebe mehr ist als nur ein flüchtiges Gefühl. Sie ist Physik – eine Schwingung, die gepflegt werden muss.",
    "about.intro.p2": "Unsere Philosophie basiert auf einer faszinierenden Entdeckung des Physikers Christiaan Huygens im Jahr 1665: Er beobachtete, dass zwei Pendeluhren, die am selben Holzbalken hingen, ihre Schwingungen schließlich perfekt aneinander anpassten. Er nannte dieses Phänomen Synchronisation.",
    "about.intro.p3": "In einer Beziehung seid ihr diese beiden Uhren. Und Hertz an Hertz ist der Resonanzboden, der euch verbindet und euch hilft, euren gemeinsamen Rhythmus zu finden.",
    "about.back": "Zurück",
    "about.council.title": 'Der "Rat der Weisen": Unsere globale DNA',
    "about.council.intro": 'Dieses Kartendeck ist kein zufälliges Produkt. Es ist das Ergebnis einer tiefen Analyse der weltweit führenden Beziehungsexperten. Unsere Künstliche Intelligenz wurde nicht mit simplen Kalendersprüchen trainiert, sondern mit den "Goldstandards" der modernen Paartherapie—sowohl international als auch europäisch.',
    "about.council.subtitle": "Jede Karte, die ihr in Händen haltet, basiert auf den Prinzipien dieser Vordenker:",
    "about.pioneers.title": "Die internationalen Pioniere",
    "about.pioneers.gottman": 'Drs. John & Julie Gottman (Die 7 Geheimnisse der glücklichen Ehe): Die Architekten des berühmten "Love Lab". Von ihnen stammt das Konzept der "Love Maps". Unsere Fragen helfen euch, diese inneren Landkarten des Partners ständig zu aktualisieren, denn wir wissen: Nur was man wirklich kennt, kann man auch tief lieben.',
    "about.pioneers.perel": "Esther Perel (Die Macht der Affäre): Sie erforscht die ewige Spannung zwischen Sicherheit und Abenteuer. Ihre Weisheit fließt in unsere tiefgreifenden Fragen ein, um das Geheimnis in eurer Beziehung zu bewahren und zu verhindern, dass alles in Routine erstickt.",
    "about.pioneers.johnson": 'Dr. Sue Johnson (Halt mich fest): Die Begründerin der Emotionsfokussierten Therapie (EFT). Ihre Arbeit lehrt uns, dass hinter fast jedem Streit eine ängstliche Frage liegt: "Bist du wirklich für mich da?" Unsere Karten schaffen den sicheren Raum, diese Frage gemeinsam zu beantworten.',
    "about.pioneers.real": 'Terry Real (Beziehungskompetenz): Er prägte das moderne "Wir-Bewusstsein". Seine Strategien helfen uns, vom egozentrischen Kampf zur kollaborativen Partnerschaft zu wechseln—ein Team zu werden.',
    "about.european.title": "Die europäische Erdung",
    "about.european.intro": "Um fundierte Perspektiven und kulturelle Nuancen zu integrieren, stützen wir uns auf führende Stimmen aus dem deutschsprachigen Raum:",
    "about.european.stahl": 'Stefanie Stahl (Das Kind in dir muss Heimat finden): Unverzichtbar für die Arbeit mit dem "Inneren Kind". Unsere Impulse helfen zu unterscheiden: Spricht gerade mein erwachsenes Ich, oder eine alte Wunde aus der Vergangenheit?',
    "about.european.mary": "Michael Mary (Die 5 Lügen der Liebe): Unser Anker für gesunden Realismus. Er lehrt uns, dass Erwartungen verhandelbar sind und Konflikte nicht das Ende bedeuten. Das nimmt Druck.",
    "about.european.holzberg": "Oskar Holzberg (Schlüsselsätze der Liebe): Der Meister des Alltags. Seine Beobachtungen fließen in unsere Mikro-Rituale ein, damit die Liebe auch zwischen Abwasch, Jobstress und Kindererziehung überlebt.",
    "about.tech.title": "Die Technologie: Eure Geschichte in sicheren Händen",
    "about.tech.intro": "Hier trifft moderne Analyse auf menschliches Bedürfnis. Unsere KI nutzt dieses geballte Expertenwissen als flexiblen Werkzeugkasten, um die richtigen Impulse für euch zu finden. Doch wir wissen: Technologie—besonders KI—kann einschüchternd wirken. Deshalb arbeiten wir nach dem Prinzip der absoluten Hoheit über eure Daten.",
    "about.tech.card1.title": "1. Funktioniert auch ohne Seelenstriptease",
    "about.tech.card1.text": "Ihr müsst der KI nichts über euch erzählen, wenn ihr nicht wollt. Auch ohne spezifisches Wissen über eure persönliche Situation generiert das System wunderbare Impulse. Warum? Weil die universellen Prinzipien von Gottman, Perel oder Stahl so stark sind, dass sie jede Beziehung bereichern.",
    "about.tech.card2.title": "2. Der Turbo: Maßgeschneidert",
    "about.tech.card2.text": 'Wenn ihr jedoch der KI Kontext gebt (z.B. "Wir sind gerade Eltern geworden" oder "Wir verarbeiten einen Verlust"), kann sie die Fragen verfeinern. Statt allgemeiner Ratschläge erhaltet ihr Impulse, die genau dort ansetzen, wo ihr gerade steht.',
    "about.tech.card3.title": "3. Unser Sicherheitsversprechen",
    "about.tech.card3.subtitle": "Eure Privatsphäre ist unser höchstes Gut.",
    "about.tech.card3.noTraining": "Kein KI-Training: Keine eurer Eingaben wird genutzt, um die KI zu trainieren. Eure Daten bleiben bei euch.",
    "about.tech.card3.gdpr": "DSGVO-Konformität: Wir halten uns strikt an die Datenschutz-Grundverordnung.",
    "about.tech.card3.dataEconomy": "Datensparsamkeit: Eure Informationen werden nur sicher verschlüsselt gespeichert, wenn ihr das ausdrücklich wünscht—etwa, um später noch passendere Kartendecks für euch zu entwickeln. Ansonsten gilt: Was im Moment passiert, bleibt im Moment.",
    "about.soul.title": "Die Seele: Das Vermächtnis von Großvater Hartschierle",
    "about.soul.p1": "Doch Wissenschaft, Daten und Algorithmen sind oft laut und schnell. Manchmal braucht die Liebe das genaue Gegenteil: Stille, Langsamkeit und Demut.",
    "about.soul.intro": "Dürfen wir vorstellen: Großvater Hartschierle.",
    "about.soul.p2": "Er war keineswegs ein Beziehungsexperte im klassischen Sinne. Im Gegenteil: Er mied das Getümmel der Menschen. Er zog sich als Eremit in die Einsamkeit einer Höhle tief im Schwarzwald zurück, um dort Antworten zu finden, die im Lärm des Alltags untergehen.",
    "about.soul.p3": "Er war ein Beobachter, der seine Weisheit nicht aus Büchern schöpfte, sondern aus dem Rauschen der Baumwipfel, dem Moos auf den Steinen und dem ewigen Kreislauf der Natur. Er lehrte uns, dass Antworten oft nicht im hektischen Austausch liegen, sondern im gemeinsamen Aushalten der Stille.",
    "about.soul.p4": "In Hertz an Hertz ist er der Ruhepol. Er fordert euch nicht zum Reden auf, sondern einfach dazu, da zu sein. Seine Karten sind Einladungen zur Ruhe:",
    "about.soul.quote": '"Hört auf den Wald. In der Stille klären sich die Gedanken—und darin hört ihr endlich wieder das Herz des anderen schlagen."',
    "about.visual.title": 'Die visuellen Wurzeln: Der echte Maler "Hartschierle"',
    "about.visual.text": 'Die visuelle Seele unseres Projekts basiert auf dem einzigartigen Stil eines echten Malers des 19. Jahrhunderts aus Schramberg, Deutschland, historisch bekannt als "Hartschierle". Wir nutzen seine naive, aber charakterstarke Volkskunst, um unserer modernen Technologie tiefe, regionale Wurzeln zu geben.',
    "about.visual.link": "Mehr über den historischen Hartschierle erfahren →",
    "about.cta.title": "Bereit, euren Rhythmus zu finden?",
    "about.cta.text": "Lasst Hertz an Hertz zum Resonanzboden für eure Beziehung werden. Probiert unser Sample-Deck oder reserviert noch heute eure personalisierten Karten.",
    "about.cta.button": "Jetzt synchronisieren",
    "about.conclusion.title": "Euer Stützpfeiler für eine lebendige Beziehung",
    "about.conclusion.p1": "Synchronisation bedeutet nicht, dass ihr immer perfekt im Gleichschritt marschieren müsst.",
    "about.conclusion.p2": "Es geht darum, nach Dissonanzen zueinander zurückzufinden. Es geht um Mechanismen, die euch helfen, die Herausforderungen des Lebens abzufedern und wieder in Resonanz zu kommen. Hertz an Hertz möchte einer der Stützpfeiler sein, die euch dabei helfen.",
    "about.conclusion.p3": "Findet euren Rhythmus. Damit das entstehen kann, wonach wir uns alle sehnen: Eine Liebe, die wächst und gedeiht.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  //Deutsch als Standard Sprache
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
