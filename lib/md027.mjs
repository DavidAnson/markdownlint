// @ts-check

import { addErrorContext } from "../helpers/helpers.cjs";
import { filterByTypesCached } from "./cache.mjs";

/** @type {import("markdownlint").Rule} */
export default {
  "names": [ "MD027", "no-multiple-space-blockquote" ],
  "description": "Multiple spaces after blockquote symbol",
  "tags": [ "blockquote", "whitespace", "indentation" ],
  "parser": "micromark",
  "function": function MD027(params, onError) {
    const { tokens } = params.parsers.micromark;
    for (const token of filterByTypesCached([ "linePrefix" ])) {
      const parent = token.parent;
      const codeIndented = parent?.type === "codeIndented";
      const siblings = parent?.children || tokens;
      if (
        !codeIndented &&
        (siblings[siblings.indexOf(token) - 1]?.type === "blockQuotePrefix")
      ) {
        const { startColumn, startLine, text } = token;
        const { length } = text;
        const line = params.lines[startLine - 1];
        addErrorContext(
          onError,
          startLine,
          line,
          undefined,
          undefined,
          [ startColumn, length ],
          {
            "editColumn": startColumn,
            "deleteCount": length
          }
        );
      }
    }
  }
};
