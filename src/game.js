const game = (() => {
  /**
   * Game State
   *
   * gather game information and expose to controller
   * module. Use cases are for managing game flow and
   * updating UI.
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
   * Mode Selection
   *
   * get & set functions to change `_state.mode` based on
   * buttons clicked from ui.
   */
  function getMode() {
    return _state.mode;
  }

  function setMode(mode) {
    _state.mode = mode;
    console.log(mode);
    return _state.mode;
  }

  /**
   * Player Creation Factory
   *
   * factory function creates players and gives the ai player
   * a property of `ai`.
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
    }
  }

  function getCurPlayer() {
    return _player1.turn ? _player1 : _player2;
  }

  /**
   * Play Desired Move
   */
  function playMove(state, move, sign) {
    state.board[move] = sign;

    // debug
    let board = state.board.slice();
    let boardLog = {};
    for (let i = 0; i < 9; i++) {
      if (typeof board[i] == 'number') {
        boardLog[i] = ' ';
      } else if (typeof board[i] == 'string') {
        boardLog[i] = board[i];
      }
    }
    console.log(
      '\n',
      `  ${boardLog[0]} | ${boardLog[1]} | ${boardLog[2]} \n`,
      ` ---+---+--- \n`,
      `  ${boardLog[3]} | ${boardLog[4]} | ${boardLog[5]} \n`,
      ` ---+---+--- \n`,
      `  ${boardLog[6]} | ${boardLog[7]} | ${boardLog[8]} \n`,
      '\n'
    );

    return state;
  }

  function switchTurns() {
    _player1.turn = !_player1.turn;
    _player2.turn = !_player2.turn;
  }

  /**
   * Ai Player Move
   *
   * create a function that generates a random move for
   * the ai player.
   */
  function getAiMove() {
    let availableMoves = getPossibleMoves(_state.board);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  function getPossibleMoves(board) {
    return board.filter((item) => !['x', 'o'].includes(item));
  }

  let scores = {
    x: -10,
    o: 10,
    tie: 0,
  };

  function evaluate(result, depth) {
    if (result == 'x') {
      return scores.x - depth;
    } else if (result == 'o') {
      return scores.o + depth;
    } else {
      return scores.tie;
    }
  }

  let calls = 1; // debug

  function getBestMove(state) {
    console.time('run_time'); // debug
    console.log('----- start search -----'); // debug
    calls = 1; // debug

    // AI to make its turn
    let bestScore = -Infinity;
    let bestMove;

    // set max depth
    let maxDepth = getPossibleMoves(state.board).length;

    // is the spot available?
    let possibleMoves = getPossibleMoves(state.board);

    for (let move of possibleMoves) {
      let score = minimax(playMove(state, move, 'o'), maxDepth, false);
      state.board[move] = move; // undo move

      // track best moves
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    // debug
    console.log(`bestMove: ${bestMove}`);
    console.log(`bestScore: ${bestScore}`);
    console.log(`minimax calls: ${calls}`);
    console.timeEnd('run_time');
    console.log('----- end search -----');

    return bestMove;
  }

  function minimax(state, depth, maximizingPlayer) {
    calls++; // debug

    let result = checkForWinner(state);
    if (depth === 0 || result) {
      return evaluate(result, depth);
    }

    if (maximizingPlayer) {
      let maxScore = -Infinity;

      for (let move of getPossibleMoves(state.board)) {
        // recursively call minimax
        let curScore = minimax(playMove(state, move, 'o'), depth - 1, false);
        state.board[move] = move; // undo move

        maxScore = Math.max(maxScore, curScore);
      }
      return maxScore;
    } else {
      let minScore = Infinity;

      for (let move of getPossibleMoves(state.board)) {
        // recursively call minimax
        let curScore = minimax(playMove(state, move, 'x'), depth - 1, true);
        state.board[move] = move; // undo move

        minScore = Math.min(minScore, curScore);
      }
      return minScore;
    }
  }

  /**
   * Check For a Winner
   */
  function checkForWinner(state) {
    let winConditions = [
      [0, 1, 2], // Top row
      [3, 4, 5], // Middle row
      [6, 7, 8], // Bottom row
      [0, 3, 6], // Left column
      [1, 4, 7], // Middle column
      [2, 5, 8], // Right column
      [0, 4, 8], // Diagonal from top-left to bottom-right
      [2, 4, 6], // Diagonal from top-right to bottom-left
    ];

    // Check for a winner
    for (const condition of winConditions) {
      const [a, b, c] = condition;
      if (
        typeof state.board[a] !== 'number' &&
        state.board[a] === state.board[b] &&
        state.board[a] === state.board[c]
      ) {
        state.winningMoves = [a, b, c];
        state.terminalState = state.board[a];
        // console.log(`player ${state.board[a]} win's`);
        return state.terminalState;
      }
    }

    // Check for a tie
    if (state.board.every((cell) => typeof cell !== 'number')) {
      state.terminalState = 'tie';
      // console.log(`tie`);
      return state.terminalState; // No winner, and the board is full (tie)
    }

    return ''; // Game still ongoing
  }

  // All Public Functions
  return {
    getBestMove,
    getPossibleMoves,
    getMode,
    setMode,
    getState,
    resetState,
    createPlayers,
    getCurPlayer,
    playMove,
    checkForWinner,
    switchTurns,
    getAiMove,
  };
})();

export { game };
