import { useEffect, useState, useCallback, useRef } from "react";

interface TimerProps {
  duration: number;
  onComplete: () => void;
  gameStarted: boolean;
}

export const Timer = ({ duration, onComplete, gameStarted }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleComplete = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (gameStarted) {
      // Reset timer and clear any existing interval
      setTimeLeft(duration);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Start new countdown
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            handleComplete();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      // Clear interval when game is not started
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setTimeLeft(duration);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [gameStarted, duration, handleComplete]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-white px-4 py-2 rounded-lg shadow-lg text-2xl font-bold text-game-primary">
      {timeLeft}s
    </div>
  );
};