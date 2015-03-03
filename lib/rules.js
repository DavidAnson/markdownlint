"use strict";

function indentFrom(token) {
  return token.line.length - token.line.trimLeft().length;
}

function headingStyleFrom(token) {
  if ((token.lines[1] - token.lines[0]) === 1) {
    if (token.line.match(/#\s*$/)) {
      return "atx_closed";
    }
    return "atx";
  }
  return "setext";
}

function unorderedListStyleFrom(token) {
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

function padAndTrim(lines) {
  return [].concat(
    "",
    lines.map(function mapLine(line) {
      return line.trim();
    }),
    "");
}

module.exports = [
  {
    "name": "MD001",
    "desc": "Header levels should only increment by one level at a time",
    "func": function MD001(params, errors) {
      var prevLevel = 0;
      params.tokens.filter(function filterToken(token) {
        return (token.type === "heading_open");
      }).forEach(function forToken(token) {
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
      var headings = params.tokens.filter(function filterToken(token) {
        return (token.type === "heading_open");
      });
      if ((style === "consistent") && headings.length) {
        style = headingStyleFrom(headings[0]);
      }
      headings.forEach(function forToken(token) {
        if (headingStyleFrom(token) !== style) {
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
      var listItems = params.tokens.filter(function filterToken(token) {
        return (token.type === "list_item_open");
      });
      if ((style === "consistent") && listItems.length) {
        style = unorderedListStyleFrom(listItems[0]);
      }
      listItems.forEach(function forToken(token) {
        if (unorderedListStyleFrom(token) !== style) {
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
      params.tokens.filter(function filterToken(token) {
        return (token.type === "list_item_open");
      }).forEach(function forToken(token) {
        var indentLevel = indentFrom(token);
        if (!indentLevels[token.level]) {
          indentLevels[token.level] = indentLevel;
        } else if (indentLevel !== indentLevels[token.level]) {
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
      params.tokens.filter(function filterToken(token) {
        return (token.type === "bullet_list_open");
      }).forEach(function forToken(token) {
        var indent = indentFrom(token);
        if ((indent > prevIndent) &&
            ((indent - prevIndent) !== optionsIndent)) {
          errors.push(token.lineNumber);
        }
        prevIndent = indent;
      });
    }
  },

  {
    "name": "MD031",
    "desc": "Fenced code blocks should be surrounded by blank lines",
    "func": function MD031(params, errors) {
      // Some parsers have trouble detecting fenced code blocks without
      // surrounding whitespace, so examine the lines directly.
      var lines = padAndTrim(params.lines);
      var inCode = false;
      lines.forEach(function forLine(line, lineNumber) {
        if (line.match(/^(```|~~~)/)) {
          inCode = !inCode;
          if ((inCode && lines[lineNumber - 1].length) ||
              (!inCode && lines[lineNumber + 1].length)) {
            errors.push(lineNumber);
          }
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
      var inCode = false;
      var prevLine = "";
      params.lines.forEach(function forLine(line, lineNumber) {
        if (!inCode) {
          var listMarker = line.trim().match(/^([\*\+\-]|(\d+\.))\s/);
          if (listMarker && !inList && !prevLine.match(/^($|\s)/)) {
            errors.push(lineNumber + 1);
          } else if (!listMarker && inList && !line.match(/^($|\s)/)) {
            errors.push(lineNumber);
          }
          inList = listMarker;
        }
        if (line.trim().match(/^(```|~~~)/)) {
          inCode = !inCode;
          inList = false;
        }
        prevLine = line;
      });
    }
  }
];
