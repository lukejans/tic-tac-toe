import { ui } from './ui.js';
import { game } from './game.js';

const controller = (() => {
  /**
   * UI Dependency Injection
   *
   * @param {gameBoard} array of each position on game board
   * @param {components} object for toggling between ui screens
   * @param {buttons} object for buttons in ui
   */
  function init(gameBoard, components, buttons) {
    gameBoard.forEach((box) => {
      box.addEventListener('click', function () {
        _handlePlayerClick(gameBoard, box);
      });
    });
  }

  function _handlePlayerClick(gameBoard, box) {
    // implement this function
  }

  return { init };
})();

export { controller };
