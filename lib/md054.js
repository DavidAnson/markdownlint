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

const escapeParentheses = (unescaped) => unescaped
  .replaceAll("(", "\\(")
  .replaceAll(")", "\\)");
const escapeSquares = (unescaped) => unescaped
  .replaceAll("[", "\\[")
  .replaceAll("]", "\\]");
const escapeAngles = (unescaped) => unescaped
  .replaceAll("<", "\\<")
  .replaceAll(">", "\\>");

const unescapeParentheses = (escaped) => escaped
  .replaceAll("\\(", "(")
  .replaceAll("\\)", ")");
const unescapeAngles = (escaped) => escaped
  .replaceAll("\\<", "<")
  .replaceAll("\\>", ">");

const referenceLinkDestination = (link, tokens) => {
  const reference = getNestedTokenTextByType([ link ], "reference");
  const id = reference && reference !== "[]" ?
    reference.replace(/^\[/, "").replace(/\]$/, "") :
    getNestedTokenTextByType([ link ], "labelText");

  const definition = filterByPredicate(
    filterByTypes(tokens, [ "definition" ]),
    (d) => getNestedTokenTextByType([ d ], "definitionLabelString") === id
  );
  return getNestedTokenTextByType(definition, "definitionDestination");
};

const inlineLinkDestination = (link) => {
  const text = getNestedTokenTextByType([ link ], "resourceDestination");
  return text && unescapeParentheses(text);
};

const autolinkDestination = (link) => {
  const text = getNestedTokenTextByType([ link ], "autolinkProtocol");
  return text && unescapeAngles(text);
};

const autolinkFixInfo = (tokens, link) => {
  if (isAutolink(link)) {
    return null;
  }

  const destination = isInlineLink(link) ?
    inlineLinkDestination(link) :
    referenceLinkDestination(link, tokens);

  return {
    "editColumn": link.startColumn,
    "insertText": `<${escapeAngles(destination)}>`,
    "deleteCount": link.endColumn - link.startColumn
  };
};

const inlineFixInfo = (tokens, link) => {
  if (isInlineLink(link)) {
    return null;
  }

  const destination = isAutolink(link) ?
    autolinkDestination(link) :
    referenceLinkDestination(link, tokens);

  return {
    "editColumn": link.startColumn,
    "insertText":
      `[${escapeSquares(destination)}](${escapeParentheses(destination)})`,
    "deleteCount": link.endColumn - link.startColumn
  };
};

module.exports = {
  "names": [ "MD054", "link-image-style" ],
  "description": "Link and image style",
  "tags": [ "images", "links" ],
  "function": ({ parsers, config }, onError) => {
    const style = String(config.style || "mixed");
    const links = filterByTypes(
      parsers.micromark.tokens,
      [ "autolink", "link", "image" ]
    );
    for (const link of links) {
      const inlineLink = isInlineLink(link);
      const autolink = isAutolink(link);

      const range = [ link.startColumn, link.endColumn - link.startColumn ];
      let fixInfo = null;
      if (style === "autolink_only") {
        fixInfo = autolinkFixInfo(parsers.micromark.tokens, link);
      } else if (style === "inline_only") {
        fixInfo = inlineFixInfo(parsers.micromark.tokens, link);
      }

      if (
        fixInfo ||
        (style === "reference_only" && (inlineLink || autolink)) ||
        (style === "inline_or_reference" && autolink) ||
        (style === "inline_or_autolink" && !(inlineLink || autolink)) ||
        (style === "reference_or_autolink" && inlineLink)
      ) {
        addErrorContext(
          onError,
          link.startLine,
          link.text,
          null,
          null,
          range,
          fixInfo
        );
      }
    }
  }
};
