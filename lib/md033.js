// @ts-check

"use strict";

const {
  addError, forEachLine, overlapsAnyRange, unescapeMarkdown
} = require("../helpers");
const { codeBlockAndSpanRanges, lineMetadata } = require("./cache");

const htmlElementRe = /<(([A-Za-z][A-Za-z0-9-]*)(?:\s[^>]*)?)\/?>/g;
const linkDestinationRe = /]\(\s*$/;
// See https://spec.commonmark.org/0.29/#autolinks
const emailAddressRe =
  // eslint-disable-next-line max-len
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

module.exports = {
  "names": [ "MD033", "no-inline-html" ],
  "description": "Inline HTML",
  "tags": [ "html" ],
  "function": function MD033(params, onError) {
    let allowedElements = params.config.allowed_elements;
    allowedElements = Array.isArray(allowedElements) ? allowedElements : [];
    allowedElements = allowedElements.map((element) => element.toLowerCase());
    const exclusions = codeBlockAndSpanRanges();
    forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
      let match = null;
      // eslint-disable-next-line no-unmodified-loop-condition
      while (!inCode && ((match = htmlElementRe.exec(line)) !== null)) {
        const [ tag, content, element ] = match;
        if (
          !allowedElements.includes(element.toLowerCase()) &&
          !tag.endsWith("\\>") &&
          !emailAddressRe.test(content) &&
          !overlapsAnyRange(exclusions, lineIndex, match.index, match[0].length)
        ) {
          const prefix = line.substring(0, match.index);
          if (!linkDestinationRe.test(prefix)) {
            const unescaped = unescapeMarkdown(prefix + "<", "_");
            if (!unescaped.endsWith("_")) {
              addError(onError, lineIndex + 1, "Element: " + element,
                null, [ match.index + 1, tag.length ]);
            }
          }
        }
      }
    });
  }
};
