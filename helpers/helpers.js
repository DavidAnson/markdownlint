// @ts-check

"use strict";

const micromark = require("./micromark.cjs");

// Regular expression for matching common newline characters
// See NEWLINES_RE in markdown-it/lib/rules_core/normalize.js
const newLineRe = /\r\n?|\n/g;
module.exports.newLineRe = newLineRe;

// Regular expression for matching common front matter (YAML and TOML)
module.exports.frontMatterRe =
  // eslint-disable-next-line max-len
  /((^---\s*$[\s\S]*?^---\s*)|(^\+\+\+\s*$[\s\S]*?^(\+\+\+|\.\.\.)\s*)|(^\{\s*$[\s\S]*?^\}\s*))(\r\n|\r|\n|$)/m;

// Regular expression for matching the start of inline disable/enable comments
const inlineCommentStartRe =
  // eslint-disable-next-line max-len
  /(<!--\s*markdownlint-(disable|enable|capture|restore|disable-file|enable-file|disable-line|disable-next-line|configure-file))(?:\s|-->)/gi;
module.exports.inlineCommentStartRe = inlineCommentStartRe;

// Regular expression for matching HTML elements
const htmlElementRe = /<(([A-Za-z][A-Za-z\d-]*)(?:\s[^`>]*)?)\/?>/g;
module.exports.htmlElementRe = htmlElementRe;

// Regular expressions for range matching
module.exports.listItemMarkerRe = /^([\s>]*)(?:[*+-]|\d+[.)])\s+/;
module.exports.orderedListItemMarkerRe = /^[\s>]*0*(\d+)[.)]/;

// Regular expression for all instances of emphasis markers
const emphasisMarkersRe = /[_*]/g;

// Regular expression for blockquote prefixes
const blockquotePrefixRe = /^[>\s]*/;
module.exports.blockquotePrefixRe = blockquotePrefixRe;

// Regular expression for link reference definitions
const linkReferenceDefinitionRe = /^ {0,3}\[([^\]]*[^\\])\]:/;
module.exports.linkReferenceDefinitionRe = linkReferenceDefinitionRe;

// All punctuation characters (normal and full-width)
const allPunctuation = ".,;:!?。，；：！？";
module.exports.allPunctuation = allPunctuation;

// All punctuation characters without question mark (normal and full-width)
module.exports.allPunctuationNoQuestion = allPunctuation.replace(/[?？]/gu, "");

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
  return (obj !== null) && (typeof obj === "object") && !Array.isArray(obj);
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
 * @returns {string} String representation.
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
  for (const token of params.parsers.markdownit.tokens) {
    if (token.type === type) {
      handler(token);
    }
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
  return (
    ((token.tag === "$$") || (token.tag === "math")) &&
    token.type.startsWith("math_block") &&
    !token.type.endsWith("_end")
  );
}
module.exports.isMathBlock = isMathBlock;

// Get line metadata array
module.exports.getLineMetadata = function getLineMetadata(params) {
  const lineMetadata = params.lines.map(
    (line, index) => [ line, index, false, 0, false, false, false, false ]
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
  for (const token of params.parsers.markdownit.tokens.filter(isMathBlock)) {
    for (let i = token.map[0]; i < token.map[1]; i++) {
      lineMetadata[i][7] = true;
    }
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
  for (const metadata of lineMetadata) {
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

/**
 * Calls the provided function for each specified inline child token.
 *
 * @param {Object} params RuleParams instance.
 * @param {string} type Token type identifier.
 * @param {Function} handler Callback function.
 * @returns {void}
 */
function forEachInlineChild(params, type, handler) {
  filterTokens(params, "inline", (token) => {
    for (const child of token.children.filter((c) => c.type === type)) {
      handler(child, token);
    }
  });
}
module.exports.forEachInlineChild = forEachInlineChild;

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
 * Calls the provided function for each inline code span's content.
 *
 * @param {string} input Markdown content.
 * @param {Function} handler Callback function taking (code, lineIndex,
 * columnIndex, ticks).
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
 * Returns an array of HTML element ranges.
 *
 * @param {Object} params RuleParams instance.
 * @param {Object} lineMetadata Line metadata object.
 * @returns {number[][]} Array of ranges (lineIndex, columnIndex, length).
 */
module.exports.htmlElementRanges = (params, lineMetadata) => {
  const exclusions = [];
  // Match with htmlElementRe
  forEachLine(lineMetadata, (line, lineIndex, inCode) => {
    let match = null;
    // eslint-disable-next-line no-unmodified-loop-condition
    while (!inCode && ((match = htmlElementRe.exec(line)) !== null)) {
      exclusions.push([ lineIndex, match.index, match[0].length ]);
    }
  });
  // Match with html_inline
  forEachInlineChild(params, "html_inline", (token, parent) => {
    const parentContent = parent.content;
    let tokenContent = token.content;
    const parentIndex = parentContent.indexOf(tokenContent);
    let deltaLines = 0;
    let indent = 0;
    for (let i = parentIndex - 1; i >= 0; i--) {
      if (parentContent[i] === "\n") {
        deltaLines++;
      } else if (deltaLines === 0) {
        indent++;
      }
    }
    let lineIndex = token.lineNumber - 1 + deltaLines;
    do {
      const index = tokenContent.indexOf("\n");
      const length = (index === -1) ? tokenContent.length : index;
      exclusions.push([ lineIndex, indent, length ]);
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
 * Calls the provided function for each link.
 *
 * @param {string} line Line of Markdown input.
 * @param {Function} handler Function taking (index, link, text, destination).
 * @returns {void}
 */
function forEachLink(line, handler) {
  // Helper to find matching close symbol for link text/destination
  const findClosingSymbol = (index) => {
    const begin = line[index];
    const end = (begin === "[") ? "]" : ")";
    let nesting = 0;
    let escaping = false;
    let pointy = false;
    for (let i = index + 1; i < line.length; i++) {
      const current = line[i];
      if (current === "\\") {
        escaping = !escaping;
      } else if (!escaping && (current === begin)) {
        nesting++;
      } else if (!escaping && (current === end)) {
        if (nesting > 0) {
          nesting--;
        } else if (!pointy) {
          // Return index after matching close symbol
          return i + 1;
        }
      } else if ((i === index + 1) && (begin === "(") && (current === "<")) {
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
  let escaping = false;
  for (let i = 0; i < line.length; i++) {
    const current = line[i];
    if (current === "\\") {
      escaping = !escaping;
    } else if (!escaping && (current === "[")) {
      // Scan for matching close "]" of link text
      const textEnd = findClosingSymbol(i);
      if (textEnd !== -1) {
        if ((line[textEnd] === "(") || (line[textEnd] === "[")) {
          // Scan for matching close ")" or "]" of link destination
          const destEnd = findClosingSymbol(textEnd);
          if (destEnd !== -1) {
            // Call handler with link text and destination
            const link = line.slice(i, destEnd);
            const text = line.slice(i, textEnd);
            const dest = line.slice(textEnd, destEnd);
            handler(i, link, text, dest);
            i = destEnd;
          }
        }
        if (i < textEnd) {
          // Call handler with link text only
          const text = line.slice(i, textEnd);
          handler(i, text, text);
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
  const { lines } = params;
  const byLine = new Array(lines.length);
  // Search links
  for (const [ tokenLineIndex, tokenLine ] of lines.entries()) {
    const inLine = [];
    forEachLink(tokenLine, (index, match) => {
      let markerMatch = null;
      while ((markerMatch = emphasisMarkersRe.exec(match))) {
        inLine.push(index + markerMatch.index);
      }
    });
    byLine[tokenLineIndex] = inLine;
  }
  // Search code spans
  filterTokens(params, "inline", (token) => {
    const { children, lineNumber, map } = token;
    if (children.some((child) => child.type === "code_inline")) {
      const tokenLines = lines.slice(map[0], map[1]);
      forEachInlineCodeSpan(
        tokenLines.join("\n"),
        (code, lineIndex, column, tickCount) => {
          const codeLines = code.split(newLineRe);
          for (const [ codeLineIndex, codeLine ] of codeLines.entries()) {
            const byLineIndex = lineNumber - 1 + lineIndex + codeLineIndex;
            const inLine = byLine[byLineIndex];
            const codeLineOffset = codeLineIndex ? 0 : column - 1 + tickCount;
            let match = null;
            while ((match = emphasisMarkersRe.exec(codeLine))) {
              inLine.push(codeLineOffset + match.index);
            }
            byLine[byLineIndex] = inLine;
          }
        }
      );
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
  const normalizeReference = (s) => s.toLowerCase().trim().replace(/\s+/g, " ");
  const definitions = new Map();
  const definitionLineIndices = [];
  const duplicateDefinitions = [];
  const references = new Map();
  const shortcuts = new Map();
  const filteredTokens =
    micromark.filterByTypes(
      params.parsers.micromark.tokens,
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
            definitions.set(reference, token.startLine - 1);
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
            micromark.matchAndGetTokensByType(token.tokens, [ "label" ]);
          if (shortcutCandidate) {
            labelText =
              micromark.getTokenTextByType(
                shortcutCandidate[0].tokens, "labelText"
              );
            isShortcut = (labelText !== null);
          }
          const fullAndCollapsedCandidate =
            micromark.matchAndGetTokensByType(
              token.tokens, [ "label", "reference" ]
            );
          if (fullAndCollapsedCandidate) {
            labelText =
              micromark.getTokenTextByType(
                fullAndCollapsedCandidate[0].tokens, "labelText"
              );
            referenceStringText =
              micromark.getTokenTextByType(
                fullAndCollapsedCandidate[1].tokens, "referenceString"
              );
            isFullOrCollapsed = (labelText !== null);
          }
          const footnote = micromark.matchAndGetTokensByType(
            token.tokens,
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
  const lineEnding = getPreferredLineEnding(input, require("node:os"));
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
module.exports.getRangeAndFixInfoIfFound =
  (lines, lineIndex, search, replace, instance = 1) => {
    let range = null;
    let fixInfo = null;
    let searchIndex = -1;
    while (instance > 0) {
      searchIndex = lines[lineIndex].indexOf(search, searchIndex + 1);
      instance--;
    }
    if (searchIndex !== -1) {
      const column = searchIndex + 1;
      const length = search.length;
      range = [ column, length ];
      fixInfo = {
        "editColumn": column,
        "deleteCount": length,
        "insertText": replace
      };
    }
    return {
      range,
      fixInfo
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
  const { children } = parentToken;
  const index = children.indexOf(childToken);
  if (
    (index !== -1) &&
    (children.length > index + 2) &&
    (children[index + 1].type === nextType) &&
    (children[index + 2].type === nextNextType)
  ) {
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
  const homedir = os && os.homedir && os.homedir();
  return homedir ? file.replace(/^~($|\/|\\)/, `${homedir}$1`) : file;
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
  const lastIndex = funcExp.lastIndex || 0;
  const result = funcExp(input.slice(lastIndex));
  if (result) {
    // Update lastIndex and return match
    const [ subIndex, length ] = result;
    const index = lastIndex + subIndex;
    // @ts-ignore
    funcExp.lastIndex = index + length;
    const match = [ input.slice(index, index + length) ];
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

const urlFeProtocolRe = /(?:http|ftp)s?:\/\//i;
const urlFeAutolinkTerminalsRe = / |$/;
const urlFeBareTerminalsRe = /[ ,!`'"\]]|$/;
const urlFeNonTerminalsRe = "-#/";
const urlFePunctuationRe = /\p{Punctuation}/u;
const urlFePrefixToPostfix = new Map([
  [ " ", " " ],
  [ "`", "`" ],
  [ "'", "'" ],
  [ "\"", "\"" ],
  [ "‘", "’" ],
  [ "“", "”" ],
  [ "«", "»" ],
  [ "*", "*" ],
  [ "_", "_" ],
  [ "(", ")" ],
  [ "[", "]" ],
  [ "{", "}" ],
  [ "<", ">" ],
  [ ">", "<" ]
]);

/**
 * Function expression that matches URLs.
 *
 * @param {string} input Substring to search for a URL.
 * @returns {Array | null} [index, length] of URL or null.
 */
function urlFe(input) {
  // Find start of URL by searching for protocol
  const match = input.match(urlFeProtocolRe);
  if (match) {
    // Look for matching pre/postfix characters (ex: <...>)
    const start = match.index || 0;
    const length = match[0].length;
    const prefix = input[start - 1] || " ";
    const postfix = urlFePrefixToPostfix.get(prefix);
    // @ts-ignore
    let endPostfix = input.indexOf(postfix, start + length);
    if (endPostfix === -1) {
      endPostfix = input.length;
    }
    // Look for characters that terminate a URL
    const terminalsRe =
      (prefix === "<") ? urlFeAutolinkTerminalsRe : urlFeBareTerminalsRe;
    const endTerminal = start + input.slice(start).search(terminalsRe);
    // Determine tentative end of URL
    let end = Math.min(endPostfix, endTerminal);
    if (prefix === " ") {
      // If the URL used " " as pre/postfix characters, trim the end
      if (input[end - 1] === ")") {
        // Trim any ")" beyond the last "(...)" pair
        const lastOpenParen = input.lastIndexOf("(", end - 2);
        if (lastOpenParen <= start) {
          end--;
        } else {
          const nextCloseParen = input.indexOf(")", lastOpenParen + 1);
          end = nextCloseParen + 1;
        }
      } else {
        // Trim unwanted punctuation
        while (
          !urlFeNonTerminalsRe.includes(input[end - 1]) &&
          urlFePunctuationRe.test(input[end - 1])
        ) {
          end--;
        }
      }
    }
    return [ start, end - start ];
  }
  // No match
  return null;
}
module.exports.urlFe = urlFe;
