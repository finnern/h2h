import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { TunerSection, TunerData } from "@/components/TunerSection";
import { CardGrid } from "@/components/CardGrid";
import { ConversionFooter } from "@/components/ConversionFooter";
import { HeartbeatLine } from "@/components/HeartbeatLine";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { Archetype } from "@/components/FlippableCard";

// Generic (Universal) cards - will be translated
const getGenericCards = (t: (key: string) => string) => [
  {
    archetype: "hearts" as Archetype,
    questions: {
      light: "What is a small thing I do that makes you smile instantly?",
      deep: "What does your 'inner home' look like when you feel completely safe with me?",
    },
    initialFlipped: true,
  },
  {
    archetype: "clubs" as Archetype,
    questions: {
      light: "If our relationship were a craft, what would it be?",
      deep: "As 'mindfulness is a craft', what is the one habit we should practice weekly?",
    },
    initialFlipped: false,
  },
  {
    archetype: "diamonds" as Archetype,
    questions: {
      light: "What was the 'Money Story' you heard most as a child?",
      deep: "What new 'Money Story' do you want us to write together?",
    },
    initialFlipped: false,
  },
  {
    archetype: "spades" as Archetype,
    questions: {
      light: "What is a question you are usually afraid to ask in relationships?",
      deep: "What do you fear would happen if you asked me that question right now?",
    },
    initialFlipped: true,
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
        initialFlipped: false,
      },
      {
        archetype: "clubs" as Archetype,
        questions: {
          light: `Welches gemeinsame Projekt könnten ${partnerA} und ${partnerB} diese Saison zusammen erschaffen?${culturalNote}`,
          deep: `Bei ${lifecycleContext.tone}, welches Handwerk bauen wir mit unseren täglichen Handlungen?`,
        },
        initialFlipped: false,
      },
      {
        archetype: "diamonds" as Archetype,
        questions: {
          light: `${partnerB}, welche 'Geld-Geschichte' hat dir deine Familie beigebracht, die heute noch nachklingt?`,
          deep: `Mit ${lifecycleContext.focus}, welches Vermächtnis wollen ${partnerA} und ${partnerB} aufbauen?`,
        },
        initialFlipped: false,
      },
      {
        archetype: "spades" as Archetype,
        questions: {
          light: `${partnerA}, welche Frage über die Zukunft zögerst du, ${partnerB} zu stellen?`,
          deep: `In ${lifecycleContext.tone}, welche Weisheit sind wir bereit, gemeinsam anzunehmen?`,
        },
        initialFlipped: false,
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
      initialFlipped: false,
    },
    {
      archetype: "clubs" as Archetype,
      questions: {
        light: `What shared project could ${partnerA} and ${partnerB} create together this season?${culturalNote}`,
        deep: `As ${lifecycleContext.tone}, what craft are we building with our daily actions?`,
      },
      initialFlipped: false,
    },
    {
      archetype: "diamonds" as Archetype,
      questions: {
        light: `${partnerB}, what 'money story' did your family teach you that still echoes today?`,
        deep: `With ${lifecycleContext.focus}, what legacy do ${partnerA} and ${partnerB} want to build?`,
      },
      initialFlipped: false,
    },
    {
      archetype: "spades" as Archetype,
      questions: {
        light: `${partnerA}, what question about the future are you hesitant to ask ${partnerB}?`,
        deep: `In ${lifecycleContext.tone}, what wisdom are we ready to embrace together?`,
      },
      initialFlipped: false,
    },
  ];
};

const Index = () => {
  const { t, language } = useLanguage();
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [currentCards, setCurrentCards] = useState(getGenericCards(t));
  const [showHeartbeatAnimation, setShowHeartbeatAnimation] = useState(false);

  const handleGenerate = useCallback(async (data: TunerData) => {
    setIsGenerating(true);
    setShowHeartbeatAnimation(true);
    setIsShuffling(true);
    
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
        {/* Hero Header */}
        <header className="pt-8 pb-6 text-center px-4 relative">
          {/* Language Toggle - Top Right */}
          <div className="absolute top-4 right-4">
            <LanguageToggle />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-5xl md:text-7xl text-heartbeat mb-2">
              Hertz an Hertz
            </h1>
            <p className="font-body text-xl md:text-2xl text-ink-light italic">
              {t("header.tagline")}
            </p>
          </motion.div>
          
          {/* Animated heartbeat line on generation */}
          <AnimatePresence>
            {showHeartbeatAnimation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-6 max-w-2xl mx-auto"
              >
                <HeartbeatLine animated />
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <main className="pb-8">
          {/* Section A: The Tuner */}
          <section className="mb-12">
            <TunerSection onGenerate={handleGenerate} isGenerating={isGenerating} />
          </section>

          {/* Section B: The Card Grid */}
          <section className="py-8">
            <div className="text-center mb-8">
              <motion.h2
                className="font-display text-3xl md:text-4xl text-ink"
                key={`${isPersonalized}-${language}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {isPersonalized ? t("cards.personalized") : t("cards.sample")}
              </motion.h2>
              <p className="font-body text-ink-light mt-2">
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
          </section>

          {/* Conversion Footer - appears after personalization */}
          <ConversionFooter isVisible={isPersonalized} />
        </main>
      </div>
    </>
  );
};

export default Index;