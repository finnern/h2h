import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { TunerSection, TunerData } from "@/components/TunerSection";
import { CardGrid } from "@/components/CardGrid";
import { ConversionFooter } from "@/components/ConversionFooter";
import { HeartbeatLine } from "@/components/HeartbeatLine";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { Archetype } from "@/components/FlippableCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Generic (Universal) cards - all start face down showing archetype images
const getGenericCards = () => [
  {
    archetype: "hearts" as Archetype,
    questions: {
      light: "What is a small thing I do that makes you smile instantly?",
      deep: "What does your 'inner home' look like when you feel completely safe with me?",
    },
    initialFlipped: false, // Index 0: Image
  },
  {
    archetype: "clubs" as Archetype,
    questions: {
      light: "If our relationship were a craft, what would it be?",
      deep: "As 'mindfulness is a craft', what is the one habit we should practice weekly?",
    },
    initialFlipped: true, // Index 1: Text (checkerboard)
  },
  {
    archetype: "diamonds" as Archetype,
    questions: {
      light: "What was the 'Money Story' you heard most as a child?",
      deep: "What new 'Money Story' do you want us to write together?",
    },
    initialFlipped: true, // Index 2: Text (checkerboard)
  },
  {
    archetype: "spades" as Archetype,
    questions: {
      light: "What is a question you are usually afraid to ask in relationships?",
      deep: "What do you fear would happen if you asked me that question right now?",
    },
    initialFlipped: false, // Index 3: Image
  },
];

// Generate personalized cards based on tuner input
const generatePersonalizedCards = (data: TunerData, language: string) => {
  const { partnerA, partnerB, lifecycle, scientific, spiritual, culture } = data;
  
  // Lifecycle modifiers based on language
  const lifecycleContext = language === "de" ? {
    "fresh-spark": { focus: "Entdeckung und Hoffnungen", tone: "aufregende Möglichkeiten" },
    "deep-groove": { focus: "tieferes Verständnis", tone: "gemeinsames Wachstum" },
    "vintage-gold": { focus: "Wertschätzung und Geschichte", tone: "wertvolle Erinnerungen" },
    "navigating-storms": { focus: "Heilung und Wiederverbindung", tone: "gemeinsamer Wiederaufbau" },
  }[lifecycle] || { focus: "eure Reise", tone: "Verbindung" }
  : {
    "fresh-spark": { focus: "discovery and hopes", tone: "exciting possibilities" },
    "deep-groove": { focus: "deepening understanding", tone: "growth together" },
    "vintage-gold": { focus: "appreciation and history", tone: "treasured memories" },
    "navigating-storms": { focus: "healing and reconnection", tone: "rebuilding together" },
  }[lifecycle] || { focus: "your journey", tone: "connection" };

  // Cultural touches
  const culturalNote = culture?.toLowerCase().includes("swabian") 
    ? language === "de" ? " (in Erinnerung an unsere Kehrwoche-Weisheit)" : " (remembering our Kehrwoche wisdom)" 
    : "";

  if (language === "de") {
    return [
      {
        archetype: "hearts" as Archetype,
        questions: {
          light: `${partnerA}, welche kleine Geste von ${partnerB} bringt dich in dein 'inneres Zuhause'?`,
          deep: `Wie würde ${lifecycleContext.focus} in unseren verletzlichsten Momenten gemeinsam aussehen?`,
        },
        initialFlipped: false, // Index 0: Image
      },
      {
        archetype: "clubs" as Archetype,
        questions: {
          light: `Welches gemeinsame Projekt könnten ${partnerA} und ${partnerB} diese Saison zusammen erschaffen?${culturalNote}`,
          deep: `Bei ${lifecycleContext.tone}, welches Handwerk bauen wir mit unseren täglichen Handlungen?`,
        },
        initialFlipped: true, // Index 1: Text (checkerboard)
      },
      {
        archetype: "diamonds" as Archetype,
        questions: {
          light: `${partnerB}, welche 'Geld-Geschichte' hat dir deine Familie beigebracht, die heute noch nachklingt?`,
          deep: `Mit ${lifecycleContext.focus}, welches Vermächtnis wollen ${partnerA} und ${partnerB} aufbauen?`,
        },
        initialFlipped: true, // Index 2: Text (checkerboard)
      },
      {
        archetype: "spades" as Archetype,
        questions: {
          light: `${partnerA}, welche Frage über die Zukunft zögerst du, ${partnerB} zu stellen?`,
          deep: `In ${lifecycleContext.tone}, welche Weisheit sind wir bereit, gemeinsam anzunehmen?`,
        },
        initialFlipped: false, // Index 3: Image
      },
    ];
  }

  return [
    {
      archetype: "hearts" as Archetype,
      questions: {
        light: `${partnerA}, what small gesture from ${partnerB} brings you into your 'inner home'?`,
        deep: `What would ${lifecycleContext.focus} look like in our most vulnerable moments together?`,
      },
      initialFlipped: false, // Index 0: Image
    },
    {
      archetype: "clubs" as Archetype,
      questions: {
        light: `What shared project could ${partnerA} and ${partnerB} create together this season?${culturalNote}`,
        deep: `As ${lifecycleContext.tone}, what craft are we building with our daily actions?`,
      },
      initialFlipped: true, // Index 1: Text (checkerboard)
    },
    {
      archetype: "diamonds" as Archetype,
      questions: {
        light: `${partnerB}, what 'money story' did your family teach you that still echoes today?`,
        deep: `With ${lifecycleContext.focus}, what legacy do ${partnerA} and ${partnerB} want to build?`,
      },
      initialFlipped: true, // Index 2: Text (checkerboard)
    },
    {
      archetype: "spades" as Archetype,
      questions: {
        light: `${partnerA}, what question about the future are you hesitant to ask ${partnerB}?`,
        deep: `In ${lifecycleContext.tone}, what wisdom are we ready to embrace together?`,
      },
      initialFlipped: false, // Index 3: Image
    },
  ];
};

