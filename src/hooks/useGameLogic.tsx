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

// Point values for each item type - ensuring every item has a clear value
export const itemPoints = {
  gold: 20,    // Most valuable - special item
  money: 10,   // Basic positive points
  swear: 15,   // Increased value for catching swear words
  flowers: 10, // Positive item
  piggy: 10,   // Savings are good
  eye: -10,    // Costs money
  bill: -10,   // Bills reduce points
  car: -15,    // Insurance costs more
  tax: -20     // Taxes are the most costly
};

const JAR_WIDTH = 96;
const GAME_DURATION = 30;

export const useGameLogic = () => {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [jarPosition, setJarPosition] = useState(window.innerWidth / 2);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

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
      const pointsEarned = itemPoints[fallingItem.type];
      
      // Immediately update the score
      setScore(prevScore => {
        const newScore = prevScore + pointsEarned;
        console.log(`Score update - Type: ${fallingItem.type}, Points: ${pointsEarned}, New Score: ${newScore}`);
        return newScore;
      });

      // Show toast with point information
      toast(
        `${pointsEarned > 0 ? '+' : ''}${pointsEarned} points! ${itemDescriptions[fallingItem.type]}`,
        {
          duration: 1500,
          className: `w-auto text-sm font-medium ${pointsEarned > 0 ? 'bg-green-500' : 'bg-red-500'} text-white`,
        }
      );
    }
    
    // Remove the item regardless of whether it was caught
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

  // Timer effect
  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsGameOver(true);
          setGameStarted(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, isGameOver]);

  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    const interval = setInterval(spawnItem, 1000);
    return () => clearInterval(interval);
  }, [isGameOver, gameStarted]);

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

  return {
    score,
    isGameOver,
    fallingItems,
    jarPosition,
    gameStarted,
    timeLeft,
    setGameStarted: (started: boolean) => {
      setGameStarted(started);
      setTimeLeft(GAME_DURATION);
    },
    setIsGameOver,
    handleItemFall,
    handleMove,
    setScore,
  };
};