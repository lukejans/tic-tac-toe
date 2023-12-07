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
    // Game Board Move Handler
    gameBoard.forEach((box) => {
      box.addEventListener('click', function () {
        _handlePlayerClick(gameBoard, box);
      });
    });
    // Start Button Handler
    buttons.start.addEventListener('click', function () {
      if (game.getMode() == '') {
        console.log('select a game mode to continue');
        return;
      }
      game.buildPlayers();
      ui.toggleGameDisplay(components, buttons.start);
      console.log('game started');
      console.log({ player1: game.getPlayer(1), player2: game.getPlayer(2) });
    });
    // PvP Mode Selection
    buttons.pvp.addEventListener('click', function () {
      game.setMode('pvp');
    });
    // PvC Mode Selection
    buttons.pvc.addEventListener('click', function () {
      game.setMode('pvc');
    });
  }

  function _handlePlayerClick(gameBoard, box) {
    // implement this function
  }

  return { init };
})();

export { controller };
