// @ts-check

"use strict";

const { addErrorContext, bareUrlRe, withinAnyRange } = require("../helpers");
const { codeBlockAndSpanRanges, htmlElementRanges, referenceLinkImageData } =
  require("./cache");

const htmlLinkRe = /<a(?:|\s[^>]+)>[^<>]*<\/a\s*>/ig;

module.exports = {
  "names": [ "MD034", "no-bare-urls" ],
  "description": "Bare URL used",
  "tags": [ "links", "url" ],
  "function": function MD034(params, onError) {
    const { lines } = params;
    const codeExclusions = [
      ...codeBlockAndSpanRanges(),
      ...htmlElementRanges()
    ];
    const { definitionLineIndices } = referenceLinkImageData();
    for (const [ lineIndex, line ] of lines.entries()) {
      if (definitionLineIndices[0] === lineIndex) {
        definitionLineIndices.shift();
      } else {
        let match = null;
        const lineExclusions = [];
        while ((match = htmlLinkRe.exec(line)) !== null) {
          lineExclusions.push([ lineIndex, match.index, match[0].length ]);
        }
        while ((match = bareUrlRe.exec(line)) !== null) {
          const [ bareUrl ] = match;
          const matchIndex = match.index;
          const bareUrlLength = bareUrl.length;
          const prefix = line.slice(0, matchIndex);
          const postfix = line.slice(matchIndex + bareUrlLength);
          if (
            // Allow ](... to avoid reporting Markdown-style links
            !(/\]\(\s*$/.test(prefix)) &&
            // Allow <...> to avoid reporting non-bare links
            !(prefix.endsWith("<") && /^[#)]?>/.test(postfix)) &&
            // Allow [...] to avoid MD011/no-reversed-links and nested links
            !(/\[[^\]]*$/.test(prefix) && /^[^[]*\]/.test(postfix)) &&
            // Allow "..." and '...' for deliberately including a bare link
            !(prefix.endsWith("\"") && postfix.startsWith("\"")) &&
            !(prefix.endsWith("'") && postfix.startsWith("'")) &&
            !withinAnyRange(
              lineExclusions, lineIndex, matchIndex, bareUrlLength
            ) &&
            !withinAnyRange(
              codeExclusions, lineIndex, matchIndex, bareUrlLength
            )
          ) {
            const range = [
              matchIndex + 1,
              bareUrlLength
            ];
            const fixInfo = {
              "editColumn": range[0],
              "deleteCount": range[1],
              "insertText": `<${bareUrl}>`
            };
            addErrorContext(
              onError,
              lineIndex + 1,
              bareUrl,
              null,
              null,
              range,
              fixInfo
            );
          }
        }
      }
    }
  }
};
