import { ui } from './ui.js';

import { game } from './game.js';

const controller = (() => {
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
        if (_handlePlayerMove(gameBoard, box) == false) {
          return;
        }
        if (game.getMode() == 'pvc') {
          setTimeout(() => {
            _handleAiMove(gameBoard);
          }, 400);
        }
      });
    });

    buttons.start.addEventListener('click', function () {
      if (game.getMode() == '') {
        console.log('select a game mode to continue');
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

      console.clear();
      console.log('game reset');
    });

    buttons.pvp.addEventListener('click', function () {
      game.setMode('pvp');
    });

    buttons.pvc.addEventListener('click', function () {
      game.setMode('pvc');
    });
  }

  // Player Move Handler
  function _handlePlayerMove(gameBoard, box) {
    let curState = game.getState();

    if (curState.terminalState) {
      return;
    }

    let curPlayer = game.getCurPlayer();
    let move = parseInt(box.id);
    let isLegalMove = typeof curState.board[move] === 'number';

    if (isLegalMove) {
      game.playMove(curState, move, curPlayer.sign);
      game.checkForWinner(curState);
      game.switchTurns();

      ui.displayMove(curState, box);
      ui.colorPositionsOnWin(gameBoard, curState);
    } else {
      return isLegalMove;
    }
  }

  // AI Move Handler
  function _handleAiMove(gameBoard) {
    let curState = game.getState();

    if (curState.terminalState) {
      return;
    }

    let curPlayer = game.getCurPlayer();
    let move = game.getAiMove(curState.board);

    game.playMove(curState, move, curPlayer.sign);
    game.checkForWinner(curState);
    game.switchTurns();

    ui.displayMove(curState, gameBoard[move]);
    ui.colorPositionsOnWin(gameBoard, curState);
  }
  // Handle minimax function

  return { init };
})();

export { controller };
