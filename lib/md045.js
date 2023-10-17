// @ts-check

"use strict";

const { addError, nextLinesRe } = require("../helpers");
const { filterByTypes, getHtmlTagInfo } = require("../helpers/micromark.cjs");

module.exports = {
  "names": [ "MD045", "no-alt-text" ],
  "description": "Images should have alternate text (alt text)",
  "tags": [ "accessibility", "images" ],
  "function": function MD045(params, onError) {
    const tokens = params.parsers.micromark.tokens;
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

    const htmls = filterByTypes(tokens, [ "htmlText" ]);
    for (const html of htmls) {
      const htmlTagInfo = getHtmlTagInfo(html);
      if (htmlTagInfo && htmlTagInfo.name.toLowerCase() === "img") {
        const hasAltAttribute = new RegExp(/alt=/i);
        if (!hasAltAttribute.test(html.text)) {
          const range = [
            html.startColumn,
            html.text.replace(nextLinesRe, "").length
          ];
          addError(
            onError,
            html.startLine,
            "Element: " + htmlTagInfo.name,
            undefined,
            range
          );
        }
      }
    }
  }
};
