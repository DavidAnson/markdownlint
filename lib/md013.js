// @ts-check

"use strict";

const { addErrorDetailIf, filterTokens, forEachHeading, forEachLine,
  includesSorted } = require("../helpers");
const { lineMetadata, referenceLinkImageData } = require("./cache");

const longLineRePrefix = "^.{";
const longLineRePostfixRelaxed = "}.*\\s.*$";
const longLineRePostfixStrict = "}.+$";
const linkOrImageOnlyLineRe = /^[es]*(?:lT?L|I)[ES]*$/;
const sternModeRe = /^(?:[#>\s]*\s)?\S*$/;
const tokenTypeMap = {
  "em_open": "e",
  "em_close": "E",
  "image": "I",
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
    const lineLength = Number(params.config.line_length || 80);
    const headingLineLength =
      Number(params.config.heading_line_length || lineLength);
    const codeLineLength =
      Number(params.config.code_block_line_length || lineLength);
    const strict = !!params.config.strict;
    const stern = !!params.config.stern;
    const longLineRePostfix =
      (strict || stern) ? longLineRePostfixStrict : longLineRePostfixRelaxed;
    const longLineRe =
      new RegExp(longLineRePrefix + lineLength + longLineRePostfix);
    const longHeadingLineRe =
      new RegExp(longLineRePrefix + headingLineLength + longLineRePostfix);
    const longCodeLineRe =
      new RegExp(longLineRePrefix + codeLineLength + longLineRePostfix);
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
      for (const child of token.children) {
        if (child.type !== "text" || child.content !== "") {
          childTokenTypes += tokenTypeMap[child.type] || "x";
        }
      }
      if (linkOrImageOnlyLineRe.test(childTokenTypes)) {
        linkOnlyLineNumbers.push(token.lineNumber);
      }
    });
    const { definitionLineIndices } = referenceLinkImageData();
    forEachLine(lineMetadata(), (line, lineIndex, inCode, onFence, inTable) => {
      const lineNumber = lineIndex + 1;
      const isHeading = includesSorted(headingLineNumbers, lineNumber);
      const length = inCode ?
        codeLineLength :
        (isHeading ? headingLineLength : lineLength);
      const lengthRe = inCode ?
        longCodeLineRe :
        (isHeading ? longHeadingLineRe : longLineRe);
      if ((includeCodeBlocks || !inCode) &&
          (includeTables || !inTable) &&
          (includeHeadings || !isHeading) &&
          !includesSorted(definitionLineIndices, lineIndex) &&
          (strict ||
           (!(stern && sternModeRe.test(line)) &&
            !includesSorted(linkOnlyLineNumbers, lineNumber))) &&
          lengthRe.test(line)) {
        addErrorDetailIf(
          onError,
          lineNumber,
          length,
          line.length,
          null,
          null,
          [ length + 1, line.length - length ]);
      }
    });
  }
};
