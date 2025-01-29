import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MoneyProps {
  type: "money" | "bill" | "car" | "tax" | "gold" | "swear";
  position: number;
  onFall: () => void;
  description: string;
}

const itemIcons = {
  money: "💷",
  bill: "📄",
  car: "🚗",
  tax: "📋",
  gold: "🪙",
  swear: "F*CK",
};

const getRandomSwearWord = () => {
  const words = ["F*CK", "TW*T"];
  return words[Math.floor(Math.random() * words.length)];
};

export const Money = ({ type, position, onFall, description }: MoneyProps) => {
  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: "100vh" }}
      transition={{ duration: 3, ease: "linear" }}
      onAnimationComplete={onFall}
      className={cn(
        "absolute flex flex-col items-center gap-1",
        type === "gold" && "animate-coin-spin"
      )}
      style={{ left: position }}
    >
      <span className="text-3xl">
        {type === "swear" ? getRandomSwearWord() : itemIcons[type]}
      </span>
      <span className="text-xs font-medium bg-white/80 px-2 py-0.5 rounded-full shadow-sm">
        {description}
      </span>
    </motion.div>
  );
};