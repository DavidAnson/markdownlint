module.exports = {
  "name": "MD002",
  "desc": "First header should be a top level header",
  "tags": [ "headers" ],
  "aliases": [ "first-header-h1" ],
  "regexp": null,
  "func": function MD002(params, errors) {
    var level = params.options.level || 1;
    var tag = "h" + level;
    params.tokens.every(function forToken(token) {
      if (token.type === "heading_open") {
        errors.addDetailIf(token.lineNumber, tag, token.tag);
        return false;
      }
      return true;
    });
  }
};
