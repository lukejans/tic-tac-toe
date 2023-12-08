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
   * a property of `isBot`. buildPlayers() is a helper function
   * to create players based on user mode selection as well as a
   * function to get the players individually.
   *
   */
  let _player1, _player2;

  function Player(sign, isAi) {
    let player = {
      sign: sign,
      score: 0,
      moveIndices: [],
      turn: false,
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
  function playMove(player, move) {
    _board[move] = player.sign;
    console.log(_board);
  }

  function switchPlayers() {
    _player1.turn = !_player1.turn;
    _player2.turn = !_player2.turn;
  }

  function getCurrentPlayer() {
    return _player1.turn ? _player1 : _player2;
  }

  return {
    playMove,
    switchPlayers,
    getCurrentPlayer,
    buildPlayers,
    getPlayers,
    getMode,
    setMode,
  };
})();

export { game };
