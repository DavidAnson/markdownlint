// @ts-check

"use strict";

const { addErrorContext } = require("../helpers");
const { filterByTypes, filterByPredicate, getTokenTextByType } =
  require("../helpers/micromark.cjs");

const isInlineLink = ({ children }) => children.some(
  ({ type }) => type === "resource"
);

const getNestedTokenTextByType = (tokens, type) => getTokenTextByType(
  filterByTypes(tokens, [ type ]),
  type
);

const definitionDestinationForId = (tokens, id) => {
  const definitions = filterByTypes(tokens, [ "definition" ]);
  const definition = filterByPredicate(
    definitions,
    (d) => getNestedTokenTextByType([ d ], "definitionLabelString") ===
      id
  );
  if (definition.length > 0) {
    return getNestedTokenTextByType(
      definition,
      "definitionDestination"
    );
  }
  return null;
};

const fixInfo = (tokens, link) => {
  if (isInlineLink(link)) {
    return null;
  }
  const reference = getNestedTokenTextByType([ link ], "reference");
  const label = getNestedTokenTextByType([ link ], "labelText");
  // parser incorrectly calls ID a label when parsing [id] without label
  const id = reference && reference !== "[]" ?
    reference.replace(/^\[|\]$/g, "") :
    label;

  const destination = definitionDestinationForId(tokens, id);
  if (destination) {
    return {
      "editColumn": reference ?
        link.endColumn - reference.length :
        link.endColumn,
      "deleteCount": reference ? reference.length : 0,
      "insertText": `(${destination})`
    };
  }
  return null;
};

module.exports = {
  "names": [ "MD054", "link-image-style" ],
  "description": "Link and image style",
  "tags": [ "images", "links" ],
  "function": function MD054({ parsers, config }, onError) {
    let style = String(config.style || "consistent");
    const links = filterByTypes(
      parsers.micromark.tokens,
      [ "link", "image" ]
    );

    for (const link of links) {
      const inlineLink = isInlineLink(link);
      if (style === "consistent") {
        style = inlineLink ? "inline" : "reference";
      }
      if (
        (style === "inline" && !inlineLink) ||
        (style === "reference" && inlineLink)
      ) {
        addErrorContext(
          onError,
          link.startLine,
          link.text,
          null,
          null,
          null,
          fixInfo(parsers.micromark.tokens, link)
        );
      }
    }
  }
};
