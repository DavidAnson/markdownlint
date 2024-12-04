// @ts-check

import { getReferenceLinkImageData as helpersGetReferenceLinkImageData } from "../helpers/helpers.cjs";
import { filterByTypes } from "../helpers/micromark-helpers.cjs";

/** @type {Map<string, object>} */
const map = new Map();
let params = undefined;

/**
 * Initializes (resets) the cache.
 *
 * @param {import("markdownlint").RuleParams} [p] Rule parameters object.
 * @returns {void}
 */
export function initialize(p) {
  map.clear();
  params = p;
}

/**
 * Gets a cached object value - computes it and caches it.
 *
 * @param {string} name Cache object name.
 * @param {Function} getValue Getter for object value.
 * @returns {Object} Object value.
 */
function getCached(name, getValue) {
  if (map.has(name)) {
    return map.get(name);
  }
  const value = getValue();
  map.set(name, value);
  return value;
}

/**
 * Filters a list of Micromark tokens by type and caches the result.
 *
 * @param {import("markdownlint").MicromarkTokenType[]} types Types to allow.
 * @param {boolean} [htmlFlow] Whether to include htmlFlow content.
 * @returns {import("markdownlint").MicromarkToken[]} Filtered tokens.
 */
export function filterByTypesCached(types, htmlFlow) {
  return getCached(
    // eslint-disable-next-line prefer-rest-params
    JSON.stringify(arguments),
    () => filterByTypes(params.parsers.micromark.tokens, types, htmlFlow)
  );
}

/**
 * Gets a reference link and image data object.
 *
 * @returns {Object} Reference link and image data object.
 */
export function getReferenceLinkImageData() {
  return getCached(
    getReferenceLinkImageData.name,
    () => helpersGetReferenceLinkImageData(params.parsers.micromark.tokens)
  );
}
