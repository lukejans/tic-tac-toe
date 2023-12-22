import { ui } from './ui.js';
import { game } from './game.js';

const controller = (() => {
  // reference to game state object
  let state = game.getState();

  /**
   * Game Initialization
   *
   * @param {gameBoard} Array - game board positions (boxes)
   *
   *   0 | 1 | 2     a move is played on player click by
   *  ---+---+---    listening to what box was clicked and
   *   3 | 4 | 5     sending the box.id to _playMove() then
   *  ---+---+---    update the UI with _displayMove().
   *   6 | 7 | 8
   *
   * @param {components} Object -  components to toggle
   * @param {buttons} Object - buttons in ui
   */
  function init(gameBoard, components, buttons) {
    // tic tac toe boxes
    gameBoard.forEach((box) => {
      box.addEventListener('click', function () {
        // only clickable during active games or mode with human
        if (state.terminalState || state.mode === 'cvc') {
          return;
        }
        // avoid double clicks
        ui.temporarilyDisableBoard(components.boardSection);
        // play moves
        _humanPlayerGameFlow(gameBoard, box);
      });
    });

    // start & reset buttons
    buttons.start.addEventListener('click', function () {
      // ensure mode is selected
      if (state.mode === '') {
        return;
      }

      // player creation
      game.createPlayers();
      ui.toggleGameDisplay(components, buttons.start);

      // play computer only game
      if (state.mode === 'cvc') {
        setTimeout(() => _cpuOnlyGame(gameBoard), 250);
      }
    });

    buttons.reset.addEventListener('click', function () {
      game.resetState();

      ui.resetBoard(gameBoard);
      ui.toggleGameDisplay(components, buttons.reset);
    });

    // mode selection
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

  // mode pvp & pvc handler
  function _humanPlayerGameFlow(gameBoard, box) {
    let move = parseInt(box.id);
    let isLegalMove = typeof state.board[move] === 'number';

    // only allow legal moves
    if (isLegalMove) {
      _playHumanMove(gameBoard, move);

      // proceed with ai move if mode is pvc
      if (state.mode === 'pvc') {
        setTimeout(() => _playAiMove(gameBoard), 250);
      }
    } else return; // mode is pvp
  }

  // mode cvc handler
  async function _cpuOnlyGame(gameBoard) {
    while (state.terminalState === '') {
      _playAiMove(gameBoard);
      // ensure delay between each ai players move
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  // execute human move
  function _playHumanMove(gameBoard, move) {
    let curPlayer = game.getCurPlayer();

    game.playMove(state, move, curPlayer.sign);
    game.checkForWinner(state);
    game.switchTurns();

    ui.updateUI(gameBoard, state);
  }

  // execute ai move
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
