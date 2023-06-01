// @ts-check

"use strict";

const { addErrorContext } = require("../helpers");
const {
  filterByTypes,
  filterByPredicate
} = require("../helpers/micromark.cjs");

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
        let fixInfo = null;
        const label = filterByTypes([ token ], [ "labelText" ])[0].text;
        const definitions = filterByTypes(
          params.parsers.micromark.tokens,
          [ "definition" ]
        );
        const definition = filterByPredicate(
          definitions,
          (d) => filterByTypes(
            [ d ],
            [ "definitionLabelString" ]
          )[0] &&
          filterByTypes([ d ], [ "definitionLabelString" ])[0].text === label);
        if (definition.length > 0) {
          const destination = filterByTypes(
            definition,
            [ "definitionDestination" ]
          )[0].text;
          fixInfo = {
            "editColumn": token.endColumn,
            "insertText": "(" + destination + ")"
          };
        }
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
          range,
          fixInfo
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
