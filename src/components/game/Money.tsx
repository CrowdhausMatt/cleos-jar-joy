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
        y: window.innerHeight,
        transition: { duration: 3, ease: "linear" }
      });
      
      if (!isExploding) {
        onFall();
      }
    };

    animate();
  }, [controls, isExploding, onFall]);

  const handleCollision = () => {
    setIsExploding(true);
    controls.stop();
    setTimeout(() => {
      onFall();
    }, 500);
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
        // Check for collision with jar
        const jarPosition = window.innerWidth / 2;
        const jarWidth = 96; // JAR_WIDTH
        const jarLeft = jarPosition - jarWidth / 2;
        const jarRight = jarPosition + jarWidth / 2;
        const itemLeft = position;
        
        // If item is within jar's horizontal bounds and near the bottom of the screen
        if (itemLeft >= jarLeft && 
            itemLeft <= jarRight && 
            latest.y >= window.innerHeight - 150) { // 150px from bottom
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