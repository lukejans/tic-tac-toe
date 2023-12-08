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
        _handleGameFlow(gameBoard, box);
      });
    });

    buttons.start.addEventListener('click', function () {
      if (game.getMode() == '') {
        console.log('select a game mode to continue');
        return;
      }
      game.buildPlayers();
      ui.toggleGameDisplay(components, buttons.start);

      console.log('game started');
      console.log(game.getPlayers());
    });

    buttons.pvp.addEventListener('click', function () {
      game.setMode('pvp');
    });

    buttons.pvc.addEventListener('click', function () {
      game.setMode('pvc');
    });
  }

  /**
   *  Game Flow Controller
   */
  function _handleGameFlow(gameBoard, box) {
    if (game.getState().isTerminal) {
      return;
    }
    let curPlayer = game.getCurPlayer();
    let isLegalMove = typeof game.getState().board[box.id] === 'number';
    if (isLegalMove) {
      game.playMove(curPlayer, box.id);
      game.checkForWinner(curPlayer);
      game.switchPlayers();
      ui.displayMove(game.getState(), box);
      ui.colorPositionsOnWin(gameBoard, game.getState());
    }
  }

  return { init };
})();

export { controller };
