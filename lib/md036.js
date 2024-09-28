// @ts-check

"use strict";

const { addErrorContext, allPunctuation } = require("../helpers");
const { getDescendantsByType } = require("../helpers/micromark-helpers.cjs");
const { filterByTypesCached } = require("./cache");

/** @typedef {import("../helpers/micromark-helpers.cjs").TokenType} TokenType */
/** @type {TokenType[][]} */
const emphasisTypes = [
  [ "emphasis", "emphasisText" ],
  [ "strong", "strongText" ]
];

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD036", "no-emphasis-as-heading" ],
  "description": "Emphasis used instead of a heading",
  "tags": [ "headings", "emphasis" ],
  "parser": "micromark",
  "function": function MD036(params, onError) {
    let punctuation = params.config.punctuation;
    punctuation = String((punctuation === undefined) ? allPunctuation : punctuation);
    const punctuationRe = new RegExp("[" + punctuation + "]$");
    const paragraphTokens =
      filterByTypesCached([ "paragraph" ])
        .filter((token) =>
          (token.parent?.type === "content") && !token.parent?.parent && (token.children.length === 1)
        );
    for (const emphasisType of emphasisTypes) {
      const textTokens = getDescendantsByType(paragraphTokens, emphasisType);
      for (const textToken of textTokens) {
        if (
          (textToken.children.length === 1) &&
          (textToken.children[0].type === "data") &&
          !punctuationRe.test(textToken.text)
        ) {
          addErrorContext(onError, textToken.startLine, textToken.text);
        }
      }
    }
  }
};
