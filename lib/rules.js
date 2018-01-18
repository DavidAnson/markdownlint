// @ts-check

"use strict";

var shared = require("./shared");

// Range regular expressions
var atxClosedHeaderNoSpaceRe = /(?:^#+[^#\s])|(?:[^#\s]#+\s*$)/;
var atxClosedHeaderSpaceRe = /(?:^#+\s\s+?\S)|(?:\S\s\s+?#+\s*$)/;
var atxHeaderSpaceRe = /^#+\s*\S/;
var bareUrlRe = /(?:http|ftp)s?:\/\/[^\s]*/i;
var dollarCommandRe = /^(\s*)(\$\s)/;
var emptyLinkRe = /\[[^\]]*](?:\((?:#?|(?:<>))\))/;
var htmlRe = /<[^>]*>/;
var listItemMarkerRe = /^[\s>]*(?:[*+-]|\d+\.)\s+/;
var listItemMarkerInterruptsRe = /^[\s>]*(?:[*+-]|1\.)\s+/;
var reversedLinkRe = /\([^)]+\)\[[^\]^][^\]]*]/;
var spaceAfterBlockQuote = /^\s*(?:>\s+)+\S/;
var spaceBeforeHeaderRe = /^\s+\S/;
var spaceInsideLinkRe = /\[(?:\s+(?:[^\]]*?)\s*|(?:[^\]]*?)\s+)](?=\(\S*\))/;
var tabRe = /\t+/;
var trailingPunctuationRe = /.$/;
var trailingSpaceRe = /\s+$/;
var defaultLineLength = 80;

// Escapes a string for use in a RegExp
function escapeForRegExp(str) {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

// Returns the indent for a token
function indentFor(token) {
  var line = token.line.replace(/^[\s>]*(> |>)/, "");
  return line.length - shared.trimLeft(line).length;
}

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

// Returns the unordered list style for a list item token
function unorderedListStyleFor(token) {
  switch (shared.trimLeft(token.line).substr(0, 1)) {
    case "-":
      return "dash";
    case "+":
      return "plus";
    // case "*":
    default:
      return "asterisk";
  }
}

// Calls the provided function for each matching token
function filterTokens(params, type, callback) {
  (params.tokenLists[type] || []).forEach(callback);
}

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

// Calls the provided function for each specified inline child token
function forEachInlineChild(params, type, callback) {
  filterTokens(params, "inline", function forToken(token) {
    token.children.forEach(function forChild(child) {
      if (child.type === type) {
        callback(child);
      }
    });
  });
}

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

// Adds a generic error object via the onError callback
function addError(onError, lineNumber, detail, context, range) {
  onError({
    "lineNumber": lineNumber,
    "detail": detail,
    "context": context,
    "range": range
  });
}

// Adds an error object with details conditionally via the onError callback
function addErrorDetailIf(
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
}

// Adds an error object with context via the onError callback
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
}

// Returns a range object for a line by applying a RegExp
function rangeFromRegExp(line, regexp) {
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
}

