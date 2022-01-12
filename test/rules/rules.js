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

const lintJavaScript = require("./lint-javascript");
module.exports.lintJavaScript = lintJavaScript;

const validateJson = require("./validate-json");
module.exports.validateJson = validateJson;

module.exports.all = [
  anyBlockquote,
  everyNLines,
  firstLine,
  lettersEX,
  lintJavaScript,
  validateJson
];
