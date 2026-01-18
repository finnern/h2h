import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export interface TunerData {
  partnerA: string;
  partnerB: string;
  gifterName?: string;
  isGift: boolean;
  phase: string;
  focus: string;
  culture: string;
  context: string;
  additionalInsights?: string;
  historyOptIn: boolean;
}

interface TunerSectionProps {
  onGenerate: (data: TunerData) => void;
  isGenerating: boolean;
}

// Phase options with descriptions
const phaseOptions = [
  { 
    value: "fresh-spark", 
    labelDe: "Frischer Funke", 
    labelEn: "Fresh Spark",
    descDe: "0–2 Jahre",
    descEn: "0–2 years",
    icon: "✨"
  },
  { 
    value: "rock-solid", 
    labelDe: "Fels in der Brandung", 
    labelEn: "Rock Solid",
    descDe: "Stabil",
    descEn: "Stable",
    icon: "🪨"
  },
  { 
    value: "rush-hour", 
    labelDe: "Rushhour", 
    labelEn: "Rush Hour",
    descDe: "Stress / Kinder / Karriere",
    descEn: "Stress / Kids / Career",
    icon: "⚡"
  },
  { 
    value: "golden-years", 
    labelDe: "Goldene Jahre", 
    labelEn: "Golden Years",
    descDe: "Neu-Erfindung",
    descEn: "Reinvention",
    icon: "🌟"
  },
];

// Focus options
const focusOptions = [
  { 
    value: "lightness", 
    labelDe: "Leichtigkeit & Lachen", 
    labelEn: "Lightness & Laughter",
    icon: "☀️"
  },
  { 
    value: "depth", 
    labelDe: "Tiefe & Verstehen", 
    labelEn: "Depth & Understanding",
    icon: "🌊"
  },
  { 
    value: "support", 
    labelDe: "Halt & Rückenwind", 
    labelEn: "Support & Encouragement",
    icon: "🛡️"
  },
];

