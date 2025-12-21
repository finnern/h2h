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
        className="playing-card w-full max-w-[320px] cursor-pointer"
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
          {/* Front of card - Questions (with small archetype icon) */}
          <div className="card-face card-front bg-white">
            {/* Small archetype image at top */}
            <div className="flex justify-start mb-2">
              <img
                src={config.image}
                alt={config.name}
                className="h-16 w-auto object-contain"
              />
            </div>

            {/* Light question */}
            <div className="flex-1 flex flex-col">
              <p className="font-display text-xl md:text-2xl text-ink leading-relaxed mb-3">
                {questions.light}
              </p>
              
              {/* Heartbeat divider */}
              <HeartbeatLine className="my-3" />
              
              {/* Deep question - bold */}
              <p className="font-display text-xl md:text-2xl text-ink font-bold leading-relaxed">
                {questions.deep}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4">
              <p className="font-display text-lg text-ink">
                Pass/Not today is OK.
              </p>
              <p className="font-body text-sm text-ink-light mt-1">
                End with: 'Was soll ich mir merken?'
              </p>
            </div>
          </div>

          {/* Back of card - Full archetype image with heartbeat borders */}
          <div className="card-face card-back bg-white">
            <div className="flex flex-col items-center justify-between p-4 h-full w-full">
              {/* Top heartbeat line */}
              <HeartbeatLine className="w-full" />
              
              {/* Center archetype image */}
              <div className="flex-1 flex items-center justify-center py-4">
                <img
                  src={config.image}
                  alt={config.name}
                  className="max-h-[220px] w-auto object-contain"
                />
              </div>
              
              {/* Bottom heartbeat line */}
              <HeartbeatLine className="w-full" />
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
