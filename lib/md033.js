// @ts-check

"use strict";

const {
  addError, forEachLine, forEachInlineCodeSpan, unescapeMarkdown
} = require("../helpers");
const { lineMetadata } = require("./cache");

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

    // compute inline code spans bounds
    const codeSpanRanges = [];
    forEachInlineCodeSpan(
      params.lines.join("\n"),
      (code, lineIndex, columnIndex) => {
        const codeLines = code.split("\n");
        codeSpanRanges.push({
          "start": [ lineIndex, columnIndex ],
          "end": [
            lineIndex + codeLines.length - 1,
            codeLines.length > 1 ?
              codeLines[codeLines.length - 1].length + 1 :
              columnIndex + code.length + 1
          ]
        });
      });

    /**
     * Check if a HTML element is inside a code span.
     *
     * @param {number} lineIndex Index of line for HTML element found.
     * @param {number} elementIndex Index of HTML element start inside its line.
     * @param {string} elementContent Content of the HTML element.
     * @returns {boolean} True if HTML element is inside a code span.
     */
    function htmlInsideCodeSpan(lineIndex, elementIndex, elementContent) {
      let insideCodeSpan = false;
      for (const { start, end } of codeSpanRanges) {
        if (
          start[0] <= lineIndex &&
          end[0] >= lineIndex + elementContent.split("\n").length - 1 &&
          end[1] >= elementIndex + elementContent.length
        ) {
          insideCodeSpan = true;
          break;
        }
      }
      return insideCodeSpan;
    }

    forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
      let match = null;
      // eslint-disable-next-line no-unmodified-loop-condition
      while (!inCode && ((match = htmlElementRe.exec(line)) !== null)) {
        const [ tag, content, element ] = match;
        if (!htmlInsideCodeSpan(lineIndex, match.index, match[0]) &&
          !allowedElements.includes(element.toLowerCase()) &&
          !tag.endsWith("\\>") &&
          !emailAddressRe.test(content)) {
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
