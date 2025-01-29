import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

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
  const [isExploding, setIsExploding] = useState(false);
  const [itemBounds, setItemBounds] = useState({ top: 0, left: 0, bottom: 0, right: 0 });

  useEffect(() => {
    const updateBounds = () => {
      const element = document.getElementById(`falling-item-${type}-${position}`);
      if (element) {
        const bounds = element.getBoundingClientRect();
        setItemBounds(bounds);
        
        const jar = document.querySelector('.jar-hitbox');
        if (jar) {
          const jarBounds = jar.getBoundingClientRect();
          
          if (checkCollision(bounds, jarBounds)) {
            if (!isExploding) {
              setIsExploding(true);
              setTimeout(() => onFall(), 500);
            }
          }
        }
      }
    };

    const interval = setInterval(updateBounds, 100);
    return () => clearInterval(interval);
  }, [position, type, isExploding, onFall]);

  const checkCollision = (itemBounds: DOMRect, jarBounds: DOMRect) => {
    return !(
      itemBounds.right < jarBounds.left ||
      itemBounds.left > jarBounds.right ||
      itemBounds.bottom < jarBounds.top ||
      itemBounds.top > jarBounds.bottom
    );
  };

  return (
    <motion.div
      id={`falling-item-${type}-${position}`}
      initial={{ y: -100 }}
      animate={{ y: "100vh" }}
      transition={{ duration: 3, ease: "linear" }}
      onAnimationComplete={() => {
        if (!isExploding) {
          onFall();
        }
      }}
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