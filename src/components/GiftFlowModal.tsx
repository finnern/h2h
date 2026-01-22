import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, ArrowLeft, ArrowRight, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TunerData } from "@/components/TunerSection";

// Phase options
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

interface GiftFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TunerData) => void;
  isGenerating: boolean;
}

type Step = "names" | "details" | "insider" | "review";

export const GiftFlowModal = ({ isOpen, onClose, onSubmit, isGenerating }: GiftFlowModalProps) => {
  const { language } = useLanguage();
  const [step, setStep] = useState<Step>("names");
  
  const [formData, setFormData] = useState({
    partnerA: "",
    partnerB: "",
    gifterName: "",
    phase: "",
    focus: "",
    culture: "",
    context: "",
    additionalInsights: "",
  });

  const handleNext = () => {
    const steps: Step[] = ["names", "details", "insider", "review"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: Step[] = ["names", "details", "insider", "review"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      isGift: true,
      historyOptIn: false,
    });
  };

  const canProceedFromNames = formData.partnerA && formData.partnerB && formData.gifterName;
  const canProceedFromDetails = formData.phase && formData.focus;

  const getPhaseLabel = (value: string) => {
    const option = phaseOptions.find(o => o.value === value);
    return option ? (language === "de" ? option.labelDe : option.labelEn) : "";
  };

  const getFocusLabel = (value: string) => {
    const option = focusOptions.find(o => o.value === value);
    return option ? (language === "de" ? option.labelDe : option.labelEn) : "";
  };

  const resetAndClose = () => {
    setStep("names");
    setFormData({
      partnerA: "",
      partnerB: "",
      gifterName: "",
      phase: "",
      focus: "",
      culture: "",
      context: "",
      additionalInsights: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card border-2 border-primary/30">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-primary flex items-center gap-2">
            <Gift className="w-6 h-6" />
            {language === "de" ? "Geschenk für Freunde" : "Gift for Friends"}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {["names", "details", "insider", "review"].map((s, i) => (
              <div
                key={s}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  s === step ? "bg-primary" : "bg-ink/20"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Names */}
            {step === "names" && (
              <motion.div
                key="names"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="font-body text-ink/70 text-sm mb-4">
                  {language === "de"
                    ? "Für wen möchtest du Karten erstellen?"
                    : "Who would you like to create cards for?"}
                </p>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="font-body text-ink font-semibold">
                      {language === "de" ? "Name von Freund A" : "Friend A's name"}
                    </Label>
                    <Input
                      placeholder={language === "de" ? "z.B. Anna" : "e.g. Anna"}
                      value={formData.partnerA}
                      onChange={(e) => setFormData({ ...formData, partnerA: e.target.value })}
                      className="font-body bg-paper border-ink/30 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-body text-ink font-semibold">
                      {language === "de" ? "Name von Freund B" : "Friend B's name"}
                    </Label>
                    <Input
                      placeholder={language === "de" ? "z.B. Max" : "e.g. Max"}
                      value={formData.partnerB}
                      onChange={(e) => setFormData({ ...formData, partnerB: e.target.value })}
                      className="font-body bg-paper border-ink/30 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label className="font-body text-ink font-semibold">
                      {language === "de" ? "Dein Name (Schenker)" : "Your name (Gift giver)"}
                    </Label>
                    <Input
                      placeholder={language === "de" ? "Wie heißt du?" : "What's your name?"}
                      value={formData.gifterName}
                      onChange={(e) => setFormData({ ...formData, gifterName: e.target.value })}
                      className="font-body bg-paper border-ink/30 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleNext}
                    disabled={!canProceedFromNames}
                    className="w-full font-body"
                  >
                    {language === "de" ? "Weiter" : "Continue"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Phase & Focus */}
            {step === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <p className="font-body text-ink/70 text-sm">
                  {language === "de"
                    ? `Was weißt du über ${formData.partnerA} & ${formData.partnerB}?`
                    : `What do you know about ${formData.partnerA} & ${formData.partnerB}?`}
                </p>

                {/* Phase Selection */}
                <div className="space-y-2">
                  <Label className="font-body text-ink font-semibold">
                    {language === "de" ? "Beziehungsphase" : "Relationship Phase"}
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {phaseOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, phase: option.value })}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          formData.phase === option.value
                            ? "border-primary bg-primary/5"
                            : "border-ink/20 hover:border-ink/40"
                        }`}
                      >
                        <span className="text-lg">{option.icon}</span>
                        <div className="font-body text-sm font-semibold text-ink mt-1">
                          {language === "de" ? option.labelDe : option.labelEn}
                        </div>
                        <div className="font-body text-xs text-ink/60">
                          {language === "de" ? option.descDe : option.descEn}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Focus Selection */}
                <div className="space-y-2">
                  <Label className="font-body text-ink font-semibold">
                    {language === "de" ? "Was brauchen sie?" : "What do they need?"}
                  </Label>
                  <div className="space-y-2">
                    {focusOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, focus: option.value })}
                        className={`w-full p-3 rounded-lg border-2 flex items-center gap-3 transition-all ${
                          formData.focus === option.value
                            ? "border-primary bg-primary/5"
                            : "border-ink/20 hover:border-ink/40"
                        }`}
                      >
                        <span className="text-lg">{option.icon}</span>
                        <span className="font-body text-ink">
                          {language === "de" ? option.labelDe : option.labelEn}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={handleBack} className="font-body">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    {language === "de" ? "Zurück" : "Back"}
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!canProceedFromDetails}
                    className="flex-1 font-body"
                  >
                    {language === "de" ? "Weiter" : "Continue"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Insider Info */}
            {step === "insider" && (
              <motion.div
                key="insider"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="font-body text-ink/70 text-sm">
                  {language === "de"
                    ? "Je mehr wir wissen, desto persönlicher die Karten!"
                    : "The more we know, the more personal the cards!"}
                </p>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="font-body text-ink font-semibold">
                      {language === "de" ? "Herkunft / Wurzeln" : "Background / Roots"}
                    </Label>
                    <Input
                      placeholder={language === "de" ? "z.B. Bayern, Österreich..." : "e.g. Bavaria, Austria..."}
                      value={formData.culture}
                      onChange={(e) => setFormData({ ...formData, culture: e.target.value })}
                      className="font-body bg-paper border-ink/30 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-body text-ink font-semibold">
                      {language === "de" ? "Aktuelle Situation" : "Current Situation"}
                    </Label>
                    <Input
                      placeholder={language === "de" ? "z.B. Hausbau, Baby..." : "e.g. Building a house, baby..."}
                      value={formData.context}
                      onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                      className="font-body bg-paper border-ink/30 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-body text-ink font-semibold">
                      {language === "de" ? "Der Insider-Check" : "The Insider Check"}
                    </Label>
                    <textarea
                      placeholder={language === "de"
                        ? "Was ist ihr Insider-Witz? Woher kennst du sie? Was macht sie besonders?"
                        : "What's their inside joke? How do you know them? What makes them special?"}
                      value={formData.additionalInsights}
                      onChange={(e) => setFormData({ ...formData, additionalInsights: e.target.value })}
                      className="w-full min-h-[100px] p-3 font-body bg-paper border border-ink/30 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-y text-ink placeholder:text-ink/40"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={handleBack} className="font-body">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    {language === "de" ? "Zurück" : "Back"}
                  </Button>
                  <Button onClick={handleNext} className="flex-1 font-body">
                    {language === "de" ? "Überprüfen" : "Review"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review */}
            {step === "review" && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="font-body text-ink/70 text-sm">
                  {language === "de"
                    ? "Alles korrekt? Dann generieren wir die Karten!"
                    : "Everything correct? Then let's generate the cards!"}
                </p>

                <div className="bg-muted/50 rounded-lg p-4 space-y-3 border border-border/50">
                  <div className="flex justify-between">
                    <span className="font-body text-ink/60 text-sm">
                      {language === "de" ? "Für:" : "For:"}
                    </span>
                    <span className="font-body font-semibold text-ink">
                      {formData.partnerA} & {formData.partnerB}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-body text-ink/60 text-sm">
                      {language === "de" ? "Von:" : "From:"}
                    </span>
                    <span className="font-body font-semibold text-ink">
                      {formData.gifterName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-body text-ink/60 text-sm">
                      {language === "de" ? "Phase:" : "Phase:"}
                    </span>
                    <span className="font-body text-ink">
                      {getPhaseLabel(formData.phase)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-body text-ink/60 text-sm">
                      {language === "de" ? "Fokus:" : "Focus:"}
                    </span>
                    <span className="font-body text-ink">
                      {getFocusLabel(formData.focus)}
                    </span>
                  </div>
                  {formData.culture && (
                    <div className="flex justify-between">
                      <span className="font-body text-ink/60 text-sm">
                        {language === "de" ? "Herkunft:" : "Background:"}
                      </span>
                      <span className="font-body text-ink">{formData.culture}</span>
                    </div>
                  )}
                  {formData.context && (
                    <div className="flex justify-between">
                      <span className="font-body text-ink/60 text-sm">
                        {language === "de" ? "Situation:" : "Situation:"}
                      </span>
                      <span className="font-body text-ink">{formData.context}</span>
                    </div>
                  )}
                  {formData.additionalInsights && (
                    <div className="pt-2 border-t border-border/50">
                      <span className="font-body text-ink/60 text-sm block mb-1">
                        {language === "de" ? "Insider:" : "Insider:"}
                      </span>
                      <p className="font-body text-ink text-sm">
                        {formData.additionalInsights}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={handleBack} className="font-body">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    {language === "de" ? "Ändern" : "Edit"}
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isGenerating}
                    className="flex-1 font-body bg-primary hover:bg-primary/90"
                  >
                    {isGenerating ? (
                      <>{language === "de" ? "Generiere..." : "Generating..."}</>
                    ) : (
                      <>
                        <Sparkles className="mr-2 w-4 h-4" />
                        {language === "de" ? "Karten erstellen" : "Create Cards"}
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