// Pendulum Loading Animation Component
const PendulumLoader = () => (
  <div className="flex items-center justify-center gap-3">
    <motion.div
      className="relative w-8 h-12"
      style={{ transformOrigin: "top center" }}
    >
      {/* Pendulum rod */}
      <div className="absolute top-0 left-1/2 w-0.5 h-10 bg-ink -translate-x-1/2" />
      {/* Pendulum weight */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-4 h-4 rounded-full bg-primary -translate-x-1/2"
        animate={{ 
          x: [-12, 12, -12],
          rotate: [-30, 30, -30]
        }}
        transition={{ 
          duration: 1.2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
    </motion.div>
    <span className="font-body text-ink">Synchronisiere...</span>
  </div>
);

// Mechanical Toggle Component
const MechanicalToggle = ({ 
  isGift, 
  onChange,
  language
}: { 
  isGift: boolean; 
  onChange: (value: boolean) => void;
  language: string;
}) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* The balance beam container */}
      <div className="relative w-full max-w-md">
        {/* Center pivot */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-4 h-4 z-10">
          <div className="w-4 h-4 rounded-full border-2 border-ink bg-paper" />
          <div className="w-0.5 h-3 bg-ink mx-auto" />
        </div>
        
        {/* Balance beam */}
        <motion.div 
          className="relative mt-6 h-1 bg-ink rounded-full mx-8"
          animate={{ 
            rotate: isGift ? 3 : -3 
          }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20 
          }}
          style={{ transformOrigin: "center center" }}
        >
          {/* Left weight - "Für uns" */}
          <button
            onClick={() => onChange(false)}
            className={`absolute left-0 -top-8 -translate-x-1/2 flex flex-col items-center transition-all duration-300 ${
              !isGift ? "scale-110" : "opacity-60"
            }`}
          >
            <motion.div 
              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-colors ${
                !isGift 
                  ? "border-primary bg-primary/10" 
                  : "border-ink/30 bg-paper"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">💕</span>
            </motion.div>
            <span className={`mt-2 font-body text-sm ${!isGift ? "text-primary font-semibold" : "text-ink-light"}`}>
              {language === "de" ? "Für uns" : "For us"}
            </span>
          </button>

          {/* Right weight - "Für Freunde" */}
          <button
            onClick={() => onChange(true)}
            className={`absolute right-0 -top-8 translate-x-1/2 flex flex-col items-center transition-all duration-300 ${
              isGift ? "scale-110" : "opacity-60"
            }`}
          >
            <motion.div 
              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-colors ${
                isGift 
                  ? "border-primary bg-primary/10" 
                  : "border-ink/30 bg-paper"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">🎁</span>
            </motion.div>
            <span className={`mt-2 font-body text-sm ${isGift ? "text-primary font-semibold" : "text-ink-light"}`}>
              {language === "de" ? "Für Freunde" : "For friends"}
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

// Phase Tile Component with pendulum aesthetic
const PhaseTile = ({ 
  option, 
  isSelected, 
  onClick,
  language
}: { 
  option: typeof phaseOptions[0];
  isSelected: boolean;
  onClick: () => void;
  language: string;
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`relative p-4 rounded-lg border-2 transition-all ${
        isSelected 
          ? "border-primary bg-primary/5 shadow-card" 
          : "border-ink/20 bg-paper hover:border-ink/40"
      }`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Pendulum indicator */}
      <motion.div
        className="absolute -top-1 left-1/2 -translate-x-1/2"
        initial={false}
        animate={{ 
          opacity: isSelected ? 1 : 0,
          y: isSelected ? 0 : -5
        }}
      >
        <div className="w-0.5 h-3 bg-primary mx-auto" />
        <div className="w-2 h-2 rounded-full bg-primary" />
      </motion.div>

      <div className="text-2xl mb-2">{option.icon}</div>
      <div className="font-body font-semibold text-ink text-sm leading-tight">
        {language === "de" ? option.labelDe : option.labelEn}
      </div>
      <div className="font-body text-xs text-ink-light mt-1">
        {language === "de" ? option.descDe : option.descEn}
      </div>
    </motion.button>
  );
};

// Focus Option Component
const FocusOption = ({ 
  option, 
  isSelected, 
  onClick,
  language
}: { 
  option: typeof focusOptions[0];
  isSelected: boolean;
  onClick: () => void;
  language: string;
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
        isSelected 
          ? "border-primary bg-primary/5" 
          : "border-ink/20 bg-paper hover:border-ink/40"
      }`}
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Mechanical lock indicator */}
      <motion.div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          isSelected ? "border-primary" : "border-ink/30"
        }`}
        animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-2.5 h-2.5 rounded-full bg-primary"
          initial={false}
          animate={{ 
            scale: isSelected ? 1 : 0,
            opacity: isSelected ? 1 : 0
          }}
        />
      </motion.div>
      
      <span className="text-xl">{option.icon}</span>
      <span className="font-body text-ink">
        {language === "de" ? option.labelDe : option.labelEn}
      </span>
    </motion.button>
  );
};

export const TunerSection = ({ onGenerate, isGenerating }: TunerSectionProps) => {
  const { language } = useLanguage();
  
  const [formData, setFormData] = useState<TunerData>({
    partnerA: "",
    partnerB: "",
    gifterName: "",
    isGift: false,
    phase: "",
    focus: "",
    culture: "",
    context: "",
    historyOptIn: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const isFormValid = formData.partnerA && formData.partnerB && formData.phase && formData.focus;

  // Dynamic placeholders based on gift mode
  const getNamePlaceholders = () => {
    if (formData.isGift) {
      return {
        a: language === "de" ? "Name von Freund A" : "Friend A's name",
        b: language === "de" ? "Name von Freund B" : "Friend B's name",
      };
    }
    return {
      a: language === "de" ? "Dein Name" : "Your name",
      b: language === "de" ? "Name deines Partners" : "Partner's name",
    };
  };

  const placeholders = getNamePlaceholders();

  const getInsightsPlaceholder = () => {
    if (formData.isGift) {
      return language === "de"
        ? "Erzähl uns kurz: Bauen sie gerade ein Haus? Was ist ihr Insider? Woher kennt ihr euch?"
        : "Tell us briefly: Are they building a house? What's their inside joke? How do you know them?";
    }
    return language === "de"
      ? "Erzählt kurz, was gerade los ist: Seid ihr erschöpft vom Elternsein? Plant ihr ein großes Abenteuer? Was beschäftigt euch?"
      : "Tell us briefly what's going on: Are you exhausted from parenting? Planning a big adventure? What's on your mind?";
  };

  return (
    <div className="p-4 md:p-8">
      {/* Decorative header line */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex-1 h-px bg-ink/20" />
        <div className="px-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-ink/40">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" />
            <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth="1" />
            <line x1="12" y1="12" x2="12" y2="7" stroke="currentColor" strokeWidth="1.5" />
            <line x1="12" y1="12" x2="16" y2="14" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        <div className="flex-1 h-px bg-ink/20" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Toggle: Für uns / Für Freunde */}
        <div className="py-6">
          <MechanicalToggle 
            isGift={formData.isGift} 
            onChange={(value) => setFormData({ ...formData, isGift: value })}
            language={language}
          />
        </div>

        {/* Names section */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partnerA" className="font-body text-ink font-semibold">
                {language === "de" ? "Name A" : "Name A"}
              </Label>
              <Input
                id="partnerA"
                placeholder={placeholders.a}
                value={formData.partnerA}
                onChange={(e) => setFormData({ ...formData, partnerA: e.target.value })}
                className="font-body bg-paper border-ink/30 focus:border-primary focus:ring-primary/20 rounded-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partnerB" className="font-body text-ink font-semibold">
                {language === "de" ? "Name B" : "Name B"}
              </Label>
              <Input
                id="partnerB"
                placeholder={placeholders.b}
                value={formData.partnerB}
                onChange={(e) => setFormData({ ...formData, partnerB: e.target.value })}
                className="font-body bg-paper border-ink/30 focus:border-primary focus:ring-primary/20 rounded-sm"
              />
            </div>
          </div>

          {/* Gifter name - only visible in gift mode */}
          <AnimatePresence>
            {formData.isGift && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <Label htmlFor="gifterName" className="font-body text-ink font-semibold">
                  {language === "de" ? "Dein Name (Schenker)" : "Your name (Gift giver)"}
                </Label>
                <Input
                  id="gifterName"
                  placeholder={language === "de" ? "Wie heißt du?" : "What's your name?"}
                  value={formData.gifterName}
                  onChange={(e) => setFormData({ ...formData, gifterName: e.target.value })}
                  className="font-body bg-paper border-ink/30 focus:border-primary focus:ring-primary/20 rounded-sm"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-ink/10" />
          <span className="text-ink/30 text-xs font-body tracking-widest uppercase">Phase</span>
          <div className="flex-1 h-px bg-ink/10" />
        </div>

        {/* Phase Selection - Visual Tiles */}
        <div className="space-y-3">
          <Label className="font-body text-ink font-semibold">
            {language === "de" ? "Wo steht die Beziehung?" : "Where is the relationship?"}
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {phaseOptions.map((option) => (
              <PhaseTile
                key={option.value}
                option={option}
                isSelected={formData.phase === option.value}
                onClick={() => setFormData({ ...formData, phase: option.value })}
                language={language}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-ink/10" />
          <span className="text-ink/30 text-xs font-body tracking-widest uppercase">Fokus</span>
          <div className="flex-1 h-px bg-ink/10" />
        </div>

        {/* Focus Selection */}
        <div className="space-y-3">
          <Label className="font-body text-ink font-semibold">
            {language === "de" ? "Was braucht die Beziehung?" : "What does the relationship need?"}
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {focusOptions.map((option) => (
              <FocusOption
                key={option.value}
                option={option}
                isSelected={formData.focus === option.value}
                onClick={() => setFormData({ ...formData, focus: option.value })}
                language={language}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-ink/10" />
          <span className="text-ink/30 text-xs font-body tracking-widest uppercase">
            {language === "de" ? "Insider" : "Insider"}
          </span>
          <div className="flex-1 h-px bg-ink/10" />
        </div>

        {/* Culture and Context - condensed row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="culture" className="font-body text-ink font-semibold">
              {language === "de" ? "Herkunft / Wurzeln" : "Background / Roots"}
            </Label>
            <Input
              id="culture"
              placeholder={language === "de" ? "z.B. Süddeutsch, Österreich..." : "e.g. Southern German, Austria..."}
              value={formData.culture}
              onChange={(e) => setFormData({ ...formData, culture: e.target.value })}
              className="font-body bg-paper border-ink/30 focus:border-primary focus:ring-primary/20 rounded-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="context" className="font-body text-ink font-semibold">
              {language === "de" ? "Aktuelle Lebenslage" : "Current situation"}
            </Label>
            <Input
              id="context"
              placeholder={language === "de" ? "z.B. Hausbau, Baby, Jobwechsel..." : "e.g. Building a house, baby, job change..."}
              value={formData.context}
              onChange={(e) => setFormData({ ...formData, context: e.target.value })}
              className="font-body bg-paper border-ink/30 focus:border-primary focus:ring-primary/20 rounded-sm"
            />
          </div>
        </div>

        {/* The Insider Check - Text Area */}
        <div className="space-y-2">
          <Label htmlFor="additionalInsights" className="font-body text-ink font-semibold">
            {language === "de" ? "Der Insider-Check" : "The Insider Check"}
          </Label>
          <textarea
            id="additionalInsights"
            placeholder={getInsightsPlaceholder()}
            value={formData.additionalInsights || ""}
            onChange={(e) => setFormData({ ...formData, additionalInsights: e.target.value })}
            className="w-full min-h-[120px] p-4 font-body bg-paper border border-ink/30 rounded-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-y text-ink placeholder:text-ink/40"
          />
        </div>

        {/* History Opt-In Checkbox */}
        <div className="flex items-start space-x-3 p-4 bg-paper-aged/50 rounded-sm border border-ink/10">
          <Checkbox
            id="historyOptIn"
            checked={formData.historyOptIn}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, historyOptIn: checked as boolean })
            }
            className="mt-0.5 border-ink/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <Label 
            htmlFor="historyOptIn" 
            className="font-body text-ink-light cursor-pointer leading-relaxed text-sm"
          >
            {language === "de" 
              ? "Ich möchte, dass meine Eingaben gespeichert werden, um das Erlebnis bei späteren Besuchen zu verbessern."
              : "I'd like my inputs to be saved to improve the experience on future visits."}
          </Label>
        </div>

        {/* Generate button - now with pendulum loading */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={!isFormValid || isGenerating}
            className="w-full py-6 text-xl font-body font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-elevated transition-all hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 rounded-sm"
          >
            {isGenerating ? (
              <PendulumLoader />
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                {language === "de" ? "Synchronisieren" : "Synchronize"}
              </>
            )}
          </Button>
        </div>

        {/* Trust Badge */}
        <div className="mt-4 p-4 bg-paper-aged/30 rounded-sm border border-ink/5">
          <p className="text-xs text-ink/60 leading-relaxed text-center font-body">
            {language === "de" 
              ? "✨ Technologie trifft Vertrauen: Eure Karten werden live von einer KI generiert. Eure Geschichten sind uns dabei heilig – wir verarbeiten eure Eingaben streng vertraulich und DSGVO-konform."
              : "✨ Technology meets trust: Your cards are generated live by AI. Your stories are sacred to us – we process your input strictly confidentially and GDPR-compliant."}
          </p>
        </div>
      </form>
    </div>
  );
};
