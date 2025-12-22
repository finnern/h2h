import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { TunerSection, TunerData } from "@/components/TunerSection";
import { CardGrid } from "@/components/CardGrid";
import { ConversionFooter } from "@/components/ConversionFooter";
import { HeartbeatLine } from "@/components/HeartbeatLine";
import { Archetype } from "@/components/FlippableCard";

// Generic (Universal) cards - always applicable
const genericCards = [
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
const generatePersonalizedCards = (data: TunerData) => {
  const { partnerA, partnerB, lifecycle, scientific, spiritual, culture } = data;
  
  // Lifecycle modifiers
  const lifecycleContext = {
    "fresh-spark": { focus: "discovery and hopes", tone: "exciting possibilities" },
    "deep-groove": { focus: "deepening understanding", tone: "growth together" },
    "vintage-gold": { focus: "appreciation and history", tone: "treasured memories" },
    "navigating-storms": { focus: "healing and reconnection", tone: "rebuilding together" },
  }[lifecycle] || { focus: "your journey", tone: "connection" };

  // No preambles - questions only
  // Cultural touches
  const culturalNote = culture?.toLowerCase().includes("swabian") 
    ? " (remembering our Kehrwoche wisdom)" 
    : "";

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
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [currentCards, setCurrentCards] = useState(genericCards);
  const [showHeartbeatAnimation, setShowHeartbeatAnimation] = useState(false);

  const handleGenerate = useCallback(async (data: TunerData) => {
    setIsGenerating(true);
    setShowHeartbeatAnimation(true);
    setIsShuffling(true);
    
    // Build anticipation with 5-second delay - cards show archetype images
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Generate personalized cards - all face down (initialFlipped: false)
    const newCards = generatePersonalizedCards(data);
    setCurrentCards(newCards);
    setIsPersonalized(true);
    setIsShuffling(false);
    setShowHeartbeatAnimation(false);
    setIsGenerating(false);
  }, []);

  const handleFeedback = useCallback((archetype: Archetype, positive: boolean) => {
    console.log(`Feedback for ${archetype}: ${positive ? "positive" : "negative"}`);
    // In production, would send to analytics/backend
  }, []);

  return (
    <>
      <Helmet>
        <title>Hertz an Hertz - The Sync Engine for Couples</title>
        <meta name="description" content="A premium card game experience for couples. 52 cards for 52 date nights. Personalized questions to deepen your connection." />
      </Helmet>

      <div className="min-h-screen gradient-warm">
        {/* Hero Header */}
        <header className="pt-8 pb-6 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-5xl md:text-7xl text-heartbeat mb-2">
              Hertz an Hertz
            </h1>
            <p className="font-body text-xl md:text-2xl text-ink-light italic">
              The Sync Engine for Couples
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
                key={isPersonalized ? "personalized" : "generic"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {isPersonalized ? "Your Personalized Deck" : "Sample the Experience"}
              </motion.h2>
              <p className="font-body text-ink-light mt-2">
                {isPersonalized 
                  ? "Review your cards and share your feedback" 
                  : "Click any card to flip and explore both sides"}
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
