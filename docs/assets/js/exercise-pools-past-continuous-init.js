/**
 * Registers B1 / B2 / C1 Past Continuous pools for teacher print and exercises.
 */
(function () {
  window.PAST_CONTINUOUS_POOLS = {
    b1: window.PAST_CONTINUOUS_POOL_B1,
    b2: window.PAST_CONTINUOUS_POOL_B2,
    c1: window.PAST_CONTINUOUS_POOL_C1
  };
  if (!window.PAST_CONTINUOUS_POOL && window.PAST_CONTINUOUS_POOL_B1) {
    window.PAST_CONTINUOUS_POOL = window.PAST_CONTINUOUS_POOL_B1;
  }
})();
