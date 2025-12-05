import { useEffect, useRef, useState } from 'react';

export function useCountdown(initial: number) {
  const [secondsLeft, setSecondsLeft] = useState(initial);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current !== null) return;
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((c) => {
        if (c <= 1) {
          if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const reset = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSecondsLeft(initial);
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((c) => {
        if (c <= 1) {
          if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const isDisabled = secondsLeft > 0;

  return { secondsLeft, isDisabled, reset };
}
