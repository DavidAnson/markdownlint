// @ts-check

import { addErrorContext } from "../helpers/helpers.cjs";
import { filterByTypesCached } from "./cache.mjs";

const defaultBannedNames = [
  "click here",
  "here",
  "learn more",
  "link",
  "more",
  "read more"
];

/**
 * Downcases a string and strips extra white spaces and punctuations.
 *
 * @param {string} text String to transform
 * @returns {string} Stripped and downcased string
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/\W+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** @type {import("markdownlint").Rule} */
export default {
  "names": [ "MD059", "descriptive-link-text" ],
  "description": "Links should have a descriptive name",
  "tags": [ "links", "accessibility" ],
  "parser": "micromark",
  "function": function MD059(params, onError) {
    // Allow consumer to define their own banned names list.
    const bannedNames = params.config.banned_names_override || defaultBannedNames;
    const labels = filterByTypesCached([ "label" ])
      .filter((label) => label.parent?.type === "link");

    for (const label of labels) {
      const labelTexts = label.children.filter((child) => child.type === "labelText");
      for (const labelText of labelTexts) {
        const { text } = label;
        if (bannedNames.includes(normalizeText(text))) {
          addErrorContext(onError, labelText.startLine, text);
        }
      }
    }
  }
};
