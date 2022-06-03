// @ts-check

"use strict";

const map = new Map();

module.exports.set = (keyValuePairs) => {
  for (const [ key, value ] of Object.entries(keyValuePairs)) {
    map.set(key, value);
  }
};
module.exports.clear = () => map.clear();

module.exports.codeBlockAndSpanRanges =
  () => map.get("codeBlockAndSpanRanges");
module.exports.flattenedLists =
  () => map.get("flattenedLists");
module.exports.htmlElementRanges =
  () => map.get("htmlElementRanges");
module.exports.lineMetadata =
  () => map.get("lineMetadata");
module.exports.referenceLinkImageData =
  () => map.get("referenceLinkImageData");
