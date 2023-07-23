// @ts-check

"use strict";

const { addErrorContext } = require("../helpers");
const { filterByTypes, filterByPredicate, getTokenTextByType } =
  require("../helpers/micromark.cjs");

const isInlineLink = ({ children }) => children.some(
  ({ type }) => type === "resource"
);

const isAutolink = ({ type }) => type === "autolink";

const getNestedTokenTextByType = (tokens, type) => getTokenTextByType(
  filterByTypes(tokens, [ type ]),
  type
);

const escapeParentheses = (unescaped) => unescaped.replace(/([()])/g, "\\$1");
const escapeSquares = (unescaped) => unescaped.replace(/([[\]])/g, "\\$1");
const escapeAngles = (unescaped) => unescaped.replace(/([<>])/g, "\\$1");

const unescapeParentheses = (escaped) => escaped.replace(/\\([()])/g, "$1");
const unescapeAngles = (escaped) => escaped.replace(/\\([<>])/g, "$1");

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

const autolinkFixInfo = (tokens, link) => {
  if (isAutolink(link)) {
    return null;
  }
  if (isInlineLink(link)) {
    const destination = getNestedTokenTextByType(
      [ link ],
      "resourceDestination"
    );
    if (destination) {
      return {
        "insertText": `<${escapeAngles(unescapeParentheses(destination))}>`,
        "deleteCount": link.endColumn - link.startColumn
      };
    }
  } else {
    const reference = getNestedTokenTextByType([ link ], "reference");
    const label = getNestedTokenTextByType([ link ], "labelText");
    // parser incorrectly calls ID a label when parsing [id] without label
    const id = reference && reference !== "[]" ?
      reference.replace(/^\[/, "").replace(/\]$/, "") :
      label;

    const destination = definitionDestinationForId(tokens, id);
    if (destination) {
      return {
        "editColumn": link.startColumn,
        "deleteCount": link.endColumn - link.startColumn,
        "insertText": `<${escapeAngles(destination)}>`
      };
    }
  }
  return null;
};

const fixInfo = (tokens, link) => {
  if (isInlineLink(link)) {
    return null;
  }
  if (isAutolink(link)) {
    const destination = getNestedTokenTextByType([ link ], "autolinkProtocol");
    if (destination) {
      const label = escapeSquares(unescapeAngles(destination));
      const reference = escapeParentheses(unescapeAngles(destination));
      return {
        "insertText": `[${label}](${reference})`,
        "deleteCount": link.endColumn - link.startColumn
      };
    }
  } else {
    const reference = getNestedTokenTextByType([ link ], "reference");
    const label = getNestedTokenTextByType([ link ], "labelText");
    // parser incorrectly calls ID a label when parsing [id] without label
    const id = reference && reference !== "[]" ?
      reference.replace(/^\[/, "").replace(/\]$/, "") :
      label;

    const destination = definitionDestinationForId(tokens, id);
    if (destination) {
      return {
        "editColumn": reference ?
          link.endColumn - reference.length :
          link.endColumn,
        "deleteCount": reference ? reference.length : 0,
        "insertText": `(${escapeParentheses(destination)})`
      };
    }
  }
  return null;
};

const forLink = (style, tokens, onError, link) => {
  const inlineLink = isInlineLink(link);
  const autolink = isAutolink(link);

  const range = [ link.startColumn, link.endColumn - link.startColumn ];
  if (style === "autolink_only" && !autolink) {
    addErrorContext(
      onError,
      link.startLine,
      link.text,
      null,
      null,
      range,
      autolinkFixInfo(tokens, link)
    );
  } else if (style === "inline_only" && (!inlineLink || autolink)) {
    addErrorContext(
      onError,
      link.startLine,
      link.text,
      null,
      null,
      range,
      fixInfo(tokens, link)
    );
  } else if (
    (style === "reference_only" && (inlineLink || autolink)) ||
    (style === "inline_or_reference" && autolink) ||
    (style === "inline_or_autolink" && !inlineLink && !autolink) ||
    (style === "reference_or_autolink" && inlineLink)
  ) {
    addErrorContext(
      onError,
      link.startLine,
      link.text,
      null,
      null,
      range,
      null
    );
  }
};

const MD054 = ({ parsers, config }, onError) => {
  const style = String(config.style || "mixed");
  const links = filterByTypes(
    parsers.micromark.tokens,
    [ "autolink", "link", "image" ]
  );
  for (const link of links) {
    forLink(style, parsers.micromark.tokens, onError, link);
  }
};

module.exports = {
  "names": [ "MD054", "link-image-style" ],
  "description": "Link and image style",
  "tags": [ "images", "links" ],
  "function": MD054
};
