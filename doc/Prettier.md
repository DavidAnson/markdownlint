# Using markdownlint with Prettier

[`Prettier`](https://prettier.io) is a popular code formatter.
For the most part, Prettier works seamlessly with `markdownlint`.

You can extend from the `markdownlint/style/prettier.json` style to disable all Markdownlint rules that overlap with Prettier.

Special situations when not extending `prettier.json` are documented below.

## List item indentation

The default settings of `markdownlint` and `Prettier` are compatible and don't
result in any linting violations. If `Prettier` is used with `--tab-width` set
to `4`, the following `markdownlint` configuration can be used:

```json
{
  "MD007": {
    "indent": 4
  },
  "MD030": {
    "ul_single": 3,
    "ul_multi": 3
  }
}
```
