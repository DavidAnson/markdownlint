// @ts-check

"use strict";

// Regular expression for matching common newline characters
// See NEWLINES_RE in markdown-it/lib/rules_core/normalize.js
const newLineRe = /\r\n?|\n/g;
module.exports.newLineRe = newLineRe;

// Regular expression for matching common front matter (YAML and TOML)
module.exports.frontMatterRe =
  // eslint-disable-next-line max-len
  /((^---\s*$[^]*?^---\s*$)|(^\+\+\+\s*$[^]*?^(\+\+\+|\.\.\.)\s*$)|(^\{\s*$[^]*?^\}\s*$))(\r\n|\r|\n|$)/m;

// Regular expression for matching inline disable/enable comments
const inlineCommentRe =
  // eslint-disable-next-line max-len
  /<!--\s*markdownlint-(?:(?:(disable|enable|capture|restore|disable-file|enable-file|disable-next-line)((?:\s+[a-z0-9_-]+)*))|(?:(configure-file)\s+([\s\S]*?)))\s*-->/ig;
module.exports.inlineCommentRe = inlineCommentRe;

// Regular expressions for range matching
module.exports.bareUrlRe = /(?:http|ftp)s?:\/\/[^\s\]"']*(?:\/|[^\s\]"'\W])/ig;
module.exports.listItemMarkerRe = /^([\s>]*)(?:[*+-]|\d+[.)])\s+/;
module.exports.orderedListItemMarkerRe = /^[\s>]*0*(\d+)[.)]/;

// Regular expression for all instances of emphasis markers
const emphasisMarkersRe = /[_*]/g;

// Regular expression for inline links and shortcut reference links
const linkRe = /(\[(?:[^[\]]|\[[^\]]*\])*\])(\(\S*\)|\[\S*\])?/g;
module.exports.linkRe = linkRe;

// Regular expression for link reference definition lines
module.exports.linkReferenceRe = /^ {0,3}\[[^\]]+]:\s.*$/;

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

// Returns true iff the input line is blank (no content)
// Example: Contains nothing, whitespace, or comment (unclosed start/end okay)
module.exports.isBlankLine = function isBlankLine(line) {
  // Call to String.replace follows best practices and is not a security check
  // False-positive for js/incomplete-multi-character-sanitization
  return (
    !line ||
    !line.trim() ||
    !line
      .replace(/<!--.*?-->/g, "")
      .replace(/<!--.*$/g, "")
      .replace(/^.*-->/g, "")
      .replace(/>/g, "")
      .trim()
  );
};

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
      let k = i - 1;
      while (text[k] === " ") {
        k--;
      }
      // If comment is not within an indented code block...
      if (k >= i - 4) {
        const content = text.slice(i + htmlCommentBegin.length, j);
        const isBlock = (k < 0) || (text[k] === "\n");
        const isValid = isBlock ||
          (!content.startsWith(">") && !content.startsWith("->") &&
           !content.endsWith("-") && !content.includes("--"));
        // If a valid block/inline comment...
        if (isValid) {
          const inlineCommentIndex = text
            .slice(i, j + htmlCommentEnd.length)
            .search(inlineCommentRe);
          // If not a markdownlint inline directive...
          if (inlineCommentIndex === -1) {
            text =
              text.slice(0, i + htmlCommentBegin.length) +
              content.replace(/[^\r\n]/g, ".") +
              text.slice(j);
          }
        }
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

// Un-escapes Markdown content (simple algorithm; not a parser)
const escapedMarkdownRe = /\\./g;
module.exports.unescapeMarkdown =
  function unescapeMarkdown(markdown, replacement) {
    return markdown.replace(escapedMarkdownRe, (match) => {
      const char = match[1];
      if ("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~".includes(char)) {
        return replacement || char;
      }
      return match;
    });
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
  params.tokens.forEach(function forToken(token) {
    if (token.type === type) {
      handler(token);
    }
  });
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
  params.tokens.filter(isMathBlock).forEach((token) => {
    for (let i = token.map[0]; i < token.map[1]; i++) {
      lineMetadata[i][7] = true;
    }
  });
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
  lineMetadata.forEach(function forMetadata(metadata) {
    handler(...metadata);
  });
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
  tokens.forEach((token) => {
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
      nesting = nestingStack.pop();
    } else if (token.map) {
      // Track last token with map
      lastWithMap = token;
    }
  });
  return flattenedLists;
};

