const gameBoard = (function () {
	let board = [" ", " ", " ", " ", " ", " ", " ", " ", " "]

	const getBoard = () => board

	const drawCell = (index, marker) => {
		if (index >= 0 && index < board.length && board[index] === " ") {
			board[index] = marker
		}
	}

	const resetBoard = () => {
		board = [" ", " ", " ", " ", " ", " ", " ", " ", " "]
	}

	const printBoard = () => {
		console.log(`[${board[0]}] [${board[1]}] [${board[2]}]\n[${board[3]}] [${board[4]}] [${board[5]}]\n[${board[6]}] [${board[7]}] [${board[8]}]`)
	}

	return { getBoard, drawCell, resetBoard, printBoard }
})()

const createPlayer = function (name, marker) {
	return {
		getName: () => name,
		getMarker: () => marker,
	}
}

// Temporary players
const player1 = createPlayer("Usagi", "O")
const player2 = createPlayer("Apple Toast", "X")

const gameController = (function () {
	let playerTurn = player1

	const swapTurn = () => {
		playerTurn === player1 ? (playerTurn = player2) : (playerTurn = player1)
	}

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

	const checkWin = () => {
		const board = gameBoard.getBoard()

		for (let condition of winConditions) {
			const [a, b, c] = condition

			if (board[a] !== " " && board[a] == board[b] && board[b] == board[c]) {
				return board[a]
			}
		}

		return null
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

	const startGame = () => {
		// starts a new game
		gameBoard.resetBoard()
		console.log("Start New Game!")
		gameBoard.printBoard()

		let currentPlayer = playerTurn
		const MAX_TURNS = 9
		let turn = 0

		while (true) {
			let move = getValidMove(currentPlayer)
			gameBoard.drawCell(move, currentPlayer.getMarker())
			gameBoard.printBoard()

			if (checkWin()) {
				console.log(`${currentPlayer.getName()} Won!`)
				break
			}

			turn++
			if (turn >= MAX_TURNS) {
				console.log("It's a Tie!")
				break
			}

			console.log("-------------------")

			currentPlayer === player1 ? (currentPlayer = player2) : (currentPlayer = player1)
		}

		swapTurn()
	}

	return { startGame, checkWin }
})()
