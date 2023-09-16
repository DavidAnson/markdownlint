/*! markdownlint 0.31.1 https://github.com/DavidAnson/markdownlint @license MIT */
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
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var micromark = __webpack_require__(/*! ./micromark.cjs */ "../helpers/micromark.cjs");
var _require = __webpack_require__(/*! ./shared.js */ "../helpers/shared.js"),
  newLineRe = _require.newLineRe;
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

// Regular expressions for range matching
module.exports.listItemMarkerRe = /^([\s>]*)(?:[*+-]|\d+[.)])\s+/;
module.exports.orderedListItemMarkerRe = /^[\s>]*0*(\d+)[.)]/;

// Regular expression for blockquote prefixes
var blockquotePrefixRe = /^[>\s]*/;
module.exports.blockquotePrefixRe = blockquotePrefixRe;

// Regular expression for link reference definitions
var linkReferenceDefinitionRe = /^ {0,3}\[([^\]]*[^\\])\]:/;
module.exports.linkReferenceDefinitionRe = linkReferenceDefinitionRe;

// Regular expression for identifying an HTML entity at the end of a line
module.exports.endOfLineHtmlEntityRe =
// eslint-disable-next-line max-len
/&(?:#\d+|#[xX][\da-fA-F]+|[a-zA-Z]{2,31}|blk\d{2}|emsp1[34]|frac\d{2}|sup\d|there4);$/;

// Regular expression for identifying a GitHub emoji code at the end of a line
module.exports.endOfLineGemojiCodeRe =
// eslint-disable-next-line max-len
/:(?:[abmovx]|[-+]1|100|1234|(?:1st|2nd|3rd)_place_medal|8ball|clock\d{1,4}|e-mail|non-potable_water|o2|t-rex|u5272|u5408|u55b6|u6307|u6708|u6709|u6e80|u7121|u7533|u7981|u7a7a|[a-z]{2,15}2?|[a-z]{1,14}(?:_[a-z\d]{1,16})+):$/;

// All punctuation characters (normal and full-width)
var allPunctuation = ".,;:!?。，；：！？";
module.exports.allPunctuation = allPunctuation;

// All punctuation characters without question mark (normal and full-width)
module.exports.allPunctuationNoQuestion = allPunctuation.replace(/[\?\uFF1F]/g, "");

/**
 * Returns true iff the input is a Number.
 *
 * @param {Object} obj Object of unknown type.
 * @returns {boolean} True iff obj is a Number.
 */
function isNumber(obj) {
  return typeof obj === "number";
}
module.exports.isNumber = isNumber;

/**
 * Returns true iff the input is a String.
 *
 * @param {Object} obj Object of unknown type.
 * @returns {boolean} True iff obj is a String.
 */
function isString(obj) {
  return typeof obj === "string";
}
module.exports.isString = isString;

/**
 * Returns true iff the input String is empty.
 *
 * @param {string} str String of unknown length.
 * @returns {boolean} True iff the input String is empty.
 */
function isEmptyString(str) {
  return str.length === 0;
}
module.exports.isEmptyString = isEmptyString;

/**
 * Returns true iff the input is an Object.
 *
 * @param {Object} obj Object of unknown type.
 * @returns {boolean} True iff obj is an Object.
 */
function isObject(obj) {
  return !!obj && _typeof(obj) === "object" && !Array.isArray(obj);
}
module.exports.isObject = isObject;

/**
 * Returns true iff the input is a URL.
 *
 * @param {Object} obj Object of unknown type.
 * @returns {boolean} True iff obj is a URL.
 */
function isUrl(obj) {
  return !!obj && Object.getPrototypeOf(obj) === URL.prototype;
}
module.exports.isUrl = isUrl;

/**
 * Clones the input if it is an Array.
 *
 * @param {Object} arr Object of unknown type.
 * @returns {Object} Clone of obj iff obj is an Array.
 */
function cloneIfArray(arr) {
  return Array.isArray(arr) ? _toConsumableArray(arr) : arr;
}
module.exports.cloneIfArray = cloneIfArray;

/**
 * Clones the input if it is a URL.
 *
 * @param {Object} url Object of unknown type.
 * @returns {Object} Clone of obj iff obj is a URL.
 */
function cloneIfUrl(url) {
  return isUrl(url) ? new URL(url) : url;
}
module.exports.cloneIfUrl = cloneIfUrl;

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
 * @callback TokenCallback
 * @param {MarkdownItToken} token Current token.
 * @returns {void}
 */

/**
 * Calls the provided function for each matching token.
 *
 * @param {Object} params RuleParams instance.
 * @param {string} type Token type identifier.
 * @param {TokenCallback} handler Callback function.
 * @returns {void}
 */
function filterTokens(params, type, handler) {
  var _iterator = _createForOfIteratorHelper(params.parsers.markdownit.tokens),
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
 * @typedef {Array} LineMetadata
 */

/**
 * Gets a line metadata array.
 *
 * @param {Object} params RuleParams instance.
 * @returns {LineMetadata} Line metadata.
 */
function getLineMetadata(params) {
  var lineMetadata = params.lines.map(function (line, index) {
    return [line, index, false, 0, false, false, false];
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
  return lineMetadata;
}
module.exports.getLineMetadata = getLineMetadata;

/**
 * @callback EachLineCallback
 * @param {string} line Line content.
 * @param {number} lineIndex Line index (0-based).
 * @param {boolean} inCode Iff in a code block.
 * @param {number} onFence + if open, - if closed, 0 otherwise.
 * @param {boolean} inTable Iff in a table.
 * @param {boolean} inItem Iff in a list item.
 * @param {boolean} inBreak Iff in semantic break.
 * @returns {void}
 */

/**
 * Calls the provided function for each line.
 *
 * @param {LineMetadata} lineMetadata Line metadata object.
 * @param {EachLineCallback} handler Function taking (line, lineIndex, inCode,
 * onFence, inTable, inItem, inBreak).
 * @returns {void}
 */
function forEachLine(lineMetadata, handler) {
  var _iterator2 = _createForOfIteratorHelper(lineMetadata),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var metadata = _step2.value;
      // @ts-ignore
      handler.apply(void 0, _toConsumableArray(metadata));
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
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
  var _iterator3 = _createForOfIteratorHelper(tokens),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var token = _step3.value;
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
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  return flattenedLists;
};

// Calls the provided function for each heading's content
module.exports.forEachHeading = function forEachHeading(params, handler) {
  var heading = null;
  var _iterator4 = _createForOfIteratorHelper(params.parsers.markdownit.tokens),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var token = _step4.value;
      if (token.type === "heading_open") {
        heading = token;
      } else if (token.type === "heading_close") {
        heading = null;
      } else if (token.type === "inline" && heading) {
        handler(heading, token.content, token);
      }
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
};

/**
 * @callback InlineCodeSpanCallback
 * @param {string} code Code content.
 * @param {number} lineIndex Line index (0-based).
 * @param {number} columnIndex Column index (0-based).
 * @param {number} ticks Count of backticks.
 * @returns {void}
 */

/**
 * Calls the provided function for each inline code span's content.
 *
 * @param {string} input Markdown content.
 * @param {InlineCodeSpanCallback} handler Callback function taking (code,
 * lineIndex, columnIndex, ticks).
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
        var _iterator5 = _createForOfIteratorHelper(codeLines.entries()),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var _step5$value = _slicedToArray(_step5.value, 2),
              i = _step5$value[0],
              line = _step5$value[1];
            exclusions.push([token.lineNumber - 1 + lineIndex + i, i ? 0 : columnIndex, line.length]);
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      });
    }
  });
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
  var _iterator6 = _createForOfIteratorHelper(filteredTokens),
    _step6;
  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var token = _step6.value;
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
            var shortcutCandidate = micromark.matchAndGetTokensByType(token.children, ["label"]);
            if (shortcutCandidate) {
              labelText = micromark.getTokenTextByType(shortcutCandidate[0].children, "labelText");
              isShortcut = labelText !== null;
            }
            var fullAndCollapsedCandidate = micromark.matchAndGetTokensByType(token.children, ["label", "reference"]);
            if (fullAndCollapsedCandidate) {
              labelText = micromark.getTokenTextByType(fullAndCollapsedCandidate[0].children, "labelText");
              referenceStringText = micromark.getTokenTextByType(fullAndCollapsedCandidate[1].children, "referenceString");
              isFullOrCollapsed = labelText !== null;
            }
            var footnote = micromark.matchAndGetTokensByType(token.children, ["gfmFootnoteCallLabelMarker", "gfmFootnoteCallMarker", "gfmFootnoteCallString", "gfmFootnoteCallLabelMarker"], ["gfmFootnoteCallMarker", "gfmFootnoteCallString"]);
            if (footnote) {
              var callMarkerText = footnote[0].text;
              var callString = footnote[1].text;
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
    _iterator6.e(err);
  } finally {
    _iterator6.f();
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
  var _iterator7 = _createForOfIteratorHelper(endings),
    _step7;
  try {
    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
      var ending = _step7.value;
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
    _iterator7.e(err);
  } finally {
    _iterator7.f();
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
  var _iterator8 = _createForOfIteratorHelper(fixInfos),
    _step8;
  try {
    for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
      var fixInfo = _step8.value;
      if (fixInfo.lineNumber === lastFixInfo.lineNumber && fixInfo.editColumn === lastFixInfo.editColumn && !fixInfo.insertText && fixInfo.deleteCount > 0 && lastFixInfo.insertText && !lastFixInfo.deleteCount) {
        fixInfo.insertText = lastFixInfo.insertText;
        lastFixInfo.lineNumber = 0;
      }
      lastFixInfo = fixInfo;
    }
  } catch (err) {
    _iterator8.e(err);
  } finally {
    _iterator8.f();
  }
  fixInfos = fixInfos.filter(function (fixInfo) {
    return fixInfo.lineNumber;
  });
  // Apply all (remaining/updated) fixes
  var lastLineIndex = -1;
  var lastEditIndex = -1;
  var _iterator9 = _createForOfIteratorHelper(fixInfos),
    _step9;
  try {
    for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
      var _fixInfo = _step9.value;
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
    _iterator9.e(err);
  } finally {
    _iterator9.f();
  }
  return lines.filter(function (line) {
    return line !== null;
  }).join(lineEnding);
}
module.exports.applyFixes = applyFixes;

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

// Copied from markdownlint.js to avoid TypeScript compiler import() issue.
/**
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

/***/ }),

/***/ "../helpers/shared.js":
/*!****************************!*\
  !*** ../helpers/shared.js ***!
  \****************************/
/***/ ((module) => {

"use strict";
// @ts-check



// Regular expression for matching common newline characters
// See NEWLINES_RE in markdown-it/lib/rules_core/normalize.js
module.exports.newLineRe = /\r\n?|\n/g;

/***/ }),

/***/ "markdown-it":
/*!*****************************!*\
  !*** external "markdownit" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = markdownit;

/***/ }),

