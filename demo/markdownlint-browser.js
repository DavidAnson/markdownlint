/*! markdownlint 0.34.0 https://github.com/DavidAnson/markdownlint @license MIT */
var markdownlint;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../helpers/helpers.js":
/*!*****************************!*\
  !*** ../helpers/helpers.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



const micromark = __webpack_require__(/*! ./micromark.cjs */ "../helpers/micromark.cjs");

const { newLineRe, nextLinesRe } = __webpack_require__(/*! ./shared.js */ "../helpers/shared.js");

module.exports.newLineRe = newLineRe;
module.exports.nextLinesRe = nextLinesRe;

// Regular expression for matching common front matter (YAML and TOML)
module.exports.frontMatterRe =
  /((^---\s*$[\s\S]+?^---\s*)|(^\+\+\+\s*$[\s\S]+?^(\+\+\+|\.\.\.)\s*)|(^\{\s*$[\s\S]+?^\}\s*))(\r\n|\r|\n|$)/m;

// Regular expression for matching the start of inline disable/enable comments
const inlineCommentStartRe =
  /(<!--\s*markdownlint-(disable|enable|capture|restore|disable-file|enable-file|disable-line|disable-next-line|configure-file))(?:\s|-->)/gi;
module.exports.inlineCommentStartRe = inlineCommentStartRe;

// Regular expressions for range matching
module.exports.listItemMarkerRe = /^([\s>]*)(?:[*+-]|\d+[.)])\s+/;
module.exports.orderedListItemMarkerRe = /^[\s>]*0*(\d+)[.)]/;

// Regular expression for blockquote prefixes
const blockquotePrefixRe = /^[>\s]*/;
module.exports.blockquotePrefixRe = blockquotePrefixRe;

// Regular expression for link reference definitions
const linkReferenceDefinitionRe = /^ {0,3}\[([^\]]*[^\\])\]:/;
module.exports.linkReferenceDefinitionRe = linkReferenceDefinitionRe;

// Regular expression for identifying an HTML entity at the end of a line
module.exports.endOfLineHtmlEntityRe =
  /&(?:#\d+|#[xX][\da-fA-F]+|[a-zA-Z]{2,31}|blk\d{2}|emsp1[34]|frac\d{2}|sup\d|there4);$/;

// Regular expression for identifying a GitHub emoji code at the end of a line
module.exports.endOfLineGemojiCodeRe =
  /:(?:[abmovx]|[-+]1|100|1234|(?:1st|2nd|3rd)_place_medal|8ball|clock\d{1,4}|e-mail|non-potable_water|o2|t-rex|u5272|u5408|u55b6|u6307|u6708|u6709|u6e80|u7121|u7533|u7981|u7a7a|[a-z]{2,15}2?|[a-z]{1,14}(?:_[a-z\d]{1,16})+):$/;

// All punctuation characters (normal and full-width)
const allPunctuation = ".,;:!?。，；：！？";
module.exports.allPunctuation = allPunctuation;

// All punctuation characters without question mark (normal and full-width)
module.exports.allPunctuationNoQuestion = allPunctuation.replace(/[?？]/gu, "");

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
  return !!obj && (typeof obj === "object") && !Array.isArray(obj);
}
module.exports.isObject = isObject;

/**
 * Returns true iff the input is a URL.
 *
 * @param {Object} obj Object of unknown type.
 * @returns {boolean} True iff obj is a URL.
 */
function isUrl(obj) {
  return !!obj && (Object.getPrototypeOf(obj) === URL.prototype);
}
module.exports.isUrl = isUrl;

/**
 * Clones the input if it is an Array.
 *
 * @param {Object} arr Object of unknown type.
 * @returns {Object} Clone of obj iff obj is an Array.
 */
