const ui = (() => {
  function toggleGameDisplay(components, btn) {
    _temporarilyDisableBtn(btn);
    components.startScreen.classList.toggle('hide');
    components.gameScreen.classList.toggle('hide');
  }

  /**
   * Prevent Double Click
   *
   * @param {HTMLElement} btn - disable this
   */
  function _temporarilyDisableBtn(btn) {
    btn.disabled = true;
    setTimeout(function () {
      btn.disabled = false;
    }, 750);
  }

  function temporarilyDisableBoard(gameBoard) {
    gameBoard.classList.toggle('disable');
    setTimeout(function () {
      gameBoard.classList.toggle('disable');
    }, 400);
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
   * a 0.5s delay between color updates.
   * @param {Array} gameBoard - full board ui
   * @param {Object} state - get from game module
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

  function updateUI(gameBoard, state) {
    _displayMove(gameBoard, state);
    _colorPositionsOnWin(gameBoard, state);
  }

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
