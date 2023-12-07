# 📕 notes

## 👨‍💻 old code

### control.js

```javascript
import { ui } from './ui.js';
import { game } from './game.js';

const controller = (() => {
  /**
   * UI Dependency Injection.
   *
   * ? change parameters to objects
   * ? init (boxes, uiButtons, uiPages)
   * ? uiButtons = { pvp: pvp, start: startBtn, ... }
   *
   *
   *
   * @param {*} boxes game board ui.
   * @param {*} startScreen home page ui.
   * @param {*} gameScreen game page ui.
   * @param {*} startBtn to display the game.
   * @param {*} resetBtn to reset game logic and go home.
   */
  const init = (boxes, startScreen, gameScreen, startBtn, resetBtn) => {
    boxes.forEach((box) => {
      box.addEventListener('click', function () {
        _controlPlayerMove(boxes, box);
      });
    });

    resetBtn.addEventListener('click', function () {
      game.resetState();
      ui.resetUI(boxes);
      ui.toggleGameDisplay(startScreen, gameScreen);
      console.log('game reset');
    });

    startBtn.addEventListener('click', function () {
      ui.toggleGameDisplay(startScreen, gameScreen);
      console.log('game started');
    });
  };

  /**
   *
   * Control Moves Made
   *
   * @param {*} boxes game board ui.
   * @param {*} box individual locations on game board ui.
   */
  const _controlPlayerMove = (boxes, box) => {
    if (game.moveIsLegal(box.id)) {
      game.executeTurn(box.id);
      ui.updateUI(boxes, box, game.getGameState());
    }
  };

  return { init };
})();

export { controller };
```

### game.js

