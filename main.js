/** @format */

const Color = {
	Blurple: "#5865F2",
	Greyscale: "#23272A",
	White: "#FFFFFF",
	Green: "#57F287",
	Magenta: "#EB459E",
};

const GAME_BOARD = document.querySelector("#game-board");
const CONTEXT = GAME_BOARD.getContext("2d");

const GAME_WIDTH = GAME_BOARD.width;
const GAME_HEIGHT = GAME_BOARD.height;

const SCORE_TEXT = document.querySelector("#score-text");
const RESET_BUTTON = document.querySelector("#reset-btn");

const UNIT_SIZE = 25;

const TIMEOUT_EXPIRE_SECONDS = 75;

const getVelocity = { x: UNIT_SIZE, y: 0 };

const getFood = { x: 0, y: 0 };

let score = 0;

let isRunning = false;

let snakeParts = [
	{ x: UNIT_SIZE * 4, y: 0 },
	{ x: UNIT_SIZE * 3, y: 0 },
	{ x: UNIT_SIZE * 3, y: 0 },
	{ x: UNIT_SIZE * 2, y: 0 },
	{ x: UNIT_SIZE, y: 0 },
	{ x: 0, y: 0 },
];

gameStart();

function gameStart() {
	isRunning = true;
	SCORE_TEXT.textContent = score;
	createFood();
	drawFood();
	nextTick();
}

function nextTick() {
	if (isRunning) {
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
	CONTEXT.shadowColor = Color.White;
	CONTEXT.shadowBlur = 5;
	CONTEXT.fillStyle = Color.Greyscale;
	CONTEXT.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
}

function randomFood(min, max) {
	const random = Math.round((Math.random() * (max - min) + min) / UNIT_SIZE) * UNIT_SIZE;
	return random;
}

function createFood() {
	getFood.x = randomFood(0, GAME_WIDTH - UNIT_SIZE);
	getFood.y = randomFood(0, GAME_HEIGHT - UNIT_SIZE);
}

function drawFood() {
	CONTEXT.shadowColor = Color.Magenta;
	CONTEXT.shadowBlur = 25;
	CONTEXT.fillStyle = Color.Magenta;
	CONTEXT.fillRect(getFood.x, getFood.y, UNIT_SIZE, UNIT_SIZE);
}

function moveSnake() {
	const head = { x: snakeParts[0].x + getVelocity.x, y: snakeParts[0].y + getVelocity.y };

	snakeParts.unshift(head);

	if (snakeParts[0].x === getFood.x && snakeParts[0].y === getFood.y) {
		score += 1;
		SCORE_TEXT.textContent = score;
		createFood();
	} else {
		snakeParts.pop();
	}
}

function drawSnake() {
	CONTEXT.shadowColor = Color.Green;
	CONTEXT.shadowBlur = 15;
	CONTEXT.fillStyle = Color.Green;

	for (const part of snakeParts) {
		CONTEXT.fillRect(part.x, part.y, UNIT_SIZE, UNIT_SIZE);
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

	const goingUp = getVelocity.y === -UNIT_SIZE;
	const goingDown = getVelocity.y === UNIT_SIZE;
	const goingRight = getVelocity.x === UNIT_SIZE;
	const goingLeft = getVelocity.x === -UNIT_SIZE;

	let direction = true;

	switch (direction) {
		case collectedInteraction === ButtonKeys.Left && !goingRight: {
			getVelocity.x = -UNIT_SIZE;
			getVelocity.y = 0;
			break;
		}

		case collectedInteraction === ButtonKeys.Up && !goingDown: {
			getVelocity.x = 0;
			getVelocity.y = -UNIT_SIZE;
			break;
		}

		case collectedInteraction === ButtonKeys.Right && !goingLeft: {
			getVelocity.x = UNIT_SIZE;
			getVelocity.y = 0;
			break;
		}

		case collectedInteraction === ButtonKeys.Down && !goingUp: {
			getVelocity.x = 0;
			getVelocity.y = UNIT_SIZE;
			break;
		}

		default:
			break;
	}
}

function checkGameOver() {
	const alreadyRunning = true;

	switch (alreadyRunning) {
		case snakeParts[0].x < 0: {
			isRunning = false;
			break;
		}

		case snakeParts[0].x >= GAME_WIDTH: {
			isRunning = false;
			break;
		}

		case snakeParts[0].y < 0: {
			isRunning = false;
			break;
		}

		case snakeParts[0].y >= GAME_HEIGHT: {
			isRunning = false;
			break;
		}

		default:
			break;
	}

	for (let i = 1; i < snakeParts.length; i += 1) {
		if (snakeParts[i].x === snakeParts[0].x && snakeParts[i].y === snakeParts[0].y) {
			isRunning = false;
		}
	}
}

function displayGameOver() {
	CONTEXT.font = "Muli 100px sans-serif";
	CONTEXT.shadowColor = Color.Greyscale;
	CONTEXT.shadowBlur = 5;
	CONTEXT.fillStyle = Color.Blurple;
	CONTEXT.textAlign = "center";
	CONTEXT.fillText("GAME OVER", GAME_WIDTH / 2, GAME_HEIGHT / 2);
	isRunning = false;
}

function resetGame() {
	score = 0;
	getVelocity.x = UNIT_SIZE;
	getVelocity.y = 0;
	snakeParts = [
		{ x: UNIT_SIZE * 4, y: 0 },
		{ x: UNIT_SIZE * 3, y: 0 },
		{ x: UNIT_SIZE * 2, y: 0 },
		{ x: UNIT_SIZE, y: 0 },
		{ x: 0, y: 0 },
	];
	gameStart();
}

window.addEventListener("keydown", changeDirection);
RESET_BUTTON.addEventListener("click", resetGame);
