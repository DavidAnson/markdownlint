"use strict";

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
    "name": "MD002",
    "desc": "First header should be a h1 header",
    "func": function MD002(tokens) {
      var errors = [];
      tokens.every(function forToken(token) {
        if ((token.type === "heading_open") && (token.hLevel !== 1)) {
          errors.push(token.lines[0] + 1);
          return false;
        }
        return true;
      });
      return errors;
    }
  },

  {
    "name": "MD031",
    "desc": "Fenced code blocks should be surrounded by blank lines",
    "func": function MD031(tokens, lines) {
      // Some parsers have trouble detecting fenced code blocks without
      // surrounding whitespace, so examine the lines directly.
      lines = padAndTrim(lines);
      var errors = [];
      var inCode = false;
      lines.forEach(function forLine(line, lineNum) {
        if (line.match(/^(```|~~~)/)) {
          inCode = !inCode;
          if ((inCode && lines[lineNum - 1].length) ||
              (!inCode && lines[lineNum + 1].length)) {
            errors.push(lineNum);
          }
        }
      });
      return errors;
    }
  },

  {
    "name": "MD032",
    "desc": "Lists should be surrounded by blank lines",
    "func": function MD032(tokens, lines) {
      // Some parsers have trouble detecting lists without surrounding
      // whitespace, so examine the lines directly.
      var errors = [];
      var inList = false;
      var inCode = false;
      var prevLine = "";
      lines.forEach(function forLine(line, lineNum) {
        if (!inCode) {
          var listMarker = line.trim().match(/^([\*\+\-]|(\d+\.))\s/);
          if (listMarker && !inList && !prevLine.match(/^($|\s)/)) {
            errors.push(lineNum + 1);
          } else if (!listMarker && inList && !line.match(/^($|\s)/)) {
            errors.push(lineNum);
          }
          inList = listMarker;
        }
        if (line.trim().match(/^(```|~~~)/)) {
          inCode = !inCode;
          inList = false;
        }
        prevLine = line;
      });
      return errors;
    }
  }
];
