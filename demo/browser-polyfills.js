"use strict";

// Polyfills for browsers that do not support String.trimLeft/Right
function trimLeftPolyfill() {
  return this.replace(/^\s*/, "");
}
/* istanbul ignore if */
if (!String.prototype.trimLeft) {
  String.prototype.trimLeft = trimLeftPolyfill;
}
function trimRightPolyfill() {
  return this.replace(/\s*$/, "");
}
/* istanbul ignore if */
if (!String.prototype.trimRight) {
  String.prototype.trimRight = trimRightPolyfill;
}

// Export for testing
/* istanbul ignore else */
if ((typeof module !== "undefined") && module.exports) {
  module.exports = {
    "trimLeftPolyfill": trimLeftPolyfill,
    "trimRightPolyfill": trimRightPolyfill
  };
}
