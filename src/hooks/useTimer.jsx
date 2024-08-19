import { useRef, useState } from "react";

const useTimer = () => {
  const [timer, setTimer] = useState(0);

  const countRef = useRef(null);

  const handleStart = () => {
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 0.1);
    }, 100);
  };

  const handlePause = () => {
    clearInterval(countRef.current);
  };

  const handleReset = () => {
    clearInterval(countRef.current);

    setTimer(0);
  };
  return {
    timer: timer.toFixed(1),
    handleStart,
    handlePause,
    handleReset,
  };
};

export default useTimer;
