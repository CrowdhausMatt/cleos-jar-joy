import { useState, useEffect } from "react";
import { Jar } from "@/components/game/Jar";
import { Money } from "@/components/game/Money";
import { Timer } from "@/components/game/Timer";
import { Score } from "@/components/game/Score";
import { GameOver } from "@/components/game/GameOver";
import { toast } from "sonner";

type ItemType = "money" | "bill" | "car" | "tax" | "gold";

interface FallingItem {
  id: number;
  type: ItemType;
  position: number;
}

const GAME_DURATION = 60;
const JAR_WIDTH = 96;
const SPAWN_INTERVAL = 1000;
const MOVE_STEP = 50;

const Index = () => {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [jarPosition, setJarPosition] = useState(window.innerWidth / 2);

  const spawnItem = () => {
    const types: ItemType[] = ["money", "bill", "car", "tax"];
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

  const handleItemFall = (item: FallingItem) => {
    const jarWidth = JAR_WIDTH;
    
    if (
      item.position > jarPosition - jarWidth / 2 &&
      item.position < jarPosition + jarWidth / 2
    ) {
      if (item.type === "gold") {
        setScore((prev) => prev + 20);
        toast("Double points! +20");
      } else if (item.type === "money") {
        setScore((prev) => prev + 10);
        toast("Great catch! +10");
      } else {
        setScore((prev) => Math.max(0, prev - 5));
        toast("Ouch! Don't catch that! -5");
      }
    }

    setFallingItems((prev) => prev.filter((m) => m.id !== item.id));
  };

  const handleMove = (direction: "left" | "right") => {
    setJarPosition((prev) => {
      const newPosition = direction === "left" 
        ? prev - MOVE_STEP 
        : prev + MOVE_STEP;
      
      // Keep jar within screen bounds
      return Math.max(JAR_WIDTH/2, Math.min(window.innerWidth - JAR_WIDTH/2, newPosition));
    });
  };

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(spawnItem, SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, [isGameOver]);

  const handleGameOver = () => {
    setIsGameOver(true);
  };

  const handleRestart = () => {
    setScore(0);
    setFallingItems([]);
    setJarPosition(window.innerWidth / 2);
    setIsGameOver(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-purple-50 to-purple-100">
      <Score score={score} />
      <Timer duration={GAME_DURATION} onComplete={handleGameOver} />

      {fallingItems.map((item) => (
        <Money
          key={item.id}
          type={item.type}
          position={item.position}
          onFall={() => handleItemFall(item)}
        />
      ))}

      <Jar
        position={jarPosition}
        onMove={handleMove}
      />

      {isGameOver && <GameOver score={score} onRestart={handleRestart} />}
    </div>
  );
};

export default Index;
