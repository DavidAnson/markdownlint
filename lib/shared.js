// @ts-check

"use strict";

// Regular expression for matching common newline characters
module.exports.newLineRe = /\r\n|\r|\n/;

// Regular expression for matching common front matter (YAML and TOML)
module.exports.frontMatterRe = /^(---|\+\+\+)$[^]*?^\1$(\r\n|\r|\n)/m;

// Regular expression for matching inline disable/enable comments
var inlineCommentRe =
  /<!--\s*markdownlint-(dis|en)able((?:\s+[a-z0-9_-]+)*)\s*-->/ig;
module.exports.inlineCommentRe = inlineCommentRe;

// Regular expressions for range matching
module.exports.atxHeaderSpaceRe = /^#+\s*\S/;
module.exports.bareUrlRe = /(?:http|ftp)s?:\/\/[^\s]*/i;
module.exports.listItemMarkerRe = /^[\s>]*(?:[*+-]|\d+\.)\s+/;

// readFile options for reading with the UTF-8 encoding
module.exports.utf8Encoding = { "encoding": "utf8" };

// Trims whitespace from the left (start) of a string
function trimLeft(str) {
  return str.replace(/^\s*/, "");
}
module.exports.trimLeft = trimLeft;

// Trims whitespace from the right (end) of a string
module.exports.trimRight = function trimRight(str) {
  return str.replace(/\s*$/, "");
};

// Applies key/value pairs from src to dst, returning dst
function assign(dst, src) {
  Object.keys(src).forEach(function forKey(key) {
    dst[key] = src[key];
  });
  return dst;
}
module.exports.assign = assign;

// Clones the key/value pairs of obj, returning the clone
module.exports.clone = function clone(obj) {
  return assign({}, obj);
};

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

// Replaces the text of all properly-formatted HTML comments with whitespace
// This preserves the line/column information for the rest of the document
// Trailing whitespace is avoided with a '\' character in the last column
// See https://www.w3.org/TR/html5/syntax.html#comments for details
var htmlCommentBegin = "<!--";
var htmlCommentEnd = "-->";
module.exports.clearHtmlCommentText = function clearHtmlCommentText(text) {
  var i = 0;
  while ((i = text.indexOf(htmlCommentBegin, i)) !== -1) {
    var j = text.indexOf(htmlCommentEnd, i);
    if (j === -1) {
      j = text.length;
      text += "\\";
    }
    var comment = text.slice(i + htmlCommentBegin.length, j);
    if ((comment.length > 0) &&
        (comment[0] !== ">") &&
        (comment[comment.length - 1] !== "-") &&
        (comment.indexOf("--") === -1) &&
        (text.slice(i, j + htmlCommentEnd.length)
          .search(inlineCommentRe) === -1)) {
      var blanks = comment
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

// Returns the indent for a token
function indentFor(token) {
  var line = token.line.replace(/^[\s>]*(> |>)/, "");
  return line.length - trimLeft(line).length;
}
module.exports.indentFor = indentFor;

// Returns the heading style for a heading token
module.exports.headingStyleFor = function headingStyleFor(token) {
  if ((token.map[1] - token.map[0]) === 1) {
    if (/#\s*$/.test(token.line)) {
      return "atx_closed";
    }
    return "atx";
  }
  return "setext";
};

// Calls the provided function for each matching token
function filterTokens(params, type, callback) {
  params.tokens.forEach(function forToken(token) {
    if (token.type === type) {
      callback(token);
    }
  });
}
module.exports.filterTokens = filterTokens;

var tokenCache = null;
// Caches line metadata and flattened lists for reuse
function makeTokenCache(params) {
  if (!params) {
    tokenCache = null;
    return;
  }

  // Populate line metadata array
  var lineMetadata = new Array(params.lines.length);
  var fenceStart = null;
  var inFence = false;
  // Find fenced code by pattern (parser ignores "``` close fence")
  params.lines.forEach(function forLine(line, lineIndex) {
    var metadata = 0;
    var match = /^[ ]{0,3}(`{3,}|~{3,})/.exec(line);
    var fence = match && match[1];
    if (fence &&
        (!inFence || (fence.substr(0, fenceStart.length) === fenceStart))) {
      metadata = inFence ? 2 : 6;
      fenceStart = inFence ? null : fence;
      inFence = !inFence;
    } else if (inFence) {
      metadata = 1;
    }
    lineMetadata[lineIndex] = metadata;
  });
  // Find code blocks normally
  filterTokens(params, "code_block", function forToken(token) {
    for (var i = token.map[0]; i < token.map[1]; i++) {
      lineMetadata[i] = 1;
    }
  });
  // Find tables normally
  filterTokens(params, "table_open", function forToken(token) {
    for (var i = token.map[0]; i < token.map[1]; i++) {
      lineMetadata[i] += 8;
    }
  });

  // Flatten lists
  var flattenedLists = [];
  var stack = [];
  var current = null;
  var lastWithMap = { "map": [ 0, 1 ] };
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

  // Cache results
  tokenCache = {
    "params": params,
    "lineMetadata": lineMetadata,
    "flattenedLists": flattenedLists
  };
}
module.exports.makeTokenCache = makeTokenCache;

// Calls the provided function for each line (with context)
module.exports.forEachLine = function forEachLine(callback) {
  // Invoke callback
  tokenCache.params.lines.forEach(function forLine(line, lineIndex) {
    var metadata = tokenCache.lineMetadata[lineIndex];
    callback(
      line,
      lineIndex,
      !!(metadata & 7),
      (((metadata & 6) >> 1) || 2) - 2,
      !!(metadata & 8));
  });
};

// Calls the provided function for each specified inline child token
module.exports.forEachInlineChild =
function forEachInlineChild(params, type, callback) {
  filterTokens(params, "inline", function forToken(token) {
    token.children.forEach(function forChild(child) {
      if (child.type === type) {
        callback(child);
      }
    });
  });
};

// Calls the provided function for each heading's content
module.exports.forEachHeading = function forEachHeading(params, callback) {
  var heading = null;
  params.tokens.forEach(function forToken(token) {
    if (token.type === "heading_open") {
      heading = token;
    } else if (token.type === "heading_close") {
      heading = null;
    } else if ((token.type === "inline") && heading) {
      callback(heading, token.content);
    }
  });
};

// Returns (nested) lists as a flat array (in order)
module.exports.flattenLists = function flattenLists() {
  return tokenCache.flattenedLists;
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
  onError, lineNumber, expected, actual, detail, range) {
  if (expected !== actual) {
    addError(
      onError,
      lineNumber,
      "Expected: " + expected + "; Actual: " + actual +
        (detail ? "; " + detail : ""),
      null,
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
  var range = null;
  var match = line.match(regexp);
  if (match) {
    var column = match.index + 1;
    var length = match[0].length;
    if (match[2]) {
      column += match[1].length;
      length -= match[1].length;
    }
    range = [ column, length ];
  }
  return range;
};
