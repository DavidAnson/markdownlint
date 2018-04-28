// @ts-check

"use strict";

const anyBlockquote = require("./any-blockquote");
module.exports.anyBlockquote = anyBlockquote;

const everyNLines = require("./every-n-lines");
module.exports.everyNLines = everyNLines;

const firstLine = require("./first-line");
module.exports.firstLine = firstLine;

const lettersEX = require("./letters-E-X");
module.exports.lettersEX = lettersEX;

module.exports.all = [
  anyBlockquote,
  everyNLines,
  firstLine,
  lettersEX
];
