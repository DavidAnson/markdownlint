// @ts-check

"use strict";

const { addError, bareUrlRe, forEachLine, unescapeMarkdown } =
  require("../helpers");
const { lineMetadata } = require("./cache");

const htmlElementRe = /<(\w+)(?:[^>]*)?>/g;
const linkDestinationRe = /]\(\s*$/;

module.exports = {
  "names": [ "MD033", "no-inline-html" ],
  "description": "Inline HTML",
  "tags": [ "html" ],
  "function": function MD033(params, onError) {
    const allowedElements = (params.config.allowed_elements || [])
      .map((element) => element.toLowerCase());
    forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
      let match = null;
      // eslint-disable-next-line no-unmodified-loop-condition
      while (!inCode && (match = htmlElementRe.exec(line))) {
        const [ tag, element ] = match;
        if (!allowedElements.includes(element.toLowerCase()) &&
          !tag.endsWith("\\>") && !bareUrlRe.test(tag)) {
          const prefix = line.substring(0, match.index);
          if (!linkDestinationRe.test(prefix) &&
            !unescapeMarkdown(prefix + "<", "_").endsWith("_")) {
            addError(onError, lineIndex + 1, "Element: " + element,
              null, [ match.index + 1, tag.length ]);
          }
        }
      }
    });
  }
};
