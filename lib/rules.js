"use strict";

function lineNumberFrom(token) {
  return token.lines[0] + 1;
}

function indentFrom(token, lines) {
  var line = lines[token.lines[0]];
  return line.length - line.trimLeft().length;
}

function headingStyleFrom(token, lines) {
  if ((token.lines[1] - token.lines[0]) === 1) {
    if (lines[token.lines[0]].match(/#\s*$/)) {
      return "atx_closed";
    }
    return "atx";
  }
  return "setext";
}

function unorderedListStyleFrom(token, lines) {
  switch (lines[token.lines[0]].trim().substr(0, 1)) {
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
          errors.push(lineNumberFrom(token));
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
            errors.push(lineNumberFrom(token));
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
        style = headingStyleFrom(headings[0], params.lines);
      }
      headings.forEach(function forToken(token) {
        if (headingStyleFrom(token, params.lines) !== style) {
          errors.push(lineNumberFrom(token));
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
        style = unorderedListStyleFrom(listItems[0], params.lines);
      }
      listItems.forEach(function forToken(token) {
        if (unorderedListStyleFrom(token, params.lines) !== style) {
          errors.push(lineNumberFrom(token));
        }
      });
    }
  },

  {
    "name": "MD005",
    "desc": "Inconsistent indentation for list items at the same level",
    "func": function MD005(params, errors) {
      var listItems = params.tokens.filter(function filterToken(token) {
        return (token.type === "list_item_open");
      });
      var indentLevels = [];
      listItems.forEach(function forToken(token) {
        var indentLevel = indentFrom(token, params.lines);
        if (!indentLevels[token.level]) {
          indentLevels[token.level] = indentLevel;
        } else if (indentLevel !== indentLevels[token.level]) {
          errors.push(lineNumberFrom(token));
        }
      });
    }
  },

  {
    "name": "MD007",
    "desc": "Unordered list indentation",
    "func": function MD007(params, errors) {
      var optionsIndent = params.options.indent || 2;
      var bulletLists = params.tokens.filter(function filterToken(token) {
        return (token.type === "bullet_list_open");
      });
      var prevIndent = 0;
      bulletLists.forEach(function forToken(token) {
        var indent = indentFrom(token, params.lines);
        if ((indent > prevIndent) &&
            ((indent - prevIndent) !== optionsIndent)) {
          errors.push(lineNumberFrom(token));
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
