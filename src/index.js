import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a, b, c]]
    } else if (squares.every((element) => element !== null)) {
      return 'draw'
    }
  }
  return null
}

const changeColor = (numbers, color) => {
  numbers.forEach((number) => {
    document.getElementById('square-' + number).classList.add(color)
  })
}

const Square = (props) => {
  return (
    <button
      id={'square-' + props.number}
      className={'square'}
      onClick={(e) => props.onClick()}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        color={this.props.color}
        number={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  squares() {
    let squares = []
    for (let i = 0; i <= 8; i++) {
      squares.push(this.renderSquare(i))
    }

    return squares
  }

  getSquare(squareRow) {
    let squares = []
    if (squareRow === 0) {
      squares.push(this.squares()[0], this.squares()[1], this.squares()[2])
    } else if (squareRow === 1) {
      squares.push(this.squares()[3], this.squares()[4], this.squares()[5])
    } else {
      squares.push(this.squares()[6], this.squares()[7], this.squares()[8])
    }

    return squares
  }

  boards() {
    let squareRow
    let boards = []
    for (let i = 0; i <= 2; i++) {
      squareRow = i
      boards.push(
        <div className="board-row" key={i}>
          {this.getSquare(squareRow)}
        </div>,
      )
    }

    return boards
  }

  render() {
    return <div>{this.boards()}</div>
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    })
    const squares = document.getElementsByClassName('square')
    for (let i = 0; i < squares.length; i++) {
      squares[i].classList.remove('winnerColor')
    }
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves = history.map((step, move) => {
      const desc = move ? `Go to move #` + move : 'Go to game start'
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status
    let color
    let squareFill
    if (winner) {
      if (winner === 'draw') {
        status = 'Draw'
      } else {
        status = 'Winner: ' + winner[0]
        color = 'winnerColor'
        squareFill = winner[1]
        changeColor(squareFill, color)
      }
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
      color = ''
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            color={color}
            squareFill={squareFill}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'))
