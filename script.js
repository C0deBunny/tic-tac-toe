const gameBoard = (function () {
	let board = ["", "", "", "", "", "", "", "", ""]

	const getBoard = () => board

	const drawCell = (index, marker) => {
		if (index >= 0 && index < board.length && board[index] === "") {
			board[index] = marker
		}
	}

	const resetBoard = () => {
		board = ["", "", "", "", "", "", "", "", ""]
	}

	return { getBoard, drawCell, resetBoard }
})()

const createPlayer = function (name, marker) {
	return {
		getName: () => name,
		getMarker: () => marker,
	}
}

// testing
const player1 = createPlayer("Usagi", "O")
const player2 = createPlayer("Apple Toast", "X")

console.log(`name: ${player1.getName()}, marker: ${player1.getMarker()}`)

console.log(gameBoard.getBoard())
