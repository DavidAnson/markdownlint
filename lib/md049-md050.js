// @ts-check

"use strict";

const { addError, emphasisOrStrongStyleFor } = require("../helpers");
const { filterByPredicate, tokenIfType } = require("../helpers/micromark.cjs");

const intrawordRe = /\w/;

const impl =
  (params, onError, type, asterisk, underline, style = "consistent") => {
    const { lines, parsers } = params;
    const emphasisTokens = filterByPredicate(
      parsers.micromark.tokens,
      (token) => token.type === type,
      (token) => ((token.type === "htmlFlow") ? [] : token.children)
    );
    for (const token of emphasisTokens) {
      const { children } = token;
      const childType = `${type}Sequence`;
      const startSequence = tokenIfType(children[0], childType);
      const endSequence = tokenIfType(children[children.length - 1], childType);
      if (startSequence && endSequence) {
        const markupStyle = emphasisOrStrongStyleFor(startSequence.text);
        if (style === "consistent") {
          style = markupStyle;
        }
        if (style !== markupStyle) {
          const underscoreIntraword = (style === "underscore") && (
            intrawordRe.test(
              lines[startSequence.startLine - 1][startSequence.startColumn - 2]
            ) ||
            intrawordRe.test(
              lines[endSequence.endLine - 1][endSequence.endColumn - 1]
            )
          );
          if (!underscoreIntraword) {
            for (const sequence of [ startSequence, endSequence ]) {
              addError(
                onError,
                sequence.startLine,
                `Expected: ${style}; Actual: ${markupStyle}`,
                undefined,
                [ sequence.startColumn, sequence.text.length ],
                {
                  "editColumn": sequence.startColumn,
                  "deleteCount": sequence.text.length,
                  "insertText": (style === "asterisk") ? asterisk : underline
                }
              );
            }
          }
        }
      }
    }
  };

module.exports = [
  {
    "names": [ "MD049", "emphasis-style" ],
    "description": "Emphasis style should be consistent",
    "tags": [ "emphasis" ],
    "function": function MD049(params, onError) {
      return impl(
        params,
        onError,
        "emphasis",
        "*",
        "_",
        params.config.style || undefined
      );
    }
  },
  {
    "names": [ "MD050", "strong-style" ],
    "description": "Strong style should be consistent",
    "tags": [ "emphasis" ],
    "function": function MD050(params, onError) {
      return impl(
        params,
        onError,
        "strong",
        "**",
        "__",
        params.config.style || undefined
      );
    }
  }
];
