const ui = (() => {
  function toggleGameDisplay(components, btn) {
    _temporarilyDisableBtn(btn);
    components.startScreen.classList.toggle('hide');
    components.gameScreen.classList.toggle('hide');
  }

  function _temporarilyDisableBtn(btn) {
    btn.disabled = true;
    setTimeout(function () {
      btn.disabled = false;
    }, 1000);
  }

  function displayMove(state, box) {
    box.textContent = state.board[box.id];
  }

  function colorPositionsOnWin(gameBoard, state) {
    if (state.isTerminal) {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          gameBoard[state.winMoves[i]].classList.add('win');
        }, i * 500);
      }
    }
  }

  function resetUI(gameBoard) {
    for (let i = 0; i < 9; i++) {
      gameBoard[i].textContent = '';
      gameBoard[i].classList.remove('win');
    }
  }

  return { toggleGameDisplay, displayMove, colorPositionsOnWin, resetUI };
})();
export { ui };
