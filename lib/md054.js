// @ts-check

"use strict";

const { addErrorContext } = require("../helpers");
const {
  filterByTypes,
  filterByPredicate,
  getTokenTextByType
} = require("../helpers/micromark.cjs");

const isInlineLink = ({ children }) => children.some(
  ({ type }) => type === "resource"
);

const deepGetTokenTextByType = (tokens, type) => getTokenTextByType(
  filterByTypes(tokens, [ type ]),
  type
);

const fixInfo = (tokens, link) => {
  if (isInlineLink(link)) {
    return null;
  }
  const label = deepGetTokenTextByType([ link ], "labelText");
  const definitions = filterByTypes(tokens, [ "definition" ]);

  const definition = filterByPredicate(
    definitions,
    (d) => deepGetTokenTextByType([ d ], "definitionLabelString") === label
  );

  if (definition.length > 0) {
    const destination = deepGetTokenTextByType(
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
  "names": [ "MD054", "link-style" ],
  "description": "Link style",
  "tags": [ "images", "links" ],
  "function": function MD054({ parsers, config }, onError) {
    const links = filterByTypes(
      parsers.micromark.tokens,
      [ "link", "image" ]
    );

    const style = config.style;
    const consistentStyle = style === "consistent";

    let referenceLinksPresent = false;
    let inlineLinksPresent = false;
    for (const link of links) {
      if (isInlineLink(link)) {
        inlineLinksPresent = true;
      } else {
        referenceLinksPresent = true;
      }
    }

    for (const link of links) {
      if (
        (inlineLinksPresent && referenceLinksPresent && consistentStyle) ||
        (style === "inline" && !isInlineLink(link)) ||
        (style === "reference" && isInlineLink(link))
      ) {
        addErrorContext(
          onError,
          link.startLine,
          link.text,
          null,
          null,
          [
            link.startColumn,
            link.endColumn - link.startColumn
          ],
          fixInfo(parsers.micromark.tokens, link)
        );
      }
    }
  }
};
