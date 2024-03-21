// @ts-check

"use strict";

const { addError, addErrorContext } = require("../helpers");
const { filterByTypes, getTokenTextByType, tokenIfType } =
  require("../helpers/micromark.cjs");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD040", "fenced-code-language" ],
  "description": "Fenced code blocks should have a language specified",
  "tags": [ "code", "language" ],
  "parser": "micromark",
  "function": function MD040(params, onError) {
    let allowed = params.config.allowed_languages;
    allowed = Array.isArray(allowed) ? allowed : [];
    const languageOnly = !!params.config.language_only;
    // eslint-disable-next-line jsdoc/valid-types
    /** @type import("../helpers/micromark.cjs").Token[] */
    const micromarkTokens =
      // @ts-ignore
      params.parsers.micromark.tokens;
    const fencedCodes = filterByTypes(micromarkTokens, [ "codeFenced" ]);
    for (const fencedCode of fencedCodes) {
      const openingFence = tokenIfType(fencedCode.children[0], "codeFencedFence");
      if (openingFence) {
        const { children, startLine, text } = openingFence;
        const info = getTokenTextByType(children, "codeFencedFenceInfo");
        if (!info) {
          addErrorContext(onError, startLine, text);
        } else if ((allowed.length > 0) && !allowed.includes(info)) {
          addError(onError, startLine, `"${info}" is not allowed`);
        }
        if (languageOnly && getTokenTextByType(children, "codeFencedFenceMeta")) {
          addError(onError, startLine, `Info string contains more than language: "${text}"`);
        }
      }
    }
  }
};
