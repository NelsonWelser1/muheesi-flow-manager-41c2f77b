import { useState, useEffect } from 'react';

export const useTimer = () => {
  const [time, setTime] = useState('00:00:00');

  useEffect(() => {
    const startTime = new Date();

    const timer = setInterval(() => {
      const now = new Date();
      const diff = new Date(now - startTime);
      const hours = diff.getUTCHours().toString().padStart(2, '0');
      const minutes = diff.getUTCMinutes().toString().padStart(2, '0');
      const seconds = diff.getUTCSeconds().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return time;
};