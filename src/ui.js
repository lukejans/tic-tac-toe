const ui = (() => {
  // toggle on start & reset button clicks
  function toggleGameDisplay(components, btn) {
    _temporarilyDisableBtn(btn);
    components.startScreen.classList.toggle('hide');
    components.gameScreen.classList.toggle('hide');
  }

  // prevent double clicks
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

  // indicate where the win occurred
  function _colorPositionsOnWin(gameBoard, state) {
    if (state.terminalState === 'x' || state.terminalState === 'o') {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          gameBoard[state.winningMoves[i]].classList.add('win');
        }, i * 250);
      }
    }
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
