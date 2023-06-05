// @ts-check

"use strict";

const { addErrorContext } = require("../helpers");
const { filterByTypes, filterByPredicate, getTokenTextByType } =
  require("../helpers/micromark.cjs");

const isInlineLink = ({ children }) => children.some(
  ({ type }) => type === "resource"
);

const getNestedTokenByType = (tokens, type) => getTokenTextByType(
  filterByTypes(tokens, [ type ]),
  type
);

const fixInfo = (tokens, link) => {
  if (isInlineLink(link)) {
    return null;
  }
  const label = getNestedTokenByType([ link ], "labelText");
  const definitions = filterByTypes(tokens, [ "definition" ]);

  const definition = filterByPredicate(
    definitions,
    (d) => getNestedTokenByType([ d ], "definitionLabelString") === label
  );

  if (definition.length > 0) {
    const destination = getNestedTokenByType(
      definition,
      "definitionDestination"
    );
    return {
      "editColumn": link.endColumn,
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
    let style = String(config.style || "consistent").trim();
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
