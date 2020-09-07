# Custom Rules

In addition to its built-in rules, `markdownlint` lets you enhance the linting experience by passing a list of custom rules using the
[`options.customRules` property](../README.md#optionscustomrules).
Custom rules can do everything the built-in rules can and are defined inline or imported from another package
([keyword `markdownlint-rule` on npm](https://www.npmjs.com/search?q=keywords:markdownlint-rule)).
Custom rules can be disabled, enabled, and customized using the same syntax as built-in rules.

## Authoring

Rules are defined by a name (or multiple names), a description, an optional link to more information, one or more tags, and a function that implements
the rule's behavior.
That function is called once for each file/string input and is passed the parsed input and a function to log any violations.

A simple rule implementation looks like:

```js
module.exports = {
  "names": [ "any-blockquote" ],
  "description": "Rule that reports an error for any blockquote",
  "information": new URL("https://example.com/rules/any-blockquote"),
  "tags": [ "test" ],
  "function": function rule(params, onError) {
    params.tokens.filter(function filterToken(token) {
      return token.type === "blockquote_open";
    }).forEach(function forToken(blockquote) {
      var lines = blockquote.map[1] - blockquote.map[0];
      onError({
        "lineNumber": blockquote.lineNumber,
        "detail": "Blockquote spans " + lines + " line(s).",
        "context": blockquote.line.substr(0, 7)
      });
    });
  }
};
```

A rule is implemented as an `Object` with one optional and four required properties:

- `names` is a required `Array` of `String` values that identify the rule in output messages and config.
- `description` is a required `String` value that describes the rule in output messages.
- `information` is an optional (absolute) `URL` of a link to more information about the rule.
- `tags` is a required `Array` of `String` values that groups related rules for easier customization.
- `function` is a required synchronous `Function` that implements the rule and is passed two parameters:
  - `params` is an `Object` with properties that describe the content being analyzed:
    - `name` is a `String` that identifies the input file/string.
    - `tokens` is an `Array` of [`markdown-it` `Token` objects](https://markdown-it.github.io/markdown-it/#Token)
       with added `line` and `lineNumber` properties.
    - `lines` is an `Array` of `String` values corresponding to the lines of the input file/string.
    - `frontMatterLines` is an `Array` of `String` values corresponding to any front matter (not present in `lines`).
    - `config` is an `Object` corresponding to the rule's entry in `options.config` (if present).
  - `onError` is a function that takes a single `Object` parameter with one required and four optional properties:
    - `lineNumber` is a required `Number` specifying the 1-based line number of the error.
    - `details` is an optional `String` with information about what caused the error.
    - `context` is an optional `String` with relevant text surrounding the error location.
    - `range` is an optional `Array` with two `Number` values identifying the 1-based column and length of the error.
    - `fixInfo` is an optional `Object` with information about how to fix the error (all properties are optional, but
      at least one of `deleteCount` and `insertText` should be present; when applying a fix, the delete should be
      performed before the insert):
      - `lineNumber` is an optional `Number` specifying the 1-based line number of the edit.
      - `editColumn` is an optional `Number` specifying the 1-based column number of the edit.
      - `deleteCount` is an optional `Number` specifying the number of characters to delete (the value `-1` is used to delete the line).
      - `insertText` is an optional `String` specifying the text to insert. `\n` is the platform-independent way to add
        a line break; line breaks should be added at the beginning of a line instead of at the end).

The collection of helper functions shared by the built-in rules is available for use by custom rules in the
[markdownlint-rule-helpers package](https://www.npmjs.com/package/markdownlint-rule-helpers).

## Examples

- [Simple rules used by the project's test cases](../test/rules)
- [Code for all `markdownlint` built-in rules](../lib)
- [Package configuration for publishing to npm](../test/rules/npm)
  - Packages should export a single rule object or an `Array` of rule objects
- [Custom rules from the Microsoft/vscode-docs-authoring repository](https://github.com/microsoft/vscode-docs-authoring/tree/master/packages/docs-linting/markdownlint-custom-rules)
- [Custom rules from the axibase/docs-util repository](https://github.com/axibase/docs-util/tree/master/linting-rules)
- [Custom rules from the webhintio/hint repository](https://github.com/webhintio/hint/blob/master/scripts/lint-markdown.js)

## References

- [CommonMark documentation and specification](https://commonmark.org/)
- [`markdown-it` Markdown parser project page](https://github.com/markdown-it/markdown-it)

## Params

The Markdown document:

```markdown
# Title

Text *text* text.
```

Yields the `params` object:

```json
{
  "name": "doc/example.md",
  "tokens": [
    {
      "type": "heading_open",
      "tag": "h1",
      "attrs": null,
      "map": [ 0, 1 ],
      "nesting": 1,
      "level": 0,
      "children": null,
      "content": "",
      "markup": "#",
      "info": "",
      "meta": null,
      "block": true,
      "hidden": false,
      "line": "# Title",
      "lineNumber": 1
    },
    {
      "type": "inline",
      "tag": "",
      "attrs": null,
      "map": [ 0, 1 ],
      "nesting": 0,
      "level": 1,
      "children": [
        {
          "type": "text",
          "tag": "",
          "attrs": null,
          "map": null,
          "nesting": 0,
          "level": 0,
          "children": null,
          "content": "Title",
          "markup": "",
          "info": "",
          "meta": null,
          "block": false,
          "hidden": false,
          "lineNumber": 1,
          "line": "# Title"
        }
      ],
      "content": "Title",
      "markup": "",
      "info": "",
      "meta": null,
      "block": true,
      "hidden": false,
      "line": "# Title",
      "lineNumber": 1
    },
    {
      "type": "heading_close",
      "tag": "h1",
      "attrs": null,
      "map": null,
      "nesting": -1,
      "level": 0,
      "children": null,
      "content": "",
      "markup": "#",
      "info": "",
      "meta": null,
      "block": true,
      "hidden": false
    },
    {
      "type": "paragraph_open",
      "tag": "p",
      "attrs": null,
      "map": [ 2, 3 ],
      "nesting": 1,
      "level": 0,
      "children": null,
      "content": "",
      "markup": "",
      "info": "",
      "meta": null,
      "block": true,
      "hidden": false,
      "line": "Text *text* text.",
      "lineNumber": 3
    },
    {
      "type": "inline",
      "tag": "",
      "attrs": null,
      "map": [ 2, 3 ],
      "nesting": 0,
      "level": 1,
      "children": [
        {
          "type": "text",
          "tag": "",
          "attrs": null,
          "map": null,
          "nesting": 0,
          "level": 0,
          "children": null,
          "content": "Text ",
          "markup": "",
          "info": "",
          "meta": null,
          "block": false,
          "hidden": false,
          "lineNumber": 3,
          "line": "Text *text* text."
        },
        {
          "type": "em_open",
          "tag": "em",
          "attrs": null,
          "map": null,
          "nesting": 1,
          "level": 1,
          "children": null,
          "content": "",
          "markup": "*",
          "info": "",
          "meta": null,
          "block": false,
          "hidden": false,
          "lineNumber": 3,
          "line": "Text *text* text."
        },
        {
          "type": "text",
          "tag": "",
          "attrs": null,
          "map": null,
          "nesting": 0,
          "level": 1,
          "children": null,
          "content": "text",
          "markup": "",
          "info": "",
          "meta": null,
          "block": false,
          "hidden": false,
          "lineNumber": 3,
          "line": "Text *text* text."
        },
        {
          "type": "em_close",
          "tag": "em",
          "attrs": null,
          "map": null,
          "nesting": -1,
          "level": 0,
          "children": null,
          "content": "",
          "markup": "*",
          "info": "",
          "meta": null,
          "block": false,
          "hidden": false,
          "lineNumber": 3,
          "line": "Text *text* text."
        },
        {
          "type": "text",
          "tag": "",
          "attrs": null,
          "map": null,
          "nesting": 0,
          "level": 0,
          "children": null,
          "content": " text.",
          "markup": "",
          "info": "",
          "meta": null,
          "block": false,
          "hidden": false,
          "lineNumber": 3,
          "line": "Text *text* text."
        }
      ],
      "content": "Text *text* text.",
      "markup": "",
      "info": "",
      "meta": null,
      "block": true,
      "hidden": false,
      "line": "Text *text* text.",
      "lineNumber": 3
    },
    {
      "type": "paragraph_close",
      "tag": "p",
      "attrs": null,
      "map": null,
      "nesting": -1,
      "level": 0,
      "children": null,
      "content": "",
      "markup": "",
      "info": "",
      "meta": null,
      "block": true,
      "hidden": false
    }
  ],
  "lines": [
    "# Title",
    "",
    "Text *text* text.",
    ""
  ],
  "frontMatterLines": [],
  "config": {
    "customValue1": "abc",
    "customValue2": 123
  }
}
```
