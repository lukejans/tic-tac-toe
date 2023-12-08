# 📕 notes

### minimax

#### functions to build

- `simulateMove()`
- `isTerminal()`
- `getPossibleMoves()`
- `evaluate()`

```javascript
/**
 * Minimax Algorithm
 *
 * function _getPossibleMoves(state) {
 *   return state.filter((item) => !['x', 'o'].includes(item));
 * }
 *
 * @param {*} state tracks the game board
 * @param {*} depth tracks recursive calls
 * @param {*} maximizingPlayer boolean switches players
 *
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
