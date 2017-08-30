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
    console.log(this.props)
  }

  componentDidMount() {
    this.convertBoard()
  }

  renderSpace(i) {
    return (
      <Space
      value={this.state.spaces[i]}
      />
    );
  }

  convertBoard() {
    var board = []
    for (var i = 0; i < this.props.board.length; i++){
      board[this.props.board[i]] = (i % 2 == 0) ? "X" : "O"
    }
    console.log(board)
    this.setState({spaces: board})
  }

  render() {
    return (
      <div>
      <div className="status">{status}</div>
      <div className="board-row">
      {this.renderSpace(0)}
      {this.renderSpace(1)}
      {this.renderSpace(2)}
      </div>
      <div className="board-row">
      {this.renderSpace(3)}
      {this.renderSpace(4)}
      {this.renderSpace(5)}
      </div>
      <div className="board-row">
      {this.renderSpace(6)}
      {this.renderSpace(7)}
      {this.renderSpace(8)}
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
      spectatorId: "DAN", //TODO CHANGE ME
      isSubscribed: false,
      games: []
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.getGames = this.getGames.bind(this)
    this.setGameState = this.setGameState.bind(this)
    this.showGames = this.showGames.bind(this)
  }

  componentDidMount() {
    this.subscribe(this.getGames)
  }

  subscribe(callback) {
    if (!this.state.isSubscribed) {
      createAndSubscribe(this.state.spectatorId)
      this.state.isSubscribed = true
      if (this.state.isSubscribed) {
        console.log("Successfully subscribed")
        callback()
      } else {
        console.log("error")
      }
    }
  }

  getGames() {
    let game = []
    receiveMessages(this.state.spectatorId, game, this.setGameState.bind(null, game, this.showGames))
  }

  setGameState(game, callback) {
    var gameState = game[0]
    if (gameState) {
      this.setState({games: gameState})
      callback()
    } else {
      console.log("No games to display")
    }
  }


  showGames() {
    if (this.state.games.board) {
      return <div> <Game uuid={this.state.games.uuid} size={this.state.games.size} board={this.state.games.board} /> </div>
    } else {
      return <span> No current games </span>
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
