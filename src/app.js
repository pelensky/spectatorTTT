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
    this.getGames = this.getGames.bind(this)
  }

  componentDidMount() {
    this.subscribe(this.getGames(this.showGames()))
  }

  subscribe(callback) {
    if (!state.isSubscribed) {
      createAndSubscribe(state.spectatorId)
      state.isSubscribed = true
      if (state.isSubscribed) {
        resolve(console.log("Successfully subscribed"))
        callback
      } else {
        console.log("error")
      }
    }
  }

  getGames(callback) {
    receiveMessages(this.state.spectatorId, game)
    if (game) {
      this.setState({games: game})
      callback()
    } else {
      console.log("failure")
    }
  }


  showGames() {
    if (this.state.games) {
      return <div> <Game uuid={this.state.uuid} size={this.state.size} board={this.state.board} /> </div>
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
