import { useState, useEffect, useCallback } from "react";

export function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || seconds <= 0) return;
    const interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const reset   = useCallback(() => setSeconds(initialSeconds), [initialSeconds]);
  const pause   = useCallback(() => setIsRunning(false), []);
  const resume  = useCallback(() => setIsRunning(true), []);

  const hh = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return { seconds, formatted: `${mm}:${ss}`, isExpired: seconds <= 0, reset, pause, resume };
}

// Countdown to midnight
export function useCountdownToMidnight() {
  const getSecondsUntilMidnight = () => {
    const now  = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    return Math.floor((midnight.getTime() - now.getTime()) / 1000);
  };

  return useCountdown(getSecondsUntilMidnight());
}
