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

  return { getMode, setMode };
})();

export { game };
