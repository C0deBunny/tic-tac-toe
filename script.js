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
				cell.style.color = "#4ba3c3"
			} else {
				cell.style.color = "#ff595e"
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
			getMarker: () => marker,
			getColor: () => color,
		}
	}

	// create players from DOM
	const getPlayer1 = () => createPlayer("Usagi", "O", "#4ba3c3")

	const getPlayer2 = () => createPlayer("Apple Toast", "X", "#ff595e")

	// Update player

	return { getPlayer1, getPlayer2 }
})()

const gameController = (function () {
	const player1 = player.getPlayer1()
	const player2 = player.getPlayer2()
	let firstTurn = player1
	let currentPlayer = firstTurn
	let gameActive = false

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
		// addEventListener("change", (event) => {})

		startGame()
	}

	const startGame = () => {
		gameActive = true
		currentPlayer = firstTurn

		gameBoard.resetBoard()
		gameBoard.displayBoard()
		gameBoard.displayStatusText(`It's ${currentPlayer.getName()}'s turn!`, currentPlayer.getColor())

		// console
		console.log("Start New Game!")
		gameBoard.printBoard()
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
		gameBoard.displayStatusText(`It's ${currentPlayer.getName()}'s turn!`, currentPlayer.getColor())
	}

	const checkWin = () => {
		const board = gameBoard.getBoard()

		for (let condition of winConditions) {
			const [a, b, c] = condition

			if (board[a] !== " " && board[a] == board[b] && board[b] == board[c]) {
				gameBoard.displayStatusText(`${currentPlayer.getName()} Wins!`, currentPlayer.getColor())
				gameActive = false
				swapFirstTurn()
				return true
			}
		}

		if (!board.includes(" ")) {
			gameBoard.displayStatusText("It's a draw!", "#70587c")
			gameActive = false
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

	return { init, startGame, handleClick }
})()

gameController.init()
