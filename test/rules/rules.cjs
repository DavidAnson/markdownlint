// @ts-check

"use strict";

const anyBlockquote = require("./any-blockquote.cjs");
module.exports.anyBlockquote = anyBlockquote[1];

const everyNLines = require("./every-n-lines.cjs");
module.exports.everyNLines = everyNLines;

const firstLine = require("./first-line.cjs");
module.exports.firstLine = firstLine;

const lettersEX = require("./letters-E-X.cjs");
module.exports.lettersEX = lettersEX;

const lintJavaScript = require("./lint-javascript.cjs");
module.exports.lintJavaScript = lintJavaScript;

const validateJson = require("./validate-json.cjs");
module.exports.validateJson = validateJson;

module.exports.all = [
  ...anyBlockquote,
  everyNLines,
  firstLine,
  lettersEX,
  lintJavaScript,
  validateJson
];
