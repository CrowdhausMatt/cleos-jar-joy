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
      console.log("Starting animation from y=0 to y=", window.innerHeight);
      await controls.start({
        y: [0, window.innerHeight],
        transition: { 
          y: { duration: 3, ease: "linear" }
        }
      });
      
      console.log("Animation complete, isExploding:", isExploding);
      if (!isExploding) {
        onFall();
      }
    };

    startAnimation();
  }, [controls, onFall, isExploding]);

  const handleCollision = () => {
    console.log("Collision detected!");
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
      style={{ 
        left: position,
        border: "2px solid red", // Debug border
        width: "48px",  // ITEM_WIDTH
        height: "48px", // ITEM_HEIGHT
      }}
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

        // Log positions for debugging
        console.log("Item position:", { x: itemX, y: itemY });
        console.log("Jar position:", { x: jarX, y: jarY });

        // Draw debug rectangle for jar (using DOM)
        let debugJar = document.getElementById('debug-jar');
        if (!debugJar) {
          debugJar = document.createElement('div');
          debugJar.id = 'debug-jar';
          debugJar.style.position = 'absolute';
          debugJar.style.border = '2px solid blue';
          debugJar.style.pointerEvents = 'none';
          document.body.appendChild(debugJar);
        }
        debugJar.style.left = `${jarX}px`;
        debugJar.style.top = `${jarY}px`;
        debugJar.style.width = `${JAR_WIDTH}px`;
        debugJar.style.height = `${JAR_HEIGHT}px`;

        // Check for rectangle collision
        if (!isExploding &&
            itemX < jarX + JAR_WIDTH &&
            itemX + ITEM_WIDTH > jarX &&
            itemY < jarY + JAR_HEIGHT &&
            itemY + ITEM_HEIGHT > jarY) {
          console.log("Collision check passed!");
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