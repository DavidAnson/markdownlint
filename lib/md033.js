// @ts-check

"use strict";

const { addError } = require("../helpers");
const { filterByTypes, getHtmlTagInfo } = require("../helpers/micromark.cjs");

const nextLinesRe = /[\r\n][\s\S]*$/;

module.exports = {
  "names": [ "MD033", "no-inline-html" ],
  "description": "Inline HTML",
  "tags": [ "html" ],
  "function": function MD033(params, onError) {
    let allowedElements = params.config.allowed_elements;
    allowedElements = Array.isArray(allowedElements) ? allowedElements : [];
    allowedElements = allowedElements.map((element) => element.toLowerCase());
    const pending = [ params.parsers.micromark.tokens ];
    let current = null;
    while ((current = pending.shift())) {
      const tokens = current;
      for (const token of filterByTypes(tokens, [ "htmlFlow", "htmlText" ])) {
        if (token.type === "htmlText") {
          const htmlTagInfo = getHtmlTagInfo(token);
          if (
            htmlTagInfo &&
            !htmlTagInfo.close &&
            !allowedElements.includes(htmlTagInfo.name.toLowerCase())
          ) {
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
        } else {
          // token.type === "htmlFlow"
          pending.push(token.htmlFlowChildren);
        }
      }
    }
  }
};
