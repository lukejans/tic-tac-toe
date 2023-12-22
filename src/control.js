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
        // only clickable during active games or mode with human
        if (state.terminalState || state.mode === 'cvc') {
          return;
        }
        // avoid double clicks
        ui.temporarilyDisableBoard(components.boardSection);
        // play moves
        _handlePresentHuman(gameBoard, box);
      });
    });

    buttons.start.addEventListener('click', function () {
      // ensure mode is selected
      if (state.mode === '') {
        return;
      }

      game.createPlayers();
      ui.toggleGameDisplay(components, buttons.start);

      // play computer only game
      if (state.mode === 'cvc') {
        setTimeout(() => _handleAiOnlyGame(gameBoard), 250);
      }
    });
    buttons.reset.addEventListener('click', function () {
      game.resetState();

      ui.resetBoard(gameBoard);
      ui.toggleGameDisplay(components, buttons.reset);
    });

    /**
     * Mode selection Buttons
     */
    buttons.pvp.addEventListener('click', function () {
      state.mode = 'pvp';
    });
    buttons.pvc.addEventListener('click', function () {
      state.mode = 'pvc';
    });
    buttons.cvc.addEventListener('click', function () {
      state.mode = 'cvc';
    });
  }

  // Mode PvP & PvC Handler
  function _handlePresentHuman(gameBoard, box) {
    let move = parseInt(box.id);
    let isLegalMove = typeof state.board[move] === 'number';

    // only allow legal moves
    if (isLegalMove) {
      _playHumanMove(gameBoard, move);

      if (state.mode === 'pvc') {
        setTimeout(() => _playAiMove(gameBoard), 250);
      }
    } else return;
  }

  // Mode CvC Handler
  async function _handleAiOnlyGame(gameBoard) {
    while (state.terminalState === '') {
      _playAiMove(gameBoard);
      // Delay between each ai players move
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  // Execute Human Move
  function _playHumanMove(gameBoard, move) {
    let curPlayer = game.getCurPlayer();

    game.playMove(state, move, curPlayer.sign);
    game.checkForWinner(state);
    game.switchTurns();

    ui.updateUI(gameBoard, state);
  }

  // Execute AI Move
  function _playAiMove(gameBoard) {
    if (state.terminalState) {
      return;
    }

    let curPlayer = game.getCurPlayer();
    let minPlayer = game.getOtherPlayer();

    // minimax implementation
    let copiedState = JSON.parse(JSON.stringify(state));
    let move;
    // if (lvl) {
    //   move = game.getRandomMove();
    //   console.log(`bad: ${move}`);
    // } else {
    //   move = game.getBestMove(copiedState, curPlayer.sign, minPlayer.sign);
    //   console.log(`best: ${move}`);
    // }
    move = game.getBestMove(copiedState, curPlayer.sign, minPlayer.sign);

    game.playMove(state, move, curPlayer.sign);
    game.checkForWinner(state);
    game.switchTurns();

    ui.updateUI(gameBoard, state);
  }

  return { init };
})();

export { controller };
