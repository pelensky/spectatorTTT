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
  constructor() {
    super();
    this.state = {
      spaces: Array(9).fill(null),
      id: null
    };
  }

  renderSpace(i) {
    return (
      <Space
      value={this.state.spaces[i]}
      />
    );
  }

  convertBoard() {
    this.state.id = this.props[0].uuid
    for (var i = 0; i < this.props[0].board.length; i++){
      this.state.spaces[this.props[0].board[i]] = (i % 2 == 0) ? "X" : "O"
    }

  }

  render() {
    console.log(this.props)
    console.log(this.state)
    this.convertBoard()
    let status = this.state.id
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
  constructor() {
    super()
    console.log("in Game constructor")
    console.log(this.props)
  }

  render() {
    return (
      <div className="game">
      <div className="game-board">
      <Board id={this.props.id} size={this.props.size} board={this.props.board} />
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
  }

  componentDidMount() {
    this.subscribe().then(this.getGames()).then(this.showGames())
  }

  subscribe() {
    var state = this.state
    return new Promise(function(resolve,reject) {
      if (!state.isSubscribed) {
        createAndSubscribe(state.spectatorId)
        state.isSubscribed = true
        if (state.isSubscribed) {
          resolve(console.log("Successfully subscribed"))
        } else {
          reject(console.log("error"))
        }
      }
    })}

  getGames() {
    var id = this.state.spectatorId
    var games = this.state.games
    return new Promise(function (resolve, reject) {
      receiveMessages(id, games)
      setTimeout(function(result) {
        if (games.length > 0) {
          resolve(console.log("success"))
        } else {
          reject(console.log("failure"))
        }}, 500)
    })
  }


  showGames() {
    var board = this.state.games[2]
    var size = this.state.games[1]
    var id = this.state.games[0]
    if (board) {
      this.setState(this.state.game = [])
      return <div> <Game uuid={id} size={size} board={board} /> </div>
    } else {
      return <span> No current games </span>
    }
  }

  render() {
    return (
      <div>
      <div className="spectator">
      You are spectator {this.state.spectatorId}
      </div>
      <div className="games">
      {this.showGames}
      </div>
      </div>
    )
  }

}

const app = document.getElementById('app')
ReactDOM.render(<Spectator />, app)
