const ui = (() => {
  function toggleGameDisplay(components, btn) {
    _temporarilyDisableBtn(btn);
    components.startScreen.classList.toggle('hide');
    components.gameScreen.classList.toggle('hide');
  }

  /**
   * Prevent Double Click
   * @param {btn} - button to disable
   */
  function _temporarilyDisableBtn(btn) {
    btn.disabled = true;
    console.log(`${btn.id} btn temporarily disabled`);
    setTimeout(function () {
      btn.disabled = false;
      console.log(`${btn.id} btn re-enabled`);
    }, 1000);
  }

  return { toggleGameDisplay };
})();
export { ui };
