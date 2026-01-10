import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { TunerSection, TunerData } from "@/components/TunerSection";
import { CardGrid } from "@/components/CardGrid";
import { ConversionFooter } from "@/components/ConversionFooter";
import { HeartbeatLine } from "@/components/HeartbeatLine";
import { LanguageToggle } from "@/components/LanguageToggle";
import { CuckooClockSection } from "@/components/ui/CuckooClockSection";
import AuthButton from "@/components/AuthButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfileData } from "@/hooks/useProfileData";
import { useSessionId } from "@/hooks/useSessionId";
import { Archetype } from "@/components/FlippableCard";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Sparkles, ArrowRight, Printer, Loader2, FileText, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSupabaseWithSession } from "@/lib/supabaseWithSession";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const { partnerA, partnerB, lifecycle, scientific, spiritual, culture } = data;
  
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
        initialFlipped: true,
      },
      {
        archetype: "diamonds" as Archetype,
        questions: {
          light: `${partnerB}, welche 'Geld-Geschichte' hat dir deine Familie beigebracht, die heute noch nachklingt?`,
          deep: `Mit ${lifecycleContext.focus}, welches Vermächtnis wollen ${partnerA} und ${partnerB} aufbauen?`,
        },
        initialFlipped: true,
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
      initialFlipped: true,
    },
    {
      archetype: "diamonds" as Archetype,
      questions: {
        light: `${partnerB}, what 'money story' did your family teach you that still echoes today?`,
        deep: `With ${lifecycleContext.focus}, what legacy do ${partnerA} and ${partnerB} want to build?`,
      },
      initialFlipped: true,
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
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);
  const cardGridRef = useRef<HTMLDivElement>(null);
  const tunerRef = useRef<HTMLDivElement>(null);

  const scrollToTuner = () => {
    setOpenAccordion("tuner");
    setTimeout(() => {
      tunerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleGenerate = useCallback(async (data: TunerData) => {
    setIsGenerating(true);
    setShowHeartbeatAnimation(true);
    setIsShuffling(true);
    
    setOpenAccordion(undefined);
    
    setTimeout(() => {
      cardGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);

    let n8nCards = null;
    try {
      const result = await saveProfileAndTriggerProduction(
        {
          coupleNames: `${data.partnerA} & ${data.partnerB}`,
          historyOptIn: data.historyOptIn,
        },
        {
          coreEvents: data.additionalInsights,
          sharedValues: `${data.scientific ? 'Scientific' : ''} ${data.spiritual ? 'Spiritual' : ''}`.trim(),
          constraints: data.context,
        },
        {
          partnerA: data.partnerA,
          partnerB: data.partnerB,
          lifecycle: data.lifecycle,
          scientific: data.scientific,
          spiritual: data.spiritual,
          culture: data.culture,
          context: data.context,
          additionalInsights: data.additionalInsights,
          language,
        }
      );
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
                  <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-primary mb-4 leading-tight">
                    {language === "de" 
                      ? "Hertz an Hertz – Das Sync-Deck für Paare." 
                      : "Hertz an Hertz – The Sync Deck for Couples."}
                  </h1>
                  <p className="font-body text-lg md:text-xl text-ink/80 mb-8 leading-relaxed">
                    {language === "de"
                      ? "52 Wochen. 52 Fragen. Euer Ritual, um im Alltag wieder einen gemeinsamen Takt zu finden."
                      : "52 weeks. 52 questions. Your ritual to find a shared rhythm in everyday life."}
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
                  {/* Heartbeat SVG line connecting the icons */}
                  <div className="hidden md:block absolute top-7 left-[15%] right-[15%] h-8 z-0">
                    <svg 
                      viewBox="0 0 400 32" 
                      className="w-full h-full" 
                      preserveAspectRatio="none"
                    >
                      <path 
                        d="M0,16 L80,16 L90,16 L100,4 L110,28 L120,4 L130,28 L140,16 L200,16 L210,16 L220,4 L230,28 L240,4 L250,28 L260,16 L320,16 L330,16 L340,4 L350,28 L360,4 L370,28 L380,16 L400,16" 
                        fill="none" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth="2" 
                        strokeOpacity="0.25"
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
                      ? "Hertz an Hertz ist dieser Balken für eure Beziehung."
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
          <section ref={tunerRef} className="px-4 py-12 md:py-16">
            <div className="max-w-4xl mx-auto">
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">
                  {language === "de" ? "Bereit für Resonanz?" : "Ready for Resonance?"}
                </h2>
                <p className="font-body text-lg text-ink/80">
                  {language === "de"
                    ? "Synchronisiert euch immer wieder neu. Damit das entsteht, wonach wir uns alle sehnen: Eine Liebe, die wächst und gedeiht."
                    : "Synchronize yourselves anew, again and again. So that what we all long for emerges: A love that grows and thrives."}
                </p>
              </motion.div>

              {/* Accordion for Tuner */}
              <Accordion 
                type="single" 
                collapsible 
                value={openAccordion} 
                onValueChange={setOpenAccordion}
                className="mb-8"
              >
                <AccordionItem value="tuner" className="border-2 border-primary/30 rounded-lg bg-card">
                  <AccordionTrigger className="px-4 py-4 font-display text-lg text-primary hover:no-underline font-semibold">
                    {t("accordion.tuner")}
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <TunerSection onGenerate={handleGenerate} isGenerating={isGenerating} />
                  </AccordionContent>
                </AccordionItem>
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
                      className="flex justify-center mt-8"
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
                <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">
                  {language === "de" ? "Hertz an Hertz" : "Hertz an Hertz"}
                </h2>
                <p className="font-body text-lg text-ink/80 mb-8">
                  {language === "de"
                    ? "52 Karten für 52 Date Nights. Personalisierte Fragen, die eure Verbindung vertiefen."
                    : "52 cards for 52 date nights. Personalized questions that deepen your connection."}
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
      </div>
    </>
  );
};

export default Index;
