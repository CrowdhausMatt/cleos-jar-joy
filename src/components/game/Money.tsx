import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MoneyProps {
  type: "money" | "bill" | "car" | "tax" | "gold";
  position: number;
  onFall: () => void;
}

const itemIcons = {
  money: "💷",
  bill: "📄",
  car: "🚗",
  tax: "📋",
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
      {itemIcons[type]}
    </motion.div>
  );
};