// HTML elements
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOver = document.getElementById('gameOver');

// game settings
const boardSize = 10;
const gameSpeed = 150;
const directions = { ArrowUp: -10, ArrowDown: 10, ArrowLeft: -1, ArrowRight: 1 };
const squareTypes = { snakeSquare: 1, foodSquare: 2, emptySquare: 0 };

// game variables
let snake;
let score;
let direction;
let moveInterval;
let boardSquares;
let emptySquares;

// draw the snake on the board
const drawSnake = () => {
  snake.forEach(square => drawSquare(square, 'snakeSquare'));
};

// draw a square on the board
const drawSquare = (square, type) => {
  const [row, column] = square.split('');
  boardSquares[row][column] = squareTypes[type];
  const squareElement = document.getElementById(square);
  squareElement.setAttribute('class', `square ${type}`);

  if (type === 'emptySquare') {
    emptySquares.push(square);
  } else {
    if (emptySquares.indexOf(square) !== -1) {
      emptySquares.splice(emptySquares.indexOf(square), 1);
    }
  }
};

// update the score displayed on the board
const updateScore = () => {
  scoreBoard.innerText = score - 3;
};

// create a food square on the board
const createFood = () => {
  const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
  drawSquare(randomEmptySquare, 'foodSquare');
};

// move the snake on the board
const moveSnake = () => {
  const newSquare = String(Number(snake[snake.length - 1]) + directions[direction]).padStart(2, '0');
  const [row, column] = newSquare.split('');

  if (
    newSquare < 0 ||
    newSquare >= boardSize * boardSize ||
    (direction === 'ArrowRight' && column == 0) ||
    (direction === 'ArrowLeft' && column == 9) ||
    boardSquares[row][column] === squareTypes.snakeSquare
  ) {
    gameOverReset();
  } else {
    snake.push(newSquare);
    if (boardSquares[row][column] === squareTypes.foodSquare) {
      addFood();
    } else {
      const emptySquare = snake.shift();
      drawSquare(emptySquare, 'emptySquare');
    }
    drawSnake();
  }
};

// add a food square to the score and update the display
const addFood = () => {
  score++;
  updateScore();
  createFood();
};

// reset the game after game over
const gameOverReset = () => {
  gameOver.style.display = 'block';
  clearInterval(moveInterval);
  startButton.disabled = false;
};

// set the snake's direction
const setDirection = newDirection => {
  direction = newDirection;
};

// handle direction events based on keyboard input
const directionEvent = key => {
  switch (key.code) {
    case 'ArrowUp':
      direction !== 'ArrowDown' && setDirection(key.code);
      break;
    case 'ArrowDown':
      direction !== 'ArrowUp' && setDirection(key.code);
      break;
    case 'ArrowLeft':
      direction !== 'ArrowRight' && setDirection(key.code);
      break;
    case 'ArrowRight':
      direction !== 'ArrowLeft' && setDirection(key.code);
      break;
  }
};

// create the game board
const createBoard = () => {
  boardSquares.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      const squareValue = `${rowIndex}${columnIndex}`;
      const squareElement = document.createElement('div');
      squareElement.setAttribute('class', 'square emptySquare');
      squareElement.setAttribute('id', squareValue);
      board.appendChild(squareElement);
      emptySquares.push(squareValue);
    });
  });
};

// set up the initial game state
const setGame = () => {
  snake = ['00', '01', '02', '03'];
  score = snake.length;
  direction = 'ArrowRight';
  boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
  console.log(boardSquares);
  board.innerHTML = '';
  emptySquares = [];
  createBoard();
};

// start the game
const startGame = () => {
  setGame();
  gameOver.style.display = 'none';
  startButton.disabled = true;
  drawSnake();
  updateScore();
  createFood();
  document.addEventListener('keydown', directionEvent);
  moveInterval = setInterval(() => moveSnake(), gameSpeed);
};

// start the game when the start button is clicked
startButton.addEventListener('click', startGame);

// restart the game when Space or R is pressed
document.addEventListener('keydown', event => {
  if ((event.code === 'Space' || event.key === ' ') && gameOver.style.display === 'block') {
    startGame();
  } else if (event.code === 'KeyR' && gameOver.style.display === 'block') {
    startGame();
  }
});
