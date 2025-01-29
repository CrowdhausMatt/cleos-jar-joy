import { useState, useEffect } from "react";
import { toast } from "sonner";

export type ItemType = "money" | "bill" | "car" | "tax" | "gold" | "swear" | "eye" | "flowers" | "piggy";

export interface FallingItem {
  id: number;
  type: ItemType;
  position: number;
}

export const itemDescriptions = {
  money: "Cash Money!",
  bill: "Utility Bill - Avoid!",
  car: "Car Insurance - Don't catch!",
  tax: "Tax Form - Run away!",
  gold: "Golden Coin - Double points!",
  swear: "Caught a swear word!",
  eye: "Eye Test Cost",
  flowers: "Flowers for Girlfriend",
  piggy: "Savings"
};

const JAR_WIDTH = 96; // Define the constant

export const useGameLogic = () => {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [jarPosition, setJarPosition] = useState(window.innerWidth / 2);
  const [gameStarted, setGameStarted] = useState(false);

  const spawnItem = () => {
    const types: ItemType[] = ["money", "bill", "car", "tax", "swear", "eye", "flowers", "piggy"];
    const randomType = Math.random() < 0.1 ? "gold" : types[Math.floor(Math.random() * types.length)];
    const randomPosition = Math.random() * (window.innerWidth - 50);

    setFallingItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: randomType,
        position: randomPosition,
      },
    ]);
  };

  const handleItemFall = (fallingItem: FallingItem) => {
    const jarLeft = jarPosition - JAR_WIDTH / 2;
    const jarRight = jarPosition + JAR_WIDTH / 2;
    
    if (fallingItem.position >= jarLeft && fallingItem.position <= jarRight) {
      let pointsEarned = 0;
      
      switch(fallingItem.type) {
        case "gold":
          pointsEarned = 20;
          break;
        case "money":
        case "swear":
        case "flowers":
        case "piggy":
          pointsEarned = 10;
          break;
        case "eye":
        case "bill":
        case "car":
        case "tax":
          pointsEarned = -5;
          break;
        default:
          pointsEarned = 0;
      }

      setScore((prev) => Math.max(0, prev + pointsEarned));

      toast(`${pointsEarned > 0 ? '+' : ''}${pointsEarned} points! ${itemDescriptions[fallingItem.type]}`, {
        duration: 1500,
        className: `w-auto text-sm font-medium ${pointsEarned > 0 ? 'bg-green-500' : 'bg-red-500'} text-white`,
      });
    }
    
    setFallingItems((prev) => prev.filter((item) => item.id !== fallingItem.id));
  };

  const handleMove = (direction: "left" | "right") => {
    const MOVE_STEP = 50;
    setJarPosition((prev) => {
      const newPosition = direction === "left" 
        ? prev - MOVE_STEP 
        : prev + MOVE_STEP;
      
      return Math.max(JAR_WIDTH/2, Math.min(window.innerWidth - JAR_WIDTH/2, newPosition));
    });
  };

  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handleMove("left");
      } else if (e.key === "ArrowRight") {
        handleMove("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    const interval = setInterval(spawnItem, 1000);
    return () => clearInterval(interval);
  }, [isGameOver, gameStarted]);

  return {
    score,
    isGameOver,
    fallingItems,
    jarPosition,
    gameStarted,
    setGameStarted,
    setIsGameOver,
    handleItemFall,
    handleMove,
    setScore
  };
};