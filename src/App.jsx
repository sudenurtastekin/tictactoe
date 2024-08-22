import { useState, useEffect } from "react";
import './App.css';
import cross from "./assets/cross.png"
import circle from "./assets/circle.png"
import restart from "./assets/restart.png"

function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={`square ${value ? 'disabled' : ''}`}
      onClick={onSquareClick}
      style={{
        backgroundColor: highlight ? (value === cross ? '#31C3BD' : '#F2B137') : '',
      }}
    >
      {value && <img src={value} alt="" />}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, resetGame, crossWins, circleWins }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winningSquares, setWinningSquares] = useState([]);

  useEffect(() => {
    const [currentWinner, winningLine] = calculateWinner(squares);
    setWinner(currentWinner);
    if (currentWinner) {
      setIsModalOpen(true);
      setWinningSquares(winningLine);
    }
  }, [squares]);

  function handleClick(i) {
    if (winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = cross;
    } else {
      nextSquares[i] = circle;
    }
    onPlay(nextSquares);
  }

  let nextPlayerStatus = (xIsNext ? "X" : "O") + " TURN";

  function handleRestart() {
    setIsModalOpen(false);
    setWinningSquares([]);
    resetGame();
  }

  function handleQuit() {
    setIsModalOpen(false);
  }

  const textColor = winner === cross ? '#31C3BD' : (winner === circle ? '#F2B137' : 'black');

  return (
    <>
      <div className="status">
        <div className="pageLogo">
          <img src={cross} alt="Cross" />
          <img src={circle} alt="Circle" />
        </div>
        <div className="nextPlayerInfo">{nextPlayerStatus}</div>
        <button onClick={() => window.location.reload()}>
          <img src={restart} alt="Restart" />
        </button>
      </div>

      <div className="allBoards">
        <div className="board-row">
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} highlight={winningSquares.includes(0)} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} highlight={winningSquares.includes(1)} />
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} highlight={winningSquares.includes(2)} />
        </div>

        <div className="board-row">
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} highlight={winningSquares.includes(3)} />
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} highlight={winningSquares.includes(4)} />
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} highlight={winningSquares.includes(5)} />
        </div>

        <div className="board-row">
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} highlight={winningSquares.includes(6)} />
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} highlight={winningSquares.includes(7)} />
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} highlight={winningSquares.includes(8)} />
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2 style={{ color: textColor }}>
              {winner === cross ? "X TAKES THE ROUND" : "O TAKES THE ROUND"}
            </h2>
            <div className="modal-buttons">
              <span className="quit" onClick={handleQuit}>
                Quit
              </span>
              <span className="close" onClick={handleRestart}>
                Restart Game
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="scoreboard">
        <div className="score crossWins"><p>X WINS</p> <h3>{crossWins}</h3></div>
        <div className="score"></div>
        <div className="score circleWins"><p>O WINS</p> <h3>{circleWins}</h3></div>
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [crossWins, setCrossWins] = useState(0);
  const [circleWins, setCircleWins] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const [winner] = calculateWinner(nextSquares);
    if (winner) {
      if (winner === cross) {
        setCrossWins(crossWins + 1);
      } else if (winner === circle) {
        setCircleWins(circleWins + 1);
      }
    }
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          resetGame={resetGame}
          crossWins={crossWins}
          circleWins={circleWins}
        />
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, []];
}
