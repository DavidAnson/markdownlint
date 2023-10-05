// @ts-check

"use strict";

const { addError } = require("../helpers");
const { filterByTypes, getHtmlTagInfo } = require("../helpers/micromark.cjs");

const nextLinesRe = /[\r\n][\s\S]*$/;

module.exports = {
  "names": [ "MD045", "no-alt-text" ],
  "description": "Images should have alternate text (alt text)",
  "tags": [ "accessibility", "images" ],
  "function": function MD045(params, onError) {
    const images = filterByTypes(params.parsers.micromark.tokens, [ "image" ]);
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

    const html = filterByTypes(params.parsers.micromark.tokens, [ "htmlText" ]);
    for (const token of html) {
      const htmlTagInfo = getHtmlTagInfo(token);
      if (htmlTagInfo && htmlTagInfo.name.toLowerCase() === "img") {
        const hasAltAttribute = new RegExp(/alt=/i);
        if (!hasAltAttribute.test(token.text)) {
          const range = [
            token.startColumn,
            token.text.replace(nextLinesRe, "").length
          ];
          addError(
            onError,
            token.startLine,
            "Element: " + htmlTagInfo.name,
            undefined,
            range
          );
        }
      }
    }
  }
};
