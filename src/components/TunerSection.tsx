import { useState } from "react";
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
import { useLanguage } from "@/contexts/LanguageContext";

export interface TunerData {
  partnerA: string;
  partnerB: string;
  lifecycle: string;
  scientific: boolean;
  spiritual: boolean;
  culture: string;
  context: string;
  additionalInsights?: string;
}

interface TunerSectionProps {
  onGenerate: (data: TunerData) => void;
  isGenerating: boolean;
}

export const TunerSection = ({ onGenerate, isGenerating }: TunerSectionProps) => {
  const { t } = useLanguage();
  
  const lifecycleOptions = [
    { value: "fresh-spark", labelKey: "tuner.lifecycle.freshSpark" },
    { value: "deep-groove", labelKey: "tuner.lifecycle.deepGroove" },
    { value: "vintage-gold", labelKey: "tuner.lifecycle.vintageGold" },
    { value: "navigating-storms", labelKey: "tuner.lifecycle.navigatingStorms" },
  ];

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
    <div className="p-4 md:p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
          {/* Names row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partnerA" className="font-body text-ink">
                {t("tuner.partnerA")}
              </Label>
              <Input
                id="partnerA"
                placeholder={t("tuner.enterName")}
                value={formData.partnerA}
                onChange={(e) => setFormData({ ...formData, partnerA: e.target.value })}
                className="font-body bg-paper border-border focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partnerB" className="font-body text-ink">
                {t("tuner.partnerB")}
              </Label>
              <Input
                id="partnerB"
                placeholder={t("tuner.enterName")}
                value={formData.partnerB}
                onChange={(e) => setFormData({ ...formData, partnerB: e.target.value })}
                className="font-body bg-paper border-border focus:ring-primary"
              />
            </div>
          </div>

          {/* Lifecycle dropdown */}
          <div className="space-y-2">
            <Label htmlFor="lifecycle" className="font-body text-ink">
              {t("tuner.lifecycle")}
            </Label>
            <Select
              value={formData.lifecycle}
              onValueChange={(value) => setFormData({ ...formData, lifecycle: value })}
            >
              <SelectTrigger className="font-body bg-paper border-border">
                <SelectValue placeholder={t("tuner.selectPhase")} />
              </SelectTrigger>
              <SelectContent>
                {lifecycleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="font-body">
                    {t(option.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Frequency toggles */}
          <div className="space-y-2">
            <Label className="font-body text-ink">{t("tuner.frequency")}</Label>
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
                  {t("tuner.scientific")}
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
                  {t("tuner.spiritual")}
                </Label>
              </div>
            </div>
          </div>

          {/* Culture and Current Season */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="culture" className="font-body text-ink">
                {t("tuner.roots")}
              </Label>
              <Input
                id="culture"
                placeholder={t("tuner.rootsPlaceholder")}
                value={formData.culture}
                onChange={(e) => setFormData({ ...formData, culture: e.target.value })}
                className="font-body bg-paper border-border focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="context" className="font-body text-ink">
                {t("tuner.season")}
              </Label>
              <Input
                id="context"
                placeholder={t("tuner.seasonPlaceholder")}
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                className="font-body bg-paper border-border focus:ring-primary"
              />
            </div>
          </div>

          {/* Open-ended insights field */}
          <div className="space-y-2">
            <Label htmlFor="additionalInsights" className="font-body text-ink">
              {t("tuner.insights")}
            </Label>
            <textarea
              id="additionalInsights"
              placeholder={t("tuner.insightsPlaceholder")}
              value={formData.additionalInsights || ""}
              onChange={(e) => setFormData({ ...formData, additionalInsights: e.target.value })}
              className="w-full min-h-[100px] p-3 font-body bg-paper border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none resize-y"
            />
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
                  {t("tuner.syncing")}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  {t("tuner.generate")}
                </>
              )}
            </Button>
          </div>
      </form>
    </div>
  );
};