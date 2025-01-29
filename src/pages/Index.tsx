import { Jar } from "@/components/game/Jar";
import { Money } from "@/components/game/Money";
import { Score } from "@/components/game/Score";
import { GameOver } from "@/components/game/GameOver";
import { Button } from "@/components/ui/button";
import { useGameLogic } from "@/hooks/useGameLogic";
import { toast } from "sonner";

const Index = () => {
  const {
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
  } = useGameLogic();

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
    setGameStarted(false);
    setIsGameOver(false);
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setScore(0);
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