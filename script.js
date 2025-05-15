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
		statusText.textContent = text
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

	const getPlayer1 = () => createPlayer("Usagi", "O")

	const getPlayer2 = () => createPlayer("Apple Toast", "X")

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

	const startGame = () => {
		gameActive = true
		currentPlayer = firstTurn

		gameBoard.resetBoard()
		gameBoard.displayBoard()
		gameBoard.displayStatusText(`It's ${currentPlayer.getName()}'s turn!`)

		// console
		console.log("Start New Game!")
		gameBoard.printBoard()
	}

	gameBoard.getCells().forEach((cell) => cell.addEventListener("click", handleClick))
	function handleClick(cell) {
		const index = cell.target.dataset.index

		if (!getValidMove(index)) return
		gameBoard.drawCell(index, currentPlayer.getMarker())
		gameBoard.displayBoard()

		// console
		gameBoard.printBoard()

		if (checkWin()) return

		swapTurn()
		gameBoard.displayStatusText(`It's ${currentPlayer.getName()}'s turn!`)
	}

	const checkWin = () => {
		const board = gameBoard.getBoard()

		for (let condition of winConditions) {
			const [a, b, c] = condition

			if (board[a] !== " " && board[a] == board[b] && board[b] == board[c]) {
				gameBoard.displayStatusText(`${currentPlayer.getName()} Wins!`)
				gameActive = false
				swapFirstTurn()
				return true
			}
		}

		if (!board.includes(" ")) {
			gameBoard.displayStatusText("It's a draw!")
			gameActive = false
			swapFirstTurn()
			return true
		}
	}

	const getValidMove = (index) => {
		const board = gameBoard.getBoard()

		if (!isNaN(index) && index >= 0 && index < 9 && board[index] === " " && gameActive === true) {
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

	return { startGame, handleClick }
})()

gameController.startGame()
