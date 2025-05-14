const gameBoard = (function () {
	const cells = document.querySelectorAll(".cell")
	const statusText = document.getElementById("status")

	let board = [" ", " ", " ", " ", " ", " ", " ", " ", " "]

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
		})
	}

	const displayStatusText = (text) => {
		statusText = text
	}

	// console
	const printBoard = () => {
		console.log(`[${board[0]}] [${board[1]}] [${board[2]}]\n[${board[3]}] [${board[4]}] [${board[5]}]\n[${board[6]}] [${board[7]}] [${board[8]}]`)
	}

	return { getBoard, getCells, displayStatusText, drawCell, resetBoard, displayBoard, printBoard }
})()

const player = (() => {
	const createPlayer = function (name, marker) {
		return {
			getName: () => name,
			getMarker: () => marker,
		}
	}

	return { createPlayer }
})()

// Temporary players
const player1 = player.createPlayer("Usagi", "O")
const player2 = player.createPlayer("Apple Toast", "X")

const gameController = (function () {
	let firstTurn = player1
	let currentPlayer
	let gameActive

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

	const startGame = () => {
		gameActive = true
		currentPlayer = firstTurn

		gameBoard.resetBoard()
		gameBoard.displayBoard()

		// console
		console.log("Start New Game!")
		gameBoard.printBoard()

		// while (true) {
		// 	let move = getValidMove(currentPlayer)
		// 	gameBoard.drawCell(move, currentPlayer.getMarker())
		// 	gameBoard.printBoard()

		// 	if (checkWin()) {
		// 		console.log(`${currentPlayer.getName()} Won!`)
		// 		break
		// 	}
	}

	gameBoard.getCells().forEach((cell) => cell.addEventListener("click", handleClick))
	function handleClick(cell) {
		const index = cell.target.dataset.index
		const board = gameBoard.getBoard()
		// check valid move > move > displayBoard > CheckWin > SwapTurn
		if (board[index] !== " " && !gameActive) return
		board[index] = currentPlayer
		e.target.textContent = currentPlayer
	}

	const checkWin = () => {
		const board = gameBoard.getBoard()

		for (let condition of winConditions) {
			const [a, b, c] = condition

			if (board[a] !== " " && board[a] == board[b] && board[b] == board[c]) {
				gameBoard.displayStatusText(`${currentPlayer.getName} Wins!`)
				gameActive = false
				return
			}
		}

		if (!board.includes(" ")) {
			gameBoard.displayStatusText("It's a draw!")
			gameActive = false
		}
	}

	const getValidMove = (player) => {
		let index
		const board = gameBoard.getBoard()

		while (true) {
			index = parseInt(prompt(`${player.getName()}'s turn! [${player.getMarker()}] Choose a cell (0-8): `), 10)

			if (!isNaN(index) && index >= 0 && index < 9 && board[index] === " ") {
				break
			} else {
				alert("Invalid move. Choose a different cell")
			}
		}

		return index
	}

	const swapTurn = () => {
		firstTurn === player1 ? (firstTurn = player2) : (firstTurn = player1)
	}

	return { startGame, handleClick }
})()

gameController.startGame()
