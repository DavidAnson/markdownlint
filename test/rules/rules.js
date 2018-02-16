// @ts-check

"use strict";

var blockquote = require("./blockquote");
module.exports.blockquote = blockquote;

var everyNLines = require("./every-n-lines");
module.exports.everyNLines = everyNLines;

var lettersEX = require("./letters-E-X");
module.exports.lettersEX = lettersEX;

module.exports.all = [
  blockquote,
  everyNLines,
  lettersEX
];
