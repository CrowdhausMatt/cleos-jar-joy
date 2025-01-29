import { useEffect, useState } from "react";

interface TimerProps {
  duration: number;
  onComplete: () => void;
  gameStarted: boolean;
}

export const Timer = ({ duration, onComplete, gameStarted }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    // Reset timer when game starts/stops
    if (!gameStarted) {
      setTimeLeft(duration);
      return;
    }

    // Start countdown
    const intervalId = setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          clearInterval(intervalId);
          onComplete();
          return 0;
        }
        return currentTime - 1;
      });
    }, 1000);

    // Cleanup interval on unmount or when game state changes
    return () => {
      clearInterval(intervalId);
    };
  }, [gameStarted, duration, onComplete]);

  return (
    <div className="absolute top-4 right-4 text-2xl font-bold text-game-primary">
      {timeLeft}s
    </div>
  );
};