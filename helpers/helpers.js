// @ts-check

"use strict";

// Regular expression for matching common newline characters
// See NEWLINES_RE in markdown-it/lib/rules_core/normalize.js
module.exports.newLineRe = /\r[\n\u0085]?|[\n\u2424\u2028\u0085]/;

// Regular expression for matching common front matter (YAML and TOML)
module.exports.frontMatterRe =
  /((^---$[^]*?^---$)|(^\+\+\+$[^]*?^(\+\+\+|\.\.\.)$))(\r\n|\r|\n|$)/m;

// Regular expression for matching inline disable/enable comments
const inlineCommentRe =
  /<!--\s*markdownlint-(dis|en)able((?:\s+[a-z0-9_-]+)*)\s*-->/ig;
module.exports.inlineCommentRe = inlineCommentRe;

// Regular expressions for range matching
module.exports.atxHeadingSpaceRe = /^#+\s*\S/;
module.exports.bareUrlRe = /(?:http|ftp)s?:\/\/[^\s]*/i;
module.exports.listItemMarkerRe = /^[\s>]*(?:[*+-]|\d+[.)])\s+/;
module.exports.orderedListItemMarkerRe = /^[\s>]*0*(\d+)[.)]/;

// readFile options for reading with the UTF-8 encoding
module.exports.utf8Encoding = { "encoding": "utf8" };

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

// Returns true iff the input line is blank (no content)
// Example: Contains nothing, whitespace, or comments
const blankLineRe = />|(?:<!--.*?-->)/g;
module.exports.isBlankLine = function isBlankLine(line) {
  return !line || !line.trim() || !line.replace(blankLineRe, "").trim();
};

// Returns true iff the sorted array contains the specified element
module.exports.includesSorted = function includesSorted(array, element) {
  let left = 0;
  let right = array.length - 1;
  while (left <= right) {
    /* eslint-disable no-bitwise */
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

// Replaces the text of all properly-formatted HTML comments with whitespace
// This preserves the line/column information for the rest of the document
// Trailing whitespace is avoided with a '\' character in the last column
// See https://www.w3.org/TR/html5/syntax.html#comments for details
const htmlCommentBegin = "<!--";
const htmlCommentEnd = "-->";
module.exports.clearHtmlCommentText = function clearHtmlCommentText(text) {
  let i = 0;
  while ((i = text.indexOf(htmlCommentBegin, i)) !== -1) {
    let j = text.indexOf(htmlCommentEnd, i);
    if (j === -1) {
      j = text.length;
      text += "\\\n";
    }
    const comment = text.slice(i + htmlCommentBegin.length, j);
    if ((comment.length > 0) &&
        (comment[0] !== ">") &&
        (comment[comment.length - 1] !== "-") &&
        !comment.includes("--") &&
        (text.slice(i, j + htmlCommentEnd.length)
          .search(inlineCommentRe) === -1)) {
      const blanks = comment
        .replace(/[^\r\n]/g, " ")
        .replace(/ ([\r\n])/g, "\\$1");
      text = text.slice(0, i + htmlCommentBegin.length) +
        blanks + text.slice(j);
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

// Returns the indent for a token
function indentFor(token) {
  const line = token.line.replace(/^[\s>]*(> |>)/, "");
  return line.length - line.trimLeft().length;
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

// Calls the provided function for each matching token
function filterTokens(params, type, handler) {
  params.tokens.forEach(function forToken(token) {
    if (token.type === type) {
      handler(token);
    }
  });
}
module.exports.filterTokens = filterTokens;

// Get line metadata array
module.exports.getLineMetadata = function getLineMetadata(params) {
  const lineMetadata = params.lines.map(function mapLine(line, index) {
    return [ line, index, false, 0, false ];
  });
  filterTokens(params, "fence", function forToken(token) {
    lineMetadata[token.map[0]][3] = 1;
    lineMetadata[token.map[1] - 1][3] = -1;
    for (let i = token.map[0] + 1; i < token.map[1] - 1; i++) {
      lineMetadata[i][2] = true;
    }
  });
  filterTokens(params, "code_block", function forToken(token) {
    for (let i = token.map[0]; i < token.map[1]; i++) {
      lineMetadata[i][2] = true;
    }
  });
  filterTokens(params, "table_open", function forToken(token) {
    for (let i = token.map[0]; i < token.map[1]; i++) {
      lineMetadata[i][4] = true;
    }
  });
  return lineMetadata;
};

// Calls the provided function for each line (with context)
module.exports.forEachLine = function forEachLine(lineMetadata, handler) {
  lineMetadata.forEach(function forMetadata(metadata) {
    // Parameters: line, lineIndex, inCode, onFence, inTable
    handler(...metadata);
  });
};

// Returns (nested) lists as a flat array (in order)
module.exports.flattenLists = function flattenLists(params) {
  const flattenedLists = [];
  const stack = [];
  let current = null;
  let lastWithMap = { "map": [ 0, 1 ] };
  params.tokens.forEach(function forToken(token) {
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
        "nesting": stack.length - 1,
        "lastLineIndex": -1,
        "insert": flattenedLists.length
      };
    } else if ((token.type === "bullet_list_close") ||
               (token.type === "ordered_list_close")) {
      // Finalize current context and restore previous
      current.lastLineIndex = lastWithMap.map[1];
      flattenedLists.splice(current.insert, 0, current);
      delete current.insert;
      current = stack.pop();
    } else if (token.type === "list_item_open") {
      // Add list item
      current.items.push(token);
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

// Calls the provided function for each inline code span's content
module.exports.forEachInlineCodeSpan =
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
      // Deliberate <= so trailing 0 completes the last span (ex: "text `code`")
      for (; index <= input.length; index++) {
        const char = input[index];
        if (char === "`") {
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
          ((startIndex === -1) || (startColumn === -1))) {
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
  };

// Adds a generic error object via the onError callback
function addError(onError, lineNumber, detail, context, range) {
  onError({
    "lineNumber": lineNumber,
    "detail": detail,
    "context": context,
    "range": range
  });
}
module.exports.addError = addError;

// Adds an error object with details conditionally via the onError callback
module.exports.addErrorDetailIf = function addErrorDetailIf(
  onError, lineNumber, expected, actual, detail, context, range) {
  if (expected !== actual) {
    addError(
      onError,
      lineNumber,
      "Expected: " + expected + "; Actual: " + actual +
        (detail ? "; " + detail : ""),
      context,
      range);
  }
};

// Adds an error object with context via the onError callback
module.exports.addErrorContext =
  function addErrorContext(onError, lineNumber, context, left, right, range) {
    if (context.length <= 30) {
      // Nothing to do
    } else if (left && right) {
      context = context.substr(0, 15) + "..." + context.substr(-15);
    } else if (right) {
      context = "..." + context.substr(-30);
    } else {
      context = context.substr(0, 30) + "...";
    }
    addError(onError, lineNumber, null, context, range);
  };

// Returns a range object for a line by applying a RegExp
module.exports.rangeFromRegExp = function rangeFromRegExp(line, regexp) {
  let range = null;
  const match = line.match(regexp);
  if (match) {
    let column = match.index + 1;
    let length = match[0].length;
    if (match[2]) {
      column += match[1].length;
      length -= match[1].length;
    }
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
      new RegExp(frontMatterTitlePattern || "^\\s*title\\s*[:=]", "i");
    return !ignoreFrontMatter &&
      frontMatterLines.some((line) => frontMatterTitleRe.test(line));
  };
