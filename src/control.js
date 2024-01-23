// import all modules to controller
import { ui } from './ui.js';
import { game } from './game.js';

const controller = (() => {
  // reference to game state object
  let state = game.getState();

  /**
   * Game Initialization
   *
   * {gameBoard} Array - game board positions (boxes)
   * {components} Object -  components to toggle
   * {buttons} Object - buttons in ui
   */
  function init(gameBoard, components, buttons) {
    // for playing moves on box clicks
    gameBoard.forEach((box) => {
      box.addEventListener('click', function () {
        // only clickable during active games including a human
        if (state.terminalState || state.mode === 'cvc') {
          return;
        }
        ui.temporarilyDisableBoard(components.boardSection); // avoid double clicks
        _humanPlayerGameFlow(gameBoard, box); // play move
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
      } else return; // mode is pvp
    }
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
