// @ts-check

"use strict";

const { addError, allPunctuationNoQuestion, endOfLineGemojiCodeRe,
  endOfLineHtmlEntityRe, escapeForRegExp } = require("../helpers");
const { filterByTypes } = require("../helpers/micromark.cjs");


module.exports = {
  "names": [ "MD026", "no-trailing-punctuation" ],
  "description": "Trailing punctuation in heading",
  "tags": [ "headings" ],
  "function": function MD026(params, onError) {
    let punctuation = params.config.punctuation;
    punctuation = String(
      (punctuation === undefined) ? allPunctuationNoQuestion : punctuation
    );
    const trailingPunctuationRe =
      new RegExp("\\s*[" + escapeForRegExp(punctuation) + "]+$");
    const headings = filterByTypes(
      params.parsers.micromark.tokens,
      [ "atxHeadingText", "setextHeadingText" ]
    );
    for (const heading of headings) {
      const { endColumn, endLine, text } = heading;
      const match = trailingPunctuationRe.exec(text);
      if (
        match &&
        !endOfLineHtmlEntityRe.test(text) &&
        !endOfLineGemojiCodeRe.test(text)
      ) {
        const fullMatch = match[0];
        const length = fullMatch.length;
        const column = endColumn - length;
        addError(
          onError,
          endLine,
          `Punctuation: '${fullMatch}'`,
          undefined,
          [ column, length ],
          {
            "editColumn": column,
            "deleteCount": length
          }
        );
      }
    }
  }
};
