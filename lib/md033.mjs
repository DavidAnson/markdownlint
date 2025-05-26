// @ts-check

import { addError, nextLinesRe } from "../helpers/helpers.cjs";
import { getHtmlTagInfo, getParentOfType } from "../helpers/micromark-helpers.cjs";
import { filterByTypesCached } from "./cache.mjs";

/** @type {import("markdownlint").Rule} */
export default {
  "names": [ "MD033", "no-inline-html" ],
  "description": "Inline HTML",
  "tags": [ "html" ],
  "parser": "micromark",
  "function": function MD033(params, onError) {
    let allowedElements = params.config.allowed_elements;
    allowedElements = Array.isArray(allowedElements) ? allowedElements : [];
    allowedElements = allowedElements.map((element) => element.toLowerCase());
    let tableAllowedElements = params.config.table_allowed_elements;
    // if not defined, use allowedElements for backward compatibility
    tableAllowedElements = Array.isArray(tableAllowedElements) ? tableAllowedElements : allowedElements;
    tableAllowedElements = tableAllowedElements.map((element) => element.toLowerCase());
    for (const token of filterByTypesCached([ "htmlText" ], true)) {
      const htmlTagInfo = getHtmlTagInfo(token);
      const elementName = htmlTagInfo?.name.toLowerCase();
      const inTable = !!getParentOfType(token, [ "table" ]);
      if (
        htmlTagInfo &&
        !htmlTagInfo.close && !(
          (!inTable && allowedElements.includes(elementName)) ||
          (inTable && tableAllowedElements.includes(elementName))
        )
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
    }
  }
};
