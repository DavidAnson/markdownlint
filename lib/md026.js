// @ts-check

"use strict";

const { addError, allPunctuationNoQuestion, escapeForRegExp, forEachHeading } =
  require("../helpers");

const endOfLineHtmlEntityRe = /&#?[\da-zA-Z]+;$/;

module.exports = {
  "names": [ "MD026", "no-trailing-punctuation" ],
  "description": "Trailing punctuation in heading",
  "tags": [ "headings", "headers" ],
  "function": function MD026(params, onError) {
    let punctuation = params.config.punctuation;
    punctuation = String(
      (punctuation === undefined) ? allPunctuationNoQuestion : punctuation
    );
    const trailingPunctuationRe =
      new RegExp("\\s*[" + escapeForRegExp(punctuation) + "]+$");
    forEachHeading(params, (heading) => {
      const { line, lineNumber } = heading;
      const trimmedLine = line.replace(/([^\s#])[\s#]+$/, "$1");
      const match = trailingPunctuationRe.exec(trimmedLine);
      if (match && !endOfLineHtmlEntityRe.test(trimmedLine)) {
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
