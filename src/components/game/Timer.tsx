import { useEffect, useState } from "react";

interface TimerProps {
  duration: number;
  onComplete: () => void;
  gameStarted: boolean;
}

export const Timer = ({ duration, onComplete, gameStarted }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!gameStarted) {
      setTimeLeft(duration);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, onComplete, gameStarted]);

  return (
    <div className="absolute top-4 right-4 text-2xl font-bold text-game-primary">
      {timeLeft}s
    </div>
  );
};