/**
 * Registers B1 / B2 / C1 Past Simple pools for teacher print and exercises.
 */
(function () {
  window.PAST_SIMPLE_POOLS = {
    b1: window.PAST_SIMPLE_POOL_B1,
    b2: window.PAST_SIMPLE_POOL_B2,
    c1: window.PAST_SIMPLE_POOL_C1
  };
  if (!window.PAST_SIMPLE_POOL && window.PAST_SIMPLE_POOL_B1) {
    window.PAST_SIMPLE_POOL = window.PAST_SIMPLE_POOL_B1;
  }
})();
