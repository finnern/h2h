import heartsAngel from "@/assets/hearts-angel.png";
import clubsWorker from "@/assets/clubs-worker.png";
import diamondsKing from "@/assets/diamonds-king.png";
import spadesElder from "@/assets/spades-elder.png";

export const CARD_IMAGES = {
  hearts: heartsAngel,
  clubs: clubsWorker,
  diamonds: diamondsKing,
  spades: spadesElder,
} as const;

export type Archetype = keyof typeof CARD_IMAGES;
