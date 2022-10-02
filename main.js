/** @format */

window.addEventListener("DOMContentLoaded", (event) => {
	window.focus();

	let snakePosition;
	let applePosition;

	let startTimestamp;
	let lastTimestamp;
	let stepsTaken;
	let score;
	let contrast;

	let inputs;

	let gameStarted = false;
	let hardMode = false;

	const width = 15;
	const height = 15;

	const speed = 200;
	let fadeSpeed = 5000;
	let fadeExponential = 1.024;
	const contrastIncrease = 0.5;
	const color = "#23272A";

	const grid = document.querySelector(".grid");
	for (let i = 0; i < width * height; i++) {
		const content = document.createElement("div");
		content.setAttribute("class", "content");
		content.setAttribute("id", i);

		const tile = document.createElement("div");
		tile.setAttribute("class", "tile");
		tile.appendChild(content);

		grid.appendChild(tile);
	}

	const tiles = document.querySelectorAll(".grid .tile .content");

	const containerElement = document.querySelector(".container");
	const noteElement = document.querySelector("footer");
	const contrastElement = document.querySelector(".contrast");
	const scoreElement = document.querySelector(".score");

	resetGame();

	function resetGame() {
		snakePosition = [168, 169, 170, 171];
		applePosition = 100;

		startTimestamp = undefined;
		lastTimestamp = undefined;
		stepsTaken = -1;
		score = 0;
		contrast = 1;

		inputs = [];

		contrastElement.innerText = `${Math.floor(contrast * 100)}%`;
		scoreElement.innerText = hardMode ? `H ${score}` : score;

		for (const tile of tiles) {
			setTile(tile);
		}

		setTile(tiles[applePosition], {
			"background-color": color,
			"border-radius": "50%",
		});

		for (const i of snakePosition.slice(1)) {
			const snakePart = tiles[i];
			snakePart.style.backgroundColor = color;

			if (i === snakePosition[snakePosition.length - 1]) {
				snakePart.style.left = 0;
			}
			if (i === snakePosition[0]) {
				snakePart.style.right = 0;
			}
		}
	}

	window.addEventListener("keydown", (event) => {
		if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "H", "h", "E", "e"].includes(event.key)) {
			return;
		}

		event.preventDefault();

		if (event.key === " ") {
			resetGame();
			startGame();
			return;
		}

		if (event.key === "H" || event.key === "h") {
			hardMode = true;
			fadeSpeed = 4000;
			fadeExponential = 1.025;
			noteElement.innerHTML = "Hard mode. Press space to start";
			noteElement.style.opacity = 1;
			resetGame();
		} else if (event.key === "E" || event.key === "e") {
			hardMode = false;
			fadeSpeed = 5000;
			fadeExponential = 1.024;
			noteElement.innerHTML = "Easy mode. Press space to start";
			noteElement.style.opacity = 1;
			resetGame();
		}

		if (event.key === "ArrowLeft" && inputs[inputs.length - 1] !== "left" && headDirection() !== "right") {
			inputs.push("left");
			if (!gameStarted) startGame();
		} else if (event.key === "ArrowUp" && inputs[inputs.length - 1] !== "up" && headDirection() !== "down") {
			inputs.push("up");
			if (!gameStarted) startGame();
		} else if (event.key === "ArrowRight" && inputs[inputs.length - 1] !== "left" && headDirection() !== "left") {
			inputs.push("right");
			if (!gameStarted) startGame();
		} else if (event.key === "ArrowDown" && inputs[inputs.length - 1] !== "up" && headDirection() !== "up") {
			inputs.push("down");
			if (!gameStarted) startGame();
		} else {
			return;
		}
	});

	function startGame() {
		gameStarted = true;
		noteElement.style.opacity = 0;
		window.requestAnimationFrame(main);
	}

	function main(timestamp) {
		try {
			if (startTimestamp === undefined) {
				startTimestamp = timestamp;
			}

			const totalElapsedTime = timestamp - startTimestamp;
			const timeElapsedSinceLastCall = timestamp - lastTimestamp;

			const stepsShouldHaveTaken = Math.floor(totalElapsedTime / speed);
			const percentageOfStep = (totalElapsedTime % speed) / speed;

			if (stepsTaken !== stepsShouldHaveTaken) {
				stepAndTransition(percentageOfStep);

				const headPosition = snakePosition[snakePosition.length - 1];
				if (headPosition === applePosition) {
					score++;
					scoreElement.innerText = hardMode ? `H ${score}` : score;

					addNewApple();

					contrast = Math.min(1, contrast + contrastIncrease);

					console.log(`Contrast increased by ${contrastIncrease * 100}%`);
					console.log("New fade speed (from 100% to 0% in milliseconds)", Math.pow(fadeExponential, score) * fadeSpeed);
				}

				stepsTaken++;
			} else {
				transition(percentageOfStep);
			}

			if (lastTimestamp) {
				const contrastDecrease = timeElapsedSinceLastCall / (Math.pow(fadeExponential, score) * fadeSpeed);
				contrast = Math.max(0, contrast - contrastDecrease);
			}

			contrastElement.innerText = `${Math.floor(contrast * 100)}%`;
			containerElement.style.opacity = contrast;

			window.requestAnimationFrame(main);
		} catch (error) {
			const pressSpaceToStart = "Press space to reset the game.";
			const changeMode = hardMode ? "Back to easy mode? Press letter E." : "Ready for hard mode? Press letter H.";
			const followMe = `Follow me <a href="https://github.com/almostJohn", target="_blank">@almostJohn</a>`;
			noteElement.innerHTML = `${error.message}. ${pressSpaceToStart} <div>${changeMode}</div> ${followMe}`;
			noteElement.style.opacity = 1;
			containerElement.style.opacity = 1;
		}

		lastTimestamp = timestamp;
	}

	function stepAndTransition(percentageOfStep) {
		const newHeadPosition = getNextPosition();
		console.log(`Snake stepping into tile ${newHeadPosition}`);
		snakePosition.push(newHeadPosition);

		const previousTail = tiles[snakePosition[0]];
		setTile(previousTail);

		if (newHeadPosition !== applePosition) {
			snakePosition.shift();

			const tail = tiles[snakePosition[0]];
			const tailDir = tailDirection();

			const tailValue = `${100 - percentageOfStep * 100}%`;

			if (tailDir === "right") {
				setTile(tail, {
					left: 0,
					width: tailValue,
					"background-color": color,
				});
			}

			if (tailDir === "left") {
				setTile(tail, {
					right: 0,
					width: tailValue,
					"background-color": color,
				});
			}

			if (tailDir === "down") {
				setTile(tail, {
					top: 0,
					height: tailValue,
					"background-color": color,
				});
			}

			if (tailDir === "up") {
				setTile(tail, {
					bottom: 0,
					height: tailValue,
					"background-color": color,
				});
			}

			const previousHead = tiles[snakePosition[snakePosition.length - 2]];
			setTile(previousHead, { "background-color": color });

			const head = tiles[newHeadPosition];
			const headDir = headDirection();
			const headValue = `${percentageOfStep * 100}%`;

			if (headDir === "right") {
				setTile(head, {
					left: 0,
					width: headValue,
					"background-color": color,
					"border-radius": 0,
				});
			}

			if (headDir === "left") {
				setTile(head, {
					right: 0,
					width: headValue,
					"background-color": color,
					"border-radius": 0,
				});
			}

			if (headDir === "down") {
				setTile(head, {
					top: 0,
					height: headValue,
					"background-color": color,
					"border-radius": 0,
				});
			}

			if (headDir === "up") {
				setTile(head, {
					bottom: 0,
					height: headValue,
					"background-color": color,
					"border-radius": 0,
				});
			}
		}
	}

	function transition(percentageOfStep) {
		const head = tiles[snakePosition[snakePosition.length - 1]];
		const headDir = headDirection();
		const headValue = `${percentageOfStep * 100}%`;

		if (headDir === "right" || headDir === "left") {
			head.style.width = headValue;
		}
		if (headDir === "down" || headDir === "up") {
			head.style.height = headValue;
		}

		const tail = tiles[snakePosition[0]];
		const tailDir = tailDirection();
		const tailValue = `${100 - percentageOfStep * 100}%`;

		if (tailDir === "right" || tailDir === "left") {
			tail.style.width = tailValue;
		}
		if (tailDir === "down" || tailDir === "up") {
			tail.style.height = tailValue;
		}
	}

	function getNextPosition() {
		const headPosition = snakePosition[snakePosition.length - 1];
		const snakeDirection = inputs.shift() || headDirection();

		switch (snakeDirection) {
			case "right": {
				const nextPosition = headPosition + 1;
				if (nextPosition % width === 0) {
					throw new Error("The snake hit the wall");
				}

				if (snakePosition.slice(1).includes(nextPosition)) {
					throw new Error("The snake bit itself");
				}

				return nextPosition;
			}

			case "left": {
				const nextPosition = headPosition - 1;
				if (nextPosition % width === width - 1 || nextPosition < 0) {
					throw new Error("The snake hit the wall");
				}

				if (snakePosition.slice(1).includes(nextPosition)) {
					throw new Error("The snake bit itself");
				}

				return nextPosition;
			}

			case "down": {
				const nextPosition = headPosition + width;
				if (nextPosition > width * height - 1) {
					throw new Error("The snake hit the wall");
				}

				if (snakePosition.slice(1).includes(nextPosition)) {
					throw new Error("The snake bit itself");
				}

				return nextPosition;
			}

			case "up": {
				const nextPosition = headPosition - width;
				if (nextPosition < 0) {
					throw new Error("The snake hit the wall");
				}

				if (snakePosition.slice(1).includes(nextPosition)) {
					throw new Error("The snake bit itself");
				}

				return nextPosition;
			}

			default:
				break;
		}
	}

	function headDirection() {
		const head = snakePosition[snakePosition.length - 1];
		const neck = snakePosition[snakePosition.length - 2];

		return getDirection(head, neck);
	}

	function tailDirection() {
		const tail_one = snakePosition[0];
		const tail_two = snakePosition[1];

		return getDirection(tail_one, tail_two);
	}

	function getDirection(first, second) {
		if (first - 1 === second) return "right";
		if (first + 1 === second) return "left";
		if (first - width === second) return "down";
		if (first + width === second) return "up";
		throw new Error("The two tile are not connected");
	}

	function addNewApple() {
		let newPosition;

		do {
			newPosition = Math.floor(Math.random() * width * height);
		} while (snakePosition.includes(newPosition));

		setTile(tiles[newPosition], {
			"background-color": color,
			"border-radius": "50%",
		});

		applePosition = newPosition;
	}

	function setTile(element, overrides = {}) {
		const defaults = {
			width: "100%",
			height: "100%",
			top: "auto",
			right: "auto",
			bottom: "auto",
			left: "auto",
			"background-color": "transparent",
		};

		const cssProperties = { ...defaults, ...overrides };
		element.style.cssText = Object.entries(cssProperties)
			.map(([key, value]) => `${key}: ${value};`)
			.join(" ");
	}
});
