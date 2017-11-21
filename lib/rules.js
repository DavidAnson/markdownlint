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
function longLineReFunc(options) {
  var lineLength = options.line_length || defaultLineLength;
  return new RegExp("^(.{" + lineLength + "})(.*\\s.*)$");
}

// Escapes a string for use in a RegExp
function escapeForRegExp(str) {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

// Returns the indent for a token
function indentFor(token) {
  var line = token.line.replace(/^[\s>]*(> |>)/, "");
  return line.length - line.trimLeft().length;
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

module.exports = [
  {
    "name": "MD001",
    "desc": "Header levels should only increment by one level at a time",
    "tags": [ "headers" ],
    "aliases": [ "header-increment" ],
    "regexp": null,
    "func": function MD001(params, errors) {
      var prevLevel = 0;
      filterTokens(params, "heading_open", function forToken(token) {
        var level = parseInt(token.tag.slice(1), 10);
        if (prevLevel && (level > prevLevel)) {
          errors.addDetailIf(token.lineNumber,
            "h" + (prevLevel + 1), "h" + level);
        }
        prevLevel = level;
      });
    }
  },

  {
    "name": "MD002",
    "desc": "First header should be a top level header",
    "tags": [ "headers" ],
    "aliases": [ "first-header-h1" ],
    "regexp": null,
    "func": function MD002(params, errors) {
      var level = params.options.level || 1;
      var tag = "h" + level;
      params.tokens.every(function forToken(token) {
        if (token.type === "heading_open") {
          errors.addDetailIf(token.lineNumber, tag, token.tag);
          return false;
        }
        return true;
      });
    }
  },

  {
    "name": "MD003",
    "desc": "Header style",
    "tags": [ "headers" ],
    "aliases": [ "header-style" ],
    "regexp": null,
    "func": function MD003(params, errors) {
      var style = params.options.style || "consistent";
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
            errors.addDetailIf(token.lineNumber, expected, styleForToken);
          }
        }
      });
    }
  },

  {
    "name": "MD004",
    "desc": "Unordered list style",
    "tags": [ "bullet", "ul" ],
    "aliases": [ "ul-style" ],
    "regexp": listItemMarkerRe,
    "func": function MD004(params, errors) {
      var style = params.options.style || "consistent";
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
                errors.addDetailIf(item.lineNumber,
                  nestingStyles[nesting], itemStyle);
              }
            } else {
              errors.addDetailIf(item.lineNumber, expectedStyle, itemStyle);
            }
          });
        }
      });
    }
  },

  {
    "name": "MD005",
    "desc": "Inconsistent indentation for list items at the same level",
    "tags": [ "bullet", "ul", "indentation" ],
    "aliases": [ "list-indent" ],
    "regexp": listItemMarkerRe,
    "func": function MD005(params, errors) {
      flattenLists(params).forEach(function forList(list) {
        var indent = indentFor(list.items[0]);
        list.items.forEach(function forItem(item) {
          errors.addDetailIf(item.lineNumber, indent, indentFor(item));
        });
      });
    }
  },

  {
    "name": "MD006",
    "desc": "Consider starting bulleted lists at the beginning of the line",
    "tags": [ "bullet", "ul", "indentation" ],
    "aliases": [ "ul-start-left" ],
    "regexp": listItemMarkerRe,
    "func": function MD006(params, errors) {
      flattenLists(params).forEach(function forList(list) {
        if (list.unordered && !list.nesting) {
          errors.addDetailIf(list.open.lineNumber, 0, indentFor(list.open));
        }
      });
    }
  },

  {
    "name": "MD007",
    "desc": "Unordered list indentation",
    "tags": [ "bullet", "ul", "indentation" ],
    "aliases": [ "ul-indent" ],
    "regexp": listItemMarkerRe,
    "func": function MD007(params, errors) {
      var optionsIndent = params.options.indent || 2;
      var prevIndent = 0;
      flattenLists(params).forEach(function forList(list) {
        if (list.unordered && list.parentsUnordered) {
          var indent = indentFor(list.open);
          if (indent > prevIndent) {
            errors.addDetailIf(list.open.lineNumber,
              prevIndent + optionsIndent, indent);
          }
          prevIndent = indent;
        }
      });
    }
  },

  {
    "name": "MD009",
    "desc": "Trailing spaces",
    "tags": [ "whitespace" ],
    "aliases": [ "no-trailing-spaces" ],
    "regexp": trailingSpaceRe,
    "func": function MD009(params, errors) {
      var brSpaces = params.options.br_spaces || 0;
      var listItemEmptyLines = params.options.list_item_empty_lines;
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
          errors.addDetailIf(lineNumber,
            expected, line.length - line.trimRight().length);
        }
      });
    }
  },

  {
    "name": "MD010",
    "desc": "Hard tabs",
    "tags": [ "whitespace", "hard_tab" ],
    "aliases": [ "no-hard-tabs" ],
    "regexp": tabRe,
    "func": function MD010(params, errors) {
      var codeBlocks = params.options.code_blocks;
      var includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
      forEachLine(params, function forLine(line, lineIndex, inCode) {
        if (tabRe.test(line) && (!inCode || includeCodeBlocks)) {
          errors.addDetail(lineIndex + 1,
            "Column: " + (line.indexOf("\t") + 1));
        }
      });
    }
  },

  {
    "name": "MD011",
    "desc": "Reversed link syntax",
    "tags": [ "links" ],
    "aliases": [ "no-reversed-links" ],
    "regexp": reversedLinkRe,
    "func": function MD011(params, errors) {
      forEachInlineChild(params, "text", function forToken(token) {
        var match = reversedLinkRe.exec(token.content);
        if (match) {
          errors.addDetail(token.lineNumber, match[0]);
        }
      });
    }
  },

  {
    "name": "MD012",
    "desc": "Multiple consecutive blank lines",
    "tags": [ "whitespace", "blank_lines" ],
    "aliases": [ "no-multiple-blanks" ],
    "regexp": null,
    "func": function MD012(params, errors) {
      var maximum = params.options.maximum || 1;
      var count = 0;
      forEachLine(params, function forLine(line, lineIndex, inCode) {
        count = (inCode || line.trim().length) ? 0 : count + 1;
        if (maximum < count) {
          errors.addDetailIf(lineIndex + 1, maximum, count);
        }
      });
    }
  },

  {
    "name": "MD013",
    "desc": "Line length",
    "tags": [ "line_length" ],
    "aliases": [ "line-length" ],
    "regexp": longLineReFunc,
    "func": function MD013(params, errors) {
      var lineLength = params.options.line_length || defaultLineLength;
      var codeBlocks = params.options.code_blocks;
      var includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
      var tables = params.options.tables;
      var includeTables = (tables === undefined) ? true : !!tables;
      var headers = params.options.headers;
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
      var longLineRe = longLineReFunc(params.options);
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
            errors.addDetailIf(lineNumber, lineLength, line.length);
          }
        });
    }
  },

  {
    "name": "MD014",
    "desc": "Dollar signs used before commands without showing output",
    "tags": [ "code" ],
    "aliases": [ "commands-show-output" ],
    "regexp": dollarCommandRe,
    "func": function MD014(params, errors) {
      [ "code_block", "fence" ].forEach(function forType(type) {
        filterTokens(params, type, function forToken(token) {
          var allBlank = true;
          if (token.content && token.content.split(shared.newLineRe)
            .every(function forLine(line) {
              return !line || (allBlank = false) || dollarCommandRe.test(line);
            }) && !allBlank) {
            errors.addContext(token.lineNumber,
              token.content.split(shared.newLineRe)[0].trim());
          }
        });
      });
    }
  },

  {
    "name": "MD018",
    "desc": "No space after hash on atx style header",
    "tags": [ "headers", "atx", "spaces" ],
    "aliases": [ "no-missing-space-atx" ],
    "regexp": atxHeaderSpaceRe,
    "func": function MD018(params, errors) {
      forEachLine(params, function forLine(line, lineIndex, inCode) {
        if (!inCode && /^#+[^#\s]/.test(line) && !/#$/.test(line)) {
          errors.addContext(lineIndex + 1, line.trim());
        }
      });
    }
  },

  {
    "name": "MD019",
    "desc": "Multiple spaces after hash on atx style header",
    "tags": [ "headers", "atx", "spaces" ],
    "aliases": [ "no-multiple-space-atx" ],
    "regexp": atxHeaderSpaceRe,
    "func": function MD019(params, errors) {
      filterTokens(params, "heading_open", function forToken(token) {
        if ((headingStyleFor(token) === "atx") &&
            /^#+\s\s/.test(token.line)) {
          errors.addContext(token.lineNumber, token.line.trim());
        }
      });
    }
  },

  {
    "name": "MD020",
    "desc": "No space inside hashes on closed atx style header",
    "tags": [ "headers", "atx_closed", "spaces" ],
    "aliases": [ "no-missing-space-closed-atx" ],
    "regexp": atxClosedHeaderNoSpaceRe,
    "func": function MD020(params, errors) {
      forEachLine(params, function forLine(line, lineIndex, inCode) {
        if (!inCode && /^#+[^#]*[^\\]#+$/.test(line)) {
          var left = /^#+[^#\s]/.test(line);
          var right = /[^#\s]#+$/.test(line);
          if (left || right) {
            errors.addContext(lineIndex + 1, line.trim(), left, right);
          }
        }
      });
    }
  },

  {
    "name": "MD021",
    "desc": "Multiple spaces inside hashes on closed atx style header",
    "tags": [ "headers", "atx_closed", "spaces" ],
    "aliases": [ "no-multiple-space-closed-atx" ],
    "regexp": atxClosedHeaderSpaceRe,
    "func": function MD021(params, errors) {
      filterTokens(params, "heading_open", function forToken(token) {
        if (headingStyleFor(token) === "atx_closed") {
          var left = /^#+\s\s/.test(token.line);
          var right = /\s\s#+$/.test(token.line);
          if (left || right) {
            errors.addContext(token.lineNumber, token.line.trim(), left, right);
          }
        }
      });
    }
  },

  {
    "name": "MD022",
    "desc": "Headers should be surrounded by blank lines",
    "tags": [ "headers", "blank_lines" ],
    "aliases": [ "blanks-around-headers" ],
    "regexp": null,
    "func": function MD022(params, errors) {
      var prevHeadingLineNumber = 0;
      var prevMaxLineIndex = -1;
      var needBlankLine = false;
      params.tokens.forEach(function forToken(token) {
        if (token.type === "heading_open") {
          if ((token.map[0] - prevMaxLineIndex) === 0) {
            errors.addContext(token.lineNumber, token.line.trim());
          }
        } else if (token.type === "heading_close") {
          needBlankLine = true;
        }
        if (token.map) {
          if (needBlankLine) {
            if ((token.map[0] - prevMaxLineIndex) === 0) {
              errors.addContext(prevHeadingLineNumber,
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
    "name": "MD023",
    "desc": "Headers must start at the beginning of the line",
    "tags": [ "headers", "spaces" ],
    "aliases": [ "header-start-left" ],
    "regexp": spaceBeforeHeaderRe,
    "func": function MD023(params, errors) {
      filterTokens(params, "heading_open", function forToken(token) {
        if (spaceBeforeHeaderRe.test(token.line)) {
          errors.addContext(token.lineNumber, token.line);
        }
      });
    }
  },

  {
    "name": "MD024",
    "desc": "Multiple headers with the same content",
    "tags": [ "headers" ],
    "aliases": [ "no-duplicate-header" ],
    "regexp": null,
    "func": function MD024(params, errors) {
      var knownContent = [];
      forEachHeading(params, function forHeading(heading, content) {
        if (knownContent.indexOf(content) === -1) {
          knownContent.push(content);
        } else {
          errors.addContext(heading.lineNumber, heading.line.trim());
        }
      });
    }
  },

  {
    "name": "MD025",
    "desc": "Multiple top level headers in the same document",
    "tags": [ "headers" ],
    "aliases": [ "single-h1" ],
    "regexp": null,
    "func": function MD025(params, errors) {
      var level = params.options.level || 1;
      var tag = "h" + level;
      var hasTopLevelHeading = false;
      filterTokens(params, "heading_open", function forToken(token) {
        if (token.tag === tag) {
          if (hasTopLevelHeading) {
            errors.addContext(token.lineNumber, token.line.trim());
          } else if (token.lineNumber === 1) {
            hasTopLevelHeading = true;
          }
        }
      });
    }
  },

  {
    "name": "MD026",
    "desc": "Trailing punctuation in header",
    "tags": [ "headers" ],
    "aliases": [ "no-trailing-punctuation" ],
    "regexp": trailingPunctuationRe,
    "func": function MD026(params, errors) {
      var punctuation = params.options.punctuation || ".,;:!?";
      var re = new RegExp("[" + punctuation + "]$");
      forEachHeading(params, function forHeading(heading, content) {
        var match = re.exec(content);
        if (match) {
          errors.addDetail(heading.lineNumber,
            "Punctuation: '" + match[0] + "'");
        }
      });
    }
  },

  {
    "name": "MD027",
    "desc": "Multiple spaces after blockquote symbol",
    "tags": [ "blockquote", "whitespace", "indentation" ],
    "aliases": [ "no-multiple-space-blockquote" ],
    "regexp": spaceAfterBlockQuote,
    "func": function MD027(params, errors) {
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
            errors.addContext(token.lineNumber, token.line);
          }
          token.content.split(shared.newLineRe)
            .forEach(function forLine(line, offset) {
              if (/^\s/.test(line)) {
                errors.addContext(token.lineNumber + offset, "> " + line);
              }
            });
        }
      });
    }
  },

  {
    "name": "MD028",
    "desc": "Blank line inside blockquote",
    "tags": [ "blockquote", "whitespace" ],
    "aliases": [ "no-blanks-blockquote" ],
    "regexp": null,
    "func": function MD028(params, errors) {
      var prevToken = {};
      params.tokens.forEach(function forToken(token) {
        if ((token.type === "blockquote_open") &&
            (prevToken.type === "blockquote_close")) {
          errors.add(token.lineNumber - 1);
        }
        prevToken = token;
      });
    }
  },

  {
    "name": "MD029",
    "desc": "Ordered list item prefix",
    "tags": [ "ol" ],
    "aliases": [ "ol-prefix" ],
    "regexp": listItemMarkerRe,
    "func": function MD029(params, errors) {
      var style = params.options.style || "one";
      flattenLists(params).forEach(function forList(list) {
        if (!list.unordered) {
          var number = 1;
          list.items.forEach(function forItem(item) {
            var match = /^[\s>]*([^.)]*)[.)]/.exec(item.line);
            errors.addDetailIf(item.lineNumber,
              String(number), !match || match[1],
              "Style: " + (style === "one" ? "1/1/1" : "1/2/3"));
            if (style === "ordered") {
              number++;
            }
          });
        }
      });
    }
  },

  {
    "name": "MD030",
    "desc": "Spaces after list markers",
    "tags": [ "ol", "ul", "whitespace" ],
    "aliases": [ "list-marker-space" ],
    "regexp": listItemMarkerRe,
    "func": function MD030(params, errors) {
      var ulSingle = params.options.ul_single || 1;
      var olSingle = params.options.ol_single || 1;
      var ulMulti = params.options.ul_multi || 1;
      var olMulti = params.options.ol_multi || 1;
      flattenLists(params).forEach(function forList(list) {
        var lineCount = list.lastLineIndex - list.open.map[0];
        var allSingle = lineCount === list.items.length;
        var expectedSpaces = list.unordered ?
          (allSingle ? ulSingle : ulMulti) :
          (allSingle ? olSingle : olMulti);
        list.items.forEach(function forItem(item) {
          var match = /^[\s>]*\S+(\s+)/.exec(item.line);
          errors.addDetailIf(item.lineNumber,
            expectedSpaces, (match ? match[1].length : 0));
        });
      });
    }
  },

  {
    "name": "MD031",
    "desc": "Fenced code blocks should be surrounded by blank lines",
    "tags": [ "code", "blank_lines" ],
    "aliases": [ "blanks-around-fences" ],
    "regexp": null,
    "func": function MD031(params, errors) {
      var lines = params.lines;
      forEachLine(params, function forLine(line, i, inCode, onFence) {
        if (((onFence > 0) && (i - 1 >= 0) && lines[i - 1].length) ||
            ((onFence < 0) && (i + 1 < lines.length) && lines[i + 1].length)) {
          errors.addContext(i + 1, lines[i].trim());
        }
      });
    }
  },

  {
    "name": "MD032",
    "desc": "Lists should be surrounded by blank lines",
    "tags": [ "bullet", "ul", "ol", "blank_lines" ],
    "aliases": [ "blanks-around-lists" ],
    "regexp": null,
    "func": function MD032(params, errors) {
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
              errors.addContext(lineIndex + 1, lineTrim);
            } else {
              listMarker = false;
            }
          } else if (!listMarker && inList && !blankOrListRe.test(line)) {
            errors.addContext(lineIndex, lineTrim);
          }
          inList = listMarker;
        }
        prevLine = line;
      });
    }
  },

  {
    "name": "MD033",
    "desc": "Inline HTML",
    "tags": [ "html" ],
    "aliases": [ "no-inline-html" ],
    "regexp": htmlRe,
    "func": function MD033(params, errors) {
      var allowedElements = (params.options.allowed_elements || [])
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
              errors.addDetail(token.lineNumber + offset,
                "Element: " + allowed[0]);
            }
          });
      }
      filterTokens(params, "html_block", forToken);
      forEachInlineChild(params, "html_inline", forToken);
    }
  },

  {
    "name": "MD034",
    "desc": "Bare URL used",
    "tags": [ "links", "url" ],
    "aliases": [ "no-bare-urls" ],
    "regexp": bareUrlRe,
    "func": function MD034(params, errors) {
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
            errors.addContext(child.lineNumber, match[0]);
          }
        });
      });
    }
  },

  {
    "name": "MD035",
    "desc": "Horizontal rule style",
    "tags": [ "hr" ],
    "aliases": [ "hr-style" ],
    "regexp": null,
    "func": function MD035(params, errors) {
      var style = params.options.style || "consistent";
      filterTokens(params, "hr", function forToken(token) {
        var lineTrim = token.line.trim();
        if (style === "consistent") {
          style = lineTrim;
        }
        errors.addDetailIf(token.lineNumber, style, lineTrim);
      });
    }
  },

  {
    "name": "MD036",
    "desc": "Emphasis used instead of a header",
    "tags": [ "headers", "emphasis" ],
    "aliases": [ "no-emphasis-as-header" ],
    "regexp": null,
    "func": function MD036(params, errors) {
      var punctuation = params.options.punctuation || ".,;:!?";
      var re = new RegExp("[" + punctuation + "]$");
      function base(token) {
        if (token.type === "paragraph_open") {
          return function inParagraph(t) {
            if ((t.type === "inline") &&
                (t.children.length === 3) &&
                ((t.children[0].type === "strong_open") ||
                 (t.children[0].type === "em_open")) &&
                (t.children[1].type === "text") &&
                !re.test(t.children[1].content)) {
              errors.addContext(t.lineNumber, t.children[1].content);
            }
          };
        } else if (token.type === "blockquote_open") {
          return function inBlockquote(t) {
            if (t.type !== "blockquote_close") {
              return inBlockquote;
            }
          };
        } else if (token.type === "list_item_open") {
          return function inListItem(t) {
            if (t.type !== "list_item_close") {
              return inListItem;
            }
          };
        }
      }
      var state = base;
      params.tokens.forEach(function forToken(token) {
        state = state(token) || base;
      });
    }
  },

  {
    "name": "MD037",
    "desc": "Spaces inside emphasis markers",
    "tags": [ "whitespace", "emphasis" ],
    "aliases": [ "no-space-in-emphasis" ],
    "regexp": null,
    "func": function MD037(params, errors) {
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
          errors.addContext(
            token.lineNumber, text, left, !left, [ column, length ]);
        }
      });
    }
  },

  {
    "name": "MD038",
    "desc": "Spaces inside code span elements",
    "tags": [ "whitespace", "code" ],
    "aliases": [ "no-space-in-code" ],
    "regexp": null,
    "func": function MD038(params, errors) {
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
              errors.addContext(
                token.lineNumber, inlineCodeSpan, true, false, range);
            } else if (/[^`]\s$/.test(content)) {
              errors.addContext(
                token.lineNumber, inlineCodeSpan, false, true, range);
            }
          }
        });
    }
  },

  {
    "name": "MD039",
    "desc": "Spaces inside link text",
    "tags": [ "whitespace", "links" ],
    "aliases": [ "no-space-in-links" ],
    "regexp": spaceInsideLinkRe,
    "func": function MD039(params, errors) {
      filterTokens(params, "inline", function forToken(token) {
        var inLink = false;
        var linkText = "";
        token.children.forEach(function forChild(child) {
          if (child.type === "link_open") {
            inLink = true;
            linkText = "";
          } else if (child.type === "link_close") {
            inLink = false;
            var left = linkText.trimLeft().length !== linkText.length;
            var right = linkText.trimRight().length !== linkText.length;
            if (left || right) {
              errors.addContext(
                token.lineNumber, "[" + linkText + "]", left, right);
            }
          } else if (inLink) {
            linkText += child.content;
          }
        });
      });
    }
  },

  {
    "name": "MD040",
    "desc": "Fenced code blocks should have a language specified",
    "tags": [ "code", "language" ],
    "aliases": [ "fenced-code-language" ],
    "regexp": null,
    "func": function MD040(params, errors) {
      filterTokens(params, "fence", function forToken(token) {
        if (!token.info.trim()) {
          errors.addContext(token.lineNumber, token.line);
        }
      });
    }
  },

  {
    "name": "MD041",
    "desc": "First line in file should be a top level header",
    "tags": [ "headers" ],
    "aliases": [ "first-line-h1" ],
    "regexp": null,
    "func": function MD041(params, errors) {
      var level = params.options.level || 1;
      var frontMatterTitle = params.options.front_matter_title;
      var tag = "h" + level;
      var frontMatterTitleRe =
        new RegExp(frontMatterTitle || "^\\s*title\\s*[:=]", "i");
      params.tokens.every(function forToken(token, index) {
        if (token.type === "heading_open") {
          if (!((token.lineNumber === 1) || (index > 0)) ||
              (token.tag !== tag)) {
            errors.addContext(token.lineNumber, token.line);
          }
          return false;
        } else if (token.type === "html_block") {
          return true;
        }
        if (((frontMatterTitle !== undefined) && !frontMatterTitle) ||
          !params.frontMatterLines.some(function forLine(line) {
            return frontMatterTitleRe.test(line);
          })) {
          errors.addContext(token.lineNumber, token.line);
        }
        return false;
      });
    }
  },

  {
    "name": "MD042",
    "desc": "No empty links",
    "tags": [ "links" ],
    "aliases": [ "no-empty-links" ],
    "regexp": emptyLinkRe,
    "func": function MD042(params, errors) {
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
              errors.addContext(child.lineNumber, "[" + linkText + "]()");
            }
          } else if (inLink) {
            linkText += child.content;
          }
        });
      });
    }
  },

  {
    "name": "MD043",
    "desc": "Required header structure",
    "tags": [ "headers" ],
    "aliases": [ "required-headers" ],
    "regexp": null,
    "func": function MD043(params, errors) {
      var requiredHeaders = params.options.headers;
      if (requiredHeaders) {
        var levels = {};
        [ 1, 2, 3, 4, 5, 6 ].forEach(function forLevel(level) {
          levels["h" + level] = "######".substr(-level);
        });
        var i = 0;
        var optional = false;
        forEachHeading(params, function forHeading(heading, content) {
          if (!errors.length) {
            var actual = levels[heading.tag] + " " + content;
            var expected = requiredHeaders[i++] || "[None]";
            if (expected === "*") {
              optional = true;
            } else if (expected.toLowerCase() === actual.toLowerCase()) {
              optional = false;
            } else if (optional) {
              i--;
            } else {
              errors.addDetailIf(heading.lineNumber, expected, actual);
            }
          }
        });
        if ((i < requiredHeaders.length) && !errors.length) {
          errors.addContext(params.lines.length, requiredHeaders[i]);
        }
      }
    }
  },

  {
    "name": "MD044",
    "desc": "Proper names should have the correct capitalization",
    "tags": [ "spelling" ],
    "aliases": [ "proper-names" ],
    "regexp": null,
    "func": function MD044(params, errors) {
      var names = params.options.names || [];
      var codeBlocks = params.options.code_blocks;
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
                    errors.addDetailIf(lineNumber, name, match[1], null, range);
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
  }
];