/***/ "markdownlint-micromark":
/*!***********************************!*\
  !*** external "micromarkBrowser" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = micromarkBrowser;

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



// @ts-ignore
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! markdownlint-micromark */ "markdownlint-micromark"),
  gfmAutolinkLiteral = _require.gfmAutolinkLiteral,
  gfmFootnote = _require.gfmFootnote,
  gfmTable = _require.gfmTable,
  math = _require.math,
  parse = _require.parse,
  postprocess = _require.postprocess,
  preprocess = _require.preprocess;
var _require2 = __webpack_require__(/*! ./shared.js */ "../helpers/shared.js"),
  newLineRe = _require2.newLineRe;
var flatTokensSymbol = Symbol("flat-tokens");

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
 * @property {Token[]} children Child tokens.
 */

/**
 * Returns whether a token is an htmlFlow type containing an HTML comment.
 *
 * @param {Token} token Micromark token.
 * @returns {boolean} True iff token is htmlFlow containing a comment.
 */
function isHtmlFlowComment(token) {
  var text = token.text,
    type = token.type;
  if (type === "htmlFlow" && text.startsWith("<!--") && text.endsWith("-->")) {
    var comment = text.slice(4, -3);
    return !comment.startsWith(">") && !comment.startsWith("->") && !comment.endsWith("-") && !comment.includes("--");
  }
  return false;
}

/**
 * Parses a Markdown document and returns Micromark events.
 *
 * @param {string} markdown Markdown document.
 * @param {Object} [micromarkOptions] Options for micromark.
 * @param {boolean} [referencesDefined] Treat references as defined.
 * @returns {Object[]} Micromark events.
 */
function getMicromarkEvents(markdown) {
  var micromarkOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var referencesDefined = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  // Customize options object to add useful extensions
  micromarkOptions.extensions = micromarkOptions.extensions || [];
  micromarkOptions.extensions.push(gfmAutolinkLiteral(), gfmFootnote(), gfmTable(), math());

  // Use micromark to parse document into Events
  var encoding = undefined;
  var eol = true;
  var parseContext = parse(micromarkOptions);
  if (referencesDefined) {
    // Customize ParseContext to treat all references as defined
    parseContext.defined.includes = function (searchElement) {
      return searchElement.length > 0;
    };
  }
  var chunks = preprocess()(markdown, encoding, eol);
  var events = postprocess(parseContext.document().write(chunks));
  return events;
}

/**
 * Parses a Markdown document and returns (frozen) tokens.
 *
 * @param {string} markdown Markdown document.
 * @param {Object} micromarkOptions Options for micromark.
 * @param {boolean} referencesDefined Treat references as defined.
 * @param {number} lineDelta Offset to apply to start/end line.
 * @returns {Token[]} Micromark tokens (frozen).
 */
function micromarkParseWithOffset(markdown, micromarkOptions, referencesDefined, lineDelta) {
  // Use micromark to parse document into Events
  var events = getMicromarkEvents(markdown, micromarkOptions, referencesDefined);

  // Create Token objects
  var document = [];
  var flatTokens = [];
  var current = {
    "children": document
  };
  var history = [current];
  var reparseOptions = null;
  var lines = null;
  var skipHtmlFlowChildren = false;
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
      var text = context.sliceSerialize(token);
      if (kind === "enter" && !skipHtmlFlowChildren) {
        var previous = current;
        history.push(previous);
        current = {
          type: type,
          "startLine": startLine + lineDelta,
          startColumn: startColumn,
          "endLine": endLine + lineDelta,
          endColumn: endColumn,
          text: text,
          "children": []
        };
        previous.children.push(current);
        flatTokens.push(current);
        // @ts-ignore
        if (current.type === "htmlFlow" && !isHtmlFlowComment(current)) {
          skipHtmlFlowChildren = true;
          if (!reparseOptions || !lines) {
            reparseOptions = _objectSpread(_objectSpread({}, micromarkOptions), {}, {
              "extensions": [{
                "disable": {
                  "null": ["codeIndented", "htmlFlow"]
                }
              }]
            });
            lines = markdown.split(newLineRe);
          }
          var reparseMarkdown = lines.slice(current.startLine - 1, current.endLine).join("\n");
          var tokens = micromarkParseWithOffset(reparseMarkdown, reparseOptions, referencesDefined, current.startLine - 1);
          current.children = tokens;
          // Avoid stack overflow of Array.push(...spread)
          // eslint-disable-next-line unicorn/prefer-spread
          flatTokens = flatTokens.concat(tokens[flatTokensSymbol]);
        }
      } else if (kind === "exit") {
        if (type === "htmlFlow") {
          skipHtmlFlowChildren = false;
        }
        if (!skipHtmlFlowChildren) {
          Object.freeze(current.children);
          Object.freeze(current);
          // @ts-ignore
          current = history.pop();
        }
      }
    }

    // Return document
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  Object.defineProperty(document, flatTokensSymbol, {
    "value": flatTokens
  });
  Object.freeze(document);
  return document;
}

/**
 * Parses a Markdown document and returns (frozen) tokens.
 *
 * @param {string} markdown Markdown document.
 * @param {Object} [micromarkOptions] Options for micromark.
 * @param {boolean} [referencesDefined] Treat references as defined.
 * @returns {Token[]} Micromark tokens (frozen).
 */
function micromarkParse(markdown) {
  var micromarkOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var referencesDefined = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return micromarkParseWithOffset(markdown, micromarkOptions, referencesDefined, 0);
}

/**
 * @callback AllowedPredicate
 * @param {Token} token Micromark token.
 * @returns {boolean} True iff allowed.
 */

/**
 * @callback TransformPredicate
 * @param {Token} token Micromark token.
 * @returns {Token[]} Child tokens.
 */

/**
 * Filter a list of Micromark tokens by predicate.
 *
 * @param {Token[]} tokens Micromark tokens.
 * @param {AllowedPredicate} allowed Allowed token predicate.
 * @param {TransformPredicate} [transformChildren] Transform predicate.
 * @returns {Token[]} Filtered tokens.
 */
