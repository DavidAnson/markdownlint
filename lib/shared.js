"use strict";

// Regular expression for matching common newline characters
module.exports.newLineRe = /\r\n|\r|\n/;

// Regular expression for matching common front matter
module.exports.frontMatterRe = /^---$[^]*?^---$(\r\n|\r|\n)/m;

// Regular expression for matching inline disable/enable comments
module.exports.inlineCommentRe =
  /<!--\s*markdownlint-(dis|en)able((?:\s+[a-z0-9_\-]+)*)\s*-->/ig;

// readFile options for reading with the UTF-8 encoding
module.exports.utf8Encoding = { "encoding": "utf8" };

// Applies key/value pairs from src to dst, returning dst
function assign(dst, src) {
  Object.keys(src).forEach(function forKey(key) {
    dst[key] = src[key];
  });
  return dst;
}
module.exports.assign = assign;

// Clones the key/value pairs of obj, returning the clone
module.exports.clone = function clone(obj) {
  return assign({}, obj);
};
