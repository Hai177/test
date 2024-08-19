import { useState, useRef, useEffect } from "react";
import useTimer from "../hooks/useTimer";

const RandomNumberGame=()=> {
  const canvasRef = useRef(null);
  const [numPoints, setNumPoints] = useState(0);
  const [points, setPoints] = useState([]);
  const [nextValue, setNextValue] = useState(1);
  const [message, setMessage] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const { timer, handleStart, handleReset, handlePause } = useTimer();

  const handleChange = (e) => {
    setNumPoints(Number(e.target.value));
    setNextValue(1);
    setMessage("");
    setGameStarted(false);
  };

  const startGame = () => {
    setGameStarted(true);
    setMessage("");
    setNextValue(1);
    handleReset();
    handleStart();
    generateRandomPoints();
  };

  const generateRandomPoints = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const margin = 20;
    context.clearRect(0, 0, width, height);

    const newPoints = [];
    for (let i = 0; i < numPoints; i++) {
      const x = Math.floor(Math.random() * (width - 2 * margin)) + margin;
      const y = Math.floor(Math.random() * (height - 2 * margin)) + margin;
      newPoints.push({ x, y, value: i + 1, clicked: false });
      newPoints.sort((a, b) => b.value - a.value);
      newPoints.forEach((point) => {
        drawPoint(context, point.x, point.y, point.value);
      });
    }
    setPoints(newPoints);
  };

  const drawPoint = (context, x, y, value) => {
    context.beginPath();
    context.arc(x, y, 20, 0, 2 * Math.PI);
    context.fillStyle = "red";
    context.fill();
    context.stroke();
    context.fillStyle = "white";
    context.font = "16px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(value, x, y);
  };

  const handleClick = (e) => {
    if (message || !gameStarted) {
      return;
    }

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const context = canvas.getContext("2d");

    let clickedPoint = null;
    const newPoints = points.filter((point) => {
      const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
      if (distance < 20 && !point.clicked) {
        clickedPoint = point;
        return false;
      }
      return true;
    });

    if (clickedPoint) {
      if (clickedPoint.value === nextValue) {
        setNextValue(nextValue + 1);

        context.clearRect(0, 0, canvas.width, canvas.height);
        newPoints.forEach((point) => {
          drawPoint(context, point.x, point.y, point.value);
        });
        setPoints(newPoints);

        if (newPoints.length === 0) {
          setMessage("All Cleared");
          handlePause();
        }
      } else {
        setMessage("Game Over");
        handlePause();
      }
    }
  };

  useEffect(() => {
    return () => clearInterval(timer);
  }, [timer]);

  return (
    <div className="container">
      <div className="game">
        <h2>{message || "Let's play"}</h2>
        <input
          type="number"
          value={numPoints}
          onChange={handleChange}
          placeholder="Enter number of points"
        />
        <h4>Time: {timer}s</h4>
        <button onClick={startGame}>{gameStarted ? "Restart" : "Start"}</button>
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          style={{ border: "1px solid black" }}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}

export default RandomNumberGame;