const Index = () => {
  const { t, language } = useLanguage();
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [currentCards, setCurrentCards] = useState(getGenericCards());
  const [showHeartbeatAnimation, setShowHeartbeatAnimation] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);
  const cardGridRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback(async (data: TunerData) => {
    setIsGenerating(true);
    setShowHeartbeatAnimation(true);
    setIsShuffling(true);
    
    // Close accordion and scroll to cards
    setOpenAccordion(undefined);
    
    // Small delay to let accordion close, then scroll
    setTimeout(() => {
      cardGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
    
    // Build anticipation with 5-second delay - cards show archetype images
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Generate personalized cards in selected language - all face down (initialFlipped: false)
    const newCards = generatePersonalizedCards(data, language);
    setCurrentCards(newCards);
    setIsPersonalized(true);
    setIsShuffling(false);
    setShowHeartbeatAnimation(false);
    setIsGenerating(false);
  }, [language]);

  const handleFeedback = useCallback((archetype: Archetype, positive: boolean) => {
    console.log(`Feedback for ${archetype}: ${positive ? "positive" : "negative"}`);
    // In production, would send to analytics/backend
  }, []);

  return (
    <>
      <Helmet>
        <title>Hertz an Hertz - {t("header.tagline")}</title>
        <meta name="description" content="A premium card game experience for couples. 52 cards for 52 date nights. Personalized questions to deepen your connection." />
      </Helmet>

      <div className="min-h-screen gradient-warm">
        {/* Compact Header */}
        <header className="pt-4 pb-2 text-center px-4 relative">
          {/* Language Toggle - Top Right */}
          <div className="absolute top-3 right-4">
            <LanguageToggle />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-4xl md:text-5xl text-heartbeat mb-1">
              Hertz an Hertz
            </h1>
            <p className="font-body text-lg md:text-xl text-ink-light italic">
              {t("header.tagline")}
            </p>
          </motion.div>
        </header>

        <main className="pb-8 px-4">
          {/* --- NEUER INTRO TEXT START (Hier einfügen) --- */}
        <div className="text-center max-w-2xl mx-auto mb-6 mt-2 space-y-2 animate-fade-in">
          <p className="font-body text-ink/80 text-base md:text-lg leading-relaxed">
            {language === "de" ? (
              <>
                Jede Liebe hat ihre eigene Frequenz. Spüren Sie Ihre?<br />
                Drehen Sie die Karten unten um für einen ersten Funken. Wenn Sie bereit für die ganze Magie sind: <br className="hidden md:block" />
                Öffnen Sie den <span className="font-semibold text-heartbeat">Tuner</span> und lassen Sie Ihr ganz persönliches Deck entstehen.
              </>
            ) : (
              <>
                Every love has its own frequency. Can you feel yours?<br />
                Flip the cards below for a first spark. When you're ready for the real magic: <br className="hidden md:block" />
                Open the <span className="font-semibold text-heartbeat">Tuner</span> and generate a deck that tells your unique story.
              </>
            )}
          </p>
        </div>
        {/* --- NEUER INTRO TEXT ENDE --- */}
          {/* Collapsible Accordions */}
          <Accordion 
            type="single" 
            collapsible
            value={openAccordion}
            onValueChange={setOpenAccordion}
            className="max-w-4xl mx-auto mb-4"
          >
            {/* About / How to Play - collapsed by default */}
            
            
            {/* Start des Bereichs "Über / Philosophie" */}
<AccordionItem value="about" className="border border-border rounded-lg mb-2 bg-card/50">
  <AccordionTrigger className="px-4 py-3 font-body text-ink hover:no-underline">
    {/* Hier ändern wir den Titel auch leicht, damit es besser passt, oder lassen es beim Standard */}
    {language === "de" ? "Philosophie & Anleitung" : "Philosophy & How to Play"}
  </AccordionTrigger>
  
  <AccordionContent className="px-4 pb-4">
    <div className="font-body text-ink-light space-y-4 leading-relaxed">
      <p className="italic text-ink/80">
        {language === "de"
          ? "Beziehungen leben von Resonanz. Doch im Alltag verlieren wir oft unseren gemeinsamen Takt. Dieses Spiel ist euer Stimmgerät."
          : "Relationships live on resonance. But in daily life, we often lose our shared rhythm. This game is your tuning fork."}
      </p>

      <p className="font-semibold text-heartbeat text-sm uppercase tracking-wide mt-4">
        {language === "de" ? "Die vier Wegweiser:" : "The Four Guides:"}
      </p>

      <ul className="space-y-3 mt-2">
        <li className="flex gap-3 items-start">
          <span className="text-xl shrink-0">♥️</span>
          <span>
            {language === "de" ? (
              <>
                <strong className="text-ink">Der Engel (Verletzlichkeit):</strong> Öffnet das „innere Zuhause“, in dem wir die Waffen fallen lassen.
              </>
            ) : (
              <>
                <strong className="text-ink">The Angel (Vulnerability):</strong> Opens the "inner home" where we can drop our defenses.
              </>
            )}
          </span>
        </li>

        <li className="flex gap-3 items-start">
          <span className="text-xl shrink-0">♣️</span>
          <span>
            {language === "de" ? (
              <>
                <strong className="text-ink">Der Arbeiter (Tatkraft):</strong> Erinnert uns daran: Liebe ist ein Verb und zeigt sich im gemeinsamen Tun.
              </>
            ) : (
              <>
                <strong className="text-ink">The Worker (Action):</strong> Reminds us: Love is a verb, proven in shared doing.
              </>
            )}
          </span>
        </li>

        <li className="flex gap-3 items-start">
          <span className="text-xl shrink-0">♦️</span>
          <span>
            {language === "de" ? (
              <>
                <strong className="text-ink">Der König (Werte):</strong> Fragt uns: Welches Königreich und welches Vermächtnis bauen wir auf?
              </>
            ) : (
              <>
                <strong className="text-ink">The King (Values):</strong> Asks us: What kingdom and legacy are we building together?
              </>
            )}
          </span>
        </li>

        <li className="flex gap-3 items-start">
          <span className="text-xl shrink-0">♠️</span>
          <span>
            {language === "de" ? (
              <>
                <strong className="text-ink">Der Älteste (Weisheit):</strong> Hilft uns, Stürme zu navigieren und an Veränderungen zu wachsen.
              </>
            ) : (
              <>
                <strong className="text-ink">The Elder (Wisdom):</strong> Helps us navigate storms and grow through transitions.
              </>
            )}
          </span>
        </li>
      </ul>
    </div>
  </AccordionContent>
</AccordionItem>
{/* Ende des Bereichs */}
            
    
            
              </Accordion>

          {/* Animated heartbeat line on generation */}
          <AnimatePresence>
            {showHeartbeatAnimation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto mb-4"
              >
                <HeartbeatLine animated />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section B: The Card Grid - visible immediately */}
          <section ref={cardGridRef} className="py-4">
            <div className="text-center mb-4">
              <motion.h2
                className="font-display text-2xl md:text-3xl text-ink"
                key={`${isPersonalized}-${language}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {isPersonalized ? t("cards.personalized") : t("cards.sample")}
              </motion.h2>
              <p className="font-body text-sm text-ink-light mt-1">
                {isPersonalized 
                  ? t("cards.personalizedDesc")
                  : t("cards.sampleDesc")}
              </p>
            </div>

            <CardGrid
              cards={currentCards}
              isPersonalized={isPersonalized}
              isShuffling={isShuffling}
              onFeedback={handleFeedback}
            />
          </section>Ï

          {/* Conversion Footer - appears after personalization */}
          <ConversionFooter isVisible={isPersonalized} />
        </main>
      </div>
    </>
  );
};

export default Index;
