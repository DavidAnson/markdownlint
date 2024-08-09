// @ts-check

"use strict";

const { addError, withinAnyRange } = require("../helpers");
const { filterByTypes, getDescendantsByType } = require("../helpers/micromark.cjs");

const tabRe = /\t+/g;

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD010", "no-hard-tabs" ],
  "description": "Hard tabs",
  "tags": [ "whitespace", "hard_tab" ],
  "parser": "micromark",
  "function": function MD010(params, onError) {
    const codeBlocks = params.config.code_blocks;
    const includeCode = (codeBlocks === undefined) ? true : !!codeBlocks;
    const ignoreCodeLanguages = new Set(
      (params.config.ignore_code_languages || [])
        .map((language) => language.toLowerCase())
    );
    const spacesPerTab = params.config.spaces_per_tab;
    const spaceMultiplier = (spacesPerTab === undefined) ?
      1 :
      Math.max(0, Number(spacesPerTab));
    const exclusions = [];
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").TokenType[] */
    const exclusionTypes = [];
    if (includeCode) {
      if (ignoreCodeLanguages.size > 0) {
        exclusionTypes.push("codeFenced");
      }
    } else {
      exclusionTypes.push("codeFenced", "codeIndented", "codeText");
    }
    const codeTokens = filterByTypes(
      params.parsers.micromark.tokens,
      exclusionTypes
    ).filter((token) => {
      if ((token.type === "codeFenced") && (ignoreCodeLanguages.size > 0)) {
        const fenceInfos = getDescendantsByType(token, [ "codeFencedFence", "codeFencedFenceInfo" ]);
        return fenceInfos.every((fenceInfo) => ignoreCodeLanguages.has(fenceInfo.text.toLowerCase()));
      }
      return true;
    });
    for (const codeToken of codeTokens) {
      const codeFenced = (codeToken.type === "codeFenced");
      const startLine = codeToken.startLine + (codeFenced ? 1 : 0);
      const endLine = codeToken.endLine - (codeFenced ? 1 : 0);
      for (let lineNumber = startLine; lineNumber <= endLine; lineNumber++) {
        const startColumn =
          (lineNumber === codeToken.startLine) ? codeToken.startColumn : 1;
        const endColumn =
          (lineNumber === codeToken.endLine) ? codeToken.endColumn : params.lines[lineNumber - 1].length;
        exclusions.push([
          lineNumber,
          startColumn,
          endColumn - startColumn + 1
        ]);
      }
    }
    for (let lineIndex = 0; lineIndex < params.lines.length; lineIndex++) {
      const line = params.lines[lineIndex];
      let match = null;
      while ((match = tabRe.exec(line)) !== null) {
        const column = match.index + 1;
        const length = match[0].length;
        if (!withinAnyRange(exclusions, lineIndex + 1, column, length)) {
          addError(
            onError,
            lineIndex + 1,
            "Column: " + column,
            undefined,
            [ column, length ],
            {
              "editColumn": column,
              "deleteCount": length,
              "insertText": "".padEnd(length * spaceMultiplier)
            }
          );
        }
      }
    }
  }
};
