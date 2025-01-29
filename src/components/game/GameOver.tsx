import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

export const GameOver = ({ score, onRestart }: GameOverProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div className="bg-white p-8 rounded-lg text-center">
        <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
        <div className="text-2xl mb-6">
          <p className="mb-2">Final Score:</p>
          <p className="text-5xl font-bold text-game-primary">£{score}</p>
        </div>
        <Button onClick={onRestart} className="bg-game-primary hover:bg-game-primary/90 text-lg px-8 py-4">
          Play Again
        </Button>
      </div>
    </motion.div>
  );
};