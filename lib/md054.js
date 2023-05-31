// @ts-check

"use strict";

const { addErrorContext } = require("../helpers");
const { filterByTypes } = require("../helpers/micromark.cjs");

module.exports = {
  "names": [ "MD054", "link-style" ],
  "description": "Link style",
  "tags": [ "images", "links" ],
  "function": function MD054(params, onError) {
    const links = filterByTypes(
      params.parsers.micromark.tokens,
      [ "link", "image" ]
    );
    const isReferenceLink = ({ children }) => !children.some(
      ({ type }) => type === "resource"
    );
    const isInlineLink = ({ children }) => children.some(
      ({ type }) => type === "resource"
    );
    const referenceLinks = links.filter(isReferenceLink);
    const inlineLinks = links.filter(isInlineLink);

    for (const token of referenceLinks) {
      if (
        (params.config.style === "consistent" && inlineLinks.length > 0) ||
          params.config.style === "inline"
      ) {
        const range = [
          token.startColumn,
          token.endColumn - token.startColumn
        ];
        addErrorContext(
          onError,
          token.startLine,
          token.text,
          null,
          null,
          range
        );
      }
    }
    for (const token of inlineLinks) {
      if (
        (params.config.style === "consistent" && referenceLinks.length > 0) ||
          params.config.style === "reference"
      ) {
        const range = [
          token.startColumn,
          token.endColumn - token.startColumn
        ];
        addErrorContext(
          onError,
          token.startLine,
          token.text,
          null,
          null,
          range
        );
      }
    }
  }
};
