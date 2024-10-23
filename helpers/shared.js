// @ts-check

"use strict";

// Symbol for identifying the htmlFlow token from micromark parse
module.exports.htmlFlowSymbol = Symbol("html-flow");

// Symbol for identifing the token lists map from micromark parse
module.exports.tokenListsSymbol = Symbol("token-lists");

// Symbol for identifying the token sequence number for micromark parse
module.exports.tokenSequenceSymbol = Symbol("token-sequence");

// Regular expression for matching common newline characters
// See NEWLINES_RE in markdown-it/lib/rules_core/normalize.js
module.exports.newLineRe = /\r\n?|\n/g;

// Regular expression for matching next lines
module.exports.nextLinesRe = /[\r\n][\s\S]*$/;
