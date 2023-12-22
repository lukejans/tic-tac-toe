const game = (() => {
  /**
   * Game State Data
   *
   * @var {_state} Object -
   * tracks the game board, mode selected, winning move indices & the
   * current terminal state (x-win, o-win, tie, live-game).
   *
   * @function getState() - for creating state-referencing variable.
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
   * @param {*} sign
   * @param {*} isAi
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

  let _player1, _player2;

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

  function getCurPlayer() {
    return _player1.turn ? _player1 : _player2;
  }

  function getOtherPlayer() {
    return _player1.turn ? _player2 : _player1;
  }

  /**
   * Play Desired Move
   */
  function playMove(state, move, sign) {
    state.board[move] = sign;
    return state;
  }

  function switchTurns() {
    _player1.turn = !_player1.turn;
    _player2.turn = !_player2.turn;
  }

  /**
   * AI Move Functions
   *
   * different levels of ai difficulty
   *    @function getRandomMove() - easy bot
   *      this bot will always play the middle position if it's
   *      available, otherwise it's completely random.
   *    @function getAvgMove() - medium bot
   *      uses the minimax algorithm with a depth of 3 to limit
   *      its search strength thus yielding an average move.
   *    @function getBestMove() - impossible bot
   *      this bot uses the minimax algorithm in its full form with
   *      the depth set to the number of possible moves available.
   */
  //easy bot
  function getRandomMove() {
    let availableMoves = getPossibleMoves(_state.board);
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
    let possibleMoves = getPossibleMoves(state.board);

    // call minimax on each possible branch of moves
    for (let move of possibleMoves) {
      state.board[move] = maxSign; // play move
      let score = minimax(state, 3, false, maxSign, minSign);
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
    let possibleMoves = getPossibleMoves(state.board);
    let maxDepth = possibleMoves.length;

    // call minimax on each possible branch of moves
    for (let move of possibleMoves) {
      state.board[move] = maxSign;
      let score = minimax(state, maxDepth, false, maxSign, minSign);
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
   * @param {*} state
   * @param {*} depth
   * @param {*} maximizingPlayer
   * @param {*} maxSign
   * @param {*} minSign
   * @returns
   */
  function minimax(state, depth, maximizingPlayer, maxSign, minSign) {
    // check for terminal state
    let result = checkForWinner(state);
    if (depth === 0 || result) {
      return evaluate(result, depth, maxSign, minSign);
    }

    if (maximizingPlayer) {
      let maxScore = -Infinity;

      // call minimax on each possible branch of moves
      for (let move of getPossibleMoves(state.board)) {
        // simulate branch of moves
        state.board[move] = maxSign; // maximize `sign`
        let curScore = minimax(state, depth - 1, false, maxSign, minSign);
        state.board[move] = move;

        maxScore = Math.max(maxScore, curScore);
      }
      return maxScore;
    } else {
      let minScore = Infinity;

      // call minimax on each possible branch of moves
      for (let move of getPossibleMoves(state.board)) {
        // simulate branch of moves
        state.board[move] = minSign; // minimum `sign`
        let curScore = minimax(state, depth - 1, true, maxSign, minSign);
        state.board[move] = move;

        minScore = Math.min(minScore, curScore);
      }
      return minScore;
    }
  }

  // evaluate minimax branch
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

  function getPossibleMoves(board) {
    return board.filter((item) => !['x', 'o'].includes(item));
  }

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
    getRandomMove,
    getAvgMove,
    getBestMove,
  };
})();

export { game };
