// @ts-check

"use strict";

let codeBlockAndSpanRanges = null;
module.exports.codeBlockAndSpanRanges = (value) => {
  if (value) {
    codeBlockAndSpanRanges = value;
  }
  return codeBlockAndSpanRanges;
};

let flattenedLists = null;
module.exports.flattenedLists = (value) => {
  if (value) {
    flattenedLists = value;
  }
  return flattenedLists;
};

let lineMetadata = null;
module.exports.lineMetadata = (value) => {
  if (value) {
    lineMetadata = value;
  }
  return lineMetadata;
};

module.exports.clear = () => {
  codeBlockAndSpanRanges = null;
  flattenedLists = null;
  lineMetadata = null;
};