function cloneIfArray(arr) {
  return Array.isArray(arr) ? [ ...arr ] : arr;
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
 * Gets a Regular Expression for matching the specified HTML attribute.
 *
 * @param {string} name HTML attribute name.
 * @returns {RegExp} Regular Expression for matching.
 */
module.exports.getHtmlAttributeRe = function getHtmlAttributeRe(name) {
  return new RegExp(`\\s${name}\\s*=\\s*['"]?([^'"\\s>]*)`, "iu");
};

/**
 * Returns true iff the input line is blank (contains nothing, whitespace, or
 * comments (unclosed start/end comments allowed)).
 *
 * @param {string} line Input line.
 * @returns {boolean} True iff line is blank.
 */
function isBlankLine(line) {
  const startComment = "<!--";
  const endComment = "-->";
  const removeComments = (s) => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const start = s.indexOf(startComment);
      const end = s.indexOf(endComment);
      if ((end !== -1) && ((start === -1) || (end < start))) {
        // Unmatched end comment is first
        s = s.slice(end + endComment.length);
      } else if ((start !== -1) && (end !== -1)) {
        // Start comment is before end comment
        s = s.slice(0, start) + s.slice(end + endComment.length);
      } else if ((start !== -1) && (end === -1)) {
        // Unmatched start comment is last
        s = s.slice(0, start);
      } else {
        // No more comments to remove
        return s;
      }
    }
  };
  return (
    !line ||
    !line.trim() ||
    !removeComments(line).replace(/>/g, "").trim()
  );
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
  let left = 0;
  let right = array.length - 1;
  while (left <= right) {
    // eslint-disable-next-line no-bitwise
    const mid = (left + right) >> 1;
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
const htmlCommentBegin = "<!--";
const htmlCommentEnd = "-->";
const safeCommentCharacter = ".";
const startsWithPipeRe = /^ *\|/;
const notCrLfRe = /[^\r\n]/g;
const notSpaceCrLfRe = /[^ \r\n]/g;
const trailingSpaceRe = / +[\r\n]/g;
const replaceTrailingSpace = (s) => s.replace(notCrLfRe, safeCommentCharacter);
module.exports.clearHtmlCommentText = function clearHtmlCommentText(text) {
  let i = 0;
  while ((i = text.indexOf(htmlCommentBegin, i)) !== -1) {
    const j = text.indexOf(htmlCommentEnd, i + 2);
    if (j === -1) {
      // Un-terminated comments are treated as text
      break;
    }
    // If the comment has content...
    if (j > i + htmlCommentBegin.length) {
      const content = text.slice(i + htmlCommentBegin.length, j);
      const lastLf = text.lastIndexOf("\n", i) + 1;
      const preText = text.slice(lastLf, i);
      const isBlock = preText.trim().length === 0;
      const couldBeTable = startsWithPipeRe.test(preText);
      const spansTableCells = couldBeTable && content.includes("\n");
      const isValid =
        isBlock ||
        !(
          spansTableCells ||
          content.startsWith(">") ||
          content.startsWith("->") ||
          content.endsWith("-") ||
          content.includes("--")
        );
      // If a valid block/inline comment...
      if (isValid) {
        const clearedContent = content
          .replace(notSpaceCrLfRe, safeCommentCharacter)
          .replace(trailingSpaceRe, replaceTrailingSpace);
        text =
          text.slice(0, i + htmlCommentBegin.length) +
          clearedContent +
          text.slice(j);
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
module.exports.fencedCodeBlockStyleFor =
  function fencedCodeBlockStyleFor(markup) {
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
 * @returns {"asterisk" | "underscore"} String representation.
 */
module.exports.emphasisOrStrongStyleFor =
  function emphasisOrStrongStyleFor(markup) {
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
  const line = token.line.replace(/^[\s>]*(> |>)/, "");
  return line.length - line.trimStart().length;
}
module.exports.indentFor = indentFor;

// Returns the heading style for a heading token
module.exports.headingStyleFor = function headingStyleFor(token) {
  if ((token.map[1] - token.map[0]) === 1) {
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
 * @returns {"asterisk" | "dash" | "plus"} String representation.
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
  for (const token of params.parsers.markdownit.tokens) {
    if (token.type === type) {
      handler(token);
    }
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
  const lineMetadata = params.lines.map(
    (line, index) => [ line, index, false, 0, false, false, false ]
  );
  filterTokens(params, "fence", (token) => {
    lineMetadata[token.map[0]][3] = 1;
    lineMetadata[token.map[1] - 1][3] = -1;
    for (let i = token.map[0] + 1; i < token.map[1] - 1; i++) {
      lineMetadata[i][2] = true;
    }
  });
  filterTokens(params, "code_block", (token) => {
    for (let i = token.map[0]; i < token.map[1]; i++) {
      lineMetadata[i][2] = true;
    }
  });
  filterTokens(params, "table_open", (token) => {
    for (let i = token.map[0]; i < token.map[1]; i++) {
      lineMetadata[i][4] = true;
    }
  });
  filterTokens(params, "list_item_open", (token) => {
    let count = 1;
    for (let i = token.map[0]; i < token.map[1]; i++) {
      lineMetadata[i][5] = count;
      count++;
    }
  });
  filterTokens(params, "hr", (token) => {
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
  for (const metadata of lineMetadata) {
    // @ts-ignore
    handler(...metadata);
  }
}
module.exports.forEachLine = forEachLine;

// Returns (nested) lists as a flat array (in order)
module.exports.flattenLists = function flattenLists(tokens) {
  const flattenedLists = [];
  const stack = [];
  let current = null;
  let nesting = 0;
  const nestingStack = [];
  let lastWithMap = { "map": [ 0, 1 ] };
  for (const token of tokens) {
    if ((token.type === "bullet_list_open") ||
        (token.type === "ordered_list_open")) {
      // Save current context and start a new one
      stack.push(current);
      current = {
        "unordered": (token.type === "bullet_list_open"),
        "parentsUnordered": !current ||
          (current.unordered && current.parentsUnordered),
        "open": token,
        "indent": indentFor(token),
        "parentIndent": (current && current.indent) || 0,
        "items": [],
        "nesting": nesting,
        "lastLineIndex": -1,
        "insert": flattenedLists.length
      };
      nesting++;
    } else if ((token.type === "bullet_list_close") ||
               (token.type === "ordered_list_close")) {
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
  return flattenedLists;
};

// Calls the provided function for each heading's content
module.exports.forEachHeading = function forEachHeading(params, handler) {
  let heading = null;
  for (const token of params.parsers.markdownit.tokens) {
    if (token.type === "heading_open") {
      heading = token;
    } else if (token.type === "heading_close") {
      heading = null;
    } else if ((token.type === "inline") && heading) {
      handler(heading, token.content, token);
    }
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
  const backtickRe = /`+/g;
  let match = null;
  const backticksLengthAndIndex = [];
  while ((match = backtickRe.exec(input)) !== null) {
    backticksLengthAndIndex.push([ match[0].length, match.index ]);
  }
  const newLinesIndex = [];
  while ((match = newLineRe.exec(input)) !== null) {
    newLinesIndex.push(match.index);
  }
  let lineIndex = 0;
  let lineStartIndex = 0;
  let k = 0;
  for (let i = 0; i < backticksLengthAndIndex.length - 1; i++) {
    const [ startLength, startIndex ] = backticksLengthAndIndex[i];
    if ((startIndex === 0) || (input[startIndex - 1] !== "\\")) {
      for (let j = i + 1; j < backticksLengthAndIndex.length; j++) {
        const [ endLength, endIndex ] = backticksLengthAndIndex[j];
        if (startLength === endLength) {
          for (; k < newLinesIndex.length; k++) {
            const newLineIndex = newLinesIndex[k];
            if (startIndex < newLineIndex) {
              break;
            }
            lineIndex++;
            lineStartIndex = newLineIndex + 1;
          }
          const columnIndex = startIndex - lineStartIndex + startLength;
          handler(
            input.slice(startIndex + startLength, endIndex),
            lineIndex,
            columnIndex,
            startLength
          );
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
    lineNumber,
    detail,
    context,
    range,
    fixInfo
  });
}
module.exports.addError = addError;

// Adds an error object with details conditionally via the onError callback
module.exports.addErrorDetailIf = function addErrorDetailIf(
  onError, lineNumber, expected, actual, detail, context, range, fixInfo) {
  if (expected !== actual) {
    addError(
      onError,
      lineNumber,
      "Expected: " + expected + "; Actual: " + actual +
        (detail ? "; " + detail : ""),
      context,
      range,
      fixInfo);
  }
};

// Adds an error object with context via the onError callback
module.exports.addErrorContext = function addErrorContext(
  onError, lineNumber, context, left, right, range, fixInfo) {
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
module.exports.codeBlockAndSpanRanges = (params, lineMetadata) => {
  const exclusions = [];
  // Add code block ranges (excludes fences)
  forEachLine(lineMetadata, (line, lineIndex, inCode, onFence) => {
    if (inCode && !onFence) {
      exclusions.push([ lineIndex, 0, line.length ]);
    }
  });
  // Add code span ranges (excludes ticks)
  filterTokens(params, "inline", (token) => {
    if (token.children.some((child) => child.type === "code_inline")) {
      const tokenLines = params.lines.slice(token.map[0], token.map[1]);
      forEachInlineCodeSpan(
        tokenLines.join("\n"),
        (code, lineIndex, columnIndex) => {
          const codeLines = code.split(newLineRe);
          for (const [ i, line ] of codeLines.entries()) {
            exclusions.push([
              token.lineNumber - 1 + lineIndex + i,
              i ? 0 : columnIndex,
              line.length
            ]);
          }
        }
      );
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
const withinAnyRange = (ranges, lineIndex, index, length) => (
  !ranges.every((span) => (
    (lineIndex !== span[0]) ||
    (index < span[1]) ||
    (index + length > span[1] + span[2])
  ))
);
module.exports.withinAnyRange = withinAnyRange;

// Returns a range object for a line by applying a RegExp
module.exports.rangeFromRegExp = function rangeFromRegExp(line, regexp) {
  let range = null;
  const match = line.match(regexp);
  if (match) {
    const column = match.index + 1;
    const length = match[0].length;
    range = [ column, length ];
  }
  return range;
};

// Determines if the front matter includes a title
module.exports.frontMatterHasTitle =
  function frontMatterHasTitle(frontMatterLines, frontMatterTitlePattern) {
    const ignoreFrontMatter =
      (frontMatterTitlePattern !== undefined) && !frontMatterTitlePattern;
    const frontMatterTitleRe =
      new RegExp(
        String(frontMatterTitlePattern || "^\\s*\"?title\"?\\s*[:=]"),
        "i"
      );
    return !ignoreFrontMatter &&
      frontMatterLines.some((line) => frontMatterTitleRe.test(line));
  };

/**
 * Returns an object with information about reference links and images.
 *
 * @param {import("../helpers/micromark.cjs").Token[]} tokens Micromark tokens.
 * @returns {Object} Reference link/image data.
 */
function getReferenceLinkImageData(tokens) {
  const normalizeReference = (s) => s.toLowerCase().trim().replace(/\s+/g, " ");
  const definitions = new Map();
  const definitionLineIndices = [];
  const duplicateDefinitions = [];
  const references = new Map();
  const shortcuts = new Map();
  const filteredTokens =
    micromark.filterByTypes(
      tokens,
      [
        // definitionLineIndices
        "definition", "gfmFootnoteDefinition",
        // definitions and definitionLineIndices
        "definitionLabelString", "gfmFootnoteDefinitionLabelString",
        // references and shortcuts
        "gfmFootnoteCall", "image", "link"
      ]
    );
  for (const token of filteredTokens) {
    let labelPrefix = "";
    // eslint-disable-next-line default-case
    switch (token.type) {
      case "definition":
      case "gfmFootnoteDefinition":
        // definitionLineIndices
        for (let i = token.startLine; i <= token.endLine; i++) {
          definitionLineIndices.push(i - 1);
        }
        break;
      case "gfmFootnoteDefinitionLabelString":
        labelPrefix = "^";
      case "definitionLabelString": // eslint-disable-line no-fallthrough
        {
          // definitions and definitionLineIndices
          const reference = normalizeReference(`${labelPrefix}${token.text}`);
          if (definitions.has(reference)) {
            duplicateDefinitions.push([ reference, token.startLine - 1 ]);
          } else {
            let destinationString = null;
            const parent =
              micromark.getTokenParentOfType(token, [ "definition" ]);
            if (parent) {
              destinationString = micromark.getTokenTextByType(
                micromark.filterByPredicate(parent.children),
                "definitionDestinationString"
              );
            }
            definitions.set(
              reference,
              [ token.startLine - 1, destinationString ]
            );
          }
        }
        break;
      case "gfmFootnoteCall":
      case "image":
      case "link":
        {
          let isShortcut = false;
          let isFullOrCollapsed = false;
          let labelText = null;
          let referenceStringText = null;
          const shortcutCandidate =
            micromark.matchAndGetTokensByType(token.children, [ "label" ]);
          if (shortcutCandidate) {
            labelText =
              micromark.getTokenTextByType(
                shortcutCandidate[0].children, "labelText"
              );
            isShortcut = (labelText !== null);
          }
          const fullAndCollapsedCandidate =
            micromark.matchAndGetTokensByType(
              token.children, [ "label", "reference" ]
            );
          if (fullAndCollapsedCandidate) {
            labelText =
              micromark.getTokenTextByType(
                fullAndCollapsedCandidate[0].children, "labelText"
              );
            referenceStringText =
              micromark.getTokenTextByType(
                fullAndCollapsedCandidate[1].children, "referenceString"
              );
            isFullOrCollapsed = (labelText !== null);
          }
          const footnote = micromark.matchAndGetTokensByType(
            token.children,
            [
              "gfmFootnoteCallLabelMarker", "gfmFootnoteCallMarker",
              "gfmFootnoteCallString", "gfmFootnoteCallLabelMarker"
            ],
            [ "gfmFootnoteCallMarker", "gfmFootnoteCallString" ]
          );
          if (footnote) {
            const callMarkerText = footnote[0].text;
            const callString = footnote[1].text;
            labelText = `${callMarkerText}${callString}`;
            isShortcut = true;
          }
          // Track shortcuts separately due to ambiguity in "text [text] text"
          if (isShortcut || isFullOrCollapsed) {
            const referenceDatum = [
              token.startLine - 1,
              token.startColumn - 1,
              token.text.length,
              // @ts-ignore
              labelText.length,
              (referenceStringText || "").length
            ];
            const reference =
              normalizeReference(referenceStringText || labelText);
            const dictionary = isShortcut ? shortcuts : references;
            const referenceData = dictionary.get(reference) || [];
            referenceData.push(referenceDatum);
            dictionary.set(reference, referenceData);
          }
        }
        break;
    }
  }
  return {
    references,
    shortcuts,
    definitions,
    duplicateDefinitions,
    definitionLineIndices
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
  let cr = 0;
  let lf = 0;
  let crlf = 0;
  const endings = input.match(newLineRe) || [];
  for (const ending of endings) {
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
  let preferredLineEnding = null;
  if (!cr && !lf && !crlf) {
    preferredLineEnding = (os && os.EOL) || "\n";
  } else if ((lf >= crlf) && (lf >= cr)) {
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
  const { editColumn, deleteCount, insertText } = normalizeFixInfo(fixInfo);
  const editIndex = editColumn - 1;
  return (deleteCount === -1) ?
    null :
    line.slice(0, editIndex) +
    insertText.replace(/\n/g, lineEnding || "\n") +
    line.slice(editIndex + deleteCount);
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
  const lineEnding = getPreferredLineEnding(input, __webpack_require__(/*! node:os */ "?0176"));
  const lines = input.split(newLineRe);
  // Normalize fixInfo objects
  let fixInfos = errors
    .filter((error) => error.fixInfo)
    .map((error) => normalizeFixInfo(error.fixInfo, error.lineNumber));
  // Sort bottom-to-top, line-deletes last, right-to-left, long-to-short
  fixInfos.sort((a, b) => {
    const aDeletingLine = (a.deleteCount === -1);
    const bDeletingLine = (b.deleteCount === -1);
    return (
      (b.lineNumber - a.lineNumber) ||
      (aDeletingLine ? 1 : (bDeletingLine ? -1 : 0)) ||
      (b.editColumn - a.editColumn) ||
      (b.insertText.length - a.insertText.length)
    );
  });
  // Remove duplicate entries (needed for following collapse step)
  let lastFixInfo = {};
  fixInfos = fixInfos.filter((fixInfo) => {
    const unique = (
      (fixInfo.lineNumber !== lastFixInfo.lineNumber) ||
      (fixInfo.editColumn !== lastFixInfo.editColumn) ||
      (fixInfo.deleteCount !== lastFixInfo.deleteCount) ||
      (fixInfo.insertText !== lastFixInfo.insertText)
    );
    lastFixInfo = fixInfo;
    return unique;
  });
  // Collapse insert/no-delete and no-insert/delete for same line/column
  lastFixInfo = {
    "lineNumber": -1
  };
  for (const fixInfo of fixInfos) {
    if (
      (fixInfo.lineNumber === lastFixInfo.lineNumber) &&
      (fixInfo.editColumn === lastFixInfo.editColumn) &&
      !fixInfo.insertText &&
      (fixInfo.deleteCount > 0) &&
      lastFixInfo.insertText &&
      !lastFixInfo.deleteCount) {
      fixInfo.insertText = lastFixInfo.insertText;
      lastFixInfo.lineNumber = 0;
    }
    lastFixInfo = fixInfo;
  }
  fixInfos = fixInfos.filter((fixInfo) => fixInfo.lineNumber);
  // Apply all (remaining/updated) fixes
  let lastLineIndex = -1;
  let lastEditIndex = -1;
  for (const fixInfo of fixInfos) {
    const { lineNumber, editColumn, deleteCount } = fixInfo;
    const lineIndex = lineNumber - 1;
    const editIndex = editColumn - 1;
    if (
      (lineIndex !== lastLineIndex) ||
      (deleteCount === -1) ||
      ((editIndex + deleteCount) <=
        (lastEditIndex - ((deleteCount > 0) ? 0 : 1)))
    ) {
      // @ts-ignore
      lines[lineIndex] = applyFix(lines[lineIndex], fixInfo, lineEnding);
    }
    lastLineIndex = lineIndex;
    lastEditIndex = editIndex;
  }
  // Return corrected input
  return lines.filter((line) => line !== null).join(lineEnding);
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
  const homedir = os && os.homedir && os.homedir();
  return homedir ? file.replace(/^~($|\/|\\)/, `${homedir}$1`) : file;
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

// Regular expression for matching next lines
module.exports.nextLinesRe = /[\r\n][\s\S]*$/;


/***/ }),

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
const {
  directive, gfmAutolinkLiteral, gfmFootnote, gfmTable, math,
  parse, postprocess, preprocess
  // @ts-ignore
} = __webpack_require__(/*! markdownlint-micromark */ "markdownlint-micromark");
const { newLineRe } = __webpack_require__(/*! ./shared.js */ "../helpers/shared.js");

const flatTokensSymbol = Symbol("flat-tokens");

/** @typedef {import("markdownlint-micromark").Event} Event */
/** @typedef {import("markdownlint-micromark").ParseOptions} ParseOptions */
/** @typedef {import("markdownlint-micromark").TokenType} TokenType */
/** @typedef {import("../lib/markdownlint.js").MicromarkToken} Token */

/**
 * Returns whether a token is an htmlFlow type containing an HTML comment.
 *
 * @param {Token} token Micromark token.
 * @returns {boolean} True iff token is htmlFlow containing a comment.
 */
function isHtmlFlowComment(token) {
  const { text, type } = token;
  if (
    (type === "htmlFlow") &&
    text.startsWith("<!--") &&
    text.endsWith("-->")
  ) {
    const comment = text.slice(4, -3);
    return (
      !comment.startsWith(">") &&
      !comment.startsWith("->") &&
      !comment.endsWith("-")
      // The following condition from the CommonMark specification is commented
      // to avoid parsing HTML comments that include "--" because that is NOT a
      // condition of the HTML specification.
      // https://spec.commonmark.org/0.30/#raw-html
      // https://html.spec.whatwg.org/multipage/syntax.html#comments
      // && !comment.includes("--")
    );
  }
  return false;
}

/**
 * Parses a Markdown document and returns Micromark events.
 *
 * @param {string} markdown Markdown document.
 * @param {ParseOptions} [micromarkOptions] Options for micromark.
 * @param {boolean} [referencesDefined] Treat references as defined.
 * @returns {Event[]} Micromark events.
 */
function getMicromarkEvents(
  markdown,
  micromarkOptions = {},
  referencesDefined = true
) {

  // Customize options object to add useful extensions
  micromarkOptions.extensions = micromarkOptions.extensions || [];
  micromarkOptions.extensions.push(
    directive(),
    gfmAutolinkLiteral(),
    gfmFootnote(),
    gfmTable(),
    math()
  );

  // Use micromark to parse document into Events
  const encoding = undefined;
  const eol = true;
  const parseContext = parse(micromarkOptions);
  if (referencesDefined) {
    // Customize ParseContext to treat all references as defined
    parseContext.defined.includes = (searchElement) => searchElement.length > 0;
  }
  const chunks = preprocess()(markdown, encoding, eol);
  const events = postprocess(parseContext.document().write(chunks));
  return events;
}

/**
 * Parses a Markdown document and returns (frozen) tokens.
 *
 * @param {string} markdown Markdown document.
 * @param {ParseOptions} micromarkOptions Options for micromark.
 * @param {boolean} referencesDefined Treat references as defined.
 * @param {number} lineDelta Offset to apply to start/end line.
 * @param {Token} [ancestor] Parent of top-most tokens.
 * @returns {Token[]} Micromark tokens (frozen).
 */
function micromarkParseWithOffset(
  markdown,
  micromarkOptions,
  referencesDefined,
  lineDelta,
  ancestor
) {
  // Use micromark to parse document into Events
  const events = getMicromarkEvents(
    markdown, micromarkOptions, referencesDefined
  );

  // Create Token objects
  const document = [];
  let flatTokens = [];
  /** @type {Token} */
  const root = {
    "type": "data",
    "startLine": -1,
    "startColumn": -1,
    "endLine": -1,
    "endColumn": -1,
    "text": "ROOT",
    "children": document,
    "parent": null
  };
  const history = [ root ];
  let current = root;
  // eslint-disable-next-line jsdoc/valid-types
  /** @type ParseOptions | null */
  let reparseOptions = null;
  let lines = null;
  let skipHtmlFlowChildren = false;
  for (const event of events) {
    const [ kind, token, context ] = event;
    const { type, start, end } = token;
    const { "column": startColumn, "line": startLine } = start;
    const { "column": endColumn, "line": endLine } = end;
    const text = context.sliceSerialize(token);
    if ((kind === "enter") && !skipHtmlFlowChildren) {
      const previous = current;
      history.push(previous);
      current = {
        type,
        "startLine": startLine + lineDelta,
        startColumn,
        "endLine": endLine + lineDelta,
        endColumn,
        text,
        "children": [],
        "parent": ((previous === root) ? (ancestor || null) : previous)
      };
      previous.children.push(current);
      flatTokens.push(current);
      if ((current.type === "htmlFlow") && !isHtmlFlowComment(current)) {
        skipHtmlFlowChildren = true;
        if (!reparseOptions || !lines) {
          reparseOptions = {
            ...micromarkOptions,
            "extensions": [
              {
                "disable": {
                  "null": [ "codeIndented", "htmlFlow" ]
                }
              }
            ]
          };
          lines = markdown.split(newLineRe);
        }
        const reparseMarkdown = lines
          .slice(current.startLine - 1, current.endLine)
          .join("\n");
        const tokens = micromarkParseWithOffset(
          reparseMarkdown,
          reparseOptions,
          referencesDefined,
          current.startLine - 1,
          current
        );
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
  Object.defineProperty(document, flatTokensSymbol, { "value": flatTokens });
  Object.freeze(document);
  return document;
}

/**
 * Parses a Markdown document and returns (frozen) tokens.
 *
 * @param {string} markdown Markdown document.
 * @param {ParseOptions} [micromarkOptions] Options for micromark.
 * @param {boolean} [referencesDefined] Treat references as defined.
 * @returns {Token[]} Micromark tokens (frozen).
 */
function micromarkParse(
  markdown,
  micromarkOptions = {},
  referencesDefined = true
) {
  return micromarkParseWithOffset(
    markdown,
    micromarkOptions,
    referencesDefined,
    0
  );
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
 * @param {AllowedPredicate} [allowed] Allowed token predicate.
 * @param {TransformPredicate} [transformChildren] Transform predicate.
 * @returns {Token[]} Filtered tokens.
 */
function filterByPredicate(tokens, allowed, transformChildren) {
  allowed = allowed || (() => true);
  const result = [];
  const queue = [
    {
      "array": tokens,
      "index": 0
    }
  ];
  while (queue.length > 0) {
    const current = queue[queue.length - 1];
    const { array, index } = current;
    if (index < array.length) {
      const token = array[current.index++];
      if (allowed(token)) {
        result.push(token);
      }
      const { children } = token;
      if (children.length > 0) {
        const transformed =
          transformChildren ? transformChildren(token) : children;
        queue.push(
          {
            "array": transformed,
            "index": 0
          }
        );
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
 * @param {TokenType[]} types Types to allow.
 * @returns {Token[]} Filtered tokens.
 */
function filterByTypes(tokens, types) {
  const predicate = (token) => types.includes(token.type);
  const flatTokens = tokens[flatTokensSymbol];
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
  const headingSequence = filterByTypes(
    heading.children,
    [ "atxHeadingSequence", "setextHeadingLineSequence" ]
  );
  let level = 1;
  const { text } = headingSequence[0];
  if (text[0] === "#") {
    level = Math.min(text.length, 6);
  } else if (text[0] === "-") {
    level = 2;
  }
  return level;
}

/**
 * HTML tag information.
 *
 * @typedef {Object} HtmlTagInfo
 * @property {boolean} close True iff close tag.
 * @property {string} name Tag name.
 */

/**
 * Gets information about the tag in an HTML token.
 *
 * @param {Token} token Micromark token.
 * @returns {HtmlTagInfo | null} HTML tag information.
 */
function getHtmlTagInfo(token) {
  const htmlTagNameRe = /^<([^!>][^/\s>]*)/;
  if (token.type === "htmlText") {
    const match = htmlTagNameRe.exec(token.text);
    if (match) {
      const name = match[1];
      const close = name.startsWith("/");
      return {
        close,
        "name": close ? name.slice(1) : name
      };
    }
  }
  return null;
}

/**
 * Gets the nearest parent of the specified type for a Micromark token.
 *
 * @param {Token} token Micromark token.
 * @param {TokenType[]} types Types to allow.
 * @returns {Token | null} Parent token.
 */
function getTokenParentOfType(token, types) {
  /** @type {Token | null} */
  let current = token;
  while ((current = current.parent) && !types.includes(current.type)) {
    // Empty
  }
  return current;
}

/**
 * Get the text of the first match from a list of Micromark tokens by type.
 *
 * @param {Token[]} tokens Micromark tokens.
 * @param {TokenType} type Type to match.
 * @returns {string | null} Text of token.
 */
function getTokenTextByType(tokens, type) {
  const filtered = tokens.filter((token) => token.type === type);
  return (filtered.length > 0) ? filtered[0].text : null;
}

/**
 * Determines if a Micromark token has an htmlFlow-type parent.
 *
 * @param {Token} token Micromark token.
 * @returns {boolean} True iff the token has an htmlFlow-type parent.
 */
function inHtmlFlow(token) {
  return getTokenParentOfType(token, [ "htmlFlow" ]) !== null;
}

/**
 * Determines a list of Micromark tokens matches and returns a subset.
 *
 * @param {Token[]} tokens Micromark tokens.
 * @param {TokenType[]} matchTypes Types to match.
 * @param {TokenType[]} [resultTypes] Types to return.
 * @returns {Token[] | null} Matching tokens.
 */
function matchAndGetTokensByType(tokens, matchTypes, resultTypes) {
  if (tokens.length !== matchTypes.length) {
    return null;
  }
  resultTypes = resultTypes || matchTypes;
  const result = [];
  // eslint-disable-next-line unicorn/no-for-loop
  for (let i = 0; i < matchTypes.length; i++) {
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
 * @param {TokenType} type Desired type.
 * @returns {Token | null} Token instance.
 */
function tokenIfType(token, type) {
  return (token && (token.type === type)) ? token : null;
}

/**
 * Set containing token types that do not contain content.
 *
 * @type {Set<TokenType>}
 */
const nonContentTokens = new Set([
  "blockQuoteMarker",
  "blockQuotePrefix",
  "blockQuotePrefixWhitespace",
  "lineEnding",
  "lineEndingBlank",
  "linePrefix",
  "listItemIndent"
]);

module.exports = {
  "parse": micromarkParse,
  filterByPredicate,
  filterByTypes,
  getHeadingLevel,
  getHtmlTagInfo,
  getMicromarkEvents,
  getTokenParentOfType,
  getTokenTextByType,
  inHtmlFlow,
  isHtmlFlowComment,
  matchAndGetTokensByType,
  nonContentTokens,
  tokenIfType
};


/***/ }),

/***/ "../lib/cache.js":
/*!***********************!*\
  !*** ../lib/cache.js ***!
  \***********************/
/***/ ((module) => {

"use strict";
// @ts-check



const map = new Map();

module.exports.set = (keyValuePairs) => {
  for (const [ key, value ] of Object.entries(keyValuePairs)) {
    map.set(key, value);
  }
};
module.exports.clear = () => map.clear();

module.exports.codeBlockAndSpanRanges =
  () => map.get("codeBlockAndSpanRanges");
module.exports.flattenedLists =
  () => map.get("flattenedLists");
module.exports.lineMetadata =
  () => map.get("lineMetadata");
module.exports.referenceLinkImageData =
  () => map.get("referenceLinkImageData");


/***/ }),

/***/ "../lib/constants.js":
/*!***************************!*\
  !*** ../lib/constants.js ***!
  \***************************/
/***/ ((module) => {

"use strict";
// @ts-check



module.exports.deprecatedRuleNames = [];
module.exports.fixableRuleNames = [
  "MD004", "MD005", "MD007", "MD009", "MD010", "MD011",
  "MD012", "MD014", "MD018", "MD019", "MD020", "MD021",
  "MD022", "MD023", "MD026", "MD027", "MD030", "MD031",
  "MD032", "MD034", "MD037", "MD038", "MD039", "MD044",
  "MD047", "MD049", "MD050", "MD051", "MD053", "MD054"
];
module.exports.homepage = "https://github.com/DavidAnson/markdownlint";
module.exports.version = "0.34.0";


/***/ }),

/***/ "../lib/markdownlint.js":
/*!******************************!*\
  !*** ../lib/markdownlint.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



const path = __webpack_require__(/*! node:path */ "?9a52");
const { promisify } = __webpack_require__(/*! node:util */ "?39e5");
const markdownit = __webpack_require__(/*! markdown-it */ "markdown-it");
const micromark = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");
// const { deprecatedRuleNames } = require("./constants");
const rules = __webpack_require__(/*! ./rules */ "../lib/rules.js");
const helpers = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const cache = __webpack_require__(/*! ./cache */ "../lib/cache.js");

// @ts-ignore
// eslint-disable-next-line camelcase, no-inline-comments, no-undef
const dynamicRequire = (typeof require === "undefined") ? __webpack_require__("../lib sync recursive") : /* c8 ignore next */ require;
// Capture native require implementation for dynamic loading of modules

/**
 * Validate the list of rules for structure and reuse.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {boolean} synchronous Whether to execute synchronously.
 * @returns {Error | null} Error message if validation fails.
 */
function validateRuleList(ruleList, synchronous) {
  let result = null;
  if (ruleList.length === rules.length) {
    // No need to validate if only using built-in rules
    return result;
  }
  const allIds = {};
  for (const [ index, rule ] of ruleList.entries()) {
    const customIndex = index - rules.length;
    // eslint-disable-next-line no-inner-declarations, jsdoc/require-jsdoc
    function newError(property, value) {
      return new Error(
        `Property '${property}' of custom rule at index ${customIndex} is incorrect: '${value}'.`);
    }
    for (const property of [ "names", "tags" ]) {
      const value = rule[property];
      if (!result &&
        (!value || !Array.isArray(value) || (value.length === 0) ||
         !value.every(helpers.isString) || value.some(helpers.isEmptyString))) {
        result = newError(property, value);
      }
    }
    for (const propertyInfo of [
      [ "description", "string" ],
      [ "function", "function" ]
    ]) {
      const property = propertyInfo[0];
      const value = rule[property];
      if (!result && (!value || (typeof value !== propertyInfo[1]))) {
        result = newError(property, value);
      }
    }
    if (
      !result &&
      (rule.parser !== undefined) &&
      (rule.parser !== "markdownit") &&
      !((customIndex < 0) && (rule.parser === "micromark")) &&
      (rule.parser !== "none")
    ) {
      result = newError("parser", rule.parser);
    }
    if (
      !result &&
      rule.information &&
      !helpers.isUrl(rule.information)
    ) {
      result = newError("information", rule.information);
    }
    if (
      !result &&
      (rule.asynchronous !== undefined) &&
      (typeof rule.asynchronous !== "boolean")
    ) {
      result = newError("asynchronous", rule.asynchronous);
    }
    if (!result && rule.asynchronous && synchronous) {
      result = new Error(
        "Custom rule " + rule.names.join("/") + " at index " + customIndex +
        " is asynchronous and can not be used in a synchronous context."
      );
    }
    if (!result) {
      for (const name of rule.names) {
        const nameUpper = name.toUpperCase();
        if (!result && (allIds[nameUpper] !== undefined)) {
          result = new Error("Name '" + name + "' of custom rule at index " +
            customIndex + " is already used as a name or tag.");
        }
        allIds[nameUpper] = true;
      }
      for (const tag of rule.tags) {
        const tagUpper = tag.toUpperCase();
        if (!result && allIds[tagUpper]) {
          result = new Error("Tag '" + tag + "' of custom rule at index " +
            customIndex + " is already used as a name.");
        }
        allIds[tagUpper] = false;
      }
    }
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
  const lintResults = {};
  // eslint-disable-next-line jsdoc/require-jsdoc
  function toString(useAlias) {
    let ruleNameToRule = null;
    const results = [];
    const keys = Object.keys(lintResults);
    keys.sort();
    for (const file of keys) {
      const fileResults = lintResults[file];
      if (Array.isArray(fileResults)) {
        for (const result of fileResults) {
          const ruleMoniker = result.ruleNames ?
            result.ruleNames.join("/") :
            (result.ruleName + "/" + result.ruleAlias);
          results.push(
            file + ": " +
            result.lineNumber + ": " +
            ruleMoniker + " " +
            result.ruleDescription +
            (result.errorDetail ?
              " [" + result.errorDetail + "]" :
              "") +
            (result.errorContext ?
              " [Context: \"" + result.errorContext + "\"]" :
              ""));
        }
      } else {
        if (!ruleNameToRule) {
          ruleNameToRule = {};
          for (const rule of ruleList) {
            const ruleName = rule.names[0].toUpperCase();
            ruleNameToRule[ruleName] = rule;
          }
        }
        for (const [ ruleName, ruleResults ] of Object.entries(fileResults)) {
          const rule = ruleNameToRule[ruleName.toUpperCase()];
          for (const lineNumber of ruleResults) {
            // @ts-ignore
            const nameIndex = Math.min(useAlias ? 1 : 0, rule.names.length - 1);
            const result =
              file + ": " +
              lineNumber + ": " +
              // @ts-ignore
              rule.names[nameIndex] + " " +
              // @ts-ignore
              rule.description;
            results.push(result);
          }
        }
      }
    }
    return results.join("\n");
  }
  Object.defineProperty(lintResults, "toString", { "value": toString });
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
  let frontMatterLines = [];
  if (frontMatter) {
    const frontMatterMatch = content.match(frontMatter);
    if (frontMatterMatch && !frontMatterMatch.index) {
      const contentMatched = frontMatterMatch[0];
      content = content.slice(contentMatched.length);
      frontMatterLines = contentMatched.split(helpers.newLineRe);
      if ((frontMatterLines.length > 0) &&
          (frontMatterLines[frontMatterLines.length - 1] === "")) {
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
    for (const attr of token.attrs) {
      Object.freeze(attr);
    }
    Object.freeze(token.attrs);
  }
  if (token.children) {
    for (const child of token.children) {
      freezeToken(child);
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
  let trMap = null;
  for (const token of tokens) {
    // Provide missing maps for table content
    if (token.type === "tr_open") {
      trMap = token.map;
    } else if (token.type === "tr_close") {
      trMap = null;
    }
    if (!token.map && trMap) {
      token.map = [ ...trMap ];
    }
    // Update token metadata
    if (token.map) {
      token.line = lines[token.map[0]];
      token.lineNumber = token.map[0] + 1;
      // Trim bottom of token to exclude whitespace lines
      while (token.map[1] && !((lines[token.map[1] - 1] || "").trim())) {
        token.map[1]--;
      }
    }
    // Annotate children with lineNumber
    if (token.children) {
      const codeSpanExtraLines = [];
      if (token.children.some((child) => child.type === "code_inline")) {
        helpers.forEachInlineCodeSpan(token.content, (code) => {
          codeSpanExtraLines.push(code.split(helpers.newLineRe).length - 1);
        });
      }
      let lineNumber = token.lineNumber;
      for (const child of token.children) {
        child.lineNumber = lineNumber;
        child.line = lines[lineNumber - 1];
        if ((child.type === "softbreak") || (child.type === "hardbreak")) {
          lineNumber++;
        } else if (child.type === "code_inline") {
          lineNumber += codeSpanExtraLines.shift();
        }
      }
    }
    freezeToken(token);
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
  const aliasToRuleNames = {};
  // const tagToRuleNames = {};
  for (const rule of ruleList) {
    const ruleName = rule.names[0].toUpperCase();
    // The following is useful for updating README.md:
    // console.log(
    //   "* **[" + ruleName + "](doc/Rules.md#" + ruleName.toLowerCase() +
    //    ")** *" + rule.names.slice(1).join("/") + "* - " + rule.description);
    for (const name of rule.names) {
      const nameUpper = name.toUpperCase();
      aliasToRuleNames[nameUpper] = [ ruleName ];
    }
    for (const tag of rule.tags) {
      const tagUpper = tag.toUpperCase();
      const ruleNames = aliasToRuleNames[tagUpper] || [];
      ruleNames.push(ruleName);
      aliasToRuleNames[tagUpper] = ruleNames;
      // tagToRuleNames[tag] = ruleName;
    }
  }
  // The following is useful for updating README.md:
  // Object.keys(tagToRuleNames).sort().forEach(function forTag(tag) {
  //   console.log("* **" + tag + "** - " +
  //     aliasToRuleNames[tag.toUpperCase()].join(", "));
  // });
  // @ts-ignore
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
  const defaultKey = Object.keys(config).filter(
    (key) => key.toUpperCase() === "DEFAULT"
  );
  const ruleDefault = (defaultKey.length === 0) || !!config[defaultKey[0]];
  /** @type {Configuration} */
  const effectiveConfig = {};
  for (const rule of ruleList) {
    const ruleName = rule.names[0].toUpperCase();
    effectiveConfig[ruleName] = ruleDefault;
  }
  // for (const ruleName of deprecatedRuleNames) {
  //   effectiveConfig[ruleName] = false;
  // }
  for (const key of Object.keys(config)) {
    let value = config[key];
    if (value) {
      if (!(value instanceof Object)) {
        value = {};
      }
    } else {
      value = false;
    }
    const keyUpper = key.toUpperCase();
    for (const ruleName of (aliasToRuleNames[keyUpper] || [])) {
      effectiveConfig[ruleName] = value;
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
  let config = null;
  let message = "";
  const errors = [];
  let index = 0;
  // Try each parser
  (parsers || [ JSON.parse ]).every((parser) => {
    try {
      config = parser(content);
    } catch (error) {
      errors.push(`Parser ${index++}: ${error.message}`);
    }
    return !config;
  });
  // Message if unable to parse
  if (!config) {
    errors.unshift(`Unable to parse '${name}'`);
    message = errors.join("; ");
  }
  return {
    config,
    message
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
function getEnabledRulesPerLineNumber(
  ruleList,
  lines,
  frontMatterLines,
  noInlineConfig,
  config,
  configParsers,
  aliasToRuleNames) {
  // Shared variables
  let enabledRules = {};
  let capturedRules = {};
  const allRuleNames = [];
  const enabledRulesPerLineNumber = new Array(1 + frontMatterLines.length);
  // Helper functions
  // eslint-disable-next-line jsdoc/require-jsdoc
  function handleInlineConfig(input, forEachMatch, forEachLine) {
    for (const [ lineIndex, line ] of input.entries()) {
      if (!noInlineConfig) {
        let match = null;
        while ((match = helpers.inlineCommentStartRe.exec(line))) {
          const action = match[2].toUpperCase();
          const startIndex = match.index + match[1].length;
          const endIndex = line.indexOf("-->", startIndex);
          if (endIndex === -1) {
            break;
          }
          const parameter = line.slice(startIndex, endIndex);
          forEachMatch(action, parameter, lineIndex + 1);
        }
      }
      if (forEachLine) {
        forEachLine();
      }
    }
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function configureFile(action, parameter) {
    if (action === "CONFIGURE-FILE") {
      const { "config": parsed } = parseConfiguration(
        "CONFIGURE-FILE", parameter, configParsers
      );
      if (parsed) {
        config = {
          ...config,
          ...parsed
        };
      }
    }
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function applyEnableDisable(action, parameter, state) {
    state = { ...state };
    const enabled = (action.startsWith("ENABLE"));
    const trimmed = parameter && parameter.trim();
    const items = trimmed ? trimmed.toUpperCase().split(/\s+/) : allRuleNames;
    for (const nameUpper of items) {
      for (const ruleName of (aliasToRuleNames[nameUpper] || [])) {
        state[ruleName] = enabled;
      }
    }
    return state;
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function enableDisableFile(action, parameter) {
    if ((action === "ENABLE-FILE") || (action === "DISABLE-FILE")) {
      enabledRules = applyEnableDisable(action, parameter, enabledRules);
    }
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function captureRestoreEnableDisable(action, parameter) {
    if (action === "CAPTURE") {
      capturedRules = enabledRules;
    } else if (action === "RESTORE") {
      enabledRules = capturedRules;
    } else if ((action === "ENABLE") || (action === "DISABLE")) {
      enabledRules = applyEnableDisable(action, parameter, enabledRules);
    }
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function updateLineState() {
    enabledRulesPerLineNumber.push(enabledRules);
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function disableLineNextLine(action, parameter, lineNumber) {
    const disableLine = (action === "DISABLE-LINE");
    const disableNextLine = (action === "DISABLE-NEXT-LINE");
    if (disableLine || disableNextLine) {
      const nextLineNumber =
        frontMatterLines.length + lineNumber + (disableNextLine ? 1 : 0);
      enabledRulesPerLineNumber[nextLineNumber] =
        applyEnableDisable(
          action,
          parameter,
          enabledRulesPerLineNumber[nextLineNumber]
        );
    }
  }
  // Handle inline comments
  handleInlineConfig([ lines.join("\n") ], configureFile);
  const effectiveConfig = getEffectiveConfig(
    ruleList, config, aliasToRuleNames);
  for (const rule of ruleList) {
    const ruleName = rule.names[0].toUpperCase();
    allRuleNames.push(ruleName);
    enabledRules[ruleName] = !!effectiveConfig[ruleName];
  }
  capturedRules = enabledRules;
  handleInlineConfig(lines, enableDisableFile);
  handleInlineConfig(lines, captureRestoreEnableDisable, updateLineState);
  handleInlineConfig(lines, disableLineNextLine);
  // Return results
  return {
    effectiveConfig,
    enabledRulesPerLineNumber
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
function lintContent(
  ruleList,
  aliasToRuleNames,
  name,
  content,
  md,
  config,
  configParsers,
  frontMatter,
  handleRuleFailures,
  noInlineConfig,
  resultVersion,
  callback) {
  // Remove UTF-8 byte order marker (if present)
  content = content.replace(/^\uFEFF/, "");
  // Remove front matter
  const removeFrontMatterResult = removeFrontMatter(content, frontMatter);
  const { frontMatterLines } = removeFrontMatterResult;
  content = removeFrontMatterResult.content;
  // Get enabled rules per line (with HTML comments present)
  const { effectiveConfig, enabledRulesPerLineNumber } =
    getEnabledRulesPerLineNumber(
      ruleList,
      content.split(helpers.newLineRe),
      frontMatterLines,
      noInlineConfig,
      config,
      configParsers,
      aliasToRuleNames
    );
  // Parse content into parser tokens
  const markdownitTokens = md.parse(content, {});
  const micromarkTokens = micromark.parse(content);
  // Hide the content of HTML comments from rules
  content = helpers.clearHtmlCommentText(content);
  // Parse content into lines and update markdown-it tokens
  const lines = content.split(helpers.newLineRe);
  annotateAndFreezeTokens(markdownitTokens, lines);
  // Create (frozen) parameters for rules
  /** @type {MarkdownParsers} */
  // @ts-ignore
  const parsersMarkdownIt = Object.freeze({
    "markdownit": Object.freeze({
      "tokens": markdownitTokens
    })
  });
  /** @type {MarkdownParsers} */
  // @ts-ignore
  const parsersMicromark = Object.freeze({
    "micromark": Object.freeze({
      "tokens": micromarkTokens
    })
  });
  /** @type {MarkdownParsers} */
  // @ts-ignore
  const parsersNone = Object.freeze({});
  const paramsBase = {
    name,
    "parsers": parsersMarkdownIt,
    "lines": Object.freeze(lines),
    "frontMatterLines": Object.freeze(frontMatterLines)
  };
  const lineMetadata =
    helpers.getLineMetadata(paramsBase);
  const codeBlockAndSpanRanges =
    helpers.codeBlockAndSpanRanges(paramsBase, lineMetadata);
  const flattenedLists =
    helpers.flattenLists(markdownitTokens);
  const referenceLinkImageData =
    helpers.getReferenceLinkImageData(micromarkTokens);
  cache.set({
    codeBlockAndSpanRanges,
    flattenedLists,
    lineMetadata,
    referenceLinkImageData
  });
  // Function to run for each rule
  let results = [];
  /**
   * @param {Rule} rule Rule.
   * @returns {Promise<void> | null} Promise.
   */
  const forRule = (rule) => {
    // Configure rule
    const ruleName = rule.names[0].toUpperCase();
    const tokens = {};
    let parsers = parsersNone;
    if (rule.parser === undefined) {
      tokens.tokens = markdownitTokens;
      parsers = parsersMarkdownIt;
    } else if (rule.parser === "markdownit") {
      parsers = parsersMarkdownIt;
    } else if (rule.parser === "micromark") {
      parsers = parsersMicromark;
    }
    const params = {
      ...paramsBase,
      ...tokens,
      parsers,
      "config": effectiveConfig[ruleName]
    };
    // eslint-disable-next-line jsdoc/require-jsdoc
    function throwError(property) {
      throw new Error(
        `Value of '${property}' passed to onError by '${ruleName}' is incorrect for '${name}'.`);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    function onError(errorInfo) {
      if (!errorInfo ||
        !helpers.isNumber(errorInfo.lineNumber) ||
        (errorInfo.lineNumber < 1) ||
        (errorInfo.lineNumber > lines.length)) {
        throwError("lineNumber");
      }
      const lineNumber = errorInfo.lineNumber + frontMatterLines.length;
      if (!enabledRulesPerLineNumber[lineNumber][ruleName]) {
        return;
      }
      if (errorInfo.detail &&
        !helpers.isString(errorInfo.detail)) {
        throwError("detail");
      }
      if (errorInfo.context &&
        !helpers.isString(errorInfo.context)) {
        throwError("context");
      }
      if (errorInfo.information &&
        !helpers.isUrl(errorInfo.information)) {
        throwError("information");
      }
      if (errorInfo.range &&
        (!Array.isArray(errorInfo.range) ||
          (errorInfo.range.length !== 2) ||
          !helpers.isNumber(errorInfo.range[0]) ||
          (errorInfo.range[0] < 1) ||
          !helpers.isNumber(errorInfo.range[1]) ||
          (errorInfo.range[1] < 1) ||
          ((errorInfo.range[0] + errorInfo.range[1] - 1) >
          lines[errorInfo.lineNumber - 1].length))) {
        throwError("range");
      }
      const fixInfo = errorInfo.fixInfo;
      const cleanFixInfo = {};
      if (fixInfo) {
        if (!helpers.isObject(fixInfo)) {
          throwError("fixInfo");
        }
        if (fixInfo.lineNumber !== undefined) {
          if ((!helpers.isNumber(fixInfo.lineNumber) ||
            (fixInfo.lineNumber < 1) ||
            (fixInfo.lineNumber > lines.length))) {
            throwError("fixInfo.lineNumber");
          }
          cleanFixInfo.lineNumber =
            fixInfo.lineNumber + frontMatterLines.length;
        }
        const effectiveLineNumber = fixInfo.lineNumber || errorInfo.lineNumber;
        if (fixInfo.editColumn !== undefined) {
          if ((!helpers.isNumber(fixInfo.editColumn) ||
            (fixInfo.editColumn < 1) ||
            (fixInfo.editColumn >
              lines[effectiveLineNumber - 1].length + 1))) {
            throwError("fixInfo.editColumn");
          }
          cleanFixInfo.editColumn = fixInfo.editColumn;
        }
        if (fixInfo.deleteCount !== undefined) {
          if ((!helpers.isNumber(fixInfo.deleteCount) ||
            (fixInfo.deleteCount < -1) ||
            (fixInfo.deleteCount >
              lines[effectiveLineNumber - 1].length))) {
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
      const information = errorInfo.information || rule.information;
      results.push({
        lineNumber,
        "ruleName": rule.names[0],
        "ruleNames": rule.names,
        "ruleDescription": rule.description,
        "ruleInformation": information ? information.href : null,
        "errorDetail": errorInfo.detail || null,
        "errorContext": errorInfo.context || null,
        "errorRange": errorInfo.range ? [ ...errorInfo.range ] : null,
        "fixInfo": fixInfo ? cleanFixInfo : null
      });
    }
    // Call (possibly external) rule function to report errors
    const catchCallsOnError = (error) => onError({
      "lineNumber": 1,
      "detail": `This rule threw an exception: ${error.message || error}`
    });
    const invokeRuleFunction = () => rule.function(params, onError);
    if (rule.asynchronous) {
      // Asynchronous rule, ensure it returns a Promise
      const ruleFunctionPromise =
        Promise.resolve().then(invokeRuleFunction);
      return handleRuleFailures ?
        ruleFunctionPromise.catch(catchCallsOnError) :
        ruleFunctionPromise;
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
  };
  // eslint-disable-next-line jsdoc/require-jsdoc
  function formatResults() {
    // Sort results by rule name by line number
    results.sort((a, b) => (
      a.ruleName.localeCompare(b.ruleName) ||
      a.lineNumber - b.lineNumber
    ));
    if (resultVersion < 3) {
      // Remove fixInfo and multiple errors for the same rule and line number
      const noPrevious = {
        "ruleName": null,
        "lineNumber": -1
      };
      results = results.filter((error, index, array) => {
        delete error.fixInfo;
        const previous = array[index - 1] || noPrevious;
        return (
          (error.ruleName !== previous.ruleName) ||
          (error.lineNumber !== previous.lineNumber)
        );
      });
    }
    if (resultVersion === 0) {
      // Return a dictionary of rule->[line numbers]
      const dictionary = {};
      for (const error of results) {
        const ruleLines = dictionary[error.ruleName] || [];
        ruleLines.push(error.lineNumber);
        dictionary[error.ruleName] = ruleLines;
      }
      // @ts-ignore
      results = dictionary;
    } else if (resultVersion === 1) {
      // Use ruleAlias instead of ruleNames
      for (const error of results) {
        error.ruleAlias = error.ruleNames[1] || error.ruleName;
        delete error.ruleNames;
      }
    } else {
      // resultVersion 2 or 3: Remove unwanted ruleName
      for (const error of results) {
        delete error.ruleName;
      }
    }
    return results;
  }
  // Run all rules
  const ruleListAsync = ruleList.filter((rule) => rule.asynchronous);
  const ruleListSync = ruleList.filter((rule) => !rule.asynchronous);
  const ruleListAsyncFirst = [
    ...ruleListAsync,
    ...ruleListSync
  ];
  const callbackSuccess = () => callback(null, formatResults());
  const callbackError =
    (error) => callback(error instanceof Error ? error : new Error(error));
  try {
    const ruleResults = ruleListAsyncFirst.map(forRule);
    if (ruleListAsync.length > 0) {
      Promise.all(ruleResults.slice(0, ruleListAsync.length))
        .then(callbackSuccess)
        .catch(callbackError);
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
function lintFile(
  ruleList,
  aliasToRuleNames,
  file,
  md,
  config,
  configParsers,
  frontMatter,
  handleRuleFailures,
  noInlineConfig,
  resultVersion,
  fs,
  synchronous,
  callback) {
  // eslint-disable-next-line jsdoc/require-jsdoc
  function lintContentWrapper(err, content) {
    if (err) {
      return callback(err);
    }
    return lintContent(
      ruleList,
      aliasToRuleNames,
      file,
      content,
      md,
      config,
      configParsers,
      frontMatter,
      handleRuleFailures,
      noInlineConfig,
      resultVersion,
      callback
    );
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
  const customRuleList =
    [ options.customRules || [] ]
      .flat()
      .map((rule) => ({
        "names": helpers.cloneIfArray(rule.names),
        "description": rule.description,
        "information": helpers.cloneIfUrl(rule.information),
        "tags": helpers.cloneIfArray(rule.tags),
        "parser": rule.parser,
        "asynchronous": rule.asynchronous,
        "function": rule.function
      }));
  // eslint-disable-next-line unicorn/prefer-spread
  const ruleList = rules.concat(customRuleList);
  const ruleErr = validateRuleList(ruleList, synchronous);
  if (ruleErr) {
    callback(ruleErr);
    return;
  }
  let files = [];
  if (Array.isArray(options.files)) {
    files = [ ...options.files ];
  } else if (options.files) {
    files = [ String(options.files) ];
  }
  const strings = options.strings || {};
  const stringsKeys = Object.keys(strings);
  const config = options.config || { "default": true };
  const configParsers = options.configParsers || null;
  const frontMatter = (options.frontMatter === undefined) ?
    helpers.frontMatterRe : options.frontMatter;
  const handleRuleFailures = !!options.handleRuleFailures;
  const noInlineConfig = !!options.noInlineConfig;
  const resultVersion = (options.resultVersion === undefined) ?
    3 : options.resultVersion;
  const md = markdownit({ "html": true });
  const markdownItPlugins = options.markdownItPlugins || [];
  for (const plugin of markdownItPlugins) {
    // @ts-ignore
    md.use(...plugin);
  }
  const fs = options.fs || __webpack_require__(/*! node:fs */ "?d0ee");
  const aliasToRuleNames = mapAliasToRuleNames(ruleList);
  const results = newResults(ruleList);
  let done = false;
  let concurrency = 0;
  // eslint-disable-next-line jsdoc/require-jsdoc
  function lintWorker() {
    let currentItem = null;
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
      lintFile(
        ruleList,
        aliasToRuleNames,
        currentItem,
        md,
        config,
        configParsers,
        frontMatter,
        handleRuleFailures,
        noInlineConfig,
        resultVersion,
        fs,
        synchronous,
        lintWorkerCallback
      );
    } else if ((currentItem = stringsKeys.shift())) {
      // Lint next string
      concurrency++;
      lintContent(
        ruleList,
        aliasToRuleNames,
        currentItem,
        strings[currentItem] || "",
        md,
        config,
        configParsers,
        frontMatter,
        handleRuleFailures,
        noInlineConfig,
        resultVersion,
        lintWorkerCallback
      );
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

const markdownlintPromisify = promisify && promisify(markdownlint);

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
  let results = null;
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
  const configFileDirname = path.dirname(configFile);
  const resolvedExtendsFile = path.resolve(configFileDirname, referenceId);
  fs.access(resolvedExtendsFile, (err) => {
    if (err) {
      // Not a file, try require.resolve
      try {
        return callback(null, dynamicRequire.resolve(
          referenceId,
          { "paths": [ configFileDirname ] }
        ));
      } catch {
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
  const configFileDirname = path.dirname(configFile);
  const resolvedExtendsFile = path.resolve(configFileDirname, referenceId);
  try {
    fs.accessSync(resolvedExtendsFile);
    return resolvedExtendsFile;
  } catch {
    // Not a file, try require.resolve
  }
  try {
    return dynamicRequire.resolve(
      referenceId,
      { "paths": [ configFileDirname ] }
    );
  } catch {
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
  const configExtends = config.extends;
  if (configExtends) {
    return resolveConfigExtends(
      file,
      helpers.expandTildePath(configExtends, __webpack_require__(/*! node:os */ "?e6c4")),
      fs,
      // eslint-disable-next-line no-use-before-define
      (_, resolvedExtends) => readConfig(
        // @ts-ignore
        resolvedExtends,
        parsers,
        fs,
        (err, extendsConfig) => {
          if (err) {
            return callback(err);
          }
          const result = {
            ...extendsConfig,
            ...config
          };
          delete result.extends;
          return callback(null, result);
        }
      )
    );
  }
  return callback(null, config);
}

const extendConfigPromisify = promisify && promisify(extendConfig);

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
  fs.readFile(file, "utf8", (err, content) => {
    if (err) {
      // @ts-ignore
      return callback(err);
    }
    // Try to parse file
    // @ts-ignore
    const { config, message } = parseConfiguration(file, content, parsers);
    if (!config) {
      // @ts-ignore
      return callback(new Error(message));
    }
    // Extend configuration
    // @ts-ignore
    return extendConfig(config, file, parsers, fs, callback);
  });
}

const readConfigPromisify = promisify && promisify(readConfig);

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
  const os = __webpack_require__(/*! node:os */ "?e6c4");
  file = helpers.expandTildePath(file, os);
  const content = fs.readFileSync(file, "utf8");
  // Try to parse file
  const { config, message } = parseConfiguration(file, content, parsers);
  if (!config) {
    throw new Error(message);
  }
  // Extend configuration
  const configExtends = config.extends;
  if (configExtends) {
    delete config.extends;
    const resolvedExtends = resolveConfigExtendsSync(
      file,
      helpers.expandTildePath(configExtends, os),
      fs
    );
    return {
      ...readConfigSync(resolvedExtends, parsers, fs),
      ...config
    };
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

/* eslint-disable jsdoc/valid-types */

/**
 * Rule parameters.
 *
 * @typedef {Object} RuleParams
 * @property {string} name File/string name.
 * @property {MarkdownParsers} parsers Markdown parser data.
 * @property {readonly string[]} lines File/string lines.
 * @property {readonly string[]} frontMatterLines Front matter lines.
 * @property {RuleConfiguration} config Rule configuration.
 */

/* eslint-enable jsdoc/valid-types */

/**
 * Markdown parser data.
 *
 * @typedef {Object} MarkdownParsers
 * @property {ParserMarkdownIt} markdownit Markdown parser data from markdown-it (only present when Rule.parser is "markdownit").
 * @property {ParserMicromark} micromark Markdown parser data from micromark (only present when Rule.parser is "micromark").
 */

/**
 * Markdown parser data from markdown-it.
 *
 * @typedef {Object} ParserMarkdownIt
 * @property {MarkdownItToken[]} tokens Token objects from markdown-it.
 */

/**
 * Markdown parser data from micromark.
 *
 * @typedef {Object} ParserMicromark
 * @property {MicromarkToken[]} tokens Token objects from micromark.
 */

/**
 * markdown-it token.
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

/** @typedef {import("markdownlint-micromark").TokenType} MicromarkTokenType */

/**
 * micromark token.
 *
 * @typedef {Object} MicromarkToken
 * @property {MicromarkTokenType} type Token type.
 * @property {number} startLine Start line (1-based).
 * @property {number} startColumn Start column (1-based).
 * @property {number} endLine End line (1-based).
 * @property {number} endColumn End column (1-based).
 * @property {string} text Token text.
 * @property {MicromarkToken[]} children Child tokens.
 * @property {MicromarkToken | null} parent Parent token.
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
 * @property {"markdownit" | "micromark" | "none"} parser Parser used.
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
 * Configuration object for linting rules. For the JSON schema, see
 * {@link ../schema/markdownlint-config-schema.json}.
 *
 * @typedef {import("./configuration").Configuration} Configuration
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



const { addErrorDetailIf, filterTokens } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD001", "heading-increment" ],
  "description": "Heading levels should only increment by one level at a time",
  "tags": [ "headings" ],
  "parser": "markdownit",
  "function": function MD001(params, onError) {
    let prevLevel = 0;
    filterTokens(params, "heading_open", function forToken(token) {
      const level = Number.parseInt(token.tag.slice(1), 10);
      if (prevLevel && (level > prevLevel)) {
        addErrorDetailIf(onError, token.lineNumber,
          "h" + (prevLevel + 1), "h" + level);
      }
      prevLevel = level;
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



const { addErrorDetailIf, filterTokens, headingStyleFor } =
  __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD003", "heading-style" ],
  "description": "Heading style",
  "tags": [ "headings" ],
  "parser": "markdownit",
  "function": function MD003(params, onError) {
    let style = String(params.config.style || "consistent");
    filterTokens(params, "heading_open", function forToken(token) {
      const styleForToken = headingStyleFor(token);
      if (style === "consistent") {
        style = styleForToken;
      }
      if (styleForToken !== style) {
        const h12 = /h[12]/.test(token.tag);
        const setextWithAtx =
          (style === "setext_with_atx") &&
            ((h12 && (styleForToken === "setext")) ||
            (!h12 && (styleForToken === "atx")));
        const setextWithAtxClosed =
          (style === "setext_with_atx_closed") &&
            ((h12 && (styleForToken === "setext")) ||
            (!h12 && (styleForToken === "atx_closed")));
        if (!setextWithAtx && !setextWithAtxClosed) {
          let expected = style;
          if (style === "setext_with_atx") {
            expected = h12 ? "setext" : "atx";
          } else if (style === "setext_with_atx_closed") {
            expected = h12 ? "setext" : "atx_closed";
          }
          addErrorDetailIf(onError, token.lineNumber,
            expected, styleForToken);
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



const { addErrorDetailIf, listItemMarkerRe, unorderedListStyleFor } =
  __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { flattenedLists } = __webpack_require__(/*! ./cache */ "../lib/cache.js");

const expectedStyleToMarker = {
  "dash": "-",
  "plus": "+",
  "asterisk": "*"
};
const differentItemStyle = {
  "dash": "plus",
  "plus": "asterisk",
  "asterisk": "dash"
};
const validStyles = Object.keys(expectedStyleToMarker);

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD004", "ul-style" ],
  "description": "Unordered list style",
  "tags": [ "bullet", "ul" ],
  "parser": "none",
  "function": function MD004(params, onError) {
    const style = String(params.config.style || "consistent");
    let expectedStyle = style;
    const nestingStyles = [];
    for (const list of flattenedLists()) {
      if (list.unordered) {
        if (expectedStyle === "consistent") {
          expectedStyle = unorderedListStyleFor(list.items[0]);
        }
        for (const item of list.items) {
          const itemStyle = unorderedListStyleFor(item);
          if (style === "sublist") {
            const nesting = list.nesting;
            if (!nestingStyles[nesting]) {
              nestingStyles[nesting] =
                (itemStyle === nestingStyles[nesting - 1]) ?
                  differentItemStyle[itemStyle] :
                  itemStyle;
            }
            expectedStyle = nestingStyles[nesting];
          }
          if (!validStyles.includes(expectedStyle)) {
            expectedStyle = validStyles[0];
          }
          let range = null;
          let fixInfo = null;
          const match = item.line.match(listItemMarkerRe);
          if (match) {
            const column = match.index + 1;
            const length = match[0].length;
            range = [ column, length ];
            fixInfo = {
              "editColumn": match[1].length + 1,
              "deleteCount": 1,
              "insertText": expectedStyleToMarker[expectedStyle]
            };
          }
          addErrorDetailIf(
            onError,
            item.lineNumber,
            expectedStyle,
            itemStyle,
            null,
            null,
            range,
            fixInfo
          );
        }
      }
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



const { addError, addErrorDetailIf } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByTypes, inHtmlFlow } = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD005", "list-indent" ],
  "description": "Inconsistent indentation for list items at the same level",
  "tags": [ "bullet", "ul", "indentation" ],
  "parser": "micromark",
  "function": function MD005(params, onError) {
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const lists = filterByTypes(
      micromarkTokens,
      [ "listOrdered", "listUnordered" ]
    ).filter((list) => !inHtmlFlow(list));
    for (const list of lists) {
      const expectedIndent = list.startColumn - 1;
      let expectedEnd = 0;
      let endMatching = false;
      const listItemPrefixes =
        list.children.filter((token) => (token.type === "listItemPrefix"));
      for (const listItemPrefix of listItemPrefixes) {
        const lineNumber = listItemPrefix.startLine;
        const actualIndent = listItemPrefix.startColumn - 1;
        const range = [ 1, listItemPrefix.endColumn - 1 ];
        if (list.type === "listUnordered") {
          addErrorDetailIf(
            onError,
            lineNumber,
            expectedIndent,
            actualIndent,
            null,
            null,
            range
            // No fixInfo; MD007 handles this scenario better
          );
        } else {
          const markerLength = listItemPrefix.text.trim().length;
          const actualEnd = listItemPrefix.startColumn + markerLength - 1;
          expectedEnd = expectedEnd || actualEnd;
          if ((expectedIndent !== actualIndent) || endMatching) {
            if (expectedEnd === actualEnd) {
              endMatching = true;
            } else {
              const detail = endMatching ?
                `Expected: (${expectedEnd}); Actual: (${actualEnd})` :
                `Expected: ${expectedIndent}; Actual: ${actualIndent}`;
              const expected = endMatching ?
                expectedEnd - markerLength :
                expectedIndent;
              const actual = endMatching ?
                actualEnd - markerLength :
                actualIndent;
              addError(
                onError,
                lineNumber,
                detail,
                undefined,
                range,
                {
                  "editColumn": Math.min(actual, expected) + 1,
                  "deleteCount": Math.max(actual - expected, 0),
                  "insertText": "".padEnd(Math.max(expected - actual, 0))
                }
              );
            }
          }
        }
      }
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



const { addErrorDetailIf } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByTypes, getTokenParentOfType, inHtmlFlow } =
  __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("markdownlint-micromark").TokenType[] */
const unorderedListTypes =
  [ "blockQuotePrefix", "listItemPrefix", "listUnordered" ];
// eslint-disable-next-line jsdoc/valid-types
/** @type import("markdownlint-micromark").TokenType[] */
const unorderedParentTypes =
  [ "blockQuote", "listOrdered", "listUnordered" ];

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD007", "ul-indent" ],
  "description": "Unordered list indentation",
  "tags": [ "bullet", "ul", "indentation" ],
  "parser": "micromark",
  "function": function MD007(params, onError) {
    const indent = Number(params.config.indent || 2);
    const startIndented = !!params.config.start_indented;
    const startIndent = Number(params.config.start_indent || indent);
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const unorderedListNesting = new Map();
    let lastBlockQuotePrefix = null;
    const tokens = filterByTypes(micromarkTokens, unorderedListTypes);
    for (const token of tokens) {
      const { endColumn, parent, startColumn, startLine, type } = token;
      if (type === "blockQuotePrefix") {
        lastBlockQuotePrefix = token;
      } else if (type === "listUnordered") {
        let nesting = 0;
        /** @type {import("../helpers/micromark.cjs").Token | null} */
        let current = token;
        while (
          (current = getTokenParentOfType(current, unorderedParentTypes))
        ) {
          if (current.type === "listUnordered") {
            nesting++;
            // eslint-disable-next-line no-continue
            continue;
          } else if (current.type === "listOrdered") {
            nesting = -1;
          }
          break;
        }
        if (nesting >= 0) {
          unorderedListNesting.set(token, nesting);
        }
      } else if (!inHtmlFlow(token)) {
        // listItemPrefix
        const nesting = unorderedListNesting.get(parent);
        if (nesting !== undefined) {
          // listItemPrefix for listUnordered
          const expectedIndent =
            (startIndented ? startIndent : 0) + (nesting * indent);
          const blockQuoteAdjustment =
            (lastBlockQuotePrefix?.endLine === startLine) ?
              (lastBlockQuotePrefix.endColumn - 1) :
              0;
          const actualIndent = startColumn - 1 - blockQuoteAdjustment;
          const range = [ 1, endColumn - 1 ];
          const fixInfo = {
            "editColumn": startColumn - actualIndent,
            "deleteCount": Math.max(actualIndent - expectedIndent, 0),
            "insertText": "".padEnd(Math.max(expectedIndent - actualIndent, 0))
          };
          addErrorDetailIf(
            onError,
            startLine,
            expectedIndent,
            actualIndent,
            undefined,
            undefined,
            range,
            fixInfo
          );
        }
      }
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



const { addError, filterTokens, forEachLine, includesSorted,
  numericSortAscending } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { lineMetadata } = __webpack_require__(/*! ./cache */ "../lib/cache.js");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD009", "no-trailing-spaces" ],
  "description": "Trailing spaces",
  "tags": [ "whitespace" ],
  "parser": "markdownit",
  "function": function MD009(params, onError) {
    let brSpaces = params.config.br_spaces;
    brSpaces = Number((brSpaces === undefined) ? 2 : brSpaces);
    const listItemEmptyLines = !!params.config.list_item_empty_lines;
    const strict = !!params.config.strict;
    const listItemLineNumbers = [];
    if (listItemEmptyLines) {
      filterTokens(params, "list_item_open", (token) => {
        for (let i = token.map[0]; i < token.map[1]; i++) {
          listItemLineNumbers.push(i + 1);
        }
      });
      listItemLineNumbers.sort(numericSortAscending);
    }
    const paragraphLineNumbers = [];
    const codeInlineLineNumbers = [];
    if (strict) {
      filterTokens(params, "paragraph_open", (token) => {
        for (let i = token.map[0]; i < token.map[1] - 1; i++) {
          paragraphLineNumbers.push(i + 1);
        }
      });
      const addLineNumberRange = (start, end) => {
        for (let i = start; i < end; i++) {
          codeInlineLineNumbers.push(i);
        }
      };
      filterTokens(params, "inline", (token) => {
        let start = 0;
        for (const child of token.children) {
          if (start > 0) {
            addLineNumberRange(start, child.lineNumber);
            start = 0;
          }
          if (child.type === "code_inline") {
            start = child.lineNumber;
          }
        }
        if (start > 0) {
          addLineNumberRange(start, token.map[1]);
        }
      });
    }
    const expected = (brSpaces < 2) ? 0 : brSpaces;
    forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
      const lineNumber = lineIndex + 1;
      const trailingSpaces = line.length - line.trimEnd().length;
      if (
        trailingSpaces &&
        !inCode &&
        !includesSorted(listItemLineNumbers, lineNumber) &&
        (
          (expected !== trailingSpaces) ||
          (strict &&
            (!includesSorted(paragraphLineNumbers, lineNumber) ||
             includesSorted(codeInlineLineNumbers, lineNumber)))
        )
      ) {
        const column = line.length - trailingSpaces + 1;
        addError(
          onError,
          lineNumber,
          "Expected: " + (expected === 0 ? "" : "0 or ") +
            expected + "; Actual: " + trailingSpaces,
          undefined,
          [ column, trailingSpaces ],
          {
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



const { addError, filterTokens, forEachLine, withinAnyRange } =
  __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { codeBlockAndSpanRanges, lineMetadata } = __webpack_require__(/*! ./cache */ "../lib/cache.js");

const tabRe = /\t+/g;

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD010", "no-hard-tabs" ],
  "description": "Hard tabs",
  "tags": [ "whitespace", "hard_tab" ],
  "parser": "markdownit",
  "function": function MD010(params, onError) {
    const codeBlocks = params.config.code_blocks;
    const includeCode = (codeBlocks === undefined) ? true : !!codeBlocks;
    const ignoreCodeLanguages = new Set(
      (params.config.ignore_code_languages || [])
        .map((language) => language.toLowerCase())
    );
    const spacesPerTab = params.config.spaces_per_tab;
    const spaceMultiplier = (spacesPerTab === undefined) ?
      1 :
      Math.max(0, Number(spacesPerTab));
    const exclusions = includeCode ? [] : codeBlockAndSpanRanges();
    filterTokens(params, "fence", (token) => {
      const language = token.info.trim().toLowerCase();
      if (ignoreCodeLanguages.has(language)) {
        for (let i = token.map[0] + 1; i < token.map[1] - 1; i++) {
          exclusions.push([ i, 0, params.lines[i].length ]);
        }
      }
    });
    forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
      if (includeCode || !inCode) {
        let match = null;
        while ((match = tabRe.exec(line)) !== null) {
          const { index } = match;
          const column = index + 1;
          const length = match[0].length;
          if (!withinAnyRange(exclusions, lineIndex, index, length)) {
            addError(
              onError,
              lineIndex + 1,
              "Column: " + column,
              undefined,
              [ column, length ],
              {
                "editColumn": column,
                "deleteCount": length,
                "insertText": "".padEnd(length * spaceMultiplier)
              }
            );
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



const { addError, forEachLine, withinAnyRange } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { codeBlockAndSpanRanges, lineMetadata } = __webpack_require__(/*! ./cache */ "../lib/cache.js");

const reversedLinkRe =
  /(^|[^\\])\(([^()]+)\)\[([^\]^][^\]]*)\](?!\()/g;

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD011", "no-reversed-links" ],
  "description": "Reversed link syntax",
  "tags": [ "links" ],
  "parser": "none",
  "function": function MD011(params, onError) {
    const exclusions = codeBlockAndSpanRanges();
    forEachLine(lineMetadata(), (line, lineIndex, inCode, onFence) => {
      if (!inCode && !onFence) {
        let match = null;
        while ((match = reversedLinkRe.exec(line)) !== null) {
          const [ reversedLink, preChar, linkText, linkDestination ] = match;
          const index = match.index + preChar.length;
          const length = match[0].length - preChar.length;
          if (
            !linkText.endsWith("\\") &&
            !linkDestination.endsWith("\\") &&
            !withinAnyRange(exclusions, lineIndex, index, length)
          ) {
            addError(
              onError,
              lineIndex + 1,
              reversedLink.slice(preChar.length),
              undefined,
              [ index + 1, length ],
              {
                "editColumn": index + 1,
                "deleteCount": length,
                "insertText": `[${linkText}](${linkDestination})`
              }
            );
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



const { addErrorDetailIf, forEachLine } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { lineMetadata } = __webpack_require__(/*! ./cache */ "../lib/cache.js");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD012", "no-multiple-blanks" ],
  "description": "Multiple consecutive blank lines",
  "tags": [ "whitespace", "blank_lines" ],
  "parser": "none",
  "function": function MD012(params, onError) {
    const maximum = Number(params.config.maximum || 1);
    let count = 0;
    forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
      count = (inCode || (line.trim().length > 0)) ? 0 : count + 1;
      if (maximum < count) {
        addErrorDetailIf(
          onError,
          lineIndex + 1,
          maximum,
          count,
          null,
          null,
          null,
          {
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



const { addErrorDetailIf, filterTokens, forEachHeading, forEachLine,
  includesSorted } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { lineMetadata, referenceLinkImageData } = __webpack_require__(/*! ./cache */ "../lib/cache.js");

const longLineRePrefix = "^.{";
const longLineRePostfixRelaxed = "}.*\\s.*$";
const longLineRePostfixStrict = "}.+$";
const linkOrImageOnlyLineRe = /^[es]*(?:lT?L|I)[ES]*$/;
const sternModeRe = /^(?:[#>\s]*\s)?\S*$/;
const tokenTypeMap = {
  "em_open": "e",
  "em_close": "E",
  "image": "I",
  "link_open": "l",
  "link_close": "L",
  "strong_open": "s",
  "strong_close": "S",
  "text": "T"
};

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD013", "line-length" ],
  "description": "Line length",
  "tags": [ "line_length" ],
  "parser": "markdownit",
  "function": function MD013(params, onError) {
    const lineLength = Number(params.config.line_length || 80);
    const headingLineLength =
      Number(params.config.heading_line_length || lineLength);
    const codeLineLength =
      Number(params.config.code_block_line_length || lineLength);
    const strict = !!params.config.strict;
    const stern = !!params.config.stern;
    const longLineRePostfix =
      (strict || stern) ? longLineRePostfixStrict : longLineRePostfixRelaxed;
    const longLineRe =
      new RegExp(longLineRePrefix + lineLength + longLineRePostfix);
    const longHeadingLineRe =
      new RegExp(longLineRePrefix + headingLineLength + longLineRePostfix);
    const longCodeLineRe =
      new RegExp(longLineRePrefix + codeLineLength + longLineRePostfix);
    const codeBlocks = params.config.code_blocks;
    const includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
    const tables = params.config.tables;
    const includeTables = (tables === undefined) ? true : !!tables;
    const headings = params.config.headings;
    const includeHeadings = (headings === undefined) ? true : !!headings;
    const headingLineNumbers = [];
    forEachHeading(params, (heading) => {
      headingLineNumbers.push(heading.lineNumber);
    });
    const linkOnlyLineNumbers = [];
    filterTokens(params, "inline", (token) => {
      let childTokenTypes = "";
      for (const child of token.children) {
        if (child.type !== "text" || child.content !== "") {
          childTokenTypes += tokenTypeMap[child.type] || "x";
        }
      }
      if (linkOrImageOnlyLineRe.test(childTokenTypes)) {
        linkOnlyLineNumbers.push(token.lineNumber);
      }
    });
    const { definitionLineIndices } = referenceLinkImageData();
    forEachLine(lineMetadata(), (line, lineIndex, inCode, onFence, inTable) => {
      const lineNumber = lineIndex + 1;
      const isHeading = includesSorted(headingLineNumbers, lineNumber);
      const length = inCode ?
        codeLineLength :
        (isHeading ? headingLineLength : lineLength);
      const lengthRe = inCode ?
        longCodeLineRe :
        (isHeading ? longHeadingLineRe : longLineRe);
      if ((includeCodeBlocks || !inCode) &&
          (includeTables || !inTable) &&
          (includeHeadings || !isHeading) &&
          !includesSorted(definitionLineIndices, lineIndex) &&
          (strict ||
           (!(stern && sternModeRe.test(line)) &&
            !includesSorted(linkOnlyLineNumbers, lineNumber))) &&
          lengthRe.test(line)) {
        addErrorDetailIf(
          onError,
          lineNumber,
          length,
          line.length,
          null,
          null,
          [ length + 1, line.length - length ]);
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



const { addErrorContext, filterTokens } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");

const dollarCommandRe = /^(\s*)(\$\s+)/;

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD014", "commands-show-output" ],
  "description": "Dollar signs used before commands without showing output",
  "tags": [ "code" ],
  "parser": "markdownit",
  "function": function MD014(params, onError) {
    for (const type of [ "code_block", "fence" ]) {
      filterTokens(params, type, (token) => {
        const margin = (token.type === "fence") ? 1 : 0;
        const dollarInstances = [];
        let allDollars = true;
        for (let i = token.map[0] + margin; i < token.map[1] - margin; i++) {
          const line = params.lines[i];
          const lineTrim = line.trim();
          if (lineTrim) {
            const match = dollarCommandRe.exec(line);
            if (match) {
              const column = match[1].length + 1;
              const length = match[2].length;
              dollarInstances.push([ i, lineTrim, column, length ]);
            } else {
              allDollars = false;
            }
          }
        }
        if (allDollars) {
          for (const instance of dollarInstances) {
            const [ i, lineTrim, column, length ] = instance;
            addErrorContext(
              onError,
              // @ts-ignore
              i + 1,
              lineTrim,
              null,
              null,
              [ column, length ],
              {
                "editColumn": column,
                "deleteCount": length
              }
            );
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



const { addErrorContext, forEachLine } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { lineMetadata } = __webpack_require__(/*! ./cache */ "../lib/cache.js");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD018", "no-missing-space-atx" ],
  "description": "No space after hash on atx style heading",
  "tags": [ "headings", "atx", "spaces" ],
  "parser": "none",
  "function": function MD018(params, onError) {
    forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
      if (!inCode &&
        /^#+[^# \t]/.test(line) &&
        !/#\s*$/.test(line) &&
        !line.startsWith("#️⃣")) {
        // @ts-ignore
        const hashCount = /^#+/.exec(line)[0].length;
        addErrorContext(
          onError,
          lineIndex + 1,
          line.trim(),
          null,
          null,
          [ 1, hashCount + 1 ],
          {
            "editColumn": hashCount + 1,
            "insertText": " "
          }
        );
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



const { addErrorContext, filterTokens, headingStyleFor } =
  __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD019", "no-multiple-space-atx" ],
  "description": "Multiple spaces after hash on atx style heading",
  "tags": [ "headings", "atx", "spaces" ],
  "parser": "markdownit",
  "function": function MD019(params, onError) {
    filterTokens(params, "heading_open", (token) => {
      if (headingStyleFor(token) === "atx") {
        const { line, lineNumber } = token;
        const match = /^(#+)([ \t]{2,})\S/.exec(line);
        if (match) {
          const [
            ,
            { "length": hashLength },
            { "length": spacesLength }
          ] = match;
          addErrorContext(
            onError,
            lineNumber,
            line.trim(),
            null,
            null,
            [ 1, hashLength + spacesLength + 1 ],
            {
              "editColumn": hashLength + 1,
              "deleteCount": spacesLength - 1
            }
          );
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



const { addErrorContext, forEachLine } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { lineMetadata } = __webpack_require__(/*! ./cache */ "../lib/cache.js");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD020", "no-missing-space-closed-atx" ],
  "description": "No space inside hashes on closed atx style heading",
  "tags": [ "headings", "atx_closed", "spaces" ],
  "parser": "none",
  "function": function MD020(params, onError) {
    forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
      if (!inCode) {
        const match =
          /^(#+)([ \t]*)([^#]*?[^#\\])([ \t]*)((?:\\#)?)(#+)(\s*)$/.exec(line);
        if (match) {
          const [
            ,
            leftHash,
            { "length": leftSpaceLength },
            content,
            { "length": rightSpaceLength },
            rightEscape,
            rightHash,
            { "length": trailSpaceLength }
          ] = match;
          const leftHashLength = leftHash.length;
          const rightHashLength = rightHash.length;
          const left = !leftSpaceLength;
          const right = !rightSpaceLength || rightEscape;
          const rightEscapeReplacement = rightEscape ? `${rightEscape} ` : "";
          if (left || right) {
            const range = left ?
              [
                1,
                leftHashLength + 1
              ] :
              [
                line.length - trailSpaceLength - rightHashLength,
                rightHashLength + 1
              ];
            addErrorContext(
              onError,
              lineIndex + 1,
              line.trim(),
              left,
              right,
              range,
              {
                "editColumn": 1,
                "deleteCount": line.length,
                "insertText":
                  `${leftHash} ${content} ${rightEscapeReplacement}${rightHash}`
              }
            );
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



const { addErrorContext, filterTokens, headingStyleFor } =
  __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");

const closedAtxRe = /^(#+)([ \t]+)([^ \t]|[^ \t].*[^ \t])([ \t]+)(#+)(\s*)$/;

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD021", "no-multiple-space-closed-atx" ],
  "description": "Multiple spaces inside hashes on closed atx style heading",
  "tags": [ "headings", "atx_closed", "spaces" ],
  "parser": "markdownit",
  "function": function MD021(params, onError) {
    filterTokens(params, "heading_open", (token) => {
      if (headingStyleFor(token) === "atx_closed") {
        const { line, lineNumber } = token;
        const match = closedAtxRe.exec(line);
        if (match) {
          const [
            ,
            leftHash,
            { "length": leftSpaceLength },
            content,
            { "length": rightSpaceLength },
            rightHash,
            { "length": trailSpaceLength }
          ] = match;
          const left = leftSpaceLength > 1;
          const right = rightSpaceLength > 1;
          if (left || right) {
            const length = line.length;
            const leftHashLength = leftHash.length;
            const rightHashLength = rightHash.length;
            const range = left ?
              [
                1,
                leftHashLength + leftSpaceLength + 1
              ] :
              [
                length - trailSpaceLength - rightHashLength - rightSpaceLength,
                rightSpaceLength + rightHashLength + 1
              ];
            addErrorContext(
              onError,
              lineNumber,
              line.trim(),
              left,
              right,
              range,
              {
                "editColumn": 1,
                "deleteCount": length,
                "insertText": `${leftHash} ${content} ${rightHash}`
              }
            );
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



const { addErrorDetailIf, blockquotePrefixRe, isBlankLine } =
  __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByTypes, getHeadingLevel, inHtmlFlow } =
  __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

const defaultLines = 1;

const getLinesFunction = (linesParam) => {
  if (Array.isArray(linesParam)) {
    const linesArray = new Array(6).fill(defaultLines);
    for (const [ index, value ] of [ ...linesParam.entries() ].slice(0, 6)) {
      linesArray[index] = value;
    }
    return (heading) => linesArray[getHeadingLevel(heading) - 1];
  }
  // Coerce linesParam to a number
  const lines = (linesParam === undefined) ? defaultLines : Number(linesParam);
  return () => lines;
};

const getBlockQuote = (str, count) => (
  (str || "")
    .match(blockquotePrefixRe)[0]
    .trimEnd()
    // eslint-disable-next-line unicorn/prefer-spread
    .concat("\n")
    .repeat(count)
);

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD022", "blanks-around-headings" ],
  "description": "Headings should be surrounded by blank lines",
  "tags": [ "headings", "blank_lines" ],
  "parser": "micromark",
  "function": function MD022(params, onError) {
    const getLinesAbove = getLinesFunction(params.config.lines_above);
    const getLinesBelow = getLinesFunction(params.config.lines_below);
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const { lines } = params;
    const headings = filterByTypes(
      micromarkTokens,
      [ "atxHeading", "setextHeading" ]
    ).filter((heading) => !inHtmlFlow(heading));
    for (const heading of headings) {
      const { startLine, endLine } = heading;
      const line = lines[startLine - 1].trim();

      // Check lines above
      const linesAbove = getLinesAbove(heading);
      if (linesAbove >= 0) {
        let actualAbove = 0;
        for (
          let i = 0;
          (i < linesAbove) && isBlankLine(lines[startLine - 2 - i]);
          i++
        ) {
          actualAbove++;
        }
        addErrorDetailIf(
          onError,
          startLine,
          linesAbove,
          actualAbove,
          "Above",
          line,
          null,
          {
            "insertText": getBlockQuote(
              lines[startLine - 2],
              linesAbove - actualAbove
            )
          }
        );
      }

      // Check lines below
      const linesBelow = getLinesBelow(heading);
      if (linesBelow >= 0) {
        let actualBelow = 0;
        for (
          let i = 0;
          (i < linesBelow) && isBlankLine(lines[endLine + i]);
          i++
        ) {
          actualBelow++;
        }
        addErrorDetailIf(
          onError,
          startLine,
          linesBelow,
          actualBelow,
          "Below",
          line,
          null,
          {
            "lineNumber": endLine + 1,
            "insertText": getBlockQuote(
              lines[endLine],
              linesBelow - actualBelow
            )
          }
        );
      }
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



const { addErrorContext, filterTokens } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");

const spaceBeforeHeadingRe = /^(\s+|[>\s]+\s\s)[^>\s]/;

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD023", "heading-start-left" ],
  "description": "Headings must start at the beginning of the line",
  "tags": [ "headings", "spaces" ],
  "parser": "markdownit",
  "function": function MD023(params, onError) {
    filterTokens(params, "heading_open", function forToken(token) {
      const { lineNumber, line } = token;
      const match = line.match(spaceBeforeHeadingRe);
      if (match) {
        const [ prefixAndFirstChar, prefix ] = match;
        let deleteCount = prefix.length;
        const prefixLengthNoSpace = prefix.trimEnd().length;
        if (prefixLengthNoSpace) {
          deleteCount -= prefixLengthNoSpace - 1;
        }
        addErrorContext(
          onError,
          lineNumber,
          line,
          null,
          null,
          [ 1, prefixAndFirstChar.length ],
          {
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



const { addErrorContext, forEachHeading } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD024", "no-duplicate-heading" ],
  "description": "Multiple headings with the same content",
  "tags": [ "headings" ],
  "parser": "markdownit",
  "function": function MD024(params, onError) {
    const siblingsOnly = !!params.config.siblings_only || false;
    const knownContents = [ null, [] ];
    let lastLevel = 1;
    let knownContent = knownContents[lastLevel];
    forEachHeading(params, (heading, content) => {
      if (siblingsOnly) {
        const newLevel = heading.tag.slice(1);
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
      // @ts-ignore
      if (knownContent.includes(content)) {
        addErrorContext(
          onError,
          heading.lineNumber,
          heading.line.trim()
        );
      } else {
        // @ts-ignore
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



const { addErrorContext, filterTokens, frontMatterHasTitle } =
  __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD025", "single-title", "single-h1" ],
  "description": "Multiple top-level headings in the same document",
  "tags": [ "headings" ],
  "parser": "markdownit",
  "function": function MD025(params, onError) {
    const level = Number(params.config.level || 1);
    const tag = "h" + level;
    const foundFrontMatterTitle =
      frontMatterHasTitle(
        params.frontMatterLines,
        params.config.front_matter_title
      );
    let hasTopLevelHeading = false;
    filterTokens(params, "heading_open", function forToken(token) {
      if (token.tag === tag) {
        if (hasTopLevelHeading || foundFrontMatterTitle) {
          addErrorContext(onError, token.lineNumber,
            token.line.trim());
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



const { addError, allPunctuationNoQuestion, endOfLineGemojiCodeRe,
  endOfLineHtmlEntityRe, escapeForRegExp } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByTypes } = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD026", "no-trailing-punctuation" ],
  "description": "Trailing punctuation in heading",
  "tags": [ "headings" ],
  "parser": "micromark",
  "function": function MD026(params, onError) {
    let punctuation = params.config.punctuation;
    punctuation = String(
      (punctuation === undefined) ? allPunctuationNoQuestion : punctuation
    );
    const trailingPunctuationRe =
      new RegExp("\\s*[" + escapeForRegExp(punctuation) + "]+$");
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const headings = filterByTypes(micromarkTokens, [ "atxHeadingText", "setextHeadingText" ]);
    for (const heading of headings) {
      const { endColumn, endLine, text } = heading;
      const match = trailingPunctuationRe.exec(text);
      if (
        match &&
        !endOfLineHtmlEntityRe.test(text) &&
        !endOfLineGemojiCodeRe.test(text)
      ) {
        const fullMatch = match[0];
        const length = fullMatch.length;
        const column = endColumn - length;
        addError(
          onError,
          endLine,
          `Punctuation: '${fullMatch}'`,
          undefined,
          [ column, length ],
          {
            "editColumn": column,
            "deleteCount": length
          }
        );
      }
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



const { addErrorContext } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByTypes } = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": ["MD027", "no-multiple-space-blockquote"],
  "description": "Multiple spaces after blockquote symbol",
  "tags": ["blockquote", "whitespace", "indentation"],
  "parser": "micromark",
  "function": function MD027(params, onError) {
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    for (const token of filterByTypes(micromarkTokens, [ "linePrefix" ])) {
      const siblings = token.parent?.children || micromarkTokens;
      if (siblings[siblings.indexOf(token) - 1]?.type === "blockQuotePrefix") {
        const { startColumn, startLine, text } = token;
        const { length } = text;
        const line = params.lines[startLine - 1];
        addErrorContext(
          onError,
          startLine,
          line,
          null,
          null,
          [ startColumn, length ],
          {
            "editColumn": startColumn,
            "deleteCount": length
          }
        );
      }
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



const { addError } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByTypes } = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

const ignoreTypes = new Set([ "lineEnding", "listItemIndent", "linePrefix" ]);

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD028", "no-blanks-blockquote" ],
  "description": "Blank line inside blockquote",
  "tags": [ "blockquote", "whitespace" ],
  "parser": "micromark",
  "function": function MD028(params, onError) {
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    for (const token of filterByTypes(micromarkTokens, [ "blockQuote" ])) {
      const errorLineNumbers = [];
      const siblings = token.parent?.children || micromarkTokens;
      for (let i = siblings.indexOf(token) + 1; i < siblings.length; i++) {
        const sibling = siblings[i];
        const { startLine, type } = sibling;
        if (type === "lineEndingBlank") {
          // Possible blank between blockquotes
          errorLineNumbers.push(startLine);
        } else if (ignoreTypes.has(type)) {
          // Ignore invisible formatting
        } else if (type === "blockQuote") {
          // Blockquote followed by blockquote
          for (const lineNumber of errorLineNumbers) {
            addError(onError, lineNumber);
          }
          break;
        } else {
          // Blockquote not followed by blockquote
          break;
        }
      }
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



const { addErrorDetailIf, listItemMarkerRe, orderedListItemMarkerRe,
  rangeFromRegExp } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { flattenedLists } = __webpack_require__(/*! ./cache */ "../lib/cache.js");

const listStyleExamples = {
  "one": "1/1/1",
  "ordered": "1/2/3",
  "zero": "0/0/0"
};

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD029", "ol-prefix" ],
  "description": "Ordered list item prefix",
  "tags": [ "ol" ],
  "parser": "none",
  "function": function MD029(params, onError) {
    const style = String(params.config.style || "one_or_ordered");
    const filteredLists = flattenedLists().filter((list) => !list.unordered);
    for (const list of filteredLists) {
      const { items } = list;
      let current = 1;
      let incrementing = false;
      // Check for incrementing number pattern 1/2/3 or 0/1/2
      if (items.length >= 2) {
        const first = orderedListItemMarkerRe.exec(items[0].line);
        const second = orderedListItemMarkerRe.exec(items[1].line);
        if (first && second) {
          const [ , firstNumber ] = first;
          const [ , secondNumber ] = second;
          if ((secondNumber !== "1") || (firstNumber === "0")) {
            incrementing = true;
            if (firstNumber === "0") {
              current = 0;
            }
          }
        }
      }
      // Determine effective style
      let listStyle = style;
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
      for (const item of items) {
        const match = orderedListItemMarkerRe.exec(item.line);
        if (match) {
          addErrorDetailIf(onError, item.lineNumber,
            String(current), match[1],
            "Style: " + listStyleExamples[listStyle], null,
            rangeFromRegExp(item.line, listItemMarkerRe));
          if (listStyle === "ordered") {
            current++;
          }
        }
      }
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



const { addErrorDetailIf } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByTypes } = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD030", "list-marker-space" ],
  "description": "Spaces after list markers",
  "tags": [ "ol", "ul", "whitespace" ],
  "parser": "micromark",
  "function": function MD030(params, onError) {
    const ulSingle = Number(params.config.ul_single || 1);
    const olSingle = Number(params.config.ol_single || 1);
    const ulMulti = Number(params.config.ul_multi || 1);
    const olMulti = Number(params.config.ol_multi || 1);
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const lists = filterByTypes(micromarkTokens, [ "listOrdered", "listUnordered" ]);
    for (const list of lists) {
      const ordered = (list.type === "listOrdered");
      const listItemPrefixes =
        list.children.filter((token) => (token.type === "listItemPrefix"));
      const allSingleLine =
        (list.endLine - list.startLine + 1) === listItemPrefixes.length;
      const expectedSpaces = ordered ?
        (allSingleLine ? olSingle : olMulti) :
        (allSingleLine ? ulSingle : ulMulti);
      for (const listItemPrefix of listItemPrefixes) {
        const range = [
          listItemPrefix.startColumn,
          listItemPrefix.endColumn - listItemPrefix.startColumn
        ];
        const listItemPrefixWhitespaces = listItemPrefix.children.filter(
          (token) => (token.type === "listItemPrefixWhitespace")
        );
        for (const listItemPrefixWhitespace of listItemPrefixWhitespaces) {
          const { endColumn, startColumn, startLine } =
            listItemPrefixWhitespace;
          const actualSpaces = endColumn - startColumn;
          const fixInfo = {
            "editColumn": startColumn,
            "deleteCount": actualSpaces,
            "insertText": "".padEnd(expectedSpaces)
          };
          addErrorDetailIf(
            onError,
            startLine,
            expectedSpaces,
            actualSpaces,
            null,
            null,
            range,
            fixInfo
          );
        }
      }
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



const { addErrorContext, forEachLine, isBlankLine } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { lineMetadata } = __webpack_require__(/*! ./cache */ "../lib/cache.js");

const codeFencePrefixRe = /^(.*?)[`~]/;

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD031", "blanks-around-fences" ],
  "description": "Fenced code blocks should be surrounded by blank lines",
  "tags": [ "code", "blank_lines" ],
  "parser": "none",
  "function": function MD031(params, onError) {
    const listItems = params.config.list_items;
    const includeListItems = (listItems === undefined) ? true : !!listItems;
    const { lines } = params;
    forEachLine(lineMetadata(), (line, i, inCode, onFence, inTable, inItem) => {
      const onTopFence = (onFence > 0);
      const onBottomFence = (onFence < 0);
      if ((includeListItems || !inItem) &&
          ((onTopFence && !isBlankLine(lines[i - 1])) ||
           (onBottomFence && !isBlankLine(lines[i + 1])))) {
        const [ , prefix ] = line.match(codeFencePrefixRe) || [];
        const fixInfo = (prefix === undefined) ? null : {
          "lineNumber": i + (onTopFence ? 1 : 2),
          "insertText": `${prefix.replace(/[^>]/g, " ").trim()}\n`
        };
        addErrorContext(
          onError,
          i + 1,
          lines[i].trim(),
          null,
          null,
          null,
          fixInfo);
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



const { addErrorContext, blockquotePrefixRe, isBlankLine } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByPredicate, nonContentTokens } = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

const isList = (token) => (
  (token.type === "listOrdered") || (token.type === "listUnordered")
);
const addBlankLineError = (onError, lines, lineIndex, lineNumber) => {
  const line = lines[lineIndex];
  const quotePrefix = line.match(blockquotePrefixRe)[0].trimEnd();
  addErrorContext(
    onError,
    lineIndex + 1,
    line.trim(),
    null,
    null,
    null,
    {
      lineNumber,
      "insertText": `${quotePrefix}\n`
    }
  );
};

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD032", "blanks-around-lists" ],
  "description": "Lists should be surrounded by blank lines",
  "tags": [ "bullet", "ul", "ol", "blank_lines" ],
  "parser": "micromark",
  "function": function MD032(params, onError) {
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const { lines } = params;

    // For every top-level list...
    const topLevelLists = filterByPredicate(
      micromarkTokens,
      isList,
      (token) => (
        (isList(token) || (token.type === "htmlFlow")) ? [] : token.children
      )
    );
    for (const list of topLevelLists) {

      // Look for a blank line above the list
      const firstIndex = list.startLine - 1;
      if (!isBlankLine(lines[firstIndex - 1])) {
        addBlankLineError(onError, lines, firstIndex);
      }

      // Find the "visual" end of the list
      let endLine = list.endLine;
      const flattenedChildren = filterByPredicate(list.children);
      for (const child of flattenedChildren.reverse()) {
        if (!nonContentTokens.has(child.type)) {
          endLine = child.endLine;
          break;
        }
      }

      // Look for a blank line below the list
      const lastIndex = endLine - 1;
      if (!isBlankLine(lines[lastIndex + 1])) {
        addBlankLineError(onError, lines, lastIndex, lastIndex + 2);
      }
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



const { addError, nextLinesRe } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByTypes, getHtmlTagInfo } =
  __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD033", "no-inline-html" ],
  "description": "Inline HTML",
  "tags": [ "html" ],
  "parser": "micromark",
  "function": function MD033(params, onError) {
    let allowedElements = params.config.allowed_elements;
    allowedElements = Array.isArray(allowedElements) ? allowedElements : [];
    allowedElements = allowedElements.map((element) => element.toLowerCase());
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    for (const token of filterByTypes(micromarkTokens, [ "htmlText" ])) {
      const htmlTagInfo = getHtmlTagInfo(token);
      if (
        htmlTagInfo &&
        !htmlTagInfo.close &&
        !allowedElements.includes(htmlTagInfo.name.toLowerCase())
      ) {
        const range = [
          token.startColumn,
          token.text.replace(nextLinesRe, "").length
        ];
        addError(
          onError,
          token.startLine,
          "Element: " + htmlTagInfo.name,
          undefined,
          range
        );
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



const { addErrorContext } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByPredicate, filterByTypes, getHtmlTagInfo, inHtmlFlow, parse } =
  __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD034", "no-bare-urls" ],
  "description": "Bare URL used",
  "tags": [ "links", "url" ],
  "parser": "micromark",
  "function": function MD034(params, onError) {
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const literalAutolinks = (tokens) => (
      filterByPredicate(
        tokens,
        (token) => {
          if ((token.type === "literalAutolink") && !inHtmlFlow(token)) {
            // Detect and ignore https://github.com/micromark/micromark/issues/164
            const siblings = token.parent?.children;
              // Commented-out due to not being able to exercise in test/code coverage
              // || micromarkTokens;
            const index = siblings?.indexOf(token);
            // @ts-ignore
            const prev = siblings?.at(index - 1);
            // @ts-ignore
            const next = siblings?.at(index + 1);
            return !(
              prev &&
              next &&
              (prev.type === "data") &&
              (next.type === "data") &&
              prev.text.endsWith("<") &&
              next.text.startsWith(">")
            );
          }
          return false;
        },
        (token) => {
          const { children } = token;
          const result = [];
          for (let i = 0; i < children.length; i++) {
            const current = children[i];
            const openTagInfo = getHtmlTagInfo(current);
            if (openTagInfo && !openTagInfo.close) {
              let count = 1;
              for (let j = i + 1; j < children.length; j++) {
                const candidate = children[j];
                const closeTagInfo = getHtmlTagInfo(candidate);
                if (closeTagInfo && (openTagInfo.name === closeTagInfo.name)) {
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
          return result;
        }
      )
    );
    const autoLinks = filterByTypes(micromarkTokens, [ "literalAutolink" ]);
    if (autoLinks.length > 0) {
      // Re-parse with correct link/image reference definition handling
      const document = params.lines.join("\n");
      const tokens = parse(document, undefined, false);
      for (const token of literalAutolinks(tokens)) {
        const range = [
          token.startColumn,
          token.endColumn - token.startColumn
        ];
        const fixInfo = {
          "editColumn": range[0],
          "deleteCount": range[1],
          "insertText": `<${token.text}>`
        };
        addErrorContext(
          onError,
          token.startLine,
          token.text,
          null,
          null,
          range,
          fixInfo
        );
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



const { addErrorDetailIf } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByTypes } = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD035", "hr-style" ],
  "description": "Horizontal rule style",
  "tags": [ "hr" ],
  "parser": "micromark",
  "function": function MD035(params, onError) {
    let style = String(params.config.style || "consistent").trim();
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const thematicBreaks = filterByTypes(micromarkTokens, [ "thematicBreak" ]);
    for (const token of thematicBreaks) {
      const { startLine, text } = token;
      if (style === "consistent") {
        style = text;
      }
      addErrorDetailIf(onError, startLine, style, text);
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



const { addErrorContext, allPunctuation } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByTypes, matchAndGetTokensByType } = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

/** @typedef {import("../helpers/micromark.cjs").TokenType} TokenType */
/** @type {Map<TokenType, TokenType[]>} */
const emphasisAndChildrenTypes = new Map([
  [ "emphasis", [ "emphasisSequence", "emphasisText", "emphasisSequence" ] ],
  [ "strong", [ "strongSequence", "strongText", "strongSequence" ] ]
]);

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD036", "no-emphasis-as-heading" ],
  "description": "Emphasis used instead of a heading",
  "tags": [ "headings", "emphasis" ],
  "parser": "micromark",
  "function": function MD036(params, onError) {
    let punctuation = params.config.punctuation;
    punctuation = String((punctuation === undefined) ? allPunctuation : punctuation);
    const punctuationRe = new RegExp("[" + punctuation + "]$");
    const paragraphTokens =
      filterByTypes(params.parsers.micromark.tokens, [ "paragraph" ]).
        filter((token) =>
          (token.parent?.type === "content") && !token.parent?.parent && (token.children.length === 1)
        );
    for (const paragraphToken of paragraphTokens) {
      const childToken = paragraphToken.children[0];
      for (const [ emphasisType, emphasisChildrenTypes ] of emphasisAndChildrenTypes) {
        if (childToken.type === emphasisType) {
          const matchingTokens = matchAndGetTokensByType(childToken.children, emphasisChildrenTypes);
          if (matchingTokens) {
            const textToken = matchingTokens[1];
            if (
              (textToken.children.length === 1) &&
              (textToken.children[0].type === "data") &&
              !punctuationRe.test(textToken.text)
            ) {
              addErrorContext(onError, textToken.startLine, textToken.text);
            }
          }
        }
      }
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



const { addError } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByPredicate, inHtmlFlow } = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD037", "no-space-in-emphasis" ],
  "description": "Spaces inside emphasis markers",
  "tags": [ "whitespace", "emphasis" ],
  "parser": "micromark",
  "function": function MD037(params, onError) {

    // Initialize variables
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const { lines } = params;
    const emphasisTokensByMarker = new Map();
    for (const marker of [ "_", "__", "___", "*", "**", "***" ]) {
      emphasisTokensByMarker.set(marker, []);
    }
    const tokens = filterByPredicate(
      micromarkTokens,
      (token) => token.children.some((child) => child.type === "data")
    );
    for (const token of tokens) {

      // Build lists of bare tokens for each emphasis marker type
      for (const emphasisTokens of emphasisTokensByMarker.values()) {
        emphasisTokens.length = 0;
      }
      for (const child of token.children) {
        const { text, type } = child;
        if ((type === "data") && (text.length <= 3)) {
          const emphasisTokens = emphasisTokensByMarker.get(text);
          if (emphasisTokens && !inHtmlFlow(child)) {
            emphasisTokens.push(child);
          }
        }
      }

      // Process bare tokens for each emphasis marker type
      for (const entry of emphasisTokensByMarker.entries()) {
        const [ marker, emphasisTokens ] = entry;
        for (let i = 0; i + 1 < emphasisTokens.length; i += 2) {

          // Process start token of start/end pair
          const startToken = emphasisTokens[i];
          const startLine = lines[startToken.startLine - 1];
          const startSlice = startLine.slice(startToken.endColumn - 1);
          const startMatch = startSlice.match(/^\s+\S/);
          if (startMatch) {
            const [ startSpaceCharacter ] = startMatch;
            const startContext = `${marker}${startSpaceCharacter}`;
            addError(
              onError,
              startToken.startLine,
              undefined,
              startContext,
              [ startToken.startColumn, startContext.length ],
              {
                "editColumn": startToken.endColumn,
                "deleteCount": startSpaceCharacter.length - 1
              }
            );
          }

          // Process end token of start/end pair
          const endToken = emphasisTokens[i + 1];
          const endLine = lines[endToken.startLine - 1];
          const endSlice = endLine.slice(0, endToken.startColumn - 1);
          const endMatch = endSlice.match(/\S\s+$/);
          if (endMatch) {
            const [ endSpaceCharacter ] = endMatch;
            const endContext = `${endSpaceCharacter}${marker}`;
            addError(
              onError,
              endToken.startLine,
              undefined,
              endContext,
              [ endToken.endColumn - endContext.length, endContext.length ],
              {
                "editColumn":
                  endToken.startColumn - (endSpaceCharacter.length - 1),
                "deleteCount": endSpaceCharacter.length - 1
              }
            );
          }
        }
      }
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



const { addErrorContext } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByTypes, inHtmlFlow, tokenIfType } =
  __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

const leftSpaceRe = /^\s(?:[^`]|$)/;
const rightSpaceRe = /[^`]\s$/;
const trimCodeText = (text, start, end) => {
  text = text.replace(/^\s+$/, "");
  if (start) {
    text = text.replace(/^\s+?(\s`|\S)/, "$1");
  }
  if (end) {
    text = text.replace(/(`\s|\S)\s+$/, "$1");
  }
  return text;
};

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD038", "no-space-in-code" ],
  "description": "Spaces inside code span elements",
  "tags": [ "whitespace", "code" ],
  "parser": "micromark",
  "function": function MD038(params, onError) {
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const codeTexts = filterByTypes(micromarkTokens, [ "codeText" ])
      .filter((codeText) => !inHtmlFlow(codeText));
    for (const codeText of codeTexts) {
      const { children } = codeText;
      const first = 0;
      const last = children.length - 1;
      const startSequence = tokenIfType(children[first], "codeTextSequence");
      const endSequence = tokenIfType(children[last], "codeTextSequence");
      const startData =
        tokenIfType(children[first + 1], "codeTextData") ||
        tokenIfType(children[first + 2], "codeTextData");
      const endData =
        tokenIfType(children[last - 1], "codeTextData") ||
        tokenIfType(children[last - 2], "codeTextData");
      if (startSequence && endSequence && startData && endData) {
        const spaceLeft = leftSpaceRe.test(startData.text);
        const spaceRight = rightSpaceRe.test(endData.text);
        if (spaceLeft || spaceRight) {
          let lineNumber = startSequence.startLine;
          let range = null;
          let fixInfo = null;
          if (startSequence.startLine === endSequence.endLine) {
            range = [
              startSequence.startColumn,
              endSequence.endColumn - startSequence.startColumn
            ];
            fixInfo = {
              "editColumn": startSequence.endColumn,
              "deleteCount": endSequence.startColumn - startSequence.endColumn,
              "insertText": trimCodeText(startData.text, true, true)
            };
          } else if (spaceLeft && (startSequence.endLine === startData.startLine)) {
            range = [
              startSequence.startColumn,
              startData.endColumn - startSequence.startColumn
            ];
            fixInfo = {
              "editColumn": startSequence.endColumn,
              "deleteCount": startData.endColumn - startData.startColumn,
              "insertText": trimCodeText(startData.text, true, false)
            };
          } else if (spaceRight && (endData.text.trim().length > 0)) {
            lineNumber = endSequence.endLine;
            range = [
              endData.startColumn,
              endSequence.endColumn - endData.startColumn
            ];
            fixInfo = {
              "editColumn": endData.startColumn,
              "deleteCount": endData.endColumn - endData.startColumn,
              "insertText": trimCodeText(endData.text, false, true)
            };
          }
          if (range) {
            const context = params
              .lines[lineNumber - 1]
              .substring(range[0] - 1, range[0] - 1 + range[1]);
            addErrorContext(
              onError,
              lineNumber,
              context,
              spaceLeft,
              spaceRight,
              range,
              fixInfo
            );
          }
        }
      }
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



const { addErrorContext, filterTokens } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");

const spaceInLinkRe =
  /\[(?:\s[^\]]*|[^\]]*?\s)\](?=(\([^)]*\)|\[[^\]]*\]))/;

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD039", "no-space-in-links" ],
  "description": "Spaces inside link text",
  "tags": [ "whitespace", "links" ],
  "parser": "markdownit",
  "function": function MD039(params, onError) {
    filterTokens(params, "inline", (token) => {
      const { children } = token;
      let { lineNumber } = token;
      let inLink = false;
      let linkText = "";
      let lineIndex = 0;
      for (const child of children) {
        const { content, markup, type } = child;
        if (type === "link_open") {
          inLink = true;
          linkText = "";
        } else if (type === "link_close") {
          inLink = false;
          const left = linkText.trimStart().length !== linkText.length;
          const right = linkText.trimEnd().length !== linkText.length;
          if (left || right) {
            const line = params.lines[lineNumber - 1];
            let range = null;
            let fixInfo = null;
            const match = line.slice(lineIndex).match(spaceInLinkRe);
            if (match) {
              // @ts-ignore
              const column = match.index + lineIndex + 1;
              const length = match[0].length;
              range = [ column, length ];
              fixInfo = {
                "editColumn": column + 1,
                "deleteCount": length - 2,
                "insertText": linkText.trim()
              };
              lineIndex = column + length - 1;
            }
            addErrorContext(
              onError,
              lineNumber,
              `[${linkText}]`,
              left,
              right,
              range,
              fixInfo
            );
          }
        } else if ((type === "softbreak") || (type === "hardbreak")) {
          lineNumber++;
          lineIndex = 0;
        } else if (inLink) {
          linkText += type.endsWith("_inline") ?
            `${markup}${content}${markup}` :
            (content || markup);
        }
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



const { addError, addErrorContext } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByTypes, getTokenTextByType, tokenIfType } =
  __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD040", "fenced-code-language" ],
  "description": "Fenced code blocks should have a language specified",
  "tags": [ "code", "language" ],
  "parser": "micromark",
  "function": function MD040(params, onError) {
    let allowed = params.config.allowed_languages;
    allowed = Array.isArray(allowed) ? allowed : [];
    const languageOnly = !!params.config.language_only;
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const fencedCodes = filterByTypes(micromarkTokens, [ "codeFenced" ]);
    for (const fencedCode of fencedCodes) {
      const openingFence = tokenIfType(fencedCode.children[0], "codeFencedFence");
      if (openingFence) {
        const { children, startLine, text } = openingFence;
        const info = getTokenTextByType(children, "codeFencedFenceInfo");
        if (!info) {
          addErrorContext(onError, startLine, text);
        } else if ((allowed.length > 0) && !allowed.includes(info)) {
          addError(onError, startLine, `"${info}" is not allowed`);
        }
        if (languageOnly && getTokenTextByType(children, "codeFencedFenceMeta")) {
          addError(onError, startLine, `Info string contains more than language: "${text}"`);
        }
      }
    }
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



const { addErrorContext, frontMatterHasTitle } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByTypes, getHeadingLevel, getHtmlTagInfo, isHtmlFlowComment, nonContentTokens } =
  __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD041", "first-line-heading", "first-line-h1" ],
  "description": "First line in a file should be a top-level heading",
  "tags": [ "headings" ],
  "parser": "micromark",
  "function": function MD041(params, onError) {
    const level = Number(params.config.level || 1);
    if (!frontMatterHasTitle(params.frontMatterLines, params.config.front_matter_title)) {
      params.parsers.micromark.tokens.
        filter((token) => !nonContentTokens.has(token.type) && !isHtmlFlowComment(token)).
        every((token) => {
          let isError = true;
          if ((token.type === "atxHeading") || (token.type === "setextHeading")) {
            isError = (getHeadingLevel(token) !== level);
          } else if (token.type === "htmlFlow") {
            const htmlTexts = filterByTypes(token.children, [ "htmlText" ]);
            const tagInfo = (htmlTexts.length > 0) && getHtmlTagInfo(htmlTexts[0]);
            isError = !tagInfo || (tagInfo.name.toLowerCase() !== `h${level}`);
          }
          if (isError) {
            addErrorContext(onError, token.startLine, params.lines[token.startLine - 1]);
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



const { addErrorContext, escapeForRegExp, filterTokens } =
  __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD042", "no-empty-links" ],
  "description": "No empty links",
  "tags": [ "links" ],
  "parser": "markdownit",
  "function": function MD042(params, onError) {
    filterTokens(params, "inline", function forToken(token) {
      let inLink = false;
      let linkText = "";
      let emptyLink = false;
      for (const child of token.children) {
        if (child.type === "link_open") {
          inLink = true;
          linkText = "";
          for (const attr of child.attrs) {
            if (attr[0] === "href" && (!attr[1] || (attr[1] === "#"))) {
              emptyLink = true;
            }
          }
        } else if (child.type === "link_close") {
          inLink = false;
          if (emptyLink) {
            let context = `[${linkText}]`;
            let range = null;
            const match = child.line.match(
              new RegExp(`${escapeForRegExp(context)}\\((?:|#|<>)\\)`)
            );
            if (match) {
              context = match[0];
              // @ts-ignore
              range = [ match.index + 1, match[0].length ];
            }
            addErrorContext(
              onError, child.lineNumber, context, null, null, range
            );
            emptyLink = false;
          }
        } else if (inLink) {
          linkText += child.content;
        }
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



const { addErrorContext, addErrorDetailIf, forEachHeading } =
  __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD043", "required-headings" ],
  "description": "Required heading structure",
  "tags": [ "headings" ],
  "parser": "markdownit",
  "function": function MD043(params, onError) {
    const requiredHeadings = params.config.headings;
    if (!Array.isArray(requiredHeadings)) {
      // Nothing to check; avoid doing any work
      return;
    }
    const matchCase = params.config.match_case || false;
    const levels = {};
    for (const level of [ 1, 2, 3, 4, 5, 6 ]) {
      levels["h" + level] = "######".substr(-level);
    }
    let i = 0;
    let matchAny = false;
    let hasError = false;
    let anyHeadings = false;
    const getExpected = () => requiredHeadings[i++] || "[None]";
    const handleCase = (str) => (matchCase ? str : str.toLowerCase());
    forEachHeading(params, (heading, content) => {
      if (!hasError) {
        anyHeadings = true;
        const actual = levels[heading.tag] + " " + content;
        const expected = getExpected();
        if (expected === "*") {
          const nextExpected = getExpected();
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
          addErrorDetailIf(onError, heading.lineNumber,
            expected, actual);
          hasError = true;
        }
      }
    });
    const extraHeadings = requiredHeadings.length - i;
    if (
      !hasError &&
      ((extraHeadings > 1) ||
        ((extraHeadings === 1) && (requiredHeadings[i] !== "*"))) &&
      (anyHeadings || !requiredHeadings.every((heading) => heading === "*"))
    ) {
      addErrorContext(onError, params.lines.length,
        requiredHeadings[i]);
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



const { addErrorDetailIf, escapeForRegExp, withinAnyRange } =
  __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByPredicate, filterByTypes, parse } =
  __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

const ignoredChildTypes = new Set(
  [ "codeFencedFence", "definition", "reference", "resource" ]
);

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD044", "proper-names" ],
  "description": "Proper names should have the correct capitalization",
  "tags": [ "spelling" ],
  "parser": "micromark",
  "function": function MD044(params, onError) {
    let names = params.config.names;
    names = Array.isArray(names) ? names : [];
    names.sort((a, b) => (b.length - a.length) || a.localeCompare(b));
    if (names.length === 0) {
      // Nothing to check; avoid doing any work
      return;
    }
    const codeBlocks = params.config.code_blocks;
    const includeCodeBlocks =
      (codeBlocks === undefined) ? true : !!codeBlocks;
    const htmlElements = params.config.html_elements;
    const includeHtmlElements =
      (htmlElements === undefined) ? true : !!htmlElements;
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const scannedTypes = new Set([ "data" ]);
    if (includeCodeBlocks) {
      scannedTypes.add("codeFlowValue");
      scannedTypes.add("codeTextData");
    }
    if (includeHtmlElements) {
      scannedTypes.add("htmlFlowData");
      scannedTypes.add("htmlTextData");
    }
    const contentTokens =
      filterByPredicate(
        micromarkTokens,
        (token) => scannedTypes.has(token.type),
        (token) => (
          token.children.filter((t) => !ignoredChildTypes.has(t.type))
        )
      );
    const exclusions = [];
    const autoLinked = new Set();
    for (const name of names) {
      const escapedName = escapeForRegExp(name);
      const startNamePattern = /^\W/.test(name) ? "" : "\\b_*";
      const endNamePattern = /\W$/.test(name) ? "" : "_*\\b";
      const namePattern =
        `(${startNamePattern})(${escapedName})${endNamePattern}`;
      const nameRe = new RegExp(namePattern, "gi");
      for (const token of contentTokens) {
        let match = null;
        while ((match = nameRe.exec(token.text)) !== null) {
          const [ , leftMatch, nameMatch ] = match;
          const index = token.startColumn - 1 + match.index + leftMatch.length;
          const length = nameMatch.length;
          const lineIndex = token.startLine - 1;
          if (
            !withinAnyRange(exclusions, lineIndex, index, length) &&
            !names.includes(nameMatch)
          ) {
            let urlRanges = [];
            if (!autoLinked.has(token)) {
              urlRanges = filterByTypes(
                parse(token.text),
                [ "literalAutolink" ]
              ).map(
                (t) => [
                  lineIndex,
                  token.startColumn - 1 + t.startColumn - 1,
                  t.endColumn - t.startColumn
                ]
              );
              exclusions.push(...urlRanges);
              autoLinked.add(token);
            }
            if (!withinAnyRange(urlRanges, lineIndex, index, length)) {
              const column = index + 1;
              addErrorDetailIf(
                onError,
                token.startLine,
                name,
                nameMatch,
                null,
                null,
                [ column, length ],
                {
                  "editColumn": column,
                  "deleteCount": length,
                  "insertText": name
                }
              );
            }
          }
          exclusions.push([ lineIndex, index, length ]);
        }
      }
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



const { addError, getHtmlAttributeRe, nextLinesRe } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByTypes, getHtmlTagInfo } = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

const altRe = getHtmlAttributeRe("alt");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD045", "no-alt-text" ],
  "description": "Images should have alternate text (alt text)",
  "tags": [ "accessibility", "images" ],
  "parser": "micromark",
  "function": function MD045(params, onError) {
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;

    // Process Markdown images
    const images = filterByTypes(micromarkTokens, [ "image" ]);
    for (const image of images) {
      const labelTexts = filterByTypes(image.children, [ "labelText" ]);
      if (labelTexts.some((labelText) => labelText.text.length === 0)) {
        const range = (image.startLine === image.endLine) ?
          [ image.startColumn, image.endColumn - image.startColumn ] :
          undefined;
        addError(
          onError,
          image.startLine,
          undefined,
          undefined,
          range
        );
      }
    }

    // Process HTML images
    const htmlTexts = filterByTypes(micromarkTokens, [ "htmlText" ]);
    for (const htmlText of htmlTexts) {
      const { startColumn, startLine, text } = htmlText;
      const htmlTagInfo = getHtmlTagInfo(htmlText);
      if (
        htmlTagInfo &&
        !htmlTagInfo.close &&
        (htmlTagInfo.name.toLowerCase() === "img") &&
        !altRe.test(text)
      ) {
        const range = [
          startColumn,
          text.replace(nextLinesRe, "").length
        ];
        addError(
          onError,
          startLine,
          undefined,
          undefined,
          range
        );
      }
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



const { addErrorDetailIf } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByTypes } = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

const tokenTypeToStyle = {
  "codeFenced": "fenced",
  "codeIndented": "indented"
};

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD046", "code-block-style" ],
  "description": "Code block style",
  "tags": [ "code" ],
  "parser": "micromark",
  "function": function MD046(params, onError) {
    let expectedStyle = String(params.config.style || "consistent");
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const codeBlocksAndFences = filterByTypes(micromarkTokens, [ "codeFenced", "codeIndented" ]);
    for (const token of codeBlocksAndFences) {
      const { startLine, type } = token;
      if (expectedStyle === "consistent") {
        expectedStyle = tokenTypeToStyle[type];
      }
      addErrorDetailIf(
        onError,
        startLine,
        expectedStyle,
        tokenTypeToStyle[type]);
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



const { addError, isBlankLine } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD047", "single-trailing-newline" ],
  "description": "Files should end with a single newline character",
  "tags": [ "blank_lines" ],
  "parser": "none",
  "function": function MD047(params, onError) {
    const lastLineNumber = params.lines.length;
    const lastLine = params.lines[lastLineNumber - 1];
    if (!isBlankLine(lastLine)) {
      addError(
        onError,
        lastLineNumber,
        undefined,
        undefined,
        [ lastLine.length, 1 ],
        {
          "insertText": "\n",
          "editColumn": lastLine.length + 1
        }
      );
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



const { addErrorDetailIf, fencedCodeBlockStyleFor } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByTypes, tokenIfType } = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD048", "code-fence-style" ],
  "description": "Code fence style",
  "tags": [ "code" ],
  "parser": "micromark",
  "function": function MD048(params, onError) {
    const style = String(params.config.style || "consistent");
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    let expectedStyle = style;
    const codeFenceds = filterByTypes(micromarkTokens, [ "codeFenced" ]);
    for (const codeFenced of codeFenceds) {
      const codeFencedFence = tokenIfType(codeFenced.children[0], "codeFencedFence");
      if (codeFencedFence) {
        const codeFencedFenceSequence = tokenIfType(codeFencedFence.children[0], "codeFencedFenceSequence");
        if (codeFencedFenceSequence) {
          const { startLine, text } = codeFencedFenceSequence;
          if (expectedStyle === "consistent") {
            expectedStyle = fencedCodeBlockStyleFor(text);
          }
          addErrorDetailIf(
            onError,
            startLine,
            expectedStyle,
            fencedCodeBlockStyleFor(text)
          );
        }
      }
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



const { addError, emphasisOrStrongStyleFor } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByPredicate, tokenIfType } = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

const intrawordRe = /^\w$/;

/**
 * @param {import("./markdownlint").RuleParams} params Rule parameters.
 * @param {import("./markdownlint").RuleOnError} onError Error-reporting callback.
 * @param {import("markdownlint-micromark").TokenType} type Token type.
 * @param {import("markdownlint-micromark").TokenType} typeSequence Token sequence type.
 * @param {"*" | "**"} asterisk Asterisk kind.
 * @param {"_" | "__"} underline Underline kind.
 * @param {"asterisk" | "consistent" | "underscore"} style Style string.
 */
const impl =
  (params, onError, type, typeSequence, asterisk, underline, style = "consistent") => {
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const { lines } = params;
    const emphasisTokens = filterByPredicate(
      micromarkTokens,
      (token) => token.type === type,
      (token) => ((token.type === "htmlFlow") ? [] : token.children)
    );
    for (const token of emphasisTokens) {
      const { children } = token;
      const startSequence = tokenIfType(children[0], typeSequence);
      const endSequence = tokenIfType(children[children.length - 1], typeSequence);
      if (startSequence && endSequence) {
        const markupStyle = emphasisOrStrongStyleFor(startSequence.text);
        if (style === "consistent") {
          style = markupStyle;
        }
        if (style !== markupStyle) {
          const underscoreIntraword = (style === "underscore") && (
            intrawordRe.test(
              lines[startSequence.startLine - 1][startSequence.startColumn - 2]
            ) ||
            intrawordRe.test(
              lines[endSequence.endLine - 1][endSequence.endColumn - 1]
            )
          );
          if (!underscoreIntraword) {
            for (const sequence of [ startSequence, endSequence ]) {
              addError(
                onError,
                sequence.startLine,
                `Expected: ${style}; Actual: ${markupStyle}`,
                undefined,
                [ sequence.startColumn, sequence.text.length ],
                {
                  "editColumn": sequence.startColumn,
                  "deleteCount": sequence.text.length,
                  "insertText": (style === "asterisk") ? asterisk : underline
                }
              );
            }
          }
        }
      }
    }
  };

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule[] */
module.exports = [
  {
    "names": [ "MD049", "emphasis-style" ],
    "description": "Emphasis style",
    "tags": [ "emphasis" ],
    "parser": "micromark",
    "function": function MD049(params, onError) {
      return impl(
        params,
        onError,
        "emphasis",
        "emphasisSequence",
        "*",
        "_",
        params.config.style || undefined
      );
    }
  },
  {
    "names": [ "MD050", "strong-style" ],
    "description": "Strong style",
    "tags": [ "emphasis" ],
    "parser": "micromark",
    "function": function MD050(params, onError) {
      return impl(
        params,
        onError,
        "strong",
        "strongSequence",
        "**",
        "__",
        params.config.style || undefined
      );
    }
  }
];


/***/ }),

/***/ "../lib/md051.js":
/*!***********************!*\
  !*** ../lib/md051.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



const { addError, addErrorDetailIf, getHtmlAttributeRe } =
  __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByPredicate, filterByTypes, getHtmlTagInfo } =
  __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

// Regular expression for identifying HTML anchor names
const idRe = getHtmlAttributeRe("id");
const nameRe = getHtmlAttributeRe("name");
const anchorRe = /\{(#[a-z\d]+(?:[-_][a-z\d]+)*)\}/gu;
const lineFragmentRe = /^#(?:L\d+(?:C\d+)?-L\d+(?:C\d+)?|L\d+)$/;

// Sets for filtering heading tokens during conversion
const childrenExclude = new Set([ "image", "reference", "resource" ]);
const tokensInclude = new Set(
  [ "characterEscapeValue", "codeTextData", "data", "mathTextData" ]
);

/**
 * Converts a Markdown heading into an HTML fragment according to the rules
 * used by GitHub.
 *
 * @param {import("../helpers/micromark.cjs").Token} headingText Heading text token.
 * @returns {string} Fragment string for heading.
 */
function convertHeadingToHTMLFragment(headingText) {
  const inlineText =
    filterByPredicate(
      headingText.children,
      (token) => tokensInclude.has(token.type),
      (token) => (childrenExclude.has(token.type) ? [] : token.children)
    )
      .map((token) => token.text)
      .join("");
  return "#" + encodeURIComponent(
    inlineText
      .toLowerCase()
      // RegExp source with Ruby's \p{Word} expanded into its General Categories
      // https://github.com/gjtorikian/html-pipeline/blob/main/lib/html/pipeline/toc_filter.rb
      // https://ruby-doc.org/core-3.0.2/Regexp.html
      .replace(
        /[^\p{Letter}\p{Mark}\p{Number}\p{Connector_Punctuation}\- ]/gu,
        ""
      )
      .replace(/ /gu, "-")
  );
}

/**
 * Unescapes the text of a String-type micromark Token.
 *
 * @param {import("../helpers/micromark.cjs").Token} token String-type micromark Token.
 * @returns {string} Unescaped token text.
 */
function unescapeStringTokenText(token) {
  return filterByTypes(token.children, [ "characterEscapeValue", "data" ])
    .map((child) => child.text)
    .join("");
}

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD051", "link-fragments" ],
  "description": "Link fragments should be valid",
  "tags": [ "links" ],
  "parser": "micromark",
  "function": function MD051(params, onError) {
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const fragments = new Map();

    // Process headings
    const headingTexts = filterByTypes(micromarkTokens, [ "atxHeadingText", "setextHeadingText" ]);
    for (const headingText of headingTexts) {
      const fragment = convertHeadingToHTMLFragment(headingText);
      if (fragment !== "#") {
        const count = fragments.get(fragment) || 0;
        if (count) {
          fragments.set(`${fragment}-${count}`, 0);
        }
        fragments.set(fragment, count + 1);
        let match = null;
        while ((match = anchorRe.exec(headingText.text)) !== null) {
          const [ , anchor ] = match;
          if (!fragments.has(anchor)) {
            fragments.set(anchor, 1);
          }
        }
      }
    }

    // Process HTML anchors
    for (const token of filterByTypes(micromarkTokens, [ "htmlText" ])) {
      const htmlTagInfo = getHtmlTagInfo(token);
      if (htmlTagInfo && !htmlTagInfo.close) {
        const anchorMatch = idRe.exec(token.text) ||
          (htmlTagInfo.name.toLowerCase() === "a" && nameRe.exec(token.text));
        if (anchorMatch && anchorMatch.length > 0) {
          fragments.set(`#${anchorMatch[1]}`, 0);
        }
      }
    }

    // Process link and definition fragments
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").TokenType[][] */
    const parentChilds = [
      [ "link", "resourceDestinationString" ],
      [ "definition", "definitionDestinationString" ]
    ];
    for (const [ parentType, definitionType ] of parentChilds) {
      const links = filterByTypes(micromarkTokens, [ parentType ]);
      for (const link of links) {
        const definitions = filterByTypes(link.children, [ definitionType ]);
        for (const definition of definitions) {
          const { endColumn, startColumn } = definition;
          const text = unescapeStringTokenText(definition);
          const encodedText = `#${encodeURIComponent(text.slice(1))}`;
          if (
            (text.length > 1) &&
            text.startsWith("#") &&
            !fragments.has(encodedText) &&
            !lineFragmentRe.test(encodedText)
          ) {
            // eslint-disable-next-line no-undef-init
            let context = undefined;
            // eslint-disable-next-line no-undef-init
            let range = undefined;
            // eslint-disable-next-line no-undef-init
            let fixInfo = undefined;
            if (link.startLine === link.endLine) {
              context = link.text;
              range = [ link.startColumn, link.endColumn - link.startColumn ];
              fixInfo = {
                "editColumn": startColumn,
                "deleteCount": endColumn - startColumn
              };
            }
            const textLower = text.toLowerCase();
            const mixedCaseKey = [ ...fragments.keys() ]
              .find((key) => textLower === key.toLowerCase());
            if (mixedCaseKey) {
              // @ts-ignore
              (fixInfo || {}).insertText = mixedCaseKey;
              addErrorDetailIf(
                onError,
                link.startLine,
                mixedCaseKey,
                text,
                undefined,
                context,
                range,
                fixInfo
              );
            } else {
              addError(
                onError,
                link.startLine,
                undefined,
                context,
                range
              );
            }
          }
        }
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



const { addError } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { referenceLinkImageData } = __webpack_require__(/*! ./cache */ "../lib/cache.js");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD052", "reference-links-images" ],
  "description":
    "Reference links and images should use a label that is defined",
  "tags": [ "images", "links" ],
  "parser": "none",
  "function": function MD052(params, onError) {
    const { config, lines } = params;
    const shortcutSyntax = config.shortcut_syntax || false;
    const { definitions, references, shortcuts } = referenceLinkImageData();
    const entries = shortcutSyntax ?
      [ ...references.entries(), ...shortcuts.entries() ] :
      references.entries();
    // Look for links/images that use an undefined link reference
    for (const reference of entries) {
      const [ label, datas ] = reference;
      if (!definitions.has(label)) {
        for (const data of datas) {
          const [ lineIndex, index, length ] = data;
          // Context will be incomplete if reporting for a multi-line link
          const context = lines[lineIndex].slice(index, index + length);
          addError(
            onError,
            lineIndex + 1,
            `Missing link or image reference definition: "${label}"`,
            context,
            [ index + 1, context.length ]
          );
        }
      }
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



const { addError, ellipsify, linkReferenceDefinitionRe } =
  __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { referenceLinkImageData } = __webpack_require__(/*! ./cache */ "../lib/cache.js");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD053", "link-image-reference-definitions" ],
  "description": "Link and image reference definitions should be needed",
  "tags": [ "images", "links" ],
  "parser": "none",
  "function": function MD053(params, onError) {
    const ignored = new Set(params.config.ignored_definitions || [ "//" ]);
    const lines = params.lines;
    const { references, shortcuts, definitions, duplicateDefinitions } =
      referenceLinkImageData();
    const singleLineDefinition = (line) => (
      line.replace(linkReferenceDefinitionRe, "").trim().length > 0
    );
    const deleteFixInfo = {
      "deleteCount": -1
    };
    // Look for unused link references (unreferenced by any link/image)
    for (const definition of definitions.entries()) {
      const [ label, [ lineIndex ] ] = definition;
      if (
        !ignored.has(label) &&
        !references.has(label) &&
        !shortcuts.has(label)
      ) {
        const line = lines[lineIndex];
        addError(
          onError,
          lineIndex + 1,
          `Unused link or image reference definition: "${label}"`,
          ellipsify(line),
          [ 1, line.length ],
          singleLineDefinition(line) ? deleteFixInfo : 0
        );
      }
    }
    // Look for duplicate link references (defined more than once)
    for (const duplicateDefinition of duplicateDefinitions) {
      const [ label, lineIndex ] = duplicateDefinition;
      if (!ignored.has(label)) {
        const line = lines[lineIndex];
        addError(
          onError,
          lineIndex + 1,
          `Duplicate link or image reference definition: "${label}"`,
          ellipsify(line),
          [ 1, line.length ],
          singleLineDefinition(line) ? deleteFixInfo : 0
        );
      }
    }
  }
};


/***/ }),

/***/ "../lib/md054.js":
/*!***********************!*\
  !*** ../lib/md054.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



const { addErrorContext, nextLinesRe } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByTypes, filterByPredicate, getTokenTextByType } =
  __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");
const { referenceLinkImageData } = __webpack_require__(/*! ./cache */ "../lib/cache.js");

const backslashEscapeRe = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g;
const removeBackslashEscapes = (text) => text.replace(backslashEscapeRe, "$1");
const autolinkDisallowedRe = /[ <>]/;
const autolinkAble = (destination) => {
  try {
    // eslint-disable-next-line no-new
    new URL(destination);
  } catch {
    // Not an absolute URL
    return false;
  }
  return !autolinkDisallowedRe.test(destination);
};

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD054", "link-image-style" ],
  "description": "Link and image style",
  "tags": [ "images", "links" ],
  "parser": "micromark",
  "function": (params, onError) => {
    const config = params.config;
    const autolink = (config.autolink === undefined) || !!config.autolink;
    const inline = (config.inline === undefined) || !!config.inline;
    const full = (config.full === undefined) || !!config.full;
    const collapsed = (config.collapsed === undefined) || !!config.collapsed;
    const shortcut = (config.shortcut === undefined) || !!config.shortcut;
    const urlInline = (config.url_inline === undefined) || !!config.url_inline;
    if (autolink && inline && full && collapsed && shortcut && urlInline) {
      // Everything allowed, nothing to check
      return;
    }
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const { definitions } = referenceLinkImageData();
    const links = filterByTypes(micromarkTokens, [ "autolink", "image", "link" ]);
    for (const link of links) {
      let label = null;
      let destination = null;
      const {
        children, endColumn, endLine, startColumn, startLine, text, type
      } = link;
      const image = (type === "image");
      let isError = false;
      if (type === "autolink") {
        // link kind is an autolink
        destination = getTokenTextByType(children, "autolinkProtocol");
        label = destination;
        isError = !autolink;
      } else {
        // link type is "image" or "link"
        const descendents = filterByPredicate(children);
        label = getTokenTextByType(descendents, "labelText");
        destination =
          getTokenTextByType(descendents, "resourceDestinationString");
        if (destination) {
          // link kind is an inline link
          const title = getTokenTextByType(descendents, "resourceTitleString");
          isError = !inline || (
            !urlInline &&
            autolink &&
            !image &&
            !title &&
            (label === destination) &&
            autolinkAble(destination)
          );
        } else {
          // link kind is a full/collapsed/shortcut reference link
          const isShortcut = !children.some((t) => t.type === "reference");
          const referenceString = getTokenTextByType(descendents, "referenceString");
          const isCollapsed = (referenceString === null);
          const definition = definitions.get(referenceString || label);
          destination = definition && definition[1];
          isError = destination &&
            (isShortcut ? !shortcut : (isCollapsed ? !collapsed : !full));
        }
      }
      if (isError) {
        let range = null;
        let fixInfo = null;
        if (startLine === endLine) {
          range = [ startColumn, endColumn - startColumn ];
          let insertText = null;
          const canInline = (inline && label);
          const canAutolink = (autolink && !image && autolinkAble(destination));
          if (canInline && (urlInline || !canAutolink)) {
            // Most useful form
            const prefix = (image ? "!" : "");
            // @ts-ignore
            const escapedLabel = label.replace(/[[\]]/g, "\\$&");
            const escapedDestination = destination.replace(/[()]/g, "\\$&");
            insertText = `${prefix}[${escapedLabel}](${escapedDestination})`;
          } else if (canAutolink) {
            // Simplest form
            insertText = `<${removeBackslashEscapes(destination)}>`;
          }
          if (insertText) {
            fixInfo = {
              "editColumn": range[0],
              insertText,
              "deleteCount": range[1]
            };
          }
        }
        addErrorContext(
          onError,
          startLine,
          text.replace(nextLinesRe, ""),
          null,
          null,
          range,
          fixInfo
        );
      }
    }
  }
};


/***/ }),

/***/ "../lib/md055.js":
/*!***********************!*\
  !*** ../lib/md055.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



const { addErrorDetailIf } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByTypes } = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

const whitespaceTypes = new Set([ "linePrefix", "whitespace" ]);
const ignoreWhitespace = (tokens) => tokens.filter(
  (token) => !whitespaceTypes.has(token.type)
);
const firstOrNothing = (items) => items[0];
const lastOrNothing = (items) => items[items.length - 1];
const makeRange = (start, end) => [ start, end - start + 1 ];

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD055", "table-pipe-style" ],
  "description": "Table pipe style",
  "tags": [ "table" ],
  "parser": "micromark",
  "function": function MD055(params, onError) {
    const style = String(params.config.style || "consistent");
    let expectedStyle = style;
    let expectedLeadingPipe =
      ((expectedStyle !== "no_leading_or_trailing") && (expectedStyle !== "trailing_only"));
    let expectedTrailingPipe =
      ((expectedStyle !== "no_leading_or_trailing") && (expectedStyle !== "leading_only"));
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const tables = filterByTypes(micromarkTokens, [ "table" ]);
    for (const table of tables) {
      const rows = filterByTypes(table.children, [ "tableDelimiterRow", "tableRow" ]);
      for (const row of rows) {
        // The following uses of first/lastOrNothing lack fallback handling
        // because it seems not to be possible (i.e., 0% coverage)
        const firstCell = firstOrNothing(row.children);
        const leadingToken = firstOrNothing(ignoreWhitespace(firstCell.children));
        const actualLeadingPipe = (leadingToken.type === "tableCellDivider");
        const lastCell = lastOrNothing(row.children);
        const trailingToken = lastOrNothing(ignoreWhitespace(lastCell.children));
        const actualTrailingPipe = (trailingToken.type === "tableCellDivider");
        const actualStyle = actualLeadingPipe ?
          (actualTrailingPipe ? "leading_and_trailing" : "leading_only") :
          (actualTrailingPipe ? "trailing_only" : "no_leading_or_trailing");
        if (expectedStyle === "consistent") {
          expectedStyle = actualStyle;
          expectedLeadingPipe = actualLeadingPipe;
          expectedTrailingPipe = actualTrailingPipe;
        }
        if (actualLeadingPipe !== expectedLeadingPipe) {
          addErrorDetailIf(
            onError,
            firstCell.startLine,
            expectedStyle,
            actualStyle,
            `${expectedLeadingPipe ? "Missing" : "Unexpected"} leading pipe`,
            undefined,
            makeRange(row.startColumn, firstCell.startColumn)
          );
        }
        if (actualTrailingPipe !== expectedTrailingPipe) {
          addErrorDetailIf(
            onError,
            lastCell.endLine,
            expectedStyle,
            actualStyle,
            `${expectedTrailingPipe ? "Missing" : "Unexpected"} trailing pipe`,
            undefined,
            makeRange(lastCell.endColumn - 1, row.endColumn - 1)
          );
        }
      }
    }
  }
}


/***/ }),

/***/ "../lib/md056.js":
/*!***********************!*\
  !*** ../lib/md056.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



const { addErrorDetailIf } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { filterByTypes } = __webpack_require__(/*! ../helpers/micromark.cjs */ "../helpers/micromark.cjs");

const makeRange = (start, end) => [ start, end - start + 1 ];

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD056", "table-column-count" ],
  "description": "Table column count",
  "tags": [ "table" ],
  "parser": "micromark",
  "function": function MD056(params, onError) {
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const tables = filterByTypes(micromarkTokens, [ "table" ]);
    for (const table of tables) {
      const rows = filterByTypes(table.children, [ "tableDelimiterRow", "tableRow" ]);
      let expectedCount = 0;
      for (const row of rows) {
        const cells = filterByTypes(row.children, [ "tableData", "tableDelimiter", "tableHeader" ]);
        const actualCount = cells.length;
        expectedCount ||= actualCount;
        let detail = null;
        let range = null;
        if (actualCount < expectedCount) {
          detail = "Too few cells, row will be missing data";
          range = [ row.endColumn - 1, 1 ];
        } else if (expectedCount < actualCount) {
          detail = "Too many cells, extra data will be missing";
          range = makeRange(cells[expectedCount].startColumn, row.endColumn - 1);
        }
        addErrorDetailIf(
          onError,
          row.endLine,
          expectedCount,
          actualCount,
          detail,
          null,
          range
        );
      }
    }
  }
}


/***/ }),

/***/ "../lib/rules.js":
/*!***********************!*\
  !*** ../lib/rules.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check



const { homepage, version } = __webpack_require__(/*! ./constants */ "../lib/constants.js");

const rules = [
  __webpack_require__(/*! ./md001 */ "../lib/md001.js"),
  // md002: Deprecated and removed
  __webpack_require__(/*! ./md003 */ "../lib/md003.js"),
  __webpack_require__(/*! ./md004 */ "../lib/md004.js"),
  __webpack_require__(/*! ./md005 */ "../lib/md005.js"),
  // md006: Deprecated and removed
  __webpack_require__(/*! ./md007 */ "../lib/md007.js"),
  __webpack_require__(/*! ./md009 */ "../lib/md009.js"),
  __webpack_require__(/*! ./md010 */ "../lib/md010.js"),
  __webpack_require__(/*! ./md011 */ "../lib/md011.js"),
  __webpack_require__(/*! ./md012 */ "../lib/md012.js"),
  __webpack_require__(/*! ./md013 */ "../lib/md013.js"),
  __webpack_require__(/*! ./md014 */ "../lib/md014.js"),
  __webpack_require__(/*! ./md018 */ "../lib/md018.js"),
  __webpack_require__(/*! ./md019 */ "../lib/md019.js"),
  __webpack_require__(/*! ./md020 */ "../lib/md020.js"),
  __webpack_require__(/*! ./md021 */ "../lib/md021.js"),
  __webpack_require__(/*! ./md022 */ "../lib/md022.js"),
  __webpack_require__(/*! ./md023 */ "../lib/md023.js"),
  __webpack_require__(/*! ./md024 */ "../lib/md024.js"),
  __webpack_require__(/*! ./md025 */ "../lib/md025.js"),
  __webpack_require__(/*! ./md026 */ "../lib/md026.js"),
  __webpack_require__(/*! ./md027 */ "../lib/md027.js"),
  __webpack_require__(/*! ./md028 */ "../lib/md028.js"),
  __webpack_require__(/*! ./md029 */ "../lib/md029.js"),
  __webpack_require__(/*! ./md030 */ "../lib/md030.js"),
  __webpack_require__(/*! ./md031 */ "../lib/md031.js"),
  __webpack_require__(/*! ./md032 */ "../lib/md032.js"),
  __webpack_require__(/*! ./md033 */ "../lib/md033.js"),
  __webpack_require__(/*! ./md034 */ "../lib/md034.js"),
  __webpack_require__(/*! ./md035 */ "../lib/md035.js"),
  __webpack_require__(/*! ./md036 */ "../lib/md036.js"),
  __webpack_require__(/*! ./md037 */ "../lib/md037.js"),
  __webpack_require__(/*! ./md038 */ "../lib/md038.js"),
  __webpack_require__(/*! ./md039 */ "../lib/md039.js"),
  __webpack_require__(/*! ./md040 */ "../lib/md040.js"),
  __webpack_require__(/*! ./md041 */ "../lib/md041.js"),
  __webpack_require__(/*! ./md042 */ "../lib/md042.js"),
  __webpack_require__(/*! ./md043 */ "../lib/md043.js"),
  __webpack_require__(/*! ./md044 */ "../lib/md044.js"),
  __webpack_require__(/*! ./md045 */ "../lib/md045.js"),
  __webpack_require__(/*! ./md046 */ "../lib/md046.js"),
  __webpack_require__(/*! ./md047 */ "../lib/md047.js"),
  __webpack_require__(/*! ./md048 */ "../lib/md048.js"),
  ...__webpack_require__(/*! ./md049-md050 */ "../lib/md049-md050.js"),
  __webpack_require__(/*! ./md051 */ "../lib/md051.js"),
  __webpack_require__(/*! ./md052 */ "../lib/md052.js"),
  __webpack_require__(/*! ./md053 */ "../lib/md053.js"),
  __webpack_require__(/*! ./md054 */ "../lib/md054.js"),
  __webpack_require__(/*! ./md055 */ "../lib/md055.js"),
  __webpack_require__(/*! ./md056 */ "../lib/md056.js")
  // md057: See https://github.com/markdownlint/markdownlint
];
for (const rule of rules) {
  const name = rule.names[0].toLowerCase();
  // eslint-disable-next-line dot-notation
  rule["information"] =
    new URL(`${homepage}/blob/v${version}/doc/${name}.md`);
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