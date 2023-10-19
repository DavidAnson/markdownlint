// @ts-check

"use strict";

const { addError, getHtmlAttributeRe, nextLinesRe } = require("../helpers");
const { filterByTypes, getHtmlTagInfo } = require("../helpers/micromark.cjs");

const altRe = getHtmlAttributeRe("alt");

module.exports = {
  "names": [ "MD045", "no-alt-text" ],
  "description": "Images should have alternate text (alt text)",
  "tags": [ "accessibility", "images" ],
  "function": function MD045(params, onError) {
    const { tokens } = params.parsers.micromark;

    // Process Markdown images
    const images = filterByTypes(tokens, [ "image" ]);
    for (const image of images) {
      const labelTexts = filterByTypes(image.children, [ "labelText" ]);
      if (labelTexts.some((labelText) => labelText.text.length === 0)) {
        const range = (image.startLine === image.endLine) ?
          [ image.startColumn, image.endColumn - image.startColumn ] :
          undefined;
        addError(
          onError,
          image.startLine,
          undefined,
          undefined,
          range
        );
      }
    }

    // Process HTML images
    const htmlTexts = filterByTypes(tokens, [ "htmlText" ]);
    for (const htmlText of htmlTexts) {
      const { startColumn, startLine, text } = htmlText;
      const htmlTagInfo = getHtmlTagInfo(htmlText);
      if (
        htmlTagInfo &&
        !htmlTagInfo.close &&
        (htmlTagInfo.name.toLowerCase() === "img") &&
        !altRe.test(text)
      ) {
        const range = [
          startColumn,
          text.replace(nextLinesRe, "").length
        ];
        addError(
          onError,
          startLine,
          undefined,
          undefined,
          range
        );
      }
    }
  }
};
