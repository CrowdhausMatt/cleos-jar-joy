import { useEffect, useState, useCallback } from "react";

interface TimerProps {
  duration: number;
  onComplete: () => void;
  gameStarted: boolean;
}

export const Timer = ({ duration, onComplete, gameStarted }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (gameStarted) {
      setTimeLeft(duration);
      intervalId = setInterval(() => {
        setTimeLeft((currentTime) => {
          if (currentTime <= 1) {
            clearInterval(intervalId);
            handleComplete();
            return 0;
          }
          return currentTime - 1;
        });
      }, 1000);
    } else {
      setTimeLeft(duration);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [gameStarted, duration, handleComplete]);

  return (
    <div className="absolute top-4 right-4 text-2xl font-bold text-game-primary">
      {timeLeft}s
    </div>
  );
};