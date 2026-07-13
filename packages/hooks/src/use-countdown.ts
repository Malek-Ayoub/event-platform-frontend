import { useEffect, useState } from 'react';

export type CountdownState = {
  remainingSeconds: number;
  isComplete: boolean;
  isRunning: boolean;
};

export function useCountdown(totalSeconds: number, autoStart = true): CountdownState {
  const [remainingSeconds, setRemainingSeconds] = useState(Math.max(0, totalSeconds));
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    setRemainingSeconds(Math.max(0, totalSeconds));
    setIsRunning(autoStart);
  }, [autoStart, totalSeconds]);

  useEffect(() => {
    if (!isRunning || remainingSeconds <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => {
        const next = Math.max(0, current - 1);
        if (next === 0) {
          setIsRunning(false);
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, remainingSeconds]);

  return {
    remainingSeconds,
    isComplete: remainingSeconds <= 0,
    isRunning,
  };
}
