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
        y: window.innerHeight + 100, // Animate past the bottom of the screen
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
        const jarTopPosition = window.innerHeight - 150; // Jar's vertical position
        
        // Only trigger collision if the item is within jar's horizontal bounds AND
        // has reached the jar's vertical position
        if (itemLeft >= jarLeft && 
            itemLeft <= jarRight && 
            latest.y >= jarTopPosition - 20 && // Start checking slightly above jar
            latest.y <= jarTopPosition + 20 && // Small collision window
            !isExploding) { // Prevent multiple collisions
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