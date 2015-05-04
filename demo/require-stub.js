"use strict";

// Aliases "markdown-it" (expected) for "markdownit" (exported)
function require(module) {
  if (module === "markdown-it") {
    return window.markdownit;
  }
}
