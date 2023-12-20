import { ui } from './ui.js';
import { game } from './game.js';

const controller = (() => {
  // Reference to game state object
  let state = game.getState();
  /**
   * UI Dependency Injection
   *
   * @param {gameBoard} - array of game board positions
   * @param {components} - object of ui components to toggle
   * @param {buttons} - object of buttons in ui
   */
  function init(gameBoard, components, buttons) {
    gameBoard.forEach((box) => {
      box.addEventListener('click', function () {
        ui.temporarilyDisableBoard(components.boardSection);
        if (_handlePlayerMove(gameBoard, box) === false) {
          return;
        }
        if (state.mode === 'pvc') {
          _handleAiMove(gameBoard);
        }
      });
    });

    buttons.start.addEventListener('click', function () {
      if (state.mode === '') {
        // console.log('no mode selected'); // debug
        return;
      }
      game.createPlayers();
      ui.toggleGameDisplay(components, buttons.start);

      console.log('game started');
    });

    buttons.reset.addEventListener('click', function () {
      game.resetState();

      ui.resetBoard(gameBoard);
      ui.toggleGameDisplay(components, buttons.reset);

      // console.clear(); // debug
      // console.log('game reset'); // debug
    });

    buttons.pvp.addEventListener('click', function () {
      state.mode = 'pvp';
    });

    buttons.pvc.addEventListener('click', function () {
      state.mode = 'pvc';
    });
  }

  // Player Move Handler
  function _handlePlayerMove(gameBoard, box) {
    if (state.terminalState) {
      return;
    }

    let curPlayer = game.getCurPlayer();
    let move = parseInt(box.id);
    let isLegalMove = typeof state.board[move] === 'number';

    if (isLegalMove) {
      game.playMove(state, move, curPlayer.sign);
      game.checkForWinner(state);
      game.switchTurns();

      ui.displayMove(gameBoard, state);
      ui.colorPositionsOnWin(gameBoard, state);
    } else {
      return isLegalMove;
    }
  }

  // AI Move Handler
  function _handleAiMove(gameBoard) {
    if (state.terminalState) {
      return;
    }

    let curPlayer = game.getCurPlayer();

    // minimax implementation
    let copiedState = JSON.parse(JSON.stringify(state));
    let move = game.getBestMove(copiedState);

    setTimeout(() => {
      game.playMove(state, move, curPlayer.sign);
      game.checkForWinner(state);
      game.switchTurns();

      ui.displayMove(gameBoard, state);
      ui.colorPositionsOnWin(gameBoard, state);
    }, 200);
  }

  return { init };
})();

export { controller };
