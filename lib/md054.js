// @ts-check

"use strict";

const { addErrorContext, nextLinesRe } = require("../helpers");
const { filterByTypes, filterByPredicate, getTokenTextByType } =
  require("../helpers/micromark.cjs");
const { referenceLinkImageData } = require("./cache");

const backslashEscapeRe = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g;
const removeBackslashEscapes = (text) => text.replace(backslashEscapeRe, "$1");
const autolinkDisallowedRe = /[ <>]/;
const autolinkAble = (destination) => {
  try {
    // eslint-disable-next-line no-new
    new URL(destination);
  } catch {
    // Not an absolute URL
    return false;
  }
  return !autolinkDisallowedRe.test(destination);
};

module.exports = {
  "names": [ "MD054", "link-image-style" ],
  "description": "Link and image style",
  "tags": [ "images", "links" ],
  "function": ({ parsers, config }, onError) => {
    const autolink = (config.autolink === undefined) || !!config.autolink;
    const inline = (config.inline === undefined) || !!config.inline;
    const reference = (config.reference === undefined) || !!config.reference;
    if (autolink && inline && reference) {
      // Everything allowed, nothing to check
      return;
    }
    const { definitions } = referenceLinkImageData();
    const links = filterByTypes(
      parsers.micromark.tokens,
      [ "autolink", "image", "link" ]
    );
    for (const link of links) {
      let label = null;
      let destination = null;
      const {
        children, endColumn, endLine, startColumn, startLine, text, type
      } = link;
      const image = (type === "image");
      let isError = false;
      if (type === "autolink") {
        // link kind is an autolink
        destination = getTokenTextByType(children, "autolinkProtocol");
        label = destination;
        isError = !autolink;
      } else {
        // link type is "image" or "link"
        const descendents = filterByPredicate(children);
        label = getTokenTextByType(descendents, "labelText");
        destination =
          getTokenTextByType(descendents, "resourceDestinationString");
        if (destination) {
          // link kind is an inline link
          isError = !inline;
        } else {
          // link kind is a reference link
          const referenceLabel =
            getTokenTextByType(descendents, "referenceString") || label;
          const definition = definitions.get(referenceLabel);
          destination = definition && definition[1];
          isError = !reference && destination;
        }
      }
      if (isError) {
        let range = null;
        let fixInfo = null;
        if (startLine === endLine) {
          range = [ startColumn, endColumn - startColumn ];
          let insertText = null;
          if (inline && label) {
            // Most useful form
            const prefix = (image ? "!" : "");
            const escapedLabel = label.replace(/[[\]]/g, "\\$&");
            const escapedDestination = destination.replace(/[()]/g, "\\$&");
            insertText = `${prefix}[${escapedLabel}](${escapedDestination})`;
          } else if (autolink && !image && autolinkAble(destination)) {
            // Simplest form
            insertText = `<${removeBackslashEscapes(destination)}>`;
          }
          if (insertText) {
            fixInfo = {
              "editColumn": range[0],
              insertText,
              "deleteCount": range[1]
            };
          }
        }
        addErrorContext(
          onError,
          startLine,
          text.replace(nextLinesRe, ""),
          null,
          null,
          range,
          fixInfo
        );
      }
    }
  }
};