// Calls the provided function for each specified inline child token
module.exports.forEachInlineChild =
function forEachInlineChild(params, type, handler) {
  filterTokens(params, "inline", function forToken(token) {
    token.children.forEach(function forChild(child) {
      if (child.type === type) {
        handler(child, token);
      }
    });
  });
};

// Calls the provided function for each heading's content
module.exports.forEachHeading = function forEachHeading(params, handler) {
  let heading = null;
  params.tokens.forEach(function forToken(token) {
    if (token.type === "heading_open") {
      heading = token;
    } else if (token.type === "heading_close") {
      heading = null;
    } else if ((token.type === "inline") && heading) {
      handler(heading, token.content);
    }
  });
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
  let currentLine = 0;
  let currentColumn = 0;
  let index = 0;
  while (index < input.length) {
    let startIndex = -1;
    let startLine = -1;
    let startColumn = -1;
    let tickCount = 0;
    let currentTicks = 0;
    let state = "normal";
    // Deliberate <= so trailing 0 completes the last span (ex: "text `code`")
    // False-positive for js/index-out-of-bounds
    for (; index <= input.length; index++) {
      const char = input[index];
      // Ignore backticks in link destination
      if ((char === "[") && (state === "normal")) {
        state = "linkTextOpen";
      } else if ((char === "]") && (state === "linkTextOpen")) {
        state = "linkTextClosed";
      } else if ((char === "(") && (state === "linkTextClosed")) {
        state = "linkDestinationOpen";
      } else if (
        ((char === "(") && (state === "linkDestinationOpen")) ||
        ((char === ")") && (state === "linkDestinationOpen")) ||
        (state === "linkTextClosed")) {
        state = "normal";
      }
      // Parse backtick open/close
      if ((char === "`") && (state !== "linkDestinationOpen")) {
        // Count backticks at start or end of code span
        currentTicks++;
        if ((startIndex === -1) || (startColumn === -1)) {
          startIndex = index + 1;
        }
      } else {
        if ((startIndex >= 0) &&
          (startColumn >= 0) &&
          (tickCount === currentTicks)) {
          // Found end backticks; invoke callback for code span
          handler(
            input.substring(startIndex, index - currentTicks),
            startLine, startColumn, tickCount);
          startIndex = -1;
          startColumn = -1;
        } else if ((startIndex >= 0) && (startColumn === -1)) {
          // Found start backticks
          tickCount = currentTicks;
          startLine = currentLine;
          startColumn = currentColumn;
        }
        // Not in backticks
        currentTicks = 0;
      }
      if (char === "\n") {
        // On next line
        currentLine++;
        currentColumn = 0;
      } else if ((char === "\\") &&
        ((startIndex === -1) || (startColumn === -1)) &&
        (input[index + 1] !== "\n")) {
        // Escape character outside code, skip next
        index++;
        currentColumn += 2;
      } else {
        // On next column
        currentColumn++;
      }
    }
    if (startIndex >= 0) {
      // Restart loop after unmatched start backticks (ex: "`text``code``")
      index = startIndex;
      currentLine = startLine;
      currentColumn = startColumn;
    }
  }
}
module.exports.forEachInlineCodeSpan = forEachInlineCodeSpan;

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
  if (context.length <= 30) {
    // Nothing to do
  } else if (left && right) {
    context = context.substr(0, 15) + "..." + context.substr(-15);
  } else if (right) {
    context = "..." + context.substr(-30);
  } else {
    context = context.substr(0, 30) + "...";
  }
  addError(onError, lineNumber, null, context, range, fixInfo);
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
 * Determines whether the specified range overlaps another range.
 *
 * @param {number[][]} ranges Array of ranges (line, index, length).
 * @param {number} lineIndex Line index to check.
 * @param {number} index Index to check.
 * @param {number} length Length to check.
 * @returns {boolean} True iff the specified range overlaps.
 */
module.exports.overlapsAnyRange = (ranges, lineIndex, index, length) => (
  !ranges.every((span) => (
    (lineIndex !== span[0]) ||
    (index + length < span[1]) ||
    (index > span[1] + span[2])
  ))
);

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
 * Returns a list of emphasis markers in code spans and links.
 *
 * @param {Object} params RuleParams instance.
 * @returns {number[][]} List of markers.
 */
