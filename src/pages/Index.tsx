import { useState, useEffect } from "react";
import { Jar } from "@/components/game/Jar";
import { Money } from "@/components/game/Money";
import { Timer } from "@/components/game/Timer";
import { Score } from "@/components/game/Score";
import { GameOver } from "@/components/game/GameOver";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ItemType = "money" | "bill" | "car" | "tax" | "gold" | "swear" | "eye" | "flowers" | "piggy";

interface FallingItem {
  id: number;
  type: ItemType;
  position: number;
}

const GAME_DURATION = 30;
const JAR_WIDTH = 96;
const SPAWN_INTERVAL = 1000;
const MOVE_STEP = 50;

const itemDescriptions = {
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

const Index = () => {
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

      // Update score, ensuring it doesn't go below 0
      setScore((prev) => Math.max(0, prev + pointsEarned));

      toast(`${pointsEarned > 0 ? '+' : ''}${pointsEarned} points! ${itemDescriptions[fallingItem.type]}`, {
        duration: 1500,
        className: `w-auto text-sm font-medium ${pointsEarned > 0 ? 'bg-green-500' : 'bg-red-500'} text-white`,
      });
    }
    
    setFallingItems((prev) => prev.filter((item) => item.id !== fallingItem.id));
  };

  const handleMove = (direction: "left" | "right") => {
    setJarPosition((prev) => {
      const newPosition = direction === "left" 
        ? prev - MOVE_STEP 
        : prev + MOVE_STEP;
      
      return Math.max(JAR_WIDTH/2, Math.min(window.innerWidth - JAR_WIDTH/2, newPosition));
    });
  };

  // Handle keyboard controls
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

    const interval = setInterval(spawnItem, SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, [isGameOver, gameStarted]);

  const handleGameOver = () => {
    setIsGameOver(true);
    setGameStarted(false);
    toast(`Game Over! Final Score: £${score}`, {
      duration: 3000,
      className: "w-auto text-lg font-bold",
    });
  };

  const handleRestart = () => {
    setScore(0);
    setFallingItems([]);
    setJarPosition(window.innerWidth / 2);
    setIsGameOver(false);
    setGameStarted(false);
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setScore(0);
    setFallingItems([]);
    setIsGameOver(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-purple-50 to-purple-100">
      {!gameStarted ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-white/80">
          <div className="max-w-md text-center space-y-6">
            <h1 className="text-4xl font-bold text-purple-800">Swear Jar Challenge!</h1>
            <p className="text-xl text-gray-700">
              Catch as much money in your Swear Jar as possible, avoid those costly bills!
            </p>
            <Button 
              onClick={handleStartGame}
              className="text-2xl px-12 py-6 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              GO!
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Score score={score} />
          <Timer duration={GAME_DURATION} onComplete={handleGameOver} gameStarted={gameStarted} />

          {fallingItems.map((item) => (
            <Money
              key={item.id}
              type={item.type}
              position={item.position}
              onFall={() => handleItemFall(item)}
              description={itemDescriptions[item.type]}
            />
          ))}

          <Jar
            position={jarPosition}
            onMove={handleMove}
          />
        </>
      )}

      {isGameOver && <GameOver score={score} onRestart={handleRestart} />}
    </div>
  );
};

export default Index;
