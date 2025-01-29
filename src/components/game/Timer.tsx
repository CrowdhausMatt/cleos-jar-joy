import { useEffect, useState } from "react";

interface TimerProps {
  duration: number;
  onComplete: () => void;
}

export const Timer = ({ duration, onComplete }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  return (
    <div className="absolute top-4 right-4 text-2xl font-bold text-game-primary">
      {timeLeft}s
    </div>
  );
};