function emphasisMarkersInContent(params) {
  const { lines } = params;
  const byLine = new Array(lines.length);
  // Search links
  lines.forEach((tokenLine, tokenLineIndex) => {
    const inLine = [];
    let linkMatch = null;
    while ((linkMatch = linkRe.exec(tokenLine))) {
      let markerMatch = null;
      while ((markerMatch = emphasisMarkersRe.exec(linkMatch[0]))) {
        inLine.push(linkMatch.index + markerMatch.index);
      }
    }
    byLine[tokenLineIndex] = inLine;
  });
  // Search code spans
  filterTokens(params, "inline", (token) => {
    const { children, lineNumber, map } = token;
    if (children.some((child) => child.type === "code_inline")) {
      const tokenLines = lines.slice(map[0], map[1]);
      forEachInlineCodeSpan(
        tokenLines.join("\n"),
        (code, lineIndex, column, tickCount) => {
          const codeLines = code.split(newLineRe);
          codeLines.forEach((codeLine, codeLineIndex) => {
            const byLineIndex = lineNumber - 1 + lineIndex + codeLineIndex;
            const inLine = byLine[byLineIndex];
            const codeLineOffset = codeLineIndex ? 0 : column - 1 + tickCount;
            let match = null;
            while ((match = emphasisMarkersRe.exec(codeLine))) {
              inLine.push(codeLineOffset + match.index);
            }
            byLine[byLineIndex] = inLine;
          });
        }
      );
    }
  });
  return byLine;
}
module.exports.emphasisMarkersInContent = emphasisMarkersInContent;

/**
 * Gets the most common line ending, falling back to the platform default.
 *
 * @param {string} input Markdown content to analyze.
 * @param {string} [platform] Platform identifier (process.platform).
 * @returns {string} Preferred line ending.
 */
function getPreferredLineEnding(input, platform) {
  let cr = 0;
  let lf = 0;
  let crlf = 0;
  const endings = input.match(newLineRe) || [];
  endings.forEach((ending) => {
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
  });
  let preferredLineEnding = null;
  if (!cr && !lf && !crlf) {
    preferredLineEnding =
      ((platform || process.platform) === "win32") ? "\r\n" : "\n";
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
 * @param {string} lineEnding Line ending to use.
 * @returns {string} Fixed content.
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

// Applies as many fixes as possible to the input lines
module.exports.applyFixes = function applyFixes(input, errors) {
  const lineEnding = getPreferredLineEnding(input);
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
  lastFixInfo = {};
  fixInfos.forEach((fixInfo) => {
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
  });
  fixInfos = fixInfos.filter((fixInfo) => fixInfo.lineNumber);
  // Apply all (remaining/updated) fixes
  let lastLineIndex = -1;
  let lastEditIndex = -1;
  fixInfos.forEach((fixInfo) => {
    const { lineNumber, editColumn, deleteCount } = fixInfo;
    const lineIndex = lineNumber - 1;
    const editIndex = editColumn - 1;
    if (
      (lineIndex !== lastLineIndex) ||
      (deleteCount === -1) ||
      ((editIndex + deleteCount) <=
        (lastEditIndex - ((deleteCount > 0) ? 0 : 1)))
    ) {
      lines[lineIndex] = applyFix(lines[lineIndex], fixInfo, lineEnding);
    }
    lastLineIndex = lineIndex;
    lastEditIndex = editIndex;
  });
  // Return corrected input
  return lines.filter((line) => line !== null).join(lineEnding);
};

/**
 * Gets the range and fixInfo values for reporting an error if the expected
 * text is found on the specified line.
 *
 * @param {string[]} lines Lines of Markdown content.
 * @param {number} lineIndex Line index to check.
 * @param {string} search Text to search for.
 * @param {string} replace Text to replace with.
 * @returns {Object} Range and fixInfo wrapper.
 */
function getRangeAndFixInfoIfFound(lines, lineIndex, search, replace) {
  let range = null;
  let fixInfo = null;
  const searchIndex = lines[lineIndex].indexOf(search);
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
}
module.exports.getRangeAndFixInfoIfFound = getRangeAndFixInfoIfFound;

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
 * Calls Object.freeze() on an object and its children.
 *
 * @param {Object} obj Object to deep freeze.
 * @returns {Object} Object passed to the function.
 */
function deepFreeze(obj) {
  const pending = [ obj ];
  let current = null;
  while ((current = pending.shift())) {
    Object.freeze(current);
    for (const name of Object.getOwnPropertyNames(current)) {
      const value = current[name];
      if (value && (typeof value === "object")) {
        pending.push(value);
      }
    }
  }
  return obj;
}
module.exports.deepFreeze = deepFreeze;
