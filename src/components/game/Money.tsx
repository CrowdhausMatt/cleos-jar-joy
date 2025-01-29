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
        console.log("Item bounds:", bounds);
        
        const jar = document.querySelector('.jar-hitbox');
        if (jar) {
          const jarBounds = jar.getBoundingClientRect();
          console.log("Jar bounds:", jarBounds);
          
          if (checkCollision(bounds, jarBounds)) {
            console.log("COLLISION DETECTED!");
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
    const collision = !(
      itemBounds.right < jarBounds.left ||
      itemBounds.left > jarBounds.right ||
      itemBounds.bottom < jarBounds.top ||
      itemBounds.top > jarBounds.bottom
    );
    
    if (collision) {
      console.log("Collision details:", {
        itemBounds,
        jarBounds,
        itemRight: itemBounds.right,
        jarLeft: jarBounds.left,
        itemLeft: itemBounds.left,
        jarRight: jarBounds.right,
        itemBottom: itemBounds.bottom,
        jarTop: jarBounds.top,
        itemTop: itemBounds.top,
        jarBottom: jarBounds.bottom
      });
    }
    
    return collision;
  };

  return (
    <motion.div
      id={`falling-item-${type}-${position}`}
      initial={{ y: -100 }}
      animate={{ y: "100vh" }}
      transition={{ duration: 3, ease: "linear" }}
      onAnimationComplete={() => {
        console.log("Animation complete, isExploding:", isExploding);
        if (!isExploding) {
          onFall();
        }
      }}
      className={cn(
        "absolute flex flex-col items-center gap-1",
        isExploding && "animate-explode",
        type === "gold" && "animate-coin-spin",
        // Make border match background color
        "border-2 border-purple-50"
      )}
      style={{ 
        left: position,
        backgroundColor: 'rgb(253, 242, 255, 0.1)' // Very subtle purple tint to match background
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