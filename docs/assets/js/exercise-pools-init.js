/**
 * Registers B1 / B2 / C1 Present Simple pools for teacher print and exercises.
 */
(function () {
  window.PRESENT_SIMPLE_POOLS = {
    b1: window.PRESENT_SIMPLE_POOL_B1,
    b2: window.PRESENT_SIMPLE_POOL_B2,
    c1: window.PRESENT_SIMPLE_POOL_C1
  };
  if (!window.PRESENT_SIMPLE_POOL && window.PRESENT_SIMPLE_POOL_B1) {
    window.PRESENT_SIMPLE_POOL = window.PRESENT_SIMPLE_POOL_B1;
  }
})();
