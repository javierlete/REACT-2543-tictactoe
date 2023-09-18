import './App.css';
import { useState } from 'react'

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;

  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    // console.log('history', history);
    // console.log('...history', ...history);
    // console.log('...history, nextSquares', ...history, nextSquares);
    // console.log('[...history, nextSquares]', [...history, nextSquares]);

    // const historyCopy = history.slice();
    // historyCopy.push(nextSquares);
    // setHistory(historyCopy);
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Ir al movimiento #' + move;
    } else {
      description = 'Ir al inicio del juego';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay }) {

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();

    nextSquares[i] = xIsNext ? 'X' : 'O';

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);

  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const lineas = [];

  for (let numeroLinea = 0; numeroLinea < 3; numeroLinea++) {
    const celdas = squares.slice(numeroLinea * 3, (numeroLinea * 3) + 3);
    
    lineas.push(<div key={numeroLinea} className="board-row">
      {celdas.map((celda, i) => <Square key={i + numeroLinea * 3} value={celda} onSquareClick={() => handleClick(i * numeroLinea)} />)}
    </div>);
  }

  return <>
    <div className="status">{status}</div>
    {lineas}
  </>;
}

function Square({ value, onSquareClick }) {
  return <button
    className="square" onClick={onSquareClick}
  >
    {value}
  </button>;
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
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

