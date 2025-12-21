import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { HeartbeatLine } from "./HeartbeatLine";

export interface TunerData {
  partnerA: string;
  partnerB: string;
  lifecycle: string;
  scientific: boolean;
  spiritual: boolean;
  culture: string;
  context: string;
}

interface TunerSectionProps {
  onGenerate: (data: TunerData) => void;
  isGenerating: boolean;
}

const lifecycleOptions = [
  { value: "fresh-spark", label: "Fresh Spark (0-2y)" },
  { value: "deep-groove", label: "Deep Groove (3-7y)" },
  { value: "vintage-gold", label: "Vintage Gold (8y+)" },
  { value: "navigating-storms", label: "Navigating Storms" },
];

export const TunerSection = ({ onGenerate, isGenerating }: TunerSectionProps) => {
  const [formData, setFormData] = useState<TunerData>({
    partnerA: "",
    partnerB: "",
    lifecycle: "",
    scientific: false,
    spiritual: false,
    culture: "",
    context: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const isFormValid = formData.partnerA && formData.partnerB && formData.lifecycle;

  return (
    <motion.section
      className="w-full max-w-4xl mx-auto px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 border border-border">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-display text-4xl md:text-5xl text-ink mb-2">
            The Tuner
          </h2>
          <p className="font-body text-lg text-ink-light italic">
            Tune your frequency to sync your hearts
          </p>
          <HeartbeatLine className="mt-4 max-w-md mx-auto opacity-50" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Names row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partnerA" className="font-body text-ink">
                Partner A
              </Label>
              <Input
                id="partnerA"
                placeholder="Enter name..."
                value={formData.partnerA}
                onChange={(e) => setFormData({ ...formData, partnerA: e.target.value })}
                className="font-body bg-paper border-border focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partnerB" className="font-body text-ink">
                Partner B
              </Label>
              <Input
                id="partnerB"
                placeholder="Enter name..."
                value={formData.partnerB}
                onChange={(e) => setFormData({ ...formData, partnerB: e.target.value })}
                className="font-body bg-paper border-border focus:ring-primary"
              />
            </div>
          </div>

          {/* Lifecycle dropdown */}
          <div className="space-y-2">
            <Label htmlFor="lifecycle" className="font-body text-ink">
              Relationship Lifecycle
            </Label>
            <Select
              value={formData.lifecycle}
              onValueChange={(value) => setFormData({ ...formData, lifecycle: value })}
            >
              <SelectTrigger className="font-body bg-paper border-border">
                <SelectValue placeholder="Select your phase..." />
              </SelectTrigger>
              <SelectContent>
                {lifecycleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="font-body">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Frequency toggles */}
          <div className="space-y-2">
            <Label className="font-body text-ink">Frequency</Label>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scientific"
                  checked={formData.scientific}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, scientific: checked as boolean })
                  }
                />
                <Label htmlFor="scientific" className="font-body text-ink-light cursor-pointer">
                  Scientific
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="spiritual"
                  checked={formData.spiritual}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, spiritual: checked as boolean })
                  }
                />
                <Label htmlFor="spiritual" className="font-body text-ink-light cursor-pointer">
                  Spiritual
                </Label>
              </div>
            </div>
          </div>

          {/* Culture and Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="culture" className="font-body text-ink">
                Where are your roots?
              </Label>
              <Input
                id="culture"
                placeholder="e.g., Swabian, Berlin, USA/German mix..."
                value={formData.culture}
                onChange={(e) => setFormData({ ...formData, culture: e.target.value })}
                className="font-body bg-paper border-border focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="context" className="font-body text-ink">
                What is the background noise right now?
              </Label>
              <Input
                id="context"
                placeholder="e.g., New baby, moved house..."
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                className="font-body bg-paper border-border focus:ring-primary"
              />
            </div>
          </div>

          {/* Generate button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={!isFormValid || isGenerating}
              className="w-full py-6 text-xl font-display bg-primary hover:bg-primary/90 text-primary-foreground shadow-elevated transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  SYNC / GENERATE DECK
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </motion.section>
  );
};
