import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface MoneyProps {
  type: "money" | "bill" | "car" | "tax" | "gold" | "swear" | "eye" | "flowers" | "piggy";
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
  eye: "👁️",
  flowers: "💐",
  piggy: "🐷",
};

const getRandomSwearWord = () => {
  const words = ["F*CK", "TW*T"];
  return words[Math.floor(Math.random() * words.length)];
};

const getPointsForItem = (type: MoneyProps["type"]) => {
  switch(type) {
    case "gold":
      return 20;
    case "money":
    case "swear":
    case "flowers":
    case "piggy":
      return 10;
    case "eye":
    case "bill":
    case "car":
    case "tax":
      return -5;
    default:
      return 0;
  }
};

export const Money = ({ type, position, onFall, description }: MoneyProps) => {
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    
    const checkCollision = () => {
      const item = document.getElementById(`falling-item-${type}-${position}`);
      const jar = document.querySelector('.jar-hitbox');
      
      if (item && jar) {
        const itemBounds = item.getBoundingClientRect();
        const jarBounds = jar.getBoundingClientRect();
        
        const hasCollided = !(
          itemBounds.right < jarBounds.left ||
          itemBounds.left > jarBounds.right ||
          itemBounds.bottom < jarBounds.top ||
          itemBounds.top > jarBounds.bottom
        );

        if (hasCollided && !isExploding) {
          setIsExploding(true);
          const points = getPointsForItem(type);
          toast(
            `${points > 0 ? '+' : ''}${points} points! ${description}`,
            {
              duration: 1500,
              className: cn(
                "w-auto text-sm font-medium",
                points > 0 ? "bg-green-500" : "bg-red-500",
                "text-white"
              ),
            }
          );
          setTimeout(() => onFall(), 500);
        }
      }
      
      if (!isExploding) {
        animationFrameId = requestAnimationFrame(checkCollision);
      }
    };

    animationFrameId = requestAnimationFrame(checkCollision);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [type, position, isExploding, onFall, description]);

  return (
    <motion.div
      id={`falling-item-${type}-${position}`}
      initial={{ y: -100 }}
      animate={{ y: window.innerHeight }}
      transition={{ duration: 3, ease: "linear" }}
      onAnimationComplete={() => {
        if (!isExploding) {
          onFall();
        }
      }}
      className={cn(
        "absolute flex flex-col items-center gap-1",
        isExploding && "animate-explode",
        type === "gold" && "animate-coin-spin"
      )}
      style={{ 
        left: position,
        backgroundColor: 'rgb(253, 242, 255, 0.1)',
        zIndex: 10
      }}
    >
      {type === "eye" ? (
        <img 
          src="/lovable-uploads/41558c01-221f-4001-8fca-454e147c3562.png"
          alt="Eye Test"
          className="w-24 h-24 object-contain"
        />
      ) : type === "flowers" ? (
        <img 
          src="/lovable-uploads/83cb02de-1f1c-4993-9d2f-73f279150e70.png"
          alt="Flowers"
          className="w-24 h-24 object-contain"
        />
      ) : type === "piggy" ? (
        <img 
          src="/lovable-uploads/f3c6022b-c68e-48b6-aae1-ddc7f15aa79d.png"
          alt="Piggy Bank"
          className="w-24 h-24 object-contain"
        />
      ) : (
        <span className="text-3xl">
          {type === "swear" ? getRandomSwearWord() : itemIcons[type]}
        </span>
      )}
      <span className="text-xs font-medium bg-white/80 px-2 py-0.5 rounded-full shadow-sm">
        {description}
      </span>
    </motion.div>
  );
};