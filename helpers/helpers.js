// @ts-check

"use strict";

const micromark = require("./micromark.cjs");

const { newLineRe, nextLinesRe } = require("./shared.js");

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
