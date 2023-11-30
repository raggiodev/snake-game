// HTML elements
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOver = document.getElementById('gameOver');

// game settings
const boardSize = 10;
const gameSpeed = 100;
const directions = { arrowUp: 10, arrowDown: -10, arrowLeft: 1, arrowRight: -1 }
const squareTypes = { snakeSquare: 1, foodSquare: 2, emptySquare: 0 };

// game variables
let snake;
let score;
let direction;
let moveInterval;
let boardSquares;
let emptySquares;
