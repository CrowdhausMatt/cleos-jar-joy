import { useEffect, useState } from "react";

interface TimerProps {
  duration: number;
  onComplete: () => void;
}

export const Timer = ({ duration, onComplete }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    // Reset timer when duration changes
    setTimeLeft(duration);
    
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
  }, [duration, onComplete]);

  return (
    <div className="absolute top-4 right-4 text-2xl font-bold text-game-primary">
      {timeLeft}s
    </div>
  );
};