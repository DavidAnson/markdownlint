// @ts-check

"use strict";

/* eslint-disable jsdoc/reject-any-type */

/**
 * Calls require for markdownit.cjs. Used to synchronously defer loading because module.createRequire is buggy under webpack (https://github.com/webpack/webpack/issues/16724).
 *
 * @returns {any} Exported module content.
 */
function requireMarkdownItCjs() {
  // eslint-disable-next-line n/global-require
  return require("./markdownit.cjs");
}

module.exports = {
  requireMarkdownItCjs
};
