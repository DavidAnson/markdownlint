// @ts-check

"use strict";

let flattenedLists = null;
module.exports.flattenedLists = (value) => {
  if (value) {
    flattenedLists = value;
  }
  return flattenedLists;
};

let inlineCodeSpanRanges = null;
module.exports.inlineCodeSpanRanges = (value) => {
  if (value) {
    inlineCodeSpanRanges = value;
  }
  return inlineCodeSpanRanges;
};

let lineMetadata = null;
module.exports.lineMetadata = (value) => {
  if (value) {
    lineMetadata = value;
  }
  return lineMetadata;
};

module.exports.clear = () => {
  flattenedLists = null;
  inlineCodeSpanRanges = null;
  lineMetadata = null;
};
