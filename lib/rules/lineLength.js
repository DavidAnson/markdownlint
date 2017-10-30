var shared = require("../shared");

module.exports = {
  "name": "MD013",
  "desc": "Line length",
  "tags": [ "line_length" ],
  "aliases": [ "line-length" ],
  "regexp": shared.longLineReFunc,
  "func": function MD013(params, errors) {
    var lineLength = params.options.line_length || shared.defaultLineLength;
    var codeBlocks = params.options.code_blocks;
    var includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
    var tables = params.options.tables;
    var includeTables = (tables === undefined) ? true : !!tables;
    var headers = params.options.headers;
    var includeHeaders = (headers === undefined) ? true : !!headers;
    var headerLineNumbers = [];
    if (!includeHeaders) {
      shared.forEachHeading(params, function forHeading(heading) {
        headerLineNumbers.push(heading.lineNumber);
      });
    }
    var linkOnlyLineNumbers = [];
    shared.filterTokens(params, "inline", function forToken(token) {
      if (((token.children.length === 2) || (token.children.length === 3)) &&
          (token.children[0].type === "link_open") &&
          (token.children[token.children.length - 1].type === "link_close")) {
        linkOnlyLineNumbers.push(token.lineNumber);
      }
    });
    var longLineRe = shared.longLineReFunc(params.options);
    var labelRe = /^\s*\[.*[^\\]]:/;
    shared.forEachLine(params,
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
};
