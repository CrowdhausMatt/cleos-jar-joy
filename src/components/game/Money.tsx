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
    const animate = async () => {
      await controls.start({
        y: window.innerHeight + 100,
        transition: { duration: 3, ease: "linear" }
      });
      onFall();
    };

    animate();
  }, [controls, onFall]);

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
        const JAR_HEIGHT = 128; // 32px * 4 (h-32)
        const jarX = window.innerWidth / 2 - JAR_WIDTH / 2;
        const jarY = window.innerHeight - JAR_HEIGHT - 16; // 16px for bottom spacing

        // Get item dimensions (approximated)
        const ITEM_WIDTH = 48;
        const ITEM_HEIGHT = 48;
        const itemX = position;
        const itemY = latest.y;

        // Check for rectangle collision
        if (!isExploding && // Prevent multiple collisions
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