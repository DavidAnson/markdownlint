// @ts-check

"use strict";

var shared = require("./shared");

var labelRe = /^\s*\[.*[^\\]]:/;

module.exports = {
  "names": [ "MD013", "line-length" ],
  "description": "Line length",
  "tags": [ "line_length" ],
  "function": function MD013(params, onError) {
    var lineLength = params.config.line_length || 80;
    var codeBlocks = params.config.code_blocks;
    var includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
    var tables = params.config.tables;
    var includeTables = (tables === undefined) ? true : !!tables;
    var headers = params.config.headers;
    var includeHeaders = (headers === undefined) ? true : !!headers;
    var headerLineNumbers = [];
    if (!includeHeaders) {
      shared.forEachHeading(params, function forHeading(heading) {
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
    shared.filterTokens(params, "inline", function forToken(token) {
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
    var longLineRe = new RegExp("^(.{" + lineLength + "})(.*\\s.*)$");
    shared.forEachLine(
      function forLine(line, lineIndex, inCode, onFence, inTable) {
        var lineNumber = lineIndex + 1;
        if ((includeCodeBlocks || !inCode) &&
            (includeTables || !inTable) &&
            (includeHeaders || (headerLineNumbers.indexOf(lineNumber)) < 0) &&
            (linkOnlyLineNumbers.indexOf(lineNumber) < 0) &&
            longLineRe.test(line) &&
            !labelRe.test(line)) {
          shared.addErrorDetailIf(onError, lineNumber, lineLength,
            line.length, null, shared.rangeFromRegExp(line, longLineRe));
        }
      });
  }
};
