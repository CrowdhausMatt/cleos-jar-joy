import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MoneyProps {
  type: "swear" | "smart" | "roundup" | "forget" | "gold";
  position: number;
  onFall: () => void;
}

const moneyIcons = {
  swear: "💷",
  smart: "💵",
  roundup: "💶",
  forget: "💴",
  gold: "🪙",
};

export const Money = ({ type, position, onFall }: MoneyProps) => {
  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: "100vh" }}
      transition={{ duration: 3, ease: "linear" }}
      onAnimationComplete={onFall}
      className={cn(
        "absolute text-3xl",
        type === "gold" && "animate-coin-spin"
      )}
      style={{ left: position }}
    >
      {moneyIcons[type]}
    </motion.div>
  );
};