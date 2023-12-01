// HTML elements
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOver = document.getElementById('gameOver');

// game settings
const boardSize = 10;
const gameSpeed = 100;
const directions = { arrowUp: -10, arrowDown: 10, arrowLeft: -1, arrowRight: 1 }
const squareTypes = { snakeSquare: 1, foodSquare: 2, emptySquare: 0 };

// game variables
let snake;
let score;
let direction;
let moveInterval;
let boardSquares;
let emptySquares;

const drawSnake = () => {
  snake.forEach(square => drawSquare(square, 'snakeSquare'));
}

// Relleno de cada cuadrado del tablero
const drawSquare = (square, type) => {
  const [ row, column ] = square.split('');
  boardSquares[row][column] = squareTypes[type];
  const squareElement = document.getElementById(square);
  squareElement.setAttribute('class', `square ${type}`);

  if (type === 'emptySquare') {
    emptySquares.push(square);
  }
  else {
    if (emptySquares.indexOf(square) !== -1) {
      emptySquares.splice(emptySquares.indexOf(square), 1);
    }
  }
}

const updateScore = () => {
  scoreBoard.innerText = (score - 3);
}

const createFood = () => {
  const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
  drawSquare(randomEmptySquare, 'foodSquare');
}

const moveSnake = () => {
  const newSquare = String(
    Number(snake[snake.length - 1]) + directions[direction])
    .padStart(
      2, '0'
  );
  const [row, column] = newSquare.split('');

  if (newSquare < 0 ||
    newSquare > boardSize * boardSize ||
    (direction === 'ArrowRight' && column == 0) ||
    (direction === 'ArrowLeft' && column == 9 ||
    boardSquares[row][column] === squareTypes.snakeSquare)
    ) {
      gameOverReset();
    }
    else {
      snake.push(newSquare);
      if (boardSquares[row][column] === squareTypes.foodSquare) {
        addFood();
      }
      else {
        const emptySquare = snake.shift();
        drawSquare(emptySquare, 'emptySquare');
      }
      drawSnake();
    }
}

const addFood = () => {
  score++;
  updateScore();
  createFood();
}

const gameOverReset = () => {
  gameOver.style.display = 'block';
  clearInterval(moveInterval);
  startButton.disabled = false;
}

const setDirection = newDirection => {
  direction = newDirection;
}

const directionEvent = key => {
  switch (key.code) {
    case 'ArrowUp':
      direction != 'ArrowDown' && setDirection(key.code)
      break;
    case 'ArrowDown':
      direction != 'ArrowUp' && setDirection(key.code)
      break;
    case 'ArrowLeft':
      direction != 'ArrowRight' && setDirection(key.code)
      break;
    case 'ArrowRight':
      direction != 'ArrowLeft' && setDirection(key.code)
      break;
  }
}

const createBoard = () => {
  boardSquares.forEach( (row, rowIndex) => {
    row.forEach( (column, columnIndex) => {
      const squareValue = `${rowIndex}${columnIndex}`;
      const squareElement = document.createElement('div');
      squareElement.setAttribute('class', 'square emptySquare');
      squareElement.setAttribute('id', squareValue);
      board.appendChild(squareElement);
      emptySquares.push(squareValue);
    })
  })
}

const setGame = () => {
  snake = ['00', '01', '02', '03'];
  score = snake.length;
  direction = 'arrowRight';
  boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
  console.log(boardSquares);
  board.innerHTML = ''; // Borrar contenido que tenga de antes
  emptySquares = []; // Array vacío para rellenar a medida que se cree el tablero
  createBoard();
}

const startGame = () => {
  setGame();
  gameOver.style.display = 'none';
  startButton.disabled = true;
  drawSnake();
  updateScore();
  createFood();
  document.addEventListener('keydown', directionEvent);
  moveInterval = setInterval(() => moveSnake(), gameSpeed);
}

startButton.addEventListener('click', startGame);
