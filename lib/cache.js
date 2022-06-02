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

let htmlElementRanges = null;
module.exports.htmlElementRanges = (value) => {
  if (value) {
    htmlElementRanges = value;
  }
  return htmlElementRanges;
};

let lineMetadata = null;
module.exports.lineMetadata = (value) => {
  if (value) {
    lineMetadata = value;
  }
  return lineMetadata;
};

let referenceLinkImageData = null;
module.exports.referenceLinkImageData = (value) => {
  if (value) {
    referenceLinkImageData = value;
  }
  return referenceLinkImageData;
};

module.exports.clear = () => {
  codeBlockAndSpanRanges = null;
  flattenedLists = null;
  htmlElementRanges = null;
  lineMetadata = null;
  referenceLinkImageData = null;
};
