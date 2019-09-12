// @ts-check

"use strict";

const { addError, allPunctuation, escapeForRegExp, forEachHeading } =
  require("../helpers");

module.exports = {
  "names": [ "MD026", "no-trailing-punctuation" ],
  "description": "Trailing punctuation in heading",
  "tags": [ "headings", "headers" ],
  "function": function MD026(params, onError) {
    let punctuation = params.config.punctuation;
    if (punctuation === undefined) {
      punctuation = allPunctuation;
    }
    const trailingPunctuationRe =
      new RegExp("\\s*[" + escapeForRegExp(punctuation) + "]+$");
    forEachHeading(params, (heading) => {
      const { line, lineNumber } = heading;
      const trimmedLine = line.replace(/[\s#]*$/, "");
      const match = trailingPunctuationRe.exec(trimmedLine);
      if (match) {
        const fullMatch = match[0];
        const column = match.index + 1;
        const length = fullMatch.length;
        addError(
          onError,
          lineNumber,
          `Punctuation: '${fullMatch}'`,
          null,
          [ column, length ],
          {
            "editColumn": column,
            "deleteCount": length
          }
        );
      }
    });
  }
};
