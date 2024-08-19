import { useState, useEffect } from "react";
import useTimer from "../hooks/useTimer";

function CanvasGame() {
  const [numPoints, setNumPoints] = useState(""); 
  const [points, setPoints] = useState([]);
  const [nextValue, setNextValue] = useState(1);
  const [message, setMessage] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const { timer, handleStart, handleReset, handlePause } = useTimer();

  const handleChange = (e) => {
    setNumPoints(Number(e.target.value) || ""); 
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
    const newPoints = [];
    const margin = 0;

    for (let i = 0; i < numPoints; i++) {
      const x = Math.floor(Math.random() * 92) + margin;
      const y = Math.floor(Math.random() * 92) + margin;
      newPoints.push({ x, y, value: i + 1, clicked: false });
    }
    newPoints.sort((a, b) => b.value - a.value);
    setPoints(newPoints);
  };

  const handlePointClick = (value) => {
    if (message || !gameStarted) {
      return;
    }

    if (value === nextValue) {
      setNextValue(nextValue + 1);
      const updatedPoints = points.map((point) => {
        if (point.value === value) {
          return { ...point, clicked: true };
        }
        return point;
      });
      setPoints(updatedPoints);
      setTimeout(() => {
        setPoints((prevPoints) => {
          const newPoints = prevPoints.filter((point) => point.value !== value);
          if (newPoints.length === 0) {
            setMessage("All Cleared");
            handlePause();
          }
          return newPoints;
        });
      }, 1000);
    } else {
      setMessage("Game Over");
      handlePause();
    }
  };

  useEffect(() => {
    return () => clearInterval(timer);
  }, [timer]);

  return (
    <div className="container">
      <div className="game">
        <h2
          className={
            (message === "All Cleared" && "green") ||
            (message === "Game Over" && "red")
          }
          style={{ textTransform: "uppercase" }}
        >
          {message || "Let's play"}
        </h2>
        <div>
          <label htmlFor="point-input">Points:</label>
          <input
            id="point-input"
            type="number"
            value={numPoints}
            onChange={handleChange}
            placeholder="Enter number of points"
          />
        </div>
        <div>Time: {timer}s</div>
        <button onClick={startGame}>{gameStarted ? "Restart" : "Start"}</button>
        <div
          className="game-container"
          style={{
            position: "relative",
            width: "500px",
            height: "500px",
            border: "1px solid black",
          }}
        >
          {points.map((point) => (
            <div
              key={point.value}
              className={`point ${point.clicked ? "clicked" : ""}`}
              style={{
                right: `${point.x}%`,
                top: `${point.y}%`,
              }}
              onClick={() => handlePointClick(point.value)}
            >
              {point.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CanvasGame;
