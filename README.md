# markdownlint

> A Node.js style checker and lint tool for Markdown files.

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

## Demonstration

[`markdownlint` demo](http://dlaa.me/markdownlint/), an interactive, in-browser
playground for learning and exploring.

## Rules

* **MD001** - Header levels should only increment by one level at a time
* **MD002** - First header should be a h1 header
* **MD003** - Header style
* **MD004** - Unordered list style
* **MD005** - Inconsistent indentation for list items at the same level
* **MD006** - Consider starting bulleted lists at the beginning of the line
* **MD007** - Unordered list indentation
* **MD009** - Trailing spaces
* **MD010** - Hard tabs
* **MD011** - Reversed link syntax
* **MD012** - Multiple consecutive blank lines
* **MD013** - Line length
* **MD014** - Dollar signs used before commands without showing output
* **MD018** - No space after hash on atx style header
* **MD019** - Multiple spaces after hash on atx style header
* **MD020** - No space inside hashes on closed atx style header
* **MD021** - Multiple spaces inside hashes on closed atx style header
* **MD022** - Headers should be surrounded by blank lines
* **MD023** - Headers must start at the beginning of the line
* **MD024** - Multiple headers with the same content
* **MD025** - Multiple top level headers in the same document
* **MD026** - Trailing punctuation in header
* **MD027** - Multiple spaces after blockquote symbol
* **MD028** - Blank line inside blockquote
* **MD029** - Ordered list item prefix
* **MD030** - Spaces after list markers
* **MD031** - Fenced code blocks should be surrounded by blank lines
* **MD032** - Lists should be surrounded by blank lines
* **MD033** - Inline HTML
* **MD034** - Bare URL used
* **MD035** - Horizontal rule style
* **MD036** - Emphasis used instead of a header
* **MD037** - Spaces inside emphasis markers
* **MD038** - Spaces inside code span elements
* **MD039** - Spaces inside link text
* **MD040** - Fenced code blocks should have a language specified
* **MD041** - First line in file should be a top level header

See [Rules.md](doc/Rules.md) for more details.

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
  MD024, MD025, MD026, MD036, MD041
* **hr** - MD035
* **html** - MD033
* **indentation** - MD005, MD006, MD007, MD027
* **language** - MD040
* **line_length** - MD013
* **links** - MD011, MD034, MD039
* **ol** - MD029, MD030, MD032
* **spaces** - MD018, MD019, MD020, MD021, MD023
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
[globbing](http://en.wikipedia.org/wiki/Glob_%28programming%29) is the caller's
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

Matches any [front matter](http://jekyllrb.com/docs/frontmatter/) found at the
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

Object keys are rule names and values are the rule's configuration.
The value `false` disables a rule, `true` enables its default configuration,
and passing an object customizes its settings. Setting the special `default`
rule to `true` or `false` includes/excludes all rules by default. Enabling or
disabling a tag name (ex: `whitespace`) affects all rules having that tag.

The `default` rule is applied first, then keys are processed in order from top
to bottom with later values overriding earlier ones. Keys (including rule names,
tags, and `default`) are not case-sensitive.

Example:

```json
{
  "default": true,
  "MD003": { "style": "atx_closed" },
  "MD007": { "indent": 4 },
  "MD009": false,
  "whitespace": false
}
```

Sets of rules (known as a "style") can be stored separately and loaded as
[JSON](http://en.wikipedia.org/wiki/JSON).

Example:

```js
var options = {
  "files": [ "..." ],
  "config": require("style/relaxed.json")
};
```

See the [style](style) directory for more samples.

### callback

Type: `Function` taking (`Error`, `Object`)

Standard completion callback.

### result

Type: `Object`

Call `result.toString()` for convenience or see below for an example of the
structure of the `result` object.

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

Or invoke `markdownlint.sync` for a synchronous call:

```js
var result = markdownlint.sync(options);
console.log(result.toString());
```

Output of both calls:

```text
bad.string: 3: MD010 Hard tabs
bad.string: 1: MD018 No space after hash on atx style header
bad.string: 3: MD018 No space after hash on atx style header
bad.md: 3: MD010 Hard tabs
bad.md: 1: MD018 No space after hash on atx style header
bad.md: 3: MD018 No space after hash on atx style header
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
  "good.string": {},
  "bad.string": {
    "MD010": [ 3 ],
    "MD018": [ 1, 3 ]
  },
  "good.md": {},
  "bad.md": {
    "MD010": [ 3 ],
    "MD018": [ 1, 3 ]
  }
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

`markdownlint` works in the browser.

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

[npm-image]: https://img.shields.io/npm/v/markdownlint.svg
[npm-url]: https://www.npmjs.com/package/markdownlint
[github-tag-image]: https://img.shields.io/github/tag/DavidAnson/markdownlint.svg
[github-tag-url]: https://github.com/DavidAnson/markdownlint
[travis-image]: https://img.shields.io/travis/DavidAnson/markdownlint/master.svg
[travis-url]: https://travis-ci.org/DavidAnson/markdownlint
[coveralls-image]: https://img.shields.io/coveralls/DavidAnson/markdownlint/master.svg
[coveralls-url]: https://coveralls.io/r/DavidAnson/markdownlint
[license-image]: https://img.shields.io/npm/l/markdownlint.svg
[license-url]: http://opensource.org/licenses/MIT
