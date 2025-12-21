import { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { HeartbeatLine } from "./HeartbeatLine";

// Import archetype images
import angelsArchetype from "@/assets/angels-archetype.png";
import workersArchetype from "@/assets/workers-archetype.png";
import kingsArchetype from "@/assets/kings-archetype.png";
import eldersArchetype from "@/assets/elders-archetype.png";

export type Archetype = "hearts" | "clubs" | "diamonds" | "spades";

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
  image: string;
}> = {
  hearts: {
    name: "The Angels",
    theme: "Vulnerability & Inner Home",
    suit: "♥",
    image: angelsArchetype,
  },
  clubs: {
    name: "The Workers",
    theme: "Action & Shared Projects",
    suit: "♣",
    image: workersArchetype,
  },
  diamonds: {
    name: "The Kings",
    theme: "Values & Legacy",
    suit: "♦",
    image: kingsArchetype,
  },
  spades: {
    name: "The Elders",
    theme: "Wisdom & Transitions",
    suit: "♠",
    image: eldersArchetype,
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
  const [isFlipped, setIsFlipped] = useState(initialFlipped);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  
  const config = archetypeConfig[archetype];

  const handleFeedback = (positive: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    setFeedback(positive ? "up" : "down");
    onFeedback?.(positive);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className="playing-card w-full max-w-[280px] cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={isShuffling ? {
          rotateY: [0, 180, 360],
          y: [0, -20, 0],
        } : {}}
        transition={isShuffling ? {
          duration: 0.8,
          ease: "easeInOut",
        } : {}}
      >
        <div className={`card-inner ${isFlipped ? "flipped" : ""}`}>
          {/* Front of card - Questions */}
          <div className="card-face card-front">
            {/* Suit symbol in corner */}
            <div className="absolute top-3 left-4 text-heartbeat text-2xl font-bold">
              {config.suit}
            </div>
            <div className="absolute bottom-3 right-4 text-heartbeat text-2xl font-bold rotate-180">
              {config.suit}
            </div>

            {/* Card content */}
            <div className="flex-1 flex flex-col justify-center px-2 pt-6">
              {/* Light question */}
              <p className="font-display text-xl md:text-2xl text-ink leading-relaxed mb-4">
                {questions.light}
              </p>
              
              {/* Heartbeat divider */}
              <HeartbeatLine className="my-3 opacity-60" />
              
              {/* Deep question */}
              <p className="font-display text-xl md:text-2xl text-ink font-semibold leading-relaxed">
                {questions.deep}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4 text-center">
              <p className="font-body text-sm text-ink-light italic">
                Pass/Not today is OK.
              </p>
              <p className="font-body text-xs text-muted-foreground mt-1">
                End with: 'Was soll ich mir merken?'
              </p>
            </div>
          </div>

          {/* Back of card - Archetype image */}
          <div className="card-face card-back">
            <div className="flex flex-col items-center justify-center p-6 h-full">
              <HeartbeatLine className="w-full mb-4" />
              
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={config.image}
                  alt={config.name}
                  className="max-h-[180px] object-contain"
                />
              </div>
              
              <HeartbeatLine className="w-full mt-4" />
              
              <div className="text-center mt-4">
                <p className="font-display text-2xl text-ink">{config.name}</p>
                <p className="font-body text-sm text-ink-light italic">{config.theme}</p>
              </div>
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
