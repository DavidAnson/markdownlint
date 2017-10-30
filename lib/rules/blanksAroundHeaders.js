module.exports = {
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
};
