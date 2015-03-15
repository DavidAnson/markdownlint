# markdownlint

> A Node.js style checker and lint tool for Markdown files.

## Install

```shell
npm install markdownlint --save-dev
```

## Overview

The [Markdown](http://en.wikipedia.org/wiki/Markdown) markup language is
designed to be easy to read, write, and understand. It succeeds - and its
flexibility is both a benefit and a drawback. Many styles are possible, so
formatting can be inconsistent. Some constructs don't work well in all
parsers and should be avoided.

`markdownlint` is a [static analysis](http://en.wikipedia.org/wiki/Static_program_analysis)
tool for [Node.js](https://nodejs.org/) and [io.js](https://iojs.org/) with a
library of rules to enforce standards and consistency for Markdown files. It
was inspired by - and heavily influenced by - Mark Harrison's
[markdownlint](https://github.com/mivok/markdownlint) for
[Ruby](https://www.ruby-lang.org/). The rules, rule documentation, and test
cases come directly from that project.

> If you need a Ruby implementation or a [CLI](http://en.wikipedia.org/wiki/Command-line_interface),
> please consider the [mdl](https://rubygems.org/gems/mdl) gem.

## Rules

* MD001 - Header levels should only increment by one level at a time
* MD002 - First header should be a h1 header
* MD003 - Header style
* MD004 - Unordered list style
* MD005 - Inconsistent indentation for list items at the same level
* MD006 - Consider starting bulleted lists at the beginning of the line
* MD007 - Unordered list indentation
* MD009 - Trailing spaces
* MD010 - Hard tabs
* MD011 - Reversed link syntax
* MD012 - Multiple consecutive blank lines
* MD013 - Line length
* MD014 - Dollar signs used before commands without showing output
* MD018 - No space after hash on atx style header
* MD019 - Multiple spaces after hash on atx style header
* MD020 - No space inside hashes on closed atx style header
* MD021 - Multiple spaces inside hashes on closed atx style header
* MD022 - Headers should be surrounded by blank lines
* MD023 - Headers must start at the beginning of the line
* MD024 - Multiple headers with the same content
* MD025 - Multiple top level headers in the same document
* MD026 - Trailing punctuation in header
* MD027 - Multiple spaces after blockquote symbol
* MD028 - Blank line inside blockquote
* MD029 - Ordered list item prefix
* MD030 - Spaces after list markers
* MD031 - Fenced code blocks should be surrounded by blank lines
* MD032 - Lists should be surrounded by blank lines

See [Rules.md](doc/Rules.md) for more details.

## Usage

Invoke `markdownlint` and use the `result` object's `toString` method:

```js
var markdownlint = require("../lib/markdownlint");

var options = {
  "files": [ "good.md", "bad.md" ]
};

markdownlint(options, function callback(err, result) {
  if (!err) {
    console.log(result.toString());
  }
});
```

Outputs:

```text
bad.md: 3: MD010 Hard tabs
bad.md: 1: MD018 No space after hash on atx style header
bad.md: 3: MD018 No space after hash on atx style header
```

Or examine the `result` object directly:

```js
markdownlint(options, function callback(err, result) {
  if (!err) {
    console.dir(result, { "colors": true });
  }
});
```

Outputs:

```json
{
  'good.md': {},
  'bad.md': {
    MD010: [ 3 ],
    MD018: [ 1, 3 ]
  }
}
```

Integration with the [gulp](http://gulpjs.com/) build system is straightforward:

```js
var gulp = require("gulp");
var through2 = require("through2");
var markdownlint = require("../lib/markdownlint");

gulp.task("markdownlint", function task() {
  return gulp.src("*.md", { "read": false })
    .pipe(through2.obj(function obj(file, enc, next) {
      markdownlint(
        { "files": [ file.relative ] },
        function callback(err, result) {
          var resultString = (result || "").toString();
          if (resultString) {
            console.log(resultString);
          }
          next(err, file);
        });
    }));
});
```

Outputs:

```text
[00:00:00] Starting 'markdownlint'...
bad.md: 3: MD010 Hard tabs
bad.md: 1: MD018 No space after hash on atx style header
bad.md: 3: MD018 No space after hash on atx style header
[00:00:00] Finished 'markdownlint' after 10 ms
```

## Release History

* 0.0.1 - Initial release.
