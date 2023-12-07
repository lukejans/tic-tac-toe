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
   *
   */
  let _player1, _player2;
  function Player(sign, isAi) {
    let player = {
      sign: sign,
      score: 0,
      moveIndices: [],
    };

    if (isAi) {
      player.ai = true;
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

  function getPlayer(player) {
    if (player == 1) {
      return _player1;
    } else if (player == 2) {
      return _player2;
    }
  }

  return { buildPlayers, getPlayer, getMode, setMode };
})();

export { game };
