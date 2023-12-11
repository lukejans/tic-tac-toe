const game = (() => {
  /**
   *
   * Game Board
   */
  let _board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  /**
   * Mode Selection
   *
   * get & set functions to change `_mode` based on
   * buttons clicked from ui.
   */
  let _mode = '';

  function getMode() {
    return _mode;
  }

  function setMode(mode) {
    _mode = mode;
    console.log(mode);
    return _mode;
  }

  /**
   * Player Creation Factory
   *
   * factory function creates players and gives the ai player
   * a property of `ai`.
   * @param {String} sign - `x` or `o`
   * @param {Boolean} isAi - true if pvc is selected
   * @returns {Object} new player instance
   */
  let _player1, _player2;

  function Player(sign, isAi) {
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

  function buildPlayers() {
    if (_mode == 'pvp') {
      _player1 = Player('x', false);
      _player2 = Player('o', false);
    } else if (_mode == 'pvc') {
      _player1 = Player('x', false);
      _player2 = Player('o', true);
    }
  }

  /**
   * Play Desired Move
   *
   * modifies `_allPlayerMoves` and player objects to
   * update moves made.`switchPlayers()` is called
   * after to ensure proper game flow is maintained.
   * @param {Object} player - from `getCurPlayer()`
   * @param {Number} move - index of player move.
   */
  let _allPlayerMoves = [];

  function playMove(player, move, board) {
    board[move] = player.sign;
    console.log(board);
  }

  function switchPlayers() {
    _player1.turn = !_player1.turn;
    _player2.turn = !_player2.turn;
  }

  function getCurPlayer() {
    return _player1.turn ? _player1 : _player2;
  }

  function logPlayerMove(player, move) {
    _allPlayerMoves.push(_board[move]);
    player.moves.push(board[move]);
  }

  /**
   * Ai Player Move
   *
   * create a function that generates a random move for
   * the ai player.
   */
  function getAiMove() {
    let availableMoves = _getPossibleMoves();
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  function _getPossibleMoves() {
    return _board.filter((item) => !['x', 'o'].includes(item));
  }

  /**
   * Check For a Winner
   *
   * checks to see if a player has won or tied.
   * if so, returns the type of terminal state
   * @param {Object} player - from `getCurPlayer()`
   * @return {_terminalState} - `x`, `o`, `tie`
   */
  let _winningMoves = [];
  let _terminalState = '';

  const checkForWinner = (player) => {
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

    for (const condition of winConditions) {
      player.winner = condition.every((number) =>
        player.moves.includes(number)
      );

      if (player.winner) {
        _winningMoves = condition;
        _terminalState = player.sign;
        console.log(`player ${player.sign} wins`);
        return _terminalState;
      }
    }
    if (!player.winner && _allPlayerMoves.length == 9) {
      _terminalState = 'tie';
      console.log('tie');
      return _terminalState;
    }
  };

  /**
   * Track Game State
   *
   * gather game information and expose to controller
   * module. Use cases are for managing game flow and
   * updating UI.
   */
  function getState() {
    let state = {
      board: _board,
      winMoves: _winningMoves,
      isTerminal: _terminalState,
    };
    return state;
  }
  function resetState() {
    _board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    _mode = '';
    _allPlayerMoves = [];
    _winningMoves = [];
    _terminalState = '';
  }

  // All Public Functions
  return {
    getMode,
    setMode,
    getState,
    resetState,
    buildPlayers,
    getCurPlayer,
    playMove,
    logPlayerMove,
    checkForWinner,
    switchPlayers,
    getAiMove,
  };
})();

export { game };
