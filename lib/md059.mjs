// @ts-check

import { addErrorContext, stripAndDowncaseText } from "../helpers/helpers.cjs";
import { validLink } from "../helpers/micromark-helpers.cjs";
import { getReferenceLinkImageData, filterByTypesCached } from "./cache.mjs";

const defaultBannedNames = [
  "read more",
  "learn more",
  "more",
  "here",
  "click here",
  "link"
];

/** @type {import("markdownlint").Rule} */
export default {
  "names": [ "MD059", "no-generic-link-name" ],
  "description": "No generic link name",
  "tags": [ "links", "accessibility" ],
  "parser": "micromark",
  "function": function MD059(params, onError) {
    const { definitions } = getReferenceLinkImageData();

    // Allow consumer to define their own banned names list.

    const bannedNames = params.config.banned_names_override || defaultBannedNames;
    const labels = filterByTypesCached([ "label" ])
      .filter((label) => label.parent?.type === "link");

    for (const label of labels) {
      const labelTexts = label.children.filter((child) => child.type === "labelText");
      for (const labelText of labelTexts) {
        const text = labelText.text;
        if (validLink(label, labelText, definitions) && bannedNames.includes(stripAndDowncaseText(text))) {
          addErrorContext(onError, labelText.startLine, text);
        }
      }
    }
  }
};
