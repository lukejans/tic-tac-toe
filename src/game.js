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
  function playMove(board, move, sign) {
    board[move] = sign;
    console.log(board);
  }

  function switchTurns() {
    _player1.turn = !_player1.turn;
    _player2.turn = !_player2.turn;
  }

  function executeTurn(state, move, sign) {
    playMove(state.board, move, sign);
    return state;
  }

  /**
   * Ai Player Move
   *
   * create a function that generates a random move for
   * the ai player.
   */
  function getAiMove() {
    let availableMoves = _getPossibleMoves(_state.board);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  function simulateGame() {}
  function copyPlayers() {}

  function _evaluateState() {}

  function _getPossibleMoves(board) {
    return board.filter((item) => !['x', 'o'].includes(item));
  }

  function minimax(state, depth, maxPlayer) {
    if (depth === 0 || checkForWinner(player, state)) {
      return _evaluateState(state);
    }

    if (maxPlayer) {
      let maxEval = -Infinity;
      for (let move of _getPossibleMoves(state.board)) {
        let curEval = minimax(makeMove(state, move), depth - 1, false);
        maxEval = Math.max(maxEval, curEval);
      }
      return maxEval;
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
        console.log(`player ${state.board[a]} win's`);
        return state.terminalState;
      }
    }

    // Check for a tie
    if (state.board.every((cell) => typeof cell !== 'number')) {
      state.terminalState = 'tie';
      console.log(`tie`);
      return state.terminalState; // No winner, and the board is full (tie)
    }

    return state.terminalState; // Game still ongoing
  }

  // All Public Functions
  return {
    getMode,
    setMode,
    getState,
    resetState,
    createPlayers,
    getCurPlayer,
    executeTurn,
    checkForWinner,
    switchTurns,
    getAiMove,
  };
})();

export { game };
