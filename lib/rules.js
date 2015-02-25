"use strict";

function padAndTrim(lines) {
  return [].concat(
    "",
    lines.map(function mapLine(line) {
      return line.trim();
    }),
    "");
}

module.exports = {
  "MD031": function MD031(lines) {
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
};
