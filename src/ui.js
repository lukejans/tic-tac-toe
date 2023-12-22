const ui = (() => {
  // toggle on start & reset button clicks
  function toggleGameDisplay(components, btn) {
    _temporarilyDisableBtn(btn);
    components.startScreen.classList.toggle('hide');
    components.gameScreen.classList.toggle('hide');
  }

  /**
   * Prevent Double Clicks
   * @function _temporarilyDisableBtn()
   *    @param {btn} button - disable this btn
   * @function temporarilyDisableBoard()
   *    @param {gameBoard} section - disable full board
   */
  function _temporarilyDisableBtn(btn) {
    btn.disabled = true;
    setTimeout(function () {
      btn.disabled = false;
    }, 750);
  }

  // disable board between player moves
  function temporarilyDisableBoard(gameBoard) {
    gameBoard.classList.toggle('disable');
    setTimeout(function () {
      gameBoard.classList.toggle('disable');
    }, 400);
  }

  // run after every player move
  function updateUI(gameBoard, state) {
    _displayMove(gameBoard, state);
    _colorPositionsOnWin(gameBoard, state);
  }

  function _displayMove(gameBoard, state) {
    for (let i = 0; i < 9; i++) {
      if (typeof state.board[i] === 'string') {
        gameBoard[i].textContent = state.board[i];
      }
    }
  }

  /**
   * Color Winning Positions
   *
   * when a terminal state is found this function will be
   * executed once and will color the winning positions with
   * a delay between color updates.
   *
   * @param {gameBoard} Array - game board positions (boxes)
   * @param {state} Object - current game state
   */
  function _colorPositionsOnWin(gameBoard, state) {
    if (state.terminalState === 'x' || state.terminalState === 'o') {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          gameBoard[state.winningMoves[i]].classList.add('win');
        }, i * 250);
      }
    }
  }

  // loops through game board ui to reset values
  function resetBoard(gameBoard) {
    setTimeout(() => {
      for (let i = 0; i < 9; i++) {
        gameBoard[i].textContent = '';
        gameBoard[i].classList.remove('win');
      }
    }, 750);
  }

  return {
    updateUI,
    toggleGameDisplay,
    temporarilyDisableBoard,
    resetBoard,
  };
})();

export { ui };
