document.getElementById('start_button').addEventListener('click', startGame)

// объявляем начальные данные
let origBoard
const humanPlayer = 'O'
const aiPlayer = 'X'
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
]

const cells = document.querySelectorAll('.cell')
startGame()

function startGame() {
  // предварительно подчищаем
  document.querySelector('.endgame').style.display = 'none'
  document.querySelector('table').style.opacity = 1
  origBoard = Array.from(Array(9).keys())
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = ''
    cells[i].style.removeProperty('background-color')
    // вешаем слцшатель на каждую ячейку
    cells[i].addEventListener('click', cellClickHandler, false)
  }
}

function cellClickHandler(e) {
  if (typeof origBoard[e.target.id] == 'number') {
    // сначала обработка хода пользователя, затем ИИ
    turn(e.target.id, humanPlayer)
    if (!checkWin(origBoard, humanPlayer) && !checkTie())
      turn(bestSpot(), aiPlayer)
  }
}

function turn(sq, player) {
  origBoard[sq] = player
  document.getElementById(sq).innerText = player
  let gameWon = checkWin(origBoard, player)
  if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
  let plays = board.reduce(
    (prev, item, index) => (item === player ? prev.concat(index) : prev),
    []
  )
  let gameWon = null
  for (let [index, win] of winningCombinations.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index, player }
      break
    }
  }
  return gameWon
}

function gameOver(gameWon) {
  for (let index of winningCombinations[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == humanPlayer ? 'blue' : 'red'
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', cellClickHandler, false)
  }
  declareWinner(gameWon.player == humanPlayer ? 'Вы выиграли!' : 'Вы проиграли')
}

function declareWinner(who) {
  document.querySelector('.endgame').style.display = 'block'
  document.querySelector('.endgame').innerText = who
  document.querySelector('table').style.opacity = 0.5
}

function emptySquares() {
  return origBoard.filter((s) => typeof s == 'number')
}

function bestSpot() {
  return minimax(origBoard, aiPlayer).index
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = 'green'
      cells[i].removeEventListener('click', cellClickHandler, false)
    }
    declareWinner('Ничья!')
    return true
  }
  return false
}

function minimax(newBoard, player) {
  // доступные клетки
  let availSpots = emptySquares()

  // проверка на состояие поражение/победа
  if (checkWin(newBoard, humanPlayer)) {
    return { score: -10 }
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 }
  } else if (availSpots.length === 0) {
    return { score: 0 }
  }
  let moves = []
  for (let i = 0; i < availSpots.length; i++) {
    let move = {}
    move.index = newBoard[availSpots[i]]
    newBoard[availSpots[i]] = player

    if (player == aiPlayer) {
      let result = minimax(newBoard, humanPlayer)
      move.score = result.score
    } else {
      let result = minimax(newBoard, aiPlayer)
      move.score = result.score
    }

    // очистить клетку
    newBoard[availSpots[i]] = move.index

    moves.push(move)
  }

  let bestMove
  if (player === aiPlayer) {
    let bestScore = -10000
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score
        bestMove = i
      }
    }
  } else {
    let bestScore = 10000
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score
        bestMove = i
      }
    }
  }

  return moves[bestMove]
}
