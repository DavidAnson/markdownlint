"use strict";

// Alias "markdown-it" (expected) to "markdownit" (exported)
module.exports = window.markdownit;
if (!module.exports) {
  console.error("markdown-it must be loaded before markdownlint.");
}

// Stub missing implementation of util.promisify (unused here)
var util = require("util");
if (!util.promisify) {
  util.promisify = function promisify(fn) {
    return fn;
  };
}
