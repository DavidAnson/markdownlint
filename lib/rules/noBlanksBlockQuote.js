module.exports = {
  "name": "MD028",
  "desc": "Blank line inside blockquote",
  "tags": [ "blockquote", "whitespace" ],
  "aliases": [ "no-blanks-blockquote" ],
  "regexp": null,
  "func": function MD028(params, errors) {
    var prevToken = {};
    params.tokens.forEach(function forToken(token) {
      if ((token.type === "blockquote_open") &&
          (prevToken.type === "blockquote_close")) {
        errors.add(token.lineNumber - 1);
      }
      prevToken = token;
    });
  }
};
