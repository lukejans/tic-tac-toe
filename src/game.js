const game = (() => {
  /**
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

  //!remove
  function getPlayers() {
    const players = {
      player1: _player1,
      player2: _player2,
    };
    return players;
  }

  /**
   * Play Move
   *
   */
  let _allPlayerMoves = [];

  function playMove(player, move) {
    player.moves.push(_board[move]);
    _allPlayerMoves.push(_board[move]);
    _board[move] = player.sign;
    console.log(_board);
  }

  function switchPlayers() {
    _player1.turn = !_player1.turn;
    _player2.turn = !_player2.turn;
  }

  function getCurPlayer() {
    return _player1.turn ? _player1 : _player2;
  }

  /**
   * Check For a Winner
   *
   * looks for all terminal states (win, lose, tie)
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
      return 'tie';
    }
  };

  /**
   * Get State
   *
   * gather game information to send to ui module
   */
  function getState() {
    let state = {
      board: _board,
      winMoves: _winningMoves,
      isTerminal: _terminalState,
    };
    return state;
  }

  return {
    getState,
    playMove,
    switchPlayers,
    checkForWinner,
    getCurPlayer,
    buildPlayers,
    getPlayers, //!remove
    getMode,
    setMode,
  };
})();

export { game };
