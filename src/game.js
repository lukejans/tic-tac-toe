const game = (() => {
  /**
   * Game State Data
   *
   * @var {_state} Object - private game variables / information to
   * track the game board, mode selected, winning move indices & the
   * current terminal state (x-win, o-win, tie, live-game).
   *
   * @function getState() - returns the `_state` object to create a
   * self-referencing variable to be used inside @module ./control.js
   *    - modifies state after each move is played.
   *    - reads the state to update the ui.
   *
   * @function resetState() - resets the state object to default values
   *
   * @var {_Player}
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
    return state;
  }

  function switchTurns() {
    _player1.turn = !_player1.turn;
    _player2.turn = !_player2.turn;
  }

  /**
   * AI Player Move
   * @returns
   */
  function getAiMove() {
    let availableMoves = getPossibleMoves(_state.board);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // let calls = 1; // debug

  function minimax(state, depth, maximizingPlayer) {
    // calls++; // debug

    // check for terminal state
    let result = checkForWinner(state);
    if (depth === 0 || result) {
      return evaluate(result, depth);
    }

    if (maximizingPlayer) {
      let maxScore = -Infinity;

      // call minimax on each possible branch of moves
      for (let move of getPossibleMoves(state.board)) {
        // simulate branch of moves
        state.board[move] = 'o';
        let curScore = minimax(state, depth - 1, false);
        state.board[move] = move;

        maxScore = Math.max(maxScore, curScore);
      }
      return maxScore;
    } else {
      let minScore = Infinity;

      // call minimax on each possible branch of moves
      for (let move of getPossibleMoves(state.board)) {
        // simulate branch of moves
        state.board[move] = 'x';
        let curScore = minimax(state, depth - 1, true);
        state.board[move] = move;

        minScore = Math.min(minScore, curScore);
      }
      return minScore;
    }
  }

  function getBestMove(state) {
    // AI to make its turn
    let bestScore = -Infinity;
    let bestMove;
    let maxDepth = getPossibleMoves(state.board).length;
    let possibleMoves = getPossibleMoves(state.board);

    // console.time('run_time'); // debug
    // calls = 1; // debug

    // call minimax on each possible branch of moves
    for (let move of possibleMoves) {
      state.board[move] = 'o';
      let score = minimax(state, maxDepth, false);
      state.board[move] = move;

      // update best move
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    // console.log(`minimax calls: ${calls}`); // debug
    // console.timeEnd('run_time'); // debug

    return bestMove;
  }

  function evaluate(result, depth) {
    if (result == 'x') {
      return scores.x - depth;
    } else if (result == 'o') {
      return scores.o + depth;
    } else {
      return scores.tie;
    }
  }
  const scores = {
    x: -10,
    o: 10,
    tie: 0,
  };

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

  // all public functions
  return {
    getBestMove,
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

/**
 * Used For Debugging
 * 
 * !1. print board move to console 
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
 * 
 * !2. print terminal state to console - checkForWinner()
    console.log(`player ${state.board[a]} win's`);
    console.log(`tie`);
 * 
 *
 * !3. start of search indication - getBestMove()
    console.log('----- start search -----'); 

    // code here
    console.log(`bestMove: ${bestMove}`);
    console.log(`bestScore: ${bestScore}`);
    console.log('----- end search -----');
 * 
 * 
 * 
 */
