import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

function Square(props) {
  let colorOfSquare = "white";

  if (props.pieceBeingMoved) {
    colorOfSquare = "lightgreen";
  } else if (props.isAdjacent) {
    colorOfSquare = "lightblue";
  }

  return (
    <button
      className="square"
      onClick={props.onClick}
      style={{ backgroundColor: colorOfSquare }}
    >
      {props.value}
    </button>
  );
}

class Game extends React.Component {
  render() {
    return (
        <div className="game">
            <div className="game-board">
            <Board />
        </div>
  </div>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        squares: Array(9).fill(null),
        xIsNext: true,
        moveCount: 0,
        selectedIndex: -1,
        adjacentSquares: Array(9).fill(false),
      };
    }

  handleClick(i) {
    const squares = this.state.squares.slice();
    

    if(calculateWinner(squares)) {
      return;
    }

    let currentPiece = this.state.xIsNext ? "X" : "O";

    // before there are 6 pieces on the board
    if(squares[i] === null && this.state.moveCount < 6) {
      squares[i] = currentPiece;

      this.setState({
        squares: squares,
        xIsNext: !this.state.xIsNext,
        moveCount: this.state.moveCount + 1,
        selectedIndex: -1,
        adjacentSquares: Array(9).fill(false),
      });
    } else if(this.state.moveCount >= 6) {        // after there are 6 pieces on the board

      if(squares[i] === currentPiece) {
        let centerPiece = (squares[4] === "X" && this.state.xIsNext) || (squares[4] === "O" && !this.state.xIsNext);

        this.setState({
            squares: squares,
            xIsNext: this.state.xIsNext,
            moveCount: this.state.moveCount + 1,
            selectedIndex: i,
            adjacentSquares: this.findAdjacentSquare(i, centerPiece && i !== 4), // require a win if there is a piece in the center
          });
      } else if(this.state.adjacentSquares[i]) {
        // then we select a piece to move
        squares[i] = currentPiece;
        squares[this.state.selectedIndex] = null;

        this.setState({
          squares: squares,
          xIsNext: !this.state.xIsNext,
          moveCount: this.state.moveCount + 1,
          selectedIndex: -1,
          adjacentSquares: Array(9).fill(false),
        });
      }
  }
}

// checks if there are any adjacent squares
// if there is piece in center, can either move the center piece or move another piece if that can
  // win the game
findAdjacentSquare(i, requireWin = false) {
  // return an array of all adjacent squares relative to current square (i)
  const squares = this.state.squares.slice();
  
  if (squares[i] == null) {
    return null;
  }

  const adjacencyMap = [
    [1, 3, 4],
    [0, 3, 4, 5, 2],
    [1, 4, 5],
    [0, 1, 4, 6, 7],
    [0, 1, 2, 3, 5, 6, 7, 8],
    [1, 2, 4, 7, 8],
    [3, 4, 7],
    [3, 4, 5, 6, 8],
    [4, 5, 7],
  ];

  let adjacentSquares = Array(9).fill(false);

  if (i === 4 && squares[i] !== null) {
    for (const adjacent of adjacencyMap[i]) {
      if (squares[adjacent] === null) {
        adjacentSquares[adjacent] = true;
      }
    }
    return adjacentSquares;
  }

  for (const adjacent of adjacencyMap[i]) {
    if (squares[adjacent] !== null) {
      continue;
    }

    let copyOfSquares = [...squares];
    copyOfSquares[adjacent] = squares[i];
    copyOfSquares[i] = null;

    if (requireWin) {
      if (calculateWinner(copyOfSquares) !== null) {
          adjacentSquares[adjacent] = true;
      }
    } else {
      adjacentSquares[adjacent] = true;
    }
  }

  return adjacentSquares;
}

  generateSquare(i) {
      return (
          <Square
            value={this.state.squares[i]}
            onClick={() => this.handleClick(i)}
            pieceBeingMoved={this.state.selectedIndex === i}
            isAdjacent={this.state.adjacentSquares[i]}
          />
      );
  }

  render() {
      const winner = calculateWinner(this.state.squares);
      let statusText = "";
      let status;
      if (winner) {
        status = "Winner: " + winner;
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }

      let currentPiece = this.state.xIsNext ? "X" : "O";

      if(this.state.moveCount >= 6) {
        statusText = "There are 3 " + currentPiece + "'s on the board. Select one of your pieces to move them."
      }

      return (
        <div>
          <div className="status">{status}</div>
          <div className="move-count">Turn Count: {this.state.moveCount}</div>
          <div className="status-text">{statusText}</div>
          
          <div className="board">
            <div className="board-row">
                {this.generateSquare(0)}
                {this.generateSquare(1)}
                {this.generateSquare(2)}
            </div>
            <div className="board-row">
                {this.generateSquare(3)}
                {this.generateSquare(4)}
                {this.generateSquare(5)}
            </div>
            <div className="board-row">
                {this.generateSquare(6)}
                {this.generateSquare(7)}
                {this.generateSquare(8)}
            </div>
          </div>

        </div>
      );
    }
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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);