module.exports = [
  {
    "names": [ "MD001", "header-increment" ],
    "desc": "Header levels should only increment by one level at a time",
    "tags": [ "headers" ],
    "func": function MD001(params, onError) {
      var prevLevel = 0;
      filterTokens(params, "heading_open", function forToken(token) {
        var level = parseInt(token.tag.slice(1), 10);
        if (prevLevel && (level > prevLevel)) {
          addErrorDetailIf(onError, token.lineNumber,
            "h" + (prevLevel + 1), "h" + level);
        }
        prevLevel = level;
      });
    }
  },

  {
    "names": [ "MD002", "first-header-h1" ],
    "desc": "First header should be a top level header",
    "tags": [ "headers" ],
    "func": function MD002(params, onError) {
      var level = params.config.level || 1;
      var tag = "h" + level;
      params.tokens.every(function forToken(token) {
        if (token.type === "heading_open") {
          addErrorDetailIf(onError, token.lineNumber, tag, token.tag);
          return false;
        }
        return true;
      });
    }
  },

  {
    "names": [ "MD003", "header-style" ],
    "desc": "Header style",
    "tags": [ "headers" ],
    "func": function MD003(params, onError) {
      var style = params.config.style || "consistent";
      filterTokens(params, "heading_open", function forToken(token) {
        var styleForToken = headingStyleFor(token);
        if (style === "consistent") {
          style = styleForToken;
        }
        if (styleForToken !== style) {
          var h12 = /h[12]/.test(token.tag);
          var setextWithAtx =
            (style === "setext_with_atx") &&
             ((h12 && (styleForToken === "setext")) ||
              (!h12 && (styleForToken === "atx")));
          var setextWithAtxClosed =
            (style === "setext_with_atx_closed") &&
             ((h12 && (styleForToken === "setext")) ||
              (!h12 && (styleForToken === "atx_closed")));
          if (!setextWithAtx && !setextWithAtxClosed) {
            var expected = style;
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
  },

  {
    "names": [ "MD004", "ul-style" ],
    "desc": "Unordered list style",
    "tags": [ "bullet", "ul" ],
    "func": function MD004(params, onError) {
      var style = params.config.style || "consistent";
      var expectedStyle = style;
      var nestingStyles = [];
      flattenLists(params).forEach(function forList(list) {
        if (list.unordered) {
          if (expectedStyle === "consistent") {
            expectedStyle = unorderedListStyleFor(list.items[0]);
          }
          list.items.forEach(function forItem(item) {
            var itemStyle = unorderedListStyleFor(item);
            if (style === "sublist") {
              var nesting = list.nesting;
              if (!nestingStyles[nesting] &&
                (itemStyle !== nestingStyles[nesting - 1])) {
                nestingStyles[nesting] = itemStyle;
              } else {
                addErrorDetailIf(onError, item.lineNumber,
                  nestingStyles[nesting], itemStyle, null,
                  rangeFromRegExp(item.line, listItemMarkerRe));
              }
            } else {
              addErrorDetailIf(onError, item.lineNumber,
                expectedStyle, itemStyle, null,
                rangeFromRegExp(item.line, listItemMarkerRe));
            }
          });
        }
      });
    }
  },

  {
    "names": [ "MD005", "list-indent" ],
    "desc": "Inconsistent indentation for list items at the same level",
    "tags": [ "bullet", "ul", "indentation" ],
    "func": function MD005(params, onError) {
      flattenLists(params).forEach(function forList(list) {
        var indent = indentFor(list.items[0]);
        list.items.forEach(function forItem(item) {
          addErrorDetailIf(onError, item.lineNumber, indent, indentFor(item),
            null, rangeFromRegExp(item.line, listItemMarkerRe));
        });
      });
    }
  },

  {
    "names": [ "MD006", "ul-start-left" ],
    "desc": "Consider starting bulleted lists at the beginning of the line",
    "tags": [ "bullet", "ul", "indentation" ],
    "func": function MD006(params, onError) {
      flattenLists(params).forEach(function forList(list) {
        if (list.unordered && !list.nesting) {
          addErrorDetailIf(onError, list.open.lineNumber,
            0, indentFor(list.open), null,
            rangeFromRegExp(list.open.line, listItemMarkerRe));
        }
      });
    }
  },

  {
    "names": [ "MD007", "ul-indent" ],
    "desc": "Unordered list indentation",
    "tags": [ "bullet", "ul", "indentation" ],
    "func": function MD007(params, onError) {
      var optionsIndent = params.config.indent || 2;
      var prevIndent = 0;
      flattenLists(params).forEach(function forList(list) {
        if (list.unordered && list.parentsUnordered) {
          var indent = indentFor(list.open);
          if (indent > prevIndent) {
            addErrorDetailIf(onError, list.open.lineNumber,
              prevIndent + optionsIndent, indent, null,
              rangeFromRegExp(list.open.line, listItemMarkerRe));
          }
          prevIndent = indent;
        }
      });
    }
  },

  {
    "names": [ "MD009", "no-trailing-spaces" ],
    "desc": "Trailing spaces",
    "tags": [ "whitespace" ],
    "func": function MD009(params, onError) {
      var brSpaces = params.config.br_spaces || 0;
      var listItemEmptyLines = params.config.list_item_empty_lines;
      var allowListItemEmptyLines =
        (listItemEmptyLines === undefined) ? false : !!listItemEmptyLines;
      var listItemLineNumbers = [];
      if (allowListItemEmptyLines) {
        filterTokens(params, "list_item_open", function forToken(token) {
          for (var i = token.map[0]; i < token.map[1]; i++) {
            listItemLineNumbers.push(i + 1);
          }
        });
      }
      forEachLine(params, function forLine(line, lineIndex) {
        var lineNumber = lineIndex + 1;
        if (trailingSpaceRe.test(line) &&
          (listItemLineNumbers.indexOf(lineNumber) === -1)) {
          var expected = (brSpaces < 2) ? 0 : brSpaces;
          addErrorDetailIf(onError, lineNumber,
            expected, line.length - shared.trimRight(line).length, null,
            rangeFromRegExp(line, trailingSpaceRe));
        }
      });
    }
  },

  {
    "names": [ "MD010", "no-hard-tabs" ],
    "desc": "Hard tabs",
    "tags": [ "whitespace", "hard_tab" ],
    "func": function MD010(params, onError) {
      var codeBlocks = params.config.code_blocks;
      var includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
      forEachLine(params, function forLine(line, lineIndex, inCode) {
        if (tabRe.test(line) && (!inCode || includeCodeBlocks)) {
          addError(onError, lineIndex + 1,
            "Column: " + (line.indexOf("\t") + 1), null,
            rangeFromRegExp(line, tabRe));
        }
      });
    }
  },

  {
    "names": [ "MD011", "no-reversed-links" ],
    "desc": "Reversed link syntax",
    "tags": [ "links" ],
    "func": function MD011(params, onError) {
      forEachInlineChild(params, "text", function forToken(token) {
        var match = reversedLinkRe.exec(token.content);
        if (match) {
          addError(onError, token.lineNumber, match[0], null,
            rangeFromRegExp(token.line, reversedLinkRe));
        }
      });
    }
  },

  {
    "names": [ "MD012", "no-multiple-blanks" ],
    "desc": "Multiple consecutive blank lines",
    "tags": [ "whitespace", "blank_lines" ],
    "func": function MD012(params, onError) {
      var maximum = params.config.maximum || 1;
      var count = 0;
      forEachLine(params, function forLine(line, lineIndex, inCode) {
        count = (inCode || line.trim().length) ? 0 : count + 1;
        if (maximum < count) {
          addErrorDetailIf(onError, lineIndex + 1, maximum, count);
        }
      });
    }
  },

  {
    "names": [ "MD013", "line-length" ],
    "desc": "Line length",
    "tags": [ "line_length" ],
    "func": function MD013(params, onError) {
      var lineLength = params.config.line_length || defaultLineLength;
      var codeBlocks = params.config.code_blocks;
      var includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
      var tables = params.config.tables;
      var includeTables = (tables === undefined) ? true : !!tables;
      var headers = params.config.headers;
      var includeHeaders = (headers === undefined) ? true : !!headers;
      var headerLineNumbers = [];
      if (!includeHeaders) {
        forEachHeading(params, function forHeading(heading) {
          headerLineNumbers.push(heading.lineNumber);
        });
      }
      var tokenTypeMap = {
        "em_open": "e",
        "em_close": "E",
        "link_open": "l",
        "link_close": "L",
        "strong_open": "s",
        "strong_close": "S",
        "text": "T"
      };
      var linkOnlyLineNumbers = [];
      filterTokens(params, "inline", function forToken(token) {
        var childTokenTypes = "";
        token.children.forEach(function forChild(child) {
          if (child.type !== "text" || child.content !== "") {
            childTokenTypes += tokenTypeMap[child.type] || "x";
          }
        });
        if (/^[es]*lT?L[ES]*$/.test(childTokenTypes)) {
          linkOnlyLineNumbers.push(token.lineNumber);
        }
      });
      var longLineRe = new RegExp("^(.{" + lineLength + "})(.*\\s.*)$");
      var labelRe = /^\s*\[.*[^\\]]:/;
      forEachLine(params,
        function forLine(line, lineIndex, inCode, onFence, inTable) {
          var lineNumber = lineIndex + 1;
          if ((includeCodeBlocks || !inCode) &&
              (includeTables || !inTable) &&
              (includeHeaders || (headerLineNumbers.indexOf(lineNumber)) < 0) &&
              (linkOnlyLineNumbers.indexOf(lineNumber) < 0) &&
              longLineRe.test(line) &&
              !labelRe.test(line)) {
            addErrorDetailIf(onError, lineNumber, lineLength, line.length, null,
              rangeFromRegExp(line, longLineRe));
          }
        });
    }
  },

  {
    "names": [ "MD014", "commands-show-output" ],
    "desc": "Dollar signs used before commands without showing output",
    "tags": [ "code" ],
    "func": function MD014(params, onError) {
      [ "code_block", "fence" ].forEach(function forType(type) {
        filterTokens(params, type, function forToken(token) {
          var allBlank = true;
          if (token.content && token.content.split(shared.newLineRe)
            .every(function forLine(line) {
              return !line || (allBlank = false) || dollarCommandRe.test(line);
            }) && !allBlank) {
            addErrorContext(onError, token.lineNumber,
              token.content.split(shared.newLineRe)[0].trim(), null, null,
              rangeFromRegExp(token.line, dollarCommandRe));
          }
        });
      });
    }
  },

  {
    "names": [ "MD018", "no-missing-space-atx" ],
    "desc": "No space after hash on atx style header",
    "tags": [ "headers", "atx", "spaces" ],
    "func": function MD018(params, onError) {
      forEachLine(params, function forLine(line, lineIndex, inCode) {
        if (!inCode && /^#+[^#\s]/.test(line) && !/#$/.test(line)) {
          addErrorContext(onError, lineIndex + 1, line.trim(), null, null,
            rangeFromRegExp(line, atxHeaderSpaceRe));
        }
      });
    }
  },

  {
    "names": [ "MD019", "no-multiple-space-atx" ],
    "desc": "Multiple spaces after hash on atx style header",
    "tags": [ "headers", "atx", "spaces" ],
    "func": function MD019(params, onError) {
      filterTokens(params, "heading_open", function forToken(token) {
        if ((headingStyleFor(token) === "atx") &&
            /^#+\s\s/.test(token.line)) {
          addErrorContext(onError, token.lineNumber, token.line.trim(),
            null, null, rangeFromRegExp(token.line, atxHeaderSpaceRe));
        }
      });
    }
  },

  {
    "names": [ "MD020", "no-missing-space-closed-atx" ],
    "desc": "No space inside hashes on closed atx style header",
    "tags": [ "headers", "atx_closed", "spaces" ],
    "func": function MD020(params, onError) {
      forEachLine(params, function forLine(line, lineIndex, inCode) {
        if (!inCode && /^#+[^#]*[^\\]#+$/.test(line)) {
          var left = /^#+[^#\s]/.test(line);
          var right = /[^#\s]#+$/.test(line);
          if (left || right) {
            addErrorContext(onError, lineIndex + 1, line.trim(), left, right,
              rangeFromRegExp(line, atxClosedHeaderNoSpaceRe));
          }
        }
      });
    }
  },

  {
    "names": [ "MD021", "no-multiple-space-closed-atx" ],
    "desc": "Multiple spaces inside hashes on closed atx style header",
    "tags": [ "headers", "atx_closed", "spaces" ],
    "func": function MD021(params, onError) {
      filterTokens(params, "heading_open", function forToken(token) {
        if (headingStyleFor(token) === "atx_closed") {
          var left = /^#+\s\s/.test(token.line);
          var right = /\s\s#+$/.test(token.line);
          if (left || right) {
            addErrorContext(onError, token.lineNumber, token.line.trim(),
              left, right, rangeFromRegExp(token.line, atxClosedHeaderSpaceRe));
          }
        }
      });
    }
  },

  {
    "names": [ "MD022", "blanks-around-headers" ],
    "desc": "Headers should be surrounded by blank lines",
    "tags": [ "headers", "blank_lines" ],
    "func": function MD022(params, onError) {
      var prevHeadingLineNumber = 0;
      var prevMaxLineIndex = -1;
      var needBlankLine = false;
      params.tokens.forEach(function forToken(token) {
        if (token.type === "heading_open") {
          if ((token.map[0] - prevMaxLineIndex) === 0) {
            addErrorContext(onError, token.lineNumber, token.line.trim());
          }
        } else if (token.type === "heading_close") {
          needBlankLine = true;
        }
        if (token.map) {
          if (needBlankLine) {
            if ((token.map[0] - prevMaxLineIndex) === 0) {
              addErrorContext(onError, prevHeadingLineNumber,
                params.lines[prevHeadingLineNumber - 1].trim());
            }
            needBlankLine = false;
          }
          prevMaxLineIndex = Math.max(prevMaxLineIndex, token.map[1]);
        }
        if (token.type === "heading_open") {
          prevHeadingLineNumber = token.lineNumber;
        }
      });
    }
  },

  {
    "names": [ "MD023", "header-start-left" ],
    "desc": "Headers must start at the beginning of the line",
    "tags": [ "headers", "spaces" ],
    "func": function MD023(params, onError) {
      filterTokens(params, "heading_open", function forToken(token) {
        if (spaceBeforeHeaderRe.test(token.line)) {
          addErrorContext(onError, token.lineNumber, token.line, null, null,
            rangeFromRegExp(token.line, spaceBeforeHeaderRe));
        }
      });
    }
  },

  {
    "names": [ "MD024", "no-duplicate-header" ],
    "desc": "Multiple headers with the same content",
    "tags": [ "headers" ],
    "func": function MD024(params, onError) {
      var knownContent = [];
      forEachHeading(params, function forHeading(heading, content) {
        if (knownContent.indexOf(content) === -1) {
          knownContent.push(content);
        } else {
          addErrorContext(onError, heading.lineNumber, heading.line.trim());
        }
      });
    }
  },

  {
    "names": [ "MD025", "single-h1" ],
    "desc": "Multiple top level headers in the same document",
    "tags": [ "headers" ],
    "func": function MD025(params, onError) {
      var level = params.config.level || 1;
      var tag = "h" + level;
      var hasTopLevelHeading = false;
      filterTokens(params, "heading_open", function forToken(token) {
        if (token.tag === tag) {
          if (hasTopLevelHeading) {
            addErrorContext(onError, token.lineNumber, token.line.trim());
          } else if (token.lineNumber === 1) {
            hasTopLevelHeading = true;
          }
        }
      });
    }
  },

  {
    "names": [ "MD026", "no-trailing-punctuation" ],
    "desc": "Trailing punctuation in header",
    "tags": [ "headers" ],
    "func": function MD026(params, onError) {
      var punctuation = params.config.punctuation || ".,;:!?";
      var re = new RegExp("[" + punctuation + "]$");
      forEachHeading(params, function forHeading(heading, content) {
        var match = re.exec(content);
        if (match) {
          addError(onError, heading.lineNumber,
            "Punctuation: '" + match[0] + "'", null,
            rangeFromRegExp(heading.line, trailingPunctuationRe));
        }
      });
    }
  },

  {
    "names": [ "MD027", "no-multiple-space-blockquote" ],
    "desc": "Multiple spaces after blockquote symbol",
    "tags": [ "blockquote", "whitespace", "indentation" ],
    "func": function MD027(params, onError) {
      var blockquoteNesting = 0;
      var listItemNesting = 0;
      params.tokens.forEach(function forToken(token) {
        if (token.type === "blockquote_open") {
          blockquoteNesting++;
        } else if (token.type === "blockquote_close") {
          blockquoteNesting--;
        } else if (token.type === "list_item_open") {
          listItemNesting++;
        } else if (token.type === "list_item_close") {
          listItemNesting--;
        } else if ((token.type === "inline") && (blockquoteNesting > 0)) {
          var multipleSpaces = listItemNesting ?
            /^(\s*>)+\s\s+>/.test(token.line) :
            /^(\s*>)+\s\s/.test(token.line);
          if (multipleSpaces) {
            addErrorContext(onError, token.lineNumber, token.line, null, null,
              rangeFromRegExp(token.line, spaceAfterBlockQuote));
          }
          token.content.split(shared.newLineRe)
            .forEach(function forLine(line, offset) {
              if (/^\s/.test(line)) {
                addErrorContext(onError, token.lineNumber + offset,
                  "> " + line, null, null,
                  rangeFromRegExp(line, spaceAfterBlockQuote));
              }
            });
        }
      });
    }
  },

  {
    "names": [ "MD028", "no-blanks-blockquote" ],
    "desc": "Blank line inside blockquote",
    "tags": [ "blockquote", "whitespace" ],
    "func": function MD028(params, onError) {
      var prevToken = {};
      params.tokens.forEach(function forToken(token) {
        if ((token.type === "blockquote_open") &&
            (prevToken.type === "blockquote_close")) {
          addError(onError, token.lineNumber - 1);
        }
        prevToken = token;
      });
    }
  },

  {
    "names": [ "MD029", "ol-prefix" ],
    "desc": "Ordered list item prefix",
    "tags": [ "ol" ],
    "func": function MD029(params, onError) {
      var style = params.config.style || "one_or_ordered";
      var numberRe = /^[\s>]*([^.)]*)[.)]/;
      flattenLists(params).forEach(function forList(list) {
        if (!list.unordered) {
          var listStyle = style;
          if (listStyle === "one_or_ordered") {
            var second = (list.items.length > 1) &&
              numberRe.exec(list.items[1].line);
            listStyle = (second && (second[1] !== "1")) ? "ordered" : "one";
          }
          var number = 1;
          list.items.forEach(function forItem(item) {
            var match = numberRe.exec(item.line);
            addErrorDetailIf(onError, item.lineNumber,
              String(number), !match || match[1],
              "Style: " + (listStyle === "one" ? "1/1/1" : "1/2/3"),
              rangeFromRegExp(item.line, listItemMarkerRe));
            if (listStyle === "ordered") {
              number++;
            }
          });
        }
      });
    }
  },

  {
    "names": [ "MD030", "list-marker-space" ],
    "desc": "Spaces after list markers",
    "tags": [ "ol", "ul", "whitespace" ],
    "func": function MD030(params, onError) {
      var ulSingle = params.config.ul_single || 1;
      var olSingle = params.config.ol_single || 1;
      var ulMulti = params.config.ul_multi || 1;
      var olMulti = params.config.ol_multi || 1;
      flattenLists(params).forEach(function forList(list) {
        var lineCount = list.lastLineIndex - list.open.map[0];
        var allSingle = lineCount === list.items.length;
        var expectedSpaces = list.unordered ?
          (allSingle ? ulSingle : ulMulti) :
          (allSingle ? olSingle : olMulti);
        list.items.forEach(function forItem(item) {
          var match = /^[\s>]*\S+(\s+)/.exec(item.line);
          addErrorDetailIf(onError, item.lineNumber,
            expectedSpaces, (match ? match[1].length : 0), null,
            rangeFromRegExp(item.line, listItemMarkerRe));
        });
      });
    }
  },

  {
    "names": [ "MD031", "blanks-around-fences" ],
    "desc": "Fenced code blocks should be surrounded by blank lines",
    "tags": [ "code", "blank_lines" ],
    "func": function MD031(params, onError) {
      var lines = params.lines;
      forEachLine(params, function forLine(line, i, inCode, onFence) {
        if (((onFence > 0) && (i - 1 >= 0) && lines[i - 1].length) ||
            ((onFence < 0) && (i + 1 < lines.length) && lines[i + 1].length)) {
          addErrorContext(onError, i + 1, lines[i].trim());
        }
      });
    }
  },

  {
    "names": [ "MD032", "blanks-around-lists" ],
    "desc": "Lists should be surrounded by blank lines",
    "tags": [ "bullet", "ul", "ol", "blank_lines" ],
    "func": function MD032(params, onError) {
      var blankOrListRe = /^[\s>]*($|\s)/;
      var inList = false;
      var prevLine = "";
      forEachLine(params, function forLine(line, lineIndex, inCode, onFence) {
        if (!inCode || onFence) {
          var lineTrim = line.trim();
          var listMarker = listItemMarkerRe.test(lineTrim);
          if (listMarker && !inList && !blankOrListRe.test(prevLine)) {
            // Check whether this list prefix can interrupt a paragraph
            if (listItemMarkerInterruptsRe.test(lineTrim)) {
              addErrorContext(onError, lineIndex + 1, lineTrim);
            } else {
              listMarker = false;
            }
          } else if (!listMarker && inList && !blankOrListRe.test(line)) {
            addErrorContext(onError, lineIndex, lineTrim);
          }
          inList = listMarker;
        }
        prevLine = line;
      });
    }
  },

  {
    "names": [ "MD033", "no-inline-html" ],
    "desc": "Inline HTML",
    "tags": [ "html" ],
    "func": function MD033(params, onError) {
      var allowedElements = (params.config.allowed_elements || [])
        .map(function forElement(element) {
          return element.toLowerCase();
        });
      function forToken(token) {
        token.content.split(shared.newLineRe)
          .forEach(function forLine(line, offset) {
            var allowed = (line.match(/<[^/\s>!]*/g) || [])
              .filter(function forElement(element) {
                return element.length > 1;
              })
              .map(function forElement(element) {
                return element.slice(1).toLowerCase();
              })
              .filter(function forElement(element) {
                return allowedElements.indexOf(element) === -1;
              });
            if (allowed.length) {
              addError(onError, token.lineNumber + offset,
                "Element: " + allowed[0], null,
                rangeFromRegExp(token.line, htmlRe));
            }
          });
      }
      filterTokens(params, "html_block", forToken);
      forEachInlineChild(params, "html_inline", forToken);
    }
  },

  {
    "names": [ "MD034", "no-bare-urls" ],
    "desc": "Bare URL used",
    "tags": [ "links", "url" ],
    "func": function MD034(params, onError) {
      filterTokens(params, "inline", function forToken(token) {
        var inLink = false;
        token.children.forEach(function forChild(child) {
          var match = null;
          if (child.type === "link_open") {
            inLink = true;
          } else if (child.type === "link_close") {
            inLink = false;
          } else if ((child.type === "text") &&
                     !inLink &&
                     (match = bareUrlRe.exec(child.content))) {
            addErrorContext(onError, child.lineNumber, match[0], null, null,
              rangeFromRegExp(child.line, bareUrlRe));
          }
        });
      });
    }
  },

  {
    "names": [ "MD035", "hr-style" ],
    "desc": "Horizontal rule style",
    "tags": [ "hr" ],
    "func": function MD035(params, onError) {
      var style = params.config.style || "consistent";
      filterTokens(params, "hr", function forToken(token) {
        var lineTrim = token.line.trim();
        if (style === "consistent") {
          style = lineTrim;
        }
        addErrorDetailIf(onError, token.lineNumber, style, lineTrim);
      });
    }
  },

  {
    "names": [ "MD036", "no-emphasis-as-header" ],
    "desc": "Emphasis used instead of a header",
    "tags": [ "headers", "emphasis" ],
    "func": function MD036(params, onError) {
      var punctuation = params.config.punctuation || ".,;:!?";
      var re = new RegExp("[" + punctuation + "]$");
      function base(token) {
        if (token.type === "paragraph_open") {
          return function inParagraph(t) {
            // Always paragraph_open/inline/paragraph_close,
            // omit (t.type === "inline")
            var children = t.children.filter(function notEmptyText(child) {
              return (child.type !== "text") || (child.content !== "");
            });
            if ((children.length === 3) &&
                ((children[0].type === "strong_open") ||
                 (children[0].type === "em_open")) &&
                (children[1].type === "text") &&
                !re.test(children[1].content)) {
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
      params.tokens.forEach(function forToken(token) {
        state = state(token);
      });
    }
  },

  {
    "names": [ "MD037", "no-space-in-emphasis" ],
    "desc": "Spaces inside emphasis markers",
    "tags": [ "whitespace", "emphasis" ],
    "func": function MD037(params, onError) {
      forEachInlineChild(params, "text", function forToken(token) {
        var left = true;
        var match = /\s(\*\*?|__?)\s.+\1/.exec(token.content);
        if (!match) {
          left = false;
          match = /(\*\*?|__?).+\s\1\s/.exec(token.content);
        }
        if (match) {
          var text = match[0].trim();
          var line = params.lines[token.lineNumber - 1];
          var column = line.indexOf(text) + 1;
          var length = text.length;
          addErrorContext(onError, token.lineNumber,
            text, left, !left, [ column, length ]);
        }
      });
    }
  },

  {
    "names": [ "MD038", "no-space-in-code" ],
    "desc": "Spaces inside code span elements",
    "tags": [ "whitespace", "code" ],
    "func": function MD038(params, onError) {
      var inlineCodeSpansRe = /(?:^|[^\\])((`+)((?:.*?[^`])|)\2(?!`))/g;
      forEachInlineChild(params, "code_inline",
        function forToken(token) {
          var line = params.lines[token.lineNumber - 1];
          var match = null;
          while ((match = inlineCodeSpansRe.exec(line)) !== null) {
            var inlineCodeSpan = match[1];
            var content = match[3];
            var length = inlineCodeSpan.length;
            var column = match.index + 1 + (match[0].length - length);
            var range = [ column, length ];
            if (/^\s([^`]|$)/.test(content)) {
              addErrorContext(onError, token.lineNumber,
                inlineCodeSpan, true, false, range);
            } else if (/[^`]\s$/.test(content)) {
              addErrorContext(onError, token.lineNumber,
                inlineCodeSpan, false, true, range);
            }
          }
        });
    }
  },

  {
    "names": [ "MD039", "no-space-in-links" ],
    "desc": "Spaces inside link text",
    "tags": [ "whitespace", "links" ],
    "func": function MD039(params, onError) {
      filterTokens(params, "inline", function forToken(token) {
        var inLink = false;
        var linkText = "";
        token.children.forEach(function forChild(child) {
          if (child.type === "link_open") {
            inLink = true;
            linkText = "";
          } else if (child.type === "link_close") {
            inLink = false;
            var left = shared.trimLeft(linkText).length !== linkText.length;
            var right = shared.trimRight(linkText).length !== linkText.length;
            if (left || right) {
              addErrorContext(onError, token.lineNumber,
                "[" + linkText + "]", left, right,
                rangeFromRegExp(token.line, spaceInsideLinkRe));
            }
          } else if (inLink) {
            linkText += child.content;
          }
        });
      });
    }
  },

  {
    "names": [ "MD040", "fenced-code-language" ],
    "desc": "Fenced code blocks should have a language specified",
    "tags": [ "code", "language" ],
    "func": function MD040(params, onError) {
      filterTokens(params, "fence", function forToken(token) {
        if (!token.info.trim()) {
          addErrorContext(onError, token.lineNumber, token.line);
        }
      });
    }
  },

  {
    "names": [ "MD041", "first-line-h1" ],
    "desc": "First line in file should be a top level header",
    "tags": [ "headers" ],
    "func": function MD041(params, onError) {
      var level = params.config.level || 1;
      var frontMatterTitle = params.config.front_matter_title;
      var tag = "h" + level;
      var frontMatterTitleRe =
        new RegExp(frontMatterTitle || "^\\s*title\\s*[:=]", "i");
      params.tokens.every(function forToken(token, index) {
        if (token.type === "heading_open") {
          if (!((token.lineNumber === 1) || (index > 0)) ||
              (token.tag !== tag)) {
            addErrorContext(onError, token.lineNumber, token.line);
          }
          return false;
        } else if (token.type === "html_block") {
          return true;
        }
        if (((frontMatterTitle !== undefined) && !frontMatterTitle) ||
          !params.frontMatterLines.some(function forLine(line) {
            return frontMatterTitleRe.test(line);
          })) {
          addErrorContext(onError, token.lineNumber, token.line);
        }
        return false;
      });
    }
  },

  {
    "names": [ "MD042", "no-empty-links" ],
    "desc": "No empty links",
    "tags": [ "links" ],
    "func": function MD042(params, onError) {
      filterTokens(params, "inline", function forToken(token) {
        var inLink = false;
        var linkText = "";
        var emptyLink = false;
        token.children.forEach(function forChild(child) {
          if (child.type === "link_open") {
            inLink = true;
            linkText = "";
            child.attrs.forEach(function forAttr(attr) {
              if (attr[0] === "href" && (!attr[1] || (attr[1] === "#"))) {
                emptyLink = true;
              }
            });
          } else if (child.type === "link_close") {
            inLink = false;
            if (emptyLink) {
              addErrorContext(onError, child.lineNumber,
                "[" + linkText + "]()", null, null,
                rangeFromRegExp(child.line, emptyLinkRe));
            }
          } else if (inLink) {
            linkText += child.content;
          }
        });
      });
    }
  },

  {
    "names": [ "MD043", "required-headers" ],
    "desc": "Required header structure",
    "tags": [ "headers" ],
    "func": function MD043(params, onError) {
      var requiredHeaders = params.config.headers;
      if (requiredHeaders) {
        var levels = {};
        [ 1, 2, 3, 4, 5, 6 ].forEach(function forLevel(level) {
          levels["h" + level] = "######".substr(-level);
        });
        var i = 0;
        var optional = false;
        var errorCount = 0;
        forEachHeading(params, function forHeading(heading, content) {
          if (!errorCount) {
            var actual = levels[heading.tag] + " " + content;
            var expected = requiredHeaders[i++] || "[None]";
            if (expected === "*") {
              optional = true;
            } else if (expected.toLowerCase() === actual.toLowerCase()) {
              optional = false;
            } else if (optional) {
              i--;
            } else {
              addErrorDetailIf(onError, heading.lineNumber, expected, actual);
              errorCount++;
            }
          }
        });
        if ((i < requiredHeaders.length) && !errorCount) {
          addErrorContext(onError, params.lines.length, requiredHeaders[i]);
        }
      }
    }
  },

  {
    "names": [ "MD044", "proper-names" ],
    "desc": "Proper names should have the correct capitalization",
    "tags": [ "spelling" ],
    "func": function MD044(params, onError) {
      var names = params.config.names || [];
      var codeBlocks = params.config.code_blocks;
      var includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
      names.forEach(function forName(name) {
        var escapedName = escapeForRegExp(name);
        var namePattern = "\\S*\\b(" + escapedName + ")\\b\\S*";
        var anyNameRe = new RegExp(namePattern, "gi");
        function forToken(token) {
          var fenceOffset = (token.type === "fence") ? 1 : 0;
          token.content.split(shared.newLineRe)
            .forEach(function forLine(line, index) {
              var match = null;
              while ((match = anyNameRe.exec(line)) !== null) {
                var fullMatch = match[0];
                if (!bareUrlRe.test(fullMatch)) {
                  var wordMatch = fullMatch
                    .replace(/^\W*/, "").replace(/\W*$/, "");
                  if (names.indexOf(wordMatch) === -1) {
                    var lineNumber = token.lineNumber + index + fenceOffset;
                    var range = [ match.index + 1, wordMatch.length ];
                    addErrorDetailIf(onError, lineNumber,
                      name, match[1], null, range);
                  }
                }
              }
            });
        }
        forEachInlineChild(params, "text", forToken);
        if (includeCodeBlocks) {
          forEachInlineChild(params, "code_inline", forToken);
          filterTokens(params, "code_block", forToken);
          filterTokens(params, "fence", forToken);
        }
      });
    }
  },
  {
    "names": [ "MD045", "no-alt-text" ],
    "desc": "Images should have alternate text (alt text)",
    "tags": [ "accessibility", "images" ],
    "func": function MD045(params, onError) {
      forEachInlineChild(params, "image", function forToken(token) {
        if (token.content === "") {
          addError(onError, token.lineNumber);
        }
      });
    }
  }
];
