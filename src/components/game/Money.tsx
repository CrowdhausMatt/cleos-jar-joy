import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface MoneyProps {
  type: "money" | "bill" | "car" | "tax" | "gold" | "swear" | "eye";
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
  eye: "👁️"
};

const getRandomSwearWord = () => {
  const words = ["F*CK", "TW*T"];
  return words[Math.floor(Math.random() * words.length)];
};

export const Money = ({ type, position, onFall, description }: MoneyProps) => {
  const [isExploding, setIsExploding] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const startAnimation = async () => {
      await controls.start({
        y: [0, window.innerHeight],
        transition: { 
          y: { duration: 3, ease: "linear" }
        }
      });
      
      // Only call onFall if we haven't collided with the jar
      if (!isExploding) {
        onFall();
      }
    };

    startAnimation();
  }, [controls, onFall, isExploding]);

  const handleCollision = () => {
    setIsExploding(true);
    controls.stop();
    onFall();
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={controls}
      className={cn(
        "absolute flex flex-col items-center gap-1",
        isExploding && "animate-explode",
        type === "gold" && "animate-coin-spin"
      )}
      style={{ left: position }}
      onUpdate={(latest: { y: number }) => {
        // Get jar dimensions and position
        const JAR_WIDTH = 96;
        const JAR_HEIGHT = 128;
        const jarX = window.innerWidth / 2 - JAR_WIDTH / 2;
        const jarY = window.innerHeight - JAR_HEIGHT - 16;

        // Get item dimensions
        const ITEM_WIDTH = 48;
        const ITEM_HEIGHT = 48;
        const itemX = position;
        const itemY = latest.y;

        // Check for rectangle collision
        if (!isExploding &&
            itemX < jarX + JAR_WIDTH &&
            itemX + ITEM_WIDTH > jarX &&
            itemY < jarY + JAR_HEIGHT &&
            itemY + ITEM_HEIGHT > jarY) {
          handleCollision();
        }
      }}
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