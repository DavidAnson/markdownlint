"use strict";

// Regular expression for matching common newline characters
module.exports.newLineRe = /\r\n|\r|\n/;

// Regular expression for matching common front matter (YAML and TOML)
module.exports.frontMatterRe = /^(---|\+\+\+)$[^]*?^\1$(\r\n|\r|\n)/m;

// Regular expression for matching inline disable/enable comments
var inlineCommentRe =
  /<!--\s*markdownlint-(dis|en)able((?:\s+[a-z0-9_-]+)*)\s*-->/ig;
module.exports.inlineCommentRe = inlineCommentRe;

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

// Replaces the text of all properly-formatted HTML comments with whitespace
// This preserves the line/column information for the rest of the document
// Trailing whitespace is avoided with a '\' character in the last column
// See https://www.w3.org/TR/html5/syntax.html#comments for details
var htmlCommentBegin = "<!--";
var htmlCommentEnd = "-->";
function clearHtmlCommentText(text) {
  var i = 0;
  while ((i = text.indexOf(htmlCommentBegin, i)) !== -1) {
    var j = text.indexOf(htmlCommentEnd, i);
    if (j === -1) {
      j = text.length;
      text += "\\";
    }
    var comment = text.slice(i + htmlCommentBegin.length, j);
    if ((comment.length > 0) &&
        (comment[0] !== ">") &&
        (comment[comment.length - 1] !== "-") &&
        (comment.indexOf("--") === -1) &&
        (text.slice(i, j + htmlCommentEnd.length)
          .search(inlineCommentRe) === -1)) {
      var blanks = comment
        .replace(/[^\r\n]/g, " ")
        .replace(/ ([\r\n])/g, "\\$1");
      text = text.slice(0, i + htmlCommentBegin.length) +
        blanks + text.slice(j);
    }
    i = j + htmlCommentEnd.length;
  }
  return text;
}
module.exports.clearHtmlCommentText = clearHtmlCommentText;
