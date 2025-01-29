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
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Reset timer to initial duration
      setTimeLeft(duration);
      
      // Start new countdown
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleComplete();
            return 0;
          }
          return prevTime - 1;
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
    <div className="absolute top-4 right-4 text-2xl font-bold text-game-primary">
      {timeLeft}s
    </div>
  );
};