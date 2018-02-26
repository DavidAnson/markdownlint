// @ts-check

"use strict";

var anyBlockquote = require("./any-blockquote");
module.exports.anyBlockquote = anyBlockquote;

var everyNLines = require("./every-n-lines");
module.exports.everyNLines = everyNLines;

var firstLine = require("./first-line");
module.exports.firstLine = firstLine;

var lettersEX = require("./letters-E-X");
module.exports.lettersEX = lettersEX;

module.exports.all = [
  anyBlockquote,
  everyNLines,
  firstLine,
  lettersEX
];
