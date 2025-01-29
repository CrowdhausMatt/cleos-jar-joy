import { useEffect, useRef, useCallback } from "react";

interface TimerProps {
  duration: number;
  onComplete: () => void;
  gameStarted: boolean;
}

export const Timer = ({ duration, onComplete, gameStarted }: TimerProps) => {
  const timeLeftRef = useRef(duration);
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
      // Reset timer
      timeLeftRef.current = duration;

      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Start new countdown
      intervalRef.current = setInterval(() => {
        timeLeftRef.current -= 1;
        
        // Force re-render
        const timerDisplay = document.querySelector('.timer-display');
        if (timerDisplay) {
          timerDisplay.textContent = `${timeLeftRef.current}s`;
        }

        if (timeLeftRef.current <= 0) {
          handleComplete();
        }
      }, 1000);
    } else {
      // Clear interval when game is not started
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      timeLeftRef.current = duration;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [gameStarted, duration, handleComplete]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-white px-4 py-2 rounded-lg shadow-lg text-2xl font-bold text-game-primary timer-display">
      {timeLeftRef.current}s
    </div>
  );
};