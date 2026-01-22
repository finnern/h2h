import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { TunerSection, TunerData } from "@/components/TunerSection";
import { CardGrid } from "@/components/CardGrid";
import { ConversionFooter } from "@/components/ConversionFooter";
import { HeartbeatLine } from "@/components/HeartbeatLine";
import { LanguageToggle } from "@/components/LanguageToggle";
import { CuckooClockSection } from "@/components/ui/CuckooClockSection";
import { GiftFlowModal } from "@/components/GiftFlowModal";
import AuthButton from "@/components/AuthButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfileData } from "@/hooks/useProfileData";
import { useSessionId } from "@/hooks/useSessionId";
import { Archetype } from "@/components/FlippableCard";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Sparkles, ArrowRight, Printer, Loader2, FileText, MessageCircle, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSupabaseWithSession } from "@/lib/supabaseWithSession";

// Import Hartschierle images
import hartschierleMadonna from "@/assets/hartschierle-madonna.png";
import hartschierleWanderer from "@/assets/hartschierle-wanderer.png";
import hertzProductPhoto from "@/assets/hertz-product-photo.jpg";

// Generic (Universal) cards - all start face down showing archetype images
const getGenericCards = () => [
  {
    archetype: "hearts" as Archetype,
    questions: {
      light: "What is a small thing I do that makes you smile instantly?",
      deep: "What does your 'inner home' look like when you feel completely safe with me?",
    },
    initialFlipped: false,
  },
  {
    archetype: "clubs" as Archetype,
    questions: {
      light: "If our relationship were a craft, what would it be?",
      deep: "As 'mindfulness is a craft', what is the one habit we should practice weekly?",
    },
    initialFlipped: true,
  },
  {
    archetype: "diamonds" as Archetype,
    questions: {
      light: "What was the 'Money Story' you heard most as a child?",
      deep: "What new 'Money Story' do you want us to write together?",
    },
    initialFlipped: true,
  },
  {
    archetype: "spades" as Archetype,
    questions: {
      light: "What is a question you are usually afraid to ask in relationships?",
      deep: "What do you fear would happen if you asked me that question right now?",
    },
    initialFlipped: false,
  },
];

