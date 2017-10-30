"use strict";

// Regular expression for matching common newline characters
module.exports.newLineRe = /\r\n|\r|\n/;

// Regular expression for matching common front matter (YAML and TOML)
module.exports.frontMatterRe = /^(---|\+\+\+)$[^]*?^\1$(\r\n|\r|\n)/m;

// Regular expression for matching inline disable/enable comments
var inlineCommentRe =
  /<!--\s*markdownlint-(dis|en)able((?:\s+[a-z0-9_-]+)*)\s*-->/ig;
module.exports.inlineCommentRe = inlineCommentRe;

// readFile options for reading with the UTF-8 encoding
module.exports.utf8Encoding = { "encoding": "utf8" };

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

// Replaces the text of all properly-formatted HTML comments with whitespace
// This preserves the line/column information for the rest of the document
// Trailing whitespace is avoided with a '\' character in the last column
// See https://www.w3.org/TR/html5/syntax.html#comments for details
var htmlCommentBegin = "<!--";
var htmlCommentEnd = "-->";
function clearHtmlCommentText(text) {
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
}
module.exports.clearHtmlCommentText = clearHtmlCommentText;

var defaultLineLength = 80;
module.exports.defaultLineLength = defaultLineLength;

function longLineReFunc(options) {
  var lineLength = options.line_length || defaultLineLength;
  return new RegExp("^(.{" + lineLength + "})(.*\\s.*)$");
}
module.exports.longLineReFunc = longLineReFunc;

// Escapes a string for use in a RegExp
function escapeForRegExp(str) {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}
module.exports.escapeForRegExp = escapeForRegExp;

// Returns the indent for a token
function indentFor(token) {
  var line = token.line.replace(/^[\s>]*(> |>)/, "");
  return line.length - line.trimLeft().length;
}
module.exports.indentFor = indentFor;

// Returns the heading style for a heading token
function headingStyleFor(token) {
  if ((token.map[1] - token.map[0]) === 1) {
    if (/#\s*$/.test(token.line)) {
      return "atx_closed";
    }
    return "atx";
  }
  return "setext";
}
module.exports.headingStyleFor = headingStyleFor;

// Returns the unordered list style for a list item token
function unorderedListStyleFor(token) {
  switch (token.line.trimLeft().substr(0, 1)) {
    case "-":
      return "dash";
    case "+":
      return "plus";
    // case "*":
    default:
      return "asterisk";
  }
}
module.exports.unorderedListStyleFor = unorderedListStyleFor;

// Calls the provided function for each matching token
function filterTokens(params, type, callback) {
  (params.tokenLists[type] || []).forEach(callback);
}
module.exports.filterTokens = filterTokens;

// Calls the provided function for each line (with context)
function forEachLine(params, callback) {
  if (!params.forEachLine) {
    var lineMetadata = new Array(params.lines.length);
    var fenceStart = null;
    var inFence = false;
    // Find fenced code by pattern (parser ignores "``` close fence")
    params.lines.forEach(function forLine(line, lineIndex) {
      var metadata = 0;
      var match = /^(`{3,}|~{3,})/.exec(line);
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
    params.forEachLine = lineMetadata;
  }
  // Invoke callback
  params.lines.forEach(function forLine(line, lineIndex) {
    var metadata = params.forEachLine[lineIndex];
    callback(
      line,
      lineIndex,
      !!(metadata & 7),
      (((metadata & 6) >> 1) || 2) - 2,
      !!(metadata & 8));
  });
}
module.exports.forEachLine = forEachLine;

// Calls the provided function for each specified inline child token
function forEachInlineChild(params, type, callback) {
  filterTokens(params, "inline", function forToken(token) {
    token.children.forEach(function forChild(child) {
      if (child.type === type) {
        callback(child, token);
      }
    });
  });
}
module.exports.forEachInlineChild = forEachInlineChild;

// Calls the provided function for each heading's content
function forEachHeading(params, callback) {
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
}
module.exports.forEachHeading = forEachHeading;

// Returns (nested) lists as a flat array (in order)
function flattenLists(params) {
  if (!params.flattenLists) {
    var lists = [];
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
          "items": [],
          "nesting": stack.length - 1,
          "lastLineIndex": -1,
          "insert": lists.length
        };
      } else if ((token.type === "bullet_list_close") ||
                 (token.type === "ordered_list_close")) {
        // Finalize current context and restore previous
        current.lastLineIndex = lastWithMap.map[1];
        lists.splice(current.insert, 0, current);
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
    params.flattenLists = lists;
  }
  return params.flattenLists;
}
module.exports.flattenLists = flattenLists;
