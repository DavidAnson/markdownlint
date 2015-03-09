"use strict";

var shared = require("./shared");

function indentFor(token) {
  return token.line.length - token.line.trimLeft().length;
}

function headingStyleFor(token) {
  if ((token.lines[1] - token.lines[0]) === 1) {
    if (/#\s*$/.test(token.line)) {
      return "atx_closed";
    }
    return "atx";
  }
  return "setext";
}

function unorderedListStyleFor(token) {
  switch (token.line.trimLeft().substr(0, 1)) {
    case "*":
      return "asterisk";
    case "-":
      return "dash";
    case "+":
      return "plus";
    default:
      return null;
  }
}

function filterTokens(tokens, tokenA, tokenB) {
  return tokens.filter(function filterToken(token) {
    return ((token.type === tokenA) || (token.type === tokenB));
  });
}

function forEachLine(params, callback) {
  var codeBlocks = [];
  filterTokens(params.tokens, "code_block")
    .forEach(function forToken(token) {
      for (var i = token.lines[0]; i < token.lines[1]; i++) {
        codeBlocks.push(i);
      }
    });
  var inFence = false;
  params.lines.forEach(function forLine(line, lineIndex) {
    var onFence = /^(```|~~~)/.test(line);
    if (onFence) {
      inFence = !inFence;
    }
    var codeBlock = (codeBlocks.indexOf(lineIndex) !== -1);
    callback(line, lineIndex, inFence || codeBlock, onFence);
  });
}

module.exports = [
  {
    "name": "MD001",
    "desc": "Header levels should only increment by one level at a time",
    "func": function MD001(params, errors) {
      var prevLevel = 0;
      filterTokens(params.tokens, "heading_open")
        .forEach(function forToken(token) {
          if (prevLevel && (token.hLevel > prevLevel + 1)) {
            errors.push(token.lineNumber);
          }
          prevLevel = token.hLevel;
        });
    }
  },

  {
    "name": "MD002",
    "desc": "First header should be a h1 header",
    "func": function MD002(params, errors) {
      params.tokens.every(function forToken(token) {
        if (token.type === "heading_open") {
          if (token.hLevel !== 1) {
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
    "func": function MD003(params, errors) {
      var style = params.options.style || "consistent";
      var headings = filterTokens(params.tokens, "heading_open");
      if ((style === "consistent") && headings.length) {
        style = headingStyleFor(headings[0]);
      }
      headings.forEach(function forToken(token) {
        if (headingStyleFor(token) !== style) {
          errors.push(token.lineNumber);
        }
      });
    }
  },

  {
    "name": "MD004",
    "desc": "Unordered list style",
    "func": function MD004(params, errors) {
      var style = params.options.style || "consistent";
      var listItems = filterTokens(params.tokens, "list_item_open");
      if ((style === "consistent") && listItems.length) {
        style = unorderedListStyleFor(listItems[0]);
      }
      listItems.forEach(function forToken(token) {
        if (unorderedListStyleFor(token) !== style) {
          errors.push(token.lineNumber);
        }
      });
    }
  },

  {
    "name": "MD005",
    "desc": "Inconsistent indentation for list items at the same level",
    "func": function MD005(params, errors) {
      var indentLevels = [];
      filterTokens(params.tokens, "list_item_open")
        .forEach(function forToken(token) {
          var indentLevel = indentFor(token);
          if (!indentLevels[token.level]) {
            indentLevels[token.level] = indentLevel;
          } else if (indentLevel !== indentLevels[token.level]) {
            errors.push(token.lineNumber);
          }
        });
    }
  },

  {
    "name": "MD006",
    "desc": "Consider starting bulleted lists at the beginning of the line",
    "func": function MD006(params, errors) {
      var inList = 0;
      params.tokens.filter(function filterToken(token) {
        switch (token.type) {
          case "bullet_list_open":
            inList++;
            return inList === 1;
          case "bullet_list_close":
            inList--;
            return false;
          default:
            return false;
        }
      }).forEach(function forToken(token) {
        if (indentFor(token) !== 0) {
          errors.push(token.lineNumber);
        }
      });
    }
  },

  {
    "name": "MD007",
    "desc": "Unordered list indentation",
    "func": function MD007(params, errors) {
      var optionsIndent = params.options.indent || 2;
      var prevIndent = 0;
      filterTokens(params.tokens, "bullet_list_open")
        .forEach(function forToken(token) {
          var indent = indentFor(token);
          if ((indent > prevIndent) &&
              ((indent - prevIndent) !== optionsIndent)) {
            errors.push(token.lineNumber);
          }
          prevIndent = indent;
        });
    }
  },

  // MD008 does not exist

  {
    "name": "MD009",
    "desc": "Trailing spaces",
    "func": function MD009(params, errors) {
      params.lines.forEach(function forLine(line, lineIndex) {
        if (/\s$/.test(line)) {
          errors.push(lineIndex + 1);
        }
      });
    }
  },

  {
    "name": "MD010",
    "desc": "Hard tabs",
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
    "func": function MD011(params, errors) {
      filterTokens(params.tokens, "inline")
        .forEach(function forToken(token) {
          filterTokens(token.children, "text")
            .forEach(function forChild(child) {
              if (/\([^)]+\)\[[^\]]+\]/.test(child.content)) {
                errors.push(token.lineNumber);
              }
            });
        });
    }
  },

  {
    "name": "MD012",
    "desc": "Multiple consecutive blank lines",
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
    "func": function MD013(params, errors) {
      var lineLength = params.options.line_length || 80;
      var regex = new RegExp("^.{" + lineLength + "}.*\\s");
      params.lines.forEach(function forLine(line, lineIndex) {
        if (regex.test(line)) {
          errors.push(lineIndex + 1);
        }
      });
    }
  },

  {
    "name": "MD014",
    "desc": "Dollar signs used before commands without showing output",
    "func": function MD014(params, errors) {
      filterTokens(params.tokens, "code_block", "fence")
        .forEach(function forToken(token) {
          if (token.content && token.content
            .split(shared.newLineRe)
            .filter(function filterLine(line) {
              return line;
            }).every(function forLine(line) {
              return /^\$\s/.test(line);
            })) {
            errors.push(token.lineNumber);
          }
        });
    }
  },

  {
    "name": "MD018",
    "desc": "No space after hash on atx style header",
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
    "func": function MD019(params, errors) {
      filterTokens(params.tokens, "heading_open")
        .forEach(function forToken(token) {
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
    "func": function MD021(params, errors) {
      filterTokens(params.tokens, "heading_open")
        .forEach(function forToken(token) {
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
    "func": function MD022(params, errors) {
      var prevHeadingLineNumber = 0;
      var prevMaxLineIndex = -1;
      var needBlankLine = false;
      params.tokens.forEach(function forToken(token) {
        if (token.type === "heading_open") {
          if ((token.lines[0] - prevMaxLineIndex) === 0) {
            errors.push(token.lineNumber);
          }
          prevHeadingLineNumber = token.lineNumber;
        } else if (token.type === "heading_close") {
          needBlankLine = true;
        } else if (token.type === "inline") {
          token.content.split(shared.newLineRe)
            .forEach(function forLine(line, offset) {
              if (/^(-+|=+)\s*$/.test(line)) {
                errors.push(token.lines[0] + offset);
              }
            });
        }
        if (token.lines) {
          if (needBlankLine) {
            if ((token.lines[0] - prevMaxLineIndex) === 0) {
              errors.push(prevHeadingLineNumber);
            }
            needBlankLine = false;
          }
          prevMaxLineIndex = Math.max(prevMaxLineIndex, token.lines[1]);
        }
      });
    }
  },

  {
    "name": "MD028",
    "desc": "Blank line inside blockquote",
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
    "func": function MD029(params, errors) {
      var style = params.options.style || "one";
      var number = 0;
      params.tokens.forEach(function forToken(token) {
        if (token.type === "ordered_list_open") {
          number = 1;
        } else if (token.type === "ordered_list_close") {
          number = 0;
        } else if ((token.type === "list_item_open") && number) {
          var regex = new RegExp("^\\s*" + String(number) + "\\. ");
          if (!regex.test(token.line)) {
            errors.push(token.lineNumber);
          }
          if (style === "ordered") {
            number++;
          }
        }
      });
    }
  },

  {
    "name": "MD031",
    "desc": "Fenced code blocks should be surrounded by blank lines",
    "func": function MD031(params, errors) {
      // Some parsers have trouble detecting fenced code blocks without
      // surrounding whitespace, so examine the lines directly.
      forEachLine(params, function forLine(line, lineIndex, inCode, onFence) {
        if (onFence &&
            ((inCode && (lineIndex - 1 >= 0) &&
              params.lines[lineIndex - 1].length) ||
             (!inCode && (lineIndex + 1 < params.lines.length) &&
              params.lines[lineIndex + 1].length))) {
          errors.push(lineIndex + 1);
        }
      });
    }
  },

  {
    "name": "MD032",
    "desc": "Lists should be surrounded by blank lines",
    "func": function MD032(params, errors) {
      // Some parsers have trouble detecting lists without surrounding
      // whitespace, so examine the lines directly.
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
        inList = inList && !onFence;
        prevLine = line;
      });
    }
  }
];
