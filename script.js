/** @format */

// Color
const Colors = {
	Blurple: "#5865f2",
	Green: "#57F287",
	Pink: "#EB459E",
	Greyscale: "#2f3136",
};

// Board
let blockSize = 25;
let rows = 20;
let columns = 20;
let board;
let context;

// Snake
let snakeX = blockSize * 5;
let snakeY = blockSize * 5;

// Snake velocity
let velocityX = 0;
let velocityY = 0;

// Snake body
let snakeBody = [];

// Food
let foodX;
let foodY;

const UPDATE_SECONDS = 1000 / 10;

let gameOver = false;

window.onload = function () {
	board = document.getElementById("snake_board");

	board.height = rows * blockSize;
	board.width = columns * blockSize;
	context = board.getContext("2d");

	placeFood();
	document.addEventListener("keyup", changeDirection);
	setInterval(update, UPDATE_SECONDS);
};

function update() {
	if (gameOver) {
		return;
	}

	context.fillStyle = Colors.Blurple;
	context.fillRect(0, 0, board.width, board.height);

	context.fillStyle = Colors.Pink;
	context.fillRect(foodX, foodY, blockSize, blockSize);

	if (snakeX === foodX && snakeY === foodY) {
		snakeBody.push([foodX, foodY]);
		placeFood();
	}

	for (let i = snakeBody.length - 1; i > 0; i--) {
		snakeBody[i] = snakeBody[i - 1];
	}

	if (snakeBody.length) {
		snakeBody[0] = [snakeX, snakeY];
	}

	context.fillStyle = Colors.Green;
	snakeX += velocityX * blockSize;
	snakeY += velocityY * blockSize;
	context.fillRect(snakeX, snakeY, blockSize, blockSize);

	for (let i = 0; i < snakeBody.length; i++) {
		context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
	}

	// Game over conditions
	if (snakeX < 0 || snakeX > columns * blockSize || snakeY < 0 || snakeY > rows * blockSize) {
		gameOver = true;
		alert("Game Over! try again");
	}

	for (let i = 0; i < snakeBody.length; i++) {
		if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
			gameOver = true;
			alert("Game Over! try again");
		}
	}
}

function changeDirection(e) {
	if (e.code === "ArrowUp" && velocityY !== 1) {
		velocityX = 0;
		velocityY = -1;
	} else if (e.code === "ArrowDown" && velocityY !== -1) {
		velocityX = 0;
		velocityY = 1;
	} else if (e.code === "ArrowLeft" && velocityX !== 1) {
		velocityX = -1;
		velocityY = 0;
	} else if (e.code === "ArrowRight" && velocityX !== -1) {
		velocityX = 1;
		velocityY = 0;
	}
}

function placeFood() {
	foodX = Math.floor(Math.random() * columns) * blockSize;
	foodY = Math.floor(Math.random() * rows) * blockSize;
}
