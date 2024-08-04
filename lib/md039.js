// @ts-check

"use strict";

const { addErrorContext } = require("../helpers");
const { filterByTypes } = require("../helpers/micromark.cjs");
const { referenceLinkImageData } = require("./cache");

// eslint-disable-next-line jsdoc/valid-types
/** @type import("./markdownlint").Rule */
module.exports = {
  "names": [ "MD039", "no-space-in-links" ],
  "description": "Spaces inside link text",
  "tags": [ "whitespace", "links" ],
  "parser": "micromark",
  "function": function MD039(params, onError) {
    const { definitions } = referenceLinkImageData();
    const labels = filterByTypes(
      params.parsers.micromark.tokens,
      [ "label" ]
    ).filter((label) => label.parent?.type === "link");
    for (const label of labels) {
      const labelTexts = filterByTypes(label.children, [ "labelText" ]);
      for (const labelText of labelTexts) {
        const leftSpace =
          labelText.text.trimStart().length !== labelText.text.length;
        const rightSpace =
          labelText.text.trimEnd().length !== labelText.text.length;
        if (
          (leftSpace || rightSpace) &&
          // Ignore non-shortcut link content "[ text ]"
          ((label.parent?.children.length !== 1) || definitions.has(labelText.text.trim()))
        ) {
          // eslint-disable-next-line no-undef-init
          let range = undefined;
          if (label.startLine === label.endLine) {
            const labelColumn = label.startColumn;
            const labelLength = label.endColumn - label.startColumn;
            range = [ labelColumn, labelLength ];
          }
          // eslint-disable-next-line no-undef-init
          let fixInfo = undefined;
          if (labelText.startLine === labelText.endLine) {
            const textColumn = labelText.startColumn;
            const textLength = labelText.endColumn - labelText.startColumn;
            fixInfo = {
              "editColumn": textColumn,
              "deleteCount": textLength,
              "insertText": labelText.text.trim()
            };
          }
          addErrorContext(
            onError,
            labelText.startLine,
            label.text.replace(/\s+/g, " "),
            leftSpace,
            rightSpace,
            range,
            fixInfo
          );
        }
      }
    }
  }
};
