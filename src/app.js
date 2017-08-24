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
    const boardState = {
      "id": "123233425234",
      "board" : [0,4,6, 7, 1, 2]
    }
    this.state.id = boardState.id
    for (var i = 0; i < boardState.board.length; i++){
      this.state.spaces[boardState.board[i]] = (i % 2 == 0) ? "X" : "O"
    }

  }

  render() {
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

  render() {
//    const id = createUuid()
    // createAndSubscribe(id)
    return (
      <div className="game">
      <div className="game-board">
      <Board />
      </div>
      </div>
    );
  }
}

const app = document.getElementById('app')
ReactDOM.render(<Game />, app)

