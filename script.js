const EMPTY = " "
const BOARD_SIZE = 9

const gameBoard = (function () {
	const cells = document.querySelectorAll(".cell")
	const statusText = document.getElementById("status")

	let board = Array(BOARD_SIZE).fill(EMPTY)

	const getBoard = () => board
	const getCells = () => cells

	const drawCell = (index, marker) => {
		if (index >= 0 && index < board.length && board[index] === " ") {
			board[index] = marker
		}
	}

	const resetBoard = () => {
		board = [" ", " ", " ", " ", " ", " ", " ", " ", " "]
	}

	const displayBoard = () => {
		cells.forEach((cell, index) => {
			cell.textContent = board[index]
			if (cell.textContent === "O") {
				cell.style.color = player.getPlayer1().getColor()
			} else {
				cell.style.color = player.getPlayer2().getColor()
			}
		})
	}

	const displayStatusText = (text, color) => {
		statusText.textContent = text
		statusText.style.color = color
	}

	// console
	const printBoard = () => {
		console.log(`[${board[0]}] [${board[1]}] [${board[2]}]\n[${board[3]}] [${board[4]}] [${board[5]}]\n[${board[6]}] [${board[7]}] [${board[8]}]`)
	}

	return { getBoard, getCells, displayStatusText, drawCell, resetBoard, displayBoard, printBoard }
})()

const player = (() => {
	const createPlayer = function (name, marker, color) {
		return {
			getName: () => name,
			setName: (newName) => {
				name = newName
			},

			getMarker: () => marker,

			getColor: () => color,
			setColor: (newColor) => {
				color = newColor
			},
		}
	}

	// Default players
	const player1 = createPlayer("Player 1", "O", "#4ba3c3")
	const player2 = createPlayer("Player 2", "X", "#ff595e")

	// Change Player data
	document.querySelector(".side-container").addEventListener("change", (event) => {
		const element = event.target

		if (element.tagName !== "INPUT") return

		const parent = element.closest(".player1, .player2")
		if (!parent) return

		const player = parent.classList.contains("player1") ? player1 : player2

		if (element.type === "text") {
			player.setName(element.value)

			gameController.updateTurnStatus()
			scoreboard.displayScore()
		} else if (element.type === "color") {
			player.setColor(element.value)

			gameController.updateTurnStatus()
			gameBoard.displayBoard()
			scoreboard.displayScore()
		}
	})

	const getPlayer1 = () => player1
	const getPlayer2 = () => player2

	return { getPlayer1, getPlayer2 }
})()

const scoreboard = (() => {
	let player1Score = 0
	let player2Score = 0

	const getScore = () => {
		return { player1Score, player2Score }
	}

	const addScore = (player) => {
		if (player === "O") {
			player1Score++
		} else if (player === "X") {
			player2Score++
		}
	}

	const displayScore = () => {
		document.getElementById("player1-name").textContent = player.getPlayer1().getName()
		document.getElementById("player1-name").style.color = player.getPlayer1().getColor()
		document.getElementById("player2-name").textContent = player.getPlayer2().getName()
		document.getElementById("player2-name").style.color = player.getPlayer2().getColor()
		document.getElementById("player1-score").textContent = player1Score
		document.getElementById("player1-score").style.color = player.getPlayer1().getColor()
		document.getElementById("player2-score").textContent = player2Score
		document.getElementById("player2-score").style.color = player.getPlayer2().getColor()
	}

	return { getScore, addScore, displayScore }
})()

const gameController = (function () {
	let player1 = player.getPlayer1()
	const player2 = player.getPlayer2()
	let firstTurn = player1
	let currentPlayer = firstTurn
	let gameActive = false
	scoreboard.displayScore()
	const restartButton = document.getElementById("restart")

	const winConditions = [
		[0, 1, 2], // Row 1
		[3, 4, 5], // Row 2
		[6, 7, 8], // Row 3
		[0, 3, 6], // Col 1
		[1, 4, 7], // Col 2
		[2, 5, 8], // Col 3
		[0, 4, 8], // Diagonal TL-BR
		[2, 4, 6], // Diagonal TR-BL
	]

	const init = () => {
		gameBoard.getCells().forEach((cell) => cell.addEventListener("click", handleClick))

		startGame()
	}

	const startGame = () => {
		gameActive = true
		updateRestartButton()
		currentPlayer = firstTurn

		gameBoard.resetBoard()
		gameBoard.displayBoard()
		gameBoard.displayStatusText(`It's ${currentPlayer.getName()}'s turn!`, currentPlayer.getColor())

		// console
		console.log("Start New Game!")
		gameBoard.printBoard()
	}

	restartButton.addEventListener("click", function () {
		startGame()
	})

	const updateRestartButton = () => {
		gameActive === true ? (restartButton.style.display = "none") : (restartButton.style.display = "flex")
	}

	function handleClick(event) {
		const index = event.target.dataset.index

		if (!getValidMove(index)) return
		gameBoard.drawCell(index, currentPlayer.getMarker())
		gameBoard.displayBoard()

		// console
		gameBoard.printBoard()

		if (checkWin()) return

		swapTurn()
		updateTurnStatus()
	}

	const checkWin = () => {
		const board = gameBoard.getBoard()

		for (let condition of winConditions) {
			const [a, b, c] = condition

			if (board[a] !== " " && board[a] == board[b] && board[b] == board[c]) {
				gameBoard.displayStatusText(`${currentPlayer.getName()} Wins!`, currentPlayer.getColor())
				gameActive = false
				scoreboard.addScore(currentPlayer.getMarker())
				scoreboard.displayScore()
				updateRestartButton()
				swapFirstTurn()
				return true
			}
		}

		if (!board.includes(" ")) {
			gameBoard.displayStatusText("It's a draw!", "#70587c")
			gameActive = false
			updateRestartButton()
			swapFirstTurn()
			return true
		}
	}

	const getValidMove = (index) => {
		const board = gameBoard.getBoard()

		if (!isNaN(index) && index >= 0 && index < BOARD_SIZE && board[index] === EMPTY && gameActive === true) {
			return index
		}

		return null
	}

	const swapTurn = () => {
		currentPlayer === player1 ? (currentPlayer = player2) : (currentPlayer = player1)
	}

	const swapFirstTurn = () => {
		firstTurn === player1 ? (firstTurn = player2) : (firstTurn = player1)
	}

	const updateTurnStatus = () => {
		if (gameActive === true) {
			gameBoard.displayStatusText(`It's ${currentPlayer.getName()}'s turn!`, currentPlayer.getColor())
		}
	}

	return { init, startGame, handleClick, updateTurnStatus }
})()

gameController.init()
