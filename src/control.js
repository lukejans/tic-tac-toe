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
        game.playMove(game.getCurrentPlayer(), box.id);
        game.switchPlayers();
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

  return { init };
})();

export { controller };
