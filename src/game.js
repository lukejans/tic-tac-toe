const game = (() => {
  /**
   * Game State Data
   *
   * @var {_state} - Object
   *    tracks the game board, mode selected, winning move indices &
   *    the current terminal state (x-win, o-win, tie, live-game).
   *
   * @function getState() - get
   *    for creating state-referencing variable in controller module.
   * @function resetState() - reset
   *    for resetting state to initial values in controller module
   *    when the user clicks the reset button.
   */
  const _state = {
    board: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    mode: '',
    winningMoves: [],
    terminalState: '',
  };

  function getState() {
    return _state;
  }

  function resetState() {
    _state.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    _state.mode = '';
    _state.winningMoves = [];
    _state.terminalState = '';
  }

  /**
   * Player Creation Factory Function
   *
   * TODO: change how players are created
   *    - ai property is never used
   *    - createPlayers not needed?
   *    - build players in controller?
   *
   * @param {sign} String - set sign of player
   * @param {isAi} Boolean -
   * @returns
   */
  function _Player(sign, isAi) {
    let player = {
      sign: sign,
      score: 0,
      moves: [],
      turn: false,
      winner: false,
    };
    if (isAi) {
      player.ai = true;
    }
    if (sign == 'x') {
      player.turn = true;
    }

    return player;
  }

  // Initialize Players
  let _player1, _player2;

  // Set Player Values
  function createPlayers() {
    if (_state.mode == 'pvp') {
      _player1 = _Player('x', false);
      _player2 = _Player('o', false);
    } else if (_state.mode == 'pvc') {
      _player1 = _Player('x', false);
      _player2 = _Player('o', true);
    } else if (_state.mode == 'cvc') {
      _player1 = _Player('x', true);
      _player2 = _Player('o', true);
    }
  }

  // Get Players
  function getCurPlayer() {
    return _player1.turn ? _player1 : _player2;
  }

  function getOtherPlayer() {
    return _player1.turn ? _player2 : _player1;
  }
  // Switch On Move End
  function switchTurns() {
    _player1.turn = !_player1.turn;
    _player2.turn = !_player2.turn;
  }

  /**
   * Play Desired Move
   *
   * TODO: track game variables
   */
  function playMove(state, move, sign) {
    state.board[move] = sign;
    return state;
  }

  // AI Move Functions
  //easy bot
  function getRandomMove() {
    let availableMoves = _getPossibleMoves(_state.board);
    if (availableMoves.includes(4)) {
      return 4;
    } else {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
  }

  // medium bot
  function getAvgMove(state, maxSign, minSign) {
    let avgScore = -Infinity;
    let avgMove;
    let possibleMoves = _getPossibleMoves(state.board);

    // call minimax on each possible branch of moves
    for (let move of possibleMoves) {
      state.board[move] = maxSign; // play move
      let score = _minimax(state, 3, false, maxSign, minSign);
      state.board[move] = move; // undo move

      // update average move
      if (score > avgScore) {
        avgScore = score;
        avgMove = move;
      }
    }
    return avgMove;
  }

  // impossible bot
  function getBestMove(state, maxSign, minSign) {
    // AI to make its turn
    let bestMove;
    let bestScore = -Infinity;
    let possibleMoves = _getPossibleMoves(state.board);
    let maxDepth = possibleMoves.length;

    // call minimax on each possible branch of moves
    for (let move of possibleMoves) {
      state.board[move] = maxSign;
      let score = _minimax(state, maxDepth, false, maxSign, minSign);
      state.board[move] = move;

      // update best move
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return bestMove;
  }

  /**
   * Minimax Algorithm
   *
   * this implementation of the minimax has dynamic variables to account
   * for game mode selection (pvc or cvc) via switching player signs based
   * on which ai bot call the minimax function.
   *
   * @param {state} Object - current game state
   * @param {depth} Number - depth of recursive search
   * @param {maximizingPlayer} Boolean - switch turns on recursive calls
   * @param {maxSign} String - change player signs
   * @param {minSign} String - change player signs
   * @returns Number - best found branch score.
   */
  function _minimax(state, depth, maximizingPlayer, maxSign, minSign) {
    // check for terminal state
    let result = checkForWinner(state);
    if (depth === 0 || result) {
      return evaluate(result, depth, maxSign, minSign);
    }

    if (maximizingPlayer) {
      let maxScore = -Infinity;

      // call minimax on each possible branch of moves
      for (let move of _getPossibleMoves(state.board)) {
        // simulate branch of moves
        state.board[move] = maxSign;
        let curScore = _minimax(state, depth - 1, false, maxSign, minSign);
        state.board[move] = move;

        maxScore = Math.max(maxScore, curScore);
      }
      return maxScore;
    } else {
      let minScore = Infinity;

      // call minimax on each possible branch of moves
      for (let move of _getPossibleMoves(state.board)) {
        // simulate branch of moves
        state.board[move] = minSign;
        let curScore = _minimax(state, depth - 1, true, maxSign, minSign);
        state.board[move] = move;

        minScore = Math.min(minScore, curScore);
      }
      return minScore;
    }
  }

  // Evaluate Minimax Branch Score
  const scores = {
    max: 10,
    min: -10,
    tie: 0,
  };

  function evaluate(result, depth, maxSign, minSign) {
    if (result == maxSign) {
      return scores.max + depth;
    } else if (result == minSign) {
      return scores.min - depth;
    } else {
      return scores.tie;
    }
  }

  // AI Move Decision Helper
  function _getPossibleMoves(board) {
    return board.filter((item) => !['x', 'o'].includes(item));
  }

  /**
   * Check For Terminal State
   *
   * TODO: BUG -> values winningIndices & terminalState
   *    - accidentally modified by minimax
   * TODO: change '' -> 'live' for better readability
   *
   * used to check game states after every move during an active game
   * and also checking for terminal states in minimax move simulations.
   *
   * @param {state} Object - current game state
   * @returns String - terminal state of the game ('x', 'o', 'tie', '')
   */
  function checkForWinner(state) {
    let winConditions = [
      [0, 1, 2], // Top row
      [3, 4, 5], // Middle row
      [6, 7, 8], // Bottom row
      [0, 3, 6], // Left column
      [1, 4, 7], // Middle column
      [2, 5, 8], // Right column
      [0, 4, 8], // Diagonal top-left -> bottom-right
      [2, 4, 6], // Diagonal top-right -> bottom-left
    ];

    // check for a winner
    for (const condition of winConditions) {
      const [a, b, c] = condition;
      if (
        typeof state.board[a] !== 'number' &&
        state.board[a] === state.board[b] &&
        state.board[a] === state.board[c]
      ) {
        state.winningMoves = [a, b, c];
        state.terminalState = state.board[a];
        return state.terminalState;
      }
    }
    // check for a tie
    if (state.board.every((cell) => typeof cell !== 'number')) {
      state.terminalState = 'tie';
      return state.terminalState;
    }

    return ''; // game still ongoing
  }

  return {
    getState,
    resetState,
    createPlayers,
    getCurPlayer,
    getOtherPlayer,
    playMove,
    checkForWinner,
    switchTurns,
    getRandomMove, // easy
    getAvgMove, // medium
    getBestMove, // impossible
  };
})();

export { game };
