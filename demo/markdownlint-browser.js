/*! markdownlint 0.27.0 https://github.com/DavidAnson/markdownlint @license MIT */
var markdownlint;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../lib sync recursive":
/*!********************!*\
  !*** ../lib/ sync ***!
  \********************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "../lib sync recursive";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "../helpers/helpers.js":
/*!*****************************!*\
  !*** ../helpers/helpers.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var micromark = __webpack_require__(/*! ./micromark.cjs */ "../helpers/micromark.cjs");

// Regular expression for matching common newline characters
// See NEWLINES_RE in markdown-it/lib/rules_core/normalize.js
var newLineRe = /\r\n?|\n/g;
module.exports.newLineRe = newLineRe;

// Regular expression for matching common front matter (YAML and TOML)
module.exports.frontMatterRe =
// eslint-disable-next-line max-len
/((^---\s*$[\s\S]*?^---\s*)|(^\+\+\+\s*$[\s\S]*?^(\+\+\+|\.\.\.)\s*)|(^\{\s*$[\s\S]*?^\}\s*))(\r\n|\r|\n|$)/m;

// Regular expression for matching the start of inline disable/enable comments
var inlineCommentStartRe =
// eslint-disable-next-line max-len
/(<!--\s*markdownlint-(disable|enable|capture|restore|disable-file|enable-file|disable-line|disable-next-line|configure-file))(?:\s|-->)/gi;
module.exports.inlineCommentStartRe = inlineCommentStartRe;

// Regular expression for matching HTML elements
var htmlElementRe = /<(([A-Za-z][A-Za-z\d-]*)(?:\s[^`>]*)?)\/?>/g;
module.exports.htmlElementRe = htmlElementRe;

// Regular expressions for range matching
module.exports.listItemMarkerRe = /^([\s>]*)(?:[*+-]|\d+[.)])\s+/;
module.exports.orderedListItemMarkerRe = /^[\s>]*0*(\d+)[.)]/;

// Regular expression for all instances of emphasis markers
var emphasisMarkersRe = /[_*]/g;

// Regular expression for blockquote prefixes
var blockquotePrefixRe = /^[>\s]*/;
module.exports.blockquotePrefixRe = blockquotePrefixRe;

// Regular expression for link reference definitions
var linkReferenceDefinitionRe = /^ {0,3}\[([^\]]*[^\\])\]:/;
module.exports.linkReferenceDefinitionRe = linkReferenceDefinitionRe;

// All punctuation characters (normal and full-width)
var allPunctuation = ".,;:!?。，；：！？";
module.exports.allPunctuation = allPunctuation;

// All punctuation characters without question mark (normal and full-width)
module.exports.allPunctuationNoQuestion = allPunctuation.replace(/[\?\uFF1F]/g, "");

// Returns true iff the input is a number
module.exports.isNumber = function isNumber(obj) {
  return typeof obj === "number";
};

// Returns true iff the input is a string
module.exports.isString = function isString(obj) {
  return typeof obj === "string";
};

// Returns true iff the input string is empty
module.exports.isEmptyString = function isEmptyString(str) {
  return str.length === 0;
};

// Returns true iff the input is an object
module.exports.isObject = function isObject(obj) {
  return obj !== null && _typeof(obj) === "object" && !Array.isArray(obj);
};

/**
 * Returns true iff the input line is blank (contains nothing, whitespace, or
 * comments (unclosed start/end comments allowed)).
 *
 * @param {string} line Input line.
 * @returns {boolean} True iff line is blank.
 */
function isBlankLine(line) {
  var startComment = "<!--";
  var endComment = "-->";
  var removeComments = function removeComments(s) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      var start = s.indexOf(startComment);
      var end = s.indexOf(endComment);
      if (end !== -1 && (start === -1 || end < start)) {
        // Unmatched end comment is first
        s = s.slice(end + endComment.length);
      } else if (start !== -1 && end !== -1) {
        // Start comment is before end comment
        s = s.slice(0, start) + s.slice(end + endComment.length);
      } else if (start !== -1 && end === -1) {
        // Unmatched start comment is last
        s = s.slice(0, start);
      } else {
        // No more comments to remove
        return s;
      }
    }
  };
  return !line || !line.trim() || !removeComments(line).replace(/>/g, "").trim();
}
module.exports.isBlankLine = isBlankLine;

/**
 * Compare function for Array.prototype.sort for ascending order of numbers.
 *
 * @param {number} a First number.
 * @param {number} b Second number.
 * @returns {number} Positive value if a>b, negative value if b<a, 0 otherwise.
 */
module.exports.numericSortAscending = function numericSortAscending(a, b) {
  return a - b;
};

// Returns true iff the sorted array contains the specified element
module.exports.includesSorted = function includesSorted(array, element) {
  var left = 0;
  var right = array.length - 1;
  while (left <= right) {
    // eslint-disable-next-line no-bitwise
    var mid = left + right >> 1;
    if (array[mid] < element) {
      left = mid + 1;
    } else if (array[mid] > element) {
      right = mid - 1;
    } else {
      return true;
    }
  }
  return false;
};

// Replaces the content of properly-formatted CommonMark comments with "."
// This preserves the line/column information for the rest of the document
// https://spec.commonmark.org/0.29/#html-blocks
// https://spec.commonmark.org/0.29/#html-comment
var htmlCommentBegin = "<!--";
var htmlCommentEnd = "-->";
var safeCommentCharacter = ".";
var startsWithPipeRe = /^ *\|/;
var notCrLfRe = /[^\r\n]/g;
var notSpaceCrLfRe = /[^ \r\n]/g;
var trailingSpaceRe = / +[\r\n]/g;
var replaceTrailingSpace = function replaceTrailingSpace(s) {
  return s.replace(notCrLfRe, safeCommentCharacter);
};
module.exports.clearHtmlCommentText = function clearHtmlCommentText(text) {
  var i = 0;
  while ((i = text.indexOf(htmlCommentBegin, i)) !== -1) {
    var j = text.indexOf(htmlCommentEnd, i + 2);
    if (j === -1) {
      // Un-terminated comments are treated as text
      break;
    }
    // If the comment has content...
    if (j > i + htmlCommentBegin.length) {
      var content = text.slice(i + htmlCommentBegin.length, j);
      var lastLf = text.lastIndexOf("\n", i) + 1;
      var preText = text.slice(lastLf, i);
      var isBlock = preText.trim().length === 0;
      var couldBeTable = startsWithPipeRe.test(preText);
      var spansTableCells = couldBeTable && content.includes("\n");
      var isValid = isBlock || !(spansTableCells || content.startsWith(">") || content.startsWith("->") || content.endsWith("-") || content.includes("--"));
      // If a valid block/inline comment...
      if (isValid) {
        var clearedContent = content.replace(notSpaceCrLfRe, safeCommentCharacter).replace(trailingSpaceRe, replaceTrailingSpace);
        text = text.slice(0, i + htmlCommentBegin.length) + clearedContent + text.slice(j);
      }
    }
    i = j + htmlCommentEnd.length;
  }
  return text;
};

// Escapes a string for use in a RegExp
module.exports.escapeForRegExp = function escapeForRegExp(str) {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
};

/**
 * Return the string representation of a fence markup character.
 *
 * @param {string} markup Fence string.
 * @returns {string} String representation.
 */
module.exports.fencedCodeBlockStyleFor = function fencedCodeBlockStyleFor(markup) {
  switch (markup[0]) {
    case "~":
      return "tilde";
    default:
      return "backtick";
  }
};

/**
 * Return the string representation of a emphasis or strong markup character.
 *
 * @param {string} markup Emphasis or strong string.
 * @returns {string} String representation.
 */
module.exports.emphasisOrStrongStyleFor = function emphasisOrStrongStyleFor(markup) {
  switch (markup[0]) {
    case "*":
      return "asterisk";
    default:
      return "underscore";
  }
};

/**
 * Return the number of characters of indent for a token.
 *
 * @param {Object} token MarkdownItToken instance.
 * @returns {number} Characters of indent.
 */
function indentFor(token) {
  var line = token.line.replace(/^[\s>]*(> |>)/, "");
  return line.length - line.trimStart().length;
}
module.exports.indentFor = indentFor;

// Returns the heading style for a heading token
module.exports.headingStyleFor = function headingStyleFor(token) {
  if (token.map[1] - token.map[0] === 1) {
    if (/[^\\]#\s*$/.test(token.line)) {
      return "atx_closed";
    }
    return "atx";
  }
  return "setext";
};

/**
 * Return the string representation of an unordered list marker.
 *
 * @param {Object} token MarkdownItToken instance.
 * @returns {string} String representation.
 */
module.exports.unorderedListStyleFor = function unorderedListStyleFor(token) {
  switch (token.markup) {
    case "-":
      return "dash";
    case "+":
      return "plus";
    // case "*":
    default:
      return "asterisk";
  }
};

/**
 * Calls the provided function for each matching token.
 *
 * @param {Object} params RuleParams instance.
 * @param {string} type Token type identifier.
 * @param {Function} handler Callback function.
 * @returns {void}
 */
function filterTokens(params, type, handler) {
  var _iterator = _createForOfIteratorHelper(params.tokens),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var token = _step.value;
      if (token.type === type) {
        handler(token);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
module.exports.filterTokens = filterTokens;

/**
 * Returns whether a token is a math block (created by markdown-it-texmath).
 *
 * @param {Object} token MarkdownItToken instance.
 * @returns {boolean} True iff token is a math block.
 */
function isMathBlock(token) {
  return (token.tag === "$$" || token.tag === "math") && token.type.startsWith("math_block") && !token.type.endsWith("_end");
}
module.exports.isMathBlock = isMathBlock;

// Get line metadata array
module.exports.getLineMetadata = function getLineMetadata(params) {
  var lineMetadata = params.lines.map(function (line, index) {
    return [line, index, false, 0, false, false, false, false];
  });
  filterTokens(params, "fence", function (token) {
    lineMetadata[token.map[0]][3] = 1;
    lineMetadata[token.map[1] - 1][3] = -1;
    for (var i = token.map[0] + 1; i < token.map[1] - 1; i++) {
      lineMetadata[i][2] = true;
    }
  });
  filterTokens(params, "code_block", function (token) {
    for (var i = token.map[0]; i < token.map[1]; i++) {
      lineMetadata[i][2] = true;
    }
  });
  filterTokens(params, "table_open", function (token) {
    for (var i = token.map[0]; i < token.map[1]; i++) {
      lineMetadata[i][4] = true;
    }
  });
  filterTokens(params, "list_item_open", function (token) {
    var count = 1;
    for (var i = token.map[0]; i < token.map[1]; i++) {
      lineMetadata[i][5] = count;
      count++;
    }
  });
  filterTokens(params, "hr", function (token) {
    lineMetadata[token.map[0]][6] = true;
  });
  var _iterator2 = _createForOfIteratorHelper(params.tokens.filter(isMathBlock)),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var token = _step2.value;
      for (var i = token.map[0]; i < token.map[1]; i++) {
        lineMetadata[i][7] = true;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return lineMetadata;
};

/**
 * Calls the provided function for each line.
 *
 * @param {Object} lineMetadata Line metadata object.
 * @param {Function} handler Function taking (line, lineIndex, inCode, onFence,
 * inTable, inItem, inBreak, inMath).
 * @returns {void}
 */
function forEachLine(lineMetadata, handler) {
  var _iterator3 = _createForOfIteratorHelper(lineMetadata),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var metadata = _step3.value;
      handler.apply(void 0, _toConsumableArray(metadata));
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
}
module.exports.forEachLine = forEachLine;

// Returns (nested) lists as a flat array (in order)
module.exports.flattenLists = function flattenLists(tokens) {
  var flattenedLists = [];
  var stack = [];
  var current = null;
  var nesting = 0;
  var nestingStack = [];
  var lastWithMap = {
    "map": [0, 1]
  };
  var _iterator4 = _createForOfIteratorHelper(tokens),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var token = _step4.value;
      if (token.type === "bullet_list_open" || token.type === "ordered_list_open") {
        // Save current context and start a new one
        stack.push(current);
        current = {
          "unordered": token.type === "bullet_list_open",
          "parentsUnordered": !current || current.unordered && current.parentsUnordered,
          "open": token,
          "indent": indentFor(token),
          "parentIndent": current && current.indent || 0,
          "items": [],
          "nesting": nesting,
          "lastLineIndex": -1,
          "insert": flattenedLists.length
        };
        nesting++;
      } else if (token.type === "bullet_list_close" || token.type === "ordered_list_close") {
        // Finalize current context and restore previous
        current.lastLineIndex = lastWithMap.map[1];
        flattenedLists.splice(current.insert, 0, current);
        delete current.insert;
        current = stack.pop();
        nesting--;
      } else if (token.type === "list_item_open") {
        // Add list item
        current.items.push(token);
      } else if (token.type === "blockquote_open") {
        nestingStack.push(nesting);
        nesting = 0;
      } else if (token.type === "blockquote_close") {
        nesting = nestingStack.pop() || 0;
      }
      if (token.map) {
        // Track last token with map
        lastWithMap = token;
      }
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  return flattenedLists;
};

/**
 * Calls the provided function for each specified inline child token.
 *
 * @param {Object} params RuleParams instance.
 * @param {string} type Token type identifier.
 * @param {Function} handler Callback function.
 * @returns {void}
 */
function forEachInlineChild(params, type, handler) {
  filterTokens(params, "inline", function (token) {
    var _iterator5 = _createForOfIteratorHelper(token.children.filter(function (c) {
        return c.type === type;
      })),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var child = _step5.value;
        handler(child, token);
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
  });
}
module.exports.forEachInlineChild = forEachInlineChild;

// Calls the provided function for each heading's content
module.exports.forEachHeading = function forEachHeading(params, handler) {
  var heading = null;
  var _iterator6 = _createForOfIteratorHelper(params.tokens),
    _step6;
  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var token = _step6.value;
      if (token.type === "heading_open") {
        heading = token;
      } else if (token.type === "heading_close") {
        heading = null;
      } else if (token.type === "inline" && heading) {
        handler(heading, token.content, token);
      }
    }
  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }
};

/**
 * Calls the provided function for each inline code span's content.
 *
 * @param {string} input Markdown content.
 * @param {Function} handler Callback function taking (code, lineIndex,
 * columnIndex, ticks).
 * @returns {void}
 */
function forEachInlineCodeSpan(input, handler) {
  var backtickRe = /`+/g;
  var match = null;
  var backticksLengthAndIndex = [];
  while ((match = backtickRe.exec(input)) !== null) {
    backticksLengthAndIndex.push([match[0].length, match.index]);
  }
  var newLinesIndex = [];
  while ((match = newLineRe.exec(input)) !== null) {
    newLinesIndex.push(match.index);
  }
  var lineIndex = 0;
  var lineStartIndex = 0;
  var k = 0;
  for (var i = 0; i < backticksLengthAndIndex.length - 1; i++) {
    var _backticksLengthAndIn = _slicedToArray(backticksLengthAndIndex[i], 2),
      startLength = _backticksLengthAndIn[0],
      startIndex = _backticksLengthAndIn[1];
    if (startIndex === 0 || input[startIndex - 1] !== "\\") {
      for (var j = i + 1; j < backticksLengthAndIndex.length; j++) {
        var _backticksLengthAndIn2 = _slicedToArray(backticksLengthAndIndex[j], 2),
          endLength = _backticksLengthAndIn2[0],
          endIndex = _backticksLengthAndIn2[1];
        if (startLength === endLength) {
          for (; k < newLinesIndex.length; k++) {
            var newLineIndex = newLinesIndex[k];
            if (startIndex < newLineIndex) {
              break;
            }
            lineIndex++;
            lineStartIndex = newLineIndex + 1;
          }
          var columnIndex = startIndex - lineStartIndex + startLength;
          handler(input.slice(startIndex + startLength, endIndex), lineIndex, columnIndex, startLength);
          i = j;
          break;
        }
      }
    }
  }
}
module.exports.forEachInlineCodeSpan = forEachInlineCodeSpan;

/**
 * Adds ellipsis to the left/right/middle of the specified text.
 *
 * @param {string} text Text to ellipsify.
 * @param {boolean} [start] True iff the start of the text is important.
 * @param {boolean} [end] True iff the end of the text is important.
 * @returns {string} Ellipsified text.
 */
function ellipsify(text, start, end) {
  if (text.length <= 30) {
    // Nothing to do
  } else if (start && end) {
    text = text.slice(0, 15) + "..." + text.slice(-15);
  } else if (end) {
    text = "..." + text.slice(-30);
  } else {
    text = text.slice(0, 30) + "...";
  }
  return text;
}
module.exports.ellipsify = ellipsify;

/**
 * Adds a generic error object via the onError callback.
 *
 * @param {Object} onError RuleOnError instance.
 * @param {number} lineNumber Line number.
 * @param {string} [detail] Error details.
 * @param {string} [context] Error context.
 * @param {number[]} [range] Column and length of error.
 * @param {Object} [fixInfo] RuleOnErrorFixInfo instance.
 * @returns {void}
 */
function addError(onError, lineNumber, detail, context, range, fixInfo) {
  onError({
    lineNumber: lineNumber,
    detail: detail,
    context: context,
    range: range,
    fixInfo: fixInfo
  });
}
module.exports.addError = addError;

// Adds an error object with details conditionally via the onError callback
module.exports.addErrorDetailIf = function addErrorDetailIf(onError, lineNumber, expected, actual, detail, context, range, fixInfo) {
  if (expected !== actual) {
    addError(onError, lineNumber, "Expected: " + expected + "; Actual: " + actual + (detail ? "; " + detail : ""), context, range, fixInfo);
  }
};

// Adds an error object with context via the onError callback
module.exports.addErrorContext = function addErrorContext(onError, lineNumber, context, left, right, range, fixInfo) {
  context = ellipsify(context, left, right);
  addError(onError, lineNumber, undefined, context, range, fixInfo);
};

/**
 * Returns an array of code block and span content ranges.
 *
 * @param {Object} params RuleParams instance.
 * @param {Object} lineMetadata Line metadata object.
 * @returns {number[][]} Array of ranges (lineIndex, columnIndex, length).
 */
module.exports.codeBlockAndSpanRanges = function (params, lineMetadata) {
  var exclusions = [];
  // Add code block ranges (excludes fences)
  forEachLine(lineMetadata, function (line, lineIndex, inCode, onFence) {
    if (inCode && !onFence) {
      exclusions.push([lineIndex, 0, line.length]);
    }
  });
  // Add code span ranges (excludes ticks)
  filterTokens(params, "inline", function (token) {
    if (token.children.some(function (child) {
      return child.type === "code_inline";
    })) {
      var tokenLines = params.lines.slice(token.map[0], token.map[1]);
      forEachInlineCodeSpan(tokenLines.join("\n"), function (code, lineIndex, columnIndex) {
        var codeLines = code.split(newLineRe);
        var _iterator7 = _createForOfIteratorHelper(codeLines.entries()),
          _step7;
        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var _step7$value = _slicedToArray(_step7.value, 2),
              i = _step7$value[0],
              line = _step7$value[1];
            exclusions.push([token.lineNumber - 1 + lineIndex + i, i ? 0 : columnIndex, line.length]);
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
      });
    }
  });
  return exclusions;
};

/**
 * Returns an array of HTML element ranges.
 *
 * @param {Object} params RuleParams instance.
 * @param {Object} lineMetadata Line metadata object.
 * @returns {number[][]} Array of ranges (lineIndex, columnIndex, length).
 */
module.exports.htmlElementRanges = function (params, lineMetadata) {
  var exclusions = [];
  // Match with htmlElementRe
  forEachLine(lineMetadata, function (line, lineIndex, inCode) {
    var match = null;
    // eslint-disable-next-line no-unmodified-loop-condition
    while (!inCode && (match = htmlElementRe.exec(line)) !== null) {
      exclusions.push([lineIndex, match.index, match[0].length]);
    }
  });
  // Match with html_inline
  forEachInlineChild(params, "html_inline", function (token, parent) {
    var parentContent = parent.content;
    var tokenContent = token.content;
    var parentIndex = parentContent.indexOf(tokenContent);
    var deltaLines = 0;
    var indent = 0;
    for (var i = parentIndex - 1; i >= 0; i--) {
      if (parentContent[i] === "\n") {
        deltaLines++;
      } else if (deltaLines === 0) {
        indent++;
      }
    }
    var lineIndex = token.lineNumber - 1 + deltaLines;
    do {
      var index = tokenContent.indexOf("\n");
      var length = index === -1 ? tokenContent.length : index;
      exclusions.push([lineIndex, indent, length]);
      tokenContent = tokenContent.slice(length + 1);
      lineIndex++;
      indent = 0;
    } while (tokenContent.length > 0);
  });
  // Return results
  return exclusions;
};

/**
 * Determines whether the specified range is within another range.
 *
 * @param {number[][]} ranges Array of ranges (line, index, length).
 * @param {number} lineIndex Line index to check.
 * @param {number} index Index to check.
 * @param {number} length Length to check.
 * @returns {boolean} True iff the specified range is within.
 */
var withinAnyRange = function withinAnyRange(ranges, lineIndex, index, length) {
  return !ranges.every(function (span) {
    return lineIndex !== span[0] || index < span[1] || index + length > span[1] + span[2];
  });
};
module.exports.withinAnyRange = withinAnyRange;

// Returns a range object for a line by applying a RegExp
module.exports.rangeFromRegExp = function rangeFromRegExp(line, regexp) {
  var range = null;
  var match = line.match(regexp);
  if (match) {
    var column = match.index + 1;
    var length = match[0].length;
    range = [column, length];
  }
  return range;
};

// Determines if the front matter includes a title
module.exports.frontMatterHasTitle = function frontMatterHasTitle(frontMatterLines, frontMatterTitlePattern) {
  var ignoreFrontMatter = frontMatterTitlePattern !== undefined && !frontMatterTitlePattern;
  var frontMatterTitleRe = new RegExp(String(frontMatterTitlePattern || "^\\s*\"?title\"?\\s*[:=]"), "i");
  return !ignoreFrontMatter && frontMatterLines.some(function (line) {
    return frontMatterTitleRe.test(line);
  });
};

/**
 * Calls the provided function for each link.
 *
 * @param {string} line Line of Markdown input.
 * @param {Function} handler Function taking (index, link, text, destination).
 * @returns {void}
 */
function forEachLink(line, handler) {
  // Helper to find matching close symbol for link text/destination
  var findClosingSymbol = function findClosingSymbol(index) {
    var begin = line[index];
    var end = begin === "[" ? "]" : ")";
    var nesting = 0;
    var escaping = false;
    var pointy = false;
    for (var i = index + 1; i < line.length; i++) {
      var current = line[i];
      if (current === "\\") {
        escaping = !escaping;
      } else if (!escaping && current === begin) {
        nesting++;
      } else if (!escaping && current === end) {
        if (nesting > 0) {
          nesting--;
        } else if (!pointy) {
          // Return index after matching close symbol
          return i + 1;
        }
      } else if (i === index + 1 && begin === "(" && current === "<") {
        pointy = true;
      } else if (!escaping && pointy && current === ">") {
        pointy = false;
        nesting = 0;
      } else {
        escaping = false;
      }
    }
    // No match found
    return -1;
  };
  // Scan line for unescaped "[" character
  var escaping = false;
  for (var i = 0; i < line.length; i++) {
    var current = line[i];
    if (current === "\\") {
      escaping = !escaping;
    } else if (!escaping && current === "[") {
      // Scan for matching close "]" of link text
      var textEnd = findClosingSymbol(i);
      if (textEnd !== -1) {
        if (line[textEnd] === "(" || line[textEnd] === "[") {
          // Scan for matching close ")" or "]" of link destination
          var destEnd = findClosingSymbol(textEnd);
          if (destEnd !== -1) {
            // Call handler with link text and destination
            var link = line.slice(i, destEnd);
            var text = line.slice(i, textEnd);
            var dest = line.slice(textEnd, destEnd);
            handler(i, link, text, dest);
            i = destEnd;
          }
        }
        if (i < textEnd) {
          // Call handler with link text only
          var _text = line.slice(i, textEnd);
          handler(i, _text, _text);
          i = textEnd;
        }
      }
    } else {
      escaping = false;
    }
  }
}
module.exports.forEachLink = forEachLink;

/**
 * Returns a list of emphasis markers in code spans and links.
 *
 * @param {Object} params RuleParams instance.
 * @returns {number[][]} List of markers.
 */
function emphasisMarkersInContent(params) {
  var lines = params.lines;
  var byLine = new Array(lines.length);
  // Search links
  var _iterator8 = _createForOfIteratorHelper(lines.entries()),
    _step8;
  try {
    var _loop = function _loop() {
      var _step8$value = _slicedToArray(_step8.value, 2),
        tokenLineIndex = _step8$value[0],
        tokenLine = _step8$value[1];
      var inLine = [];
      forEachLink(tokenLine, function (index, match) {
        var markerMatch = null;
        while (markerMatch = emphasisMarkersRe.exec(match)) {
          inLine.push(index + markerMatch.index);
        }
      });
      byLine[tokenLineIndex] = inLine;
    };
    for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
      _loop();
    }
    // Search code spans
  } catch (err) {
    _iterator8.e(err);
  } finally {
    _iterator8.f();
  }
  filterTokens(params, "inline", function (token) {
    var children = token.children,
      lineNumber = token.lineNumber,
      map = token.map;
    if (children.some(function (child) {
      return child.type === "code_inline";
    })) {
      var tokenLines = lines.slice(map[0], map[1]);
      forEachInlineCodeSpan(tokenLines.join("\n"), function (code, lineIndex, column, tickCount) {
        var codeLines = code.split(newLineRe);
        var _iterator9 = _createForOfIteratorHelper(codeLines.entries()),
          _step9;
        try {
          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
            var _step9$value = _slicedToArray(_step9.value, 2),
              codeLineIndex = _step9$value[0],
              codeLine = _step9$value[1];
            var byLineIndex = lineNumber - 1 + lineIndex + codeLineIndex;
            var inLine = byLine[byLineIndex];
            var codeLineOffset = codeLineIndex ? 0 : column - 1 + tickCount;
            var match = null;
            while (match = emphasisMarkersRe.exec(codeLine)) {
              inLine.push(codeLineOffset + match.index);
            }
            byLine[byLineIndex] = inLine;
          }
        } catch (err) {
          _iterator9.e(err);
        } finally {
          _iterator9.f();
        }
      });
    }
  });
  return byLine;
}
module.exports.emphasisMarkersInContent = emphasisMarkersInContent;

/**
 * Returns an object with information about reference links and images.
 *
 * @param {Object} params RuleParams instance.
 * @returns {Object} Reference link/image data.
 */
function getReferenceLinkImageData(params) {
  var normalizeReference = function normalizeReference(s) {
    return s.toLowerCase().trim().replace(/\s+/g, " ");
  };
  var definitions = new Map();
  var definitionLineIndices = [];
  var duplicateDefinitions = [];
  var references = new Map();
  var shortcuts = new Map();
  var filteredTokens = micromark.filterByTypes(params.parsers.micromark.tokens, [
  // definitionLineIndices
  "definition", "gfmFootnoteDefinition",
  // definitions and definitionLineIndices
  "definitionLabelString", "gfmFootnoteDefinitionLabelString",
  // references and shortcuts
  "gfmFootnoteCall", "image", "link"]);
  var _iterator10 = _createForOfIteratorHelper(filteredTokens),
    _step10;
  try {
    for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
      var token = _step10.value;
      var labelPrefix = "";
      // eslint-disable-next-line default-case
      switch (token.type) {
        case "definition":
        case "gfmFootnoteDefinition":
          // definitionLineIndices
          for (var i = token.startLine; i <= token.endLine; i++) {
            definitionLineIndices.push(i - 1);
          }
          break;
        case "gfmFootnoteDefinitionLabelString":
          labelPrefix = "^";
        case "definitionLabelString":
          // eslint-disable-line no-fallthrough
          {
            // definitions and definitionLineIndices
            var reference = normalizeReference("".concat(labelPrefix).concat(token.text));
            if (definitions.has(reference)) {
              duplicateDefinitions.push([reference, token.startLine - 1]);
            } else {
              definitions.set(reference, token.startLine - 1);
            }
          }
          break;
        case "gfmFootnoteCall":
        case "image":
        case "link":
          {
            var isShortcut = false;
            var isFullOrCollapsed = false;
            var labelText = null;
            var referenceStringText = null;
            var shortcutCandidate = micromark.matchAndGetTokensByType(token.tokens, ["label"]);
            if (shortcutCandidate) {
              labelText = micromark.getTokenTextByType(shortcutCandidate.label.tokens, "labelText");
              isShortcut = labelText !== null;
            }
            var fullAndCollapsedCandidate = micromark.matchAndGetTokensByType(token.tokens, ["label", "reference"]);
            if (fullAndCollapsedCandidate) {
              labelText = micromark.getTokenTextByType(fullAndCollapsedCandidate.label.tokens, "labelText");
              referenceStringText = micromark.getTokenTextByType(fullAndCollapsedCandidate.reference.tokens, "referenceString");
              isFullOrCollapsed = labelText !== null;
            }
            var footnote = micromark.matchAndGetTokensByType(token.tokens, ["gfmFootnoteCallLabelMarker", "gfmFootnoteCallMarker", "gfmFootnoteCallString", "gfmFootnoteCallLabelMarker"], ["gfmFootnoteCallMarker", "gfmFootnoteCallString"]);
            if (footnote) {
              var callMarkerText = footnote.gfmFootnoteCallMarker.text;
              var callString = footnote.gfmFootnoteCallString.text;
              labelText = "".concat(callMarkerText).concat(callString);
              isShortcut = true;
            }
            // Track shortcuts separately due to ambiguity in "text [text] text"
            if (isShortcut || isFullOrCollapsed) {
              var referenceDatum = [token.startLine - 1, token.startColumn - 1, token.text.length,
              // @ts-ignore
              labelText.length, (referenceStringText || "").length];
              var _reference = normalizeReference(referenceStringText || labelText);
              var dictionary = isShortcut ? shortcuts : references;
              var referenceData = dictionary.get(_reference) || [];
              referenceData.push(referenceDatum);
              dictionary.set(_reference, referenceData);
            }
          }
          break;
      }
    }
  } catch (err) {
    _iterator10.e(err);
  } finally {
    _iterator10.f();
  }
  return {
    references: references,
    shortcuts: shortcuts,
    definitions: definitions,
    duplicateDefinitions: duplicateDefinitions,
    definitionLineIndices: definitionLineIndices
  };
}
module.exports.getReferenceLinkImageData = getReferenceLinkImageData;

/**
 * Gets the most common line ending, falling back to the platform default.
 *
 * @param {string} input Markdown content to analyze.
 * @param {Object} [os] Node.js "os" module.
 * @returns {string} Preferred line ending.
 */
function getPreferredLineEnding(input, os) {
  var cr = 0;
  var lf = 0;
  var crlf = 0;
  var endings = input.match(newLineRe) || [];
  var _iterator11 = _createForOfIteratorHelper(endings),
    _step11;
  try {
    for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
      var ending = _step11.value;
      // eslint-disable-next-line default-case
      switch (ending) {
        case "\r":
          cr++;
          break;
        case "\n":
          lf++;
          break;
        case "\r\n":
          crlf++;
          break;
      }
    }
  } catch (err) {
    _iterator11.e(err);
  } finally {
    _iterator11.f();
  }
  var preferredLineEnding = null;
  if (!cr && !lf && !crlf) {
    preferredLineEnding = os && os.EOL || "\n";
  } else if (lf >= crlf && lf >= cr) {
    preferredLineEnding = "\n";
  } else if (crlf >= cr) {
    preferredLineEnding = "\r\n";
  } else {
    preferredLineEnding = "\r";
  }
  return preferredLineEnding;
}
module.exports.getPreferredLineEnding = getPreferredLineEnding;

/**
 * Normalizes the fields of a RuleOnErrorFixInfo instance.
 *
 * @param {Object} fixInfo RuleOnErrorFixInfo instance.
 * @param {number} [lineNumber] Line number.
 * @returns {Object} Normalized RuleOnErrorFixInfo instance.
 */
function normalizeFixInfo(fixInfo, lineNumber) {
  return {
    "lineNumber": fixInfo.lineNumber || lineNumber,
    "editColumn": fixInfo.editColumn || 1,
    "deleteCount": fixInfo.deleteCount || 0,
    "insertText": fixInfo.insertText || ""
  };
}

/**
 * Fixes the specified error on a line of Markdown content.
 *
 * @param {string} line Line of Markdown content.
 * @param {Object} fixInfo RuleOnErrorFixInfo instance.
 * @param {string} [lineEnding] Line ending to use.
 * @returns {string | null} Fixed content.
 */
function applyFix(line, fixInfo, lineEnding) {
  var _normalizeFixInfo = normalizeFixInfo(fixInfo),
    editColumn = _normalizeFixInfo.editColumn,
    deleteCount = _normalizeFixInfo.deleteCount,
    insertText = _normalizeFixInfo.insertText;
  var editIndex = editColumn - 1;
  return deleteCount === -1 ? null : line.slice(0, editIndex) + insertText.replace(/\n/g, lineEnding || "\n") + line.slice(editIndex + deleteCount);
}
module.exports.applyFix = applyFix;

/**
 * Applies as many fixes as possible to Markdown content.
 *
 * @param {string} input Lines of Markdown content.
 * @param {Object[]} errors RuleOnErrorInfo instances.
 * @returns {string} Corrected content.
 */
function applyFixes(input, errors) {
  var lineEnding = getPreferredLineEnding(input, __webpack_require__(/*! node:os */ "?0176"));
  var lines = input.split(newLineRe);
  // Normalize fixInfo objects
  var fixInfos = errors.filter(function (error) {
    return error.fixInfo;
  }).map(function (error) {
    return normalizeFixInfo(error.fixInfo, error.lineNumber);
  });
  // Sort bottom-to-top, line-deletes last, right-to-left, long-to-short
  fixInfos.sort(function (a, b) {
    var aDeletingLine = a.deleteCount === -1;
    var bDeletingLine = b.deleteCount === -1;
    return b.lineNumber - a.lineNumber || (aDeletingLine ? 1 : bDeletingLine ? -1 : 0) || b.editColumn - a.editColumn || b.insertText.length - a.insertText.length;
  });
  // Remove duplicate entries (needed for following collapse step)
  var lastFixInfo = {};
  fixInfos = fixInfos.filter(function (fixInfo) {
    var unique = fixInfo.lineNumber !== lastFixInfo.lineNumber || fixInfo.editColumn !== lastFixInfo.editColumn || fixInfo.deleteCount !== lastFixInfo.deleteCount || fixInfo.insertText !== lastFixInfo.insertText;
    lastFixInfo = fixInfo;
    return unique;
  });
  // Collapse insert/no-delete and no-insert/delete for same line/column
  lastFixInfo = {
    "lineNumber": -1
  };
  var _iterator12 = _createForOfIteratorHelper(fixInfos),
    _step12;
  try {
    for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
      var fixInfo = _step12.value;
      if (fixInfo.lineNumber === lastFixInfo.lineNumber && fixInfo.editColumn === lastFixInfo.editColumn && !fixInfo.insertText && fixInfo.deleteCount > 0 && lastFixInfo.insertText && !lastFixInfo.deleteCount) {
        fixInfo.insertText = lastFixInfo.insertText;
        lastFixInfo.lineNumber = 0;
      }
      lastFixInfo = fixInfo;
    }
  } catch (err) {
    _iterator12.e(err);
  } finally {
    _iterator12.f();
  }
  fixInfos = fixInfos.filter(function (fixInfo) {
    return fixInfo.lineNumber;
  });
  // Apply all (remaining/updated) fixes
  var lastLineIndex = -1;
  var lastEditIndex = -1;
  var _iterator13 = _createForOfIteratorHelper(fixInfos),
    _step13;
  try {
    for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
      var _fixInfo = _step13.value;
      var lineNumber = _fixInfo.lineNumber,
        editColumn = _fixInfo.editColumn,
        deleteCount = _fixInfo.deleteCount;
      var lineIndex = lineNumber - 1;
      var editIndex = editColumn - 1;
      if (lineIndex !== lastLineIndex || deleteCount === -1 || editIndex + deleteCount <= lastEditIndex - (deleteCount > 0 ? 0 : 1)) {
        // @ts-ignore
        lines[lineIndex] = applyFix(lines[lineIndex], _fixInfo, lineEnding);
      }
      lastLineIndex = lineIndex;
      lastEditIndex = editIndex;
    }
    // Return corrected input
  } catch (err) {
    _iterator13.e(err);
  } finally {
    _iterator13.f();
  }
  return lines.filter(function (line) {
    return line !== null;
  }).join(lineEnding);
}
module.exports.applyFixes = applyFixes;

/**
 * Gets the range and fixInfo values for reporting an error if the expected
 * text is found on the specified line.
 *
 * @param {string[]} lines Lines of Markdown content.
 * @param {number} lineIndex Line index to check.
 * @param {string} search Text to search for.
 * @param {string} replace Text to replace with.
 * @param {number} [instance] Instance on the line (1-based).
 * @returns {Object} Range and fixInfo wrapper.
 */
module.exports.getRangeAndFixInfoIfFound = function (lines, lineIndex, search, replace) {
  var instance = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var range = null;
  var fixInfo = null;
  var searchIndex = -1;
  while (instance > 0) {
    searchIndex = lines[lineIndex].indexOf(search, searchIndex + 1);
    instance--;
  }
  if (searchIndex !== -1) {
    var column = searchIndex + 1;
    var length = search.length;
    range = [column, length];
    fixInfo = {
      "editColumn": column,
      "deleteCount": length,
      "insertText": replace
    };
  }
  return {
    range: range,
    fixInfo: fixInfo
  };
};

/**
 * Gets the next (subsequent) child token if it is of the expected type.
 *
 * @param {Object} parentToken Parent token.
 * @param {Object} childToken Child token basis.
 * @param {string} nextType Token type of next token.
 * @param {string} nextNextType Token type of next-next token.
 * @returns {Object} Next token.
 */
function getNextChildToken(parentToken, childToken, nextType, nextNextType) {
  var children = parentToken.children;
  var index = children.indexOf(childToken);
  if (index !== -1 && children.length > index + 2 && children[index + 1].type === nextType && children[index + 2].type === nextNextType) {
    return children[index + 1];
  }
  return null;
}
module.exports.getNextChildToken = getNextChildToken;

/**
 * Expands a path with a tilde to an absolute path.
 *
 * @param {string} file Path that may begin with a tilde.
 * @param {Object} os Node.js "os" module.
 * @returns {string} Absolute path (or original path).
 */
function expandTildePath(file, os) {
  var homedir = os && os.homedir && os.homedir();
  return homedir ? file.replace(/^~($|\/|\\)/, "".concat(homedir, "$1")) : file;
}
module.exports.expandTildePath = expandTildePath;

/**
 * RegExp.exec-style implementation of function expressions.
 *
 * @param {Function} funcExp Function that takes string and returns
 * [index, length] or null.
 * @param {string} input String to search.
 * @returns {string[] | null} RegExp.exec-style [match] with an index property.
 */
function funcExpExec(funcExp, input) {
  // Start or resume match
  // @ts-ignore
  var lastIndex = funcExp.lastIndex || 0;
  var result = funcExp(input.slice(lastIndex));
  if (result) {
    // Update lastIndex and return match
    var _result = _slicedToArray(result, 2),
      subIndex = _result[0],
      length = _result[1];
    var index = lastIndex + subIndex;
    // @ts-ignore
    funcExp.lastIndex = index + length;
    var match = [input.slice(index, index + length)];
    // @ts-ignore
    match.index = index;
    return match;
  }
  // Reset lastIndex and return no match
  // @ts-ignore
  funcExp.lastIndex = 0;
  return null;
}
module.exports.funcExpExec = funcExpExec;
var urlFeProtocolRe = /(?:http|ftp)s?:\/\//i;
var urlFeAutolinkTerminalsRe = / |$/;
var urlFeBareTerminalsRe = /[ ,!`'"\]]|$/;
var urlFeNonTerminalsRe = "-#/";
var urlFePunctuationRe = /(?:[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F])/;
var urlFePrefixToPostfix = new Map([[" ", " "], ["`", "`"], ["'", "'"], ["\"", "\""], ["‘", "’"], ["“", "”"], ["«", "»"], ["*", "*"], ["_", "_"], ["(", ")"], ["[", "]"], ["{", "}"], ["<", ">"], [">", "<"]]);

/**
 * Function expression that matches URLs.
 *
 * @param {string} input Substring to search for a URL.
 * @returns {Array | null} [index, length] of URL or null.
 */
function urlFe(input) {
  // Find start of URL by searching for protocol
  var match = input.match(urlFeProtocolRe);
  if (match) {
    // Look for matching pre/postfix characters (ex: <...>)
    var start = match.index || 0;
    var length = match[0].length;
    var prefix = input[start - 1] || " ";
    var postfix = urlFePrefixToPostfix.get(prefix);
    // @ts-ignore
    var endPostfix = input.indexOf(postfix, start + length);
    if (endPostfix === -1) {
      endPostfix = input.length;
    }
    // Look for characters that terminate a URL
    var terminalsRe = prefix === "<" ? urlFeAutolinkTerminalsRe : urlFeBareTerminalsRe;
    var endTerminal = start + input.slice(start).search(terminalsRe);
    // Determine tentative end of URL
    var end = Math.min(endPostfix, endTerminal);
    if (prefix === " ") {
      // If the URL used " " as pre/postfix characters, trim the end
      if (input[end - 1] === ")") {
        // Trim any ")" beyond the last "(...)" pair
        var lastOpenParen = input.lastIndexOf("(", end - 2);
        if (lastOpenParen <= start) {
          end--;
        } else {
          var nextCloseParen = input.indexOf(")", lastOpenParen + 1);
          end = nextCloseParen + 1;
        }
      } else {
        // Trim unwanted punctuation
        while (!urlFeNonTerminalsRe.includes(input[end - 1]) && urlFePunctuationRe.test(input[end - 1])) {
          end--;
        }
      }
    }
    return [start, end - start];
  }
  // No match
  return null;
}
module.exports.urlFe = urlFe;

/***/ }),

/***/ "markdown-it":
/*!*****************************!*\
  !*** external "markdownit" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = markdownit;

/***/ }),

/***/ "?0176":
/*!*************************!*\
  !*** node:os (ignored) ***!
  \*************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?d0ee":
/*!*************************!*\
  !*** node:fs (ignored) ***!
  \*************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?e6c4":
/*!*************************!*\
  !*** node:os (ignored) ***!
  \*************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?9a52":
/*!***************************!*\
  !*** node:path (ignored) ***!
  \***************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?39e5":
/*!***************************!*\
  !*** node:util (ignored) ***!
  \***************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "./markdownlint-exports.js":
/*!*********************************!*\
  !*** ./markdownlint-exports.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



module.exports = {
  "library": __webpack_require__(/*! .. */ "../lib/markdownlint.js"),
  "helpers": __webpack_require__(/*! ../helpers */ "../helpers/helpers.js")
};

/***/ }),

/***/ "../helpers/micromark.cjs":
/*!********************************!*\
  !*** ../helpers/micromark.cjs ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



/* eslint-disable n/no-unpublished-require */

// @ts-ignore
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../micromark/micromark.cjs */ "../micromark/micromark.cjs"),
  gfmAutolinkLiteral = _require.gfmAutolinkLiteral,
  gfmFootnote = _require.gfmFootnote,
  parse = _require.parse,
  postprocess = _require.postprocess,
  preprocess = _require.preprocess;

/**
 * Markdown token.
 *
 * @typedef {Object} Token
 * @property {string} type Token type.
 * @property {number} startLine Start line (1-based).
 * @property {number} startColumn Start column (1-based).
 * @property {number} endLine End line (1-based).
 * @property {number} endColumn End column (1-based).
 * @property {string} text Token text.
 * @property {Token[]} tokens Child tokens.
 */

/**
 * Parses a Markdown document and returns (frozen) tokens.
 *
 * @param {string} markdown Markdown document.
 * @param {Object} [options] Options for micromark.
 * @returns {Token[]} Micromark tokens (frozen).
 */
function micromarkParse(markdown) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // Customize options object to add useful extensions
  options.extensions || (options.extensions = []);
  options.extensions.push(gfmAutolinkLiteral, gfmFootnote());

  // Use micromark to parse document into Events
  var encoding = undefined;
  var eol = true;
  var parseContext = parse(options);
  // Customize ParseContext to treat all references as defined
  parseContext.defined.includes = function (searchElement) {
    return searchElement.length > 0;
  };
  var chunks = preprocess()(markdown, encoding, eol);
  var events = postprocess(parseContext.document().write(chunks));

  // Create Token objects
  var document = [];
  var current = {
    "tokens": document
  };
  var history = [current];
  var _iterator = _createForOfIteratorHelper(events),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var event = _step.value;
      var _event = _slicedToArray(event, 3),
        kind = _event[0],
        token = _event[1],
        context = _event[2];
      var type = token.type,
        start = token.start,
        end = token.end;
      var startColumn = start["column"],
        startLine = start["line"];
      var endColumn = end["column"],
        endLine = end["line"];
      var text = null;
      try {
        text = context.sliceSerialize(token);
      } catch (_unused) {
        // https://github.com/micromark/micromark/issues/131
      }
      if (kind === "enter") {
        var previous = current;
        history.push(previous);
        current = {
          type: type,
          startLine: startLine,
          startColumn: startColumn,
          endLine: endLine,
          endColumn: endColumn,
          text: text,
          "tokens": []
        };
        previous.tokens.push(current);
      } else if (kind === "exit") {
        Object.freeze(current.tokens);
        Object.freeze(current);
        // @ts-ignore
        current = history.pop();
      }
    }

    // Return document
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  Object.freeze(document);
  return document;
}

/**
 * Filter a list of Micromark tokens by predicate.
 *
 * @param {Token[]} tokens Micromark tokens.
 * @param {Function} allowed Allowed token predicate.
 * @param {Function} [transform] Transform token list predicate.
 * @returns {Token[]} Filtered tokens.
 */
function filterByPredicate(tokens, allowed, transform) {
  var result = [];
  var pending = _toConsumableArray(tokens);
  var token = null;
  while (token = pending.shift()) {
    if (allowed(token)) {
      result.push(token);
    }
    var transformed = transform ? transform(token.tokens) : token.tokens;
    pending.unshift.apply(pending, _toConsumableArray(transformed));
  }
  return result;
}

/**
 * Filter a list of Micromark tokens by type.
 *
 * @param {Token[]} tokens Micromark tokens.
 * @param {string[]} allowed Types to allow.
 * @returns {Token[]} Filtered tokens.
 */
function filterByTypes(tokens, allowed) {
  return filterByPredicate(tokens, function (token) {
    return allowed.includes(token.type);
  });
}

/**
 * Gets information about the tag in an HTML token.
 *
 * @param {Token} token Micromark token.
 * @returns {Object | null} HTML tag information.
 */
function getHtmlTagInfo(token) {
  var htmlTagNameRe = /^<([^!>][^/\s>]*)/;
  if (token.type === "htmlText") {
    var match = htmlTagNameRe.exec(token.text);
    if (match) {
      var name = match[1];
      var close = name.startsWith("/");
      return {
        close: close,
        "name": close ? name.slice(1) : name
      };
    }
  }
  return null;
}

/**
 * Get the text of a single token from a list of Micromark tokens by type.
 *
 * @param {Token[]} tokens Micromark tokens.
 * @param {string} type Types to match.
 * @returns {string | null} Text of token.
 */
function getTokenTextByType(tokens, type) {
  var filtered = tokens.filter(function (token) {
    return token.type === type;
  });
  return filtered.length === 1 ? filtered[0].text : null;
}

/**
 * Determines a list of Micromark tokens matches and returns a subset.
 *
 * @param {Token[]} tokens Micromark tokens.
 * @param {string[]} matchTypes Types to match.
 * @param {string[]} [resultTypes] Types to return.
 * @returns {Object | null} Matching tokens by type.
 */
function matchAndGetTokensByType(tokens, matchTypes, resultTypes) {
  if (tokens.length !== matchTypes.length) {
    return null;
  }
  resultTypes || (resultTypes = matchTypes);
  var result = {};
  for (var i = 0; i < matchTypes.length; i++) {
    if (tokens[i].type !== matchTypes[i]) {
      return null;
    } else if (resultTypes.includes(matchTypes[i])) {
      result[matchTypes[i]] = tokens[i];
    }
  }
  return result;
}
module.exports = {
  "parse": micromarkParse,
  filterByPredicate: filterByPredicate,
  filterByTypes: filterByTypes,
  getHtmlTagInfo: getHtmlTagInfo,
  getTokenTextByType: getTokenTextByType,
  matchAndGetTokensByType: matchAndGetTokensByType
};

/***/ }),

/***/ "../lib/cache.js":
/*!***********************!*\
  !*** ../lib/cache.js ***!
  \***********************/
/***/ ((module) => {

"use strict";
// @ts-check



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var map = new Map();
module.exports.set = function (keyValuePairs) {
  for (var _i = 0, _Object$entries = Object.entries(keyValuePairs); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      key = _Object$entries$_i[0],
      value = _Object$entries$_i[1];
    map.set(key, value);
  }
};
module.exports.clear = function () {
  return map.clear();
};
module.exports.codeBlockAndSpanRanges = function () {
  return map.get("codeBlockAndSpanRanges");
};
module.exports.flattenedLists = function () {
  return map.get("flattenedLists");
};
module.exports.htmlElementRanges = function () {
  return map.get("htmlElementRanges");
};
module.exports.lineMetadata = function () {
  return map.get("lineMetadata");
};
module.exports.referenceLinkImageData = function () {
  return map.get("referenceLinkImageData");
};

/***/ }),

/***/ "../lib/constants.js":
/*!***************************!*\
  !*** ../lib/constants.js ***!
  \***************************/
/***/ ((module) => {

"use strict";
// @ts-check



module.exports.deprecatedRuleNames = ["MD002", "MD006"];
module.exports.fixableRuleNames = ["MD004", "MD005", "MD006", "MD007", "MD009", "MD010", "MD011", "MD012", "MD014", "MD018", "MD019", "MD020", "MD021", "MD022", "MD023", "MD026", "MD027", "MD030", "MD031", "MD032", "MD034", "MD037", "MD038", "MD039", "MD044", "MD047", "MD049", "MD050", "MD051", "MD053"];
module.exports.homepage = "https://github.com/DavidAnson/markdownlint";
module.exports.version = "0.27.0";

/***/ }),

/***/ "../lib/markdownlint.js":
/*!******************************!*\
  !*** ../lib/markdownlint.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var path = __webpack_require__(/*! node:path */ "?9a52");
var _require = __webpack_require__(/*! node:util */ "?39e5"),
  promisify = _require.promisify;
var markdownit = __webpack_require__(/*! markdown-it */ "markdown-it");
var micromark = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");
var _require2 = __webpack_require__(/*! ./constants */ "../lib/constants.js"),
  deprecatedRuleNames = _require2.deprecatedRuleNames;
var rules = __webpack_require__(/*! ./rules */ "../lib/rules.js");
var helpers = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
var cache = __webpack_require__(/*! ./cache */ "../lib/cache.js");

// @ts-ignore
// eslint-disable-next-line camelcase, max-len, no-inline-comments, no-undef
var dynamicRequire = typeof require === "undefined" ? __webpack_require__("../lib sync recursive") : /* c8 ignore next */require;
// Capture native require implementation for dynamic loading of modules

/**
 * Validate the list of rules for structure and reuse.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {boolean} synchronous Whether to execute synchronously.
 * @returns {Error | null} Error message if validation fails.
 */
function validateRuleList(ruleList, synchronous) {
  var result = null;
  if (ruleList.length === rules.length) {
    // No need to validate if only using built-in rules
    return result;
  }
  var allIds = {};
  var _iterator = _createForOfIteratorHelper(ruleList.entries()),
    _step;
  try {
    var _loop = function _loop() {
      var _step$value = _slicedToArray(_step.value, 2),
        index = _step$value[0],
        rule = _step$value[1];
      var customIndex = index - rules.length;
      // eslint-disable-next-line no-inner-declarations, jsdoc/require-jsdoc
      function newError(property) {
        return new Error("Property '" + property + "' of custom rule at index " + customIndex + " is incorrect.");
      }
      for (var _i2 = 0, _arr2 = ["names", "tags"]; _i2 < _arr2.length; _i2++) {
        var property = _arr2[_i2];
        var value = rule[property];
        if (!result && (!value || !Array.isArray(value) || value.length === 0 || !value.every(helpers.isString) || value.some(helpers.isEmptyString))) {
          result = newError(property);
        }
      }
      for (var _i3 = 0, _arr3 = [["description", "string"], ["function", "function"]]; _i3 < _arr3.length; _i3++) {
        var propertyInfo = _arr3[_i3];
        var _property = propertyInfo[0];
        var _value = rule[_property];
        if (!result && (!_value || _typeof(_value) !== propertyInfo[1])) {
          result = newError(_property);
        }
      }
      if (!result && rule.information && Object.getPrototypeOf(rule.information) !== URL.prototype) {
        result = newError("information");
      }
      if (!result && rule.asynchronous !== undefined && typeof rule.asynchronous !== "boolean") {
        result = newError("asynchronous");
      }
      if (!result && rule.asynchronous && synchronous) {
        result = new Error("Custom rule " + rule.names.join("/") + " at index " + customIndex + " is asynchronous and can not be used in a synchronous context.");
      }
      if (!result) {
        var _iterator2 = _createForOfIteratorHelper(rule.names),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var name = _step2.value;
            var nameUpper = name.toUpperCase();
            if (!result && allIds[nameUpper] !== undefined) {
              result = new Error("Name '" + name + "' of custom rule at index " + customIndex + " is already used as a name or tag.");
            }
            allIds[nameUpper] = true;
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        var _iterator3 = _createForOfIteratorHelper(rule.tags),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var tag = _step3.value;
            var tagUpper = tag.toUpperCase();
            if (!result && allIds[tagUpper]) {
              result = new Error("Tag '" + tag + "' of custom rule at index " + customIndex + " is already used as a name.");
            }
            allIds[tagUpper] = false;
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    };
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return result;
}

/**
 * Creates a LintResults instance with toString for pretty display.
 *
 * @param {Rule[]} ruleList List of rules.
 * @returns {LintResults} New LintResults instance.
 */
function newResults(ruleList) {
  var lintResults = {};
  // eslint-disable-next-line jsdoc/require-jsdoc
  function toString(useAlias) {
    var ruleNameToRule = null;
    var results = [];
    var keys = Object.keys(lintResults);
    keys.sort();
    for (var _i4 = 0, _keys = keys; _i4 < _keys.length; _i4++) {
      var file = _keys[_i4];
      var fileResults = lintResults[file];
      if (Array.isArray(fileResults)) {
        var _iterator4 = _createForOfIteratorHelper(fileResults),
          _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var result = _step4.value;
            var ruleMoniker = result.ruleNames ? result.ruleNames.join("/") : result.ruleName + "/" + result.ruleAlias;
            results.push(file + ": " + result.lineNumber + ": " + ruleMoniker + " " + result.ruleDescription + (result.errorDetail ? " [" + result.errorDetail + "]" : "") + (result.errorContext ? " [Context: \"" + result.errorContext + "\"]" : ""));
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      } else {
        if (!ruleNameToRule) {
          ruleNameToRule = {};
          var _iterator5 = _createForOfIteratorHelper(ruleList),
            _step5;
          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var rule = _step5.value;
              var ruleName = rule.names[0].toUpperCase();
              ruleNameToRule[ruleName] = rule;
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
        }
        for (var _i5 = 0, _Object$entries = Object.entries(fileResults); _i5 < _Object$entries.length; _i5++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i5], 2),
            _ruleName = _Object$entries$_i[0],
            ruleResults = _Object$entries$_i[1];
          var _rule = ruleNameToRule[_ruleName.toUpperCase()];
          var _iterator6 = _createForOfIteratorHelper(ruleResults),
            _step6;
          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var lineNumber = _step6.value;
              // @ts-ignore
              var nameIndex = Math.min(useAlias ? 1 : 0, _rule.names.length - 1);
              var _result = file + ": " + lineNumber + ": " +
              // @ts-ignore
              _rule.names[nameIndex] + " " +
              // @ts-ignore
              _rule.description;
              results.push(_result);
            }
          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }
        }
      }
    }
    return results.join("\n");
  }
  Object.defineProperty(lintResults, "toString", {
    "value": toString
  });
  // @ts-ignore
  return lintResults;
}

/**
 * Remove front matter (if present at beginning of content).
 *
 * @param {string} content Markdown content.
 * @param {RegExp | null} frontMatter Regular expression to match front matter.
 * @returns {Object} Trimmed content and front matter lines.
 */
function removeFrontMatter(content, frontMatter) {
  var frontMatterLines = [];
  if (frontMatter) {
    var frontMatterMatch = content.match(frontMatter);
    if (frontMatterMatch && !frontMatterMatch.index) {
      var contentMatched = frontMatterMatch[0];
      content = content.slice(contentMatched.length);
      frontMatterLines = contentMatched.split(helpers.newLineRe);
      if (frontMatterLines.length > 0 && frontMatterLines[frontMatterLines.length - 1] === "") {
        frontMatterLines.length--;
      }
    }
  }
  return {
    "content": content,
    "frontMatterLines": frontMatterLines
  };
}

/**
 * Freeze all freeze-able members of a token and its children.
 *
 * @param {MarkdownItToken} token A markdown-it token.
 * @returns {void}
 */
function freezeToken(token) {
  if (token.attrs) {
    var _iterator7 = _createForOfIteratorHelper(token.attrs),
      _step7;
    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var attr = _step7.value;
        Object.freeze(attr);
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }
    Object.freeze(token.attrs);
  }
  if (token.children) {
    var _iterator8 = _createForOfIteratorHelper(token.children),
      _step8;
    try {
      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        var child = _step8.value;
        freezeToken(child);
      }
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
    }
    Object.freeze(token.children);
  }
  if (token.map) {
    Object.freeze(token.map);
  }
  Object.freeze(token);
}

/**
 * Annotate tokens with line/lineNumber and freeze them.
 *
 * @param {MarkdownItToken[]} tokens Array of markdown-it tokens.
 * @param {string[]} lines Lines of Markdown content.
 * @returns {void}
 */
function annotateAndFreezeTokens(tokens, lines) {
  var trMap = null;
  var _iterator9 = _createForOfIteratorHelper(tokens),
    _step9;
  try {
    var _loop2 = function _loop2() {
      var token = _step9.value;
      // Provide missing maps for table content
      if (token.type === "tr_open") {
        trMap = token.map;
      } else if (token.type === "tr_close") {
        trMap = null;
      }
      if (!token.map && trMap) {
        token.map = _toConsumableArray(trMap);
      }
      // Update token metadata
      if (token.map) {
        token.line = lines[token.map[0]];
        token.lineNumber = token.map[0] + 1;
        // Trim bottom of token to exclude whitespace lines
        while (token.map[1] && !(lines[token.map[1] - 1] || "").trim()) {
          token.map[1]--;
        }
      }
      // Annotate children with lineNumber
      if (token.children) {
        var codeSpanExtraLines = [];
        if (token.children.some(function (child) {
          return child.type === "code_inline";
        })) {
          helpers.forEachInlineCodeSpan(token.content, function (code) {
            codeSpanExtraLines.push(code.split(helpers.newLineRe).length - 1);
          });
        }
        var lineNumber = token.lineNumber;
        var _iterator10 = _createForOfIteratorHelper(token.children),
          _step10;
        try {
          for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
            var child = _step10.value;
            child.lineNumber = lineNumber;
            child.line = lines[lineNumber - 1];
            if (child.type === "softbreak" || child.type === "hardbreak") {
              lineNumber++;
            } else if (child.type === "code_inline") {
              lineNumber += codeSpanExtraLines.shift();
            }
          }
        } catch (err) {
          _iterator10.e(err);
        } finally {
          _iterator10.f();
        }
      }
      freezeToken(token);
    };
    for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
      _loop2();
    }
  } catch (err) {
    _iterator9.e(err);
  } finally {
    _iterator9.f();
  }
  Object.freeze(tokens);
}

/**
 * Map rule names/tags to canonical rule name.
 *
 * @param {Rule[]} ruleList List of rules.
 * @returns {Object.<string, string[]>} Map of alias to rule name.
 */
function mapAliasToRuleNames(ruleList) {
  var aliasToRuleNames = {};
  // const tagToRuleNames = {};
  var _iterator11 = _createForOfIteratorHelper(ruleList),
    _step11;
  try {
    for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
      var rule = _step11.value;
      var ruleName = rule.names[0].toUpperCase();
      // The following is useful for updating README.md:
      // console.log(
      //   "* **[" + ruleName + "](doc/Rules.md#" + ruleName.toLowerCase() +
      //    ")** *" + rule.names.slice(1).join("/") + "* - " + rule.description);
      var _iterator12 = _createForOfIteratorHelper(rule.names),
        _step12;
      try {
        for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
          var name = _step12.value;
          var nameUpper = name.toUpperCase();
          aliasToRuleNames[nameUpper] = [ruleName];
        }
      } catch (err) {
        _iterator12.e(err);
      } finally {
        _iterator12.f();
      }
      var _iterator13 = _createForOfIteratorHelper(rule.tags),
        _step13;
      try {
        for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
          var tag = _step13.value;
          var tagUpper = tag.toUpperCase();
          var ruleNames = aliasToRuleNames[tagUpper] || [];
          ruleNames.push(ruleName);
          aliasToRuleNames[tagUpper] = ruleNames;
          // tagToRuleNames[tag] = ruleName;
        }
      } catch (err) {
        _iterator13.e(err);
      } finally {
        _iterator13.f();
      }
    }
    // The following is useful for updating README.md:
    // Object.keys(tagToRuleNames).sort().forEach(function forTag(tag) {
    //   console.log("* **" + tag + "** - " +
    //     aliasToRuleNames[tag.toUpperCase()].join(", "));
    // });
    // @ts-ignore
  } catch (err) {
    _iterator11.e(err);
  } finally {
    _iterator11.f();
  }
  return aliasToRuleNames;
}

/**
 * Apply (and normalize) configuration object.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {Configuration} config Configuration object.
 * @param {Object.<string, string[]>} aliasToRuleNames Map of alias to rule
 * names.
 * @returns {Configuration} Effective configuration.
 */
function getEffectiveConfig(ruleList, config, aliasToRuleNames) {
  var defaultKey = Object.keys(config).filter(function (key) {
    return key.toUpperCase() === "DEFAULT";
  });
  var ruleDefault = defaultKey.length === 0 || !!config[defaultKey[0]];
  var effectiveConfig = {};
  var _iterator14 = _createForOfIteratorHelper(ruleList),
    _step14;
  try {
    for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
      var rule = _step14.value;
      var _ruleName2 = rule.names[0].toUpperCase();
      effectiveConfig[_ruleName2] = ruleDefault;
    }
  } catch (err) {
    _iterator14.e(err);
  } finally {
    _iterator14.f();
  }
  var _iterator15 = _createForOfIteratorHelper(deprecatedRuleNames),
    _step15;
  try {
    for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
      var _ruleName3 = _step15.value;
      effectiveConfig[_ruleName3] = false;
    }
  } catch (err) {
    _iterator15.e(err);
  } finally {
    _iterator15.f();
  }
  for (var _i6 = 0, _Object$keys = Object.keys(config); _i6 < _Object$keys.length; _i6++) {
    var key = _Object$keys[_i6];
    var value = config[key];
    if (value) {
      if (!(value instanceof Object)) {
        value = {};
      }
    } else {
      value = false;
    }
    var keyUpper = key.toUpperCase();
    var _iterator16 = _createForOfIteratorHelper(aliasToRuleNames[keyUpper] || []),
      _step16;
    try {
      for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
        var ruleName = _step16.value;
        effectiveConfig[ruleName] = value;
      }
    } catch (err) {
      _iterator16.e(err);
    } finally {
      _iterator16.f();
    }
  }
  return effectiveConfig;
}

/**
 * Parse the content of a configuration file.
 *
 * @param {string} name Name of the configuration file.
 * @param {string} content Configuration content.
 * @param {ConfigurationParser[] | null} [parsers] Parsing function(s).
 * @returns {Object} Configuration object and error message.
 */
function parseConfiguration(name, content, parsers) {
  var config = null;
  var message = "";
  var errors = [];
  var index = 0;
  // Try each parser
  (parsers || [JSON.parse]).every(function (parser) {
    try {
      config = parser(content);
    } catch (error) {
      errors.push("Parser ".concat(index++, ": ").concat(error.message));
    }
    return !config;
  });
  // Message if unable to parse
  if (!config) {
    errors.unshift("Unable to parse '".concat(name, "'"));
    message = errors.join("; ");
  }
  return {
    config: config,
    message: message
  };
}

/**
 * Create a mapping of enabled rules per line.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {string[]} lines List of content lines.
 * @param {string[]} frontMatterLines List of front matter lines.
 * @param {boolean} noInlineConfig Whether to allow inline configuration.
 * @param {Configuration} config Configuration object.
 * @param {ConfigurationParser[] | null} configParsers Configuration parsers.
 * @param {Object.<string, string[]>} aliasToRuleNames Map of alias to rule
 * names.
 * @returns {Object} Effective configuration and enabled rules per line number.
 */
function getEnabledRulesPerLineNumber(ruleList, lines, frontMatterLines, noInlineConfig, config, configParsers, aliasToRuleNames) {
  // Shared variables
  var enabledRules = {};
  var capturedRules = {};
  var allRuleNames = [];
  var enabledRulesPerLineNumber = new Array(1 + frontMatterLines.length);
  // Helper functions
  // eslint-disable-next-line jsdoc/require-jsdoc
  function handleInlineConfig(input, forEachMatch, forEachLine) {
    var _iterator17 = _createForOfIteratorHelper(input.entries()),
      _step17;
    try {
      for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
        var _step17$value = _slicedToArray(_step17.value, 2),
          lineIndex = _step17$value[0],
          line = _step17$value[1];
        if (!noInlineConfig) {
          var match = null;
          while (match = helpers.inlineCommentStartRe.exec(line)) {
            var action = match[2].toUpperCase();
            var startIndex = match.index + match[1].length;
            var endIndex = line.indexOf("-->", startIndex);
            if (endIndex === -1) {
              break;
            }
            var parameter = line.slice(startIndex, endIndex);
            forEachMatch(action, parameter, lineIndex + 1);
          }
        }
        if (forEachLine) {
          forEachLine();
        }
      }
    } catch (err) {
      _iterator17.e(err);
    } finally {
      _iterator17.f();
    }
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function configureFile(action, parameter) {
    if (action === "CONFIGURE-FILE") {
      var _parseConfiguration = parseConfiguration("CONFIGURE-FILE", parameter, configParsers),
        parsed = _parseConfiguration["config"];
      if (parsed) {
        config = _objectSpread(_objectSpread({}, config), parsed);
      }
    }
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function applyEnableDisable(action, parameter, state) {
    state = _objectSpread({}, state);
    var enabled = action.startsWith("ENABLE");
    var trimmed = parameter && parameter.trim();
    var items = trimmed ? trimmed.toUpperCase().split(/\s+/) : allRuleNames;
    var _iterator18 = _createForOfIteratorHelper(items),
      _step18;
    try {
      for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
        var nameUpper = _step18.value;
        var _iterator19 = _createForOfIteratorHelper(aliasToRuleNames[nameUpper] || []),
          _step19;
        try {
          for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
            var ruleName = _step19.value;
            state[ruleName] = enabled;
          }
        } catch (err) {
          _iterator19.e(err);
        } finally {
          _iterator19.f();
        }
      }
    } catch (err) {
      _iterator18.e(err);
    } finally {
      _iterator18.f();
    }
    return state;
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function enableDisableFile(action, parameter) {
    if (action === "ENABLE-FILE" || action === "DISABLE-FILE") {
      enabledRules = applyEnableDisable(action, parameter, enabledRules);
    }
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function captureRestoreEnableDisable(action, parameter) {
    if (action === "CAPTURE") {
      capturedRules = enabledRules;
    } else if (action === "RESTORE") {
      enabledRules = capturedRules;
    } else if (action === "ENABLE" || action === "DISABLE") {
      enabledRules = applyEnableDisable(action, parameter, enabledRules);
    }
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function updateLineState() {
    enabledRulesPerLineNumber.push(enabledRules);
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function disableLineNextLine(action, parameter, lineNumber) {
    var disableLine = action === "DISABLE-LINE";
    var disableNextLine = action === "DISABLE-NEXT-LINE";
    if (disableLine || disableNextLine) {
      var nextLineNumber = frontMatterLines.length + lineNumber + (disableNextLine ? 1 : 0);
      enabledRulesPerLineNumber[nextLineNumber] = applyEnableDisable(action, parameter, enabledRulesPerLineNumber[nextLineNumber] || {});
    }
  }
  // Handle inline comments
  handleInlineConfig([lines.join("\n")], configureFile);
  var effectiveConfig = getEffectiveConfig(ruleList, config, aliasToRuleNames);
  var _iterator20 = _createForOfIteratorHelper(ruleList),
    _step20;
  try {
    for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
      var rule = _step20.value;
      var ruleName = rule.names[0].toUpperCase();
      allRuleNames.push(ruleName);
      enabledRules[ruleName] = !!effectiveConfig[ruleName];
    }
  } catch (err) {
    _iterator20.e(err);
  } finally {
    _iterator20.f();
  }
  capturedRules = enabledRules;
  handleInlineConfig(lines, enableDisableFile);
  handleInlineConfig(lines, captureRestoreEnableDisable, updateLineState);
  handleInlineConfig(lines, disableLineNextLine);
  // Return results
  return {
    effectiveConfig: effectiveConfig,
    enabledRulesPerLineNumber: enabledRulesPerLineNumber
  };
}

/**
 * Lints a string containing Markdown content.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {string} name Identifier for the content.
 * @param {string} content Markdown content.
 * @param {Object} md Instance of markdown-it.
 * @param {Configuration} config Configuration object.
 * @param {ConfigurationParser[] | null} configParsers Configuration parsers.
 * @param {RegExp | null} frontMatter Regular expression for front matter.
 * @param {boolean} handleRuleFailures Whether to handle exceptions in rules.
 * @param {boolean} noInlineConfig Whether to allow inline configuration.
 * @param {number} resultVersion Version of the LintResults object to return.
 * @param {Function} callback Callback (err, result) function.
 * @returns {void}
 */
function lintContent(ruleList, name, content, md, config, configParsers, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, callback) {
  // Remove UTF-8 byte order marker (if present)
  content = content.replace(/^\uFEFF/, "");
  // Remove front matter
  var removeFrontMatterResult = removeFrontMatter(content, frontMatter);
  var frontMatterLines = removeFrontMatterResult.frontMatterLines;
  content = removeFrontMatterResult.content;
  // Get enabled rules per line (with HTML comments present)
  var _getEnabledRulesPerLi = getEnabledRulesPerLineNumber(ruleList, content.split(helpers.newLineRe), frontMatterLines, noInlineConfig, config, configParsers, mapAliasToRuleNames(ruleList)),
    effectiveConfig = _getEnabledRulesPerLi.effectiveConfig,
    enabledRulesPerLineNumber = _getEnabledRulesPerLi.enabledRulesPerLineNumber;
  // Parse content into parser tokens
  var markdownitTokens = md.parse(content, {});
  var micromarkTokens = micromark.parse(content);
  // Hide the content of HTML comments from rules
  content = helpers.clearHtmlCommentText(content);
  // Parse content into lines and update markdown-it tokens
  var lines = content.split(helpers.newLineRe);
  annotateAndFreezeTokens(markdownitTokens, lines);
  // Create (frozen) parameters for rules
  var parsers = Object.freeze({
    "markdownit": Object.freeze({
      "tokens": markdownitTokens
    }),
    "micromark": Object.freeze({
      "tokens": micromarkTokens
    })
  });
  var paramsBase = {
    name: name,
    parsers: parsers,
    "tokens": markdownitTokens,
    "lines": Object.freeze(lines),
    "frontMatterLines": Object.freeze(frontMatterLines)
  };
  var lineMetadata = helpers.getLineMetadata(paramsBase);
  var codeBlockAndSpanRanges = helpers.codeBlockAndSpanRanges(paramsBase, lineMetadata);
  var flattenedLists = helpers.flattenLists(paramsBase.tokens);
  var htmlElementRanges = helpers.htmlElementRanges(paramsBase, lineMetadata);
  var referenceLinkImageData = helpers.getReferenceLinkImageData(paramsBase);
  cache.set({
    codeBlockAndSpanRanges: codeBlockAndSpanRanges,
    flattenedLists: flattenedLists,
    htmlElementRanges: htmlElementRanges,
    lineMetadata: lineMetadata,
    referenceLinkImageData: referenceLinkImageData
  });
  // Function to run for each rule
  var results = [];
  // eslint-disable-next-line jsdoc/require-jsdoc
  function forRule(rule) {
    // Configure rule
    var ruleName = rule.names[0].toUpperCase();
    var params = _objectSpread(_objectSpread({}, paramsBase), {}, {
      "config": effectiveConfig[ruleName]
    });
    // eslint-disable-next-line jsdoc/require-jsdoc
    function throwError(property) {
      throw new Error("Property '" + property + "' of onError parameter is incorrect.");
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    function onError(errorInfo) {
      if (!errorInfo || !helpers.isNumber(errorInfo.lineNumber) || errorInfo.lineNumber < 1 || errorInfo.lineNumber > lines.length) {
        throwError("lineNumber");
      }
      var lineNumber = errorInfo.lineNumber + frontMatterLines.length;
      if (!enabledRulesPerLineNumber[lineNumber][ruleName]) {
        return;
      }
      if (errorInfo.detail && !helpers.isString(errorInfo.detail)) {
        throwError("detail");
      }
      if (errorInfo.context && !helpers.isString(errorInfo.context)) {
        throwError("context");
      }
      if (errorInfo.range && (!Array.isArray(errorInfo.range) || errorInfo.range.length !== 2 || !helpers.isNumber(errorInfo.range[0]) || errorInfo.range[0] < 1 || !helpers.isNumber(errorInfo.range[1]) || errorInfo.range[1] < 1 || errorInfo.range[0] + errorInfo.range[1] - 1 > lines[errorInfo.lineNumber - 1].length)) {
        throwError("range");
      }
      var fixInfo = errorInfo.fixInfo;
      var cleanFixInfo = {};
      if (fixInfo) {
        if (!helpers.isObject(fixInfo)) {
          throwError("fixInfo");
        }
        if (fixInfo.lineNumber !== undefined) {
          if (!helpers.isNumber(fixInfo.lineNumber) || fixInfo.lineNumber < 1 || fixInfo.lineNumber > lines.length) {
            throwError("fixInfo.lineNumber");
          }
          cleanFixInfo.lineNumber = fixInfo.lineNumber + frontMatterLines.length;
        }
        var effectiveLineNumber = fixInfo.lineNumber || errorInfo.lineNumber;
        if (fixInfo.editColumn !== undefined) {
          if (!helpers.isNumber(fixInfo.editColumn) || fixInfo.editColumn < 1 || fixInfo.editColumn > lines[effectiveLineNumber - 1].length + 1) {
            throwError("fixInfo.editColumn");
          }
          cleanFixInfo.editColumn = fixInfo.editColumn;
        }
        if (fixInfo.deleteCount !== undefined) {
          if (!helpers.isNumber(fixInfo.deleteCount) || fixInfo.deleteCount < -1 || fixInfo.deleteCount > lines[effectiveLineNumber - 1].length) {
            throwError("fixInfo.deleteCount");
          }
          cleanFixInfo.deleteCount = fixInfo.deleteCount;
        }
        if (fixInfo.insertText !== undefined) {
          if (!helpers.isString(fixInfo.insertText)) {
            throwError("fixInfo.insertText");
          }
          cleanFixInfo.insertText = fixInfo.insertText;
        }
      }
      results.push({
        lineNumber: lineNumber,
        "ruleName": rule.names[0],
        "ruleNames": rule.names,
        "ruleDescription": rule.description,
        "ruleInformation": rule.information ? rule.information.href : null,
        "errorDetail": errorInfo.detail || null,
        "errorContext": errorInfo.context || null,
        "errorRange": errorInfo.range ? _toConsumableArray(errorInfo.range) : null,
        "fixInfo": fixInfo ? cleanFixInfo : null
      });
    }
    // Call (possibly external) rule function to report errors
    var catchCallsOnError = function catchCallsOnError(error) {
      return onError({
        "lineNumber": 1,
        "detail": "This rule threw an exception: ".concat(error.message || error)
      });
    };
    var invokeRuleFunction = function invokeRuleFunction() {
      return rule["function"](params, onError);
    };
    if (rule.asynchronous) {
      // Asynchronous rule, ensure it returns a Promise
      var ruleFunctionPromise = Promise.resolve().then(invokeRuleFunction);
      return handleRuleFailures ? ruleFunctionPromise["catch"](catchCallsOnError) : ruleFunctionPromise;
    }
    // Synchronous rule
    try {
      invokeRuleFunction();
    } catch (error) {
      if (handleRuleFailures) {
        catchCallsOnError(error);
      } else {
        throw error;
      }
    }
    return null;
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function formatResults() {
    // Sort results by rule name by line number
    results.sort(function (a, b) {
      return a.ruleName.localeCompare(b.ruleName) || a.lineNumber - b.lineNumber;
    });
    if (resultVersion < 3) {
      // Remove fixInfo and multiple errors for the same rule and line number
      var noPrevious = {
        "ruleName": null,
        "lineNumber": -1
      };
      results = results.filter(function (error, index, array) {
        delete error.fixInfo;
        var previous = array[index - 1] || noPrevious;
        return error.ruleName !== previous.ruleName || error.lineNumber !== previous.lineNumber;
      });
    }
    if (resultVersion === 0) {
      // Return a dictionary of rule->[line numbers]
      var dictionary = {};
      var _iterator21 = _createForOfIteratorHelper(results),
        _step21;
      try {
        for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
          var error = _step21.value;
          var ruleLines = dictionary[error.ruleName] || [];
          ruleLines.push(error.lineNumber);
          dictionary[error.ruleName] = ruleLines;
        }
        // @ts-ignore
      } catch (err) {
        _iterator21.e(err);
      } finally {
        _iterator21.f();
      }
      results = dictionary;
    } else if (resultVersion === 1) {
      // Use ruleAlias instead of ruleNames
      var _iterator22 = _createForOfIteratorHelper(results),
        _step22;
      try {
        for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
          var _error = _step22.value;
          _error.ruleAlias = _error.ruleNames[1] || _error.ruleName;
          delete _error.ruleNames;
        }
      } catch (err) {
        _iterator22.e(err);
      } finally {
        _iterator22.f();
      }
    } else {
      // resultVersion 2 or 3: Remove unwanted ruleName
      var _iterator23 = _createForOfIteratorHelper(results),
        _step23;
      try {
        for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {
          var _error2 = _step23.value;
          delete _error2.ruleName;
        }
      } catch (err) {
        _iterator23.e(err);
      } finally {
        _iterator23.f();
      }
    }
    return results;
  }
  // Run all rules
  var ruleListAsync = ruleList.filter(function (rule) {
    return rule.asynchronous;
  });
  var ruleListSync = ruleList.filter(function (rule) {
    return !rule.asynchronous;
  });
  var ruleListAsyncFirst = [].concat(_toConsumableArray(ruleListAsync), _toConsumableArray(ruleListSync));
  var callbackSuccess = function callbackSuccess() {
    return callback(null, formatResults());
  };
  var callbackError = function callbackError(error) {
    return callback(error instanceof Error ? error : new Error(error));
  };
  try {
    var ruleResults = ruleListAsyncFirst.map(forRule);
    if (ruleListAsync.length > 0) {
      Promise.all(ruleResults.slice(0, ruleListAsync.length)).then(callbackSuccess)["catch"](callbackError);
    } else {
      callbackSuccess();
    }
  } catch (error) {
    callbackError(error);
  } finally {
    cache.clear();
  }
}

/**
 * Lints a file containing Markdown content.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {string} file Path of file to lint.
 * @param {Object} md Instance of markdown-it.
 * @param {Configuration} config Configuration object.
 * @param {ConfigurationParser[] | null} configParsers Configuration parsers.
 * @param {RegExp | null} frontMatter Regular expression for front matter.
 * @param {boolean} handleRuleFailures Whether to handle exceptions in rules.
 * @param {boolean} noInlineConfig Whether to allow inline configuration.
 * @param {number} resultVersion Version of the LintResults object to return.
 * @param {Object} fs File system implementation.
 * @param {boolean} synchronous Whether to execute synchronously.
 * @param {Function} callback Callback (err, result) function.
 * @returns {void}
 */
function lintFile(ruleList, file, md, config, configParsers, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, fs, synchronous, callback) {
  // eslint-disable-next-line jsdoc/require-jsdoc
  function lintContentWrapper(err, content) {
    if (err) {
      return callback(err);
    }
    return lintContent(ruleList, file, content, md, config, configParsers, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, callback);
  }
  // Make a/synchronous call to read file
  if (synchronous) {
    lintContentWrapper(null, fs.readFileSync(file, "utf8"));
  } else {
    fs.readFile(file, "utf8", lintContentWrapper);
  }
}

/**
 * Lint files and strings specified in the Options object.
 *
 * @param {Options | null} options Options object.
 * @param {boolean} synchronous Whether to execute synchronously.
 * @param {Function} callback Callback (err, result) function.
 * @returns {void}
 */
function lintInput(options, synchronous, callback) {
  // Normalize inputs
  options = options || {};
  callback = callback || function noop() {};
  // eslint-disable-next-line unicorn/prefer-spread
  var ruleList = rules.concat(options.customRules || []);
  var ruleErr = validateRuleList(ruleList, synchronous);
  if (ruleErr) {
    callback(ruleErr);
    return;
  }
  var files = [];
  if (Array.isArray(options.files)) {
    files = _toConsumableArray(options.files);
  } else if (options.files) {
    files = [String(options.files)];
  }
  var strings = options.strings || {};
  var stringsKeys = Object.keys(strings);
  var config = options.config || {
    "default": true
  };
  var configParsers = options.configParsers || null;
  var frontMatter = options.frontMatter === undefined ? helpers.frontMatterRe : options.frontMatter;
  var handleRuleFailures = !!options.handleRuleFailures;
  var noInlineConfig = !!options.noInlineConfig;
  var resultVersion = options.resultVersion === undefined ? 3 : options.resultVersion;
  var md = markdownit({
    "html": true
  });
  var markdownItPlugins = options.markdownItPlugins || [];
  var _iterator24 = _createForOfIteratorHelper(markdownItPlugins),
    _step24;
  try {
    for (_iterator24.s(); !(_step24 = _iterator24.n()).done;) {
      var plugin = _step24.value;
      // @ts-ignore
      md.use.apply(md, _toConsumableArray(plugin));
    }
  } catch (err) {
    _iterator24.e(err);
  } finally {
    _iterator24.f();
  }
  var fs = options.fs || __webpack_require__(/*! node:fs */ "?d0ee");
  var results = newResults(ruleList);
  var done = false;
  var concurrency = 0;
  // eslint-disable-next-line jsdoc/require-jsdoc
  function lintWorker() {
    var currentItem = null;
    // eslint-disable-next-line jsdoc/require-jsdoc
    function lintWorkerCallback(err, result) {
      concurrency--;
      if (err) {
        done = true;
        return callback(err);
      }
      results[currentItem] = result;
      if (!synchronous) {
        lintWorker();
      }
      return null;
    }
    if (done) {
      // Abort for error or nothing left to do
    } else if (files.length > 0) {
      // Lint next file
      concurrency++;
      currentItem = files.shift();
      lintFile(ruleList, currentItem, md, config, configParsers, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, fs, synchronous, lintWorkerCallback);
    } else if (currentItem = stringsKeys.shift()) {
      // Lint next string
      concurrency++;
      lintContent(ruleList, currentItem, strings[currentItem] || "", md, config, configParsers, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, lintWorkerCallback);
    } else if (concurrency === 0) {
      // Finish
      done = true;
      return callback(null, results);
    }
    return null;
  }
  if (synchronous) {
    while (!done) {
      lintWorker();
    }
  } else {
    // Testing on a Raspberry Pi 4 Model B with an artificial 5ms file access
    // delay suggests that a concurrency factor of 8 can eliminate the impact
    // of that delay (i.e., total time is the same as with no delay).
    lintWorker();
    lintWorker();
    lintWorker();
    lintWorker();
    lintWorker();
    lintWorker();
    lintWorker();
    lintWorker();
  }
}

/**
 * Lint specified Markdown files.
 *
 * @param {Options | null} options Configuration options.
 * @param {LintCallback} callback Callback (err, result) function.
 * @returns {void}
 */
function markdownlint(options, callback) {
  return lintInput(options, false, callback);
}
var markdownlintPromisify = promisify && promisify(markdownlint);

/**
 * Lint specified Markdown files.
 *
 * @param {Options} options Configuration options.
 * @returns {Promise<LintResults>} Results object.
 */
function markdownlintPromise(options) {
  // @ts-ignore
  return markdownlintPromisify(options);
}

/**
 * Lint specified Markdown files synchronously.
 *
 * @param {Options | null} options Configuration options.
 * @returns {LintResults} Results object.
 */
function markdownlintSync(options) {
  var results = {};
  lintInput(options, true, function callback(error, res) {
    if (error) {
      throw error;
    }
    results = res;
  });
  // @ts-ignore
  return results;
}

/**
 * Resolve referenced "extends" path in a configuration file
 * using path.resolve() with require.resolve() as a fallback.
 *
 * @param {string} configFile Configuration file name.
 * @param {string} referenceId Referenced identifier to resolve.
 * @param {Object} fs File system implementation.
 * @param {ResolveConfigExtendsCallback} callback Callback (err, result)
 * function.
 * @returns {void}
 */
function resolveConfigExtends(configFile, referenceId, fs, callback) {
  var configFileDirname = path.dirname(configFile);
  var resolvedExtendsFile = path.resolve(configFileDirname, referenceId);
  fs.access(resolvedExtendsFile, function (err) {
    if (err) {
      // Not a file, try require.resolve
      try {
        return callback(null, dynamicRequire.resolve(referenceId, {
          "paths": [configFileDirname]
        }));
      } catch (_unused) {
        // Unable to resolve, use resolvedExtendsFile
      }
    }
    return callback(null, resolvedExtendsFile);
  });
}

/**
 * Resolve referenced "extends" path in a configuration file
 * using path.resolve() with require.resolve() as a fallback.
 *
 * @param {string} configFile Configuration file name.
 * @param {string} referenceId Referenced identifier to resolve.
 * @param {Object} fs File system implementation.
 * @returns {string} Resolved path to file.
 */
function resolveConfigExtendsSync(configFile, referenceId, fs) {
  var configFileDirname = path.dirname(configFile);
  var resolvedExtendsFile = path.resolve(configFileDirname, referenceId);
  try {
    fs.accessSync(resolvedExtendsFile);
    return resolvedExtendsFile;
  } catch (_unused2) {
    // Not a file, try require.resolve
  }
  try {
    return dynamicRequire.resolve(referenceId, {
      "paths": [configFileDirname]
    });
  } catch (_unused3) {
    // Unable to resolve, return resolvedExtendsFile
  }
  return resolvedExtendsFile;
}

/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[] | ReadConfigCallback} parsers Parsing
 * function(s).
 * @param {Object} [fs] File system implementation.
 * @param {ReadConfigCallback} [callback] Callback (err, result) function.
 * @returns {void}
 */
function readConfig(file, parsers, fs, callback) {
  if (!callback) {
    if (fs) {
      callback = fs;
      fs = null;
    } else {
      // @ts-ignore
      callback = parsers;
      // @ts-ignore
      parsers = null;
    }
  }
  if (!fs) {
    fs = __webpack_require__(/*! node:fs */ "?d0ee");
  }
  // Read file
  var os = __webpack_require__(/*! node:os */ "?e6c4");
  file = helpers.expandTildePath(file, os);
  fs.readFile(file, "utf8", function (err, content) {
    if (err) {
      // @ts-ignore
      return callback(err);
    }
    // Try to parse file
    // @ts-ignore
    var _parseConfiguration2 = parseConfiguration(file, content, parsers),
      config = _parseConfiguration2.config,
      message = _parseConfiguration2.message;
    if (!config) {
      // @ts-ignore
      return callback(new Error(message));
    }
    // Extend configuration
    var configExtends = config["extends"];
    if (configExtends) {
      delete config["extends"];
      return resolveConfigExtends(file, helpers.expandTildePath(configExtends, os), fs, function (_, resolvedExtends) {
        return readConfig(
        // @ts-ignore
        resolvedExtends, parsers, fs, function (errr, extendsConfig) {
          if (errr) {
            // @ts-ignore
            return callback(errr);
          }
          // @ts-ignore
          return callback(null, _objectSpread(_objectSpread({}, extendsConfig), config));
        });
      });
    }
    // @ts-ignore
    return callback(null, config);
  });
}
var readConfigPromisify = promisify && promisify(readConfig);

/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} [parsers] Parsing function(s).
 * @param {Object} [fs] File system implementation.
 * @returns {Promise<Configuration>} Configuration object.
 */
function readConfigPromise(file, parsers, fs) {
  // @ts-ignore
  return readConfigPromisify(file, parsers, fs);
}

/**
 * Read specified configuration file synchronously.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} [parsers] Parsing function(s).
 * @param {Object} [fs] File system implementation.
 * @returns {Configuration} Configuration object.
 * @throws An Error if processing fails.
 */
function readConfigSync(file, parsers, fs) {
  if (!fs) {
    fs = __webpack_require__(/*! node:fs */ "?d0ee");
  }
  // Read file
  var os = __webpack_require__(/*! node:os */ "?e6c4");
  file = helpers.expandTildePath(file, os);
  var content = fs.readFileSync(file, "utf8");
  // Try to parse file
  var _parseConfiguration3 = parseConfiguration(file, content, parsers),
    config = _parseConfiguration3.config,
    message = _parseConfiguration3.message;
  if (!config) {
    throw new Error(message);
  }
  // Extend configuration
  var configExtends = config["extends"];
  if (configExtends) {
    delete config["extends"];
    var resolvedExtends = resolveConfigExtendsSync(file, helpers.expandTildePath(configExtends, os), fs);
    return _objectSpread(_objectSpread({}, readConfigSync(resolvedExtends, parsers, fs)), config);
  }
  return config;
}

/**
 * Gets the (semantic) version of the library.
 *
 * @returns {string} SemVer string.
 */
function getVersion() {
  return (__webpack_require__(/*! ./constants */ "../lib/constants.js").version);
}

// Export a/synchronous/Promise APIs
markdownlint.sync = markdownlintSync;
markdownlint.readConfig = readConfig;
markdownlint.readConfigSync = readConfigSync;
markdownlint.getVersion = getVersion;
markdownlint.promises = {
  "markdownlint": markdownlintPromise,
  "readConfig": readConfigPromise
};
module.exports = markdownlint;

// Type declarations

/**
 * Function to implement rule logic.
 *
 * @callback RuleFunction
 * @param {RuleParams} params Rule parameters.
 * @param {RuleOnError} onError Error-reporting callback.
 * @returns {void}
 */

/**
 * Rule parameters.
 *
 * @typedef {Object} RuleParams
 * @property {string} name File/string name.
 * @property {MarkdownItToken[]} tokens Token objects from markdown-it.
 * @property {string[]} lines File/string lines.
 * @property {string[]} frontMatterLines Front matter lines.
 * @property {RuleConfiguration} config Rule configuration.
 */

/**
 * Markdown-It token.
 *
 * @typedef {Object} MarkdownItToken
 * @property {string[][]} attrs HTML attributes.
 * @property {boolean} block Block-level token.
 * @property {MarkdownItToken[]} children Child nodes.
 * @property {string} content Tag contents.
 * @property {boolean} hidden Ignore element.
 * @property {string} info Fence info.
 * @property {number} level Nesting level.
 * @property {number[]} map Beginning/ending line numbers.
 * @property {string} markup Markup text.
 * @property {Object} meta Arbitrary data.
 * @property {number} nesting Level change.
 * @property {string} tag HTML tag name.
 * @property {string} type Token type.
 * @property {number} lineNumber Line number (1-based).
 * @property {string} line Line content.
 */

/**
 * Error-reporting callback.
 *
 * @callback RuleOnError
 * @param {RuleOnErrorInfo} onErrorInfo Error information.
 * @returns {void}
 */

/**
 * Fix information for RuleOnError callback.
 *
 * @typedef {Object} RuleOnErrorInfo
 * @property {number} lineNumber Line number (1-based).
 * @property {string} [detail] Detail about the error.
 * @property {string} [context] Context for the error.
 * @property {number[]} [range] Column number (1-based) and length.
 * @property {RuleOnErrorFixInfo} [fixInfo] Fix information.
 */

/**
 * Fix information for RuleOnErrorInfo.
 *
 * @typedef {Object} RuleOnErrorFixInfo
 * @property {number} [lineNumber] Line number (1-based).
 * @property {number} [editColumn] Column of the fix (1-based).
 * @property {number} [deleteCount] Count of characters to delete.
 * @property {string} [insertText] Text to insert (after deleting).
 */

/**
 * Rule definition.
 *
 * @typedef {Object} Rule
 * @property {string[]} names Rule name(s).
 * @property {string} description Rule description.
 * @property {URL} [information] Link to more information.
 * @property {string[]} tags Rule tag(s).
 * @property {boolean} [asynchronous] True if asynchronous.
 * @property {RuleFunction} function Rule implementation.
 */

/**
 * Configuration options.
 *
 * @typedef {Object} Options
 * @property {Configuration} [config] Configuration object.
 * @property {ConfigurationParser[]} [configParsers] Configuration parsers.
 * @property {Rule[] | Rule} [customRules] Custom rules.
 * @property {string[] | string} [files] Files to lint.
 * @property {RegExp | null} [frontMatter] Front matter pattern.
 * @property {Object} [fs] File system implementation.
 * @property {boolean} [handleRuleFailures] True to catch exceptions.
 * @property {Plugin[]} [markdownItPlugins] Additional plugins.
 * @property {boolean} [noInlineConfig] True to ignore HTML directives.
 * @property {number} [resultVersion] Results object version.
 * @property {Object.<string, string>} [strings] Strings to lint.
 */

/**
 * A markdown-it plugin.
 *
 * @typedef {Array} Plugin
 */

/**
 * Function to pretty-print lint results.
 *
 * @callback ToStringCallback
 * @param {boolean} [ruleAliases] True to use rule aliases.
 * @returns {string}
 */

/**
 * Lint results (for resultVersion 3).
 *
 * @typedef {Object.<string, LintError[]>} LintResults
 * @property {ToStringCallback} toString String representation.
 */

/**
 * Lint error.
 *
 * @typedef {Object} LintError
 * @property {number} lineNumber Line number (1-based).
 * @property {string[]} ruleNames Rule name(s).
 * @property {string} ruleDescription Rule description.
 * @property {string} ruleInformation Link to more information.
 * @property {string} errorDetail Detail about the error.
 * @property {string} errorContext Context for the error.
 * @property {number[]} errorRange Column number (1-based) and length.
 * @property {FixInfo} [fixInfo] Fix information.
 */

/**
 * Fix information.
 *
 * @typedef {Object} FixInfo
 * @property {number} [lineNumber] Line number (1-based).
 * @property {number} [editColumn] Column of the fix (1-based).
 * @property {number} [deleteCount] Count of characters to delete.
 * @property {string} [insertText] Text to insert (after deleting).
 */

/**
 * Called with the result of the lint function.
 *
 * @callback LintCallback
 * @param {Error | null} err Error object or null.
 * @param {LintResults} [results] Lint results.
 * @returns {void}
 */

/**
 * Configuration object for linting rules. For a detailed schema, see
 * {@link ../schema/markdownlint-config-schema.json}.
 *
 * @typedef {Object.<string, RuleConfiguration>} Configuration
 */

/**
 * Rule configuration object.
 *
 * @typedef {boolean | Object} RuleConfiguration Rule configuration.
 */

/**
 * Parses a configuration string and returns a configuration object.
 *
 * @callback ConfigurationParser
 * @param {string} text Configuration string.
 * @returns {Configuration}
 */

/**
 * Called with the result of the readConfig function.
 *
 * @callback ReadConfigCallback
 * @param {Error | null} err Error object or null.
 * @param {Configuration} [config] Configuration object.
 * @returns {void}
 */

/**
 * Called with the result of the resolveConfigExtends function.
 *
 * @callback ResolveConfigExtendsCallback
 * @param {Error | null} err Error object or null.
 * @param {string} [path] Resolved path to file.
 * @returns {void}
 */

/***/ }),

/***/ "../lib/md001.js":
/*!***********************!*\
  !*** ../lib/md001.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorDetailIf = _require.addErrorDetailIf,
  filterTokens = _require.filterTokens;
module.exports = {
  "names": ["MD001", "heading-increment", "header-increment"],
  "description": "Heading levels should only increment by one level at a time",
  "tags": ["headings", "headers"],
  "function": function MD001(params, onError) {
    var prevLevel = 0;
    filterTokens(params, "heading_open", function forToken(token) {
      var level = Number.parseInt(token.tag.slice(1), 10);
      if (prevLevel && level > prevLevel) {
        addErrorDetailIf(onError, token.lineNumber, "h" + (prevLevel + 1), "h" + level);
      }
      prevLevel = level;
    });
  }
};

/***/ }),

/***/ "../lib/md002.js":
/*!***********************!*\
  !*** ../lib/md002.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorDetailIf = _require.addErrorDetailIf;
module.exports = {
  "names": ["MD002", "first-heading-h1", "first-header-h1"],
  "description": "First heading should be a top-level heading",
  "tags": ["headings", "headers"],
  "function": function MD002(params, onError) {
    var level = Number(params.config.level || 1);
    var tag = "h" + level;
    params.tokens.every(function forToken(token) {
      if (token.type === "heading_open") {
        addErrorDetailIf(onError, token.lineNumber, tag, token.tag);
        return false;
      }
      return true;
    });
  }
};

/***/ }),

/***/ "../lib/md003.js":
/*!***********************!*\
  !*** ../lib/md003.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorDetailIf = _require.addErrorDetailIf,
  filterTokens = _require.filterTokens,
  headingStyleFor = _require.headingStyleFor;
module.exports = {
  "names": ["MD003", "heading-style", "header-style"],
  "description": "Heading style",
  "tags": ["headings", "headers"],
  "function": function MD003(params, onError) {
    var style = String(params.config.style || "consistent");
    filterTokens(params, "heading_open", function forToken(token) {
      var styleForToken = headingStyleFor(token);
      if (style === "consistent") {
        style = styleForToken;
      }
      if (styleForToken !== style) {
        var h12 = /h[12]/.test(token.tag);
        var setextWithAtx = style === "setext_with_atx" && (h12 && styleForToken === "setext" || !h12 && styleForToken === "atx");
        var setextWithAtxClosed = style === "setext_with_atx_closed" && (h12 && styleForToken === "setext" || !h12 && styleForToken === "atx_closed");
        if (!setextWithAtx && !setextWithAtxClosed) {
          var expected = style;
          if (style === "setext_with_atx") {
            expected = h12 ? "setext" : "atx";
          } else if (style === "setext_with_atx_closed") {
            expected = h12 ? "setext" : "atx_closed";
          }
          addErrorDetailIf(onError, token.lineNumber, expected, styleForToken);
        }
      }
    });
  }
};

/***/ }),

/***/ "../lib/md004.js":
/*!***********************!*\
  !*** ../lib/md004.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorDetailIf = _require.addErrorDetailIf,
  listItemMarkerRe = _require.listItemMarkerRe,
  unorderedListStyleFor = _require.unorderedListStyleFor;
var _require2 = __webpack_require__(/*! ./cache */ "../lib/cache.js"),
  flattenedLists = _require2.flattenedLists;
var expectedStyleToMarker = {
  "dash": "-",
  "plus": "+",
  "asterisk": "*"
};
var differentItemStyle = {
  "dash": "plus",
  "plus": "asterisk",
  "asterisk": "dash"
};
var validStyles = Object.keys(expectedStyleToMarker);
module.exports = {
  "names": ["MD004", "ul-style"],
  "description": "Unordered list style",
  "tags": ["bullet", "ul"],
  "function": function MD004(params, onError) {
    var style = String(params.config.style || "consistent");
    var expectedStyle = style;
    var nestingStyles = [];
    var _iterator = _createForOfIteratorHelper(flattenedLists()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var list = _step.value;
        if (list.unordered) {
          if (expectedStyle === "consistent") {
            expectedStyle = unorderedListStyleFor(list.items[0]);
          }
          var _iterator2 = _createForOfIteratorHelper(list.items),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var item = _step2.value;
              var itemStyle = unorderedListStyleFor(item);
              if (style === "sublist") {
                var nesting = list.nesting;
                if (!nestingStyles[nesting]) {
                  nestingStyles[nesting] = itemStyle === nestingStyles[nesting - 1] ? differentItemStyle[itemStyle] : itemStyle;
                }
                expectedStyle = nestingStyles[nesting];
              }
              if (!validStyles.includes(expectedStyle)) {
                expectedStyle = validStyles[0];
              }
              var range = null;
              var fixInfo = null;
              var match = item.line.match(listItemMarkerRe);
              if (match) {
                var column = match.index + 1;
                var length = match[0].length;
                range = [column, length];
                fixInfo = {
                  "editColumn": match[1].length + 1,
                  "deleteCount": 1,
                  "insertText": expectedStyleToMarker[expectedStyle]
                };
              }
              addErrorDetailIf(onError, item.lineNumber, expectedStyle, itemStyle, null, null, range, fixInfo);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
};

/***/ }),

/***/ "../lib/md005.js":
/*!***********************!*\
  !*** ../lib/md005.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addError = _require.addError,
  addErrorDetailIf = _require.addErrorDetailIf,
  indentFor = _require.indentFor,
  listItemMarkerRe = _require.listItemMarkerRe,
  orderedListItemMarkerRe = _require.orderedListItemMarkerRe,
  rangeFromRegExp = _require.rangeFromRegExp;
var _require2 = __webpack_require__(/*! ./cache */ "../lib/cache.js"),
  flattenedLists = _require2.flattenedLists;
module.exports = {
  "names": ["MD005", "list-indent"],
  "description": "Inconsistent indentation for list items at the same level",
  "tags": ["bullet", "ul", "indentation"],
  "function": function MD005(params, onError) {
    var _iterator = _createForOfIteratorHelper(flattenedLists()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var list = _step.value;
        var expectedIndent = list.indent;
        var expectedEnd = 0;
        var actualEnd = -1;
        var endMatching = false;
        var _iterator2 = _createForOfIteratorHelper(list.items),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var item = _step2.value;
            var line = item.line,
              lineNumber = item.lineNumber;
            var actualIndent = indentFor(item);
            var match = null;
            if (list.unordered) {
              addErrorDetailIf(onError, lineNumber, expectedIndent, actualIndent, null, null, rangeFromRegExp(line, listItemMarkerRe)
              // No fixInfo; MD007 handles this scenario better
              );
            } else if (match = orderedListItemMarkerRe.exec(line)) {
              actualEnd = match[0].length;
              expectedEnd = expectedEnd || actualEnd;
              var markerLength = match[1].length + 1;
              if (expectedIndent !== actualIndent || endMatching) {
                if (expectedEnd === actualEnd) {
                  endMatching = true;
                } else {
                  var detail = endMatching ? "Expected: (".concat(expectedEnd, "); Actual: (").concat(actualEnd, ")") : "Expected: ".concat(expectedIndent, "; Actual: ").concat(actualIndent);
                  var expected = endMatching ? expectedEnd - markerLength : expectedIndent;
                  var actual = endMatching ? actualEnd - markerLength : actualIndent;
                  addError(onError, lineNumber, detail, null, rangeFromRegExp(line, listItemMarkerRe), {
                    "editColumn": Math.min(actual, expected) + 1,
                    "deleteCount": Math.max(actual - expected, 0),
                    "insertText": "".padEnd(Math.max(expected - actual, 0))
                  });
                }
              }
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
};

/***/ }),

/***/ "../lib/md006.js":
/*!***********************!*\
  !*** ../lib/md006.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorDetailIf = _require.addErrorDetailIf,
  listItemMarkerRe = _require.listItemMarkerRe,
  rangeFromRegExp = _require.rangeFromRegExp;
var _require2 = __webpack_require__(/*! ./cache */ "../lib/cache.js"),
  flattenedLists = _require2.flattenedLists;
module.exports = {
  "names": ["MD006", "ul-start-left"],
  "description": "Consider starting bulleted lists at the beginning of the line",
  "tags": ["bullet", "ul", "indentation"],
  "function": function MD006(params, onError) {
    var _iterator = _createForOfIteratorHelper(flattenedLists()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var list = _step.value;
        if (list.unordered && !list.nesting && list.indent !== 0) {
          var _iterator2 = _createForOfIteratorHelper(list.items),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var item = _step2.value;
              var lineNumber = item.lineNumber,
                line = item.line;
              addErrorDetailIf(onError, lineNumber, 0, list.indent, null, null, rangeFromRegExp(line, listItemMarkerRe), {
                "deleteCount": line.length - line.trimStart().length
              });
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
};

/***/ }),

/***/ "../lib/md007.js":
/*!***********************!*\
  !*** ../lib/md007.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorDetailIf = _require.addErrorDetailIf,
  indentFor = _require.indentFor,
  listItemMarkerRe = _require.listItemMarkerRe;
var _require2 = __webpack_require__(/*! ./cache */ "../lib/cache.js"),
  flattenedLists = _require2.flattenedLists;
module.exports = {
  "names": ["MD007", "ul-indent"],
  "description": "Unordered list indentation",
  "tags": ["bullet", "ul", "indentation"],
  "function": function MD007(params, onError) {
    var indent = Number(params.config.indent || 2);
    var startIndented = !!params.config.start_indented;
    var startIndent = Number(params.config.start_indent || indent);
    var _iterator = _createForOfIteratorHelper(flattenedLists()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var list = _step.value;
        if (list.unordered && list.parentsUnordered) {
          var _iterator2 = _createForOfIteratorHelper(list.items),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var item = _step2.value;
              var lineNumber = item.lineNumber,
                line = item.line;
              var expectedIndent = (startIndented ? startIndent : 0) + list.nesting * indent;
              var actualIndent = indentFor(item);
              var range = null;
              var editColumn = 1;
              var match = line.match(listItemMarkerRe);
              if (match) {
                range = [1, match[0].length];
                editColumn += match[1].length - actualIndent;
              }
              addErrorDetailIf(onError, lineNumber, expectedIndent, actualIndent, null, null, range, {
                editColumn: editColumn,
                "deleteCount": actualIndent,
                "insertText": "".padEnd(expectedIndent)
              });
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
};

/***/ }),

/***/ "../lib/md009.js":
/*!***********************!*\
  !*** ../lib/md009.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addError = _require.addError,
  filterTokens = _require.filterTokens,
  forEachLine = _require.forEachLine,
  includesSorted = _require.includesSorted,
  numericSortAscending = _require.numericSortAscending;
var _require2 = __webpack_require__(/*! ./cache */ "../lib/cache.js"),
  lineMetadata = _require2.lineMetadata;
module.exports = {
  "names": ["MD009", "no-trailing-spaces"],
  "description": "Trailing spaces",
  "tags": ["whitespace"],
  "function": function MD009(params, onError) {
    var brSpaces = params.config.br_spaces;
    brSpaces = Number(brSpaces === undefined ? 2 : brSpaces);
    var listItemEmptyLines = !!params.config.list_item_empty_lines;
    var strict = !!params.config.strict;
    var listItemLineNumbers = [];
    if (listItemEmptyLines) {
      filterTokens(params, "list_item_open", function (token) {
        for (var i = token.map[0]; i < token.map[1]; i++) {
          listItemLineNumbers.push(i + 1);
        }
      });
      listItemLineNumbers.sort(numericSortAscending);
    }
    var paragraphLineNumbers = [];
    var codeInlineLineNumbers = [];
    if (strict) {
      filterTokens(params, "paragraph_open", function (token) {
        for (var i = token.map[0]; i < token.map[1] - 1; i++) {
          paragraphLineNumbers.push(i + 1);
        }
      });
      var addLineNumberRange = function addLineNumberRange(start, end) {
        for (var i = start; i < end; i++) {
          codeInlineLineNumbers.push(i);
        }
      };
      filterTokens(params, "inline", function (token) {
        var start = 0;
        var _iterator = _createForOfIteratorHelper(token.children),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var child = _step.value;
            if (start > 0) {
              addLineNumberRange(start, child.lineNumber);
              start = 0;
            }
            if (child.type === "code_inline") {
              start = child.lineNumber;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        if (start > 0) {
          addLineNumberRange(start, token.map[1]);
        }
      });
    }
    var expected = brSpaces < 2 ? 0 : brSpaces;
    forEachLine(lineMetadata(), function (line, lineIndex, inCode) {
      var lineNumber = lineIndex + 1;
      var trailingSpaces = line.length - line.trimEnd().length;
      if (trailingSpaces && !inCode && !includesSorted(listItemLineNumbers, lineNumber) && (expected !== trailingSpaces || strict && (!includesSorted(paragraphLineNumbers, lineNumber) || includesSorted(codeInlineLineNumbers, lineNumber)))) {
        var column = line.length - trailingSpaces + 1;
        addError(onError, lineNumber, "Expected: " + (expected === 0 ? "" : "0 or ") + expected + "; Actual: " + trailingSpaces, undefined, [column, trailingSpaces], {
          "editColumn": column,
          "deleteCount": trailingSpaces
        });
      }
    });
  }
};

/***/ }),

/***/ "../lib/md010.js":
/*!***********************!*\
  !*** ../lib/md010.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addError = _require.addError,
  filterTokens = _require.filterTokens,
  forEachLine = _require.forEachLine,
  withinAnyRange = _require.withinAnyRange;
var _require2 = __webpack_require__(/*! ./cache */ "../lib/cache.js"),
  codeBlockAndSpanRanges = _require2.codeBlockAndSpanRanges,
  lineMetadata = _require2.lineMetadata;
var tabRe = /\t+/g;
module.exports = {
  "names": ["MD010", "no-hard-tabs"],
  "description": "Hard tabs",
  "tags": ["whitespace", "hard_tab"],
  "function": function MD010(params, onError) {
    var codeBlocks = params.config.code_blocks;
    var includeCode = codeBlocks === undefined ? true : !!codeBlocks;
    var ignoreCodeLanguages = new Set((params.config.ignore_code_languages || []).map(function (language) {
      return language.toLowerCase();
    }));
    var spacesPerTab = params.config.spaces_per_tab;
    var spaceMultiplier = spacesPerTab === undefined ? 1 : Math.max(0, Number(spacesPerTab));
    var exclusions = includeCode ? [] : codeBlockAndSpanRanges();
    filterTokens(params, "fence", function (token) {
      var language = token.info.trim().toLowerCase();
      if (ignoreCodeLanguages.has(language)) {
        for (var i = token.map[0] + 1; i < token.map[1] - 1; i++) {
          exclusions.push([i, 0, params.lines[i].length]);
        }
      }
    });
    forEachLine(lineMetadata(), function (line, lineIndex, inCode) {
      if (includeCode || !inCode) {
        var match = null;
        while ((match = tabRe.exec(line)) !== null) {
          var _match = match,
            index = _match.index;
          var column = index + 1;
          var length = match[0].length;
          if (!withinAnyRange(exclusions, lineIndex, index, length)) {
            addError(onError, lineIndex + 1, "Column: " + column, null, [column, length], {
              "editColumn": column,
              "deleteCount": length,
              "insertText": "".padEnd(length * spaceMultiplier)
            });
          }
        }
      }
    });
  }
};

/***/ }),

/***/ "../lib/md011.js":
/*!***********************!*\
  !*** ../lib/md011.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addError = _require.addError,
  forEachLine = _require.forEachLine,
  withinAnyRange = _require.withinAnyRange;
var _require2 = __webpack_require__(/*! ./cache */ "../lib/cache.js"),
  codeBlockAndSpanRanges = _require2.codeBlockAndSpanRanges,
  lineMetadata = _require2.lineMetadata;
var reversedLinkRe = /(^|[^\\])\(([^()]+)\)\[([^\]^][^\]]*)\](?!\()/g;
module.exports = {
  "names": ["MD011", "no-reversed-links"],
  "description": "Reversed link syntax",
  "tags": ["links"],
  "function": function MD011(params, onError) {
    var exclusions = codeBlockAndSpanRanges();
    forEachLine(lineMetadata(), function (line, lineIndex, inCode, onFence) {
      if (!inCode && !onFence) {
        var match = null;
        while ((match = reversedLinkRe.exec(line)) !== null) {
          var _match = match,
            _match2 = _slicedToArray(_match, 4),
            reversedLink = _match2[0],
            preChar = _match2[1],
            linkText = _match2[2],
            linkDestination = _match2[3];
          var index = match.index + preChar.length;
          var length = match[0].length - preChar.length;
          if (!linkText.endsWith("\\") && !linkDestination.endsWith("\\") && !withinAnyRange(exclusions, lineIndex, index, length)) {
            addError(onError, lineIndex + 1, reversedLink.slice(preChar.length), undefined, [index + 1, length], {
              "editColumn": index + 1,
              "deleteCount": length,
              "insertText": "[".concat(linkText, "](").concat(linkDestination, ")")
            });
          }
        }
      }
    });
  }
};

/***/ }),

/***/ "../lib/md012.js":
/*!***********************!*\
  !*** ../lib/md012.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorDetailIf = _require.addErrorDetailIf,
  forEachLine = _require.forEachLine;
var _require2 = __webpack_require__(/*! ./cache */ "../lib/cache.js"),
  lineMetadata = _require2.lineMetadata;
module.exports = {
  "names": ["MD012", "no-multiple-blanks"],
  "description": "Multiple consecutive blank lines",
  "tags": ["whitespace", "blank_lines"],
  "function": function MD012(params, onError) {
    var maximum = Number(params.config.maximum || 1);
    var count = 0;
    forEachLine(lineMetadata(), function (line, lineIndex, inCode) {
      count = inCode || line.trim().length > 0 ? 0 : count + 1;
      if (maximum < count) {
        addErrorDetailIf(onError, lineIndex + 1, maximum, count, null, null, null, {
          "deleteCount": -1
        });
      }
    });
  }
};

/***/ }),

/***/ "../lib/md013.js":
/*!***********************!*\
  !*** ../lib/md013.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorDetailIf = _require.addErrorDetailIf,
  filterTokens = _require.filterTokens,
  forEachHeading = _require.forEachHeading,
  forEachLine = _require.forEachLine,
  includesSorted = _require.includesSorted;
var _require2 = __webpack_require__(/*! ./cache */ "../lib/cache.js"),
  lineMetadata = _require2.lineMetadata,
  referenceLinkImageData = _require2.referenceLinkImageData;
var longLineRePrefix = "^.{";
var longLineRePostfixRelaxed = "}.*\\s.*$";
var longLineRePostfixStrict = "}.+$";
var linkOrImageOnlyLineRe = /^[es]*(?:lT?L|I)[ES]*$/;
var sternModeRe = /^(?:[#>\s]*\s)?\S*$/;
var tokenTypeMap = {
  "em_open": "e",
  "em_close": "E",
  "image": "I",
  "link_open": "l",
  "link_close": "L",
  "strong_open": "s",
  "strong_close": "S",
  "text": "T"
};
module.exports = {
  "names": ["MD013", "line-length"],
  "description": "Line length",
  "tags": ["line_length"],
  "function": function MD013(params, onError) {
    var lineLength = Number(params.config.line_length || 80);
    var headingLineLength = Number(params.config.heading_line_length || lineLength);
    var codeLineLength = Number(params.config.code_block_line_length || lineLength);
    var strict = !!params.config.strict;
    var stern = !!params.config.stern;
    var longLineRePostfix = strict || stern ? longLineRePostfixStrict : longLineRePostfixRelaxed;
    var longLineRe = new RegExp(longLineRePrefix + lineLength + longLineRePostfix);
    var longHeadingLineRe = new RegExp(longLineRePrefix + headingLineLength + longLineRePostfix);
    var longCodeLineRe = new RegExp(longLineRePrefix + codeLineLength + longLineRePostfix);
    var codeBlocks = params.config.code_blocks;
    var includeCodeBlocks = codeBlocks === undefined ? true : !!codeBlocks;
    var tables = params.config.tables;
    var includeTables = tables === undefined ? true : !!tables;
    var headings = params.config.headings;
    if (headings === undefined) {
      headings = params.config.headers;
    }
    var includeHeadings = headings === undefined ? true : !!headings;
    var headingLineNumbers = [];
    forEachHeading(params, function (heading) {
      headingLineNumbers.push(heading.lineNumber);
    });
    var linkOnlyLineNumbers = [];
    filterTokens(params, "inline", function (token) {
      var childTokenTypes = "";
      var _iterator = _createForOfIteratorHelper(token.children),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var child = _step.value;
          if (child.type !== "text" || child.content !== "") {
            childTokenTypes += tokenTypeMap[child.type] || "x";
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (linkOrImageOnlyLineRe.test(childTokenTypes)) {
        linkOnlyLineNumbers.push(token.lineNumber);
      }
    });
    var _referenceLinkImageDa = referenceLinkImageData(),
      definitionLineIndices = _referenceLinkImageDa.definitionLineIndices;
    forEachLine(lineMetadata(), function (line, lineIndex, inCode, onFence, inTable) {
      var lineNumber = lineIndex + 1;
      var isHeading = includesSorted(headingLineNumbers, lineNumber);
      var length = inCode ? codeLineLength : isHeading ? headingLineLength : lineLength;
      var lengthRe = inCode ? longCodeLineRe : isHeading ? longHeadingLineRe : longLineRe;
      if ((includeCodeBlocks || !inCode) && (includeTables || !inTable) && (includeHeadings || !isHeading) && !includesSorted(definitionLineIndices, lineIndex) && (strict || !(stern && sternModeRe.test(line)) && !includesSorted(linkOnlyLineNumbers, lineNumber)) && lengthRe.test(line)) {
        addErrorDetailIf(onError, lineNumber, length, line.length, null, null, [length + 1, line.length - length]);
      }
    });
  }
};

/***/ }),

/***/ "../lib/md014.js":
/*!***********************!*\
  !*** ../lib/md014.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorContext = _require.addErrorContext,
  filterTokens = _require.filterTokens;
var dollarCommandRe = /^(\s*)(\$\s+)/;
module.exports = {
  "names": ["MD014", "commands-show-output"],
  "description": "Dollar signs used before commands without showing output",
  "tags": ["code"],
  "function": function MD014(params, onError) {
    for (var _i = 0, _arr = ["code_block", "fence"]; _i < _arr.length; _i++) {
      var type = _arr[_i];
      filterTokens(params, type, function (token) {
        var margin = token.type === "fence" ? 1 : 0;
        var dollarInstances = [];
        var allDollars = true;
        for (var i = token.map[0] + margin; i < token.map[1] - margin; i++) {
          var line = params.lines[i];
          var lineTrim = line.trim();
          if (lineTrim) {
            var match = dollarCommandRe.exec(line);
            if (match) {
              var column = match[1].length + 1;
              var length = match[2].length;
              dollarInstances.push([i, lineTrim, column, length]);
            } else {
              allDollars = false;
            }
          }
        }
        if (allDollars) {
          var _iterator = _createForOfIteratorHelper(dollarInstances),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var instance = _step.value;
              var _instance = _slicedToArray(instance, 4),
                _i2 = _instance[0],
                _lineTrim = _instance[1],
                _column = _instance[2],
                _length = _instance[3];
              addErrorContext(onError, _i2 + 1, _lineTrim, null, null, [_column, _length], {
                "editColumn": _column,
                "deleteCount": _length
              });
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      });
    }
  }
};

/***/ }),

/***/ "../lib/md018.js":
/*!***********************!*\
  !*** ../lib/md018.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorContext = _require.addErrorContext,
  forEachLine = _require.forEachLine;
var _require2 = __webpack_require__(/*! ./cache */ "../lib/cache.js"),
  lineMetadata = _require2.lineMetadata;
module.exports = {
  "names": ["MD018", "no-missing-space-atx"],
  "description": "No space after hash on atx style heading",
  "tags": ["headings", "headers", "atx", "spaces"],
  "function": function MD018(params, onError) {
    forEachLine(lineMetadata(), function (line, lineIndex, inCode) {
      if (!inCode && /^#+[^# \t]/.test(line) && !/#\s*$/.test(line) && !line.startsWith("#️⃣")) {
        var hashCount = /^#+/.exec(line)[0].length;
        addErrorContext(onError, lineIndex + 1, line.trim(), null, null, [1, hashCount + 1], {
          "editColumn": hashCount + 1,
          "insertText": " "
        });
      }
    });
  }
};

/***/ }),

/***/ "../lib/md019.js":
/*!***********************!*\
  !*** ../lib/md019.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorContext = _require.addErrorContext,
  filterTokens = _require.filterTokens,
  headingStyleFor = _require.headingStyleFor;
module.exports = {
  "names": ["MD019", "no-multiple-space-atx"],
  "description": "Multiple spaces after hash on atx style heading",
  "tags": ["headings", "headers", "atx", "spaces"],
  "function": function MD019(params, onError) {
    filterTokens(params, "heading_open", function (token) {
      if (headingStyleFor(token) === "atx") {
        var line = token.line,
          lineNumber = token.lineNumber;
        var match = /^(#+)([ \t]{2,})\S/.exec(line);
        if (match) {
          var _match = _slicedToArray(match, 3),
            hashLength = _match[1]["length"],
            spacesLength = _match[2]["length"];
          addErrorContext(onError, lineNumber, line.trim(), null, null, [1, hashLength + spacesLength + 1], {
            "editColumn": hashLength + 1,
            "deleteCount": spacesLength - 1
          });
        }
      }
    });
  }
};

/***/ }),

/***/ "../lib/md020.js":
/*!***********************!*\
  !*** ../lib/md020.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorContext = _require.addErrorContext,
  forEachLine = _require.forEachLine;
var _require2 = __webpack_require__(/*! ./cache */ "../lib/cache.js"),
  lineMetadata = _require2.lineMetadata;
module.exports = {
  "names": ["MD020", "no-missing-space-closed-atx"],
  "description": "No space inside hashes on closed atx style heading",
  "tags": ["headings", "headers", "atx_closed", "spaces"],
  "function": function MD020(params, onError) {
    forEachLine(lineMetadata(), function (line, lineIndex, inCode) {
      if (!inCode) {
        var match = /^(#+)([ \t]*)([^#]*?[^#\\])([ \t]*)((?:\\#)?)(#+)(\s*)$/.exec(line);
        if (match) {
          var _match = _slicedToArray(match, 8),
            leftHash = _match[1],
            leftSpaceLength = _match[2]["length"],
            content = _match[3],
            rightSpaceLength = _match[4]["length"],
            rightEscape = _match[5],
            rightHash = _match[6],
            trailSpaceLength = _match[7]["length"];
          var leftHashLength = leftHash.length;
          var rightHashLength = rightHash.length;
          var left = !leftSpaceLength;
          var right = !rightSpaceLength || rightEscape;
          var rightEscapeReplacement = rightEscape ? "".concat(rightEscape, " ") : "";
          if (left || right) {
            var range = left ? [1, leftHashLength + 1] : [line.length - trailSpaceLength - rightHashLength, rightHashLength + 1];
            addErrorContext(onError, lineIndex + 1, line.trim(), left, right, range, {
              "editColumn": 1,
              "deleteCount": line.length,
              "insertText": "".concat(leftHash, " ").concat(content, " ").concat(rightEscapeReplacement).concat(rightHash)
            });
          }
        }
      }
    });
  }
};

/***/ }),

/***/ "../lib/md021.js":
/*!***********************!*\
  !*** ../lib/md021.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorContext = _require.addErrorContext,
  filterTokens = _require.filterTokens,
  headingStyleFor = _require.headingStyleFor;
var closedAtxRe = /^(#+)([ \t]+)([^ \t]|[^ \t].*[^ \t])([ \t]+)(#+)(\s*)$/;
module.exports = {
  "names": ["MD021", "no-multiple-space-closed-atx"],
  "description": "Multiple spaces inside hashes on closed atx style heading",
  "tags": ["headings", "headers", "atx_closed", "spaces"],
  "function": function MD021(params, onError) {
    filterTokens(params, "heading_open", function (token) {
      if (headingStyleFor(token) === "atx_closed") {
        var line = token.line,
          lineNumber = token.lineNumber;
        var match = closedAtxRe.exec(line);
        if (match) {
          var _match = _slicedToArray(match, 7),
            leftHash = _match[1],
            leftSpaceLength = _match[2]["length"],
            content = _match[3],
            rightSpaceLength = _match[4]["length"],
            rightHash = _match[5],
            trailSpaceLength = _match[6]["length"];
          var left = leftSpaceLength > 1;
          var right = rightSpaceLength > 1;
          if (left || right) {
            var length = line.length;
            var leftHashLength = leftHash.length;
            var rightHashLength = rightHash.length;
            var range = left ? [1, leftHashLength + leftSpaceLength + 1] : [length - trailSpaceLength - rightHashLength - rightSpaceLength, rightSpaceLength + rightHashLength + 1];
            addErrorContext(onError, lineNumber, line.trim(), left, right, range, {
              "editColumn": 1,
              "deleteCount": length,
              "insertText": "".concat(leftHash, " ").concat(content, " ").concat(rightHash)
            });
          }
        }
      }
    });
  }
};

/***/ }),

/***/ "../lib/md022.js":
/*!***********************!*\
  !*** ../lib/md022.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorDetailIf = _require.addErrorDetailIf,
  blockquotePrefixRe = _require.blockquotePrefixRe,
  filterTokens = _require.filterTokens,
  isBlankLine = _require.isBlankLine;
var getBlockQuote = function getBlockQuote(str, count) {
  return (str || "").match(blockquotePrefixRe)[0].trimEnd()
  // eslint-disable-next-line unicorn/prefer-spread
  .concat("\n").repeat(count);
};
module.exports = {
  "names": ["MD022", "blanks-around-headings", "blanks-around-headers"],
  "description": "Headings should be surrounded by blank lines",
  "tags": ["headings", "headers", "blank_lines"],
  "function": function MD022(params, onError) {
    var linesAbove = params.config.lines_above;
    linesAbove = Number(linesAbove === undefined ? 1 : linesAbove);
    var linesBelow = params.config.lines_below;
    linesBelow = Number(linesBelow === undefined ? 1 : linesBelow);
    var lines = params.lines;
    filterTokens(params, "heading_open", function (token) {
      var _token$map = _slicedToArray(token.map, 2),
        topIndex = _token$map[0],
        nextIndex = _token$map[1];
      var actualAbove = 0;
      for (var i = 0; i < linesAbove; i++) {
        if (isBlankLine(lines[topIndex - i - 1])) {
          actualAbove++;
        }
      }
      addErrorDetailIf(onError, topIndex + 1, linesAbove, actualAbove, "Above", lines[topIndex].trim(), null, {
        "insertText": getBlockQuote(lines[topIndex - 1], linesAbove - actualAbove)
      });
      var actualBelow = 0;
      for (var _i2 = 0; _i2 < linesBelow; _i2++) {
        if (isBlankLine(lines[nextIndex + _i2])) {
          actualBelow++;
        }
      }
      addErrorDetailIf(onError, topIndex + 1, linesBelow, actualBelow, "Below", lines[topIndex].trim(), null, {
        "lineNumber": nextIndex + 1,
        "insertText": getBlockQuote(lines[nextIndex], linesBelow - actualBelow)
      });
    });
  }
};

/***/ }),

/***/ "../lib/md023.js":
/*!***********************!*\
  !*** ../lib/md023.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorContext = _require.addErrorContext,
  filterTokens = _require.filterTokens;
var spaceBeforeHeadingRe = /^(\s+|[>\s]+\s\s)[^>\s]/;
module.exports = {
  "names": ["MD023", "heading-start-left", "header-start-left"],
  "description": "Headings must start at the beginning of the line",
  "tags": ["headings", "headers", "spaces"],
  "function": function MD023(params, onError) {
    filterTokens(params, "heading_open", function forToken(token) {
      var lineNumber = token.lineNumber,
        line = token.line;
      var match = line.match(spaceBeforeHeadingRe);
      if (match) {
        var _match = _slicedToArray(match, 2),
          prefixAndFirstChar = _match[0],
          prefix = _match[1];
        var deleteCount = prefix.length;
        var prefixLengthNoSpace = prefix.trimEnd().length;
        if (prefixLengthNoSpace) {
          deleteCount -= prefixLengthNoSpace - 1;
        }
        addErrorContext(onError, lineNumber, line, null, null, [1, prefixAndFirstChar.length], {
          "editColumn": prefixLengthNoSpace + 1,
          "deleteCount": deleteCount
        });
      }
    });
  }
};

/***/ }),

/***/ "../lib/md024.js":
/*!***********************!*\
  !*** ../lib/md024.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorContext = _require.addErrorContext,
  forEachHeading = _require.forEachHeading;
module.exports = {
  "names": ["MD024", "no-duplicate-heading", "no-duplicate-header"],
  "description": "Multiple headings with the same content",
  "tags": ["headings", "headers"],
  "function": function MD024(params, onError) {
    var siblingsOnly = !!params.config.siblings_only || !!params.config.allow_different_nesting || false;
    var knownContents = [null, []];
    var lastLevel = 1;
    var knownContent = knownContents[lastLevel];
    forEachHeading(params, function (heading, content) {
      if (siblingsOnly) {
        var newLevel = heading.tag.slice(1);
        while (lastLevel < newLevel) {
          lastLevel++;
          knownContents[lastLevel] = [];
        }
        while (lastLevel > newLevel) {
          knownContents[lastLevel] = [];
          lastLevel--;
        }
        knownContent = knownContents[newLevel];
      }
      if (knownContent.includes(content)) {
        addErrorContext(onError, heading.lineNumber, heading.line.trim());
      } else {
        knownContent.push(content);
      }
    });
  }
};

/***/ }),

/***/ "../lib/md025.js":
/*!***********************!*\
  !*** ../lib/md025.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorContext = _require.addErrorContext,
  filterTokens = _require.filterTokens,
  frontMatterHasTitle = _require.frontMatterHasTitle;
module.exports = {
  "names": ["MD025", "single-title", "single-h1"],
  "description": "Multiple top-level headings in the same document",
  "tags": ["headings", "headers"],
  "function": function MD025(params, onError) {
    var level = Number(params.config.level || 1);
    var tag = "h" + level;
    var foundFrontMatterTitle = frontMatterHasTitle(params.frontMatterLines, params.config.front_matter_title);
    var hasTopLevelHeading = false;
    filterTokens(params, "heading_open", function forToken(token) {
      if (token.tag === tag) {
        if (hasTopLevelHeading || foundFrontMatterTitle) {
          addErrorContext(onError, token.lineNumber, token.line.trim());
        } else if (token.lineNumber === 1) {
          hasTopLevelHeading = true;
        }
      }
    });
  }
};

/***/ }),

/***/ "../lib/md026.js":
/*!***********************!*\
  !*** ../lib/md026.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addError = _require.addError,
  allPunctuationNoQuestion = _require.allPunctuationNoQuestion,
  escapeForRegExp = _require.escapeForRegExp,
  forEachHeading = _require.forEachHeading;
var endOfLineHtmlEntityRe = /&#?[\da-zA-Z]+;$/;
module.exports = {
  "names": ["MD026", "no-trailing-punctuation"],
  "description": "Trailing punctuation in heading",
  "tags": ["headings", "headers"],
  "function": function MD026(params, onError) {
    var punctuation = params.config.punctuation;
    punctuation = String(punctuation === undefined ? allPunctuationNoQuestion : punctuation);
    var trailingPunctuationRe = new RegExp("\\s*[" + escapeForRegExp(punctuation) + "]+$");
    forEachHeading(params, function (heading) {
      var line = heading.line,
        lineNumber = heading.lineNumber;
      var trimmedLine = line.replace(/([^\s#])[\s#]+$/, "$1");
      var match = trailingPunctuationRe.exec(trimmedLine);
      if (match && !endOfLineHtmlEntityRe.test(trimmedLine)) {
        var fullMatch = match[0];
        var column = match.index + 1;
        var length = fullMatch.length;
        addError(onError, lineNumber, "Punctuation: '".concat(fullMatch, "'"), null, [column, length], {
          "editColumn": column,
          "deleteCount": length
        });
      }
    });
  }
};

/***/ }),

/***/ "../lib/md027.js":
/*!***********************!*\
  !*** ../lib/md027.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorContext = _require.addErrorContext,
  newLineRe = _require.newLineRe;
var spaceAfterBlockQuoteRe = /^((?:\s*>)+)(\s{2,})\S/;
module.exports = {
  "names": ["MD027", "no-multiple-space-blockquote"],
  "description": "Multiple spaces after blockquote symbol",
  "tags": ["blockquote", "whitespace", "indentation"],
  "function": function MD027(params, onError) {
    var blockquoteNesting = 0;
    var listItemNesting = 0;
    var _iterator = _createForOfIteratorHelper(params.tokens),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var token = _step.value;
        var content = token.content,
          lineNumber = token.lineNumber,
          type = token.type;
        if (type === "blockquote_open") {
          blockquoteNesting++;
        } else if (type === "blockquote_close") {
          blockquoteNesting--;
        } else if (type === "list_item_open") {
          listItemNesting++;
        } else if (type === "list_item_close") {
          listItemNesting--;
        } else if (type === "inline" && blockquoteNesting) {
          var lineCount = content.split(newLineRe).length;
          for (var i = 0; i < lineCount; i++) {
            var line = params.lines[lineNumber + i - 1];
            var match = line.match(spaceAfterBlockQuoteRe);
            if (match) {
              var _match = _slicedToArray(match, 3),
                fullMatch = _match[0],
                blockquoteLength = _match[1]["length"],
                spaceLength = _match[2]["length"];
              if (!listItemNesting || fullMatch[fullMatch.length - 1] === ">") {
                addErrorContext(onError, lineNumber + i, line, null, null, [1, fullMatch.length], {
                  "editColumn": blockquoteLength + 1,
                  "deleteCount": spaceLength - 1
                });
              }
            }
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
};

/***/ }),

/***/ "../lib/md028.js":
/*!***********************!*\
  !*** ../lib/md028.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addError = _require.addError;
module.exports = {
  "names": ["MD028", "no-blanks-blockquote"],
  "description": "Blank line inside blockquote",
  "tags": ["blockquote", "whitespace"],
  "function": function MD028(params, onError) {
    var prevToken = {};
    var prevLineNumber = null;
    var _iterator = _createForOfIteratorHelper(params.tokens),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var token = _step.value;
        if (token.type === "blockquote_open" && prevToken.type === "blockquote_close") {
          for (var lineNumber = prevLineNumber; lineNumber < token.lineNumber; lineNumber++) {
            addError(onError, lineNumber);
          }
        }
        prevToken = token;
        if (token.type === "blockquote_open") {
          prevLineNumber = token.map[1] + 1;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
};

/***/ }),

/***/ "../lib/md029.js":
/*!***********************!*\
  !*** ../lib/md029.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorDetailIf = _require.addErrorDetailIf,
  listItemMarkerRe = _require.listItemMarkerRe,
  orderedListItemMarkerRe = _require.orderedListItemMarkerRe,
  rangeFromRegExp = _require.rangeFromRegExp;
var _require2 = __webpack_require__(/*! ./cache */ "../lib/cache.js"),
  flattenedLists = _require2.flattenedLists;
var listStyleExamples = {
  "one": "1/1/1",
  "ordered": "1/2/3",
  "zero": "0/0/0"
};
module.exports = {
  "names": ["MD029", "ol-prefix"],
  "description": "Ordered list item prefix",
  "tags": ["ol"],
  "function": function MD029(params, onError) {
    var style = String(params.config.style || "one_or_ordered");
    var filteredLists = flattenedLists().filter(function (list) {
      return !list.unordered;
    });
    var _iterator = _createForOfIteratorHelper(filteredLists),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var list = _step.value;
        var items = list.items;
        var current = 1;
        var incrementing = false;
        // Check for incrementing number pattern 1/2/3 or 0/1/2
        if (items.length >= 2) {
          var first = orderedListItemMarkerRe.exec(items[0].line);
          var second = orderedListItemMarkerRe.exec(items[1].line);
          if (first && second) {
            var _first = _slicedToArray(first, 2),
              firstNumber = _first[1];
            var _second = _slicedToArray(second, 2),
              secondNumber = _second[1];
            if (secondNumber !== "1" || firstNumber === "0") {
              incrementing = true;
              if (firstNumber === "0") {
                current = 0;
              }
            }
          }
        }
        // Determine effective style
        var listStyle = style;
        if (listStyle === "one_or_ordered") {
          listStyle = incrementing ? "ordered" : "one";
        }
        // Force expected value for 0/0/0 and 1/1/1 patterns
        if (listStyle === "zero") {
          current = 0;
        } else if (listStyle === "one") {
          current = 1;
        }
        // Validate each list item marker
        var _iterator2 = _createForOfIteratorHelper(items),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var item = _step2.value;
            var match = orderedListItemMarkerRe.exec(item.line);
            if (match) {
              addErrorDetailIf(onError, item.lineNumber, String(current), match[1], "Style: " + listStyleExamples[listStyle], null, rangeFromRegExp(item.line, listItemMarkerRe));
              if (listStyle === "ordered") {
                current++;
              }
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
};

/***/ }),

/***/ "../lib/md030.js":
/*!***********************!*\
  !*** ../lib/md030.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorDetailIf = _require.addErrorDetailIf;
var _require2 = __webpack_require__(/*! ./cache */ "../lib/cache.js"),
  flattenedLists = _require2.flattenedLists;
module.exports = {
  "names": ["MD030", "list-marker-space"],
  "description": "Spaces after list markers",
  "tags": ["ol", "ul", "whitespace"],
  "function": function MD030(params, onError) {
    var ulSingle = Number(params.config.ul_single || 1);
    var olSingle = Number(params.config.ol_single || 1);
    var ulMulti = Number(params.config.ul_multi || 1);
    var olMulti = Number(params.config.ol_multi || 1);
    var _iterator = _createForOfIteratorHelper(flattenedLists()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var list = _step.value;
        var lineCount = list.lastLineIndex - list.open.map[0];
        var allSingle = lineCount === list.items.length;
        var expectedSpaces = list.unordered ? allSingle ? ulSingle : ulMulti : allSingle ? olSingle : olMulti;
        var _iterator2 = _createForOfIteratorHelper(list.items),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var item = _step2.value;
            var line = item.line,
              lineNumber = item.lineNumber;
            var match = /^[\s>]*\S+(\s*)/.exec(line);
            var _match = _slicedToArray(match, 2),
              matchLength = _match[0]["length"],
              actualSpaces = _match[1]["length"];
            if (matchLength < line.length) {
              var fixInfo = null;
              if (expectedSpaces !== actualSpaces) {
                fixInfo = {
                  "editColumn": matchLength - actualSpaces + 1,
                  "deleteCount": actualSpaces,
                  "insertText": "".padEnd(expectedSpaces)
                };
              }
              addErrorDetailIf(onError, lineNumber, expectedSpaces, actualSpaces, null, null, [1, matchLength], fixInfo);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
};

/***/ }),

/***/ "../lib/md031.js":
/*!***********************!*\
  !*** ../lib/md031.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorContext = _require.addErrorContext,
  forEachLine = _require.forEachLine,
  isBlankLine = _require.isBlankLine;
var _require2 = __webpack_require__(/*! ./cache */ "../lib/cache.js"),
  lineMetadata = _require2.lineMetadata;
var codeFencePrefixRe = /^(.*?)[`~]/;
module.exports = {
  "names": ["MD031", "blanks-around-fences"],
  "description": "Fenced code blocks should be surrounded by blank lines",
  "tags": ["code", "blank_lines"],
  "function": function MD031(params, onError) {
    var listItems = params.config.list_items;
    var includeListItems = listItems === undefined ? true : !!listItems;
    var lines = params.lines;
    forEachLine(lineMetadata(), function (line, i, inCode, onFence, inTable, inItem) {
      var onTopFence = onFence > 0;
      var onBottomFence = onFence < 0;
      if ((includeListItems || !inItem) && (onTopFence && !isBlankLine(lines[i - 1]) || onBottomFence && !isBlankLine(lines[i + 1]))) {
        var _ref = line.match(codeFencePrefixRe) || [],
          _ref2 = _slicedToArray(_ref, 2),
          prefix = _ref2[1];
        var fixInfo = prefix === undefined ? null : {
          "lineNumber": i + (onTopFence ? 1 : 2),
          "insertText": "".concat(prefix.replace(/[^>]/g, " ").trim(), "\n")
        };
        addErrorContext(onError, i + 1, lines[i].trim(), null, null, null, fixInfo);
      }
    });
  }
};

/***/ }),

/***/ "../lib/md032.js":
/*!***********************!*\
  !*** ../lib/md032.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorContext = _require.addErrorContext,
  blockquotePrefixRe = _require.blockquotePrefixRe,
  isBlankLine = _require.isBlankLine;
var _require2 = __webpack_require__(/*! ./cache */ "../lib/cache.js"),
  flattenedLists = _require2.flattenedLists;
module.exports = {
  "names": ["MD032", "blanks-around-lists"],
  "description": "Lists should be surrounded by blank lines",
  "tags": ["bullet", "ul", "ol", "blank_lines"],
  "function": function MD032(params, onError) {
    var lines = params.lines;
    var filteredLists = flattenedLists().filter(function (list) {
      return !list.nesting;
    });
    var _iterator = _createForOfIteratorHelper(filteredLists),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var list = _step.value;
        var firstIndex = list.open.map[0];
        if (!isBlankLine(lines[firstIndex - 1])) {
          var line = lines[firstIndex];
          var quotePrefix = line.match(blockquotePrefixRe)[0].trimEnd();
          addErrorContext(onError, firstIndex + 1, line.trim(), null, null, null, {
            "insertText": "".concat(quotePrefix, "\n")
          });
        }
        var lastIndex = list.lastLineIndex - 1;
        if (!isBlankLine(lines[lastIndex + 1])) {
          var _line = lines[lastIndex];
          var _quotePrefix = _line.match(blockquotePrefixRe)[0].trimEnd();
          addErrorContext(onError, lastIndex + 1, _line.trim(), null, null, null, {
            "lineNumber": lastIndex + 2,
            "insertText": "".concat(_quotePrefix, "\n")
          });
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
};

/***/ }),

/***/ "../lib/md033.js":
/*!***********************!*\
  !*** ../lib/md033.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addError = _require.addError;
var _require2 = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs"),
  filterByTypes = _require2.filterByTypes,
  getHtmlTagInfo = _require2.getHtmlTagInfo,
  parse = _require2.parse;
var nextLinesRe = /[\r\n][\s\S]*$/;
module.exports = {
  "names": ["MD033", "no-inline-html"],
  "description": "Inline HTML",
  "tags": ["html"],
  "function": function MD033(params, onError) {
    var allowedElements = params.config.allowed_elements;
    allowedElements = Array.isArray(allowedElements) ? allowedElements : [];
    allowedElements = allowedElements.map(function (element) {
      return element.toLowerCase();
    });
    var pending = [[0, params.parsers.micromark.tokens]];
    var current = null;
    while (current = pending.shift()) {
      var _current = current,
        _current2 = _slicedToArray(_current, 2),
        offset = _current2[0],
        tokens = _current2[1];
      var _iterator = _createForOfIteratorHelper(filterByTypes(tokens, ["htmlFlow", "htmlText"])),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var token = _step.value;
          if (token.type === "htmlText") {
            var htmlTagInfo = getHtmlTagInfo(token);
            if (htmlTagInfo && !htmlTagInfo.close && !allowedElements.includes(htmlTagInfo.name.toLowerCase())) {
              var range = [token.startColumn, token.text.replace(nextLinesRe, "").length];
              addError(onError, token.startLine + offset, "Element: " + htmlTagInfo.name, undefined, range);
            }
          } else {
            // token.type === "htmlFlow"
            // Re-parse without "htmlFlow" to get only "htmlText" tokens
            var options = {
              "extensions": [{
                "disable": {
                  "null": ["codeIndented", "htmlFlow"]
                }
              }]
            };
            // Use lines instead of token.text for accurate columns
            var lines = params.lines.slice(token.startLine - 1, token.endLine).join("\n");
            var flowTokens = parse(lines, options);
            pending.push([token.startLine - 1, flowTokens]);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }
};

/***/ }),

/***/ "../lib/md034.js":
/*!***********************!*\
  !*** ../lib/md034.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorContext = _require.addErrorContext;
var _require2 = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs"),
  filterByPredicate = _require2.filterByPredicate,
  getHtmlTagInfo = _require2.getHtmlTagInfo;
module.exports = {
  "names": ["MD034", "no-bare-urls"],
  "description": "Bare URL used",
  "tags": ["links", "url"],
  "function": function MD034(params, onError) {
    var literalAutolinks = filterByPredicate(params.parsers.micromark.tokens, function (token) {
      return token.type === "literalAutolink";
    }, function (tokens) {
      var result = [];
      for (var i = 0; i < tokens.length; i++) {
        var openToken = tokens[i];
        var openTagInfo = getHtmlTagInfo(openToken);
        if (openTagInfo && !openTagInfo.close) {
          var count = 1;
          for (var j = i + 1; j < tokens.length; j++) {
            var closeToken = tokens[j];
            var closeTagInfo = getHtmlTagInfo(closeToken);
            if (closeTagInfo && openTagInfo.name === closeTagInfo.name) {
              if (closeTagInfo.close) {
                count--;
                if (count === 0) {
                  i = j;
                  break;
                }
              } else {
                count++;
              }
            }
          }
        } else {
          result.push(openToken);
        }
      }
      return result;
    });
    var _iterator = _createForOfIteratorHelper(literalAutolinks),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var token = _step.value;
        var range = [token.startColumn, token.endColumn - token.startColumn];
        var fixInfo = {
          "editColumn": range[0],
          "deleteCount": range[1],
          "insertText": "<".concat(token.text, ">")
        };
        addErrorContext(onError, token.startLine, token.text, null, null, range, fixInfo);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
};

/***/ }),

/***/ "../lib/md035.js":
/*!***********************!*\
  !*** ../lib/md035.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorDetailIf = _require.addErrorDetailIf,
  filterTokens = _require.filterTokens;
module.exports = {
  "names": ["MD035", "hr-style"],
  "description": "Horizontal rule style",
  "tags": ["hr"],
  "function": function MD035(params, onError) {
    var style = String(params.config.style || "consistent").trim();
    filterTokens(params, "hr", function (token) {
      var line = token.line,
        lineNumber = token.lineNumber;
      var markup = token.markup;
      var match = line.match(/[_*\-\s]+$/);
      if (match) {
        markup = match[0].trim();
      }
      if (style === "consistent") {
        style = markup;
      }
      addErrorDetailIf(onError, lineNumber, style, markup);
    });
  }
};

/***/ }),

/***/ "../lib/md036.js":
/*!***********************!*\
  !*** ../lib/md036.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorContext = _require.addErrorContext,
  allPunctuation = _require.allPunctuation;
module.exports = {
  "names": ["MD036", "no-emphasis-as-heading", "no-emphasis-as-header"],
  "description": "Emphasis used instead of a heading",
  "tags": ["headings", "headers", "emphasis"],
  "function": function MD036(params, onError) {
    var punctuation = params.config.punctuation;
    punctuation = String(punctuation === undefined ? allPunctuation : punctuation);
    var re = new RegExp("[" + punctuation + "]$");
    // eslint-disable-next-line jsdoc/require-jsdoc
    function base(token) {
      if (token.type === "paragraph_open") {
        return function inParagraph(t) {
          // Always paragraph_open/inline/paragraph_close,
          var children = t.children.filter(function notEmptyText(child) {
            return child.type !== "text" || child.content !== "";
          });
          if (children.length === 3 && (children[0].type === "strong_open" || children[0].type === "em_open") && children[1].type === "text" && !re.test(children[1].content)) {
            addErrorContext(onError, t.lineNumber, children[1].content);
          }
          return base;
        };
      } else if (token.type === "blockquote_open") {
        return function inBlockquote(t) {
          if (t.type !== "blockquote_close") {
            return inBlockquote;
          }
          return base;
        };
      } else if (token.type === "list_item_open") {
        return function inListItem(t) {
          if (t.type !== "list_item_close") {
            return inListItem;
          }
          return base;
        };
      }
      return base;
    }
    var state = base;
    var _iterator = _createForOfIteratorHelper(params.tokens),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var token = _step.value;
        state = state(token);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
};

/***/ }),

/***/ "../lib/md037.js":
/*!***********************!*\
  !*** ../lib/md037.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorContext = _require.addErrorContext,
  emphasisMarkersInContent = _require.emphasisMarkersInContent,
  forEachLine = _require.forEachLine,
  isBlankLine = _require.isBlankLine,
  withinAnyRange = _require.withinAnyRange;
var _require2 = __webpack_require__(/*! ./cache */ "../lib/cache.js"),
  htmlElementRanges = _require2.htmlElementRanges,
  lineMetadata = _require2.lineMetadata;
var emphasisRe = /(^|[^\\]|\\\\)(?:(\*{1,3})|(_{1,3}))/g;
var embeddedUnderscoreRe = /([A-Za-z\d])_([A-Za-z\d])/g;
var asteriskListItemMarkerRe = /^([\s>]*)\*(\s+)/;
var leftSpaceRe = /^\s+/;
var rightSpaceRe = /\s+$/;
var tablePipeRe = /\|/;
module.exports = {
  "names": ["MD037", "no-space-in-emphasis"],
  "description": "Spaces inside emphasis markers",
  "tags": ["whitespace", "emphasis"],
  "function": function MD037(params, onError) {
    var exclusions = htmlElementRanges();
    // eslint-disable-next-line init-declarations
    var effectiveEmphasisLength,
      emphasisIndex,
      emphasisKind,
      emphasisLength,
      pendingError = null;
    // eslint-disable-next-line jsdoc/require-jsdoc
    function resetRunTracking() {
      emphasisIndex = -1;
      emphasisLength = 0;
      emphasisKind = "";
      effectiveEmphasisLength = 0;
      pendingError = null;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    function handleRunEnd(line, lineIndex, contextLength, match, matchIndex, inTable) {
      // Close current run
      var content = line.substring(emphasisIndex, matchIndex);
      if (!emphasisLength) {
        content = content.trimStart();
      }
      if (!match) {
        content = content.trimEnd();
      }
      var leftSpace = leftSpaceRe.test(content);
      var rightSpace = rightSpaceRe.test(content);
      if ((leftSpace || rightSpace) && (!inTable || !tablePipeRe.test(content))) {
        // Report the violation
        var contextStart = emphasisIndex - emphasisLength;
        var contextEnd = matchIndex + contextLength;
        var column = contextStart + 1;
        var length = contextEnd - contextStart;
        if (!withinAnyRange(exclusions, lineIndex, column, length)) {
          var context = line.substring(contextStart, contextEnd);
          var leftMarker = line.substring(contextStart, emphasisIndex);
          var rightMarker = match ? match[2] || match[3] : "";
          var fixedText = "".concat(leftMarker).concat(content.trim()).concat(rightMarker);
          return [onError, lineIndex + 1, context, leftSpace, rightSpace, [column, length], {
            "editColumn": column,
            "deleteCount": length,
            "insertText": fixedText
          }];
        }
      }
      return null;
    }
    // Initialize
    var ignoreMarkersByLine = emphasisMarkersInContent(params);
    resetRunTracking();
    forEachLine(lineMetadata(), function (line, lineIndex, inCode, onFence, inTable, inItem, onBreak, inMath) {
      var onItemStart = inItem === 1;
      if (inCode || onFence || inTable || onBreak || onItemStart || isBlankLine(line)) {
        // Emphasis resets when leaving a block
        resetRunTracking();
      }
      if (inCode || onFence || onBreak || inMath) {
        // Emphasis has no meaning here
        return;
      }
      var patchedLine = line.replace(embeddedUnderscoreRe, "$1 $2");
      if (onItemStart) {
        // Trim overlapping '*' list item marker
        patchedLine = patchedLine.replace(asteriskListItemMarkerRe, "$1 $2");
      }
      var match = null;
      // Match all emphasis-looking runs in the line...
      while (match = emphasisRe.exec(patchedLine)) {
        var ignoreMarkersForLine = ignoreMarkersByLine[lineIndex];
        var matchIndex = match.index + match[1].length;
        if (ignoreMarkersForLine.includes(matchIndex)) {
          // Ignore emphasis markers inside code spans and links
          continue;
        }
        var matchLength = match[0].length - match[1].length;
        var matchKind = (match[2] || match[3])[0];
        if (emphasisIndex === -1) {
          // New run
          emphasisIndex = matchIndex + matchLength;
          emphasisLength = matchLength;
          emphasisKind = matchKind;
          effectiveEmphasisLength = matchLength;
        } else if (matchKind === emphasisKind) {
          // Matching emphasis markers
          if (matchLength === effectiveEmphasisLength) {
            // Ending an existing run, report any pending error
            if (pendingError) {
              // @ts-ignore
              addErrorContext.apply(void 0, _toConsumableArray(pendingError));
              pendingError = null;
            }
            var error = handleRunEnd(line, lineIndex, effectiveEmphasisLength, match, matchIndex, inTable);
            if (error) {
              // @ts-ignore
              addErrorContext.apply(void 0, _toConsumableArray(error));
            }
            // Reset
            resetRunTracking();
          } else if (matchLength === 3) {
            // Swap internal run length (1->2 or 2->1)
            effectiveEmphasisLength = matchLength - effectiveEmphasisLength;
          } else if (effectiveEmphasisLength === 3) {
            // Downgrade internal run (3->1 or 3->2)
            effectiveEmphasisLength -= matchLength;
          } else {
            // Upgrade to internal run (1->3 or 2->3)
            effectiveEmphasisLength += matchLength;
          }
          // Back up one character so RegExp has a chance to match the
          // next marker (ex: "**star**_underscore_")
          if (emphasisRe.lastIndex > 1) {
            emphasisRe.lastIndex--;
          }
        } else if (emphasisRe.lastIndex > 1) {
          // Back up one character so RegExp has a chance to match the
          // mis-matched marker (ex: "*text_*")
          emphasisRe.lastIndex--;
        }
      }
      if (emphasisIndex !== -1) {
        pendingError = pendingError || handleRunEnd(line, lineIndex, 0, null, line.length, inTable);
        // Adjust for pending run on new line
        emphasisIndex = 0;
        emphasisLength = 0;
      }
    });
  }
};

/***/ }),

/***/ "../lib/md038.js":
/*!***********************!*\
  !*** ../lib/md038.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorContext = _require.addErrorContext,
  filterTokens = _require.filterTokens,
  forEachInlineCodeSpan = _require.forEachInlineCodeSpan,
  newLineRe = _require.newLineRe;
var leftSpaceRe = /^\s(?:[^`]|$)/;
var rightSpaceRe = /[^`]\s$/;
var spaceInsideCodeInline = function spaceInsideCodeInline(token) {
  return token.type === "code_inline" && (leftSpaceRe.test(token.content) || rightSpaceRe.test(token.content));
};
module.exports = {
  "names": ["MD038", "no-space-in-code"],
  "description": "Spaces inside code span elements",
  "tags": ["whitespace", "code"],
  "function": function MD038(params, onError) {
    filterTokens(params, "inline", function (token) {
      if (token.children.some(spaceInsideCodeInline)) {
        var tokenLines = params.lines.slice(token.map[0], token.map[1]);
        forEachInlineCodeSpan(tokenLines.join("\n"), function (code, lineIndex, columnIndex, tickCount) {
          var rangeIndex = columnIndex - tickCount;
          var rangeLength = code.length + 2 * tickCount;
          var rangeLineOffset = 0;
          var fixIndex = columnIndex;
          var fixLength = code.length;
          var codeLines = code.split(newLineRe);
          var left = leftSpaceRe.test(code);
          var right = !left && rightSpaceRe.test(code);
          if (right && codeLines.length > 1) {
            rangeIndex = 0;
            rangeLineOffset = codeLines.length - 1;
            fixIndex = 0;
          }
          if (left || right) {
            var codeLinesRange = codeLines[rangeLineOffset];
            if (codeLines.length > 1) {
              rangeLength = codeLinesRange.length + tickCount;
              fixLength = codeLinesRange.length;
            }
            var context = tokenLines[lineIndex + rangeLineOffset].substring(rangeIndex, rangeIndex + rangeLength);
            var codeLinesRangeTrim = codeLinesRange.trim();
            var fixText = (codeLinesRangeTrim.startsWith("`") ? " " : "") + codeLinesRangeTrim + (codeLinesRangeTrim.endsWith("`") ? " " : "");
            addErrorContext(onError, token.lineNumber + lineIndex + rangeLineOffset, context, left, right, [rangeIndex + 1, rangeLength], {
              "editColumn": fixIndex + 1,
              "deleteCount": fixLength,
              "insertText": fixText
            });
          }
        });
      }
    });
  }
};

/***/ }),

/***/ "../lib/md039.js":
/*!***********************!*\
  !*** ../lib/md039.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorContext = _require.addErrorContext,
  filterTokens = _require.filterTokens;
var spaceInLinkRe = /\[(?:\s[^\]]*|[^\]]*?\s)\](?=(\([^)]*\)|\[[^\]]*\]))/;
module.exports = {
  "names": ["MD039", "no-space-in-links"],
  "description": "Spaces inside link text",
  "tags": ["whitespace", "links"],
  "function": function MD039(params, onError) {
    filterTokens(params, "inline", function (token) {
      var children = token.children;
      var lineNumber = token.lineNumber;
      var inLink = false;
      var linkText = "";
      var lineIndex = 0;
      var _iterator = _createForOfIteratorHelper(children),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var child = _step.value;
          var content = child.content,
            markup = child.markup,
            type = child.type;
          if (type === "link_open") {
            inLink = true;
            linkText = "";
          } else if (type === "link_close") {
            inLink = false;
            var left = linkText.trimStart().length !== linkText.length;
            var right = linkText.trimEnd().length !== linkText.length;
            if (left || right) {
              var line = params.lines[lineNumber - 1];
              var range = null;
              var fixInfo = null;
              var match = line.slice(lineIndex).match(spaceInLinkRe);
              if (match) {
                var column = match.index + lineIndex + 1;
                var length = match[0].length;
                range = [column, length];
                fixInfo = {
                  "editColumn": column + 1,
                  "deleteCount": length - 2,
                  "insertText": linkText.trim()
                };
                lineIndex = column + length - 1;
              }
              addErrorContext(onError, lineNumber, "[".concat(linkText, "]"), left, right, range, fixInfo);
            }
          } else if (type === "softbreak" || type === "hardbreak") {
            lineNumber++;
            lineIndex = 0;
          } else if (inLink) {
            linkText += type.endsWith("_inline") ? "".concat(markup).concat(content).concat(markup) : content || markup;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    });
  }
};

/***/ }),

/***/ "../lib/md040.js":
/*!***********************!*\
  !*** ../lib/md040.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addError = _require.addError,
  addErrorContext = _require.addErrorContext,
  filterTokens = _require.filterTokens;
module.exports = {
  "names": ["MD040", "fenced-code-language"],
  "description": "Fenced code blocks should have a language specified",
  "tags": ["code", "language"],
  "function": function MD040(params, onError) {
    var allowed = params.config.allowed_languages;
    allowed = Array.isArray(allowed) ? allowed : [];
    var languageOnly = !!params.config.language_only;
    filterTokens(params, "fence", function forToken(token) {
      var lang = token.info.trim().split(/[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+/).shift();
      if (lang === "") {
        addErrorContext(onError, token.lineNumber, token.line);
      } else if (allowed.length > 0 && !allowed.includes(lang)) {
        addError(onError, token.lineNumber, "\"".concat(lang, "\" is not allowed"));
      }
      if (languageOnly && token.info !== lang) {
        addError(onError, token.lineNumber, "Info string contains more than language: \"".concat(token.info, "\""));
      }
    });
  }
};

/***/ }),

/***/ "../lib/md041.js":
/*!***********************!*\
  !*** ../lib/md041.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorContext = _require.addErrorContext,
  frontMatterHasTitle = _require.frontMatterHasTitle;
module.exports = {
  "names": ["MD041", "first-line-heading", "first-line-h1"],
  "description": "First line in a file should be a top-level heading",
  "tags": ["headings", "headers"],
  "function": function MD041(params, onError) {
    var level = Number(params.config.level || 1);
    var tag = "h" + level;
    var foundFrontMatterTitle = frontMatterHasTitle(params.frontMatterLines, params.config.front_matter_title);
    if (!foundFrontMatterTitle) {
      var htmlHeadingRe = new RegExp("^<h".concat(level, "[ />]"), "i");
      params.tokens.every(function (token) {
        var isError = false;
        if (token.type === "html_block") {
          if (token.content.startsWith("<!--")) {
            // Ignore leading HTML comments
            return true;
          } else if (!htmlHeadingRe.test(token.content)) {
            // Something other than an HTML heading
            isError = true;
          }
        } else if (token.type !== "heading_open" || token.tag !== tag) {
          // Something other than a Markdown heading
          isError = true;
        }
        if (isError) {
          addErrorContext(onError, token.lineNumber, token.line);
        }
        return false;
      });
    }
  }
};

/***/ }),

/***/ "../lib/md042.js":
/*!***********************!*\
  !*** ../lib/md042.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorContext = _require.addErrorContext,
  escapeForRegExp = _require.escapeForRegExp,
  filterTokens = _require.filterTokens;
module.exports = {
  "names": ["MD042", "no-empty-links"],
  "description": "No empty links",
  "tags": ["links"],
  "function": function MD042(params, onError) {
    filterTokens(params, "inline", function forToken(token) {
      var inLink = false;
      var linkText = "";
      var emptyLink = false;
      var _iterator = _createForOfIteratorHelper(token.children),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var child = _step.value;
          if (child.type === "link_open") {
            inLink = true;
            linkText = "";
            var _iterator2 = _createForOfIteratorHelper(child.attrs),
              _step2;
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var attr = _step2.value;
                if (attr[0] === "href" && (!attr[1] || attr[1] === "#")) {
                  emptyLink = true;
                }
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          } else if (child.type === "link_close") {
            inLink = false;
            if (emptyLink) {
              var context = "[".concat(linkText, "]");
              var range = null;
              var match = child.line.match(new RegExp("".concat(escapeForRegExp(context), "\\((?:|#|<>)\\)")));
              if (match) {
                context = match[0];
                range = [match.index + 1, match[0].length];
              }
              addErrorContext(onError, child.lineNumber, context, null, null, range);
              emptyLink = false;
            }
          } else if (inLink) {
            linkText += child.content;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    });
  }
};

/***/ }),

/***/ "../lib/md043.js":
/*!***********************!*\
  !*** ../lib/md043.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorContext = _require.addErrorContext,
  addErrorDetailIf = _require.addErrorDetailIf,
  forEachHeading = _require.forEachHeading;
module.exports = {
  "names": ["MD043", "required-headings", "required-headers"],
  "description": "Required heading structure",
  "tags": ["headings", "headers"],
  "function": function MD043(params, onError) {
    var requiredHeadings = params.config.headings || params.config.headers;
    var matchCase = params.config.match_case || false;
    if (Array.isArray(requiredHeadings)) {
      var levels = {};
      for (var _i = 0, _arr = [1, 2, 3, 4, 5, 6]; _i < _arr.length; _i++) {
        var level = _arr[_i];
        levels["h" + level] = "######".substr(-level);
      }
      var i = 0;
      var matchAny = false;
      var hasError = false;
      var anyHeadings = false;
      var getExpected = function getExpected() {
        return requiredHeadings[i++] || "[None]";
      };
      var handleCase = function handleCase(str) {
        return matchCase ? str : str.toLowerCase();
      };
      forEachHeading(params, function (heading, content) {
        if (!hasError) {
          anyHeadings = true;
          var actual = levels[heading.tag] + " " + content;
          var expected = getExpected();
          if (expected === "*") {
            var nextExpected = getExpected();
            if (handleCase(nextExpected) !== handleCase(actual)) {
              matchAny = true;
              i--;
            }
          } else if (expected === "+") {
            matchAny = true;
          } else if (handleCase(expected) === handleCase(actual)) {
            matchAny = false;
          } else if (matchAny) {
            i--;
          } else {
            addErrorDetailIf(onError, heading.lineNumber, expected, actual);
            hasError = true;
          }
        }
      });
      var extraHeadings = requiredHeadings.length - i;
      if (!hasError && (extraHeadings > 1 || extraHeadings === 1 && requiredHeadings[i] !== "*") && (anyHeadings || !requiredHeadings.every(function (heading) {
        return heading === "*";
      }))) {
        addErrorContext(onError, params.lines.length, requiredHeadings[i]);
      }
    }
  }
};

/***/ }),

/***/ "../lib/md044.js":
/*!***********************!*\
  !*** ../lib/md044.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorDetailIf = _require.addErrorDetailIf,
  escapeForRegExp = _require.escapeForRegExp,
  forEachLine = _require.forEachLine,
  forEachLink = _require.forEachLink,
  funcExpExec = _require.funcExpExec,
  linkReferenceDefinitionRe = _require.linkReferenceDefinitionRe,
  urlFe = _require.urlFe,
  withinAnyRange = _require.withinAnyRange;
var _require2 = __webpack_require__(/*! ./cache */ "../lib/cache.js"),
  codeBlockAndSpanRanges = _require2.codeBlockAndSpanRanges,
  htmlElementRanges = _require2.htmlElementRanges,
  lineMetadata = _require2.lineMetadata;
module.exports = {
  "names": ["MD044", "proper-names"],
  "description": "Proper names should have the correct capitalization",
  "tags": ["spelling"],
  "function": function MD044(params, onError) {
    var names = params.config.names;
    names = Array.isArray(names) ? names : [];
    names.sort(function (a, b) {
      return b.length - a.length || a.localeCompare(b);
    });
    var codeBlocks = params.config.code_blocks;
    var includeCodeBlocks = codeBlocks === undefined ? true : !!codeBlocks;
    var htmlElements = params.config.html_elements;
    var includeHtmlElements = htmlElements === undefined ? true : !!htmlElements;
    var exclusions = [];
    forEachLine(lineMetadata(), function (line, lineIndex) {
      if (linkReferenceDefinitionRe.test(line)) {
        exclusions.push([lineIndex, 0, line.length]);
      } else {
        var match = null;
        while ((match = funcExpExec(urlFe, line)) !== null) {
          // @ts-ignore
          exclusions.push([lineIndex, match.index, match[0].length]);
        }
        forEachLink(line, function (index, _, text, destination) {
          if (destination) {
            exclusions.push([lineIndex, index + text.length, destination.length]);
          }
        });
      }
    });
    if (!includeCodeBlocks) {
      exclusions.push.apply(exclusions, _toConsumableArray(codeBlockAndSpanRanges()));
    }
    if (!includeHtmlElements) {
      exclusions.push.apply(exclusions, _toConsumableArray(htmlElementRanges()));
    }
    var _iterator = _createForOfIteratorHelper(names),
      _step;
    try {
      var _loop = function _loop() {
        var name = _step.value;
        var escapedName = escapeForRegExp(name);
        var startNamePattern = /^\W/.test(name) ? "" : "\\b_*";
        var endNamePattern = /\W$/.test(name) ? "" : "_*\\b";
        var namePattern = "(".concat(startNamePattern, ")(").concat(escapedName, ")").concat(endNamePattern);
        var nameRe = new RegExp(namePattern, "gi");
        forEachLine(lineMetadata(), function (line, lineIndex, inCode, onFence) {
          if (includeCodeBlocks || !inCode && !onFence) {
            var match = null;
            while ((match = nameRe.exec(line)) !== null) {
              var _match = match,
                _match2 = _slicedToArray(_match, 3),
                leftMatch = _match2[1],
                nameMatch = _match2[2];
              var index = match.index + leftMatch.length;
              var length = nameMatch.length;
              if (!withinAnyRange(exclusions, lineIndex, index, length) && !names.includes(nameMatch)) {
                addErrorDetailIf(onError, lineIndex + 1, name, nameMatch, null, null, [index + 1, length], {
                  "editColumn": index + 1,
                  "deleteCount": length,
                  "insertText": name
                });
              }
              exclusions.push([lineIndex, index, length]);
            }
          }
        });
      };
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _loop();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
};

/***/ }),

/***/ "../lib/md045.js":
/*!***********************!*\
  !*** ../lib/md045.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addError = _require.addError,
  forEachInlineChild = _require.forEachInlineChild;
module.exports = {
  "names": ["MD045", "no-alt-text"],
  "description": "Images should have alternate text (alt text)",
  "tags": ["accessibility", "images"],
  "function": function MD045(params, onError) {
    forEachInlineChild(params, "image", function forToken(token) {
      if (token.content === "") {
        addError(onError, token.lineNumber);
      }
    });
  }
};

/***/ }),

/***/ "../lib/md046.js":
/*!***********************!*\
  !*** ../lib/md046.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorDetailIf = _require.addErrorDetailIf;
var tokenTypeToStyle = {
  "fence": "fenced",
  "code_block": "indented"
};
module.exports = {
  "names": ["MD046", "code-block-style"],
  "description": "Code block style",
  "tags": ["code"],
  "function": function MD046(params, onError) {
    var expectedStyle = String(params.config.style || "consistent");
    var codeBlocksAndFences = params.tokens.filter(function (token) {
      return token.type === "code_block" || token.type === "fence";
    });
    var _iterator = _createForOfIteratorHelper(codeBlocksAndFences),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var token = _step.value;
        var lineNumber = token.lineNumber,
          type = token.type;
        if (expectedStyle === "consistent") {
          expectedStyle = tokenTypeToStyle[type];
        }
        addErrorDetailIf(onError, lineNumber, expectedStyle, tokenTypeToStyle[type]);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
};

/***/ }),

/***/ "../lib/md047.js":
/*!***********************!*\
  !*** ../lib/md047.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addError = _require.addError,
  isBlankLine = _require.isBlankLine;
module.exports = {
  "names": ["MD047", "single-trailing-newline"],
  "description": "Files should end with a single newline character",
  "tags": ["blank_lines"],
  "function": function MD047(params, onError) {
    var lastLineNumber = params.lines.length;
    var lastLine = params.lines[lastLineNumber - 1];
    if (!isBlankLine(lastLine)) {
      addError(onError, lastLineNumber, null, null, [lastLine.length, 1], {
        "insertText": "\n",
        "editColumn": lastLine.length + 1
      });
    }
  }
};

/***/ }),

/***/ "../lib/md048.js":
/*!***********************!*\
  !*** ../lib/md048.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorDetailIf = _require.addErrorDetailIf,
  fencedCodeBlockStyleFor = _require.fencedCodeBlockStyleFor;
module.exports = {
  "names": ["MD048", "code-fence-style"],
  "description": "Code fence style",
  "tags": ["code"],
  "function": function MD048(params, onError) {
    var style = String(params.config.style || "consistent");
    var expectedStyle = style;
    var fenceTokens = params.tokens.filter(function (token) {
      return token.type === "fence";
    });
    var _iterator = _createForOfIteratorHelper(fenceTokens),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var fenceToken = _step.value;
        var lineNumber = fenceToken.lineNumber,
          markup = fenceToken.markup;
        if (expectedStyle === "consistent") {
          expectedStyle = fencedCodeBlockStyleFor(markup);
        }
        addErrorDetailIf(onError, lineNumber, expectedStyle, fencedCodeBlockStyleFor(markup));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
};

/***/ }),

/***/ "../lib/md049-md050.js":
/*!*****************************!*\
  !*** ../lib/md049-md050.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addError = _require.addError,
  emphasisOrStrongStyleFor = _require.emphasisOrStrongStyleFor,
  forEachInlineChild = _require.forEachInlineChild,
  getNextChildToken = _require.getNextChildToken,
  getRangeAndFixInfoIfFound = _require.getRangeAndFixInfoIfFound;
var impl = function impl(params, onError, tagPrefix, asterisk, underline, style) {
  var lastLineNumber = -1;
  var instances = new Map();
  forEachInlineChild(params, "".concat(tagPrefix, "_open"), function (token, parent) {
    var lineNumber = token.lineNumber,
      markup = token.markup;
    var markupStyle = emphasisOrStrongStyleFor(markup);
    if (style === "consistent") {
      style = markupStyle;
    }
    if (style !== markupStyle) {
      var rangeAndFixInfo = {};
      var contentToken = getNextChildToken(parent, token, "text", "".concat(tagPrefix, "_close"));
      if (contentToken) {
        var content = contentToken.content;
        var actual = "".concat(markup).concat(content).concat(markup);
        var expectedMarkup = style === "asterisk" ? asterisk : underline;
        var expected = "".concat(expectedMarkup).concat(content).concat(expectedMarkup);
        if (lastLineNumber !== lineNumber) {
          lastLineNumber = lineNumber;
          instances.clear();
        }
        var instance = (instances.get(expected) || 0) + 1;
        instances.set(expected, instance);
        rangeAndFixInfo = getRangeAndFixInfoIfFound(params.lines, lineNumber - 1, actual, expected, instance);
      }
      addError(onError, lineNumber, "Expected: ".concat(style, "; Actual: ").concat(markupStyle), null, rangeAndFixInfo.range, rangeAndFixInfo.fixInfo);
    }
  });
};
module.exports = [{
  "names": ["MD049", "emphasis-style"],
  "description": "Emphasis style should be consistent",
  "tags": ["emphasis"],
  "function": function MD049(params, onError) {
    var style = String(params.config.style || "consistent");
    return impl(params, onError, "em", "*", "_", style);
  }
}, {
  "names": ["MD050", "strong-style"],
  "description": "Strong style should be consistent",
  "tags": ["emphasis"],
  "function": function MD050(params, onError) {
    var style = String(params.config.style || "consistent");
    return impl(params, onError, "strong", "**", "__", style);
  }
}];

/***/ }),

/***/ "../lib/md051.js":
/*!***********************!*\
  !*** ../lib/md051.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addError = _require.addError,
  addErrorDetailIf = _require.addErrorDetailIf,
  escapeForRegExp = _require.escapeForRegExp,
  filterTokens = _require.filterTokens,
  forEachInlineChild = _require.forEachInlineChild,
  forEachHeading = _require.forEachHeading,
  htmlElementRe = _require.htmlElementRe;

// Regular expression for identifying HTML anchor names
var idRe = /[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]id[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*=[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*["']?((?:(?![\t-\r "'>\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF])[\s\S])+)/i;
var nameRe = /[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]name[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*=[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*["']?((?:(?![\t-\r "'>\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF])[\s\S])+)/i;

/**
 * Converts a Markdown heading into an HTML fragment according to the rules
 * used by GitHub.
 *
 * @param {Object} inline Inline token for heading.
 * @returns {string} Fragment string for heading.
 */
function convertHeadingToHTMLFragment(inline) {
  var inlineText = inline.children.filter(function (token) {
    return token.type !== "html_inline";
  }).map(function (token) {
    return token.content;
  }).join("");
  return "#" + encodeURIComponent(inlineText.toLowerCase()
  // RegExp source with Ruby's \p{Word} expanded into its General Categories
  // eslint-disable-next-line max-len
  // https://github.com/gjtorikian/html-pipeline/blob/main/lib/html/pipeline/toc_filter.rb
  // https://ruby-doc.org/core-3.0.2/Regexp.html
  .replace(/(?:(?![ \x2D0-9A-Z_a-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u052F\u0531-\u0556\u0559\u0560-\u0588\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05EF-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u07FD\u0800-\u082D\u0840-\u085B\u0860-\u086A\u0870-\u0887\u0889-\u088E\u0898-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09F4-\u09F9\u09FC\u09FE\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71-\u0B77\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BF2\u0C00-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3C-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C5D\u0C60-\u0C63\u0C66-\u0C6F\u0C78-\u0C7E\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDD\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1-\u0CF3\u0D00-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D63\u0D66-\u0D78\u0D7A-\u0D7F\u0D81-\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECE\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F33\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1715\u171F-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u17F0-\u17F9\u180B-\u180D\u180F-\u1819\u1820-\u1878\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ACE\u1B00-\u1B4C\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CD0-\u1CD2\u1CD4-\u1CFA\u1D00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u20D0-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2CE4\u2CEB-\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA672\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA827\uA82C\uA830-\uA835\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0-\uDEFB\uDF00-\uDF23\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE38-\uDE3A\uDE3F-\uDE48\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE6\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDD27\uDD30-\uDD39\uDE60-\uDE7E\uDE80-\uDEA9\uDEAB\uDEAC\uDEB0\uDEB1\uDEFD-\uDF27\uDF30-\uDF54\uDF70-\uDF85\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD804[\uDC00-\uDC46\uDC52-\uDC75\uDC7F-\uDCBA\uDCC2\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD44-\uDD47\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDC9-\uDDCC\uDDCE-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE37\uDE3E-\uDE41\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3B-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC5E-\uDC61\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB8\uDEC0-\uDEC9\uDF00-\uDF1A\uDF1D-\uDF2B\uDF30-\uDF3B\uDF40-\uDF46]|\uD806[\uDC00-\uDC3A\uDCA0-\uDCF2\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD35\uDD37\uDD38\uDD3B-\uDD43\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD7\uDDDA-\uDDE1\uDDE3\uDDE4\uDE00-\uDE3E\uDE47\uDE50-\uDE99\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC6C\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD8E\uDD90\uDD91\uDD93-\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF6\uDF00-\uDF10\uDF12-\uDF3A\uDF3E-\uDF42\uDF50-\uDF59\uDFB0\uDFC0-\uDFD4]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD887][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F\uDC40-\uDC55]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDE70-\uDEBE\uDEC0-\uDEC9\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE96\uDF00-\uDF4A\uDF4F-\uDF87\uDF8F-\uDF9F\uDFE0\uDFE1\uDFE3\uDFE4\uDFF0\uDFF1]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD32\uDD50-\uDD52\uDD55\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44\uDEC0-\uDED3\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC30-\uDC6D\uDC8F\uDD00-\uDD2C\uDD30-\uDD3D\uDD40-\uDD49\uDD4E\uDE90-\uDEAE\uDEC0-\uDEF9]|\uD839[\uDCD0-\uDCF9\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCD6\uDD00-\uDD4B\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF39\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD888[\uDC00-\uDFAF]|\uDB40[\uDD00-\uDDEF])[\s\S])/g, "").replace(/ /g, "-"));
}
module.exports = {
  "names": ["MD051", "link-fragments"],
  "description": "Link fragments should be valid",
  "tags": ["links"],
  "function": function MD051(params, onError) {
    var fragments = new Map();
    // Process headings
    forEachHeading(params, function (heading, content, inline) {
      var fragment = convertHeadingToHTMLFragment(inline);
      var count = fragments.get(fragment) || 0;
      if (count) {
        fragments.set("".concat(fragment, "-").concat(count), 0);
      }
      fragments.set(fragment, count + 1);
    });
    // Process HTML anchors
    var processHtmlToken = function processHtmlToken(token) {
      var match = null;
      while ((match = htmlElementRe.exec(token.content)) !== null) {
        var _match = match,
          _match2 = _slicedToArray(_match, 3),
          tag = _match2[0],
          element = _match2[2];
        var anchorMatch = idRe.exec(tag) || element.toLowerCase() === "a" && nameRe.exec(tag);
        if (anchorMatch) {
          fragments.set("#".concat(anchorMatch[1]), 0);
        }
      }
    };
    filterTokens(params, "html_block", processHtmlToken);
    forEachInlineChild(params, "html_inline", processHtmlToken);
    // Process link fragments
    forEachInlineChild(params, "link_open", function (token) {
      var attrs = token.attrs,
        lineNumber = token.lineNumber,
        line = token.line;
      var href = attrs.find(function (attr) {
        return attr[0] === "href";
      });
      var id = href && href[1];
      if (id && id.length > 1 && id[0] === "#" && !fragments.has(id)) {
        var context = id;
        var range = null;
        var fixInfo = null;
        var match = line.match(new RegExp("\\[.*?\\]\\(".concat(escapeForRegExp(context), "\\)")));
        if (match) {
          var _match3 = _slicedToArray(match, 1);
          context = _match3[0];
          var index = match.index;
          var length = context.length;
          range = [index + 1, length];
          fixInfo = {
            "editColumn": index + (length - id.length),
            "deleteCount": id.length,
            "insertText": null
          };
        }
        var idLower = id.toLowerCase();
        var mixedCaseKey = _toConsumableArray(fragments.keys()).find(function (key) {
          return idLower === key.toLowerCase();
        });
        if (mixedCaseKey) {
          (fixInfo || {}).insertText = mixedCaseKey;
          addErrorDetailIf(onError, lineNumber, mixedCaseKey, id, undefined, context, range, fixInfo);
        } else {
          addError(onError, lineNumber, undefined, context,
          // @ts-ignore
          range);
        }
      }
    });
  }
};

/***/ }),

/***/ "../lib/md052.js":
/*!***********************!*\
  !*** ../lib/md052.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addError = _require.addError;
var _require2 = __webpack_require__(/*! ./cache */ "../lib/cache.js"),
  referenceLinkImageData = _require2.referenceLinkImageData;
module.exports = {
  "names": ["MD052", "reference-links-images"],
  "description": "Reference links and images should use a label that is defined",
  "tags": ["images", "links"],
  "function": function MD052(params, onError) {
    var lines = params.lines;
    var _referenceLinkImageDa = referenceLinkImageData(),
      references = _referenceLinkImageDa.references,
      definitions = _referenceLinkImageDa.definitions;
    // Look for links/images that use an undefined link reference
    var _iterator = _createForOfIteratorHelper(references.entries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var reference = _step.value;
        var _reference = _slicedToArray(reference, 2),
          label = _reference[0],
          datas = _reference[1];
        if (!definitions.has(label)) {
          var _iterator2 = _createForOfIteratorHelper(datas),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var data = _step2.value;
              var _data = _slicedToArray(data, 3),
                lineIndex = _data[0],
                index = _data[1],
                length = _data[2];
              // Context will be incomplete if reporting for a multi-line link
              var context = lines[lineIndex].slice(index, index + length);
              addError(onError, lineIndex + 1, "Missing link or image reference definition: \"".concat(label, "\""), context, [index + 1, context.length]);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
};

/***/ }),

/***/ "../lib/md053.js":
/*!***********************!*\
  !*** ../lib/md053.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addError = _require.addError,
  ellipsify = _require.ellipsify,
  linkReferenceDefinitionRe = _require.linkReferenceDefinitionRe;
var _require2 = __webpack_require__(/*! ./cache */ "../lib/cache.js"),
  referenceLinkImageData = _require2.referenceLinkImageData;
module.exports = {
  "names": ["MD053", "link-image-reference-definitions"],
  "description": "Link and image reference definitions should be needed",
  "tags": ["images", "links"],
  "function": function MD053(params, onError) {
    var ignored = new Set(params.config.ignored_definitions || ["//"]);
    var lines = params.lines;
    var _referenceLinkImageDa = referenceLinkImageData(),
      references = _referenceLinkImageDa.references,
      shortcuts = _referenceLinkImageDa.shortcuts,
      definitions = _referenceLinkImageDa.definitions,
      duplicateDefinitions = _referenceLinkImageDa.duplicateDefinitions;
    var singleLineDefinition = function singleLineDefinition(line) {
      return line.replace(linkReferenceDefinitionRe, "").trim().length > 0;
    };
    var deleteFixInfo = {
      "deleteCount": -1
    };
    // Look for unused link references (unreferenced by any link/image)
    var _iterator = _createForOfIteratorHelper(definitions.entries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var definition = _step.value;
        var _definition = _slicedToArray(definition, 2),
          label = _definition[0],
          lineIndex = _definition[1];
        if (!ignored.has(label) && !references.has(label) && !shortcuts.has(label)) {
          var line = lines[lineIndex];
          addError(onError, lineIndex + 1, "Unused link or image reference definition: \"".concat(label, "\""), ellipsify(line), [1, line.length], singleLineDefinition(line) ? deleteFixInfo : 0);
        }
      }
      // Look for duplicate link references (defined more than once)
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var _iterator2 = _createForOfIteratorHelper(duplicateDefinitions),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var duplicateDefinition = _step2.value;
        var _duplicateDefinition = _slicedToArray(duplicateDefinition, 2),
          _label = _duplicateDefinition[0],
          _lineIndex = _duplicateDefinition[1];
        if (!ignored.has(_label)) {
          var _line = lines[_lineIndex];
          addError(onError, _lineIndex + 1, "Duplicate link or image reference definition: \"".concat(_label, "\""), ellipsify(_line), [1, _line.length], singleLineDefinition(_line) ? deleteFixInfo : 0);
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }
};

/***/ }),

/***/ "../lib/rules.js":
/*!***********************!*\
  !*** ../lib/rules.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ./constants */ "../lib/constants.js"),
  homepage = _require.homepage,
  version = _require.version;
var rules = [__webpack_require__(/*! ./md001 */ "../lib/md001.js"), __webpack_require__(/*! ./md002 */ "../lib/md002.js"), __webpack_require__(/*! ./md003 */ "../lib/md003.js"), __webpack_require__(/*! ./md004 */ "../lib/md004.js"), __webpack_require__(/*! ./md005 */ "../lib/md005.js"), __webpack_require__(/*! ./md006 */ "../lib/md006.js"), __webpack_require__(/*! ./md007 */ "../lib/md007.js"), __webpack_require__(/*! ./md009 */ "../lib/md009.js"), __webpack_require__(/*! ./md010 */ "../lib/md010.js"), __webpack_require__(/*! ./md011 */ "../lib/md011.js"), __webpack_require__(/*! ./md012 */ "../lib/md012.js"), __webpack_require__(/*! ./md013 */ "../lib/md013.js"), __webpack_require__(/*! ./md014 */ "../lib/md014.js"), __webpack_require__(/*! ./md018 */ "../lib/md018.js"), __webpack_require__(/*! ./md019 */ "../lib/md019.js"), __webpack_require__(/*! ./md020 */ "../lib/md020.js"), __webpack_require__(/*! ./md021 */ "../lib/md021.js"), __webpack_require__(/*! ./md022 */ "../lib/md022.js"), __webpack_require__(/*! ./md023 */ "../lib/md023.js"), __webpack_require__(/*! ./md024 */ "../lib/md024.js"), __webpack_require__(/*! ./md025 */ "../lib/md025.js"), __webpack_require__(/*! ./md026 */ "../lib/md026.js"), __webpack_require__(/*! ./md027 */ "../lib/md027.js"), __webpack_require__(/*! ./md028 */ "../lib/md028.js"), __webpack_require__(/*! ./md029 */ "../lib/md029.js"), __webpack_require__(/*! ./md030 */ "../lib/md030.js"), __webpack_require__(/*! ./md031 */ "../lib/md031.js"), __webpack_require__(/*! ./md032 */ "../lib/md032.js"), __webpack_require__(/*! ./md033 */ "../lib/md033.js"), __webpack_require__(/*! ./md034 */ "../lib/md034.js"), __webpack_require__(/*! ./md035 */ "../lib/md035.js"), __webpack_require__(/*! ./md036 */ "../lib/md036.js"), __webpack_require__(/*! ./md037 */ "../lib/md037.js"), __webpack_require__(/*! ./md038 */ "../lib/md038.js"), __webpack_require__(/*! ./md039 */ "../lib/md039.js"), __webpack_require__(/*! ./md040 */ "../lib/md040.js"), __webpack_require__(/*! ./md041 */ "../lib/md041.js"), __webpack_require__(/*! ./md042 */ "../lib/md042.js"), __webpack_require__(/*! ./md043 */ "../lib/md043.js"), __webpack_require__(/*! ./md044 */ "../lib/md044.js"), __webpack_require__(/*! ./md045 */ "../lib/md045.js"), __webpack_require__(/*! ./md046 */ "../lib/md046.js"), __webpack_require__(/*! ./md047 */ "../lib/md047.js"), __webpack_require__(/*! ./md048 */ "../lib/md048.js")].concat(_toConsumableArray(__webpack_require__(/*! ./md049-md050 */ "../lib/md049-md050.js")), [__webpack_require__(/*! ./md051 */ "../lib/md051.js"), __webpack_require__(/*! ./md052 */ "../lib/md052.js"), __webpack_require__(/*! ./md053 */ "../lib/md053.js")]);
var _iterator = _createForOfIteratorHelper(rules),
  _step;
try {
  for (_iterator.s(); !(_step = _iterator.n()).done;) {
    var rule = _step.value;
    var name = rule.names[0].toLowerCase();
    // eslint-disable-next-line dot-notation
    rule["information"] = new URL("".concat(homepage, "/blob/v").concat(version, "/doc/").concat(name, ".md"));
  }
} catch (err) {
  _iterator.e(err);
} finally {
  _iterator.f();
}
module.exports = rules;

/***/ }),

/***/ "../micromark/micromark.cjs":
/*!**********************************!*\
  !*** ../micromark/micromark.cjs ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
(function () {
  "use strict";

  var _Xe, _tt;
  var e = {
      d: function d(t, n) {
        for (var r in n) e.o(n, r) && !e.o(t, r) && Object.defineProperty(t, r, {
          enumerable: !0,
          get: n[r]
        });
      },
      o: function o(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      },
      r: function r(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
          value: "Module"
        }), Object.defineProperty(e, "__esModule", {
          value: !0
        });
      }
    },
    t = {};
  e.r(t), e.d(t, {
    gfmAutolinkLiteral: function gfmAutolinkLiteral() {
      return F;
    },
    gfmFootnote: function gfmFootnote() {
      return O;
    },
    parse: function parse() {
      return it;
    },
    postprocess: function postprocess() {
      return ut;
    },
    preprocess: function preprocess() {
      return at;
    }
  });
  var n = {};
  e.r(n), e.d(n, {
    attentionMarkers: function attentionMarkers() {
      return rt;
    },
    contentInitial: function contentInitial() {
      return Ke;
    },
    disable: function disable() {
      return ot;
    },
    document: function document() {
      return Ye;
    },
    flow: function flow() {
      return $e;
    },
    flowInitial: function flowInitial() {
      return Xe;
    },
    insideSpan: function insideSpan() {
      return nt;
    },
    string: function string() {
      return et;
    },
    text: function text() {
      return tt;
    }
  });
  var r = g(/[A-Za-z]/),
    o = g(/\d/),
    i = g(/[\dA-Fa-f]/),
    u = g(/[\dA-Za-z]/),
    c = g(/[!-/:-@[-`{-~]/),
    a = g(/[#-'*+\--9=?A-Z^-~]/);
  function s(e) {
    return null !== e && (e < 32 || 127 === e);
  }
  function l(e) {
    return null !== e && (e < 0 || 32 === e);
  }
  function f(e) {
    return null !== e && e < -2;
  }
  function p(e) {
    return -2 === e || -1 === e || 32 === e;
  }
  var d = g(/\s/),
    m = g(/[!-/:-@[-`{-~\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/);
  function g(e) {
    return function (t) {
      return null !== t && e.test(String.fromCharCode(t));
    };
  }
  var h = {
      tokenize: function tokenize(e, t, n) {
        return function (t) {
          return e.consume(t), r;
        };
        function r(t) {
          return 87 === t || 119 === t ? (e.consume(t), o) : n(t);
        }
        function o(t) {
          return 87 === t || 119 === t ? (e.consume(t), i) : n(t);
        }
        function i(t) {
          return 46 === t ? (e.consume(t), u) : n(t);
        }
        function u(e) {
          return null === e || f(e) ? n(e) : t(e);
        }
      },
      partial: !0
    },
    b = {
      tokenize: function tokenize(e, t, n) {
        var r, o;
        return i;
        function i(t) {
          return 38 === t ? e.check(v, c, u)(t) : 46 === t || 95 === t ? e.check(k, c, u)(t) : null === t || s(t) || d(t) || 45 !== t && m(t) ? c(t) : (e.consume(t), i);
        }
        function u(t) {
          return 46 === t ? (o = r, r = void 0, e.consume(t), i) : (95 === t && (r = !0), e.consume(t), i);
        }
        function c(e) {
          return o || r ? n(e) : t(e);
        }
      },
      partial: !0
    },
    x = {
      tokenize: function tokenize(e, t) {
        var n = 0;
        return r;
        function r(u) {
          return 38 === u ? e.check(v, t, o)(u) : (40 === u && n++, 41 === u ? e.check(k, i, o)(u) : D(u) ? t(u) : A(u) ? e.check(k, t, o)(u) : (e.consume(u), r));
        }
        function o(t) {
          return e.consume(t), r;
        }
        function i(e) {
          return n--, n < 0 ? t(e) : o(e);
        }
      },
      partial: !0
    },
    k = {
      tokenize: function tokenize(e, t, n) {
        return function (t) {
          return e.consume(t), r;
        };
        function r(o) {
          return A(o) ? (e.consume(o), r) : D(o) ? t(o) : n(o);
        }
      },
      partial: !0
    },
    v = {
      tokenize: function tokenize(e, t, n) {
        return function (t) {
          return e.consume(t), o;
        };
        function o(t) {
          return r(t) ? (e.consume(t), o) : 59 === t ? (e.consume(t), i) : n(t);
        }
        function i(e) {
          return D(e) ? t(e) : n(e);
        }
      },
      partial: !0
    },
    y = {
      tokenize: function tokenize(e, t, n) {
        var r = this;
        return function (t) {
          return 87 !== t && 119 !== t || !T(r.previous) || I(r.events) ? n(t) : (e.enter("literalAutolink"), e.enter("literalAutolinkWww"), e.check(h, e.attempt(b, e.attempt(x, o), n), n)(t));
        };
        function o(n) {
          return e.exit("literalAutolinkWww"), e.exit("literalAutolink"), t(n);
        }
      },
      previous: T
    },
    w = {
      tokenize: function tokenize(e, t, n) {
        var r = this;
        return function (t) {
          return 72 !== t && 104 !== t || !C(r.previous) || I(r.events) ? n(t) : (e.enter("literalAutolink"), e.enter("literalAutolinkHttp"), e.consume(t), o);
        };
        function o(t) {
          return 84 === t || 116 === t ? (e.consume(t), i) : n(t);
        }
        function i(t) {
          return 84 === t || 116 === t ? (e.consume(t), u) : n(t);
        }
        function u(t) {
          return 80 === t || 112 === t ? (e.consume(t), c) : n(t);
        }
        function c(t) {
          return 83 === t || 115 === t ? (e.consume(t), a) : a(t);
        }
        function a(t) {
          return 58 === t ? (e.consume(t), l) : n(t);
        }
        function l(t) {
          return 47 === t ? (e.consume(t), f) : n(t);
        }
        function f(t) {
          return 47 === t ? (e.consume(t), p) : n(t);
        }
        function p(t) {
          return null === t || s(t) || d(t) || m(t) ? n(t) : e.attempt(b, e.attempt(x, g), n)(t);
        }
        function g(n) {
          return e.exit("literalAutolinkHttp"), e.exit("literalAutolink"), t(n);
        }
      },
      previous: C
    },
    q = {
      tokenize: function tokenize(e, t, n) {
        var r = this;
        var i, c;
        return function (t) {
          return L(t) && z(r.previous) && !I(r.events) ? (e.enter("literalAutolink"), e.enter("literalAutolinkEmail"), a(t)) : n(t);
        };
        function a(t) {
          return L(t) ? (e.consume(t), a) : 64 === t ? (e.consume(t), s) : n(t);
        }
        function s(t) {
          return 46 === t ? e.check(k, d, l)(t) : 45 === t || 95 === t ? e.check(k, n, f)(t) : u(t) ? (!c && o(t) && (c = !0), e.consume(t), s) : d(t);
        }
        function l(t) {
          return e.consume(t), i = !0, c = void 0, s;
        }
        function f(t) {
          return e.consume(t), p;
        }
        function p(t) {
          return 46 === t ? e.check(k, n, l)(t) : s(t);
        }
        function d(r) {
          return i && !c ? (e.exit("literalAutolinkEmail"), e.exit("literalAutolink"), t(r)) : n(r);
        }
      },
      previous: z
    },
    S = {},
    F = {
      text: S
    };
  var E = 48;
  for (; E < 123;) S[E] = q, E++, 58 === E ? E = 65 : 91 === E && (E = 97);
  function A(e) {
    return 33 === e || 34 === e || 39 === e || 41 === e || 42 === e || 44 === e || 46 === e || 58 === e || 59 === e || 60 === e || 63 === e || 95 === e || 126 === e;
  }
  function D(e) {
    return null === e || 60 === e || l(e);
  }
  function L(e) {
    return 43 === e || 45 === e || 46 === e || 95 === e || u(e);
  }
  function T(e) {
    return null === e || 40 === e || 42 === e || 95 === e || 126 === e || l(e);
  }
  function C(e) {
    return null === e || !r(e);
  }
  function z(e) {
    return 47 !== e && C(e);
  }
  function I(e) {
    var t = e.length,
      n = !1;
    for (; t--;) {
      var _r = e[t][1];
      if (("labelLink" === _r.type || "labelImage" === _r.type) && !_r._balanced) {
        n = !0;
        break;
      }
      if (_r._gfmAutolinkLiteralWalkedInto) {
        n = !1;
        break;
      }
    }
    return e.length > 0 && !n && (e[e.length - 1][1]._gfmAutolinkLiteralWalkedInto = !0), n;
  }
  function B(e, t, n, r) {
    var o = r ? r - 1 : Number.POSITIVE_INFINITY;
    var i = 0;
    return function (r) {
      return p(r) ? (e.enter(n), u(r)) : t(r);
    };
    function u(r) {
      return p(r) && i++ < o ? (e.consume(r), u) : (e.exit(n), t(r));
    }
  }
  S[43] = q, S[45] = q, S[46] = q, S[95] = q, S[72] = [q, w], S[104] = [q, w], S[87] = [q, y], S[119] = [q, y];
  var R = {
    tokenize: function tokenize(e, t, n) {
      return B(e, function (e) {
        return null === e || f(e) ? t(e) : n(e);
      }, "linePrefix");
    },
    partial: !0
  };
  function M(e) {
    return e.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
  }
  var N = {
    tokenize: function tokenize(e, t, n) {
      var r = this;
      return B(e, function (e) {
        var o = r.events[r.events.length - 1];
        return o && "gfmFootnoteDefinitionIndent" === o[1].type && 4 === o[2].sliceSerialize(o[1], !0).length ? t(e) : n(e);
      }, "gfmFootnoteDefinitionIndent", 5);
    },
    partial: !0
  };
  function O() {
    return {
      document: {
        91: {
          tokenize: j,
          continuation: {
            tokenize: U
          },
          exit: H
        }
      },
      text: {
        91: {
          tokenize: V
        },
        93: {
          add: "after",
          tokenize: P,
          resolveTo: _
        }
      }
    };
  }
  function P(e, t, n) {
    var r = this;
    var o = r.events.length;
    var i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
    var u;
    for (; o--;) {
      var _e2 = r.events[o][1];
      if ("labelImage" === _e2.type) {
        u = _e2;
        break;
      }
      if ("gfmFootnoteCall" === _e2.type || "labelLink" === _e2.type || "label" === _e2.type || "image" === _e2.type || "link" === _e2.type) break;
    }
    return function (o) {
      if (!u || !u._balanced) return n(o);
      var c = M(r.sliceSerialize({
        start: u.end,
        end: r.now()
      }));
      return 94 === c.charCodeAt(0) && i.includes(c.slice(1)) ? (e.enter("gfmFootnoteCallLabelMarker"), e.consume(o), e.exit("gfmFootnoteCallLabelMarker"), t(o)) : n(o);
    };
  }
  function _(e, t) {
    var n,
      r = e.length;
    for (; r--;) if ("labelImage" === e[r][1].type && "enter" === e[r][0]) {
      n = e[r][1];
      break;
    }
    e[r + 1][1].type = "data", e[r + 3][1].type = "gfmFootnoteCallLabelMarker";
    var o = {
        type: "gfmFootnoteCall",
        start: Object.assign({}, e[r + 3][1].start),
        end: Object.assign({}, e[e.length - 1][1].end)
      },
      i = {
        type: "gfmFootnoteCallMarker",
        start: Object.assign({}, e[r + 3][1].end),
        end: Object.assign({}, e[r + 3][1].end)
      };
    i.end.column++, i.end.offset++, i.end._bufferIndex++;
    var u = {
        type: "gfmFootnoteCallString",
        start: Object.assign({}, i.end),
        end: Object.assign({}, e[e.length - 1][1].start)
      },
      c = {
        type: "chunkString",
        contentType: "string",
        start: Object.assign({}, u.start),
        end: Object.assign({}, u.end)
      },
      a = [e[r + 1], e[r + 2], ["enter", o, t], e[r + 3], e[r + 4], ["enter", i, t], ["exit", i, t], ["enter", u, t], ["enter", c, t], ["exit", c, t], ["exit", u, t], e[e.length - 2], e[e.length - 1], ["exit", o, t]];
    return e.splice.apply(e, [r, e.length - r + 1].concat(a)), e;
  }
  function V(e, t, n) {
    var r = this,
      o = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
    var i,
      u = 0;
    return function (t) {
      return e.enter("gfmFootnoteCall"), e.enter("gfmFootnoteCallLabelMarker"), e.consume(t), e.exit("gfmFootnoteCallLabelMarker"), c;
    };
    function c(t) {
      return 94 !== t ? n(t) : (e.enter("gfmFootnoteCallMarker"), e.consume(t), e.exit("gfmFootnoteCallMarker"), e.enter("gfmFootnoteCallString"), e.enter("chunkString").contentType = "string", a);
    }
    function a(c) {
      var f;
      return null === c || 91 === c || u++ > 999 ? n(c) : 93 === c ? i ? (e.exit("chunkString"), f = e.exit("gfmFootnoteCallString"), o.includes(M(r.sliceSerialize(f))) ? function (n) {
        return e.enter("gfmFootnoteCallLabelMarker"), e.consume(n), e.exit("gfmFootnoteCallLabelMarker"), e.exit("gfmFootnoteCall"), t;
      }(c) : n(c)) : n(c) : (e.consume(c), l(c) || (i = !0), 92 === c ? s : a);
    }
    function s(t) {
      return 91 === t || 92 === t || 93 === t ? (e.consume(t), u++, a) : a(t);
    }
  }
  function j(e, t, n) {
    var r = this,
      o = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
    var i,
      u,
      c = 0;
    return function (t) {
      return e.enter("gfmFootnoteDefinition")._container = !0, e.enter("gfmFootnoteDefinitionLabel"), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(t), e.exit("gfmFootnoteDefinitionLabelMarker"), a;
    };
    function a(t) {
      return 94 === t ? (e.enter("gfmFootnoteDefinitionMarker"), e.consume(t), e.exit("gfmFootnoteDefinitionMarker"), e.enter("gfmFootnoteDefinitionLabelString"), s) : n(t);
    }
    function s(t) {
      var o;
      return null === t || 91 === t || c > 999 ? n(t) : 93 === t ? u ? (o = e.exit("gfmFootnoteDefinitionLabelString"), i = M(r.sliceSerialize(o)), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(t), e.exit("gfmFootnoteDefinitionLabelMarker"), e.exit("gfmFootnoteDefinitionLabel"), m) : n(t) : f(t) ? (e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), c++, s) : (e.enter("chunkString").contentType = "string", p(t));
    }
    function p(t) {
      return null === t || f(t) || 91 === t || 93 === t || c > 999 ? (e.exit("chunkString"), s(t)) : (l(t) || (u = !0), c++, e.consume(t), 92 === t ? d : p);
    }
    function d(t) {
      return 91 === t || 92 === t || 93 === t ? (e.consume(t), c++, p) : p(t);
    }
    function m(t) {
      return 58 === t ? (e.enter("definitionMarker"), e.consume(t), e.exit("definitionMarker"), B(e, g, "gfmFootnoteDefinitionWhitespace")) : n(t);
    }
    function g(e) {
      return o.includes(i) || o.push(i), t(e);
    }
  }
  function U(e, t, n) {
    return e.check(R, t, e.attempt(N, t, n));
  }
  function H(e) {
    e.exit("gfmFootnoteDefinition");
  }
  function G(e, t, n, r) {
    var o = e.length;
    var i,
      u = 0;
    if (t = t < 0 ? -t > o ? 0 : o + t : t > o ? o : t, n = n > 0 ? n : 0, r.length < 1e4) i = Array.from(r), i.unshift(t, n), [].splice.apply(e, i);else for (n && [].splice.apply(e, [t, n]); u < r.length;) i = r.slice(u, u + 1e4), i.unshift(t, 0), [].splice.apply(e, i), u += 1e4, t += 1e4;
  }
  function Q(e, t) {
    return e.length > 0 ? (G(e, e.length, 0, t), e) : t;
  }
  var W = {}.hasOwnProperty;
  function Z(e, t) {
    var n;
    for (n in t) {
      var _r2 = (W.call(e, n) ? e[n] : void 0) || (e[n] = {}),
        _o = t[n];
      var _i = void 0;
      for (_i in _o) {
        W.call(_r2, _i) || (_r2[_i] = []);
        var _e3 = _o[_i];
        J(_r2[_i], Array.isArray(_e3) ? _e3 : _e3 ? [_e3] : []);
      }
    }
  }
  function J(e, t) {
    var n = -1;
    var r = [];
    for (; ++n < t.length;) ("after" === t[n].add ? e : r).push(t[n]);
    G(e, 0, 0, r);
  }
  var Y = {
      tokenize: function tokenize(e) {
        var t = e.attempt(this.parser.constructs.contentInitial, function (n) {
          if (null !== n) return e.enter("lineEnding"), e.consume(n), e.exit("lineEnding"), B(e, t, "linePrefix");
          e.consume(n);
        }, function (t) {
          return e.enter("paragraph"), r(t);
        });
        var n;
        return t;
        function r(t) {
          var r = e.enter("chunkText", {
            contentType: "text",
            previous: n
          });
          return n && (n.next = r), n = r, o(t);
        }
        function o(t) {
          return null === t ? (e.exit("chunkText"), e.exit("paragraph"), void e.consume(t)) : f(t) ? (e.consume(t), e.exit("chunkText"), r) : (e.consume(t), o);
        }
      }
    },
    K = {
      tokenize: function tokenize(e) {
        var t = this,
          n = [];
        var r,
          o,
          i,
          u = 0;
        return c;
        function c(r) {
          if (u < n.length) {
            var _o2 = n[u];
            return t.containerState = _o2[1], e.attempt(_o2[0].continuation, a, s)(r);
          }
          return s(r);
        }
        function a(e) {
          if (u++, t.containerState._closeFlow) {
            t.containerState._closeFlow = void 0, r && k();
            var _n = t.events.length;
            var _o3,
              _i2 = _n;
            for (; _i2--;) if ("exit" === t.events[_i2][0] && "chunkFlow" === t.events[_i2][1].type) {
              _o3 = t.events[_i2][1].end;
              break;
            }
            x(u);
            var _c = _n;
            for (; _c < t.events.length;) t.events[_c][1].end = Object.assign({}, _o3), _c++;
            return G(t.events, _i2 + 1, 0, t.events.slice(_n)), t.events.length = _c, s(e);
          }
          return c(e);
        }
        function s(o) {
          if (u === n.length) {
            if (!r) return d(o);
            if (r.currentConstruct && r.currentConstruct.concrete) return g(o);
            t.interrupt = Boolean(r.currentConstruct && !r._gfmTableDynamicInterruptHack);
          }
          return t.containerState = {}, e.check(X, l, p)(o);
        }
        function l(e) {
          return r && k(), x(u), d(e);
        }
        function p(e) {
          return t.parser.lazy[t.now().line] = u !== n.length, i = t.now().offset, g(e);
        }
        function d(n) {
          return t.containerState = {}, e.attempt(X, m, g)(n);
        }
        function m(e) {
          return u++, n.push([t.currentConstruct, t.containerState]), d(e);
        }
        function g(n) {
          return null === n ? (r && k(), x(0), void e.consume(n)) : (r = r || t.parser.flow(t.now()), e.enter("chunkFlow", {
            contentType: "flow",
            previous: o,
            _tokenizer: r
          }), h(n));
        }
        function h(n) {
          return null === n ? (b(e.exit("chunkFlow"), !0), x(0), void e.consume(n)) : f(n) ? (e.consume(n), b(e.exit("chunkFlow")), u = 0, t.interrupt = void 0, c) : (e.consume(n), h);
        }
        function b(e, n) {
          var c = t.sliceStream(e);
          if (n && c.push(null), e.previous = o, o && (o.next = e), o = e, r.defineSkip(e.start), r.write(c), t.parser.lazy[e.start.line]) {
            var _e4 = r.events.length;
            for (; _e4--;) if (r.events[_e4][1].start.offset < i && (!r.events[_e4][1].end || r.events[_e4][1].end.offset > i)) return;
            var _n2 = t.events.length;
            var _o4,
              _c2,
              _a = _n2;
            for (; _a--;) if ("exit" === t.events[_a][0] && "chunkFlow" === t.events[_a][1].type) {
              if (_o4) {
                _c2 = t.events[_a][1].end;
                break;
              }
              _o4 = !0;
            }
            for (x(u), _e4 = _n2; _e4 < t.events.length;) t.events[_e4][1].end = Object.assign({}, _c2), _e4++;
            G(t.events, _a + 1, 0, t.events.slice(_n2)), t.events.length = _e4;
          }
        }
        function x(r) {
          var o = n.length;
          for (; o-- > r;) {
            var _r3 = n[o];
            t.containerState = _r3[1], _r3[0].exit.call(t, e);
          }
          n.length = r;
        }
        function k() {
          r.write([null]), o = void 0, r = void 0, t.containerState._closeFlow = void 0;
        }
      }
    },
    X = {
      tokenize: function tokenize(e, t, n) {
        return B(e, e.attempt(this.parser.constructs.document, t, n), "linePrefix", this.parser.constructs.disable["null"].includes("codeIndented") ? void 0 : 4);
      }
    };
  function $(e) {
    var t = {};
    var n,
      r,
      o,
      i,
      u,
      c,
      a,
      s = -1;
    for (; ++s < e.length;) {
      for (; (s in t);) s = t[s];
      if (n = e[s], s && "chunkFlow" === n[1].type && "listItemPrefix" === e[s - 1][1].type && (c = n[1]._tokenizer.events, o = 0, o < c.length && "lineEndingBlank" === c[o][1].type && (o += 2), o < c.length && "content" === c[o][1].type)) for (; ++o < c.length && "content" !== c[o][1].type;) "chunkText" === c[o][1].type && (c[o][1]._isInFirstContentOfListItem = !0, o++);
      if ("enter" === n[0]) n[1].contentType && (Object.assign(t, ee(e, s)), s = t[s], a = !0);else if (n[1]._container) {
        for (o = s, r = void 0; o-- && (i = e[o], "lineEnding" === i[1].type || "lineEndingBlank" === i[1].type);) "enter" === i[0] && (r && (e[r][1].type = "lineEndingBlank"), i[1].type = "lineEnding", r = o);
        r && (n[1].end = Object.assign({}, e[r][1].start), u = e.slice(r, s), u.unshift(n), G(e, r, s - r + 1, u));
      }
    }
    return !a;
  }
  function ee(e, t) {
    var n = e[t][1],
      r = e[t][2];
    var o = t - 1;
    var i = [],
      u = n._tokenizer || r.parser[n.contentType](n.start),
      c = u.events,
      a = [],
      s = {};
    var l,
      f,
      p = -1,
      d = n,
      m = 0,
      g = 0;
    var h = [g];
    for (; d;) {
      for (; e[++o][1] !== d;);
      i.push(o), d._tokenizer || (l = r.sliceStream(d), d.next || l.push(null), f && u.defineSkip(d.start), d._isInFirstContentOfListItem && (u._gfmTasklistFirstContentOfListItem = !0), u.write(l), d._isInFirstContentOfListItem && (u._gfmTasklistFirstContentOfListItem = void 0)), f = d, d = d.next;
    }
    for (d = n; ++p < c.length;) "exit" === c[p][0] && "enter" === c[p - 1][0] && c[p][1].type === c[p - 1][1].type && c[p][1].start.line !== c[p][1].end.line && (g = p + 1, h.push(g), d._tokenizer = void 0, d.previous = void 0, d = d.next);
    for (u.events = [], d ? (d._tokenizer = void 0, d.previous = void 0) : h.pop(), p = h.length; p--;) {
      var _t = c.slice(h[p], h[p + 1]),
        _n3 = i.pop();
      a.unshift([_n3, _n3 + _t.length - 1]), G(e, _n3, 2, _t);
    }
    for (p = -1; ++p < a.length;) s[m + a[p][0]] = m + a[p][1], m += a[p][1] - a[p][0] - 1;
    return s;
  }
  var te = {
      tokenize: function tokenize(e, t) {
        var n;
        return function (t) {
          return e.enter("content"), n = e.enter("chunkContent", {
            contentType: "content"
          }), r(t);
        };
        function r(t) {
          return null === t ? o(t) : f(t) ? e.check(ne, i, o)(t) : (e.consume(t), r);
        }
        function o(n) {
          return e.exit("chunkContent"), e.exit("content"), t(n);
        }
        function i(t) {
          return e.consume(t), e.exit("chunkContent"), n.next = e.enter("chunkContent", {
            contentType: "content",
            previous: n
          }), n = n.next, r;
        }
      },
      resolve: function resolve(e) {
        return $(e), e;
      }
    },
    ne = {
      tokenize: function tokenize(e, t, n) {
        var r = this;
        return function (t) {
          return e.exit("chunkContent"), e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), B(e, o, "linePrefix");
        };
        function o(o) {
          if (null === o || f(o)) return n(o);
          var i = r.events[r.events.length - 1];
          return !r.parser.constructs.disable["null"].includes("codeIndented") && i && "linePrefix" === i[1].type && i[2].sliceSerialize(i[1], !0).length >= 4 ? t(o) : e.interrupt(r.parser.constructs.flow, n, t)(o);
        }
      },
      partial: !0
    },
    re = {
      tokenize: function tokenize(e) {
        var t = this,
          n = e.attempt(R, function (r) {
            if (null !== r) return e.enter("lineEndingBlank"), e.consume(r), e.exit("lineEndingBlank"), t.currentConstruct = void 0, n;
            e.consume(r);
          }, e.attempt(this.parser.constructs.flowInitial, r, B(e, e.attempt(this.parser.constructs.flow, r, e.attempt(te, r)), "linePrefix")));
        return n;
        function r(r) {
          if (null !== r) return e.enter("lineEnding"), e.consume(r), e.exit("lineEnding"), t.currentConstruct = void 0, n;
          e.consume(r);
        }
      }
    },
    oe = {
      resolveAll: ae()
    },
    ie = ce("string"),
    ue = ce("text");
  function ce(e) {
    return {
      tokenize: function tokenize(t) {
        var n = this,
          r = this.parser.constructs[e],
          o = t.attempt(r, i, u);
        return i;
        function i(e) {
          return a(e) ? o(e) : u(e);
        }
        function u(e) {
          if (null !== e) return t.enter("data"), t.consume(e), c;
          t.consume(e);
        }
        function c(e) {
          return a(e) ? (t.exit("data"), o(e)) : (t.consume(e), c);
        }
        function a(e) {
          if (null === e) return !0;
          var t = r[e];
          var o = -1;
          if (t) for (; ++o < t.length;) {
            var _e5 = t[o];
            if (!_e5.previous || _e5.previous.call(n, n.previous)) return !0;
          }
          return !1;
        }
      },
      resolveAll: ae("text" === e ? se : void 0)
    };
  }
  function ae(e) {
    return function (t, n) {
      var r,
        o = -1;
      for (; ++o <= t.length;) void 0 === r ? t[o] && "data" === t[o][1].type && (r = o, o++) : t[o] && "data" === t[o][1].type || (o !== r + 2 && (t[r][1].end = t[o - 1][1].end, t.splice(r + 2, o - r - 2), o = r + 2), r = void 0);
      return e ? e(t, n) : t;
    };
  }
  function se(e, t) {
    var n = 0;
    for (; ++n <= e.length;) if ((n === e.length || "lineEnding" === e[n][1].type) && "data" === e[n - 1][1].type) {
      var _r4 = e[n - 1][1],
        _o5 = t.sliceStream(_r4);
      var _i3 = void 0,
        _u = _o5.length,
        _c3 = -1,
        _a2 = 0;
      for (; _u--;) {
        var _e6 = _o5[_u];
        if ("string" == typeof _e6) {
          for (_c3 = _e6.length; 32 === _e6.charCodeAt(_c3 - 1);) _a2++, _c3--;
          if (_c3) break;
          _c3 = -1;
        } else if (-2 === _e6) _i3 = !0, _a2++;else if (-1 !== _e6) {
          _u++;
          break;
        }
      }
      if (_a2) {
        var _o6 = {
          type: n === e.length || _i3 || _a2 < 2 ? "lineSuffix" : "hardBreakTrailing",
          start: {
            line: _r4.end.line,
            column: _r4.end.column - _a2,
            offset: _r4.end.offset - _a2,
            _index: _r4.start._index + _u,
            _bufferIndex: _u ? _c3 : _r4.start._bufferIndex + _c3
          },
          end: Object.assign({}, _r4.end)
        };
        _r4.end = Object.assign({}, _o6.start), _r4.start.offset === _r4.end.offset ? Object.assign(_r4, _o6) : (e.splice(n, 0, ["enter", _o6, t], ["exit", _o6, t]), n += 2);
      }
      n++;
    }
    return e;
  }
  function le(e, t, n) {
    var r = [];
    var o = -1;
    for (; ++o < e.length;) {
      var _i4 = e[o].resolveAll;
      _i4 && !r.includes(_i4) && (t = _i4(t, n), r.push(_i4));
    }
    return t;
  }
  function fe(e, t, n) {
    var r = Object.assign(n ? Object.assign({}, n) : {
      line: 1,
      column: 1,
      offset: 0
    }, {
      _index: 0,
      _bufferIndex: -1
    });
    var o = {},
      i = [];
    var u = [],
      c = [],
      a = !0;
    var s = {
        consume: function consume(e) {
          f(e) ? (r.line++, r.column = 1, r.offset += -3 === e ? 2 : 1, v()) : -1 !== e && (r.column++, r.offset++), r._bufferIndex < 0 ? r._index++ : (r._bufferIndex++, r._bufferIndex === u[r._index].length && (r._bufferIndex = -1, r._index++)), l.previous = e, a = !0;
        },
        enter: function enter(e, t) {
          var n = t || {};
          return n.type = e, n.start = g(), l.events.push(["enter", n, l]), c.push(n), n;
        },
        exit: function exit(e) {
          var t = c.pop();
          return t.end = g(), l.events.push(["exit", t, l]), t;
        },
        attempt: x(function (e, t) {
          k(e, t.from);
        }),
        check: x(b),
        interrupt: x(b, {
          interrupt: !0
        })
      },
      l = {
        previous: null,
        code: null,
        containerState: {},
        events: [],
        parser: e,
        sliceStream: m,
        sliceSerialize: function sliceSerialize(e, t) {
          return function (e, t) {
            var n = -1;
            var r = [];
            var o;
            for (; ++n < e.length;) {
              var _i5 = e[n];
              var _u2 = void 0;
              if ("string" == typeof _i5) _u2 = _i5;else switch (_i5) {
                case -5:
                  _u2 = "\r";
                  break;
                case -4:
                  _u2 = "\n";
                  break;
                case -3:
                  _u2 = "\r\n";
                  break;
                case -2:
                  _u2 = t ? " " : "\t";
                  break;
                case -1:
                  if (!t && o) continue;
                  _u2 = " ";
                  break;
                default:
                  _u2 = String.fromCharCode(_i5);
              }
              o = -2 === _i5, r.push(_u2);
            }
            return r.join("");
          }(m(e), t);
        },
        now: g,
        defineSkip: function defineSkip(e) {
          o[e.line] = e.column, v();
        },
        write: function write(e) {
          return u = Q(u, e), function () {
            var e;
            for (; r._index < u.length;) {
              var _t2 = u[r._index];
              if ("string" == typeof _t2) for (e = r._index, r._bufferIndex < 0 && (r._bufferIndex = 0); r._index === e && r._bufferIndex < _t2.length;) h(_t2.charCodeAt(r._bufferIndex));else h(_t2);
            }
          }(), null !== u[u.length - 1] ? [] : (k(t, 0), l.events = le(i, l.events, l), l.events);
        }
      };
    var p,
      d = t.tokenize.call(l, s);
    return t.resolveAll && i.push(t), l;
    function m(e) {
      return function (e, t) {
        var n = t.start._index,
          r = t.start._bufferIndex,
          o = t.end._index,
          i = t.end._bufferIndex;
        var u;
        return n === o ? u = [e[n].slice(r, i)] : (u = e.slice(n, o), r > -1 && (u[0] = u[0].slice(r)), i > 0 && u.push(e[o].slice(0, i))), u;
      }(u, e);
    }
    function g() {
      return Object.assign({}, r);
    }
    function h(e) {
      a = void 0, p = e, d = d(e);
    }
    function b(e, t) {
      t.restore();
    }
    function x(e, t) {
      return function (n, o, i) {
        var u, f, p, d;
        return Array.isArray(n) ? h(n) : "tokenize" in n ? h([n]) : (m = n, function (e) {
          var t = null !== e && m[e],
            n = null !== e && m["null"];
          return h([].concat(_toConsumableArray(Array.isArray(t) ? t : t ? [t] : []), _toConsumableArray(Array.isArray(n) ? n : n ? [n] : [])))(e);
        });
        var m;
        function h(e) {
          return u = e, f = 0, 0 === e.length ? i : b(e[f]);
        }
        function b(e) {
          return function (n) {
            return d = function () {
              var e = g(),
                t = l.previous,
                n = l.currentConstruct,
                o = l.events.length,
                i = Array.from(c);
              return {
                restore: function restore() {
                  r = e, l.previous = t, l.currentConstruct = n, l.events.length = o, c = i, v();
                },
                from: o
              };
            }(), p = e, e.partial || (l.currentConstruct = e), e.name && l.parser.constructs.disable["null"].includes(e.name) ? k() : e.tokenize.call(t ? Object.assign(Object.create(l), t) : l, s, x, k)(n);
          };
        }
        function x(t) {
          return a = !0, e(p, d), o;
        }
        function k(e) {
          return a = !0, d.restore(), ++f < u.length ? b(u[f]) : i;
        }
      };
    }
    function k(e, t) {
      e.resolveAll && !i.includes(e) && i.push(e), e.resolve && G(l.events, t, l.events.length - t, e.resolve(l.events.slice(t), l)), e.resolveTo && (l.events = e.resolveTo(l.events, l));
    }
    function v() {
      r.line in o && r.column < 2 && (r.column = o[r.line], r.offset += o[r.line] - 1);
    }
  }
  var pe = {
      name: "thematicBreak",
      tokenize: function tokenize(e, t, n) {
        var r,
          o = 0;
        return function (t) {
          return e.enter("thematicBreak"), r = t, i(t);
        };
        function i(c) {
          return c === r ? (e.enter("thematicBreakSequence"), u(c)) : p(c) ? B(e, i, "whitespace")(c) : o < 3 || null !== c && !f(c) ? n(c) : (e.exit("thematicBreak"), t(c));
        }
        function u(t) {
          return t === r ? (e.consume(t), o++, u) : (e.exit("thematicBreakSequence"), i(t));
        }
      }
    },
    de = {
      name: "list",
      tokenize: function tokenize(e, t, n) {
        var r = this,
          i = r.events[r.events.length - 1];
        var u = i && "linePrefix" === i[1].type ? i[2].sliceSerialize(i[1], !0).length : 0,
          c = 0;
        return function (t) {
          var i = r.containerState.type || (42 === t || 43 === t || 45 === t ? "listUnordered" : "listOrdered");
          if ("listUnordered" === i ? !r.containerState.marker || t === r.containerState.marker : o(t)) {
            if (r.containerState.type || (r.containerState.type = i, e.enter(i, {
              _container: !0
            })), "listUnordered" === i) return e.enter("listItemPrefix"), 42 === t || 45 === t ? e.check(pe, n, s)(t) : s(t);
            if (!r.interrupt || 49 === t) return e.enter("listItemPrefix"), e.enter("listItemValue"), a(t);
          }
          return n(t);
        };
        function a(t) {
          return o(t) && ++c < 10 ? (e.consume(t), a) : (!r.interrupt || c < 2) && (r.containerState.marker ? t === r.containerState.marker : 41 === t || 46 === t) ? (e.exit("listItemValue"), s(t)) : n(t);
        }
        function s(t) {
          return e.enter("listItemMarker"), e.consume(t), e.exit("listItemMarker"), r.containerState.marker = r.containerState.marker || t, e.check(R, r.interrupt ? n : l, e.attempt(me, d, f));
        }
        function l(e) {
          return r.containerState.initialBlankLine = !0, u++, d(e);
        }
        function f(t) {
          return p(t) ? (e.enter("listItemPrefixWhitespace"), e.consume(t), e.exit("listItemPrefixWhitespace"), d) : n(t);
        }
        function d(n) {
          return r.containerState.size = u + r.sliceSerialize(e.exit("listItemPrefix"), !0).length, t(n);
        }
      },
      continuation: {
        tokenize: function tokenize(e, t, n) {
          var r = this;
          return r.containerState._closeFlow = void 0, e.check(R, function (n) {
            return r.containerState.furtherBlankLines = r.containerState.furtherBlankLines || r.containerState.initialBlankLine, B(e, t, "listItemIndent", r.containerState.size + 1)(n);
          }, function (n) {
            return r.containerState.furtherBlankLines || !p(n) ? (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, o(n)) : (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, e.attempt(ge, t, o)(n));
          });
          function o(o) {
            return r.containerState._closeFlow = !0, r.interrupt = void 0, B(e, e.attempt(de, t, n), "linePrefix", r.parser.constructs.disable["null"].includes("codeIndented") ? void 0 : 4)(o);
          }
        }
      },
      exit: function exit(e) {
        e.exit(this.containerState.type);
      }
    },
    me = {
      tokenize: function tokenize(e, t, n) {
        var r = this;
        return B(e, function (e) {
          var o = r.events[r.events.length - 1];
          return !p(e) && o && "listItemPrefixWhitespace" === o[1].type ? t(e) : n(e);
        }, "listItemPrefixWhitespace", r.parser.constructs.disable["null"].includes("codeIndented") ? void 0 : 5);
      },
      partial: !0
    },
    ge = {
      tokenize: function tokenize(e, t, n) {
        var r = this;
        return B(e, function (e) {
          var o = r.events[r.events.length - 1];
          return o && "listItemIndent" === o[1].type && o[2].sliceSerialize(o[1], !0).length === r.containerState.size ? t(e) : n(e);
        }, "listItemIndent", r.containerState.size + 1);
      },
      partial: !0
    },
    he = {
      name: "blockQuote",
      tokenize: function tokenize(e, t, n) {
        var r = this;
        return function (t) {
          if (62 === t) {
            var _n4 = r.containerState;
            return _n4.open || (e.enter("blockQuote", {
              _container: !0
            }), _n4.open = !0), e.enter("blockQuotePrefix"), e.enter("blockQuoteMarker"), e.consume(t), e.exit("blockQuoteMarker"), o;
          }
          return n(t);
        };
        function o(n) {
          return p(n) ? (e.enter("blockQuotePrefixWhitespace"), e.consume(n), e.exit("blockQuotePrefixWhitespace"), e.exit("blockQuotePrefix"), t) : (e.exit("blockQuotePrefix"), t(n));
        }
      },
      continuation: {
        tokenize: function tokenize(e, t, n) {
          return B(e, e.attempt(he, t, n), "linePrefix", this.parser.constructs.disable["null"].includes("codeIndented") ? void 0 : 4);
        }
      },
      exit: function exit(e) {
        e.exit("blockQuote");
      }
    };
  function be(e, t, n, r, o, i, u, c, a) {
    var p = a || Number.POSITIVE_INFINITY;
    var d = 0;
    return function (t) {
      return 60 === t ? (e.enter(r), e.enter(o), e.enter(i), e.consume(t), e.exit(i), m) : null === t || 41 === t || s(t) ? n(t) : (e.enter(r), e.enter(u), e.enter(c), e.enter("chunkString", {
        contentType: "string"
      }), b(t));
    };
    function m(n) {
      return 62 === n ? (e.enter(i), e.consume(n), e.exit(i), e.exit(o), e.exit(r), t) : (e.enter(c), e.enter("chunkString", {
        contentType: "string"
      }), g(n));
    }
    function g(t) {
      return 62 === t ? (e.exit("chunkString"), e.exit(c), m(t)) : null === t || 60 === t || f(t) ? n(t) : (e.consume(t), 92 === t ? h : g);
    }
    function h(t) {
      return 60 === t || 62 === t || 92 === t ? (e.consume(t), g) : g(t);
    }
    function b(o) {
      return 40 === o ? ++d > p ? n(o) : (e.consume(o), b) : 41 === o ? d-- ? (e.consume(o), b) : (e.exit("chunkString"), e.exit(c), e.exit(u), e.exit(r), t(o)) : null === o || l(o) ? d ? n(o) : (e.exit("chunkString"), e.exit(c), e.exit(u), e.exit(r), t(o)) : s(o) ? n(o) : (e.consume(o), 92 === o ? x : b);
    }
    function x(t) {
      return 40 === t || 41 === t || 92 === t ? (e.consume(t), b) : b(t);
    }
  }
  function xe(e, t, n, r, o, i) {
    var u = this;
    var c,
      a = 0;
    return function (t) {
      return e.enter(r), e.enter(o), e.consume(t), e.exit(o), e.enter(i), s;
    };
    function s(p) {
      return null === p || 91 === p || 93 === p && !c || 94 === p && !a && "_hiddenFootnoteSupport" in u.parser.constructs || a > 999 ? n(p) : 93 === p ? (e.exit(i), e.enter(o), e.consume(p), e.exit(o), e.exit(r), t) : f(p) ? (e.enter("lineEnding"), e.consume(p), e.exit("lineEnding"), s) : (e.enter("chunkString", {
        contentType: "string"
      }), l(p));
    }
    function l(t) {
      return null === t || 91 === t || 93 === t || f(t) || a++ > 999 ? (e.exit("chunkString"), s(t)) : (e.consume(t), c = c || !p(t), 92 === t ? d : l);
    }
    function d(t) {
      return 91 === t || 92 === t || 93 === t ? (e.consume(t), a++, l) : l(t);
    }
  }
  function ke(e, t, n, r, o, i) {
    var u;
    return function (t) {
      return e.enter(r), e.enter(o), e.consume(t), e.exit(o), u = 40 === t ? 41 : t, c;
    };
    function c(n) {
      return n === u ? (e.enter(o), e.consume(n), e.exit(o), e.exit(r), t) : (e.enter(i), a(n));
    }
    function a(t) {
      return t === u ? (e.exit(i), c(u)) : null === t ? n(t) : f(t) ? (e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), B(e, a, "linePrefix")) : (e.enter("chunkString", {
        contentType: "string"
      }), s(t));
    }
    function s(t) {
      return t === u || null === t || f(t) ? (e.exit("chunkString"), a(t)) : (e.consume(t), 92 === t ? l : s);
    }
    function l(t) {
      return t === u || 92 === t ? (e.consume(t), s) : s(t);
    }
  }
  function ve(e, t) {
    var n;
    return function r(o) {
      return f(o) ? (e.enter("lineEnding"), e.consume(o), e.exit("lineEnding"), n = !0, r) : p(o) ? B(e, r, n ? "linePrefix" : "lineSuffix")(o) : t(o);
    };
  }
  var ye = {
      name: "definition",
      tokenize: function tokenize(e, t, n) {
        var r = this;
        var o;
        return function (t) {
          return e.enter("definition"), xe.call(r, e, i, n, "definitionLabel", "definitionLabelMarker", "definitionLabelString")(t);
        };
        function i(t) {
          return o = M(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1)), 58 === t ? (e.enter("definitionMarker"), e.consume(t), e.exit("definitionMarker"), ve(e, be(e, e.attempt(we, B(e, u, "whitespace"), B(e, u, "whitespace")), n, "definitionDestination", "definitionDestinationLiteral", "definitionDestinationLiteralMarker", "definitionDestinationRaw", "definitionDestinationString"))) : n(t);
        }
        function u(i) {
          return null === i || f(i) ? (e.exit("definition"), r.parser.defined.includes(o) || r.parser.defined.push(o), t(i)) : n(i);
        }
      }
    },
    we = {
      tokenize: function tokenize(e, t, n) {
        return function (t) {
          return l(t) ? ve(e, r)(t) : n(t);
        };
        function r(t) {
          return 34 === t || 39 === t || 40 === t ? ke(e, B(e, o, "whitespace"), n, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(t) : n(t);
        }
        function o(e) {
          return null === e || f(e) ? t(e) : n(e);
        }
      },
      partial: !0
    },
    qe = {
      name: "codeIndented",
      tokenize: function tokenize(e, t, n) {
        var r = this;
        return function (t) {
          return e.enter("codeIndented"), B(e, o, "linePrefix", 5)(t);
        };
        function o(e) {
          var t = r.events[r.events.length - 1];
          return t && "linePrefix" === t[1].type && t[2].sliceSerialize(t[1], !0).length >= 4 ? i(e) : n(e);
        }
        function i(t) {
          return null === t ? c(t) : f(t) ? e.attempt(Se, i, c)(t) : (e.enter("codeFlowValue"), u(t));
        }
        function u(t) {
          return null === t || f(t) ? (e.exit("codeFlowValue"), i(t)) : (e.consume(t), u);
        }
        function c(n) {
          return e.exit("codeIndented"), t(n);
        }
      }
    },
    Se = {
      tokenize: function tokenize(e, t, n) {
        var r = this;
        return o;
        function o(t) {
          return r.parser.lazy[r.now().line] ? n(t) : f(t) ? (e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), o) : B(e, i, "linePrefix", 5)(t);
        }
        function i(e) {
          var i = r.events[r.events.length - 1];
          return i && "linePrefix" === i[1].type && i[2].sliceSerialize(i[1], !0).length >= 4 ? t(e) : f(e) ? o(e) : n(e);
        }
      },
      partial: !0
    },
    Fe = {
      name: "headingAtx",
      tokenize: function tokenize(e, t, n) {
        var r = this;
        var o = 0;
        return function (t) {
          return e.enter("atxHeading"), e.enter("atxHeadingSequence"), i(t);
        };
        function i(c) {
          return 35 === c && o++ < 6 ? (e.consume(c), i) : null === c || l(c) ? (e.exit("atxHeadingSequence"), r.interrupt ? t(c) : u(c)) : n(c);
        }
        function u(n) {
          return 35 === n ? (e.enter("atxHeadingSequence"), c(n)) : null === n || f(n) ? (e.exit("atxHeading"), t(n)) : p(n) ? B(e, u, "whitespace")(n) : (e.enter("atxHeadingText"), a(n));
        }
        function c(t) {
          return 35 === t ? (e.consume(t), c) : (e.exit("atxHeadingSequence"), u(t));
        }
        function a(t) {
          return null === t || 35 === t || l(t) ? (e.exit("atxHeadingText"), u(t)) : (e.consume(t), a);
        }
      },
      resolve: function resolve(e, t) {
        var n,
          r,
          o = e.length - 2,
          i = 3;
        return "whitespace" === e[i][1].type && (i += 2), o - 2 > i && "whitespace" === e[o][1].type && (o -= 2), "atxHeadingSequence" === e[o][1].type && (i === o - 1 || o - 4 > i && "whitespace" === e[o - 2][1].type) && (o -= i + 1 === o ? 2 : 4), o > i && (n = {
          type: "atxHeadingText",
          start: e[i][1].start,
          end: e[o][1].end
        }, r = {
          type: "chunkText",
          start: e[i][1].start,
          end: e[o][1].end,
          contentType: "text"
        }, G(e, i, o - i + 1, [["enter", n, t], ["enter", r, t], ["exit", r, t], ["exit", n, t]])), e;
      }
    },
    Ee = {
      name: "setextUnderline",
      tokenize: function tokenize(e, t, n) {
        var r = this;
        var o,
          i,
          u = r.events.length;
        for (; u--;) if ("lineEnding" !== r.events[u][1].type && "linePrefix" !== r.events[u][1].type && "content" !== r.events[u][1].type) {
          i = "paragraph" === r.events[u][1].type;
          break;
        }
        return function (t) {
          return r.parser.lazy[r.now().line] || !r.interrupt && !i ? n(t) : (e.enter("setextHeadingLine"), e.enter("setextHeadingLineSequence"), o = t, c(t));
        };
        function c(t) {
          return t === o ? (e.consume(t), c) : (e.exit("setextHeadingLineSequence"), B(e, a, "lineSuffix")(t));
        }
        function a(r) {
          return null === r || f(r) ? (e.exit("setextHeadingLine"), t(r)) : n(r);
        }
      },
      resolveTo: function resolveTo(e, t) {
        var n,
          r,
          o,
          i = e.length;
        for (; i--;) if ("enter" === e[i][0]) {
          if ("content" === e[i][1].type) {
            n = i;
            break;
          }
          "paragraph" === e[i][1].type && (r = i);
        } else "content" === e[i][1].type && e.splice(i, 1), o || "definition" !== e[i][1].type || (o = i);
        var u = {
          type: "setextHeading",
          start: Object.assign({}, e[r][1].start),
          end: Object.assign({}, e[e.length - 1][1].end)
        };
        return e[r][1].type = "setextHeadingText", o ? (e.splice(r, 0, ["enter", u, t]), e.splice(o + 1, 0, ["exit", e[n][1], t]), e[n][1].end = Object.assign({}, e[o][1].end)) : e[n][1] = u, e.push(["exit", u, t]), e;
      }
    },
    Ae = ["address", "article", "aside", "base", "basefont", "blockquote", "body", "caption", "center", "col", "colgroup", "dd", "details", "dialog", "dir", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html", "iframe", "legend", "li", "link", "main", "menu", "menuitem", "nav", "noframes", "ol", "optgroup", "option", "p", "param", "section", "summary", "table", "tbody", "td", "tfoot", "th", "thead", "title", "tr", "track", "ul"],
    De = ["pre", "script", "style", "textarea"],
    Le = {
      name: "htmlFlow",
      tokenize: function tokenize(e, t, n) {
        var o = this;
        var i, c, a, s, d;
        return function (t) {
          return e.enter("htmlFlow"), e.enter("htmlFlowData"), e.consume(t), m;
        };
        function m(u) {
          return 33 === u ? (e.consume(u), g) : 47 === u ? (e.consume(u), x) : 63 === u ? (e.consume(u), i = 3, o.interrupt ? t : P) : r(u) ? (e.consume(u), a = String.fromCharCode(u), c = !0, k) : n(u);
        }
        function g(u) {
          return 45 === u ? (e.consume(u), i = 2, h) : 91 === u ? (e.consume(u), i = 5, a = "CDATA[", s = 0, b) : r(u) ? (e.consume(u), i = 4, o.interrupt ? t : P) : n(u);
        }
        function h(r) {
          return 45 === r ? (e.consume(r), o.interrupt ? t : P) : n(r);
        }
        function b(r) {
          return r === a.charCodeAt(s++) ? (e.consume(r), s === a.length ? o.interrupt ? t : C : b) : n(r);
        }
        function x(t) {
          return r(t) ? (e.consume(t), a = String.fromCharCode(t), k) : n(t);
        }
        function k(r) {
          return null === r || 47 === r || 62 === r || l(r) ? 47 !== r && c && De.includes(a.toLowerCase()) ? (i = 1, o.interrupt ? t(r) : C(r)) : Ae.includes(a.toLowerCase()) ? (i = 6, 47 === r ? (e.consume(r), v) : o.interrupt ? t(r) : C(r)) : (i = 7, o.interrupt && !o.parser.lazy[o.now().line] ? n(r) : c ? w(r) : y(r)) : 45 === r || u(r) ? (e.consume(r), a += String.fromCharCode(r), k) : n(r);
        }
        function v(r) {
          return 62 === r ? (e.consume(r), o.interrupt ? t : C) : n(r);
        }
        function y(t) {
          return p(t) ? (e.consume(t), y) : L(t);
        }
        function w(t) {
          return 47 === t ? (e.consume(t), L) : 58 === t || 95 === t || r(t) ? (e.consume(t), q) : p(t) ? (e.consume(t), w) : L(t);
        }
        function q(t) {
          return 45 === t || 46 === t || 58 === t || 95 === t || u(t) ? (e.consume(t), q) : S(t);
        }
        function S(t) {
          return 61 === t ? (e.consume(t), F) : p(t) ? (e.consume(t), S) : w(t);
        }
        function F(t) {
          return null === t || 60 === t || 61 === t || 62 === t || 96 === t ? n(t) : 34 === t || 39 === t ? (e.consume(t), d = t, E) : p(t) ? (e.consume(t), F) : (d = null, A(t));
        }
        function E(t) {
          return null === t || f(t) ? n(t) : t === d ? (e.consume(t), D) : (e.consume(t), E);
        }
        function A(t) {
          return null === t || 34 === t || 39 === t || 60 === t || 61 === t || 62 === t || 96 === t || l(t) ? S(t) : (e.consume(t), A);
        }
        function D(e) {
          return 47 === e || 62 === e || p(e) ? w(e) : n(e);
        }
        function L(t) {
          return 62 === t ? (e.consume(t), T) : n(t);
        }
        function T(t) {
          return p(t) ? (e.consume(t), T) : null === t || f(t) ? C(t) : n(t);
        }
        function C(t) {
          return 45 === t && 2 === i ? (e.consume(t), R) : 60 === t && 1 === i ? (e.consume(t), M) : 62 === t && 4 === i ? (e.consume(t), _) : 63 === t && 3 === i ? (e.consume(t), P) : 93 === t && 5 === i ? (e.consume(t), O) : !f(t) || 6 !== i && 7 !== i ? null === t || f(t) ? z(t) : (e.consume(t), C) : e.check(Te, _, z)(t);
        }
        function z(t) {
          return e.exit("htmlFlowData"), I(t);
        }
        function I(t) {
          return null === t ? V(t) : f(t) ? e.attempt({
            tokenize: B,
            partial: !0
          }, I, V)(t) : (e.enter("htmlFlowData"), C(t));
        }
        function B(e, t, n) {
          return function (t) {
            return e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), r;
          };
          function r(e) {
            return o.parser.lazy[o.now().line] ? n(e) : t(e);
          }
        }
        function R(t) {
          return 45 === t ? (e.consume(t), P) : C(t);
        }
        function M(t) {
          return 47 === t ? (e.consume(t), a = "", N) : C(t);
        }
        function N(t) {
          return 62 === t && De.includes(a.toLowerCase()) ? (e.consume(t), _) : r(t) && a.length < 8 ? (e.consume(t), a += String.fromCharCode(t), N) : C(t);
        }
        function O(t) {
          return 93 === t ? (e.consume(t), P) : C(t);
        }
        function P(t) {
          return 62 === t ? (e.consume(t), _) : 45 === t && 2 === i ? (e.consume(t), P) : C(t);
        }
        function _(t) {
          return null === t || f(t) ? (e.exit("htmlFlowData"), V(t)) : (e.consume(t), _);
        }
        function V(n) {
          return e.exit("htmlFlow"), t(n);
        }
      },
      resolveTo: function resolveTo(e) {
        var t = e.length;
        for (; t-- && ("enter" !== e[t][0] || "htmlFlow" !== e[t][1].type););
        return t > 1 && "linePrefix" === e[t - 2][1].type && (e[t][1].start = e[t - 2][1].start, e[t + 1][1].start = e[t - 2][1].start, e.splice(t - 2, 2)), e;
      },
      concrete: !0
    },
    Te = {
      tokenize: function tokenize(e, t, n) {
        return function (r) {
          return e.exit("htmlFlowData"), e.enter("lineEndingBlank"), e.consume(r), e.exit("lineEndingBlank"), e.attempt(R, t, n);
        };
      },
      partial: !0
    },
    Ce = {
      name: "codeFenced",
      tokenize: function tokenize(e, t, n) {
        var r = this,
          o = {
            tokenize: function tokenize(e, t, n) {
              var r = 0;
              return B(e, function (t) {
                return e.enter("codeFencedFence"), e.enter("codeFencedFenceSequence"), o(t);
              }, "linePrefix", this.parser.constructs.disable["null"].includes("codeIndented") ? void 0 : 4);
              function o(t) {
                return t === a ? (e.consume(t), r++, o) : r < s ? n(t) : (e.exit("codeFencedFenceSequence"), B(e, i, "whitespace")(t));
              }
              function i(r) {
                return null === r || f(r) ? (e.exit("codeFencedFence"), t(r)) : n(r);
              }
            },
            partial: !0
          },
          i = {
            tokenize: function tokenize(e, t, n) {
              var r = this;
              return function (t) {
                return e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), o;
              };
              function o(e) {
                return r.parser.lazy[r.now().line] ? n(e) : t(e);
              }
            },
            partial: !0
          },
          u = this.events[this.events.length - 1],
          c = u && "linePrefix" === u[1].type ? u[2].sliceSerialize(u[1], !0).length : 0;
        var a,
          s = 0;
        return function (t) {
          return e.enter("codeFenced"), e.enter("codeFencedFence"), e.enter("codeFencedFenceSequence"), a = t, p(t);
        };
        function p(t) {
          return t === a ? (e.consume(t), s++, p) : (e.exit("codeFencedFenceSequence"), s < 3 ? n(t) : B(e, d, "whitespace")(t));
        }
        function d(t) {
          return null === t || f(t) ? b(t) : (e.enter("codeFencedFenceInfo"), e.enter("chunkString", {
            contentType: "string"
          }), m(t));
        }
        function m(t) {
          return null === t || l(t) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), B(e, g, "whitespace")(t)) : 96 === t && t === a ? n(t) : (e.consume(t), m);
        }
        function g(t) {
          return null === t || f(t) ? b(t) : (e.enter("codeFencedFenceMeta"), e.enter("chunkString", {
            contentType: "string"
          }), h(t));
        }
        function h(t) {
          return null === t || f(t) ? (e.exit("chunkString"), e.exit("codeFencedFenceMeta"), b(t)) : 96 === t && t === a ? n(t) : (e.consume(t), h);
        }
        function b(n) {
          return e.exit("codeFencedFence"), r.interrupt ? t(n) : x(n);
        }
        function x(t) {
          return null === t ? v(t) : f(t) ? e.attempt(i, e.attempt(o, v, c ? B(e, x, "linePrefix", c + 1) : x), v)(t) : (e.enter("codeFlowValue"), k(t));
        }
        function k(t) {
          return null === t || f(t) ? (e.exit("codeFlowValue"), x(t)) : (e.consume(t), k);
        }
        function v(n) {
          return e.exit("codeFenced"), t(n);
        }
      },
      concrete: !0
    },
    ze = {
      AElig: "Æ",
      AMP: "&",
      Aacute: "Á",
      Abreve: "Ă",
      Acirc: "Â",
      Acy: "А",
      Afr: "𝔄",
      Agrave: "À",
      Alpha: "Α",
      Amacr: "Ā",
      And: "⩓",
      Aogon: "Ą",
      Aopf: "𝔸",
      ApplyFunction: "⁡",
      Aring: "Å",
      Ascr: "𝒜",
      Assign: "≔",
      Atilde: "Ã",
      Auml: "Ä",
      Backslash: "∖",
      Barv: "⫧",
      Barwed: "⌆",
      Bcy: "Б",
      Because: "∵",
      Bernoullis: "ℬ",
      Beta: "Β",
      Bfr: "𝔅",
      Bopf: "𝔹",
      Breve: "˘",
      Bscr: "ℬ",
      Bumpeq: "≎",
      CHcy: "Ч",
      COPY: "©",
      Cacute: "Ć",
      Cap: "⋒",
      CapitalDifferentialD: "ⅅ",
      Cayleys: "ℭ",
      Ccaron: "Č",
      Ccedil: "Ç",
      Ccirc: "Ĉ",
      Cconint: "∰",
      Cdot: "Ċ",
      Cedilla: "¸",
      CenterDot: "·",
      Cfr: "ℭ",
      Chi: "Χ",
      CircleDot: "⊙",
      CircleMinus: "⊖",
      CirclePlus: "⊕",
      CircleTimes: "⊗",
      ClockwiseContourIntegral: "∲",
      CloseCurlyDoubleQuote: "”",
      CloseCurlyQuote: "’",
      Colon: "∷",
      Colone: "⩴",
      Congruent: "≡",
      Conint: "∯",
      ContourIntegral: "∮",
      Copf: "ℂ",
      Coproduct: "∐",
      CounterClockwiseContourIntegral: "∳",
      Cross: "⨯",
      Cscr: "𝒞",
      Cup: "⋓",
      CupCap: "≍",
      DD: "ⅅ",
      DDotrahd: "⤑",
      DJcy: "Ђ",
      DScy: "Ѕ",
      DZcy: "Џ",
      Dagger: "‡",
      Darr: "↡",
      Dashv: "⫤",
      Dcaron: "Ď",
      Dcy: "Д",
      Del: "∇",
      Delta: "Δ",
      Dfr: "𝔇",
      DiacriticalAcute: "´",
      DiacriticalDot: "˙",
      DiacriticalDoubleAcute: "˝",
      DiacriticalGrave: "`",
      DiacriticalTilde: "˜",
      Diamond: "⋄",
      DifferentialD: "ⅆ",
      Dopf: "𝔻",
      Dot: "¨",
      DotDot: "⃜",
      DotEqual: "≐",
      DoubleContourIntegral: "∯",
      DoubleDot: "¨",
      DoubleDownArrow: "⇓",
      DoubleLeftArrow: "⇐",
      DoubleLeftRightArrow: "⇔",
      DoubleLeftTee: "⫤",
      DoubleLongLeftArrow: "⟸",
      DoubleLongLeftRightArrow: "⟺",
      DoubleLongRightArrow: "⟹",
      DoubleRightArrow: "⇒",
      DoubleRightTee: "⊨",
      DoubleUpArrow: "⇑",
      DoubleUpDownArrow: "⇕",
      DoubleVerticalBar: "∥",
      DownArrow: "↓",
      DownArrowBar: "⤓",
      DownArrowUpArrow: "⇵",
      DownBreve: "̑",
      DownLeftRightVector: "⥐",
      DownLeftTeeVector: "⥞",
      DownLeftVector: "↽",
      DownLeftVectorBar: "⥖",
      DownRightTeeVector: "⥟",
      DownRightVector: "⇁",
      DownRightVectorBar: "⥗",
      DownTee: "⊤",
      DownTeeArrow: "↧",
      Downarrow: "⇓",
      Dscr: "𝒟",
      Dstrok: "Đ",
      ENG: "Ŋ",
      ETH: "Ð",
      Eacute: "É",
      Ecaron: "Ě",
      Ecirc: "Ê",
      Ecy: "Э",
      Edot: "Ė",
      Efr: "𝔈",
      Egrave: "È",
      Element: "∈",
      Emacr: "Ē",
      EmptySmallSquare: "◻",
      EmptyVerySmallSquare: "▫",
      Eogon: "Ę",
      Eopf: "𝔼",
      Epsilon: "Ε",
      Equal: "⩵",
      EqualTilde: "≂",
      Equilibrium: "⇌",
      Escr: "ℰ",
      Esim: "⩳",
      Eta: "Η",
      Euml: "Ë",
      Exists: "∃",
      ExponentialE: "ⅇ",
      Fcy: "Ф",
      Ffr: "𝔉",
      FilledSmallSquare: "◼",
      FilledVerySmallSquare: "▪",
      Fopf: "𝔽",
      ForAll: "∀",
      Fouriertrf: "ℱ",
      Fscr: "ℱ",
      GJcy: "Ѓ",
      GT: ">",
      Gamma: "Γ",
      Gammad: "Ϝ",
      Gbreve: "Ğ",
      Gcedil: "Ģ",
      Gcirc: "Ĝ",
      Gcy: "Г",
      Gdot: "Ġ",
      Gfr: "𝔊",
      Gg: "⋙",
      Gopf: "𝔾",
      GreaterEqual: "≥",
      GreaterEqualLess: "⋛",
      GreaterFullEqual: "≧",
      GreaterGreater: "⪢",
      GreaterLess: "≷",
      GreaterSlantEqual: "⩾",
      GreaterTilde: "≳",
      Gscr: "𝒢",
      Gt: "≫",
      HARDcy: "Ъ",
      Hacek: "ˇ",
      Hat: "^",
      Hcirc: "Ĥ",
      Hfr: "ℌ",
      HilbertSpace: "ℋ",
      Hopf: "ℍ",
      HorizontalLine: "─",
      Hscr: "ℋ",
      Hstrok: "Ħ",
      HumpDownHump: "≎",
      HumpEqual: "≏",
      IEcy: "Е",
      IJlig: "Ĳ",
      IOcy: "Ё",
      Iacute: "Í",
      Icirc: "Î",
      Icy: "И",
      Idot: "İ",
      Ifr: "ℑ",
      Igrave: "Ì",
      Im: "ℑ",
      Imacr: "Ī",
      ImaginaryI: "ⅈ",
      Implies: "⇒",
      Int: "∬",
      Integral: "∫",
      Intersection: "⋂",
      InvisibleComma: "⁣",
      InvisibleTimes: "⁢",
      Iogon: "Į",
      Iopf: "𝕀",
      Iota: "Ι",
      Iscr: "ℐ",
      Itilde: "Ĩ",
      Iukcy: "І",
      Iuml: "Ï",
      Jcirc: "Ĵ",
      Jcy: "Й",
      Jfr: "𝔍",
      Jopf: "𝕁",
      Jscr: "𝒥",
      Jsercy: "Ј",
      Jukcy: "Є",
      KHcy: "Х",
      KJcy: "Ќ",
      Kappa: "Κ",
      Kcedil: "Ķ",
      Kcy: "К",
      Kfr: "𝔎",
      Kopf: "𝕂",
      Kscr: "𝒦",
      LJcy: "Љ",
      LT: "<",
      Lacute: "Ĺ",
      Lambda: "Λ",
      Lang: "⟪",
      Laplacetrf: "ℒ",
      Larr: "↞",
      Lcaron: "Ľ",
      Lcedil: "Ļ",
      Lcy: "Л",
      LeftAngleBracket: "⟨",
      LeftArrow: "←",
      LeftArrowBar: "⇤",
      LeftArrowRightArrow: "⇆",
      LeftCeiling: "⌈",
      LeftDoubleBracket: "⟦",
      LeftDownTeeVector: "⥡",
      LeftDownVector: "⇃",
      LeftDownVectorBar: "⥙",
      LeftFloor: "⌊",
      LeftRightArrow: "↔",
      LeftRightVector: "⥎",
      LeftTee: "⊣",
      LeftTeeArrow: "↤",
      LeftTeeVector: "⥚",
      LeftTriangle: "⊲",
      LeftTriangleBar: "⧏",
      LeftTriangleEqual: "⊴",
      LeftUpDownVector: "⥑",
      LeftUpTeeVector: "⥠",
      LeftUpVector: "↿",
      LeftUpVectorBar: "⥘",
      LeftVector: "↼",
      LeftVectorBar: "⥒",
      Leftarrow: "⇐",
      Leftrightarrow: "⇔",
      LessEqualGreater: "⋚",
      LessFullEqual: "≦",
      LessGreater: "≶",
      LessLess: "⪡",
      LessSlantEqual: "⩽",
      LessTilde: "≲",
      Lfr: "𝔏",
      Ll: "⋘",
      Lleftarrow: "⇚",
      Lmidot: "Ŀ",
      LongLeftArrow: "⟵",
      LongLeftRightArrow: "⟷",
      LongRightArrow: "⟶",
      Longleftarrow: "⟸",
      Longleftrightarrow: "⟺",
      Longrightarrow: "⟹",
      Lopf: "𝕃",
      LowerLeftArrow: "↙",
      LowerRightArrow: "↘",
      Lscr: "ℒ",
      Lsh: "↰",
      Lstrok: "Ł",
      Lt: "≪",
      Map: "⤅",
      Mcy: "М",
      MediumSpace: " ",
      Mellintrf: "ℳ",
      Mfr: "𝔐",
      MinusPlus: "∓",
      Mopf: "𝕄",
      Mscr: "ℳ",
      Mu: "Μ",
      NJcy: "Њ",
      Nacute: "Ń",
      Ncaron: "Ň",
      Ncedil: "Ņ",
      Ncy: "Н",
      NegativeMediumSpace: "​",
      NegativeThickSpace: "​",
      NegativeThinSpace: "​",
      NegativeVeryThinSpace: "​",
      NestedGreaterGreater: "≫",
      NestedLessLess: "≪",
      NewLine: "\n",
      Nfr: "𝔑",
      NoBreak: "⁠",
      NonBreakingSpace: " ",
      Nopf: "ℕ",
      Not: "⫬",
      NotCongruent: "≢",
      NotCupCap: "≭",
      NotDoubleVerticalBar: "∦",
      NotElement: "∉",
      NotEqual: "≠",
      NotEqualTilde: "≂̸",
      NotExists: "∄",
      NotGreater: "≯",
      NotGreaterEqual: "≱",
      NotGreaterFullEqual: "≧̸",
      NotGreaterGreater: "≫̸",
      NotGreaterLess: "≹",
      NotGreaterSlantEqual: "⩾̸",
      NotGreaterTilde: "≵",
      NotHumpDownHump: "≎̸",
      NotHumpEqual: "≏̸",
      NotLeftTriangle: "⋪",
      NotLeftTriangleBar: "⧏̸",
      NotLeftTriangleEqual: "⋬",
      NotLess: "≮",
      NotLessEqual: "≰",
      NotLessGreater: "≸",
      NotLessLess: "≪̸",
      NotLessSlantEqual: "⩽̸",
      NotLessTilde: "≴",
      NotNestedGreaterGreater: "⪢̸",
      NotNestedLessLess: "⪡̸",
      NotPrecedes: "⊀",
      NotPrecedesEqual: "⪯̸",
      NotPrecedesSlantEqual: "⋠",
      NotReverseElement: "∌",
      NotRightTriangle: "⋫",
      NotRightTriangleBar: "⧐̸",
      NotRightTriangleEqual: "⋭",
      NotSquareSubset: "⊏̸",
      NotSquareSubsetEqual: "⋢",
      NotSquareSuperset: "⊐̸",
      NotSquareSupersetEqual: "⋣",
      NotSubset: "⊂⃒",
      NotSubsetEqual: "⊈",
      NotSucceeds: "⊁",
      NotSucceedsEqual: "⪰̸",
      NotSucceedsSlantEqual: "⋡",
      NotSucceedsTilde: "≿̸",
      NotSuperset: "⊃⃒",
      NotSupersetEqual: "⊉",
      NotTilde: "≁",
      NotTildeEqual: "≄",
      NotTildeFullEqual: "≇",
      NotTildeTilde: "≉",
      NotVerticalBar: "∤",
      Nscr: "𝒩",
      Ntilde: "Ñ",
      Nu: "Ν",
      OElig: "Œ",
      Oacute: "Ó",
      Ocirc: "Ô",
      Ocy: "О",
      Odblac: "Ő",
      Ofr: "𝔒",
      Ograve: "Ò",
      Omacr: "Ō",
      Omega: "Ω",
      Omicron: "Ο",
      Oopf: "𝕆",
      OpenCurlyDoubleQuote: "“",
      OpenCurlyQuote: "‘",
      Or: "⩔",
      Oscr: "𝒪",
      Oslash: "Ø",
      Otilde: "Õ",
      Otimes: "⨷",
      Ouml: "Ö",
      OverBar: "‾",
      OverBrace: "⏞",
      OverBracket: "⎴",
      OverParenthesis: "⏜",
      PartialD: "∂",
      Pcy: "П",
      Pfr: "𝔓",
      Phi: "Φ",
      Pi: "Π",
      PlusMinus: "±",
      Poincareplane: "ℌ",
      Popf: "ℙ",
      Pr: "⪻",
      Precedes: "≺",
      PrecedesEqual: "⪯",
      PrecedesSlantEqual: "≼",
      PrecedesTilde: "≾",
      Prime: "″",
      Product: "∏",
      Proportion: "∷",
      Proportional: "∝",
      Pscr: "𝒫",
      Psi: "Ψ",
      QUOT: '"',
      Qfr: "𝔔",
      Qopf: "ℚ",
      Qscr: "𝒬",
      RBarr: "⤐",
      REG: "®",
      Racute: "Ŕ",
      Rang: "⟫",
      Rarr: "↠",
      Rarrtl: "⤖",
      Rcaron: "Ř",
      Rcedil: "Ŗ",
      Rcy: "Р",
      Re: "ℜ",
      ReverseElement: "∋",
      ReverseEquilibrium: "⇋",
      ReverseUpEquilibrium: "⥯",
      Rfr: "ℜ",
      Rho: "Ρ",
      RightAngleBracket: "⟩",
      RightArrow: "→",
      RightArrowBar: "⇥",
      RightArrowLeftArrow: "⇄",
      RightCeiling: "⌉",
      RightDoubleBracket: "⟧",
      RightDownTeeVector: "⥝",
      RightDownVector: "⇂",
      RightDownVectorBar: "⥕",
      RightFloor: "⌋",
      RightTee: "⊢",
      RightTeeArrow: "↦",
      RightTeeVector: "⥛",
      RightTriangle: "⊳",
      RightTriangleBar: "⧐",
      RightTriangleEqual: "⊵",
      RightUpDownVector: "⥏",
      RightUpTeeVector: "⥜",
      RightUpVector: "↾",
      RightUpVectorBar: "⥔",
      RightVector: "⇀",
      RightVectorBar: "⥓",
      Rightarrow: "⇒",
      Ropf: "ℝ",
      RoundImplies: "⥰",
      Rrightarrow: "⇛",
      Rscr: "ℛ",
      Rsh: "↱",
      RuleDelayed: "⧴",
      SHCHcy: "Щ",
      SHcy: "Ш",
      SOFTcy: "Ь",
      Sacute: "Ś",
      Sc: "⪼",
      Scaron: "Š",
      Scedil: "Ş",
      Scirc: "Ŝ",
      Scy: "С",
      Sfr: "𝔖",
      ShortDownArrow: "↓",
      ShortLeftArrow: "←",
      ShortRightArrow: "→",
      ShortUpArrow: "↑",
      Sigma: "Σ",
      SmallCircle: "∘",
      Sopf: "𝕊",
      Sqrt: "√",
      Square: "□",
      SquareIntersection: "⊓",
      SquareSubset: "⊏",
      SquareSubsetEqual: "⊑",
      SquareSuperset: "⊐",
      SquareSupersetEqual: "⊒",
      SquareUnion: "⊔",
      Sscr: "𝒮",
      Star: "⋆",
      Sub: "⋐",
      Subset: "⋐",
      SubsetEqual: "⊆",
      Succeeds: "≻",
      SucceedsEqual: "⪰",
      SucceedsSlantEqual: "≽",
      SucceedsTilde: "≿",
      SuchThat: "∋",
      Sum: "∑",
      Sup: "⋑",
      Superset: "⊃",
      SupersetEqual: "⊇",
      Supset: "⋑",
      THORN: "Þ",
      TRADE: "™",
      TSHcy: "Ћ",
      TScy: "Ц",
      Tab: "\t",
      Tau: "Τ",
      Tcaron: "Ť",
      Tcedil: "Ţ",
      Tcy: "Т",
      Tfr: "𝔗",
      Therefore: "∴",
      Theta: "Θ",
      ThickSpace: "  ",
      ThinSpace: " ",
      Tilde: "∼",
      TildeEqual: "≃",
      TildeFullEqual: "≅",
      TildeTilde: "≈",
      Topf: "𝕋",
      TripleDot: "⃛",
      Tscr: "𝒯",
      Tstrok: "Ŧ",
      Uacute: "Ú",
      Uarr: "↟",
      Uarrocir: "⥉",
      Ubrcy: "Ў",
      Ubreve: "Ŭ",
      Ucirc: "Û",
      Ucy: "У",
      Udblac: "Ű",
      Ufr: "𝔘",
      Ugrave: "Ù",
      Umacr: "Ū",
      UnderBar: "_",
      UnderBrace: "⏟",
      UnderBracket: "⎵",
      UnderParenthesis: "⏝",
      Union: "⋃",
      UnionPlus: "⊎",
      Uogon: "Ų",
      Uopf: "𝕌",
      UpArrow: "↑",
      UpArrowBar: "⤒",
      UpArrowDownArrow: "⇅",
      UpDownArrow: "↕",
      UpEquilibrium: "⥮",
      UpTee: "⊥",
      UpTeeArrow: "↥",
      Uparrow: "⇑",
      Updownarrow: "⇕",
      UpperLeftArrow: "↖",
      UpperRightArrow: "↗",
      Upsi: "ϒ",
      Upsilon: "Υ",
      Uring: "Ů",
      Uscr: "𝒰",
      Utilde: "Ũ",
      Uuml: "Ü",
      VDash: "⊫",
      Vbar: "⫫",
      Vcy: "В",
      Vdash: "⊩",
      Vdashl: "⫦",
      Vee: "⋁",
      Verbar: "‖",
      Vert: "‖",
      VerticalBar: "∣",
      VerticalLine: "|",
      VerticalSeparator: "❘",
      VerticalTilde: "≀",
      VeryThinSpace: " ",
      Vfr: "𝔙",
      Vopf: "𝕍",
      Vscr: "𝒱",
      Vvdash: "⊪",
      Wcirc: "Ŵ",
      Wedge: "⋀",
      Wfr: "𝔚",
      Wopf: "𝕎",
      Wscr: "𝒲",
      Xfr: "𝔛",
      Xi: "Ξ",
      Xopf: "𝕏",
      Xscr: "𝒳",
      YAcy: "Я",
      YIcy: "Ї",
      YUcy: "Ю",
      Yacute: "Ý",
      Ycirc: "Ŷ",
      Ycy: "Ы",
      Yfr: "𝔜",
      Yopf: "𝕐",
      Yscr: "𝒴",
      Yuml: "Ÿ",
      ZHcy: "Ж",
      Zacute: "Ź",
      Zcaron: "Ž",
      Zcy: "З",
      Zdot: "Ż",
      ZeroWidthSpace: "​",
      Zeta: "Ζ",
      Zfr: "ℨ",
      Zopf: "ℤ",
      Zscr: "𝒵",
      aacute: "á",
      abreve: "ă",
      ac: "∾",
      acE: "∾̳",
      acd: "∿",
      acirc: "â",
      acute: "´",
      acy: "а",
      aelig: "æ",
      af: "⁡",
      afr: "𝔞",
      agrave: "à",
      alefsym: "ℵ",
      aleph: "ℵ",
      alpha: "α",
      amacr: "ā",
      amalg: "⨿",
      amp: "&",
      and: "∧",
      andand: "⩕",
      andd: "⩜",
      andslope: "⩘",
      andv: "⩚",
      ang: "∠",
      ange: "⦤",
      angle: "∠",
      angmsd: "∡",
      angmsdaa: "⦨",
      angmsdab: "⦩",
      angmsdac: "⦪",
      angmsdad: "⦫",
      angmsdae: "⦬",
      angmsdaf: "⦭",
      angmsdag: "⦮",
      angmsdah: "⦯",
      angrt: "∟",
      angrtvb: "⊾",
      angrtvbd: "⦝",
      angsph: "∢",
      angst: "Å",
      angzarr: "⍼",
      aogon: "ą",
      aopf: "𝕒",
      ap: "≈",
      apE: "⩰",
      apacir: "⩯",
      ape: "≊",
      apid: "≋",
      apos: "'",
      approx: "≈",
      approxeq: "≊",
      aring: "å",
      ascr: "𝒶",
      ast: "*",
      asymp: "≈",
      asympeq: "≍",
      atilde: "ã",
      auml: "ä",
      awconint: "∳",
      awint: "⨑",
      bNot: "⫭",
      backcong: "≌",
      backepsilon: "϶",
      backprime: "‵",
      backsim: "∽",
      backsimeq: "⋍",
      barvee: "⊽",
      barwed: "⌅",
      barwedge: "⌅",
      bbrk: "⎵",
      bbrktbrk: "⎶",
      bcong: "≌",
      bcy: "б",
      bdquo: "„",
      becaus: "∵",
      because: "∵",
      bemptyv: "⦰",
      bepsi: "϶",
      bernou: "ℬ",
      beta: "β",
      beth: "ℶ",
      between: "≬",
      bfr: "𝔟",
      bigcap: "⋂",
      bigcirc: "◯",
      bigcup: "⋃",
      bigodot: "⨀",
      bigoplus: "⨁",
      bigotimes: "⨂",
      bigsqcup: "⨆",
      bigstar: "★",
      bigtriangledown: "▽",
      bigtriangleup: "△",
      biguplus: "⨄",
      bigvee: "⋁",
      bigwedge: "⋀",
      bkarow: "⤍",
      blacklozenge: "⧫",
      blacksquare: "▪",
      blacktriangle: "▴",
      blacktriangledown: "▾",
      blacktriangleleft: "◂",
      blacktriangleright: "▸",
      blank: "␣",
      blk12: "▒",
      blk14: "░",
      blk34: "▓",
      block: "█",
      bne: "=⃥",
      bnequiv: "≡⃥",
      bnot: "⌐",
      bopf: "𝕓",
      bot: "⊥",
      bottom: "⊥",
      bowtie: "⋈",
      boxDL: "╗",
      boxDR: "╔",
      boxDl: "╖",
      boxDr: "╓",
      boxH: "═",
      boxHD: "╦",
      boxHU: "╩",
      boxHd: "╤",
      boxHu: "╧",
      boxUL: "╝",
      boxUR: "╚",
      boxUl: "╜",
      boxUr: "╙",
      boxV: "║",
      boxVH: "╬",
      boxVL: "╣",
      boxVR: "╠",
      boxVh: "╫",
      boxVl: "╢",
      boxVr: "╟",
      boxbox: "⧉",
      boxdL: "╕",
      boxdR: "╒",
      boxdl: "┐",
      boxdr: "┌",
      boxh: "─",
      boxhD: "╥",
      boxhU: "╨",
      boxhd: "┬",
      boxhu: "┴",
      boxminus: "⊟",
      boxplus: "⊞",
      boxtimes: "⊠",
      boxuL: "╛",
      boxuR: "╘",
      boxul: "┘",
      boxur: "└",
      boxv: "│",
      boxvH: "╪",
      boxvL: "╡",
      boxvR: "╞",
      boxvh: "┼",
      boxvl: "┤",
      boxvr: "├",
      bprime: "‵",
      breve: "˘",
      brvbar: "¦",
      bscr: "𝒷",
      bsemi: "⁏",
      bsim: "∽",
      bsime: "⋍",
      bsol: "\\",
      bsolb: "⧅",
      bsolhsub: "⟈",
      bull: "•",
      bullet: "•",
      bump: "≎",
      bumpE: "⪮",
      bumpe: "≏",
      bumpeq: "≏",
      cacute: "ć",
      cap: "∩",
      capand: "⩄",
      capbrcup: "⩉",
      capcap: "⩋",
      capcup: "⩇",
      capdot: "⩀",
      caps: "∩︀",
      caret: "⁁",
      caron: "ˇ",
      ccaps: "⩍",
      ccaron: "č",
      ccedil: "ç",
      ccirc: "ĉ",
      ccups: "⩌",
      ccupssm: "⩐",
      cdot: "ċ",
      cedil: "¸",
      cemptyv: "⦲",
      cent: "¢",
      centerdot: "·",
      cfr: "𝔠",
      chcy: "ч",
      check: "✓",
      checkmark: "✓",
      chi: "χ",
      cir: "○",
      cirE: "⧃",
      circ: "ˆ",
      circeq: "≗",
      circlearrowleft: "↺",
      circlearrowright: "↻",
      circledR: "®",
      circledS: "Ⓢ",
      circledast: "⊛",
      circledcirc: "⊚",
      circleddash: "⊝",
      cire: "≗",
      cirfnint: "⨐",
      cirmid: "⫯",
      cirscir: "⧂",
      clubs: "♣",
      clubsuit: "♣",
      colon: ":",
      colone: "≔",
      coloneq: "≔",
      comma: ",",
      commat: "@",
      comp: "∁",
      compfn: "∘",
      complement: "∁",
      complexes: "ℂ",
      cong: "≅",
      congdot: "⩭",
      conint: "∮",
      copf: "𝕔",
      coprod: "∐",
      copy: "©",
      copysr: "℗",
      crarr: "↵",
      cross: "✗",
      cscr: "𝒸",
      csub: "⫏",
      csube: "⫑",
      csup: "⫐",
      csupe: "⫒",
      ctdot: "⋯",
      cudarrl: "⤸",
      cudarrr: "⤵",
      cuepr: "⋞",
      cuesc: "⋟",
      cularr: "↶",
      cularrp: "⤽",
      cup: "∪",
      cupbrcap: "⩈",
      cupcap: "⩆",
      cupcup: "⩊",
      cupdot: "⊍",
      cupor: "⩅",
      cups: "∪︀",
      curarr: "↷",
      curarrm: "⤼",
      curlyeqprec: "⋞",
      curlyeqsucc: "⋟",
      curlyvee: "⋎",
      curlywedge: "⋏",
      curren: "¤",
      curvearrowleft: "↶",
      curvearrowright: "↷",
      cuvee: "⋎",
      cuwed: "⋏",
      cwconint: "∲",
      cwint: "∱",
      cylcty: "⌭",
      dArr: "⇓",
      dHar: "⥥",
      dagger: "†",
      daleth: "ℸ",
      darr: "↓",
      dash: "‐",
      dashv: "⊣",
      dbkarow: "⤏",
      dblac: "˝",
      dcaron: "ď",
      dcy: "д",
      dd: "ⅆ",
      ddagger: "‡",
      ddarr: "⇊",
      ddotseq: "⩷",
      deg: "°",
      delta: "δ",
      demptyv: "⦱",
      dfisht: "⥿",
      dfr: "𝔡",
      dharl: "⇃",
      dharr: "⇂",
      diam: "⋄",
      diamond: "⋄",
      diamondsuit: "♦",
      diams: "♦",
      die: "¨",
      digamma: "ϝ",
      disin: "⋲",
      div: "÷",
      divide: "÷",
      divideontimes: "⋇",
      divonx: "⋇",
      djcy: "ђ",
      dlcorn: "⌞",
      dlcrop: "⌍",
      dollar: "$",
      dopf: "𝕕",
      dot: "˙",
      doteq: "≐",
      doteqdot: "≑",
      dotminus: "∸",
      dotplus: "∔",
      dotsquare: "⊡",
      doublebarwedge: "⌆",
      downarrow: "↓",
      downdownarrows: "⇊",
      downharpoonleft: "⇃",
      downharpoonright: "⇂",
      drbkarow: "⤐",
      drcorn: "⌟",
      drcrop: "⌌",
      dscr: "𝒹",
      dscy: "ѕ",
      dsol: "⧶",
      dstrok: "đ",
      dtdot: "⋱",
      dtri: "▿",
      dtrif: "▾",
      duarr: "⇵",
      duhar: "⥯",
      dwangle: "⦦",
      dzcy: "џ",
      dzigrarr: "⟿",
      eDDot: "⩷",
      eDot: "≑",
      eacute: "é",
      easter: "⩮",
      ecaron: "ě",
      ecir: "≖",
      ecirc: "ê",
      ecolon: "≕",
      ecy: "э",
      edot: "ė",
      ee: "ⅇ",
      efDot: "≒",
      efr: "𝔢",
      eg: "⪚",
      egrave: "è",
      egs: "⪖",
      egsdot: "⪘",
      el: "⪙",
      elinters: "⏧",
      ell: "ℓ",
      els: "⪕",
      elsdot: "⪗",
      emacr: "ē",
      empty: "∅",
      emptyset: "∅",
      emptyv: "∅",
      emsp13: " ",
      emsp14: " ",
      emsp: " ",
      eng: "ŋ",
      ensp: " ",
      eogon: "ę",
      eopf: "𝕖",
      epar: "⋕",
      eparsl: "⧣",
      eplus: "⩱",
      epsi: "ε",
      epsilon: "ε",
      epsiv: "ϵ",
      eqcirc: "≖",
      eqcolon: "≕",
      eqsim: "≂",
      eqslantgtr: "⪖",
      eqslantless: "⪕",
      equals: "=",
      equest: "≟",
      equiv: "≡",
      equivDD: "⩸",
      eqvparsl: "⧥",
      erDot: "≓",
      erarr: "⥱",
      escr: "ℯ",
      esdot: "≐",
      esim: "≂",
      eta: "η",
      eth: "ð",
      euml: "ë",
      euro: "€",
      excl: "!",
      exist: "∃",
      expectation: "ℰ",
      exponentiale: "ⅇ",
      fallingdotseq: "≒",
      fcy: "ф",
      female: "♀",
      ffilig: "ﬃ",
      fflig: "ﬀ",
      ffllig: "ﬄ",
      ffr: "𝔣",
      filig: "ﬁ",
      fjlig: "fj",
      flat: "♭",
      fllig: "ﬂ",
      fltns: "▱",
      fnof: "ƒ",
      fopf: "𝕗",
      forall: "∀",
      fork: "⋔",
      forkv: "⫙",
      fpartint: "⨍",
      frac12: "½",
      frac13: "⅓",
      frac14: "¼",
      frac15: "⅕",
      frac16: "⅙",
      frac18: "⅛",
      frac23: "⅔",
      frac25: "⅖",
      frac34: "¾",
      frac35: "⅗",
      frac38: "⅜",
      frac45: "⅘",
      frac56: "⅚",
      frac58: "⅝",
      frac78: "⅞",
      frasl: "⁄",
      frown: "⌢",
      fscr: "𝒻",
      gE: "≧",
      gEl: "⪌",
      gacute: "ǵ",
      gamma: "γ",
      gammad: "ϝ",
      gap: "⪆",
      gbreve: "ğ",
      gcirc: "ĝ",
      gcy: "г",
      gdot: "ġ",
      ge: "≥",
      gel: "⋛",
      geq: "≥",
      geqq: "≧",
      geqslant: "⩾",
      ges: "⩾",
      gescc: "⪩",
      gesdot: "⪀",
      gesdoto: "⪂",
      gesdotol: "⪄",
      gesl: "⋛︀",
      gesles: "⪔",
      gfr: "𝔤",
      gg: "≫",
      ggg: "⋙",
      gimel: "ℷ",
      gjcy: "ѓ",
      gl: "≷",
      glE: "⪒",
      gla: "⪥",
      glj: "⪤",
      gnE: "≩",
      gnap: "⪊",
      gnapprox: "⪊",
      gne: "⪈",
      gneq: "⪈",
      gneqq: "≩",
      gnsim: "⋧",
      gopf: "𝕘",
      grave: "`",
      gscr: "ℊ",
      gsim: "≳",
      gsime: "⪎",
      gsiml: "⪐",
      gt: ">",
      gtcc: "⪧",
      gtcir: "⩺",
      gtdot: "⋗",
      gtlPar: "⦕",
      gtquest: "⩼",
      gtrapprox: "⪆",
      gtrarr: "⥸",
      gtrdot: "⋗",
      gtreqless: "⋛",
      gtreqqless: "⪌",
      gtrless: "≷",
      gtrsim: "≳",
      gvertneqq: "≩︀",
      gvnE: "≩︀",
      hArr: "⇔",
      hairsp: " ",
      half: "½",
      hamilt: "ℋ",
      hardcy: "ъ",
      harr: "↔",
      harrcir: "⥈",
      harrw: "↭",
      hbar: "ℏ",
      hcirc: "ĥ",
      hearts: "♥",
      heartsuit: "♥",
      hellip: "…",
      hercon: "⊹",
      hfr: "𝔥",
      hksearow: "⤥",
      hkswarow: "⤦",
      hoarr: "⇿",
      homtht: "∻",
      hookleftarrow: "↩",
      hookrightarrow: "↪",
      hopf: "𝕙",
      horbar: "―",
      hscr: "𝒽",
      hslash: "ℏ",
      hstrok: "ħ",
      hybull: "⁃",
      hyphen: "‐",
      iacute: "í",
      ic: "⁣",
      icirc: "î",
      icy: "и",
      iecy: "е",
      iexcl: "¡",
      iff: "⇔",
      ifr: "𝔦",
      igrave: "ì",
      ii: "ⅈ",
      iiiint: "⨌",
      iiint: "∭",
      iinfin: "⧜",
      iiota: "℩",
      ijlig: "ĳ",
      imacr: "ī",
      image: "ℑ",
      imagline: "ℐ",
      imagpart: "ℑ",
      imath: "ı",
      imof: "⊷",
      imped: "Ƶ",
      "in": "∈",
      incare: "℅",
      infin: "∞",
      infintie: "⧝",
      inodot: "ı",
      "int": "∫",
      intcal: "⊺",
      integers: "ℤ",
      intercal: "⊺",
      intlarhk: "⨗",
      intprod: "⨼",
      iocy: "ё",
      iogon: "į",
      iopf: "𝕚",
      iota: "ι",
      iprod: "⨼",
      iquest: "¿",
      iscr: "𝒾",
      isin: "∈",
      isinE: "⋹",
      isindot: "⋵",
      isins: "⋴",
      isinsv: "⋳",
      isinv: "∈",
      it: "⁢",
      itilde: "ĩ",
      iukcy: "і",
      iuml: "ï",
      jcirc: "ĵ",
      jcy: "й",
      jfr: "𝔧",
      jmath: "ȷ",
      jopf: "𝕛",
      jscr: "𝒿",
      jsercy: "ј",
      jukcy: "є",
      kappa: "κ",
      kappav: "ϰ",
      kcedil: "ķ",
      kcy: "к",
      kfr: "𝔨",
      kgreen: "ĸ",
      khcy: "х",
      kjcy: "ќ",
      kopf: "𝕜",
      kscr: "𝓀",
      lAarr: "⇚",
      lArr: "⇐",
      lAtail: "⤛",
      lBarr: "⤎",
      lE: "≦",
      lEg: "⪋",
      lHar: "⥢",
      lacute: "ĺ",
      laemptyv: "⦴",
      lagran: "ℒ",
      lambda: "λ",
      lang: "⟨",
      langd: "⦑",
      langle: "⟨",
      lap: "⪅",
      laquo: "«",
      larr: "←",
      larrb: "⇤",
      larrbfs: "⤟",
      larrfs: "⤝",
      larrhk: "↩",
      larrlp: "↫",
      larrpl: "⤹",
      larrsim: "⥳",
      larrtl: "↢",
      lat: "⪫",
      latail: "⤙",
      late: "⪭",
      lates: "⪭︀",
      lbarr: "⤌",
      lbbrk: "❲",
      lbrace: "{",
      lbrack: "[",
      lbrke: "⦋",
      lbrksld: "⦏",
      lbrkslu: "⦍",
      lcaron: "ľ",
      lcedil: "ļ",
      lceil: "⌈",
      lcub: "{",
      lcy: "л",
      ldca: "⤶",
      ldquo: "“",
      ldquor: "„",
      ldrdhar: "⥧",
      ldrushar: "⥋",
      ldsh: "↲",
      le: "≤",
      leftarrow: "←",
      leftarrowtail: "↢",
      leftharpoondown: "↽",
      leftharpoonup: "↼",
      leftleftarrows: "⇇",
      leftrightarrow: "↔",
      leftrightarrows: "⇆",
      leftrightharpoons: "⇋",
      leftrightsquigarrow: "↭",
      leftthreetimes: "⋋",
      leg: "⋚",
      leq: "≤",
      leqq: "≦",
      leqslant: "⩽",
      les: "⩽",
      lescc: "⪨",
      lesdot: "⩿",
      lesdoto: "⪁",
      lesdotor: "⪃",
      lesg: "⋚︀",
      lesges: "⪓",
      lessapprox: "⪅",
      lessdot: "⋖",
      lesseqgtr: "⋚",
      lesseqqgtr: "⪋",
      lessgtr: "≶",
      lesssim: "≲",
      lfisht: "⥼",
      lfloor: "⌊",
      lfr: "𝔩",
      lg: "≶",
      lgE: "⪑",
      lhard: "↽",
      lharu: "↼",
      lharul: "⥪",
      lhblk: "▄",
      ljcy: "љ",
      ll: "≪",
      llarr: "⇇",
      llcorner: "⌞",
      llhard: "⥫",
      lltri: "◺",
      lmidot: "ŀ",
      lmoust: "⎰",
      lmoustache: "⎰",
      lnE: "≨",
      lnap: "⪉",
      lnapprox: "⪉",
      lne: "⪇",
      lneq: "⪇",
      lneqq: "≨",
      lnsim: "⋦",
      loang: "⟬",
      loarr: "⇽",
      lobrk: "⟦",
      longleftarrow: "⟵",
      longleftrightarrow: "⟷",
      longmapsto: "⟼",
      longrightarrow: "⟶",
      looparrowleft: "↫",
      looparrowright: "↬",
      lopar: "⦅",
      lopf: "𝕝",
      loplus: "⨭",
      lotimes: "⨴",
      lowast: "∗",
      lowbar: "_",
      loz: "◊",
      lozenge: "◊",
      lozf: "⧫",
      lpar: "(",
      lparlt: "⦓",
      lrarr: "⇆",
      lrcorner: "⌟",
      lrhar: "⇋",
      lrhard: "⥭",
      lrm: "‎",
      lrtri: "⊿",
      lsaquo: "‹",
      lscr: "𝓁",
      lsh: "↰",
      lsim: "≲",
      lsime: "⪍",
      lsimg: "⪏",
      lsqb: "[",
      lsquo: "‘",
      lsquor: "‚",
      lstrok: "ł",
      lt: "<",
      ltcc: "⪦",
      ltcir: "⩹",
      ltdot: "⋖",
      lthree: "⋋",
      ltimes: "⋉",
      ltlarr: "⥶",
      ltquest: "⩻",
      ltrPar: "⦖",
      ltri: "◃",
      ltrie: "⊴",
      ltrif: "◂",
      lurdshar: "⥊",
      luruhar: "⥦",
      lvertneqq: "≨︀",
      lvnE: "≨︀",
      mDDot: "∺",
      macr: "¯",
      male: "♂",
      malt: "✠",
      maltese: "✠",
      map: "↦",
      mapsto: "↦",
      mapstodown: "↧",
      mapstoleft: "↤",
      mapstoup: "↥",
      marker: "▮",
      mcomma: "⨩",
      mcy: "м",
      mdash: "—",
      measuredangle: "∡",
      mfr: "𝔪",
      mho: "℧",
      micro: "µ",
      mid: "∣",
      midast: "*",
      midcir: "⫰",
      middot: "·",
      minus: "−",
      minusb: "⊟",
      minusd: "∸",
      minusdu: "⨪",
      mlcp: "⫛",
      mldr: "…",
      mnplus: "∓",
      models: "⊧",
      mopf: "𝕞",
      mp: "∓",
      mscr: "𝓂",
      mstpos: "∾",
      mu: "μ",
      multimap: "⊸",
      mumap: "⊸",
      nGg: "⋙̸",
      nGt: "≫⃒",
      nGtv: "≫̸",
      nLeftarrow: "⇍",
      nLeftrightarrow: "⇎",
      nLl: "⋘̸",
      nLt: "≪⃒",
      nLtv: "≪̸",
      nRightarrow: "⇏",
      nVDash: "⊯",
      nVdash: "⊮",
      nabla: "∇",
      nacute: "ń",
      nang: "∠⃒",
      nap: "≉",
      napE: "⩰̸",
      napid: "≋̸",
      napos: "ŉ",
      napprox: "≉",
      natur: "♮",
      natural: "♮",
      naturals: "ℕ",
      nbsp: " ",
      nbump: "≎̸",
      nbumpe: "≏̸",
      ncap: "⩃",
      ncaron: "ň",
      ncedil: "ņ",
      ncong: "≇",
      ncongdot: "⩭̸",
      ncup: "⩂",
      ncy: "н",
      ndash: "–",
      ne: "≠",
      neArr: "⇗",
      nearhk: "⤤",
      nearr: "↗",
      nearrow: "↗",
      nedot: "≐̸",
      nequiv: "≢",
      nesear: "⤨",
      nesim: "≂̸",
      nexist: "∄",
      nexists: "∄",
      nfr: "𝔫",
      ngE: "≧̸",
      nge: "≱",
      ngeq: "≱",
      ngeqq: "≧̸",
      ngeqslant: "⩾̸",
      nges: "⩾̸",
      ngsim: "≵",
      ngt: "≯",
      ngtr: "≯",
      nhArr: "⇎",
      nharr: "↮",
      nhpar: "⫲",
      ni: "∋",
      nis: "⋼",
      nisd: "⋺",
      niv: "∋",
      njcy: "њ",
      nlArr: "⇍",
      nlE: "≦̸",
      nlarr: "↚",
      nldr: "‥",
      nle: "≰",
      nleftarrow: "↚",
      nleftrightarrow: "↮",
      nleq: "≰",
      nleqq: "≦̸",
      nleqslant: "⩽̸",
      nles: "⩽̸",
      nless: "≮",
      nlsim: "≴",
      nlt: "≮",
      nltri: "⋪",
      nltrie: "⋬",
      nmid: "∤",
      nopf: "𝕟",
      not: "¬",
      notin: "∉",
      notinE: "⋹̸",
      notindot: "⋵̸",
      notinva: "∉",
      notinvb: "⋷",
      notinvc: "⋶",
      notni: "∌",
      notniva: "∌",
      notnivb: "⋾",
      notnivc: "⋽",
      npar: "∦",
      nparallel: "∦",
      nparsl: "⫽⃥",
      npart: "∂̸",
      npolint: "⨔",
      npr: "⊀",
      nprcue: "⋠",
      npre: "⪯̸",
      nprec: "⊀",
      npreceq: "⪯̸",
      nrArr: "⇏",
      nrarr: "↛",
      nrarrc: "⤳̸",
      nrarrw: "↝̸",
      nrightarrow: "↛",
      nrtri: "⋫",
      nrtrie: "⋭",
      nsc: "⊁",
      nsccue: "⋡",
      nsce: "⪰̸",
      nscr: "𝓃",
      nshortmid: "∤",
      nshortparallel: "∦",
      nsim: "≁",
      nsime: "≄",
      nsimeq: "≄",
      nsmid: "∤",
      nspar: "∦",
      nsqsube: "⋢",
      nsqsupe: "⋣",
      nsub: "⊄",
      nsubE: "⫅̸",
      nsube: "⊈",
      nsubset: "⊂⃒",
      nsubseteq: "⊈",
      nsubseteqq: "⫅̸",
      nsucc: "⊁",
      nsucceq: "⪰̸",
      nsup: "⊅",
      nsupE: "⫆̸",
      nsupe: "⊉",
      nsupset: "⊃⃒",
      nsupseteq: "⊉",
      nsupseteqq: "⫆̸",
      ntgl: "≹",
      ntilde: "ñ",
      ntlg: "≸",
      ntriangleleft: "⋪",
      ntrianglelefteq: "⋬",
      ntriangleright: "⋫",
      ntrianglerighteq: "⋭",
      nu: "ν",
      num: "#",
      numero: "№",
      numsp: " ",
      nvDash: "⊭",
      nvHarr: "⤄",
      nvap: "≍⃒",
      nvdash: "⊬",
      nvge: "≥⃒",
      nvgt: ">⃒",
      nvinfin: "⧞",
      nvlArr: "⤂",
      nvle: "≤⃒",
      nvlt: "<⃒",
      nvltrie: "⊴⃒",
      nvrArr: "⤃",
      nvrtrie: "⊵⃒",
      nvsim: "∼⃒",
      nwArr: "⇖",
      nwarhk: "⤣",
      nwarr: "↖",
      nwarrow: "↖",
      nwnear: "⤧",
      oS: "Ⓢ",
      oacute: "ó",
      oast: "⊛",
      ocir: "⊚",
      ocirc: "ô",
      ocy: "о",
      odash: "⊝",
      odblac: "ő",
      odiv: "⨸",
      odot: "⊙",
      odsold: "⦼",
      oelig: "œ",
      ofcir: "⦿",
      ofr: "𝔬",
      ogon: "˛",
      ograve: "ò",
      ogt: "⧁",
      ohbar: "⦵",
      ohm: "Ω",
      oint: "∮",
      olarr: "↺",
      olcir: "⦾",
      olcross: "⦻",
      oline: "‾",
      olt: "⧀",
      omacr: "ō",
      omega: "ω",
      omicron: "ο",
      omid: "⦶",
      ominus: "⊖",
      oopf: "𝕠",
      opar: "⦷",
      operp: "⦹",
      oplus: "⊕",
      or: "∨",
      orarr: "↻",
      ord: "⩝",
      order: "ℴ",
      orderof: "ℴ",
      ordf: "ª",
      ordm: "º",
      origof: "⊶",
      oror: "⩖",
      orslope: "⩗",
      orv: "⩛",
      oscr: "ℴ",
      oslash: "ø",
      osol: "⊘",
      otilde: "õ",
      otimes: "⊗",
      otimesas: "⨶",
      ouml: "ö",
      ovbar: "⌽",
      par: "∥",
      para: "¶",
      parallel: "∥",
      parsim: "⫳",
      parsl: "⫽",
      part: "∂",
      pcy: "п",
      percnt: "%",
      period: ".",
      permil: "‰",
      perp: "⊥",
      pertenk: "‱",
      pfr: "𝔭",
      phi: "φ",
      phiv: "ϕ",
      phmmat: "ℳ",
      phone: "☎",
      pi: "π",
      pitchfork: "⋔",
      piv: "ϖ",
      planck: "ℏ",
      planckh: "ℎ",
      plankv: "ℏ",
      plus: "+",
      plusacir: "⨣",
      plusb: "⊞",
      pluscir: "⨢",
      plusdo: "∔",
      plusdu: "⨥",
      pluse: "⩲",
      plusmn: "±",
      plussim: "⨦",
      plustwo: "⨧",
      pm: "±",
      pointint: "⨕",
      popf: "𝕡",
      pound: "£",
      pr: "≺",
      prE: "⪳",
      prap: "⪷",
      prcue: "≼",
      pre: "⪯",
      prec: "≺",
      precapprox: "⪷",
      preccurlyeq: "≼",
      preceq: "⪯",
      precnapprox: "⪹",
      precneqq: "⪵",
      precnsim: "⋨",
      precsim: "≾",
      prime: "′",
      primes: "ℙ",
      prnE: "⪵",
      prnap: "⪹",
      prnsim: "⋨",
      prod: "∏",
      profalar: "⌮",
      profline: "⌒",
      profsurf: "⌓",
      prop: "∝",
      propto: "∝",
      prsim: "≾",
      prurel: "⊰",
      pscr: "𝓅",
      psi: "ψ",
      puncsp: " ",
      qfr: "𝔮",
      qint: "⨌",
      qopf: "𝕢",
      qprime: "⁗",
      qscr: "𝓆",
      quaternions: "ℍ",
      quatint: "⨖",
      quest: "?",
      questeq: "≟",
      quot: '"',
      rAarr: "⇛",
      rArr: "⇒",
      rAtail: "⤜",
      rBarr: "⤏",
      rHar: "⥤",
      race: "∽̱",
      racute: "ŕ",
      radic: "√",
      raemptyv: "⦳",
      rang: "⟩",
      rangd: "⦒",
      range: "⦥",
      rangle: "⟩",
      raquo: "»",
      rarr: "→",
      rarrap: "⥵",
      rarrb: "⇥",
      rarrbfs: "⤠",
      rarrc: "⤳",
      rarrfs: "⤞",
      rarrhk: "↪",
      rarrlp: "↬",
      rarrpl: "⥅",
      rarrsim: "⥴",
      rarrtl: "↣",
      rarrw: "↝",
      ratail: "⤚",
      ratio: "∶",
      rationals: "ℚ",
      rbarr: "⤍",
      rbbrk: "❳",
      rbrace: "}",
      rbrack: "]",
      rbrke: "⦌",
      rbrksld: "⦎",
      rbrkslu: "⦐",
      rcaron: "ř",
      rcedil: "ŗ",
      rceil: "⌉",
      rcub: "}",
      rcy: "р",
      rdca: "⤷",
      rdldhar: "⥩",
      rdquo: "”",
      rdquor: "”",
      rdsh: "↳",
      real: "ℜ",
      realine: "ℛ",
      realpart: "ℜ",
      reals: "ℝ",
      rect: "▭",
      reg: "®",
      rfisht: "⥽",
      rfloor: "⌋",
      rfr: "𝔯",
      rhard: "⇁",
      rharu: "⇀",
      rharul: "⥬",
      rho: "ρ",
      rhov: "ϱ",
      rightarrow: "→",
      rightarrowtail: "↣",
      rightharpoondown: "⇁",
      rightharpoonup: "⇀",
      rightleftarrows: "⇄",
      rightleftharpoons: "⇌",
      rightrightarrows: "⇉",
      rightsquigarrow: "↝",
      rightthreetimes: "⋌",
      ring: "˚",
      risingdotseq: "≓",
      rlarr: "⇄",
      rlhar: "⇌",
      rlm: "‏",
      rmoust: "⎱",
      rmoustache: "⎱",
      rnmid: "⫮",
      roang: "⟭",
      roarr: "⇾",
      robrk: "⟧",
      ropar: "⦆",
      ropf: "𝕣",
      roplus: "⨮",
      rotimes: "⨵",
      rpar: ")",
      rpargt: "⦔",
      rppolint: "⨒",
      rrarr: "⇉",
      rsaquo: "›",
      rscr: "𝓇",
      rsh: "↱",
      rsqb: "]",
      rsquo: "’",
      rsquor: "’",
      rthree: "⋌",
      rtimes: "⋊",
      rtri: "▹",
      rtrie: "⊵",
      rtrif: "▸",
      rtriltri: "⧎",
      ruluhar: "⥨",
      rx: "℞",
      sacute: "ś",
      sbquo: "‚",
      sc: "≻",
      scE: "⪴",
      scap: "⪸",
      scaron: "š",
      sccue: "≽",
      sce: "⪰",
      scedil: "ş",
      scirc: "ŝ",
      scnE: "⪶",
      scnap: "⪺",
      scnsim: "⋩",
      scpolint: "⨓",
      scsim: "≿",
      scy: "с",
      sdot: "⋅",
      sdotb: "⊡",
      sdote: "⩦",
      seArr: "⇘",
      searhk: "⤥",
      searr: "↘",
      searrow: "↘",
      sect: "§",
      semi: ";",
      seswar: "⤩",
      setminus: "∖",
      setmn: "∖",
      sext: "✶",
      sfr: "𝔰",
      sfrown: "⌢",
      sharp: "♯",
      shchcy: "щ",
      shcy: "ш",
      shortmid: "∣",
      shortparallel: "∥",
      shy: "­",
      sigma: "σ",
      sigmaf: "ς",
      sigmav: "ς",
      sim: "∼",
      simdot: "⩪",
      sime: "≃",
      simeq: "≃",
      simg: "⪞",
      simgE: "⪠",
      siml: "⪝",
      simlE: "⪟",
      simne: "≆",
      simplus: "⨤",
      simrarr: "⥲",
      slarr: "←",
      smallsetminus: "∖",
      smashp: "⨳",
      smeparsl: "⧤",
      smid: "∣",
      smile: "⌣",
      smt: "⪪",
      smte: "⪬",
      smtes: "⪬︀",
      softcy: "ь",
      sol: "/",
      solb: "⧄",
      solbar: "⌿",
      sopf: "𝕤",
      spades: "♠",
      spadesuit: "♠",
      spar: "∥",
      sqcap: "⊓",
      sqcaps: "⊓︀",
      sqcup: "⊔",
      sqcups: "⊔︀",
      sqsub: "⊏",
      sqsube: "⊑",
      sqsubset: "⊏",
      sqsubseteq: "⊑",
      sqsup: "⊐",
      sqsupe: "⊒",
      sqsupset: "⊐",
      sqsupseteq: "⊒",
      squ: "□",
      square: "□",
      squarf: "▪",
      squf: "▪",
      srarr: "→",
      sscr: "𝓈",
      ssetmn: "∖",
      ssmile: "⌣",
      sstarf: "⋆",
      star: "☆",
      starf: "★",
      straightepsilon: "ϵ",
      straightphi: "ϕ",
      strns: "¯",
      sub: "⊂",
      subE: "⫅",
      subdot: "⪽",
      sube: "⊆",
      subedot: "⫃",
      submult: "⫁",
      subnE: "⫋",
      subne: "⊊",
      subplus: "⪿",
      subrarr: "⥹",
      subset: "⊂",
      subseteq: "⊆",
      subseteqq: "⫅",
      subsetneq: "⊊",
      subsetneqq: "⫋",
      subsim: "⫇",
      subsub: "⫕",
      subsup: "⫓",
      succ: "≻",
      succapprox: "⪸",
      succcurlyeq: "≽",
      succeq: "⪰",
      succnapprox: "⪺",
      succneqq: "⪶",
      succnsim: "⋩",
      succsim: "≿",
      sum: "∑",
      sung: "♪",
      sup1: "¹",
      sup2: "²",
      sup3: "³",
      sup: "⊃",
      supE: "⫆",
      supdot: "⪾",
      supdsub: "⫘",
      supe: "⊇",
      supedot: "⫄",
      suphsol: "⟉",
      suphsub: "⫗",
      suplarr: "⥻",
      supmult: "⫂",
      supnE: "⫌",
      supne: "⊋",
      supplus: "⫀",
      supset: "⊃",
      supseteq: "⊇",
      supseteqq: "⫆",
      supsetneq: "⊋",
      supsetneqq: "⫌",
      supsim: "⫈",
      supsub: "⫔",
      supsup: "⫖",
      swArr: "⇙",
      swarhk: "⤦",
      swarr: "↙",
      swarrow: "↙",
      swnwar: "⤪",
      szlig: "ß",
      target: "⌖",
      tau: "τ",
      tbrk: "⎴",
      tcaron: "ť",
      tcedil: "ţ",
      tcy: "т",
      tdot: "⃛",
      telrec: "⌕",
      tfr: "𝔱",
      there4: "∴",
      therefore: "∴",
      theta: "θ",
      thetasym: "ϑ",
      thetav: "ϑ",
      thickapprox: "≈",
      thicksim: "∼",
      thinsp: " ",
      thkap: "≈",
      thksim: "∼",
      thorn: "þ",
      tilde: "˜",
      times: "×",
      timesb: "⊠",
      timesbar: "⨱",
      timesd: "⨰",
      tint: "∭",
      toea: "⤨",
      top: "⊤",
      topbot: "⌶",
      topcir: "⫱",
      topf: "𝕥",
      topfork: "⫚",
      tosa: "⤩",
      tprime: "‴",
      trade: "™",
      triangle: "▵",
      triangledown: "▿",
      triangleleft: "◃",
      trianglelefteq: "⊴",
      triangleq: "≜",
      triangleright: "▹",
      trianglerighteq: "⊵",
      tridot: "◬",
      trie: "≜",
      triminus: "⨺",
      triplus: "⨹",
      trisb: "⧍",
      tritime: "⨻",
      trpezium: "⏢",
      tscr: "𝓉",
      tscy: "ц",
      tshcy: "ћ",
      tstrok: "ŧ",
      twixt: "≬",
      twoheadleftarrow: "↞",
      twoheadrightarrow: "↠",
      uArr: "⇑",
      uHar: "⥣",
      uacute: "ú",
      uarr: "↑",
      ubrcy: "ў",
      ubreve: "ŭ",
      ucirc: "û",
      ucy: "у",
      udarr: "⇅",
      udblac: "ű",
      udhar: "⥮",
      ufisht: "⥾",
      ufr: "𝔲",
      ugrave: "ù",
      uharl: "↿",
      uharr: "↾",
      uhblk: "▀",
      ulcorn: "⌜",
      ulcorner: "⌜",
      ulcrop: "⌏",
      ultri: "◸",
      umacr: "ū",
      uml: "¨",
      uogon: "ų",
      uopf: "𝕦",
      uparrow: "↑",
      updownarrow: "↕",
      upharpoonleft: "↿",
      upharpoonright: "↾",
      uplus: "⊎",
      upsi: "υ",
      upsih: "ϒ",
      upsilon: "υ",
      upuparrows: "⇈",
      urcorn: "⌝",
      urcorner: "⌝",
      urcrop: "⌎",
      uring: "ů",
      urtri: "◹",
      uscr: "𝓊",
      utdot: "⋰",
      utilde: "ũ",
      utri: "▵",
      utrif: "▴",
      uuarr: "⇈",
      uuml: "ü",
      uwangle: "⦧",
      vArr: "⇕",
      vBar: "⫨",
      vBarv: "⫩",
      vDash: "⊨",
      vangrt: "⦜",
      varepsilon: "ϵ",
      varkappa: "ϰ",
      varnothing: "∅",
      varphi: "ϕ",
      varpi: "ϖ",
      varpropto: "∝",
      varr: "↕",
      varrho: "ϱ",
      varsigma: "ς",
      varsubsetneq: "⊊︀",
      varsubsetneqq: "⫋︀",
      varsupsetneq: "⊋︀",
      varsupsetneqq: "⫌︀",
      vartheta: "ϑ",
      vartriangleleft: "⊲",
      vartriangleright: "⊳",
      vcy: "в",
      vdash: "⊢",
      vee: "∨",
      veebar: "⊻",
      veeeq: "≚",
      vellip: "⋮",
      verbar: "|",
      vert: "|",
      vfr: "𝔳",
      vltri: "⊲",
      vnsub: "⊂⃒",
      vnsup: "⊃⃒",
      vopf: "𝕧",
      vprop: "∝",
      vrtri: "⊳",
      vscr: "𝓋",
      vsubnE: "⫋︀",
      vsubne: "⊊︀",
      vsupnE: "⫌︀",
      vsupne: "⊋︀",
      vzigzag: "⦚",
      wcirc: "ŵ",
      wedbar: "⩟",
      wedge: "∧",
      wedgeq: "≙",
      weierp: "℘",
      wfr: "𝔴",
      wopf: "𝕨",
      wp: "℘",
      wr: "≀",
      wreath: "≀",
      wscr: "𝓌",
      xcap: "⋂",
      xcirc: "◯",
      xcup: "⋃",
      xdtri: "▽",
      xfr: "𝔵",
      xhArr: "⟺",
      xharr: "⟷",
      xi: "ξ",
      xlArr: "⟸",
      xlarr: "⟵",
      xmap: "⟼",
      xnis: "⋻",
      xodot: "⨀",
      xopf: "𝕩",
      xoplus: "⨁",
      xotime: "⨂",
      xrArr: "⟹",
      xrarr: "⟶",
      xscr: "𝓍",
      xsqcup: "⨆",
      xuplus: "⨄",
      xutri: "△",
      xvee: "⋁",
      xwedge: "⋀",
      yacute: "ý",
      yacy: "я",
      ycirc: "ŷ",
      ycy: "ы",
      yen: "¥",
      yfr: "𝔶",
      yicy: "ї",
      yopf: "𝕪",
      yscr: "𝓎",
      yucy: "ю",
      yuml: "ÿ",
      zacute: "ź",
      zcaron: "ž",
      zcy: "з",
      zdot: "ż",
      zeetrf: "ℨ",
      zeta: "ζ",
      zfr: "𝔷",
      zhcy: "ж",
      zigrarr: "⇝",
      zopf: "𝕫",
      zscr: "𝓏",
      zwj: "‍",
      zwnj: "‌"
    },
    Ie = {}.hasOwnProperty,
    Be = {
      name: "characterReference",
      tokenize: function tokenize(e, t, n) {
        var r = this;
        var c,
          a,
          s = 0;
        return function (t) {
          return e.enter("characterReference"), e.enter("characterReferenceMarker"), e.consume(t), e.exit("characterReferenceMarker"), l;
        };
        function l(t) {
          return 35 === t ? (e.enter("characterReferenceMarkerNumeric"), e.consume(t), e.exit("characterReferenceMarkerNumeric"), f) : (e.enter("characterReferenceValue"), c = 31, a = u, p(t));
        }
        function f(t) {
          return 88 === t || 120 === t ? (e.enter("characterReferenceMarkerHexadecimal"), e.consume(t), e.exit("characterReferenceMarkerHexadecimal"), e.enter("characterReferenceValue"), c = 6, a = i, p) : (e.enter("characterReferenceValue"), c = 7, a = o, p(t));
        }
        function p(o) {
          var i;
          return 59 === o && s ? (i = e.exit("characterReferenceValue"), a !== u || function (e) {
            return !!Ie.call(ze, e) && ze[e];
          }(r.sliceSerialize(i)) ? (e.enter("characterReferenceMarker"), e.consume(o), e.exit("characterReferenceMarker"), e.exit("characterReference"), t) : n(o)) : a(o) && s++ < c ? (e.consume(o), p) : n(o);
        }
      }
    },
    Re = {
      name: "characterEscape",
      tokenize: function tokenize(e, t, n) {
        return function (t) {
          return e.enter("characterEscape"), e.enter("escapeMarker"), e.consume(t), e.exit("escapeMarker"), r;
        };
        function r(r) {
          return c(r) ? (e.enter("characterEscapeValue"), e.consume(r), e.exit("characterEscapeValue"), e.exit("characterEscape"), t) : n(r);
        }
      }
    },
    Me = {
      name: "lineEnding",
      tokenize: function tokenize(e, t) {
        return function (n) {
          return e.enter("lineEnding"), e.consume(n), e.exit("lineEnding"), B(e, t, "linePrefix");
        };
      }
    },
    Ne = {
      name: "labelEnd",
      tokenize: function tokenize(e, t, n) {
        var r = this;
        var o,
          i,
          u = r.events.length;
        for (; u--;) if (("labelImage" === r.events[u][1].type || "labelLink" === r.events[u][1].type) && !r.events[u][1]._balanced) {
          o = r.events[u][1];
          break;
        }
        return function (t) {
          return o ? o._inactive ? a(t) : (i = r.parser.defined.includes(M(r.sliceSerialize({
            start: o.end,
            end: r.now()
          }))), e.enter("labelEnd"), e.enter("labelMarker"), e.consume(t), e.exit("labelMarker"), e.exit("labelEnd"), c) : n(t);
        };
        function c(n) {
          return 40 === n ? e.attempt(Oe, t, i ? t : a)(n) : 91 === n ? e.attempt(Pe, t, i ? e.attempt(_e, t, a) : a)(n) : i ? t(n) : a(n);
        }
        function a(e) {
          return o._balanced = !0, n(e);
        }
      },
      resolveTo: function resolveTo(e, t) {
        var n,
          r,
          o,
          i,
          u = e.length,
          c = 0;
        for (; u--;) if (n = e[u][1], r) {
          if ("link" === n.type || "labelLink" === n.type && n._inactive) break;
          "enter" === e[u][0] && "labelLink" === n.type && (n._inactive = !0);
        } else if (o) {
          if ("enter" === e[u][0] && ("labelImage" === n.type || "labelLink" === n.type) && !n._balanced && (r = u, "labelLink" !== n.type)) {
            c = 2;
            break;
          }
        } else "labelEnd" === n.type && (o = u);
        var a = {
            type: "labelLink" === e[r][1].type ? "link" : "image",
            start: Object.assign({}, e[r][1].start),
            end: Object.assign({}, e[e.length - 1][1].end)
          },
          s = {
            type: "label",
            start: Object.assign({}, e[r][1].start),
            end: Object.assign({}, e[o][1].end)
          },
          l = {
            type: "labelText",
            start: Object.assign({}, e[r + c + 2][1].end),
            end: Object.assign({}, e[o - 2][1].start)
          };
        return i = [["enter", a, t], ["enter", s, t]], i = Q(i, e.slice(r + 1, r + c + 3)), i = Q(i, [["enter", l, t]]), i = Q(i, le(t.parser.constructs.insideSpan["null"], e.slice(r + c + 4, o - 3), t)), i = Q(i, [["exit", l, t], e[o - 2], e[o - 1], ["exit", s, t]]), i = Q(i, e.slice(o + 1)), i = Q(i, [["exit", a, t]]), G(e, r, e.length, i), e;
      },
      resolveAll: function resolveAll(e) {
        var t,
          n = -1;
        for (; ++n < e.length;) t = e[n][1], "labelImage" !== t.type && "labelLink" !== t.type && "labelEnd" !== t.type || (e.splice(n + 1, "labelImage" === t.type ? 4 : 2), t.type = "data", n++);
        return e;
      }
    },
    Oe = {
      tokenize: function tokenize(e, t, n) {
        return function (t) {
          return e.enter("resource"), e.enter("resourceMarker"), e.consume(t), e.exit("resourceMarker"), ve(e, r);
        };
        function r(t) {
          return 41 === t ? u(t) : be(e, o, n, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(t);
        }
        function o(t) {
          return l(t) ? ve(e, i)(t) : u(t);
        }
        function i(t) {
          return 34 === t || 39 === t || 40 === t ? ke(e, ve(e, u), n, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(t) : u(t);
        }
        function u(r) {
          return 41 === r ? (e.enter("resourceMarker"), e.consume(r), e.exit("resourceMarker"), e.exit("resource"), t) : n(r);
        }
      }
    },
    Pe = {
      tokenize: function tokenize(e, t, n) {
        var r = this;
        return function (t) {
          return xe.call(r, e, o, n, "reference", "referenceMarker", "referenceString")(t);
        };
        function o(e) {
          return r.parser.defined.includes(M(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1))) ? t(e) : n(e);
        }
      }
    },
    _e = {
      tokenize: function tokenize(e, t, n) {
        return function (t) {
          return e.enter("reference"), e.enter("referenceMarker"), e.consume(t), e.exit("referenceMarker"), r;
        };
        function r(r) {
          return 93 === r ? (e.enter("referenceMarker"), e.consume(r), e.exit("referenceMarker"), e.exit("reference"), t) : n(r);
        }
      }
    },
    Ve = {
      name: "labelStartImage",
      tokenize: function tokenize(e, t, n) {
        var r = this;
        return function (t) {
          return e.enter("labelImage"), e.enter("labelImageMarker"), e.consume(t), e.exit("labelImageMarker"), o;
        };
        function o(t) {
          return 91 === t ? (e.enter("labelMarker"), e.consume(t), e.exit("labelMarker"), e.exit("labelImage"), i) : n(t);
        }
        function i(e) {
          return 94 === e && "_hiddenFootnoteSupport" in r.parser.constructs ? n(e) : t(e);
        }
      },
      resolveAll: Ne.resolveAll
    };
  function je(e) {
    return null === e || l(e) || d(e) ? 1 : m(e) ? 2 : void 0;
  }
  var Ue = {
    name: "attention",
    tokenize: function tokenize(e, t) {
      var n = this.parser.constructs.attentionMarkers["null"],
        r = this.previous,
        o = je(r);
      var i;
      return function (t) {
        return e.enter("attentionSequence"), i = t, u(t);
      };
      function u(c) {
        if (c === i) return e.consume(c), u;
        var a = e.exit("attentionSequence"),
          s = je(c),
          l = !s || 2 === s && o || n.includes(c),
          f = !o || 2 === o && s || n.includes(r);
        return a._open = Boolean(42 === i ? l : l && (o || !f)), a._close = Boolean(42 === i ? f : f && (s || !l)), t(c);
      }
    },
    resolveAll: function resolveAll(e, t) {
      var n,
        r,
        o,
        i,
        u,
        c,
        a,
        s,
        l = -1;
      for (; ++l < e.length;) if ("enter" === e[l][0] && "attentionSequence" === e[l][1].type && e[l][1]._close) for (n = l; n--;) if ("exit" === e[n][0] && "attentionSequence" === e[n][1].type && e[n][1]._open && t.sliceSerialize(e[n][1]).charCodeAt(0) === t.sliceSerialize(e[l][1]).charCodeAt(0)) {
        if ((e[n][1]._close || e[l][1]._open) && (e[l][1].end.offset - e[l][1].start.offset) % 3 && !((e[n][1].end.offset - e[n][1].start.offset + e[l][1].end.offset - e[l][1].start.offset) % 3)) continue;
        c = e[n][1].end.offset - e[n][1].start.offset > 1 && e[l][1].end.offset - e[l][1].start.offset > 1 ? 2 : 1;
        var _f = Object.assign({}, e[n][1].end),
          _p = Object.assign({}, e[l][1].start);
        He(_f, -c), He(_p, c), i = {
          type: c > 1 ? "strongSequence" : "emphasisSequence",
          start: _f,
          end: Object.assign({}, e[n][1].end)
        }, u = {
          type: c > 1 ? "strongSequence" : "emphasisSequence",
          start: Object.assign({}, e[l][1].start),
          end: _p
        }, o = {
          type: c > 1 ? "strongText" : "emphasisText",
          start: Object.assign({}, e[n][1].end),
          end: Object.assign({}, e[l][1].start)
        }, r = {
          type: c > 1 ? "strong" : "emphasis",
          start: Object.assign({}, i.start),
          end: Object.assign({}, u.end)
        }, e[n][1].end = Object.assign({}, i.start), e[l][1].start = Object.assign({}, u.end), a = [], e[n][1].end.offset - e[n][1].start.offset && (a = Q(a, [["enter", e[n][1], t], ["exit", e[n][1], t]])), a = Q(a, [["enter", r, t], ["enter", i, t], ["exit", i, t], ["enter", o, t]]), a = Q(a, le(t.parser.constructs.insideSpan["null"], e.slice(n + 1, l), t)), a = Q(a, [["exit", o, t], ["enter", u, t], ["exit", u, t], ["exit", r, t]]), e[l][1].end.offset - e[l][1].start.offset ? (s = 2, a = Q(a, [["enter", e[l][1], t], ["exit", e[l][1], t]])) : s = 0, G(e, n - 1, l - n + 3, a), l = n + a.length - s - 2;
        break;
      }
      for (l = -1; ++l < e.length;) "attentionSequence" === e[l][1].type && (e[l][1].type = "data");
      return e;
    }
  };
  function He(e, t) {
    e.column += t, e.offset += t, e._bufferIndex += t;
  }
  var Ge = {
      name: "autolink",
      tokenize: function tokenize(e, t, n) {
        var o = 1;
        return function (t) {
          return e.enter("autolink"), e.enter("autolinkMarker"), e.consume(t), e.exit("autolinkMarker"), e.enter("autolinkProtocol"), i;
        };
        function i(t) {
          return r(t) ? (e.consume(t), c) : a(t) ? p(t) : n(t);
        }
        function c(e) {
          return 43 === e || 45 === e || 46 === e || u(e) ? l(e) : p(e);
        }
        function l(t) {
          return 58 === t ? (e.consume(t), f) : (43 === t || 45 === t || 46 === t || u(t)) && o++ < 32 ? (e.consume(t), l) : p(t);
        }
        function f(t) {
          return 62 === t ? (e.exit("autolinkProtocol"), h(t)) : null === t || 32 === t || 60 === t || s(t) ? n(t) : (e.consume(t), f);
        }
        function p(t) {
          return 64 === t ? (e.consume(t), o = 0, d) : a(t) ? (e.consume(t), p) : n(t);
        }
        function d(e) {
          return u(e) ? m(e) : n(e);
        }
        function m(t) {
          return 46 === t ? (e.consume(t), o = 0, d) : 62 === t ? (e.exit("autolinkProtocol").type = "autolinkEmail", h(t)) : g(t);
        }
        function g(t) {
          return (45 === t || u(t)) && o++ < 63 ? (e.consume(t), 45 === t ? g : m) : n(t);
        }
        function h(n) {
          return e.enter("autolinkMarker"), e.consume(n), e.exit("autolinkMarker"), e.exit("autolink"), t;
        }
      }
    },
    Qe = {
      name: "htmlText",
      tokenize: function tokenize(e, t, n) {
        var o = this;
        var i, c, a, s;
        return function (t) {
          return e.enter("htmlText"), e.enter("htmlTextData"), e.consume(t), d;
        };
        function d(t) {
          return 33 === t ? (e.consume(t), m) : 47 === t ? (e.consume(t), A) : 63 === t ? (e.consume(t), F) : r(t) ? (e.consume(t), T) : n(t);
        }
        function m(t) {
          return 45 === t ? (e.consume(t), g) : 91 === t ? (e.consume(t), c = "CDATA[", a = 0, v) : r(t) ? (e.consume(t), S) : n(t);
        }
        function g(t) {
          return 45 === t ? (e.consume(t), h) : n(t);
        }
        function h(t) {
          return null === t || 62 === t ? n(t) : 45 === t ? (e.consume(t), b) : x(t);
        }
        function b(e) {
          return null === e || 62 === e ? n(e) : x(e);
        }
        function x(t) {
          return null === t ? n(t) : 45 === t ? (e.consume(t), k) : f(t) ? (s = x, P(t)) : (e.consume(t), x);
        }
        function k(t) {
          return 45 === t ? (e.consume(t), V) : x(t);
        }
        function v(t) {
          return t === c.charCodeAt(a++) ? (e.consume(t), a === c.length ? y : v) : n(t);
        }
        function y(t) {
          return null === t ? n(t) : 93 === t ? (e.consume(t), w) : f(t) ? (s = y, P(t)) : (e.consume(t), y);
        }
        function w(t) {
          return 93 === t ? (e.consume(t), q) : y(t);
        }
        function q(t) {
          return 62 === t ? V(t) : 93 === t ? (e.consume(t), q) : y(t);
        }
        function S(t) {
          return null === t || 62 === t ? V(t) : f(t) ? (s = S, P(t)) : (e.consume(t), S);
        }
        function F(t) {
          return null === t ? n(t) : 63 === t ? (e.consume(t), E) : f(t) ? (s = F, P(t)) : (e.consume(t), F);
        }
        function E(e) {
          return 62 === e ? V(e) : F(e);
        }
        function A(t) {
          return r(t) ? (e.consume(t), D) : n(t);
        }
        function D(t) {
          return 45 === t || u(t) ? (e.consume(t), D) : L(t);
        }
        function L(t) {
          return f(t) ? (s = L, P(t)) : p(t) ? (e.consume(t), L) : V(t);
        }
        function T(t) {
          return 45 === t || u(t) ? (e.consume(t), T) : 47 === t || 62 === t || l(t) ? C(t) : n(t);
        }
        function C(t) {
          return 47 === t ? (e.consume(t), V) : 58 === t || 95 === t || r(t) ? (e.consume(t), z) : f(t) ? (s = C, P(t)) : p(t) ? (e.consume(t), C) : V(t);
        }
        function z(t) {
          return 45 === t || 46 === t || 58 === t || 95 === t || u(t) ? (e.consume(t), z) : I(t);
        }
        function I(t) {
          return 61 === t ? (e.consume(t), R) : f(t) ? (s = I, P(t)) : p(t) ? (e.consume(t), I) : C(t);
        }
        function R(t) {
          return null === t || 60 === t || 61 === t || 62 === t || 96 === t ? n(t) : 34 === t || 39 === t ? (e.consume(t), i = t, M) : f(t) ? (s = R, P(t)) : p(t) ? (e.consume(t), R) : (e.consume(t), i = void 0, O);
        }
        function M(t) {
          return t === i ? (e.consume(t), N) : null === t ? n(t) : f(t) ? (s = M, P(t)) : (e.consume(t), M);
        }
        function N(e) {
          return 62 === e || 47 === e || l(e) ? C(e) : n(e);
        }
        function O(t) {
          return null === t || 34 === t || 39 === t || 60 === t || 61 === t || 96 === t ? n(t) : 62 === t || l(t) ? C(t) : (e.consume(t), O);
        }
        function P(t) {
          return e.exit("htmlTextData"), e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), B(e, _, "linePrefix", o.parser.constructs.disable["null"].includes("codeIndented") ? void 0 : 4);
        }
        function _(t) {
          return e.enter("htmlTextData"), s(t);
        }
        function V(r) {
          return 62 === r ? (e.consume(r), e.exit("htmlTextData"), e.exit("htmlText"), t) : n(r);
        }
      }
    },
    We = {
      name: "labelStartLink",
      tokenize: function tokenize(e, t, n) {
        var r = this;
        return function (t) {
          return e.enter("labelLink"), e.enter("labelMarker"), e.consume(t), e.exit("labelMarker"), e.exit("labelLink"), o;
        };
        function o(e) {
          return 94 === e && "_hiddenFootnoteSupport" in r.parser.constructs ? n(e) : t(e);
        }
      },
      resolveAll: Ne.resolveAll
    },
    Ze = {
      name: "hardBreakEscape",
      tokenize: function tokenize(e, t, n) {
        return function (t) {
          return e.enter("hardBreakEscape"), e.enter("escapeMarker"), e.consume(t), r;
        };
        function r(r) {
          return f(r) ? (e.exit("escapeMarker"), e.exit("hardBreakEscape"), t(r)) : n(r);
        }
      }
    },
    Je = {
      name: "codeText",
      tokenize: function tokenize(e, t, n) {
        var r,
          o,
          i = 0;
        return function (t) {
          return e.enter("codeText"), e.enter("codeTextSequence"), u(t);
        };
        function u(t) {
          return 96 === t ? (e.consume(t), i++, u) : (e.exit("codeTextSequence"), c(t));
        }
        function c(t) {
          return null === t ? n(t) : 96 === t ? (o = e.enter("codeTextSequence"), r = 0, s(t)) : 32 === t ? (e.enter("space"), e.consume(t), e.exit("space"), c) : f(t) ? (e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), c) : (e.enter("codeTextData"), a(t));
        }
        function a(t) {
          return null === t || 32 === t || 96 === t || f(t) ? (e.exit("codeTextData"), c(t)) : (e.consume(t), a);
        }
        function s(n) {
          return 96 === n ? (e.consume(n), r++, s) : r === i ? (e.exit("codeTextSequence"), e.exit("codeText"), t(n)) : (o.type = "codeTextData", a(n));
        }
      },
      resolve: function resolve(e) {
        var t,
          n,
          r = e.length - 4,
          o = 3;
        if (!("lineEnding" !== e[o][1].type && "space" !== e[o][1].type || "lineEnding" !== e[r][1].type && "space" !== e[r][1].type)) for (t = o; ++t < r;) if ("codeTextData" === e[t][1].type) {
          e[o][1].type = "codeTextPadding", e[r][1].type = "codeTextPadding", o += 2, r -= 2;
          break;
        }
        for (t = o - 1, r++; ++t <= r;) void 0 === n ? t !== r && "lineEnding" !== e[t][1].type && (n = t) : t !== r && "lineEnding" !== e[t][1].type || (e[n][1].type = "codeTextData", t !== n + 2 && (e[n][1].end = e[t - 1][1].end, e.splice(n + 2, t - n - 2), r -= t - n - 2, t = n + 2), n = void 0);
        return e;
      },
      previous: function previous(e) {
        return 96 !== e || "characterEscape" === this.events[this.events.length - 1][1].type;
      }
    },
    Ye = {
      42: de,
      43: de,
      45: de,
      48: de,
      49: de,
      50: de,
      51: de,
      52: de,
      53: de,
      54: de,
      55: de,
      56: de,
      57: de,
      62: he
    },
    Ke = {
      91: ye
    },
    Xe = (_Xe = {}, _defineProperty(_Xe, -2, qe), _defineProperty(_Xe, -1, qe), _defineProperty(_Xe, 32, qe), _Xe),
    $e = {
      35: Fe,
      42: pe,
      45: [Ee, pe],
      60: Le,
      61: Ee,
      95: pe,
      96: Ce,
      126: Ce
    },
    et = {
      38: Be,
      92: Re
    },
    tt = (_tt = {}, _defineProperty(_tt, -5, Me), _defineProperty(_tt, -4, Me), _defineProperty(_tt, -3, Me), _defineProperty(_tt, 33, Ve), _defineProperty(_tt, 38, Be), _defineProperty(_tt, 42, Ue), _defineProperty(_tt, 60, [Ge, Qe]), _defineProperty(_tt, 91, We), _defineProperty(_tt, 92, [Ze, Re]), _defineProperty(_tt, 93, Ne), _defineProperty(_tt, 95, Ue), _defineProperty(_tt, 96, Je), _tt),
    nt = {
      "null": [Ue, oe]
    },
    rt = {
      "null": [42, 95]
    },
    ot = {
      "null": []
    };
  function it() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var t = {
      defined: [],
      lazy: {},
      constructs: function (e) {
        var t = {};
        var n = -1;
        for (; ++n < e.length;) Z(t, e[n]);
        return t;
      }([n].concat(e.extensions || [])),
      content: r(Y),
      document: r(K),
      flow: r(re),
      string: r(ie),
      text: r(ue)
    };
    return t;
    function r(e) {
      return function (n) {
        return fe(t, e, n);
      };
    }
  }
  function ut(e) {
    for (; !$(e););
    return e;
  }
  var ct = /[\0\t\n\r]/g;
  function at() {
    var e,
      t = 1,
      n = "",
      r = !0;
    return function (o, i, u) {
      var c = [];
      var a, s, l, f, p;
      for (o = n + o.toString(i), l = 0, n = "", r && (65279 === o.charCodeAt(0) && l++, r = void 0); l < o.length;) {
        if (ct.lastIndex = l, a = ct.exec(o), f = a && void 0 !== a.index ? a.index : o.length, p = o.charCodeAt(f), !a) {
          n = o.slice(l);
          break;
        }
        if (10 === p && l === f && e) c.push(-3), e = void 0;else switch (e && (c.push(-5), e = void 0), l < f && (c.push(o.slice(l, f)), t += f - l), p) {
          case 0:
            c.push(65533), t++;
            break;
          case 9:
            for (s = 4 * Math.ceil(t / 4), c.push(-2); t++ < s;) c.push(-1);
            break;
          case 10:
            c.push(-4), t = 1;
            break;
          default:
            e = !0, t = 1;
        }
        l = f + 1;
      }
      return u && (e && c.push(-5), n && c.push(n), c.push(null)), c;
    };
  }
  var st = exports;
  for (var lt in t) st[lt] = t[lt];
  t.__esModule && Object.defineProperty(st, "__esModule", {
    value: !0
  });
})();

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./markdownlint-exports.js");
/******/ 	markdownlint = __webpack_exports__;
/******/ 	
/******/ })()
;