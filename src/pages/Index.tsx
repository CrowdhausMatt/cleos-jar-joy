import { useState, useEffect } from "react";
import { Jar } from "@/components/game/Jar";
import { Money } from "@/components/game/Money";
import { Timer } from "@/components/game/Timer";
import { Score } from "@/components/game/Score";
import { GameOver } from "@/components/game/GameOver";
import { toast } from "sonner";

type MoneyType = "swear" | "smart" | "roundup" | "forget" | "gold";

interface FallingMoney {
  id: number;
  type: MoneyType;
  position: number;
}

const GAME_DURATION = 60;
const JAR_WIDTH = 96; // 24rem
const SPAWN_INTERVAL = 1000;

const Index = () => {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [fallingMoney, setFallingMoney] = useState<FallingMoney[]>([]);
  const [jarPositions, setJarPositions] = useState({
    swear: 100,
    smart: 300,
    roundup: 500,
    forget: 700,
  });

  const spawnMoney = () => {
    const types: MoneyType[] = ["swear", "smart", "roundup", "forget"];
    const randomType = Math.random() < 0.1 ? "gold" : types[Math.floor(Math.random() * types.length)];
    const randomPosition = Math.random() * (window.innerWidth - 50);

    setFallingMoney((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: randomType,
        position: randomPosition,
      },
    ]);
  };

  const handleMoneyFall = (money: FallingMoney) => {
    const jarWidth = JAR_WIDTH;
    let caught = false;

    Object.entries(jarPositions).forEach(([jarType, jarPosition]) => {
      if (
        money.position > jarPosition - jarWidth / 2 &&
        money.position < jarPosition + jarWidth / 2
      ) {
        if (money.type === "gold") {
          setScore((prev) => prev + 20);
          toast("Double points! +20");
        } else if (money.type === jarType) {
          setScore((prev) => prev + 10);
          toast("Great catch! +10");
        } else {
          setScore((prev) => Math.max(0, prev - 5));
          toast("Wrong jar! -5");
        }
        caught = true;
      }
    });

    if (!caught) {
      toast("Money missed!");
    }

    setFallingMoney((prev) => prev.filter((m) => m.id !== money.id));
  };

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(spawnMoney, SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, [isGameOver]);

  const handleGameOver = () => {
    setIsGameOver(true);
  };

  const handleRestart = () => {
    setScore(0);
    setFallingMoney([]);
    setIsGameOver(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-purple-50 to-purple-100">
      <Score score={score} />
      <Timer duration={GAME_DURATION} onComplete={handleGameOver} />

      {fallingMoney.map((money) => (
        <Money
          key={money.id}
          type={money.type}
          position={money.position}
          onFall={() => handleMoneyFall(money)}
        />
      ))}

      {Object.entries(jarPositions).map(([type, position]) => (
        <Jar
          key={type}
          type={type as "swear" | "smart" | "roundup" | "forget"}
          position={position}
          onDragEnd={(newPosition) =>
            setJarPositions((prev) => ({ ...prev, [type]: newPosition }))
          }
        />
      ))}

      {isGameOver && <GameOver score={score} onRestart={handleRestart} />}
    </div>
  );
};

export default Index;