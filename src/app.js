import React from 'react'
import ReactDOM from 'react-dom'
import './index.css';
import {createUuid, createAndSubscribe, receiveMessages} from './ongoing_games.js';

function Space(props) {
  return (
    <button className="space" >
    {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spaces: []
    };
  }

  componenteDidMount() {
    this.convertBoard()
  }

  componentDidUpdate() {
     this.convertBoard()
  }

  renderSpace(board, i) {
    return (
      <Space
      value={board[i]}
      />
    );
  }

  convertBoard() {
    var board = []
    for (var i = 0; i < this.props.board.length; i++){
      board[this.props.board[i]] = (i % 2 == 0) ? "X" : "O"
    }
    return board
  }

  render() {
    let board = this.convertBoard()
    return (
      <div>
      <div className="status">{status}</div>
      <div className="board-row">
      {this.renderSpace(board, 0)}
      {this.renderSpace(board, 1)}
      {this.renderSpace(board, 2)}
      </div>
      <div className="board-row">
      {this.renderSpace(board, 3)}
      {this.renderSpace(board, 4)}
      {this.renderSpace(board, 5)}
      </div>
      <div className="board-row">
      {this.renderSpace(board, 6)}
      {this.renderSpace(board, 7)}
      {this.renderSpace(board, 8)}
      </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="game">
      <div className="game-board">
      Game ID: {this.props.uuid}
      <Board id={this.props.uuid} size={this.props.size} board={this.props.board} />
      </div>
      </div>
    );
  }
}

class Spectator extends React.Component {

  constructor() {
    super()
    this.state = {
      spectatorId: createUuid(),
      isSubscribed: false,
      games: {}
    }
    this.getGames = this.getGames.bind(this)
    this.showGames = this.showGames.bind(this)
    this.subscribe(this.getGames)
    setInterval( () => this.getGames(), 500)
  }

  subscribe(callback) {
    if (!this.state.isSubscribed) {
      createAndSubscribe(this.state.spectatorId)
      this.state.isSubscribed = true
      if (this.state.isSubscribed) {
        callback()
      } else {
        console.log("Could not subscribe")
      }
    }
  }

  getGames() {
    let self = this
    receiveMessages(this.state.spectatorId, function(game) {
      self.setState({games: game})
    }
    )
  }

  showGames() {
    if (this.state.games.board) {
      return <div> <Game uuid={this.state.games.uuid} size={this.state.games.size} board={this.state.games.board} /> </div>
    } else {
      return <div> No current games </div>
    }
  }

  render() {
    return (
      <div className="spectator">
      You are spectator {this.state.spectatorId}
      {this.showGames()}
      </div>
    )
  }
}

const app = document.getElementById('app')
ReactDOM.render(<Spectator />, app)
