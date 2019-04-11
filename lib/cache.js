// @ts-check

"use strict";

let lineMetadata = null;
module.exports.lineMetadata = (value) => {
  if (value) {
    lineMetadata = value;
  }
  return lineMetadata;
};

let flattenedLists = null;
module.exports.flattenedLists = (value) => {
  if (value) {
    flattenedLists = value;
  }
  return flattenedLists;
};

module.exports.clear = () => {
  lineMetadata = null;
  flattenedLists = null;
};
