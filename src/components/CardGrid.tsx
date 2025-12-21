import { motion } from "framer-motion";
import { FlippableCard, Archetype } from "./FlippableCard";

interface CardQuestion {
  light: string;
  deep: string;
}

interface CardData {
  archetype: Archetype;
  questions: CardQuestion;
  initialFlipped: boolean;
}

interface CardGridProps {
  cards: CardData[];
  isPersonalized: boolean;
  isShuffling: boolean;
  onFeedback?: (archetype: Archetype, positive: boolean) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export const CardGrid = ({ cards, isPersonalized, isShuffling, onFeedback }: CardGridProps) => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card, index) => (
        <motion.div
          key={`${card.archetype}-${isPersonalized ? "personalized" : "generic"}`}
          variants={cardVariants}
          className="flex justify-center"
        >
          <FlippableCard
            archetype={card.archetype}
            questions={card.questions}
            isPersonalized={isPersonalized}
            initialFlipped={card.initialFlipped}
            isShuffling={isShuffling}
            onFeedback={(positive) => onFeedback?.(card.archetype, positive)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
