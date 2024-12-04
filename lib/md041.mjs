// @ts-check

import { addErrorContext, frontMatterHasTitle } from "../helpers/helpers.cjs";
import { filterByTypes, getHeadingLevel, getHtmlTagInfo, isHtmlFlowComment, nonContentTokens } from "../helpers/micromark-helpers.cjs";

/** @type {import("markdownlint").Rule} */
export default {
  "names": [ "MD041", "first-line-heading", "first-line-h1" ],
  "description": "First line in a file should be a top-level heading",
  "tags": [ "headings" ],
  "parser": "micromark",
  "function": function MD041(params, onError) {
    const level = Number(params.config.level || 1);
    if (!frontMatterHasTitle(params.frontMatterLines, params.config.front_matter_title)) {
      params.parsers.micromark.tokens
        .filter((token) => !nonContentTokens.has(token.type) && !isHtmlFlowComment(token))
        .every((token) => {
          let isError = true;
          if ((token.type === "atxHeading") || (token.type === "setextHeading")) {
            isError = (getHeadingLevel(token) !== level);
          } else if (token.type === "htmlFlow") {
            const htmlTexts = filterByTypes(token.children, [ "htmlText" ], true);
            const tagInfo = (htmlTexts.length > 0) && getHtmlTagInfo(htmlTexts[0]);
            isError = !tagInfo || (tagInfo.name.toLowerCase() !== `h${level}`);
          }
          if (isError) {
            addErrorContext(onError, token.startLine, params.lines[token.startLine - 1]);
          }
          return false;
        });
    }
  }
};
