// @ts-check

"use strict";

const shared = require("./shared");

const labelRe = /^\s*\[.*[^\\]]:/;

module.exports = {
  "names": [ "MD013", "line-length" ],
  "description": "Line length",
  "tags": [ "line_length" ],
  "function": function MD013(params, onError) {
    const lineLength = params.config.line_length || 80;
    const codeBlocks = params.config.code_blocks;
    const includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
    const tables = params.config.tables;
    const includeTables = (tables === undefined) ? true : !!tables;
    let headings = params.config.headings;
    if (headings === undefined) {
      headings = params.config.headers;
    }
    const includeHeadings = (headings === undefined) ? true : !!headings;
    const headingLineNumbers = [];
    if (!includeHeadings) {
      shared.forEachHeading(params, function forHeading(heading) {
        headingLineNumbers.push(heading.lineNumber);
      });
    }
    const tokenTypeMap = {
      "em_open": "e",
      "em_close": "E",
      "link_open": "l",
      "link_close": "L",
      "strong_open": "s",
      "strong_close": "S",
      "text": "T"
    };
    const linkOnlyLineNumbers = [];
    shared.filterTokens(params, "inline", function forToken(token) {
      let childTokenTypes = "";
      token.children.forEach(function forChild(child) {
        if (child.type !== "text" || child.content !== "") {
          childTokenTypes += tokenTypeMap[child.type] || "x";
        }
      });
      if (/^[es]*lT?L[ES]*$/.test(childTokenTypes)) {
        linkOnlyLineNumbers.push(token.lineNumber);
      }
    });
    const longLineRe = new RegExp("^(.{" + lineLength + "})(.*\\s.*)$");
    shared.forEachLine(
      function forLine(line, lineIndex, inCode, onFence, inTable) {
        const lineNumber = lineIndex + 1;
        if ((includeCodeBlocks || !inCode) &&
            (includeTables || !inTable) &&
            (includeHeadings || (headingLineNumbers.indexOf(lineNumber)) < 0) &&
            (linkOnlyLineNumbers.indexOf(lineNumber) < 0) &&
            longLineRe.test(line) &&
            !labelRe.test(line)) {
          shared.addErrorDetailIf(onError, lineNumber, lineLength,
            line.length, null, shared.rangeFromRegExp(line, longLineRe));
        }
      });
  }
};
