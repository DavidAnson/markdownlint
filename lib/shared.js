"use strict";

// Regular expression for matching common newline characters
module.exports.newLineRe = /\r\n|\r|\n/;

// Regular expression for matching common front matter
module.exports.frontMatterRe = /^---$[^]*?^---$(\r\n|\r|\n)/m;

// readFile options for reading with the UTF-8 encoding
module.exports.utf8Encoding = { "encoding": "utf8" };
