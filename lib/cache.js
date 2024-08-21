// @ts-check

"use strict";

const map = new Map();

module.exports.set = (keyValuePairs) => {
  for (const [ key, value ] of Object.entries(keyValuePairs)) {
    map.set(key, value);
  }
};
module.exports.clear = () => map.clear();

module.exports.referenceLinkImageData =
  () => map.get("referenceLinkImageData");
