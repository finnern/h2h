import { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Feather, Anchor } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CARD_IMAGES, Archetype } from "@/constants/card-assets";

export type { Archetype } from "@/constants/card-assets";

interface CardQuestion {
  light: string;
  deep: string;
}

interface FlippableCardProps {
  archetype: Archetype;
  questions: CardQuestion;
  isPersonalized?: boolean;
  initialFlipped?: boolean;
  onFeedback?: (positive: boolean) => void;
  isShuffling?: boolean;
}

const archetypeConfig: Record<Archetype, {
  name: string;
  theme: string;
  suit: string;
}> = {
  hearts: {
    name: "The Angels",
    theme: "Vulnerability & Inner Home",
    suit: "♥",
  },
  clubs: {
    name: "The Workers",
    theme: "Action & Shared Projects",
    suit: "♣",
  },
  diamonds: {
    name: "The Kings",
    theme: "Values & Legacy",
    suit: "♦",
  },
  spades: {
    name: "The Elders",
    theme: "Wisdom & Transitions",
    suit: "♠",
  },
};

export const FlippableCard = ({
  archetype,
  questions,
  isPersonalized = false,
  initialFlipped = false,
  onFeedback,
  isShuffling = false,
}: FlippableCardProps) => {
  const { t } = useLanguage();
  const [isFlipped, setIsFlipped] = useState(initialFlipped);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  
  const config = archetypeConfig[archetype];
  
  // During shuffling, show the archetype images (back of card = not flipped)
  const displayFlipped = isShuffling ? false : isFlipped;

  const handleFeedback = (positive: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    setFeedback(positive ? "up" : "down");
    onFeedback?.(positive);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className="playing-card w-full max-w-[320px] cursor-pointer"
        onClick={() => !isShuffling && setIsFlipped(!isFlipped)}
        whileHover={isShuffling ? {} : { scale: 1.02 }}
        whileTap={isShuffling ? {} : { scale: 0.98 }}
        animate={isShuffling ? {
          y: [0, -15, 0, -10, 0],
          rotate: [0, -2, 2, -1, 0],
        } : {}}
        transition={isShuffling ? {
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        } : {}}
      >
        <div className={`card-inner ${displayFlipped ? "flipped" : ""}`}>
          {/* Front of card - Archetype image (default visible state) */}
          <div className="card-face card-front bg-white">
            <img
              src={CARD_IMAGES[archetype]}
              alt={config.name}
              className="h-full w-full object-contain"
            />
          </div>

          {/* Back of card - Questions (revealed on click) */}
          <div className="card-face card-back bg-white flex flex-col items-center justify-between text-center px-5 py-6">
            {/* Small archetype image at top */}
            <img
              src={CARD_IMAGES[archetype]}
              alt={config.name}
              className="w-16 h-16 object-contain mb-4"
            />

            {/* Questions container */}
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              {/* Surface question - light/playful */}
              <div className="flex flex-col items-center gap-2">
                <Feather className="w-5 h-5 text-ink/50" />
                <p className="font-display text-lg md:text-xl text-ink leading-relaxed text-center">
                  {questions.light}
                </p>
              </div>
              
              {/* Divider */}
              <div className="w-24 h-px bg-ink/20" />
              
              {/* Deep question - profound */}
              <div className="flex flex-col items-center gap-2">
                <Anchor className="w-5 h-5 text-primary" />
                <p className="font-display text-lg md:text-xl text-ink font-semibold leading-relaxed text-center">
                  {questions.deep}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-ink/10 w-full">
              <p className="font-display text-sm text-ink">
                {t("card.passOk")}
              </p>
              <p className="font-body text-xs text-ink-light mt-1 italic">
                {t("card.remember")}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feedback buttons - only show for personalized cards */}
      {isPersonalized && (
        <motion.div 
          className="flex gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={(e) => handleFeedback(true, e)}
            className={`p-2 rounded-full transition-all ${
              feedback === "up"
                ? "bg-primary text-primary-foreground scale-110"
                : "bg-secondary text-secondary-foreground hover:bg-primary/20"
            }`}
            aria-label="Thumbs up"
          >
            <ThumbsUp className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => handleFeedback(false, e)}
            className={`p-2 rounded-full transition-all ${
              feedback === "down"
                ? "bg-accent text-accent-foreground scale-110"
                : "bg-secondary text-secondary-foreground hover:bg-accent/20"
            }`}
            aria-label="Thumbs down"
          >
            <ThumbsDown className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
