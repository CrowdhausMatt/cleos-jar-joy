import { motion, AnimatePresence } from "framer-motion";

interface ScoreProps {
  score: number;
}

export const Score = ({ score }: ScoreProps) => {
  return (
    <div className="absolute top-4 left-4 text-2xl font-bold text-game-primary">
      <AnimatePresence mode="wait">
        <motion.div
          key={score}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
        >
          £{score}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};