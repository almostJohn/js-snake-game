/** @format */

const Color = {
	Blurple: "#5865f2",
	Green: "#57F287",
	Pink: "#EB459E",
	Greyscale: "#2f3136",
};

const snakeBoard = document.querySelector("#snake-board");
const context = snakeBoard.getContext("2d");
const scoreText = document.querySelector("#score-text");
const resetButton = document.querySelector("#reset-btn");
const gameWidth = snakeBoard.width;
const gameHeight = snakeBoard.height;
const unitSize = 25;
const TIMEOUT_EXPIRE_SECONDS = 75;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
	{ x: unitSize * 4, y: 0 },
	{ x: unitSize * 3, y: 0 },
	{ x: unitSize * 2, y: 0 },
	{ x: unitSize, y: 0 },
	{ x: 0, y: 0 },
];

window.addEventListener("keydown", changeDirection);
resetButton.addEventListener("click", resetGame);

gameStart();

function gameStart() {
	running = true;
	scoreText.textContent = score;
	createFood();
	drawFood();
	nextTick();
}

function nextTick() {
	if (running) {
		setTimeout(() => {
			clearBoard();
			drawFood();
			moveSnake();
			drawSnake();
			checkGameOver();
			nextTick();
		}, TIMEOUT_EXPIRE_SECONDS);
	} else {
		displayGameOver();
	}
}

function clearBoard() {
	context.fillStyle = Color.Greyscale;
	context.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
	const randomFood = (min, max) => {
		const randomNumber = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
		return randomNumber;
	};

	foodX = randomFood(0, gameWidth - unitSize);
	foodY = randomFood(0, gameWidth - unitSize);
}

function drawFood() {
	context.fillStyle = Color.Pink;
	context.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
	const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };

	snake.unshift(head);

	if (snake[0].x === foodX && snake[0].y === foodY) {
		score += 1;
		scoreText.textContent = score;
		createFood();
	} else {
		snake.pop();
	}
}

function drawSnake() {
	context.fillStyle = Color.Green;

	for (const part of snake) {
		context.fillRect(part.x, part.y, unitSize, unitSize);
	}
}

function changeDirection(event) {
	const collectedInteraction = event.keyCode;

	const ButtonKeys = {
		Left: 37,
		Up: 38,
		Right: 39,
		Down: 40,
	};

	const goingUp = yVelocity === -unitSize;
	const goingDown = yVelocity === unitSize;
	const goingRight = xVelocity === unitSize;
	const goingLeft = xVelocity === -unitSize;

	switch (true) {
		case collectedInteraction === ButtonKeys.Left && !goingRight: {
			xVelocity = -unitSize;
			yVelocity = 0;
			break;
		}

		case collectedInteraction === ButtonKeys.Up && !goingDown: {
			xVelocity = 0;
			yVelocity = -unitSize;
			break;
		}

		case collectedInteraction === ButtonKeys.Right && !goingLeft: {
			xVelocity = unitSize;
			yVelocity = 0;
			break;
		}

		case collectedInteraction === ButtonKeys.Down && !goingUp: {
			xVelocity = 0;
			yVelocity = unitSize;
			break;
		}

		default:
			break;
	}
}

function checkGameOver() {
	switch (true) {
		case snake[0].x < 0:
			running = false;
			break;
		case snake[0].x >= gameWidth:
			running = false;
			break;
		case snake[0].y < 0:
			running = false;
			break;
		case snake[0].y >= gameHeight:
			running = false;
			break;
		default:
			break;
	}

	for (let i = 1; i < snake.length; i += 1) {
		if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
			running = false;
		}
	}
}

function displayGameOver() {
	context.font = "50px MV Boli";
	context.fillStyle = Color.Blurple;
	context.textAlign = "center";
	context.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
	running = false;
}

function resetGame() {
	score = 0;
	xVelocity = unitSize;
	yVelocity = 0;
	snake = [
		{ x: unitSize * 4, y: 0 },
		{ x: unitSize * 3, y: 0 },
		{ x: unitSize * 2, y: 0 },
		{ x: unitSize, y: 0 },
		{ x: 0, y: 0 },
	];
	gameStart();
}
