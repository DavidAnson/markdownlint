module.exports = {
  "name": "MD041",
  "desc": "First line in file should be a top level header",
  "tags": [ "headers" ],
  "aliases": [ "first-line-h1" ],
  "regexp": null,
  "func": function MD041(params, errors) {
    var level = params.options.level || 1;
    var frontMatterTitle = params.options.front_matter_title;
    var tag = "h" + level;
    var frontMatterTitleRe =
      new RegExp(frontMatterTitle || "^\\s*title:", "i");
    params.tokens.every(function forToken(token, index) {
      if (token.type === "heading_open") {
        if (!((token.lineNumber === 1) || (index > 0)) ||
            (token.tag !== tag)) {
          errors.addContext(token.lineNumber, token.line);
        }
        return false;
      } else if (token.type === "html_block") {
        return true;
      }
      if (((frontMatterTitle !== undefined) && !frontMatterTitle) ||
        !params.frontMatterLines.some(function forLine(line) {
          return frontMatterTitleRe.test(line);
        })) {
        errors.addContext(token.lineNumber, token.line);
      }
      return false;
    });
  }
};
