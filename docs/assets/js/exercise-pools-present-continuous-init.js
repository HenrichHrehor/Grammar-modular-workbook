/**
 * Registers B1 / B2 / C1 Present Continuous pools for teacher print and exercises.
 */
(function () {
  window.PRESENT_CONTINUOUS_POOLS = {
    b1: window.PRESENT_CONTINUOUS_POOL_B1,
    b2: window.PRESENT_CONTINUOUS_POOL_B2,
    c1: window.PRESENT_CONTINUOUS_POOL_C1
  };
  if (!window.PRESENT_CONTINUOUS_POOL && window.PRESENT_CONTINUOUS_POOL_B1) {
    window.PRESENT_CONTINUOUS_POOL = window.PRESENT_CONTINUOUS_POOL_B1;
  }
})();
