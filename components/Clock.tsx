import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        <span>Current time: </span>
        <span className="font-mono font-semibold">{currentTime}</span>
    </div>
  );
};

export default Clock;
