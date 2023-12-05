import { controller } from './control.js';

// UI DOM Query
const components = {
  startScreen: document.querySelector('.start-screen-container'),
  gameScreen: document.querySelector('.game-container'),
};
const buttons = {
  start: document.querySelector('#start'),
  reset: document.querySelector('#reset'),
  pvp: document.querySelector('#pvp'),
  pvc: document.querySelector('#pvc'),
};
/**
 * Tic Tac Toe Board
 *
 *    |   |
 *  --+---+--
 *    |   |
 *  --+---+--
 *    |   |
 */
const gameBoard = components.gameScreen.querySelectorAll('.box');

/**
 * UI Dependency Injection
 *
 * @param {gameBoard} array of each position on game board
 * @param {components} object for toggling between ui screens
 * @param {buttons} object for buttons in ui
 */
controller.init(gameBoard, components, buttons);
