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
        _handlePlayerMove(gameBoard, box);

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
    if (game.getState().terminalState) {
      return;
    }

    let curPlayer = game.getCurPlayer();
    let move = parseInt(box.id);
    let isLegalMove = typeof game.getState().board[move] === 'number';

    if (isLegalMove) {
      game.playMove(curPlayer, move, game.getState().board);
      game.trackPlayerMove(curPlayer, move);
      game.checkForWinner(curPlayer, game.getState());
      game.switchPlayers();

      ui.displayMove(game.getState(), box);
      ui.colorPositionsOnWin(gameBoard, game.getState());
    }
  }

  // AI Move Handler
  function _handleAiMove(gameBoard) {
    if (game.getState().terminalState) {
      return;
    }

    let curPlayer = game.getCurPlayer();
    let move = game.getAiMove(game.getState().board);

    game.playMove(curPlayer, move, game.getState().board);
    game.trackPlayerMove(curPlayer, move);
    game.checkForWinner(curPlayer, game.getState());
    game.switchPlayers();

    ui.displayMove(game.getState(), gameBoard[move]);
    ui.colorPositionsOnWin(gameBoard, game.getState());
  }

  return { init };
})();

export { controller };
