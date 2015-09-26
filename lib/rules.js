"use strict";

var shared = require("./shared");

// Returns the indent for a token
function indentFor(token) {
  return token.line.length - token.line.trimLeft().length;
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
    case "*":
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
        metadata = inFence ? -2 : 2;
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
    params.forEachLine = lineMetadata;
  }
  // Invoke callback
  params.lines.forEach(function forLine(line, lineIndex) {
    var metadata = params.forEachLine[lineIndex];
    callback(line, lineIndex, !!metadata, (metadata >> 1));
  });
}

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
          "ordered": (token.type === "ordered_list_open"),
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
    "func": function MD001(params, errors) {
      var prevLevel = 0;
      filterTokens(params, "heading_open", function forToken(token) {
        var level = parseInt(token.tag.slice(1), 10);
        if (prevLevel && (level > prevLevel + 1)) {
          errors.push(token.lineNumber);
        }
        prevLevel = level;
      });
    }
  },

  {
    "name": "MD002",
    "desc": "First header should be a h1 header",
    "tags": [ "headers" ],
    "func": function MD002(params, errors) {
      params.tokens.every(function forToken(token) {
        if (token.type === "heading_open") {
          if (token.tag !== "h1") {
            errors.push(token.lineNumber);
          }
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
    "func": function MD003(params, errors) {
      var style = params.options.style || "consistent";
      filterTokens(params, "heading_open", function forToken(token) {
        var styleForToken = headingStyleFor(token);
        if (style === "consistent") {
          style = styleForToken;
        }
        if ((styleForToken !== style) &&
            !((style === "setext_with_atx") &&
              (/h[12]/.test(token.tag) && (styleForToken === "setext")) ||
               (/h[^12]/.test(token.tag) && (styleForToken === "atx")))) {
          errors.push(token.lineNumber);
        }
      });
    }
  },

  {
    "name": "MD004",
    "desc": "Unordered list style",
    "tags": [ "bullet", "ul" ],
    "func": function MD004(params, errors) {
      var style = params.options.style || "consistent";
      flattenLists(params).forEach(function forList(list) {
        if (!list.ordered) {
          if (style === "consistent") {
            style = unorderedListStyleFor(list.items[0]);
          }
          list.items.forEach(function forItem(item) {
            if (unorderedListStyleFor(item) !== style) {
              errors.push(item.lineNumber);
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
    "func": function MD005(params, errors) {
      flattenLists(params).forEach(function forList(list) {
        var indent = indentFor(list.items[0]);
        list.items.forEach(function forItem(item) {
          if (indentFor(item) !== indent) {
            errors.push(item.lineNumber);
          }
        });
      });
    }
  },

  {
    "name": "MD006",
    "desc": "Consider starting bulleted lists at the beginning of the line",
    "tags": [ "bullet", "ul", "indentation" ],
    "func": function MD006(params, errors) {
      flattenLists(params).forEach(function forList(list) {
        if (!list.ordered && !list.nesting && indentFor(list.open)) {
          errors.push(list.open.lineNumber);
        }
      });
    }
  },

  {
    "name": "MD007",
    "desc": "Unordered list indentation",
    "tags": [ "bullet", "ul", "indentation" ],
    "func": function MD007(params, errors) {
      var optionsIndent = params.options.indent || 2;
      var prevIndent = 0;
      flattenLists(params).forEach(function forList(list) {
        if (!list.ordered) {
          var indent = indentFor(list.open);
          if ((indent > prevIndent) &&
              ((indent - prevIndent) !== optionsIndent)) {
            errors.push(list.open.lineNumber);
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
    "func": function MD009(params, errors) {
      var brSpaces = params.options.br_spaces || 0;
      params.lines.forEach(function forLine(line, lineIndex) {
        if (/\s$/.test(line) &&
            ((brSpaces < 2) ||
             (line.length - line.trimRight().length !== brSpaces))) {
          errors.push(lineIndex + 1);
        }
      });
    }
  },

  {
    "name": "MD010",
    "desc": "Hard tabs",
    "tags": [ "whitespace", "hard_tab" ],
    "func": function MD010(params, errors) {
      params.lines.forEach(function forLine(line, lineIndex) {
        if (/\t/.test(line)) {
          errors.push(lineIndex + 1);
        }
      });
    }
  },

  {
    "name": "MD011",
    "desc": "Reversed link syntax",
    "tags": [ "links" ],
    "func": function MD011(params, errors) {
      forEachInlineChild(params, "text", function forToken(token) {
        if (/\([^)]+\)\[[^\]]+\]/.test(token.content)) {
          errors.push(token.lineNumber);
        }
      });
    }
  },

  {
    "name": "MD012",
    "desc": "Multiple consecutive blank lines",
    "tags": [ "whitespace", "blank_lines" ],
    "func": function MD012(params, errors) {
      var prevLine = "-";
      forEachLine(params, function forLine(line, lineIndex, inCode) {
        line = line.trim();
        if (!inCode && !line.length && !prevLine.length) {
          errors.push(lineIndex + 1);
        }
        prevLine = line;
      });
    }
  },

  {
    "name": "MD013",
    "desc": "Line length",
    "tags": [ "line_length" ],
    "func": function MD013(params, errors) {
      var lineLength = params.options.line_length || 80;
      var re = new RegExp("^.{" + lineLength + "}.*\\s");
      params.lines.forEach(function forLine(line, lineIndex) {
        if (re.test(line)) {
          errors.push(lineIndex + 1);
        }
      });
    }
  },

  {
    "name": "MD014",
    "desc": "Dollar signs used before commands without showing output",
    "tags": [ "code" ],
    "func": function MD014(params, errors) {
      [ "code_block", "fence" ].forEach(function forType(type) {
        filterTokens(params, type, function forToken(token) {
          if (token.content && token.content.split(shared.newLineRe)
            .every(function forLine(line) {
              return !line || /^\$\s/.test(line);
            })) {
            errors.push(token.lineNumber);
          }
        });
      });
    }
  },

  {
    "name": "MD018",
    "desc": "No space after hash on atx style header",
    "tags": [ "headers", "atx", "spaces" ],
    "func": function MD018(params, errors) {
      forEachLine(params, function forLine(line, lineIndex, inCode) {
        if (!inCode && /^#+[^#\s]/.test(line) && !/#$/.test(line)) {
          errors.push(lineIndex + 1);
        }
      });
    }
  },

  {
    "name": "MD019",
    "desc": "Multiple spaces after hash on atx style header",
    "tags": [ "headers", "atx", "spaces" ],
    "func": function MD019(params, errors) {
      filterTokens(params, "heading_open", function forToken(token) {
        if ((headingStyleFor(token) === "atx") &&
            /^#+\s\s/.test(token.line)) {
          errors.push(token.lineNumber);
        }
      });
    }
  },

  {
    "name": "MD020",
    "desc": "No space inside hashes on closed atx style header",
    "tags": [ "headers", "atx_closed", "spaces" ],
    "func": function MD020(params, errors) {
      forEachLine(params, function forLine(line, lineIndex, inCode) {
        if (!inCode && /^#+[^#]*[^\\]#+$/.test(line) &&
            (/^#+[^#\s]/.test(line) || /[^#\s]#+$/.test(line))) {
          errors.push(lineIndex + 1);
        }
      });
    }
  },

  {
    "name": "MD021",
    "desc": "Multiple spaces inside hashes on closed atx style header",
    "tags": [ "headers", "atx_closed", "spaces" ],
    "func": function MD021(params, errors) {
      filterTokens(params, "heading_open", function forToken(token) {
        if ((headingStyleFor(token) === "atx_closed") &&
            (/^#+\s\s/.test(token.line) || /\s\s#+$/.test(token.line))) {
          errors.push(token.lineNumber);
        }
      });
    }
  },

  {
    "name": "MD022",
    "desc": "Headers should be surrounded by blank lines",
    "tags": [ "headers", "blank_lines" ],
    "func": function MD022(params, errors) {
      var prevHeadingLineNumber = 0;
      var prevMaxLineIndex = -1;
      var needBlankLine = false;
      params.tokens.forEach(function forToken(token) {
        if (token.type === "heading_open") {
          if ((token.map[0] - prevMaxLineIndex) === 0) {
            errors.push(token.lineNumber);
          }
          prevHeadingLineNumber = token.lineNumber;
        } else if (token.type === "heading_close") {
          needBlankLine = true;
        } else if (token.type === "inline") {
          token.content.split(shared.newLineRe)
            .forEach(function forLine(line, offset) {
              if (/^(-+|=+)\s*$/.test(line)) {
                var seTextLineNumber = token.map[0] + offset;
                if (seTextLineNumber > 0) {
                  errors.push(seTextLineNumber);
                }
              }
            });
        }
        if (token.map) {
          if (needBlankLine) {
            if ((token.map[0] - prevMaxLineIndex) === 0) {
              errors.push(prevHeadingLineNumber);
            }
            needBlankLine = false;
          }
          prevMaxLineIndex = Math.max(prevMaxLineIndex, token.map[1]);
        }
      });
    }
  },

  {
    "name": "MD023",
    "desc": "Headers must start at the beginning of the line",
    "tags": [ "headers", "spaces" ],
    "func": function MD023(params, errors) {
      filterTokens(params, "heading_open", function forToken(token) {
        if (/^\s/.test(token.line)) {
          errors.push(token.lineNumber);
        }
      });
    }
  },

  {
    "name": "MD024",
    "desc": "Multiple headers with the same content",
    "tags": [ "headers" ],
    "func": function MD024(params, errors) {
      var knownContent = [];
      forEachHeading(params, function forHeading(heading, content) {
        if (knownContent.indexOf(content) === -1) {
          knownContent.push(content);
        } else {
          errors.push(heading.lineNumber);
        }
      });
    }
  },

  {
    "name": "MD025",
    "desc": "Multiple top level headers in the same document",
    "tags": [ "headers" ],
    "func": function MD025(params, errors) {
      var hasTopLevelHeading = false;
      filterTokens(params, "heading_open", function forToken(token) {
        if (token.tag === "h1") {
          if (hasTopLevelHeading) {
            errors.push(token.lineNumber);
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
    "func": function MD026(params, errors) {
      var punctuation = params.options.punctuation || ".,;:!?";
      var re = new RegExp("[" + punctuation + "]$");
      forEachHeading(params, function forHeading(heading, content) {
        if (re.test(content)) {
          errors.push(heading.lineNumber);
        }
      });
    }
  },

  {
    "name": "MD027",
    "desc": "Multiple spaces after blockquote symbol",
    "tags": [ "blockquote", "whitespace", "indentation" ],
    "func": function MD027(params, errors) {
      var inBlockquote = false;
      params.tokens.forEach(function forToken(token) {
        if (token.type === "blockquote_open") {
          inBlockquote = true;
        } else if (token.type === "blockquote_close") {
          inBlockquote = false;
        } else if ((token.type === "inline") && inBlockquote) {
          token.content.split(shared.newLineRe)
            .forEach(function forLine(line, offset) {
              if (/^\s/.test(line) ||
                  (!offset && /^\s*>\s\s/.test(token.line))) {
                errors.push(token.lineNumber + offset);
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
    "func": function MD028(params, errors) {
      var prevToken = {};
      params.tokens.forEach(function forToken(token) {
        if ((token.type === "blockquote_open") &&
            (prevToken.type === "blockquote_close")) {
          errors.push(token.lineNumber - 1);
        }
        prevToken = token;
      });
    }
  },

  {
    "name": "MD029",
    "desc": "Ordered list item prefix",
    "tags": [ "ol" ],
    "func": function MD029(params, errors) {
      var style = params.options.style || "one";
      flattenLists(params).forEach(function forList(list) {
        if (list.ordered) {
          var number = 1;
          list.items.forEach(function forItem(item) {
            var re = new RegExp("^\\s*" + String(number) + "\\.");
            if (!re.test(item.line)) {
              errors.push(item.lineNumber);
            }
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
    "func": function MD030(params, errors) {
      var ulSingle = params.options.ul_single || 1;
      var olSingle = params.options.ol_single || 1;
      var ulMulti = params.options.ul_multi || 1;
      var olMulti = params.options.ol_multi || 1;
      flattenLists(params).forEach(function forList(list) {
        var lineCount = list.lastLineIndex - list.open.map[0];
        var allSingle = lineCount === list.items.length;
        var expectedSpaces = list.ordered ?
          (allSingle ? olSingle : olMulti) :
          (allSingle ? ulSingle : ulMulti);
        list.items.forEach(function forItem(item) {
          var match = /^\s*\S+(\s+)/.exec(item.line);
          if (!match || (match[1].length !== expectedSpaces)) {
            errors.push(item.lineNumber);
          }
        });
      });
    }
  },

  {
    "name": "MD031",
    "desc": "Fenced code blocks should be surrounded by blank lines",
    "tags": [ "code", "blank_lines" ],
    "func": function MD031(params, errors) {
      var lines = params.lines;
      forEachLine(params, function forLine(line, i, inCode, onFence) {
        if (((onFence > 0) && (i - 1 >= 0) && lines[i - 1].length) ||
            ((onFence < 0) && (i + 1 < lines.length) && lines[i + 1].length)) {
          errors.push(i + 1);
        }
      });
    }
  },

  {
    "name": "MD032",
    "desc": "Lists should be surrounded by blank lines",
    "tags": [ "bullet", "ul", "ol", "blank_lines" ],
    "func": function MD032(params, errors) {
      var inList = false;
      var prevLine = "";
      forEachLine(params, function forLine(line, lineIndex, inCode, onFence) {
        if (!inCode || onFence) {
          var listMarker = /^([\*\+\-]|(\d+\.))\s/.test(line.trim());
          if (listMarker && !inList && !/^($|\s)/.test(prevLine)) {
            errors.push(lineIndex + 1);
          } else if (!listMarker && inList && !/^($|\s)/.test(line)) {
            errors.push(lineIndex);
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
    "func": function MD033(params, errors) {
      function forToken(token) {
        if (token.content.search(shared.inlineCommentRe) === -1) {
          errors.push(token.lineNumber);
        }
      }
      filterTokens(params, "html_block", forToken);
      forEachInlineChild(params, "html_inline", forToken);
    }
  },

  {
    "name": "MD034",
    "desc": "Bare URL used",
    "tags": [ "links", "url" ],
    "func": function MD034(params, errors) {
      filterTokens(params, "inline", function forToken(token) {
        var inLink = false;
        token.children.forEach(function forChild(child) {
          if (child.type === "link_open") {
            inLink = true;
          } else if (child.type === "link_close") {
            inLink = false;
          } else if ((child.type === "text") &&
                     !inLink &&
                     /https?:\/\//.test(child.content)) {
            errors.push(child.lineNumber);
          }
        });
      });
    }
  },

  {
    "name": "MD035",
    "desc": "Horizontal rule style",
    "tags": [ "hr" ],
    "func": function MD035(params, errors) {
      var style = params.options.style || "consistent";
      filterTokens(params, "hr", function forToken(token) {
        if (style === "consistent") {
          style = token.line;
        }
        if (token.line !== style) {
          errors.push(token.lineNumber);
        }
      });
    }
  },

  {
    "name": "MD036",
    "desc": "Emphasis used instead of a header",
    "tags": [ "headers", "emphasis" ],
    "func": function MD036(params, errors) {
      function base(token) {
        if (token.type === "paragraph_open") {
          return function inParagraph(t) {
            if ((t.type === "inline") &&
                (t.children.length === 3) &&
                ((t.children[0].type === "strong_open") ||
                 (t.children[0].type === "em_open")) &&
                (t.children[1].type === "text")) {
              errors.push(t.lineNumber);
            }
          };
        } else if (token.type === "blockquote_open") {
          return function inBlockquote(t) {
            if (t.type !== "blockquote_close") {
              return inBlockquote;
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
    "func": function MD037(params, errors) {
      forEachInlineChild(params, "text", function forToken(token) {
        if (/\s(\*\*?|__?)\s.+\1/.test(token.content) ||
            /(\*\*?|__?).+\s\1\s/.test(token.content)) {
          errors.push(token.lineNumber);
        }
      });
    }
  },

  {
    "name": "MD038",
    "desc": "Spaces inside code span elements",
    "tags": [ "whitespace", "code" ],
    "func": function MD038(params, errors) {
      forEachInlineChild(params, "code_inline",
        function forToken(token, inline) {
          if (inline.content.indexOf("`" + token.content + "`") === -1) {
            errors.push(token.lineNumber);
          }
        });
    }
  },

  {
    "name": "MD039",
    "desc": "Spaces inside link text",
    "tags": [ "whitespace", "links" ],
    "func": function MD039(params, errors) {
      filterTokens(params, "inline", function forToken(token) {
        var inLink = false;
        var index = 0;
        var lastChildRightSpaceLineNumber = 0;
        token.children.forEach(function forChild(child) {
          if (child.type === "link_open") {
            inLink = true;
            index = 0;
          } else if (child.type === "link_close") {
            inLink = false;
            if (lastChildRightSpaceLineNumber) {
              errors.push(lastChildRightSpaceLineNumber);
            }
          } else if (inLink) {
            if ((index === 0) &&
                (child.content.trimLeft().length !== child.content.length)) {
              errors.push(child.lineNumber);
            }
            lastChildRightSpaceLineNumber =
              (child.content.trimRight().length !== child.content.length) ?
                child.lineNumber : 0;
            index++;
          }
        });
      });
    }
  },

  {
    "name": "MD040",
    "desc": "Fenced code blocks should have a language specified",
    "tags": [ "code", "language" ],
    "func": function MD040(params, errors) {
      filterTokens(params, "fence", function forToken(token) {
        if (!token.info.trim()) {
          errors.push(token.lineNumber);
        }
      });
    }
  },

  {
    "name": "MD041",
    "desc": "First line in file should be a top level header",
    "tags": [ "headers" ],
    "func": function MD041(params, errors) {
      var firstHeader = null;
      params.tokens.every(function forToken(token) {
        if (token.type === "heading_open") {
          firstHeader = token;
          return false;
        } else if (token.lineNumber > 1) {
          return false;
        }
        return true;
      });
      if (!firstHeader ||
          (firstHeader.lineNumber !== 1) ||
          (firstHeader.tag !== "h1")) {
        errors.push(1);
      }
    }
  }
];
