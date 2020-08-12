# markdownlint-rule-helpers

> A collection of `markdownlint` helper functions for custom rules

## Overview

The [Markdown](https://en.wikipedia.org/wiki/Markdown) linter
[`markdownlint`](https://github.com/DavidAnson/markdownlint) offers a variety of built-in validation
[rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md) and supports the
creation of [custom rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/CustomRules.md).
The internal rules share various helper functions; this package exposes those for reuse by custom rules.

## API

_Undocumented_ - This package exports the internal functions as-is. The APIs were not originally meant
to be public, are not officially supported, and may change from release to release. There are brief
descriptive comments above each function, but no [JSDoc](https://en.m.wikipedia.org/wiki/JSDoc)
annotations. That said, some of what's here will be useful to custom rule authors and may avoid
duplicating code.

## Example

```js
const { forEachLine, getLineMetadata } = require("markdownlint-rule-helpers");

module.exports = {
  "names": [ "every-n-lines" ],
  "description": "Rule that reports an error every N lines",
  "tags": [ "test" ],
  "function": (params, onError) => {
    const n = params.config.n || 2;
    forEachLine(getLineMetadata(params), (line, lineIndex) => {
      const lineNumber = lineIndex + 1;
      if ((lineNumber % n) === 0) {
        onError({
          "lineNumber": lineNumber,
          "detail": "Line number " + lineNumber
        });
      }
    });
  }
};
```

See also: [`markdownlint` built-in rule implementations](https://github.com/DavidAnson/markdownlint/tree/main/lib).

## Tests

_None_ - The entire body of code is tested to 100% coverage by the core `markdownlint` project,
so there are no additional tests here.
