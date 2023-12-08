# 📕 notes

## 👨‍💻 old code

### control.js

```javascript
const init = (resetBtn) => {
  resetBtn.addEventListener('click', function () {
    game.resetState();
    ui.resetUI(boxes);
    ui.toggleGameDisplay(startScreen, gameScreen);
    console.log('game reset');
  });
};
```

### game.js

```javascript
/**
 * Minimax Helpers
 *
 * * When Invoked from controller: state = _board
 */
function _getPossibleMoves(state) {
  return state.filter((item) => !['x', 'o'].includes(item));
}

function _simulateMove(state, move) {}

function _isTerminal(state) {}

function _evaluate(state) {}

/**
 * Minimax Algorithm
 *
 * @param {*} state tracks the game board
 * @param {*} depth tracks recursive calls
 * @param {*} maximizingPlayer boolean switches players
 * @returns best move
 */
function minimax(state, depth, maximizingPlayer = true) {
  if (depth == 0 || _isTerminal(state)) {
    return _evaluate(state);
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (let move of _getPossibleMoves(state)) {
      let curEval = minimax(_simulateMove(state, move), depth - 1, false);
      maxEval = Math.max(maxEval, curEval);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let move of _getPossibleMoves(state)) {
      let curEval = minimax(_simulateMove(state, move), depth - 1, true);
      minEval = Math.min(minEval, curEval);
    }
    return minEval;
  }
}
```

### ui.js

```javascript
const ui = (() => {
  const resetUI = (boxes) => {
    for (let i = 0; i < 9; i++) {
      boxes[i].textContent = '';
      boxes[i].classList.remove('win');
    }
  };
})();

export { ui };
```