// Generate personalized cards based on tuner input
const generatePersonalizedCards = (data: TunerData, language: string) => {
  const { partnerA, partnerB, phase, focus, culture } = data;
  
  const phaseContext = language === "de" ? {
    "fresh-spark": { theme: "Entdeckung und Hoffnungen", tone: "aufregende Möglichkeiten" },
    "rock-solid": { theme: "tieferes Verständnis", tone: "gemeinsames Wachstum" },
    "rush-hour": { theme: "Balance und Zusammenhalt", tone: "gemeinsame Stärke" },
    "golden-years": { theme: "Wertschätzung und Neu-Erfindung", tone: "wertvolle Erinnerungen" },
  }[phase] || { theme: "eure Reise", tone: "Verbindung" }
  : {
    "fresh-spark": { theme: "discovery and hopes", tone: "exciting possibilities" },
    "rock-solid": { theme: "deepening understanding", tone: "growth together" },
    "rush-hour": { theme: "balance and togetherness", tone: "shared strength" },
    "golden-years": { theme: "appreciation and reinvention", tone: "treasured memories" },
  }[phase] || { theme: "your journey", tone: "connection" };

  const focusContext = language === "de" ? {
    "lightness": "Leichtigkeit und gemeinsames Lachen",
    "depth": "tiefes Verstehen und Verbindung",
    "support": "Halt und gegenseitiger Rückenwind",
  }[focus] || "Verbindung"
  : {
    "lightness": "lightness and shared laughter",
    "depth": "deep understanding and connection",
    "support": "support and encouragement",
  }[focus] || "connection";

  const culturalNote = culture?.toLowerCase().includes("swabian") 
    ? language === "de" ? " (in Erinnerung an unsere Kehrwoche-Weisheit)" : " (remembering our Kehrwoche wisdom)" 
    : "";

  if (language === "de") {
    return [
      {
        archetype: "hearts" as Archetype,
        questions: {
          light: `${partnerA}, welche kleine Geste von ${partnerB} bringt dich in dein 'inneres Zuhause'?`,
          deep: `Mit Fokus auf ${focusContext}: Wie würde ${phaseContext.theme} in unseren verletzlichsten Momenten aussehen?`,
        },
        initialFlipped: false,
      },
      {
        archetype: "clubs" as Archetype,
        questions: {
          light: `Welches gemeinsame Projekt könnten ${partnerA} und ${partnerB} diese Saison zusammen erschaffen?${culturalNote}`,
          deep: `Bei ${phaseContext.tone}, welches Handwerk bauen wir mit unseren täglichen Handlungen?`,
        },
        initialFlipped: true,
      },
      {
        archetype: "diamonds" as Archetype,
        questions: {
          light: `${partnerB}, welche 'Geld-Geschichte' hat dir deine Familie beigebracht, die heute noch nachklingt?`,
          deep: `Mit ${phaseContext.theme}, welches Vermächtnis wollen ${partnerA} und ${partnerB} aufbauen?`,
        },
        initialFlipped: true,
      },
      {
        archetype: "spades" as Archetype,
        questions: {
          light: `${partnerA}, welche Frage über die Zukunft zögerst du, ${partnerB} zu stellen?`,
          deep: `In ${phaseContext.tone}, welche Weisheit sind wir bereit, gemeinsam anzunehmen?`,
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
        deep: `With a focus on ${focusContext}: What would ${phaseContext.theme} look like in our most vulnerable moments?`,
      },
      initialFlipped: false,
    },
    {
      archetype: "clubs" as Archetype,
      questions: {
        light: `What shared project could ${partnerA} and ${partnerB} create together this season?${culturalNote}`,
        deep: `As ${phaseContext.tone}, what craft are we building with our daily actions?`,
      },
      initialFlipped: true,
    },
    {
      archetype: "diamonds" as Archetype,
      questions: {
        light: `${partnerB}, what 'money story' did your family teach you that still echoes today?`,
        deep: `With ${phaseContext.theme}, what legacy do ${partnerA} and ${partnerB} want to build?`,
      },
      initialFlipped: true,
    },
    {
      archetype: "spades" as Archetype,
      questions: {
        light: `${partnerA}, what question about the future are you hesitant to ask ${partnerB}?`,
        deep: `In ${phaseContext.tone}, what wisdom are we ready to embrace together?`,
      },
      initialFlipped: false,
    },
  ];
};

const Index = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const sessionId = useSessionId();
  const { saveProfileAndTriggerProduction } = useProfileData();
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [currentCards, setCurrentCards] = useState(getGenericCards());
  const [showHeartbeatAnimation, setShowHeartbeatAnimation] = useState(false);
  const [coupleData, setCoupleData] = useState<{ partner_a: string; partner_b: string } | null>(null);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  
  const cardGridRef = useRef<HTMLDivElement>(null);
  const tunerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Handle hash scroll on page load (for navigation from other pages like /frage)
  useEffect(() => {
    if (location.hash === '#tuner') {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        tunerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [location.hash]);

  const scrollToTuner = () => {
    tunerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleGenerate = useCallback(async (data: TunerData) => {
    setIsGenerating(true);
    setShowHeartbeatAnimation(true);
    setIsShuffling(true);
    
    
    
    setTimeout(() => {
      cardGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);

    let n8nCards = null;
    try {
      const result = await saveProfileAndTriggerProduction({
        profileData: {
          coupleNames: `${data.partnerA} & ${data.partnerB}`,
          historyOptIn: data.historyOptIn,
        },
        memoriesData: {
          coreEvents: data.additionalInsights,
          sharedValues: data.focus || '',
          constraints: data.context,
        },
        coupleData: {
          partnerA: data.partnerA,
          partnerB: data.partnerB,
          phase: data.phase,
          focus: data.focus,
          isGift: data.isGift,
          gifterName: data.gifterName,
          culture: data.culture,
          context: data.context,
          additionalInsights: data.additionalInsights,
          language,
        },
      });
      console.log('Profile saved and production triggered');
      n8nCards = result?.n8nCards;
    } catch (error) {
      console.error('Background save/trigger failed:', error);
    }
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    if (n8nCards && Array.isArray(n8nCards) && n8nCards.length > 0) {
      console.log('Using n8n generated cards:', n8nCards);
      const archetypes: Archetype[] = ["hearts", "clubs", "diamonds", "spades"];
      const mappedCards = n8nCards.slice(0, 4).map((card: { question_surface?: string; question_deep?: string; type?: string }, index: number) => ({
        archetype: archetypes[index] || "hearts",
        questions: {
          light: card.question_surface || "",
          deep: card.question_deep || "",
        },
        initialFlipped: index === 1 || index === 2,
      }));
      setCurrentCards(mappedCards);
    } else {
      console.log('Falling back to local card generation');
      const newCards = generatePersonalizedCards(data, language);
      setCurrentCards(newCards);
    }
    
    setCoupleData({ partner_a: data.partnerA, partner_b: data.partnerB });
    setIsPersonalized(true);
    setIsShuffling(false);
    setShowHeartbeatAnimation(false);
    setIsGenerating(false);
  }, [language, saveProfileAndTriggerProduction]);

  const handleFeedback = useCallback((archetype: Archetype, positive: boolean) => {
    console.log(`Feedback for ${archetype}: ${positive ? "positive" : "negative"}`);
  }, []);

  const handleOrder = useCallback(async () => {
    if (!isPersonalized) return;
    
    setIsOrdering(true);
    
    try {
      // Use session-aware Supabase client for RLS compliance
      const supabase = getSupabaseWithSession();
      const { data, error } = await supabase.functions.invoke('order-production', {
        body: {
          cards: currentCards.map(card => ({
            archetype: card.archetype,
            questions: card.questions,
          })),
          couple: coupleData,
          language,
          session_id: sessionId,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: language === "de" ? "Erfolgreich bestellt!" : "Order successful!",
        description: language === "de" 
          ? "Dein PDF ist unterwegs." 
          : "Your PDF is on its way.",
      });
      
      console.log('Order response:', data);
    } catch (error) {
      console.error('Order failed:', error);
      toast({
        title: language === "de" ? "Bestellung fehlgeschlagen" : "Order failed",
        description: language === "de" 
          ? "Bitte versuche es später erneut." 
          : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsOrdering(false);
    }
  }, [isPersonalized, currentCards, coupleData, language, toast, sessionId]);

  return (
    <>
      <Helmet>
        <title>Hertz an Hertz - {language === "de" ? "Vom Herzschlag zur Resonanz" : "From Heartbeat to Resonance"}</title>
        <meta name="description" content={language === "de" 
          ? "Das Beziehungswerkzeug, das modernste Wissenschaft, künstliche Intelligenz und alte Weisheit verbindet. Findet euren gemeinsamen Takt."
          : "The relationship tool that combines cutting-edge science, artificial intelligence, and ancient wisdom. Find your shared rhythm."
        } />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Compact Header */}
        <header className="pt-4 pb-2 px-4 relative">
          <div className="absolute top-3 left-4">
            <Link 
              to="/about" 
              className="font-body text-sm text-ink/70 hover:text-primary transition-colors"
            >
              {language === "de" ? "Über uns" : "About"}
            </Link>
          </div>

          <div className="absolute top-3 right-4 flex items-center gap-2">
            <AuthButton />
            <LanguageToggle />
          </div>
        </header>

        <main className="pb-16">
        {/* Hero Section */}
          <section className="px-4 pt-8 pb-12 md:pt-16 md:pb-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Left: Text */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center md:text-left order-2 md:order-1"
                >
                  <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-primary mb-6 leading-[1.1] tracking-tight">
                    {language === "de" 
                      ? "Hertz an Hertz – Resonanz-Karten für Eure Liebe." 
                      : "Hertz an Hertz – Resonance Cards for Your Love."}
                  </h1>
                  <p className="font-body text-lg md:text-xl lg:text-2xl text-ink/70 mb-10 leading-relaxed max-w-lg">
                    {language === "de"
                      ? "Ein Kartenset, das Raum schafft. Für Momente, in denen ihr euch wieder aufeinander einschwingen wollt."
                      : "A card set that creates space. For moments when you want to tune into each other again."}
                  </p>
                  <Button 
                    onClick={scrollToTuner}
                    size="lg"
                    className="font-body text-lg px-8 py-6"
                  >
                    {language === "de" ? "Deck entdecken" : "Discover the Deck"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>

                {/* Right: Product Image */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative flex justify-center order-1 md:order-2"
                >
                  <img 
                    src={hertzProductPhoto} 
                    alt="Hertz an Hertz Karten mit Tasse – Das Sync-Deck für Paare"
                    className="w-full max-w-lg rounded-2xl shadow-xl object-cover"
                  />
                </motion.div>
              </div>
            </div>
          </section>

          {/* So funktioniert's Section */}
          <section className="px-4 py-8 md:py-10">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-muted/50 rounded-2xl px-6 py-8 md:px-10 md:py-10 border border-border/30"
              >
                <h2 className="font-display text-xl md:text-2xl text-primary mb-6 text-center">
                  {language === "de" ? "So funktioniert's" : "How it works"}
                </h2>
                
                {/* Steps with heartbeat connector */}
                <div className="relative">
                  {/* Heartbeat SVG line connecting the icons - with open heart design */}
                  <div className="hidden md:block absolute top-7 left-[15%] right-[15%] h-12 z-0">
                    <svg 
                      viewBox="0 0 500 48" 
                      className="w-full h-full" 
                      preserveAspectRatio="xMidYMid meet"
                    >
                      {/* First segment with EKG spikes */}
                      <path 
                        d="M0,24 L60,24 L70,24 L80,8 L90,40 L100,8 L110,40 L120,24 L180,24" 
                        fill="none" 
                        stroke="hsl(var(--heartbeat))" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Open heart that doesn't touch/close */}
                      <path 
                        d="M195,24 C195,18 202,13 210,18 C218,13 225,18 225,24 C225,32 210,40 210,40 C210,40 195,32 195,24" 
                        fill="none" 
                        stroke="hsl(var(--heartbeat))" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Middle segment with EKG spikes */}
                      <path 
                        d="M225,24 L280,24 L290,24 L300,8 L310,40 L320,8 L330,40 L340,24 L390,24" 
                        fill="none" 
                        stroke="hsl(var(--heartbeat))" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* End segment */}
                      <path 
                        d="M390,24 L420,24 L430,24 L440,8 L450,40 L460,8 L470,40 L480,24 L500,24" 
                        fill="none" 
                        stroke="hsl(var(--heartbeat))" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 md:gap-4 relative z-10">
                    {/* Step 1 */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="text-center"
                    >
                      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center shadow-sm">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-display text-lg text-primary font-semibold mb-1">
                        {language === "de" ? "Karte ziehen" : "Draw a card"}
                      </h3>
                      <p className="font-body text-ink/70 text-base leading-snug">
                        {language === "de" 
                          ? "Jede Woche eine neue Frage für euch beide." 
                          : "A new question for both of you every week."}
                      </p>
                    </motion.div>

                    {/* Step 2 */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="text-center"
                    >
                      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center shadow-sm">
                        <MessageCircle className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-display text-lg text-primary font-semibold mb-1">
                        {language === "de" ? "Tacheles reden" : "Speak openly"}
                      </h3>
                      <p className="font-body text-ink/70 text-base leading-snug">
                        {language === "de" 
                          ? "Ehrliche Gespräche ohne Ablenkung." 
                          : "Honest conversations without distractions."}
                      </p>
                    </motion.div>

                    {/* Step 3 */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="text-center"
                    >
                      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center shadow-sm">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-display text-lg text-primary font-semibold mb-1">
                        {language === "de" ? "Verbunden fühlen" : "Feel connected"}
                      </h3>
                      <p className="font-body text-ink/70 text-base leading-snug">
                        {language === "de" 
                          ? "Gemeinsam wachsen, Woche für Woche." 
                          : "Grow together, week by week."}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Problem & Metaphor Section */}
          <section className="px-4 py-12 md:py-16 bg-muted/30">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-3xl md:text-4xl text-primary mb-6 text-center">
                  {language === "de" ? "Warum Liebe Physik ist." : "Why Love is Physics."}
                </h2>
                <div className="font-body text-lg text-ink/80 leading-relaxed space-y-4">
                  <p>
                    {language === "de"
                      ? "Im Alltag verlieren Paare oft ihren gemeinsamen Rhythmus. Man lebt nebeneinander her, statt miteinander zu schwingen."
                      : "In everyday life, couples often lose their shared rhythm. They live side by side instead of swinging together."}
                  </p>
                  <p>
                    {language === "de"
                      ? "Unsere Philosophie basiert auf einer Entdeckung des Physikers Christiaan Huygens aus dem Jahr 1665: Pendeluhren, die am selben Balken hängen, passen ihre Schwingungen mit der Zeit aneinander an. Das ist Synchronisation."
                      : "Our philosophy is based on a discovery by physicist Christiaan Huygens in 1665: Pendulum clocks hanging from the same beam adjust their oscillations to each other over time. That is synchronization."}
                  </p>
                  <p className="font-semibold text-primary">
                    {language === "de"
                      ? "Hertz an Hertz ist dieser Balken für Eure Beziehung."
                      : "Hertz an Hertz is that beam for your relationship."}
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Cuckoo Clock Synchronization Section */}
          <CuckooClockSection />

          {/* Organic Image Divider */}
          <div className="flex justify-center py-8">
            <motion.img 
              src={hartschierleMadonna} 
              alt="Hartschierle Madonna"
              className="h-48 md:h-56 object-contain"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Three Pillars Section */}
          <section className="px-4 py-12 md:py-16">
            <div className="max-w-5xl mx-auto">
              <motion.h2
                className="font-display text-3xl md:text-4xl text-primary mb-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {language === "de" 
                  ? "Unser Fundament: Wissenschaft, Seele und Technologie." 
                  : "Our Foundation: Science, Soul, and Technology."}
              </motion.h2>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Pillar 1: Science */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0 }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl md:text-2xl text-primary mb-3">
                    {language === "de" ? "Die Wissenschaft" : "The Science"}
                    <span className="block text-sm font-body text-ink/60 mt-1">
                      {language === "de" ? "(Der Kopf)" : "(The Mind)"}
                    </span>
                  </h3>
                  <p className="font-body text-ink/80 leading-relaxed">
                    {language === "de"
                      ? "Keine Kalendersprüche. Unsere Impulse basieren auf den \"Gold-Standards\" der globalen Paartherapie – von Gottmans \"Love Labs\" bis zu Esther Perels Arbeit zu Begehren und Sicherheit."
                      : "No calendar slogans. Our prompts are based on the \"gold standards\" of global couples therapy – from Gottman's \"Love Labs\" to Esther Perel's work on desire and security."}
                  </p>
                </motion.div>

                {/* Pillar 2: Tradition */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl md:text-2xl text-primary mb-3">
                    {language === "de" ? "Die Tradition" : "The Tradition"}
                    <span className="block text-sm font-body text-ink/60 mt-1">
                      {language === "de" ? "(Das Herz)" : "(The Heart)"}
                    </span>
                  </h3>
                  <p className="font-body text-ink/80 leading-relaxed">
                    {language === "de"
                      ? "Wissenschaft ist oft laut. Inspiriert von einem historischen Eremiten und Maler aus dem Schwarzwald (\"Hartschierle\"), lehren unsere Karten auch die Kraft der Stille und des einfachen Daseins."
                      : "Science is often loud. Inspired by a historical hermit and painter from the Black Forest (\"Hartschierle\"), our cards also teach the power of silence and simple being."}
                  </p>
                </motion.div>

                {/* Pillar 3: Technology */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl md:text-2xl text-primary mb-3">
                    {language === "de" ? "Die Technologie" : "The Technology"}
                    <span className="block text-sm font-body text-ink/60 mt-1">
                      {language === "de" ? "(Der Turbo)" : "(The Turbo)"}
                    </span>
                  </h3>
                  <p className="font-body text-ink/80 leading-relaxed">
                    {language === "de"
                      ? "Unsere KI nutzt dieses Wissen als Baukasten. Sie kann die Karten auf Wunsch an eure aktuelle Lebensphase anpassen – sicher und privat. Damit ihr genau den Impuls bekommt, den ihr gerade braucht."
                      : "Our AI uses this knowledge as building blocks. It can customize the cards to your current life phase – securely and privately. So you get exactly the impulse you need right now."}
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* About Teaser Section */}
          <section className="px-4 py-12 md:py-16 bg-muted/30">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">
                    {language === "de" 
                      ? "Von Physikern, Eremiten und einer KI." 
                      : "Of Physicists, Hermits, and an AI."}
                  </h2>
                  <p className="font-body text-lg text-ink/80 leading-relaxed mb-6">
                    {language === "de"
                      ? "Wer steckt hinter dieser ungewöhnlichen Mischung? Entdeckt die Geschichte, wie ein Physik-Experiment aus dem 17. Jahrhundert, die Kunst eines längst verstorbenen Malers und modernste Algorithmen zusammengefunden haben, um eure Liebe zu stärken."
                      : "Who is behind this unusual mix? Discover the story of how a 17th-century physics experiment, the art of a long-deceased painter, and cutting-edge algorithms came together to strengthen your love."}
                  </p>
                  <Link to="/about">
                    <Button variant="outline" size="lg" className="font-body">
                      {language === "de" 
                        ? "Mehr über unsere Philosophie erfahren" 
                        : "Learn more about our philosophy"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <img 
                    src={hartschierleWanderer} 
                    alt="Hartschierle Wanderer"
                    className="h-56 md:h-72 object-contain"
                  />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Tuner Section with Cards */}
          <section ref={tunerRef} id="tuner" className="px-4 py-12 md:py-16">
            <div className="max-w-4xl mx-auto">
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">
                  {language === "de" ? "Vielleicht war es Fügung..." : "Maybe it was fate..."}
                </h2>
                <p className="font-body text-lg text-ink/80 leading-relaxed max-w-2xl mx-auto">
                  {language === "de"
                    ? "...dass Ihr genau jetzt hier seid. Doch jede Beziehung schwingt anders. Damit die Fragen nicht 'irgendwen', sondern Euch im Herzen treffen, brauchen wir ein kurzes Stimmungsbild. Eicht hier die Frequenz auf Eure aktuelle Situation:"
                    : "...that You are here right now. But every relationship resonates differently. So that the questions hit You in the heart, not just 'someone', we need a brief impression. Tune the frequency to Your current situation here:"}
                </p>
              </motion.div>

              {/* Tuner Input Block */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="border-2 border-primary/30 rounded-lg bg-card mb-8"
              >
                <div className="px-4 py-4 border-b border-primary/20">
                  <h3 className="font-display text-lg text-primary font-semibold">
                    {language === "de" ? "⚡ Eure Schwingung justieren" : "⚡ Adjust Your Resonance"}
                  </h3>
                </div>
                <TunerSection onGenerate={handleGenerate} isGenerating={isGenerating} />
              </motion.div>

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

              {/* Card Grid */}
              <div ref={cardGridRef} className="py-4">
                <div className="text-center mb-4">
                  <motion.h3
                    className="font-display text-2xl md:text-3xl text-primary"
                    key={`${isPersonalized}-${language}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {isPersonalized ? t("cards.personalized") : t("cards.sample")}
                  </motion.h3>
                  <p className="font-body text-sm text-ink/60 mt-1">
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

                {/* Order Production Button */}
                <AnimatePresence>
                  {isPersonalized && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="flex flex-col items-center gap-4 mt-8"
                    >
                      <Button
                        onClick={handleOrder}
                        disabled={isOrdering}
                        size="lg"
                        variant="secondary"
                        className="font-body text-lg px-8 py-6 bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        {isOrdering ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {language === "de" ? "Sende Auftrag an Druckerei..." : "Sending order to print..."}
                          </>
                        ) : (
                          <>
                            <Printer className="mr-2 h-5 w-5" />
                            {language === "de" ? "Personalisiertes Set bestellen" : "Order Personalized Set"}
                          </>
                        )}
                      </Button>

                      {/* Gift CTA - appears after personalization */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center"
                      >
                        <p className="font-body text-ink/60 text-sm mb-2">
                          {language === "de" 
                            ? "Kennst du ein Paar, das diese Erfahrung auch verdient?" 
                            : "Know a couple who deserves this experience too?"}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setIsGiftModalOpen(true)}
                          className="font-body border-primary/30 hover:border-primary hover:bg-primary/5"
                        >
                          <Gift className="mr-2 h-4 w-4" />
                          {language === "de" ? "Verschenke Hertz an Hertz" : "Gift Hertz an Hertz"}
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Conversion Footer - Always visible */}
              <ConversionFooter isVisible={true} />
            </div>
          </section>

          {/* Final CTA */}
          <section className="px-4 py-12 md:py-16 bg-primary/5">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-3xl md:text-4xl text-primary mb-6">
                  {language === "de" ? "Einzigartige Karten für Eure Zeit zu zweit" : "Unique Cards for Your Time Together"}
                </h2>
                <p className="font-body text-lg text-ink/70 mb-10 max-w-lg mx-auto leading-relaxed">
                  {language === "de"
                    ? "Ein hochwertig gefertigtes Kartenset für Eure gemeinsame Reise. Entdeckt Impulse für echte Verbindung – ganz flexibel in Eurem eigenen Rhythmus."
                    : "A beautifully crafted card set for your shared journey. Discover impulses for genuine connection – at your own pace."}
                </p>
                <Button 
                  onClick={scrollToTuner}
                  size="lg"
                  className="font-body text-lg px-8 py-6"
                >
                  {language === "de" ? "Hertz an Hertz starten" : "Start Hertz an Hertz"}
                </Button>
              </motion.div>
            </div>
          </section>
        </main>

        {/* Gift Flow Modal */}
        <GiftFlowModal
          isOpen={isGiftModalOpen}
          onClose={() => setIsGiftModalOpen(false)}
          onSubmit={(data) => {
            setIsGiftModalOpen(false);
            handleGenerate(data);
          }}
          isGenerating={isGenerating}
        />
      </div>
    </>
  );
};

export default Index;
