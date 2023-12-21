import { controller } from './control.js';

// UI DOM Query
const components = {
  startScreen: document.querySelector('.start-screen-container'),
  gameScreen: document.querySelector('.game-container'),
  boardSection: document.querySelector('.game-board'),
};
const buttons = {
  start: document.querySelector('#start'),
  reset: document.querySelector('#reset'),
  pvp: document.querySelector('#pvp'),
  pvc: document.querySelector('#pvc'),
  cvc: document.querySelector('#cvc'),
};
/**
 * Tic Tac Toe Game Board
 *
 *   0 | 1 | 2
 *  ---+---+---
 *   3 | 4 | 5
 *  ---+---+---
 *   6 | 7 | 8
 */
const gameBoard = components.gameScreen.querySelectorAll('.box');

// UI Dependency Injection
controller.init(gameBoard, components, buttons);
