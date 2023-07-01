/**
 * Provides requestAnimationFrame in a cross browser
 * way.
 */
 if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function() {
      return window.requestAnimationFrame ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame ||
             window.oRequestAnimationFrame ||
             window.msRequestAnimationFrame ||
             function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
               window.setTimeout(callback, 1000/60);
             };
    })();
  }

  /** * ERRATA: 'cancelRequestAnimationFrame' renamed to 'cancelAnimationFrame' to reflect an update to the W3C Animation-Timing Spec.
   *
   * Cancels an animation frame request.
   * Checks for cross-browser support, falls back to clearTimeout.
   * @param {number}  Animation frame request. */
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (window.cancelRequestAnimationFrame ||
                                   window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||
                                   window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame ||
                                   window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame ||
                                   window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame ||
                                   window.clearTimeout);
  }