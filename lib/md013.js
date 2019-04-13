// @ts-check

"use strict";

const { addErrorDetailIf, filterTokens, forEachHeading, forEachLine,
  includesSorted, rangeFromRegExp } = require("../helpers");
const { lineMetadata } = require("./cache");

const longLineRePrefix = "^(.{";
const longLineRePostfix = "})(.*\\s.*)$";
const labelRe = /^\s*\[.*[^\\]]:/;
const linkOnlyLineRe = /^[es]*lT?L[ES]*$/;
const tokenTypeMap = {
  "em_open": "e",
  "em_close": "E",
  "link_open": "l",
  "link_close": "L",
  "strong_open": "s",
  "strong_close": "S",
  "text": "T"
};

module.exports = {
  "names": [ "MD013", "line-length" ],
  "description": "Line length",
  "tags": [ "line_length" ],
  "function": function MD013(params, onError) {
    const lineLength = params.config.line_length || 80;
    const headingLineLength = params.config.heading_line_length || lineLength;
    const longLineRe =
      new RegExp(longLineRePrefix + lineLength + longLineRePostfix);
    const longHeadingLineRe =
      new RegExp(longLineRePrefix + headingLineLength + longLineRePostfix);
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
    forEachHeading(params, (heading) => {
      headingLineNumbers.push(heading.lineNumber);
    });
    const linkOnlyLineNumbers = [];
    filterTokens(params, "inline", (token) => {
      let childTokenTypes = "";
      token.children.forEach((child) => {
        if (child.type !== "text" || child.content !== "") {
          childTokenTypes += tokenTypeMap[child.type] || "x";
        }
      });
      if (linkOnlyLineRe.test(childTokenTypes)) {
        linkOnlyLineNumbers.push(token.lineNumber);
      }
    });
    forEachLine(lineMetadata(), (line, lineIndex, inCode, onFence, inTable) => {
      const lineNumber = lineIndex + 1;
      const isHeading = includesSorted(headingLineNumbers, lineNumber);
      const length = isHeading ? headingLineLength : lineLength;
      const lengthRe = isHeading ? longHeadingLineRe : longLineRe;
      if ((includeCodeBlocks || !inCode) &&
          (includeTables || !inTable) &&
          (includeHeadings || !isHeading) &&
          !includesSorted(linkOnlyLineNumbers, lineNumber) &&
          lengthRe.test(line) &&
          !labelRe.test(line)) {
        addErrorDetailIf(onError, lineNumber, length, line.length,
          null, null, rangeFromRegExp(line, lengthRe));
      }
    });
  }
};
