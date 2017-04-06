# markdownlint

> A Node.js style checker and lint tool for Markdown/CommonMark files.

[![npm version][npm-image]][npm-url]
[![GitHub tag][github-tag-image]][github-tag-url]
[![Build status][travis-image]][travis-url]
[![Coverage][coveralls-image]][coveralls-url]
[![License][license-image]][license-url]

## Install

```shell
npm install markdownlint --save-dev
```

## Overview

The [Markdown](https://en.wikipedia.org/wiki/Markdown) markup language is
designed to be easy to read, write, and understand. It succeeds - and its
flexibility is both a benefit and a drawback. Many styles are possible, so
formatting can be inconsistent. Some constructs don't work well in all
parsers and should be avoided. The [CommonMark](http://commonmark.org/)
specification standardizes parsers - but not authors.

`markdownlint` is a [static analysis](https://en.wikipedia.org/wiki/Static_program_analysis)
tool for [Node.js](https://nodejs.org/) and [io.js](https://iojs.org/) with a
library of rules to enforce standards and consistency for Markdown files. It
was inspired by - and heavily influenced by - Mark Harrison's
[markdownlint](https://github.com/mivok/markdownlint) for
[Ruby](https://www.ruby-lang.org/). The rules, rule documentation, and test
cases come directly from that project.

### Related

* [markdownlint-cli command-line interface for Node.js](https://github.com/igorshubovych/markdownlint-cli)
* [grunt-markdownlint for the Grunt task runner](https://github.com/sagiegurari/grunt-markdownlint)
* [vscode-markdownlint extension for VS Code](https://marketplace.visualstudio.com/items/DavidAnson.vscode-markdownlint)
* [markdownlint/mdl gem for Ruby](https://rubygems.org/gems/mdl)

## Demonstration

[`markdownlint` demo](https://dlaa.me/markdownlint/), an interactive, in-browser
playground for learning and exploring.

## Rules / Aliases

* **[MD001](doc/MD001.md)** *header-increment* - Header levels should only increment by one level at a time
* **[MD002](doc/MD002.md)** *first-header-h1* - First header should be a top level header
* **[MD003](doc/MD003.md)** *header-style* - Header style
* **[MD004](doc/MD004.md)** *ul-style* - Unordered list style
* **[MD005](doc/MD005.md)** *list-indent* - Inconsistent indentation for list items at the same level
* **[MD006](doc/MD006.md)** *ul-start-left* - Consider starting bulleted lists at the beginning of the line
* **[MD007](doc/MD007.md)** *ul-indent* - Unordered list indentation
* **[MD009](doc/MD009.md)** *no-trailing-spaces* - Trailing spaces
* **[MD010](doc/MD010.md)** *no-hard-tabs* - Hard tabs
* **[MD011](doc/MD011.md)** *no-reversed-links* - Reversed link syntax
* **[MD012](doc/MD012.md)** *no-multiple-blanks* - Multiple consecutive blank lines
* **[MD013](doc/MD013.md)** *line-length* - Line length
* **[MD014](doc/MD014.md)** *commands-show-output* - Dollar signs used before commands without showing output
* **[MD018](doc/MD018.md)** *no-missing-space-atx* - No space after hash on atx style header
* **[MD019](doc/MD019.md)** *no-multiple-space-atx* - Multiple spaces after hash on atx style header
* **[MD020](doc/MD020.md)** *no-missing-space-closed-atx* - No space inside hashes on closed atx style header
* **[MD021](doc/MD021.md)** *no-multiple-space-closed-atx* - Multiple spaces inside hashes on closed atx style header
* **[MD022](doc/MD022.md)** *blanks-around-headers* - Headers should be surrounded by blank lines
* **[MD023](doc/MD023.md)** *header-start-left* - Headers must start at the beginning of the line
* **[MD024](doc/MD024.md)** *no-duplicate-header* - Multiple headers with the same content
* **[MD025](doc/MD025.md)** *single-h1* - Multiple top level headers in the same document
* **[MD026](doc/MD026.md)** *no-trailing-punctuation* - Trailing punctuation in header
* **[MD027](doc/MD027.md)** *no-multiple-space-blockquote* - Multiple spaces after blockquote symbol
* **[MD028](doc/MD028.md)** *no-blanks-blockquote* - Blank line inside blockquote
* **[MD029](doc/MD029.md)** *ol-prefix* - Ordered list item prefix
* **[MD030](doc/MD030.md)** *list-marker-space* - Spaces after list markers
* **[MD031](doc/MD031.md)** *blanks-around-fences* - Fenced code blocks should be surrounded by blank lines
* **[MD032](doc/MD032.md)** *blanks-around-lists* - Lists should be surrounded by blank lines
* **[MD033](doc/MD033.md)** *no-inline-html* - Inline HTML
* **[MD034](doc/MD034.md)** *no-bare-urls* - Bare URL used
* **[MD035](doc/MD035.md)** *hr-style* - Horizontal rule style
* **[MD036](doc/MD036.md)** *no-emphasis-as-header* - Emphasis used instead of a header
* **[MD037](doc/MD037.md)** *no-space-in-emphasis* - Spaces inside emphasis markers
* **[MD038](doc/MD038.md)** *no-space-in-code* - Spaces inside code span elements
* **[MD039](doc/MD039.md)** *no-space-in-links* - Spaces inside link text
* **[MD040](doc/MD040.md)** *fenced-code-language* - Fenced code blocks should have a language specified
* **[MD041](doc/MD041.md)** *first-line-h1* - First line in file should be a top level header
* **[MD042](doc/MD042.md)** *no-empty-links* - No empty links
* **[MD043](doc/MD043.md)** *required-headers* - Required header structure
* **[MD044](doc/MD044.md)** *proper-names* - Proper names should have the correct capitalization

## Tags

* **atx** - MD018, MD019
* **atx_closed** - MD020, MD021
* **blank_lines** - MD012, MD022, MD031, MD032
* **blockquote** - MD027, MD028
* **bullet** - MD004, MD005, MD006, MD007, MD032
* **code** - MD014, MD031, MD038, MD040
* **emphasis** - MD036, MD037
* **hard_tab** - MD010
* **headers** - MD001, MD002, MD003, MD018, MD019, MD020, MD021, MD022, MD023,
  MD024, MD025, MD026, MD036, MD041, MD043
* **hr** - MD035
* **html** - MD033
* **indentation** - MD005, MD006, MD007, MD027
* **language** - MD040
* **line_length** - MD013
* **links** - MD011, MD034, MD039, MD042
* **ol** - MD029, MD030, MD032
* **spaces** - MD018, MD019, MD020, MD021, MD023
* **spelling** - MD044
* **ul** - MD004, MD005, MD006, MD007, MD030, MD032
* **url** - MD034
* **whitespace** - MD009, MD010, MD012, MD027, MD028, MD030, MD037, MD038, MD039

## Configuration

Rules can be enabled, disabled, and configured via `options.config` (described
below) to define the expected behavior for a set of inputs. To enable or disable
rules within a file, add one of these markers to the appropriate place (HTML
comments don't appear in the final markup):

* Disable all rules: `<!-- markdownlint-disable -->`
* Enable all rules: `<!-- markdownlint-enable -->`
* Disable one or more rules: `<!-- markdownlint-disable MD001 MD002 -->`
* Enable one or more rules: `<!-- markdownlint-enable MD001 MD002 -->`

For example:

```md
<!-- markdownlint-disable MD037 -->
deliberate space * in * emphasis
<!-- markdownlint-enable MD037 -->
```

Changes take effect starting with the line a comment is on, so the following
has no effect:

```md
space * in * emphasis <!-- markdownlint-disable --> <!-- markdownlint-enable -->
```

## API

Standard asynchronous interface:

```js
/**
 * Lint specified Markdown files according to configurable rules.
 *
 * @param {Object} options Configuration options.
 * @param {Function} callback Callback (err, result) function.
 * @returns {void}
 */
function markdownlint(options, callback) { ... }
```

Synchronous interface (for build scripts, etc.):

```js
/**
 * Lint specified Markdown files according to configurable rules.
 *
 * @param {Object} options Configuration options.
 * @returns {Object} Result object.
 */
function markdownlint.sync(options) { ... }
```

### options

Type: `Object`

Configures the function.

#### options.files

Type: `Array` of `String`

List of files to lint.

Each array element should be a single file (via relative or absolute path);
[globbing](https://en.wikipedia.org/wiki/Glob_%28programming%29) is the caller's
responsibility.

Example: `[ "one.md", "dir/two.md" ]`

#### options.strings

Type: `Object` mapping `String` to `String`

Map of identifiers to strings for linting.

When Markdown content is not available as files, it can be passed as strings.
The keys of the `strings` object are used to identify each input value in the
`result` summary.

Example:

```json
{
  "readme": "# README\n...",
  "changelog": "# CHANGELOG\n..."
}
```

#### options.frontMatter

Type: `RegExp`

Matches any [front matter](https://jekyllrb.com/docs/frontmatter/) found at the
beginning of a file.

Some Markdown content begins with metadata; the default `RegExp` for this option
ignores common forms of "front matter". To match differently, specify a custom
`RegExp` or use the value `null` to disable the feature.

Note: Matches must occur at the start of the file.

Default:

```js
/^---$[^]*?^---$(\r\n|\r|\n)/m
```

Ignores:

```text
---
layout: post
title: Title
---
```

#### options.config

Type: `Object` mapping `String` to `Boolean | Object`

Configures the rules to use.

Object keys are rule names or aliases and values are the rule's configuration.
The value `false` disables a rule, `true` enables its default configuration,
and passing an object customizes its settings. Setting the special `default`
rule to `true` or `false` includes/excludes all rules by default. Enabling or
disabling a tag name (ex: `whitespace`) affects all rules having that tag.

The `default` rule is applied first, then keys are processed in order from top
to bottom with later values overriding earlier ones. Keys (including rule names,
aliases, tags, and `default`) are not case-sensitive.

Example:

```json
{
  "default": true,
  "MD003": { "style": "atx_closed" },
  "MD007": { "indent": 4 },
  "no-hard-tabs": false,
  "whitespace": false
}
```

Sets of rules (known as a "style") can be stored separately and loaded as
[JSON](https://en.wikipedia.org/wiki/JSON).

Example:

```js
var options = {
  "files": [ "..." ],
  "config": require("style/relaxed.json")
};
```

See the [style](style) directory for more samples.

See [markdownlint-config-schema.json](schema/markdownlint-config-schema.json)
for the [JSON Schema](http://json-schema.org/) of the `options.config` object.

#### options.resultVersion

Type: `Number`

Specifies which version of the `result` object to return (see the "Usage" section
below for examples).

Passing a `resultVersion` of `0` corresponds to the original, simple format where
each error is identified by rule name and line number. This is the default.

Passing a `resultVersion` of `1` corresponds to a more detailed format where each
error includes information about the line number, rule name, alias, description,
as well as any additional detail or context that is available.

### callback

Type: `Function` taking (`Error`, `Object`)

Standard completion callback.

### result

Type: `Object`

Call `result.toString()` for convenience or see below for an example of the
structure of the `result` object. Passing the value `true` to `toString()`
uses rule aliases (ex: `no-hard-tabs`) instead of names (ex: `MD010`).

## Usage

Invoke `markdownlint` and use the `result` object's `toString` method:

```js
var markdownlint = require("markdownlint");

var options = {
  "files": [ "good.md", "bad.md" ],
  "strings": {
    "good.string": "# good.string\n\nThis string passes all rules.",
    "bad.string": "#bad.string\n\n#This string fails\tsome rules."
  }
};

markdownlint(options, function callback(err, result) {
  if (!err) {
    console.log(result.toString());
  }
});
```

Output:

```text
bad.string: 3: MD010 Hard tabs
bad.string: 1: MD018 No space after hash on atx style header
bad.string: 3: MD018 No space after hash on atx style header
bad.md: 3: MD010 Hard tabs
bad.md: 1: MD018 No space after hash on atx style header
bad.md: 3: MD018 No space after hash on atx style header
```

Or invoke `markdownlint.sync` for a synchronous call and/or pass `true` to `toString`
to use rule aliases instead of names:

```js
var result = markdownlint.sync(options);
console.log(result.toString(true));
```

Output:

```text
bad.string: 3: no-hard-tabs Hard tabs
bad.string: 1: no-missing-space-atx No space after hash on atx style header
bad.string: 3: no-missing-space-atx No space after hash on atx style header
bad.md: 3: no-hard-tabs Hard tabs
bad.md: 1: no-missing-space-atx No space after hash on atx style header
bad.md: 3: no-missing-space-atx No space after hash on atx style header
```

To examine the `result` object directly:

```js
markdownlint(options, function callback(err, result) {
  if (!err) {
    console.dir(result, { "colors": true });
  }
});
```

Output:

```json
{
  "good.md": {},
  "bad.md": {
    "MD010": [ 3 ],
    "MD018": [ 1, 3 ]
  }
}
```

For more detailed error reporting, set `options.resultVersion` to `1`:

```js
var options = {
  "files": [ "good.md", "bad.md" ],
  "resultVersion": 1
};
```

With that, the output of `result.toString` looks like:

```text
bad.string: 3: MD010/no-hard-tabs Hard tabs [Column: 19]
bad.string: 1: MD018/no-missing-space-atx No space after hash on atx style header [Context: "#bad.string"]
bad.string: 3: MD018/no-missing-space-atx No space after hash on atx style header [Context: "#This string fails    some rules."]
bad.md: 3: MD010/no-hard-tabs Hard tabs [Column: 17]
bad.md: 1: MD018/no-missing-space-atx No space after hash on atx style header [Context: "#bad.md"]
bad.md: 3: MD018/no-missing-space-atx No space after hash on atx style header [Context: "#This file fails    some rules."]
```

And the `result` object becomes:

```json
{
  "good.md": [],
  "bad.md": [
    { "lineNumber": 3,
      "ruleName": "MD010",
      "ruleAlias": "no-hard-tabs",
      "ruleDescription": "Hard tabs",
      "errorDetail": "Column: 17",
      "errorContext": null,
      "errorRange": [ 17, 1 ] },
    { "lineNumber": 1,
      "ruleName": "MD018",
      "ruleAlias": "no-missing-space-atx",
      "ruleDescription": "No space after hash on atx style header",
      "errorDetail": null,
      "errorContext": "#bad.md",
      "errorRange": [ 1, 2 ] },
    { "lineNumber": 3,
      "ruleName": "MD018",
      "ruleAlias": "no-missing-space-atx",
      "ruleDescription": "No space after hash on atx style header",
      "errorDetail": null,
      "errorContext": "#This file fails\tsome rules.",
      "errorRange": [ 1, 2 ] }
  ]
}
```

Integration with the [gulp](http://gulpjs.com/) build system is straightforward:

```js
var gulp = require("gulp");
var through2 = require("through2");
var markdownlint = require("markdownlint");

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

Output:

```text
[00:00:00] Starting 'markdownlint'...
bad.md: 3: MD010 Hard tabs
bad.md: 1: MD018 No space after hash on atx style header
bad.md: 3: MD018 No space after hash on atx style header
[00:00:00] Finished 'markdownlint' after 10 ms
```

Integration with the [Grunt](http://gruntjs.com/) build system is similar:

```js
var markdownlint = require("markdownlint");

module.exports = function wrapper(grunt) {
  grunt.initConfig({
    "markdownlint": {
      "example": {
        "src": [ "*.md" ]
      }
    }
  });

  grunt.registerMultiTask("markdownlint", function task() {
    var done = this.async();
    markdownlint(
      { "files": this.filesSrc },
      function callback(err, result) {
        var resultString = err || ((result || "").toString());
        if (resultString) {
          grunt.fail.warn("\n" + resultString + "\n");
        }
        done(!err || !resultString);
      });
  });
};
```

Output:

```text
Running "markdownlint:example" (markdownlint) task
Warning:
bad.md: 3: MD010 Hard tabs
bad.md: 1: MD018 No space after hash on atx style header
bad.md: 3: MD018 No space after hash on atx style header
 Use --force to continue.
```

## Browser

`markdownlint` also works in the browser.

Generate normal and minified scripts with:

```shell
npm run build-demo
```

Then reference `markdown-it` and `markdownlint`:

```html
<script src="demo/markdown-it.min.js"></script>
<script src="demo/markdownlint-browser.min.js"></script>
```

And call it like so:

```js
var options = {
  "strings": {
    "content": "Some Markdown to lint."
  }
};
var results = window.markdownlint.sync(options).toString();
```

## History

* 0.0.1 - Initial release, includes tests MD001-MD032.
* 0.0.2 - Improve documentation, tests, and code.
* 0.0.3 - Add synchronous API, improve documentation and code.
* 0.0.4 - Add tests MD033-MD040, update dependencies.
* 0.0.5 - Add `strings` option to enable file-less scenarios, add in-browser demo.
* 0.0.6 - Improve performance, simplify in-browser, update dependencies.
* 0.0.7 - Add MD041, improve MD003, ignore front matter, update dependencies.
* 0.0.8 - Support disabling/enabling rules inline, improve code fence, dependencies.
* 0.1.0 - Add aliases, exceptions for MD033, exclusions for MD013, dependencies.
  * 0.1.1 - Fix bug handling HTML in tables, reference markdownlint-cli.
* 0.2.0 - Add MD042/MD043, enhance MD002/MD003/MD004/MD007/MD011/MD025/MD041, dependencies.
* 0.3.0 - More detailed error reporting with `resultVersion`, enhance MD010/MD012/MD036,
          fixes for MD027/MD029/MD030, include JSON schema, dependencies.
  * 0.3.1 - Fix regressions in MD032/MD038, update dependencies.
* 0.4.0 - Add MD044, enhance MD013/MD032/MD041/MD042/MD043, fix for MD038, dependencies.
  * 0.4.1 - Fixes for MD038/front matter, improvements to MD044, update dependencies.

[npm-image]: https://img.shields.io/npm/v/markdownlint.svg
[npm-url]: https://www.npmjs.com/package/markdownlint
[github-tag-image]: https://img.shields.io/github/tag/DavidAnson/markdownlint.svg
[github-tag-url]: https://github.com/DavidAnson/markdownlint
[travis-image]: https://img.shields.io/travis/DavidAnson/markdownlint/master.svg
[travis-url]: https://travis-ci.org/DavidAnson/markdownlint
[coveralls-image]: https://img.shields.io/coveralls/DavidAnson/markdownlint/master.svg
[coveralls-url]: https://coveralls.io/r/DavidAnson/markdownlint
[license-image]: https://img.shields.io/npm/l/markdownlint.svg
[license-url]: https://opensource.org/licenses/MIT
