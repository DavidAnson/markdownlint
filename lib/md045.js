// @ts-check

"use strict";

const { addError } = require("../helpers");
const { filterByTypes, getHtmlTagInfo } = require("../helpers/micromark.cjs");

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
      if (htmlTagInfo && htmlTagInfo.name === "img") {
        const isImage = new RegExp(/<img.*>/);
        const hasAltAttribute = new RegExp(/<img.*alt=.*>/);
        if (isImage.test(token.text) && !hasAltAttribute.test(token.text)) {
          const range = (token.startLine === token.endLine) ?
            [ token.startColumn, token.endColumn - token.startColumn ] :
            undefined;
          addError(
            onError,
            token.startLine,
            undefined,
            undefined,
            range
          );
        }
      }
    }
  }
};
