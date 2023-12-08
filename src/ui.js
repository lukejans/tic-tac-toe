const ui = (() => {
  function toggleGameDisplay(components, btn) {
    _temporarilyDisableBtn(btn);
    components.startScreen.classList.toggle('hide');
    components.gameScreen.classList.toggle('hide');
  }

  /**
   * Prevent Double Click
   * @param {btn} - button to disable
   */
  function _temporarilyDisableBtn(btn) {
    btn.disabled = true;
    setTimeout(function () {
      btn.disabled = false;
    }, 1000);
  }

  function displayMove(state, box) {
    box.textContent = state.board[box.id];
  }

  /**
   * Activate CSS for Winning Positions
   */
  const colorPositionsOnWin = (gameBoard, state) => {
    if (state.isTerminal) {
      for (let i = 0; i < 3; i++) {
        gameBoard[state.winMoves[i]].classList.add('win');
      }
    }
  };

  return { toggleGameDisplay, displayMove, colorPositionsOnWin };
})();
export { ui };