function filterByPredicate(tokens, allowed, transformChildren) {
  var result = [];
  var queue = [{
    "array": tokens,
    "index": 0
  }];
  while (queue.length > 0) {
    var current = queue[queue.length - 1];
    var array = current.array,
      index = current.index;
    if (index < array.length) {
      var token = array[current.index++];
      if (allowed(token)) {
        result.push(token);
      }
      var children = token.children;
      if (children.length > 0) {
        var transformed = transformChildren ? transformChildren(token) : children;
        queue.push({
          "array": transformed,
          "index": 0
        });
      }
    } else {
      queue.pop();
    }
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
  var predicate = function predicate(token) {
    return allowed.includes(token.type);
  };
  var flatTokens = tokens[flatTokensSymbol];
  if (flatTokens) {
    return flatTokens.filter(predicate);
  }
  return filterByPredicate(tokens, predicate);
}

/**
 * Gets the heading level of a Micromark heading tokan.
 *
 * @param {Token} heading Micromark heading token.
 * @returns {number} Heading level.
 */
function getHeadingLevel(heading) {
  var headingSequence = filterByTypes(heading.children, ["atxHeadingSequence", "setextHeadingLineSequence"]);
  var level = 1;
  var text = headingSequence[0].text;
  if (text[0] === "#") {
    level = Math.min(text.length, 6);
  } else if (text[0] === "-") {
    level = 2;
  }
  return level;
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
 * @returns {Token[] | null} Matching tokens.
 */
function matchAndGetTokensByType(tokens, matchTypes, resultTypes) {
  if (tokens.length !== matchTypes.length) {
    return null;
  }
  resultTypes = resultTypes || matchTypes;
  var result = [];
  // eslint-disable-next-line unicorn/no-for-loop
  for (var i = 0; i < matchTypes.length; i++) {
    if (tokens[i].type !== matchTypes[i]) {
      return null;
    } else if (resultTypes.includes(matchTypes[i])) {
      result.push(tokens[i]);
    }
  }
  return result;
}

/**
 * Returns the specified token iff it is of the desired type.
 *
 * @param {Token} token Micromark token candidate.
 * @param {string} type Desired type.
 * @returns {Token | null} Token instance.
 */
function tokenIfType(token, type) {
  return token && token.type === type ? token : null;
}
module.exports = {
  "parse": micromarkParse,
  filterByPredicate: filterByPredicate,
  filterByTypes: filterByTypes,
  getHeadingLevel: getHeadingLevel,
  getHtmlTagInfo: getHtmlTagInfo,
  getMicromarkEvents: getMicromarkEvents,
  getTokenTextByType: getTokenTextByType,
  matchAndGetTokensByType: matchAndGetTokensByType,
  tokenIfType: tokenIfType
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
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
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
module.exports.version = "0.31.1";

/***/ }),

/***/ "../lib/markdownlint.js":
/*!******************************!*\
  !*** ../lib/markdownlint.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
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
      for (var _i = 0, _arr = ["names", "tags"]; _i < _arr.length; _i++) {
        var property = _arr[_i];
        var value = rule[property];
        if (!result && (!value || !Array.isArray(value) || value.length === 0 || !value.every(helpers.isString) || value.some(helpers.isEmptyString))) {
          result = newError(property);
        }
      }
      for (var _i2 = 0, _arr2 = [["description", "string"], ["function", "function"]]; _i2 < _arr2.length; _i2++) {
        var propertyInfo = _arr2[_i2];
        var _property = propertyInfo[0];
        var _value = rule[_property];
        if (!result && (!_value || _typeof(_value) !== propertyInfo[1])) {
          result = newError(_property);
        }
      }
      if (!result && rule.information && !helpers.isUrl(rule.information)) {
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
    for (var _i3 = 0, _keys = keys; _i3 < _keys.length; _i3++) {
      var file = _keys[_i3];
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
        for (var _i4 = 0, _Object$entries = Object.entries(fileResults); _i4 < _Object$entries.length; _i4++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i4], 2),
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
  for (var _i5 = 0, _Object$keys = Object.keys(config); _i5 < _Object$keys.length; _i5++) {
    var key = _Object$keys[_i5];
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
      enabledRulesPerLineNumber[nextLineNumber] = applyEnableDisable(action, parameter, enabledRulesPerLineNumber[nextLineNumber]);
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
 * @param {Object.<string, string[]>} aliasToRuleNames Map of alias to rule
 * names.
 * @param {string} name Identifier for the content.
 * @param {string} content Markdown content.
 * @param {Object} md Instance of markdown-it.
 * @param {Configuration} config Configuration object.
 * @param {ConfigurationParser[] | null} configParsers Configuration parsers.
 * @param {RegExp | null} frontMatter Regular expression for front matter.
 * @param {boolean} handleRuleFailures Whether to handle exceptions in rules.
 * @param {boolean} noInlineConfig Whether to allow inline configuration.
 * @param {number} resultVersion Version of the LintResults object to return.
 * @param {LintContentCallback} callback Callback (err, result) function.
 * @returns {void}
 */
function lintContent(ruleList, aliasToRuleNames, name, content, md, config, configParsers, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, callback) {
  // Remove UTF-8 byte order marker (if present)
  content = content.replace(/^\uFEFF/, "");
  // Remove front matter
  var removeFrontMatterResult = removeFrontMatter(content, frontMatter);
  var frontMatterLines = removeFrontMatterResult.frontMatterLines;
  content = removeFrontMatterResult.content;
  // Get enabled rules per line (with HTML comments present)
  var _getEnabledRulesPerLi = getEnabledRulesPerLineNumber(ruleList, content.split(helpers.newLineRe), frontMatterLines, noInlineConfig, config, configParsers, aliasToRuleNames),
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
  var flattenedLists = helpers.flattenLists(paramsBase.parsers.markdownit.tokens);
  var referenceLinkImageData = helpers.getReferenceLinkImageData(paramsBase);
  cache.set({
    codeBlockAndSpanRanges: codeBlockAndSpanRanges,
    flattenedLists: flattenedLists,
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
      if (errorInfo.information && !helpers.isUrl(errorInfo.information)) {
        throwError("information");
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
      var information = errorInfo.information || rule.information;
      results.push({
        lineNumber: lineNumber,
        "ruleName": rule.names[0],
        "ruleNames": rule.names,
        "ruleDescription": rule.description,
        "ruleInformation": information ? information.href : null,
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
 * @param {Object.<string, string[]>} aliasToRuleNames Map of alias to rule
 * names.
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
 * @param {LintContentCallback} callback Callback (err, result) function.
 * @returns {void}
 */
function lintFile(ruleList, aliasToRuleNames, file, md, config, configParsers, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, fs, synchronous, callback) {
  // eslint-disable-next-line jsdoc/require-jsdoc
  function lintContentWrapper(err, content) {
    if (err) {
      return callback(err);
    }
    return lintContent(ruleList, aliasToRuleNames, file, content, md, config, configParsers, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, callback);
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
 * @param {LintCallback} callback Callback (err, result) function.
 * @returns {void}
 */
function lintInput(options, synchronous, callback) {
  // Normalize inputs
  options = options || {};
  callback = callback || function noop() {};
  var customRuleList = [options.customRules || []].flat().map(function (rule) {
    return {
      "names": helpers.cloneIfArray(rule.names),
      "description": rule.description,
      "information": helpers.cloneIfUrl(rule.information),
      "tags": helpers.cloneIfArray(rule.tags),
      "asynchronous": rule.asynchronous,
      "function": rule["function"]
    };
  });
  // eslint-disable-next-line unicorn/prefer-spread
  var ruleList = rules.concat(customRuleList);
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
  var aliasToRuleNames = mapAliasToRuleNames(ruleList);
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
      lintFile(ruleList, aliasToRuleNames, currentItem, md, config, configParsers, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, fs, synchronous, lintWorkerCallback);
    } else if (currentItem = stringsKeys.shift()) {
      // Lint next string
      concurrency++;
      lintContent(ruleList, aliasToRuleNames, currentItem, strings[currentItem] || "", md, config, configParsers, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, lintWorkerCallback);
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
  var results = null;
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
 * Extend specified configuration object.
 *
 * @param {Configuration} config Configuration object.
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} parsers Parsing
 * function(s).
 * @param {Object} fs File system implementation.
 * @param {ReadConfigCallback} callback Callback (err, result) function.
 * @returns {void}
 */
function extendConfig(config, file, parsers, fs, callback) {
  var configExtends = config["extends"];
  if (configExtends) {
    return resolveConfigExtends(file, helpers.expandTildePath(configExtends, __webpack_require__(/*! node:os */ "?e6c4")), fs,
    // eslint-disable-next-line no-use-before-define
    function (_, resolvedExtends) {
      return readConfig(
      // @ts-ignore
      resolvedExtends, parsers, fs, function (err, extendsConfig) {
        if (err) {
          return callback(err);
        }
        var result = _objectSpread(_objectSpread({}, extendsConfig), config);
        delete result["extends"];
        return callback(null, result);
      });
    });
  }
  return callback(null, config);
}
var extendConfigPromisify = promisify && promisify(extendConfig);

/**
 * Extend specified configuration object.
 *
 * @param {Configuration} config Configuration object.
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} [parsers] Parsing function(s).
 * @param {Object} [fs] File system implementation.
 * @returns {Promise<Configuration>} Configuration object.
 */
function extendConfigPromise(config, file, parsers, fs) {
  // @ts-ignore
  return extendConfigPromisify(config, file, parsers, fs);
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
  file = helpers.expandTildePath(file, __webpack_require__(/*! node:os */ "?e6c4"));
  // eslint-disable-next-line n/prefer-promises/fs
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
    // @ts-ignore
    return extendConfig(config, file, parsers, fs, callback);
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
  "extendConfig": extendConfigPromise,
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
 * @property {URL} [information] Link to more information.
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
 * Called with the result of linting a string or document.
 *
 * @callback LintContentCallback
 * @param {Error | null} error Error iff failed.
 * @param {LintError[]} [result] Result iff successful.
 * @returns {void}
 */

/**
 * Called with the result of the lint function.
 *
 * @callback LintCallback
 * @param {Error | null} error Error object iff failed.
 * @param {LintResults} [results] Lint results iff succeeded.
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
    params.parsers.markdownit.tokens.every(function forToken(token) {
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
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
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
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
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
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
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
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
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
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
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
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorDetailIf = _require.addErrorDetailIf,
  blockquotePrefixRe = _require.blockquotePrefixRe,
  isBlankLine = _require.isBlankLine;
var _require2 = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs"),
  filterByTypes = _require2.filterByTypes,
  getHeadingLevel = _require2.getHeadingLevel;
var defaultLines = 1;
var getLinesFunction = function getLinesFunction(linesParam) {
  if (Array.isArray(linesParam)) {
    var linesArray = new Array(6).fill(defaultLines);
    var _iterator = _createForOfIteratorHelper(_toConsumableArray(linesParam.entries()).slice(0, 6)),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
          index = _step$value[0],
          value = _step$value[1];
        linesArray[index] = value;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return function (heading) {
      return linesArray[getHeadingLevel(heading) - 1];
    };
  }
  // Coerce linesParam to a number
  var lines = linesParam === undefined ? defaultLines : Number(linesParam);
  return function () {
    return lines;
  };
};
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
    var getLinesAbove = getLinesFunction(params.config.lines_above);
    var getLinesBelow = getLinesFunction(params.config.lines_below);
    var lines = params.lines,
      parsers = params.parsers;
    var headings = filterByTypes(parsers.micromark.tokens, ["atxHeading", "setextHeading"]);
    var _iterator2 = _createForOfIteratorHelper(headings),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var heading = _step2.value;
        var startLine = heading.startLine,
          endLine = heading.endLine;
        var line = lines[startLine - 1].trim();

        // Check lines above
        var linesAbove = getLinesAbove(heading);
        if (linesAbove >= 0) {
          var actualAbove = 0;
          for (var i = 0; i < linesAbove && isBlankLine(lines[startLine - 2 - i]); i++) {
            actualAbove++;
          }
          addErrorDetailIf(onError, startLine, linesAbove, actualAbove, "Above", line, null, {
            "insertText": getBlockQuote(lines[startLine - 2], linesAbove - actualAbove)
          });
        }

        // Check lines below
        var linesBelow = getLinesBelow(heading);
        if (linesBelow >= 0) {
          var actualBelow = 0;
          for (var _i = 0; _i < linesBelow && isBlankLine(lines[endLine + _i]); _i++) {
            actualBelow++;
          }
          addErrorDetailIf(onError, startLine, linesBelow, actualBelow, "Below", line, null, {
            "lineNumber": endLine + 1,
            "insertText": getBlockQuote(lines[endLine], linesBelow - actualBelow)
          });
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
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
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



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addError = _require.addError,
  allPunctuationNoQuestion = _require.allPunctuationNoQuestion,
  endOfLineGemojiCodeRe = _require.endOfLineGemojiCodeRe,
  endOfLineHtmlEntityRe = _require.endOfLineHtmlEntityRe,
  escapeForRegExp = _require.escapeForRegExp;
var _require2 = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs"),
  filterByTypes = _require2.filterByTypes;
module.exports = {
  "names": ["MD026", "no-trailing-punctuation"],
  "description": "Trailing punctuation in heading",
  "tags": ["headings", "headers"],
  "function": function MD026(params, onError) {
    var punctuation = params.config.punctuation;
    punctuation = String(punctuation === undefined ? allPunctuationNoQuestion : punctuation);
    var trailingPunctuationRe = new RegExp("\\s*[" + escapeForRegExp(punctuation) + "]+$");
    var headings = filterByTypes(params.parsers.micromark.tokens, ["atxHeadingText", "setextHeadingText"]);
    var _iterator = _createForOfIteratorHelper(headings),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var heading = _step.value;
        var endLine = heading.endLine,
          startColumn = heading.startColumn,
          text = heading.text;
        var match = trailingPunctuationRe.exec(text);
        if (match && !endOfLineHtmlEntityRe.test(text) && !endOfLineGemojiCodeRe.test(text)) {
          var fullMatch = match[0];
          var column = startColumn + match.index;
          var length = fullMatch.length;
          addError(onError, endLine, "Punctuation: '".concat(fullMatch, "'"), undefined, [column, length], {
            "editColumn": column,
            "deleteCount": length
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

/***/ "../lib/md027.js":
/*!***********************!*\
  !*** ../lib/md027.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
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
    var _iterator = _createForOfIteratorHelper(params.parsers.markdownit.tokens),
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
    var _iterator = _createForOfIteratorHelper(params.parsers.markdownit.tokens),
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
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
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
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
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
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
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
var _require2 = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs"),
  filterByPredicate = _require2.filterByPredicate;
var nonContentTokens = new Set(["blockQuoteMarker", "blockQuotePrefix", "blockQuotePrefixWhitespace", "lineEnding", "lineEndingBlank", "linePrefix", "listItemIndent"]);
var isList = function isList(token) {
  return token.type === "listOrdered" || token.type === "listUnordered";
};
var addBlankLineError = function addBlankLineError(onError, lines, lineIndex, lineNumber) {
  var line = lines[lineIndex];
  var quotePrefix = line.match(blockquotePrefixRe)[0].trimEnd();
  addErrorContext(onError, lineIndex + 1, line.trim(), null, null, null, {
    lineNumber: lineNumber,
    "insertText": "".concat(quotePrefix, "\n")
  });
};
module.exports = {
  "names": ["MD032", "blanks-around-lists"],
  "description": "Lists should be surrounded by blank lines",
  "tags": ["bullet", "ul", "ol", "blank_lines"],
  "function": function MD032(params, onError) {
    var lines = params.lines,
      parsers = params.parsers;

    // For every top-level list...
    var topLevelLists = filterByPredicate(parsers.micromark.tokens, isList, function (token) {
      return isList(token) || token.type === "htmlFlow" ? [] : token.children;
    });
    var _iterator = _createForOfIteratorHelper(topLevelLists),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var list = _step.value;
        // Look for a blank line above the list
        var firstIndex = list.startLine - 1;
        if (!isBlankLine(lines[firstIndex - 1])) {
          addBlankLineError(onError, lines, firstIndex);
        }

        // Find the "visual" end of the list
        var endLine = list.endLine;
        var flattenedChildren = filterByPredicate(list.children, function () {
          return true;
        });
        var _iterator2 = _createForOfIteratorHelper(flattenedChildren.reverse()),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var child = _step2.value;
            if (!nonContentTokens.has(child.type)) {
              endLine = child.endLine;
              break;
            }
          }

          // Look for a blank line below the list
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        var lastIndex = endLine - 1;
        if (!isBlankLine(lines[lastIndex + 1])) {
          addBlankLineError(onError, lines, lastIndex, lastIndex + 2);
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



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addError = _require.addError;
var _require2 = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs"),
  filterByTypes = _require2.filterByTypes,
  getHtmlTagInfo = _require2.getHtmlTagInfo;
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
    var tokens = params.parsers.micromark.tokens;
    var _iterator = _createForOfIteratorHelper(filterByTypes(tokens, ["htmlText"])),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var token = _step.value;
        var htmlTagInfo = getHtmlTagInfo(token);
        if (htmlTagInfo && !htmlTagInfo.close && !allowedElements.includes(htmlTagInfo.name.toLowerCase())) {
          var range = [token.startColumn, token.text.replace(nextLinesRe, "").length];
          addError(onError, token.startLine, "Element: " + htmlTagInfo.name, undefined, range);
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
  filterByTypes = _require2.filterByTypes,
  getHtmlTagInfo = _require2.getHtmlTagInfo,
  parse = _require2.parse;
module.exports = {
  "names": ["MD034", "no-bare-urls"],
  "description": "Bare URL used",
  "tags": ["links", "url"],
  "function": function MD034(params, onError) {
    var literalAutolinks = function literalAutolinks(tokens) {
      var flattened = filterByPredicate(tokens, function () {
        return true;
      });
      var result = [];
      for (var i = 0; i < flattened.length; i++) {
        var current = flattened[i];
        var openTagInfo = getHtmlTagInfo(current);
        if (openTagInfo && !openTagInfo.close) {
          var count = 1;
          for (var j = i + 1; j < flattened.length; j++) {
            var candidate = flattened[j];
            var closeTagInfo = getHtmlTagInfo(candidate);
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
          result.push(current);
        }
      }
      return result.filter(function (token) {
        return token.type === "literalAutolink";
      });
    };
    var autoLinks = filterByTypes(params.parsers.micromark.tokens, ["literalAutolink"]);
    if (autoLinks.length > 0) {
      // Re-parse with correct link/image reference definition handling
      var document = params.lines.join("\n");
      var tokens = parse(document, undefined, false);
      var _iterator = _createForOfIteratorHelper(literalAutolinks(tokens)),
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



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorDetailIf = _require.addErrorDetailIf;
var _require2 = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs"),
  filterByTypes = _require2.filterByTypes;
module.exports = {
  "names": ["MD035", "hr-style"],
  "description": "Horizontal rule style",
  "tags": ["hr"],
  "function": function MD035(params, onError) {
    var style = String(params.config.style || "consistent").trim();
    var thematicBreaks = filterByTypes(params.parsers.micromark.tokens, ["thematicBreak"]);
    var _iterator = _createForOfIteratorHelper(thematicBreaks),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var token = _step.value;
        var startLine = token.startLine,
          text = token.text;
        if (style === "consistent") {
          style = text;
        }
        addErrorDetailIf(onError, startLine, style, text);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
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
    var _iterator = _createForOfIteratorHelper(params.parsers.markdownit.tokens),
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



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addError = _require.addError;
var _require2 = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs"),
  filterByPredicate = _require2.filterByPredicate;
module.exports = {
  "names": ["MD037", "no-space-in-emphasis"],
  "description": "Spaces inside emphasis markers",
  "tags": ["whitespace", "emphasis"],
  "function": function MD037(params, onError) {
    // Initialize variables
    var lines = params.lines,
      parsers = params.parsers;
    var emphasisTokensByMarker = new Map();
    for (var _i = 0, _arr = ["_", "__", "___", "*", "**", "***"]; _i < _arr.length; _i++) {
      var marker = _arr[_i];
      emphasisTokensByMarker.set(marker, []);
    }
    var tokens = filterByPredicate(parsers.micromark.tokens, function (token) {
      return token.children.some(function (child) {
        return child.type === "data";
      });
    });
    var _iterator = _createForOfIteratorHelper(tokens),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var token = _step.value;
        // Build lists of bare tokens for each emphasis marker type
        var _iterator2 = _createForOfIteratorHelper(emphasisTokensByMarker.values()),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var emphasisTokens = _step2.value;
            emphasisTokens.length = 0;
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        var _iterator3 = _createForOfIteratorHelper(token.children),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var child = _step3.value;
            var text = child.text,
              type = child.type;
            if (type === "data" && text.length <= 3) {
              var _emphasisTokens = emphasisTokensByMarker.get(text);
              if (_emphasisTokens) {
                _emphasisTokens.push(child);
              }
            }
          }

          // Process bare tokens for each emphasis marker type
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        var _iterator4 = _createForOfIteratorHelper(emphasisTokensByMarker.entries()),
          _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var entry = _step4.value;
            var _entry = _slicedToArray(entry, 2),
              _marker = _entry[0],
              _emphasisTokens2 = _entry[1];
            for (var i = 0; i + 1 < _emphasisTokens2.length; i += 2) {
              // Process start token of start/end pair
              var startToken = _emphasisTokens2[i];
              var startLine = lines[startToken.startLine - 1];
              var startSlice = startLine.slice(startToken.endColumn - 1);
              var startMatch = startSlice.match(/^\s+\S/);
              if (startMatch) {
                var _startMatch = _slicedToArray(startMatch, 1),
                  startSpaceCharacter = _startMatch[0];
                var startContext = "".concat(_marker).concat(startSpaceCharacter);
                addError(onError, startToken.startLine, undefined, startContext, [startToken.startColumn, startContext.length], {
                  "editColumn": startToken.endColumn,
                  "deleteCount": startSpaceCharacter.length - 1
                });
              }

              // Process end token of start/end pair
              var endToken = _emphasisTokens2[i + 1];
              var endLine = lines[endToken.startLine - 1];
              var endSlice = endLine.slice(0, endToken.startColumn - 1);
              var endMatch = endSlice.match(/\S\s+$/);
              if (endMatch) {
                var _endMatch = _slicedToArray(endMatch, 1),
                  endSpaceCharacter = _endMatch[0];
                var endContext = "".concat(endSpaceCharacter).concat(_marker);
                addError(onError, endToken.startLine, undefined, endContext, [endToken.endColumn - endContext.length, endContext.length], {
                  "editColumn": endToken.startColumn - (endSpaceCharacter.length - 1),
                  "deleteCount": endSpaceCharacter.length - 1
                });
              }
            }
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
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

/***/ "../lib/md038.js":
/*!***********************!*\
  !*** ../lib/md038.js ***!
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
  filterByTypes = _require2.filterByTypes,
  tokenIfType = _require2.tokenIfType;
var leftSpaceRe = /^\s(?:[^`]|$)/;
var rightSpaceRe = /[^`]\s$/;
var trimCodeText = function trimCodeText(text, start, end) {
  text = text.replace(/^\s+$/, "");
  if (start) {
    text = text.replace(/^\s+?(\s`|\S)/, "$1");
  }
  if (end) {
    text = text.replace(/(`\s|\S)\s+$/, "$1");
  }
  return text;
};
module.exports = {
  "names": ["MD038", "no-space-in-code"],
  "description": "Spaces inside code span elements",
  "tags": ["whitespace", "code"],
  "function": function MD038(params, onError) {
    var codeTextTokens = filterByTypes(params.parsers.micromark.tokens, ["codeText"]);
    var _iterator = _createForOfIteratorHelper(codeTextTokens),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var token = _step.value;
        var children = token.children;
        var first = 0;
        var last = children.length - 1;
        var startSequence = tokenIfType(children[first], "codeTextSequence");
        var endSequence = tokenIfType(children[last], "codeTextSequence");
        var startData = tokenIfType(children[first + 1], "codeTextData") || tokenIfType(children[first + 2], "codeTextData");
        var endData = tokenIfType(children[last - 1], "codeTextData") || tokenIfType(children[last - 2], "codeTextData");
        if (startSequence && endSequence && startData && endData) {
          var spaceLeft = leftSpaceRe.test(startData.text);
          var spaceRight = !spaceLeft && rightSpaceRe.test(endData.text);
          if (spaceLeft || spaceRight) {
            var lineNumber = startSequence.startLine;
            var range = null;
            var fixInfo = null;
            if (startSequence.startLine === endSequence.endLine) {
              range = [startSequence.startColumn, endSequence.endColumn - startSequence.startColumn];
              fixInfo = {
                "editColumn": startSequence.endColumn,
                "deleteCount": endSequence.startColumn - startSequence.endColumn,
                "insertText": trimCodeText(startData.text, true, true)
              };
            } else if (spaceLeft) {
              range = [startSequence.startColumn, startData.endColumn - startSequence.startColumn];
              fixInfo = {
                "editColumn": startSequence.endColumn,
                "deleteCount": startData.endColumn - startData.startColumn,
                "insertText": trimCodeText(startData.text, true, false)
              };
            } else {
              lineNumber = endSequence.endLine;
              range = [endData.startColumn, endSequence.endColumn - endData.startColumn];
              fixInfo = {
                "editColumn": endData.startColumn,
                "deleteCount": endData.endColumn - endData.startColumn,
                "insertText": trimCodeText(endData.text, false, true)
              };
            }
            var context = params.lines[lineNumber - 1].substring(range[0] - 1, range[0] - 1 + range[1]);
            addErrorContext(onError, lineNumber, context, spaceLeft, spaceRight, range, fixInfo);
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
      params.parsers.markdownit.tokens.every(function (token) {
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
    if (!Array.isArray(requiredHeadings)) {
      // Nothing to check; avoid doing any work
      return;
    }
    var matchCase = params.config.match_case || false;
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
};

/***/ }),

/***/ "../lib/md044.js":
/*!***********************!*\
  !*** ../lib/md044.js ***!
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
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addErrorDetailIf = _require.addErrorDetailIf,
  escapeForRegExp = _require.escapeForRegExp,
  withinAnyRange = _require.withinAnyRange;
var _require2 = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs"),
  filterByPredicate = _require2.filterByPredicate,
  filterByTypes = _require2.filterByTypes,
  parse = _require2.parse;
var ignoredChildTypes = new Set(["codeFencedFence", "definition", "reference", "resource"]);
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
    if (names.length === 0) {
      // Nothing to check; avoid doing any work
      return;
    }
    var codeBlocks = params.config.code_blocks;
    var includeCodeBlocks = codeBlocks === undefined ? true : !!codeBlocks;
    var htmlElements = params.config.html_elements;
    var includeHtmlElements = htmlElements === undefined ? true : !!htmlElements;
    var scannedTypes = new Set(["data"]);
    if (includeCodeBlocks) {
      scannedTypes.add("codeFlowValue");
      scannedTypes.add("codeTextData");
    }
    if (includeHtmlElements) {
      scannedTypes.add("htmlFlowData");
      scannedTypes.add("htmlTextData");
    }
    var contentTokens = filterByPredicate(params.parsers.micromark.tokens, function (token) {
      return scannedTypes.has(token.type);
    }, function (token) {
      return token.children.filter(function (t) {
        return !ignoredChildTypes.has(t.type);
      });
    });
    var exclusions = [];
    var autoLinked = new Set();
    var _iterator = _createForOfIteratorHelper(names),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var name = _step.value;
        var escapedName = escapeForRegExp(name);
        var startNamePattern = /^\W/.test(name) ? "" : "\\b_*";
        var endNamePattern = /\W$/.test(name) ? "" : "_*\\b";
        var namePattern = "(".concat(startNamePattern, ")(").concat(escapedName, ")").concat(endNamePattern);
        var nameRe = new RegExp(namePattern, "gi");
        var _iterator2 = _createForOfIteratorHelper(contentTokens),
          _step2;
        try {
          var _loop = function _loop() {
            var token = _step2.value;
            var match = null;
            var _loop2 = function _loop2() {
              var _match = match,
                _match2 = _slicedToArray(_match, 3),
                leftMatch = _match2[1],
                nameMatch = _match2[2];
              var index = token.startColumn - 1 + match.index + leftMatch.length;
              var length = nameMatch.length;
              var lineIndex = token.startLine - 1;
              if (!withinAnyRange(exclusions, lineIndex, index, length) && !names.includes(nameMatch)) {
                var urlRanges = [];
                if (!autoLinked.has(token)) {
                  urlRanges = filterByTypes(parse(token.text), ["literalAutolink"]).map(function (t) {
                    return [lineIndex, token.startColumn - 1 + t.startColumn - 1, t.endColumn - t.startColumn];
                  });
                  exclusions.push.apply(exclusions, _toConsumableArray(urlRanges));
                  autoLinked.add(token);
                }
                if (!withinAnyRange(urlRanges, lineIndex, index, length)) {
                  var column = index + 1;
                  addErrorDetailIf(onError, token.startLine, name, nameMatch, null, null, [column, length], {
                    "editColumn": column,
                    "deleteCount": length,
                    "insertText": name
                  });
                }
              }
              exclusions.push([lineIndex, index, length]);
            };
            while ((match = nameRe.exec(token.text)) !== null) {
              _loop2();
            }
          };
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            _loop();
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

/***/ "../lib/md045.js":
/*!***********************!*\
  !*** ../lib/md045.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addError = _require.addError;
var _require2 = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs"),
  filterByTypes = _require2.filterByTypes;
module.exports = {
  "names": ["MD045", "no-alt-text"],
  "description": "Images should have alternate text (alt text)",
  "tags": ["accessibility", "images"],
  "function": function MD045(params, onError) {
    var images = filterByTypes(params.parsers.micromark.tokens, ["image"]);
    var _iterator = _createForOfIteratorHelper(images),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var image = _step.value;
        var labelTexts = filterByTypes(image.children, ["labelText"]);
        if (labelTexts.some(function (labelText) {
          return labelText.text.length === 0;
        })) {
          var range = image.startLine === image.endLine ? [image.startColumn, image.endColumn - image.startColumn] : undefined;
          addError(onError, image.startLine, undefined, undefined, range);
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
    var codeBlocksAndFences = params.parsers.markdownit.tokens.filter(function (token) {
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
    var fenceTokens = params.parsers.markdownit.tokens.filter(function (token) {
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



function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addError = _require.addError,
  emphasisOrStrongStyleFor = _require.emphasisOrStrongStyleFor;
var _require2 = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs"),
  filterByPredicate = _require2.filterByPredicate,
  tokenIfType = _require2.tokenIfType;
var intrawordRe = /\w/;
var impl = function impl(params, onError, type, asterisk, underline) {
  var style = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "consistent";
  var lines = params.lines,
    parsers = params.parsers;
  var emphasisTokens = filterByPredicate(parsers.micromark.tokens, function (token) {
    return token.type === type;
  }, function (token) {
    return token.type === "htmlFlow" ? [] : token.children;
  });
  var _iterator = _createForOfIteratorHelper(emphasisTokens),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var token = _step.value;
      var children = token.children;
      var childType = "".concat(type, "Sequence");
      var startSequence = tokenIfType(children[0], childType);
      var endSequence = tokenIfType(children[children.length - 1], childType);
      if (startSequence && endSequence) {
        var markupStyle = emphasisOrStrongStyleFor(startSequence.text);
        if (style === "consistent") {
          style = markupStyle;
        }
        if (style !== markupStyle) {
          var underscoreIntraword = style === "underscore" && (intrawordRe.test(lines[startSequence.startLine - 1][startSequence.startColumn - 2]) || intrawordRe.test(lines[endSequence.endLine - 1][endSequence.endColumn - 1]));
          if (!underscoreIntraword) {
            for (var _i = 0, _arr = [startSequence, endSequence]; _i < _arr.length; _i++) {
              var sequence = _arr[_i];
              addError(onError, sequence.startLine, "Expected: ".concat(style, "; Actual: ").concat(markupStyle), undefined, [sequence.startColumn, sequence.text.length], {
                "editColumn": sequence.startColumn,
                "deleteCount": sequence.text.length,
                "insertText": style === "asterisk" ? asterisk : underline
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
};
module.exports = [{
  "names": ["MD049", "emphasis-style"],
  "description": "Emphasis style should be consistent",
  "tags": ["emphasis"],
  "function": function MD049(params, onError) {
    return impl(params, onError, "emphasis", "*", "_", params.config.style || undefined);
  }
}, {
  "names": ["MD050", "strong-style"],
  "description": "Strong style should be consistent",
  "tags": ["emphasis"],
  "function": function MD050(params, onError) {
    return impl(params, onError, "strong", "**", "__", params.config.style || undefined);
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
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _require = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"),
  addError = _require.addError,
  addErrorDetailIf = _require.addErrorDetailIf;
var _require2 = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs"),
  filterByPredicate = _require2.filterByPredicate,
  filterByTypes = _require2.filterByTypes,
  getHtmlTagInfo = _require2.getHtmlTagInfo;

// Regular expression for identifying HTML anchor names
var idRe = /[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]id[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*=[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*["']?((?:(?![\t-\r "'>\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uD800-\uDFFF\uFEFF])[\s\S]|[\uD800-\uDBFF][\uDC00-\uDFFF])+)/i;
var nameRe = /[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]name[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*=[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*["']?((?:(?![\t-\r "'>\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uD800-\uDFFF\uFEFF])[\s\S]|[\uD800-\uDBFF][\uDC00-\uDFFF])+)/i;
var anchorRe = /\{(#[0-9a-z]+(?:[\x2D_][0-9a-z]+)*)\}/g;

// Sets for filtering heading tokens during conversion
var childrenExclude = new Set(["image", "reference", "resource"]);
var tokensInclude = new Set(["codeTextData", "data"]);

/**
 * @typedef {import("../helpers/micromark.cjs").Token} Token
 */

/**
 * Converts a Markdown heading into an HTML fragment according to the rules
 * used by GitHub.
 *
 * @param {Token} headingText Heading text token.
 * @returns {string} Fragment string for heading.
 */
function convertHeadingToHTMLFragment(headingText) {
  var inlineText = filterByPredicate(headingText.children, function (token) {
    return tokensInclude.has(token.type);
  }, function (token) {
    return childrenExclude.has(token.type) ? [] : token.children;
  }).map(function (token) {
    return token.text;
  }).join("");
  return "#" + encodeURIComponent(inlineText.toLowerCase()
  // RegExp source with Ruby's \p{Word} expanded into its General Categories
  // eslint-disable-next-line max-len
  // https://github.com/gjtorikian/html-pipeline/blob/main/lib/html/pipeline/toc_filter.rb
  // https://ruby-doc.org/core-3.0.2/Regexp.html
  .replace(/(?:[\0-\x1F!-,\.\/:-@\[-\^`\{-\xA9\xAB-\xB1\xB4\xB6-\xB8\xBB\xBF\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0378\u0379\u037E\u0380-\u0385\u0387\u038B\u038D\u03A2\u03F6\u0482\u0530\u0557\u0558\u055A-\u055F\u0589-\u0590\u05BE\u05C0\u05C3\u05C6\u05C8-\u05CF\u05EB-\u05EE\u05F3-\u060F\u061B-\u061F\u066A-\u066D\u06D4\u06DD\u06DE\u06E9\u06FD\u06FE\u0700-\u070F\u074B\u074C\u07B2-\u07BF\u07F6-\u07F9\u07FB\u07FC\u07FE\u07FF\u082E-\u083F\u085C-\u085F\u086B-\u086F\u0888\u088F-\u0897\u08E2\u0964\u0965\u0970\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09F2\u09F3\u09FA\u09FB\u09FD\u09FF\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF0-\u0AF8\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B54\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B70\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BF3-\u0BFF\u0C0D\u0C11\u0C29\u0C3A\u0C3B\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5B\u0C5C\u0C5E\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C7F\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDC\u0CDF\u0CE4\u0CE5\u0CF0\u0CF4-\u0CFF\u0D0D\u0D11\u0D45\u0D49\u0D4F-\u0D53\u0D64\u0D65\u0D79\u0D80\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DE5\u0DF0\u0DF1\u0DF4-\u0E00\u0E3B-\u0E3F\u0E4F\u0E5A-\u0E80\u0E83\u0E85\u0E8B\u0EA4\u0EA6\u0EBE\u0EBF\u0EC5\u0EC7\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F01-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0F3A-\u0F3D\u0F48\u0F6D-\u0F70\u0F85\u0F98\u0FBD-\u0FC5\u0FC7-\u0FFF\u104A-\u104F\u109E\u109F\u10C6\u10C8-\u10CC\u10CE\u10CF\u10FB\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u1360-\u1368\u137D-\u137F\u1390-\u139F\u13F6\u13F7\u13FE-\u1400\u166D\u166E\u1680\u169B-\u169F\u16EB-\u16ED\u16F9-\u16FF\u1716-\u171E\u1735-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17D4-\u17D6\u17D8-\u17DB\u17DE\u17DF\u17EA-\u17EF\u17FA-\u180A\u180E\u181A-\u181F\u1879-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191F\u192C-\u192F\u193C-\u1945\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19FF\u1A1C-\u1A1F\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1AA6\u1AA8-\u1AAF\u1ACF-\u1AFF\u1B4D-\u1B4F\u1B5A-\u1B6A\u1B74-\u1B7F\u1BF4-\u1BFF\u1C38-\u1C3F\u1C4A-\u1C4C\u1C7E\u1C7F\u1C89-\u1C8F\u1CBB\u1CBC\u1CC0-\u1CCF\u1CD3\u1CFB-\u1CFF\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FBD\u1FBF-\u1FC1\u1FC5\u1FCD-\u1FCF\u1FD4\u1FD5\u1FDC-\u1FDF\u1FED-\u1FF1\u1FF5\u1FFD-\u203E\u2041-\u2053\u2055-\u206F\u2072\u2073\u207A-\u207E\u208A-\u208F\u209D-\u20CF\u20F1-\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A-\u245F\u249C-\u24E9\u2500-\u2775\u2794-\u2BFF\u2CE5-\u2CEA\u2CF4-\u2CFC\u2CFE\u2CFF\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D70-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E00-\u2E2E\u2E30-\u3004\u3008-\u3020\u3030\u3036\u3037\u303D-\u3040\u3097\u3098\u309B\u309C\u30A0\u30FB\u3100-\u3104\u3130\u318F-\u3191\u3196-\u319F\u31C0-\u31EF\u3200-\u321F\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA48D-\uA4CF\uA4FE\uA4FF\uA60D-\uA60F\uA62C-\uA63F\uA673\uA67E\uA6F2-\uA716\uA720\uA721\uA789\uA78A\uA7CB-\uA7CF\uA7D2\uA7D4\uA7DA-\uA7F1\uA828-\uA82B\uA82D-\uA82F\uA836-\uA83F\uA874-\uA87F\uA8C6-\uA8CF\uA8DA-\uA8DF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA954-\uA95F\uA97D-\uA97F\uA9C1-\uA9CE\uA9DA-\uA9DF\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A-\uAA5F\uAA77-\uAA79\uAAC3-\uAADA\uAADE\uAADF\uAAF0\uAAF1\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB5B\uAB6A-\uAB6F\uABEB\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uE000-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB29\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFC-\uFDFF\uFE10-\uFE1F\uFE30-\uFE32\uFE35-\uFE4C\uFE50-\uFE6F\uFE75\uFEFD-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF3E\uFF40\uFF5B-\uFF65\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFFF]|\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDD06\uDD34-\uDD3F\uDD79-\uDD89\uDD8C-\uDDFC\uDDFE-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEDF\uDEFC-\uDEFF\uDF24-\uDF2C\uDF4B-\uDF4F\uDF7B-\uDF7F\uDF9E\uDF9F\uDFC4-\uDFC7\uDFD0\uDFD6-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDCAF\uDCD4-\uDCD7\uDCFC-\uDCFF\uDD28-\uDD2F\uDD64-\uDD6F\uDD7B\uDD8B\uDD93\uDD96\uDDA2\uDDB2\uDDBA\uDDBD-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDF7F\uDF86\uDFB1\uDFBB-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56\uDC57\uDC77\uDC78\uDC9F-\uDCA6\uDCB0-\uDCDF\uDCF3\uDCF6-\uDCFA\uDD1C-\uDD1F\uDD3A-\uDD7F\uDDB8-\uDDBB\uDDD0\uDDD1\uDE04\uDE07-\uDE0B\uDE14\uDE18\uDE36\uDE37\uDE3B-\uDE3E\uDE49-\uDE5F\uDE7F\uDEA0-\uDEBF\uDEC8\uDEE7-\uDEEA\uDEF0-\uDEFF\uDF36-\uDF3F\uDF56\uDF57\uDF73-\uDF77\uDF92-\uDFA8\uDFB0-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDCF9\uDD28-\uDD2F\uDD3A-\uDE5F\uDE7F\uDEAA\uDEAD-\uDEAF\uDEB2-\uDEFC\uDF28-\uDF2F\uDF55-\uDF6F\uDF86-\uDFAF\uDFCC-\uDFDF\uDFF7-\uDFFF]|\uD804[\uDC47-\uDC51\uDC76-\uDC7E\uDCBB-\uDCC1\uDCC3-\uDCCF\uDCE9-\uDCEF\uDCFA-\uDCFF\uDD35\uDD40-\uDD43\uDD48-\uDD4F\uDD74\uDD75\uDD77-\uDD7F\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDE0\uDDF5-\uDDFF\uDE12\uDE38-\uDE3D\uDE42-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEA9-\uDEAF\uDEEB-\uDEEF\uDEFA-\uDEFF\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A\uDF45\uDF46\uDF49\uDF4A\uDF4E\uDF4F\uDF51-\uDF56\uDF58-\uDF5C\uDF64\uDF65\uDF6D-\uDF6F\uDF75-\uDFFF]|\uD805[\uDC4B-\uDC4F\uDC5A-\uDC5D\uDC62-\uDC7F\uDCC6\uDCC8-\uDCCF\uDCDA-\uDD7F\uDDB6\uDDB7\uDDC1-\uDDD7\uDDDE-\uDDFF\uDE41-\uDE43\uDE45-\uDE4F\uDE5A-\uDE7F\uDEB9-\uDEBF\uDECA-\uDEFF\uDF1B\uDF1C\uDF2C-\uDF2F\uDF3C-\uDF3F\uDF47-\uDFFF]|\uD806[\uDC3B-\uDC9F\uDCF3-\uDCFE\uDD07\uDD08\uDD0A\uDD0B\uDD14\uDD17\uDD36\uDD39\uDD3A\uDD44-\uDD4F\uDD5A-\uDD9F\uDDA8\uDDA9\uDDD8\uDDD9\uDDE2\uDDE5-\uDDFF\uDE3F-\uDE46\uDE48-\uDE4F\uDE9A-\uDE9C\uDE9E-\uDEAF\uDEF9-\uDFFF]|\uD807[\uDC09\uDC37\uDC41-\uDC4F\uDC6D-\uDC71\uDC90\uDC91\uDCA8\uDCB7-\uDCFF\uDD07\uDD0A\uDD37-\uDD39\uDD3B\uDD3E\uDD48-\uDD4F\uDD5A-\uDD5F\uDD66\uDD69\uDD8F\uDD92\uDD99-\uDD9F\uDDAA-\uDEDF\uDEF7-\uDEFF\uDF11\uDF3B-\uDF3D\uDF43-\uDF4F\uDF5A-\uDFAF\uDFB1-\uDFBF\uDFD5-\uDFFF]|\uD808[\uDF9A-\uDFFF]|\uD809[\uDC6F-\uDC7F\uDD44-\uDFFF]|[\uD80A\uD80E-\uD810\uD812-\uD819\uD824-\uD82A\uD82D\uD82E\uD830-\uD832\uD83D\uD83F\uD87C\uD87D\uD87F\uD889-\uDB3F\uDB41-\uDBFF][\uDC00-\uDFFF]|\uD80B[\uDC00-\uDF8F\uDFF1-\uDFFF]|\uD80D[\uDC30-\uDC3F\uDC56-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD81A[\uDE39-\uDE3F\uDE5F\uDE6A-\uDE6F\uDEBF\uDECA-\uDECF\uDEEE\uDEEF\uDEF5-\uDEFF\uDF37-\uDF3F\uDF44-\uDF4F\uDF5A\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD81B[\uDC00-\uDE3F\uDE97-\uDEFF\uDF4B-\uDF4E\uDF88-\uDF8E\uDFA0-\uDFDF\uDFE2\uDFE5-\uDFEF\uDFF2-\uDFFF]|\uD821[\uDFF8-\uDFFF]|\uD823[\uDCD6-\uDCFF\uDD09-\uDFFF]|\uD82B[\uDC00-\uDFEF\uDFF4\uDFFC\uDFFF]|\uD82C[\uDD23-\uDD31\uDD33-\uDD4F\uDD53\uDD54\uDD56-\uDD63\uDD68-\uDD6F\uDEFC-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A-\uDC9C\uDC9F-\uDFFF]|\uD833[\uDC00-\uDEFF\uDF2E\uDF2F\uDF47-\uDFFF]|\uD834[\uDC00-\uDD64\uDD6A-\uDD6C\uDD73-\uDD7A\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDE41\uDE45-\uDEBF\uDED4-\uDEDF\uDEF4-\uDF5F\uDF79-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3\uDFCC\uDFCD]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85-\uDE9A\uDEA0\uDEB0-\uDFFF]|\uD837[\uDC00-\uDEFF\uDF1F-\uDF24\uDF2B-\uDFFF]|\uD838[\uDC07\uDC19\uDC1A\uDC22\uDC25\uDC2B-\uDC2F\uDC6E-\uDC8E\uDC90-\uDCFF\uDD2D-\uDD2F\uDD3E\uDD3F\uDD4A-\uDD4D\uDD4F-\uDE8F\uDEAF-\uDEBF\uDEFA-\uDFFF]|\uD839[\uDC00-\uDCCF\uDCFA-\uDFDF\uDFE7\uDFEC\uDFEF\uDFFF]|\uD83A[\uDCC5\uDCC6\uDCD7-\uDCFF\uDD4C-\uDD4F\uDD5A-\uDFFF]|\uD83B[\uDC00-\uDC70\uDCAC\uDCB0\uDCB5-\uDD00\uDD2E\uDD3E-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDFFF]|\uD83C[\uDC00-\uDCFF\uDD0D-\uDFFF]|\uD83E[\uDC00-\uDFEF\uDFFA-\uDFFF]|\uD869[\uDEE0-\uDEFF]|\uD86D[\uDF3A-\uDF3F]|\uD86E[\uDC1E\uDC1F]|\uD873[\uDEA2-\uDEAF]|\uD87A[\uDFE1-\uDFEF]|\uD87B[\uDE5E-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uD884[\uDF4B-\uDF4F]|\uD888[\uDFB0-\uDFFF]|\uDB40[\uDC00-\uDCFF\uDDF0-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g, "").replace(/ /g, "-"));
}

/**
 * Unescapes the text of a String-type micromark Token.
 *
 * @param {Token} token String-type micromark Token.
 * @returns {string} Unescaped token text.
 */
function unescapeStringTokenText(token) {
  return filterByTypes(token.children, ["characterEscapeValue", "data"]).map(function (child) {
    return child.text;
  }).join("");
}
module.exports = {
  "names": ["MD051", "link-fragments"],
  "description": "Link fragments should be valid",
  "tags": ["links"],
  "function": function MD051(params, onError) {
    var tokens = params.parsers.micromark.tokens;
    var fragments = new Map();

    // Process headings
    var headingTexts = filterByTypes(tokens, ["atxHeadingText", "setextHeadingText"]);
    var _iterator = _createForOfIteratorHelper(headingTexts),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var headingText = _step.value;
        var fragment = convertHeadingToHTMLFragment(headingText);
        if (fragment !== "#") {
          var count = fragments.get(fragment) || 0;
          if (count) {
            fragments.set("".concat(fragment, "-").concat(count), 0);
          }
          fragments.set(fragment, count + 1);
          var match = null;
          while ((match = anchorRe.exec(headingText.text)) !== null) {
            var _match = match,
              _match2 = _slicedToArray(_match, 2),
              anchor = _match2[1];
            if (!fragments.has(anchor)) {
              fragments.set(anchor, 1);
            }
          }
        }
      }

      // Process HTML anchors
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var _iterator2 = _createForOfIteratorHelper(filterByTypes(tokens, ["htmlText"])),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var token = _step2.value;
        var htmlTagInfo = getHtmlTagInfo(token);
        if (htmlTagInfo && !htmlTagInfo.close) {
          var anchorMatch = idRe.exec(token.text) || htmlTagInfo.name.toLowerCase() === "a" && nameRe.exec(token.text);
          if (anchorMatch) {
            fragments.set("#".concat(anchorMatch[1]), 0);
          }
        }
      }

      // Process link and definition fragments
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    var parentChilds = [["link", "resourceDestinationString"], ["definition", "definitionDestinationString"]];
    for (var _i = 0, _parentChilds = parentChilds; _i < _parentChilds.length; _i++) {
      var _parentChilds$_i = _slicedToArray(_parentChilds[_i], 2),
        parentType = _parentChilds$_i[0],
        definitionType = _parentChilds$_i[1];
      var links = filterByTypes(tokens, [parentType]);
      var _iterator3 = _createForOfIteratorHelper(links),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var link = _step3.value;
          var definitions = filterByTypes(link.children, [definitionType]);
          var _iterator4 = _createForOfIteratorHelper(definitions),
            _step4;
          try {
            var _loop = function _loop() {
              var definition = _step4.value;
              var endColumn = definition.endColumn,
                startColumn = definition.startColumn;
              var text = unescapeStringTokenText(definition);
              if (text.length > 1 && text.startsWith("#") && !fragments.has(text) && !fragments.has("#".concat(encodeURIComponent(text.slice(1))))) {
                // eslint-disable-next-line no-undef-init
                var context = undefined;
                // eslint-disable-next-line no-undef-init
                var range = undefined;
                // eslint-disable-next-line no-undef-init
                var fixInfo = undefined;
                if (link.startLine === link.endLine) {
                  context = link.text;
                  range = [link.startColumn, link.endColumn - link.startColumn];
                  fixInfo = {
                    "editColumn": startColumn,
                    "deleteCount": endColumn - startColumn
                  };
                }
                var textLower = text.toLowerCase();
                var mixedCaseKey = _toConsumableArray(fragments.keys()).find(function (key) {
                  return textLower === key.toLowerCase();
                });
                if (mixedCaseKey) {
                  // @ts-ignore
                  (fixInfo || {}).insertText = mixedCaseKey;
                  addErrorDetailIf(onError, link.startLine, mixedCaseKey, text, undefined, context, range, fixInfo);
                } else {
                  addError(onError, link.startLine, undefined, context, range);
                }
              }
            };
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              _loop();
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
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
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
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
    var config = params.config,
      lines = params.lines;
    var shortcutSyntax = config.shortcut_syntax || false;
    var _referenceLinkImageDa = referenceLinkImageData(),
      definitions = _referenceLinkImageDa.definitions,
      references = _referenceLinkImageDa.references,
      shortcuts = _referenceLinkImageDa.shortcuts;
    var entries = shortcutSyntax ? [].concat(_toConsumableArray(references.entries()), _toConsumableArray(shortcuts.entries())) : references.entries();
    // Look for links/images that use an undefined link reference
    var _iterator = _createForOfIteratorHelper(entries),
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
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
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