import { useEffect, useState } from "react";
import { Modal } from "antd";
import { Button } from "antd";
import "./App.css";

function App() {
  const [openModal, setOpenModal] = useState(true);
  const [openModalWin, setOpenModalWin] = useState(false);
  const [boardSize, setBoardSize] = useState(0);
  const [winCell, setWinCell] = useState([]);
  const [draw, setDraw] = useState(false);

  console.log(winCell);

  const [board, setBoard] = useState(() => {
    const newBoard = [];
    for (let i = 0; i < boardSize; i++) {
      newBoard[i] = Array(boardSize).fill(0);
    }
    return newBoard;
  });

  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const handleHideModal = (size) => {
    setOpenModal(false);
    setBoardSize(size);
  };

  useEffect(() => {
    let timer;
    if (gameOver) {
      timer = setTimeout(() => {
        setOpenModalWin(true);
      }, 1500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [gameOver, draw]);

  // Render broad khi player chọn size Caro
  useEffect(() => {
    setBoard(() => {
      const newBoard = [];
      for (let i = 0; i < boardSize; i++) {
        newBoard[i] = Array(boardSize).fill(0);
      }
      return newBoard;
    });
  }, [boardSize]);

  //Thực hiện nước đi, kiểm tra trạng thái win
  const makeMove = (row, col) => {
    if (board[row][col] === 0 && !gameOver) {
      const newBoard = [...board];
      newBoard[row][col] = currentPlayer;
      setBoard(newBoard);
      if (checkWin(row, col)) {
        setGameOver(true);
      } else if (checkDraw(newBoard)) {
        setDraw(true);
        setGameOver(true);
      } else {
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }
    }
  };

  //Kiểm tra các điều kiện win
  const checkWin = (row, col) => {
    const player = board[row][col];
    setWinCell((prev) => [...prev, Number(String(row) + String(col))]);
    // Kiểm tra hàng ngang
    let count = 1;
    let i = 1;
    let incr = 1;
    let decr = 1;
    while (col - i >= 0 && board[row][col - i] === player) {
      setWinCell((prev) => [
        ...prev,
        Number(String(row) + String(col - incr++)),
      ]);
      --incr;
      count++;
      i++;
    }
    i = 1;
    while (col + i < boardSize && board[row][col + i] === player) {
      setWinCell((prev) => [
        ...prev,
        Number(String(row) + String(col + decr++)),
      ]);
      --decr;
      count++;
      i++;
    }
    if (count >= 5) {
      console.log(winCell);
      return true;
    } else {
      setWinCell([]);
    }

    // Kiểm tra hàng dọc
    setWinCell((prev) => [...prev, Number(String(row) + String(col))]);
    let incr1 = 1;
    let decr1 = 1;
    count = 1;
    i = 1;
    while (row - i >= 0 && board[row - i][col] === player) {
      setWinCell((prev) => [
        ...prev,
        Number(String(row - incr1++) + String(col)),
      ]);
      --incr1;
      count++;
      i++;
    }
    i = 1;
    while (row + i < boardSize && board[row + i][col] === player) {
      setWinCell((prev) => [
        ...prev,
        Number(String(row + decr1++) + String(col)),
      ]);
      --decr1;
      count++;
      i++;
    }
    if (count >= 5) {
      console.log(winCell);
      return true;
    } else {
      setWinCell([]);
    }

    // Kiểm tra đường chéo chính
    setWinCell((prev) => [...prev, Number(String(row) + String(col))]);
    let incr2 = 1;
    let decr2 = 1;
    count = 1;
    i = 1;
    while (row - i >= 0 && col - i >= 0 && board[row - i][col - i] === player) {
      setWinCell((prev) => [
        ...prev,
        Number(String(row - incr2++) + String(col - incr2 + 1)),
      ]);
      --incr2;
      count++;
      i++;
    }
    i = 1;
    while (
      row + i < boardSize &&
      col + i < boardSize &&
      board[row + i][col + i] === player
    ) {
      setWinCell((prev) => [
        ...prev,
        Number(String(row + decr2++) + String(col + decr2 - 1)),
      ]);
      --decr2;
      count++;
      i++;
    }
    if (count >= 5) {
      return true;
    } else {
      setWinCell([]);
    }

    // Kiểm tra đường chéo phụ
    setWinCell((prev) => [...prev, Number(String(row) + String(col))]);
    let incr3 = 1;
    let decr3 = 1;
    count = 1;
    i = 1;
    while (
      row - i >= 0 &&
      col + i < boardSize &&
      board[row - i][col + i] === player
    ) {
      setWinCell((prev) => [
        ...prev,
        Number(String(row - incr3++) + String(col + incr3 - 1)),
      ]);
      --incr3;
      count++;
      i++;
    }
    i = 1;
    while (
      row + i < boardSize &&
      col - i >= 0 &&
      board[row + i][col - i] === player
    ) {
      setWinCell((prev) => [
        ...prev,
        Number(String(row + decr3++) + String(col - decr3 + 1)),
      ]);
      --decr3;
      count++;
      i++;
    }
    if (count >= 5) {
      return true;
    } else {
      setWinCell([]);
    }

    return false;
  };

  // Kiểm tra hoà
  const checkDraw = (board) => {
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (board[i][j] === 0) {
          return false;
        }
      }
    }
    return true;
  };

  // Reset game khi có player win
  const resetGame = () => {
    setBoard(() => {
      const newBoard = [];
      for (let i = 0; i < boardSize; i++) {
        newBoard[i] = Array(boardSize).fill(0);
      }
      return newBoard;
    });
    setCurrentPlayer(1);
    setGameOver(false);
    setOpenModal(true);
    setBoardSize(0);
    setWinCell([]);
    setOpenModalWin(false);
    setDraw(false);
  };

  return (
    <div className="App">
      {!openModal && <h1>Trò chơi Caro</h1>}
      {!openModal && (
        <div className="player">
          <p>Người chơi 1: ✖️</p>
          <p>Người chơi 2: ⭕</p>
        </div>
      )}
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={
                  winCell.includes(Number(String(rowIndex) + String(colIndex)))
                    ? "cell win-elm"
                    : "cell"
                }
                id={Number(String(rowIndex) + String(colIndex))}
                onClick={(e) => {
                  makeMove(rowIndex, colIndex);
                  console.log(e.target);
                }}
                onMouseOver={(e) => {
                  e.target.classList.add("mouse-over");
                }}
                onMouseOut={(e) => {
                  e.target.classList.remove("mouse-over");
                }}
              >
                {cell === 1 ? "✖️" : cell === 2 ? "⭕" : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
      {console.log(winCell)}

      <div className="status">
        {!gameOver && !openModal && (
          <p className="player-turn">{`Đến lượt người chơi ${currentPlayer}`}</p>
        )}
      </div>

      <Modal title="Chào mừng bạn đã đến với game Caro!!!" open={openModal}>
        <h2>Vui lòng lựa chọn kích thước bàn Caro để bắt đầu 👇👇👇</h2>
        <div className="btn-list">
          <Button type="primary" onClick={() => handleHideModal(6)}>
            6x6
          </Button>
          <Button type="primary" onClick={() => handleHideModal(8)}>
            8x8
          </Button>
          <Button type="primary" onClick={() => handleHideModal(10)}>
            10x10
          </Button>
        </div>
      </Modal>

      <Modal
        title={
          draw
            ? "Kết quả hoà 🤝🤝🤝 "
            : `Người chơi ${currentPlayer === 1 ? 1 : 2} thắng 👑👑👑`
        }
        open={openModalWin}
      >
        <div className="btn-list">
          <Button type="primary" onClick={resetGame} className="reset-btn">
            Chơi lại
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