```javascript
const game = (() => {
  let _board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let _winner = false;
  let _roundOver = false;
  let _allMoveIndices = [];
  let _winningIndices = [];
  //
  let _xMoveIndices = [];
  let _oMoveIndices = [];
  let _xTurn = true;

  /**
   *
   * Player Creation Factory Function
   *
   * this function will be exposed to the controller module.
   * ? on startButton click create players.
   *
   * @param {*} sign `x` or `o`
   * @param {*} isBot ai or human player
   * @returns new player object
   */
  const Player = (sign, isBot) => {
    let player = {
      sign: sign,
      score: 0,
      moveIndices: [],
    };

    if (isBot) {
      player.ai = true;
    }

    return player;
  };

  /**
   *
   * Get Game State Information
   *
   * this function is exposed to the controller module.
   * ? updateUi() requires the returned object as a parameter.
   *
   * @returns object containing information on game state
   */
  const getGameState = () => {
    let state = {
      board: _board,
      winningIndices: _winningIndices,
      winner: _winner,
    };
    return state;
  };

  /**
   *
   * Push Move To Board
   *
   * @modifies { _board, _allMoveIndices, _xMoveIndices, _oMoveIndices, _xTurn}
   * @param {*} moveIndex desired move by player
   */
  const _playMove = (moveIndex) => {
    if (_xTurn) {
      _board[moveIndex] = 'x';
      _xMoveIndices.push(moveIndex);
      _xTurn = false;
    } else if (!_xTurn) {
      _board[moveIndex] = 'o';
      _oMoveIndices.push(moveIndex);
      _xTurn = true;
    }
    _allMoveIndices.push(moveIndex);
  };

  /**
   *
   * ? RECREATE FUNCTION
   * ?    to isTerminal() and don't modify variables
   * ?    instead return one of these strings: x, o, tie, undefined
   *
   * Checks and Sets winner
   *
   * @reads from the player object
   * @modifies { _roundOver, _winner, _winningIndices }
   */
  const _checkForWinner = () => {
    let winConditions = [
      ['0', '1', '2'], // Top row
      ['3', '4', '5'], // Middle row
      ['6', '7', '8'], // Bottom row
      ['0', '3', '6'], // Left column
      ['1', '4', '7'], // Middle column
      ['2', '5', '8'], // Right column
      ['0', '4', '8'], // Diagonal from top-left to bottom-right
      ['2', '4', '6'], // Diagonal from top-right to bottom-left
    ];

    for (const condition of winConditions) {
      // returns true if a players indices include a win condition
      let xWins = condition.every((number) => _xMoveIndices.includes(number));
      let oWins = condition.every((number) => _oMoveIndices.includes(number));

      if (xWins) {
        console.log("x win's");
        _winningIndices = condition;
        _roundOver = true;
        _winner = true;
        break;
      } else if (oWins) {
        console.log("o win's");
        _winningIndices = condition;
        _roundOver = true;
        _winner = true;
        break;
      }
    }
    if (!_winner && _allMoveIndices.length == 9) {
      console.log('tie');
      _roundOver = true;
    }
  };

  function moveIsLegal(moveIndex) {
    return !_roundOver && typeof _board[moveIndex] === 'number';
  }

  function executeTurn(moveIndex) {
    _playMove(moveIndex);
    _checkForWinner();
  }

  function resetState() {
    _board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    _winner = false;
    _roundOver = false;
    _allMoveIndices = [];
    _winningIndices = [];
    _xMoveIndices = [];
    _oMoveIndices = [];
    _xTurn = true;
  }

  /**
   * ! MINIMAX CODE CURRENTLY UNDER DEVELOPMENT !
   *
   * minimax helpers
   *
   * * When Invoked from controller: state = _board
   */
  function _getPossibleMoves(state) {
    return state.filter((item) => !['x', 'o'].includes(item));
  }

  function _simulateMove(state, move) {}

  function _isTerminal(state) {
    let winConditions = [
      ['0', '1', '2'], // Top row
      ['3', '4', '5'], // Middle row
      ['6', '7', '8'], // Bottom row
      ['0', '3', '6'], // Left column
      ['1', '4', '7'], // Middle column
      ['2', '5', '8'], // Right column
      ['0', '4', '8'], // Diagonal from top-left to bottom-right
      ['2', '4', '6'], // Diagonal from top-right to bottom-left
    ];

    for (const condition of winConditions) {
      // returns true if a players indices include a win condition
      let xWins = condition.every((number) => _xMoveIndices.includes(number));
      let oWins = condition.every((number) => _oMoveIndices.includes(number));

      if (xWins || oWins) {
        return true;
      }
    }
    if (!_winner && _allMoveIndices.length == 9) {
      console.log('tie');
      _roundOver = true;
    }
  }

  function _evaluate(state) {}

  /**
   *
   * Minimax Algorithm
   *
   * @param {*} state tracks the game board
   * @param {*} depth tracks recursive calls
   * @param {*} maximizingPlayer boolean switches players on each call
   * @returns
   */
  function minimax(state, depth, maximizingPlayer = true) {
    if (depth == 0 || _isTerminal(state)) {
      return _evaluate(state);
    }

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (let move of _getPossibleMoves(state)) {
        let curEval = minimax(_simulateMove(state, move), depth - 1, false);
        maxEval = Math.max(maxEval, curEval);
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let move of _getPossibleMoves(state)) {
        let curEval = minimax(_simulateMove(state, move), depth - 1, true);
        minEval = Math.min(minEval, curEval);
      }
      return minEval;
    }
  }

  return {
    moveIsLegal,
    getGameState,
    executeTurn,
    resetState,
  };
})();

export { game };
```

### ui.js

```javascript
const ui = (() => {
  const updateUI = (boxes, box, gameState) => {
    _displayMove(box, gameState.board);
    _colorPositionsOnWin(boxes, gameState.winningIndices, gameState.winner);
  };

  /**
   *
   * Display Move
   *
   * @param {*} box position that was just played.
   * @param {*} gameBoard game board state.
   */
  const _displayMove = (box, gameBoard) => {
    box.textContent = gameBoard[box.id];
  };

  /**
   *
   * Activate CSS for Winning Positions
   *
   * @param {*} boxes game board ui.
   * @param {*} winningPositions moves made that led to a win.
   * @param {*} winner boolean allows function to run on true.
   */
  const _colorPositionsOnWin = (boxes, winningPositions, winner) => {
    if (winner) {
      for (let i = 0; i < 3; i++) {
        boxes[winningPositions[i]].classList.add('win');
      }
    }
  };

  const toggleGameDisplay = (startScreen, gameScreen) => {
    startScreen.classList.toggle('hide');
    gameScreen.classList.toggle('hide');
  };

  const resetUI = (boxes) => {
    for (let i = 0; i < 9; i++) {
      boxes[i].textContent = '';
      boxes[i].classList.remove('win');
    }
  };

  return {
    toggleGameDisplay,
    updateUI,
    resetUI,
  };
})();

export { ui };
```
