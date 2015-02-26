"use strict";

function lineNumberFrom(token) {
  return token.lines[0] + 1;
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
    "func": function MD001(errors, tokens) {
      var prevLevel = 0;
      tokens.filter(function filterToken(token) {
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
    "func": function MD002(errors, tokens) {
      tokens.every(function forToken(token) {
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
    "name": "MD031",
    "desc": "Fenced code blocks should be surrounded by blank lines",
    "func": function MD031(errors, tokens, lines) {
      // Some parsers have trouble detecting fenced code blocks without
      // surrounding whitespace, so examine the lines directly.
      lines = padAndTrim(lines);
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
    "func": function MD032(errors, tokens, lines) {
      // Some parsers have trouble detecting lists without surrounding
      // whitespace, so examine the lines directly.
      var inList = false;
      var inCode = false;
      var prevLine = "";
      lines.forEach(function forLine(line, lineNumber) {
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
