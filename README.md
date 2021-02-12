# markdownlint

> A Node.js style checker and lint tool for Markdown/CommonMark files.

[![npm version][npm-image]][npm-url]
[![CI Status][ci-image]][ci-url]
[![License][license-image]][license-url]

## Install

```shell
npm install markdownlint --save-dev
```

## Overview

The [Markdown](https://en.wikipedia.org/wiki/Markdown) markup language
is designed to be easy to read, write, and understand. It succeeds -
and its flexibility is both a benefit and a drawback. Many styles are
possible, so formatting can be inconsistent. Some constructs don't
work well in all parsers and should be avoided. The
[CommonMark](https://commonmark.org/) specification standardizes
parsers - but not authors.

`markdownlint` is a
[static analysis](https://en.wikipedia.org/wiki/Static_program_analysis)
tool for [Node.js](https://nodejs.org/) with a library of rules
to enforce standards and consistency for Markdown files. It was
inspired by - and heavily influenced by - Mark Harrison's
[markdownlint](https://github.com/markdownlint/markdownlint) for
[Ruby](https://www.ruby-lang.org/). The initial rules, rule documentation,
and test cases came directly from that project.

### Related

* CLI
  * [markdownlint-cli command-line interface for Node.js](https://github.com/igorshubovych/markdownlint-cli)
  * [markdownlint-cli2 command-line interface for Node.js](https://github.com/DavidAnson/markdownlint-cli2)
* GitHub
  * [GitHub Super-Linter Action](https://github.com/github/super-linter)
  * [GitHub Actions problem matcher for markdownlint-cli](https://github.com/xt0rted/markdownlint-problem-matcher)
* Editor
  * [vscode-markdownlint extension for VS Code](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
  * [Sublime Text markdownlint for Sublime Text](https://packagecontrol.io/packages/SublimeLinter-contrib-markdownlint)
  * [linter-node-markdownlint extension for Atom](https://atom.io/packages/linter-node-markdownlint)
  * [coc-markdownlint extension for Vim/Neovim](https://github.com/fannheyward/coc-markdownlint)
* Tooling
  * [grunt-markdownlint for the Grunt task runner](https://github.com/sagiegurari/grunt-markdownlint)
  * [Cake.Markdownlint addin for Cake build automation system](https://github.com/cake-contrib/Cake.Markdownlint)
* Ruby
  * [markdownlint/mdl gem for Ruby](https://rubygems.org/gems/mdl)

## Demonstration

[`markdownlint` demo](https://dlaa.me/markdownlint/), an interactive, in-browser
playground for learning and exploring.

## Rules / Aliases

<!-- markdownlint-disable line-length -->

* **[MD001](doc/Rules.md#md001)** *heading-increment/header-increment* - Heading levels should only increment by one level at a time
* ~~**[MD002](doc/Rules.md#md002)** *first-heading-h1/first-header-h1* - First heading should be a top-level heading~~
* **[MD003](doc/Rules.md#md003)** *heading-style/header-style* - Heading style
* **[MD004](doc/Rules.md#md004)** *ul-style* - Unordered list style
* **[MD005](doc/Rules.md#md005)** *list-indent* - Inconsistent indentation for list items at the same level
* ~~**[MD006](doc/Rules.md#md006)** *ul-start-left* - Consider starting bulleted lists at the beginning of the line~~
* **[MD007](doc/Rules.md#md007)** *ul-indent* - Unordered list indentation
* **[MD009](doc/Rules.md#md009)** *no-trailing-spaces* - Trailing spaces
* **[MD010](doc/Rules.md#md010)** *no-hard-tabs* - Hard tabs
* **[MD011](doc/Rules.md#md011)** *no-reversed-links* - Reversed link syntax
* **[MD012](doc/Rules.md#md012)** *no-multiple-blanks* - Multiple consecutive blank lines
* **[MD013](doc/Rules.md#md013)** *line-length* - Line length
* **[MD014](doc/Rules.md#md014)** *commands-show-output* - Dollar signs used before commands without showing output
* **[MD018](doc/Rules.md#md018)** *no-missing-space-atx* - No space after hash on atx style heading
* **[MD019](doc/Rules.md#md019)** *no-multiple-space-atx* - Multiple spaces after hash on atx style heading
* **[MD020](doc/Rules.md#md020)** *no-missing-space-closed-atx* - No space inside hashes on closed atx style heading
* **[MD021](doc/Rules.md#md021)** *no-multiple-space-closed-atx* - Multiple spaces inside hashes on closed atx style heading
* **[MD022](doc/Rules.md#md022)** *blanks-around-headings/blanks-around-headers* - Headings should be surrounded by blank lines
* **[MD023](doc/Rules.md#md023)** *heading-start-left/header-start-left* - Headings must start at the beginning of the line
* **[MD024](doc/Rules.md#md024)** *no-duplicate-heading/no-duplicate-header* - Multiple headings with the same content
* **[MD025](doc/Rules.md#md025)** *single-title/single-h1* - Multiple top-level headings in the same document
* **[MD026](doc/Rules.md#md026)** *no-trailing-punctuation* - Trailing punctuation in heading
* **[MD027](doc/Rules.md#md027)** *no-multiple-space-blockquote* - Multiple spaces after blockquote symbol
* **[MD028](doc/Rules.md#md028)** *no-blanks-blockquote* - Blank line inside blockquote
* **[MD029](doc/Rules.md#md029)** *ol-prefix* - Ordered list item prefix
* **[MD030](doc/Rules.md#md030)** *list-marker-space* - Spaces after list markers
* **[MD031](doc/Rules.md#md031)** *blanks-around-fences* - Fenced code blocks should be surrounded by blank lines
* **[MD032](doc/Rules.md#md032)** *blanks-around-lists* - Lists should be surrounded by blank lines
* **[MD033](doc/Rules.md#md033)** *no-inline-html* - Inline HTML
* **[MD034](doc/Rules.md#md034)** *no-bare-urls* - Bare URL used
* **[MD035](doc/Rules.md#md035)** *hr-style* - Horizontal rule style
* **[MD036](doc/Rules.md#md036)** *no-emphasis-as-heading/no-emphasis-as-header* - Emphasis used instead of a heading
* **[MD037](doc/Rules.md#md037)** *no-space-in-emphasis* - Spaces inside emphasis markers
* **[MD038](doc/Rules.md#md038)** *no-space-in-code* - Spaces inside code span elements
* **[MD039](doc/Rules.md#md039)** *no-space-in-links* - Spaces inside link text
* **[MD040](doc/Rules.md#md040)** *fenced-code-language* - Fenced code blocks should have a language specified
* **[MD041](doc/Rules.md#md041)** *first-line-heading/first-line-h1* - First line in a file should be a top-level heading
* **[MD042](doc/Rules.md#md042)** *no-empty-links* - No empty links
* **[MD043](doc/Rules.md#md043)** *required-headings/required-headers* - Required heading structure
* **[MD044](doc/Rules.md#md044)** *proper-names* - Proper names should have the correct capitalization
* **[MD045](doc/Rules.md#md045)** *no-alt-text* - Images should have alternate text (alt text)
* **[MD046](doc/Rules.md#md046)** *code-block-style* - Code block style
* **[MD047](doc/Rules.md#md047)** *single-trailing-newline* - Files should end with a single newline character
* **[MD048](doc/Rules.md#md048)** *code-fence-style* - Code fence style

<!-- markdownlint-restore -->

See [Rules.md](doc/Rules.md) for more details.

~~Struck through~~ rules are deprecated, and provided for backward-compatibility.

> All rules with `heading` as part of their name are also available as
> `header` aliases (e.g. `heading-increment` is also available as `header-increment`).
> The use of `header` is deprecated and provided for backward-compatibility.

## Tags

Tags group related rules and can be used to enable/disable multiple
rules at once.

* **accessibility** - MD045
* **atx** - MD018, MD019
* **atx_closed** - MD020, MD021
* **blank_lines** - MD012, MD022, MD031, MD032, MD047
* **blockquote** - MD027, MD028
* **bullet** - MD004, MD005, MD006, MD007, MD032
* **code** - MD014, MD031, MD038, MD040, MD046, MD048
* **emphasis** - MD036, MD037
* **hard_tab** - MD010
* **headers** - MD001, MD002, MD003, MD018, MD019, MD020, MD021, MD022,
  MD023, MD024, MD025, MD026, MD036, MD041, MD043
* **headings** - MD001, MD002, MD003, MD018, MD019, MD020, MD021, MD022,
  MD023, MD024, MD025, MD026, MD036, MD041, MD043
* **hr** - MD035
* **html** - MD033
* **images** - MD045
* **indentation** - MD005, MD006, MD007, MD027
* **language** - MD040
* **line_length** - MD013
* **links** - MD011, MD034, MD039, MD042
* **ol** - MD029, MD030, MD032
* **spaces** - MD018, MD019, MD020, MD021, MD023
* **spelling** - MD044
* **ul** - MD004, MD005, MD006, MD007, MD030, MD032
* **url** - MD034
* **whitespace** - MD009, MD010, MD012, MD027, MD028, MD030, MD037,
  MD038, MD039

## Configuration

Text passed to `markdownlint` is parsed as Markdown, analyzed, and any
issues reported. Two kinds of text are ignored:

* [HTML comments](https://www.w3.org/TR/html5/syntax.html#comments)
* [Front matter](https://jekyllrb.com/docs/frontmatter/) (see
  `options.frontMatter` below)

Rules can be enabled, disabled, and configured via `options.config`
(described below) to define the expected behavior for a set of inputs.
To enable or disable rules at a particular location within a file, add
one of these markers to the appropriate place (HTML comments don't
appear in the final markup):

* Disable all rules: `<!-- markdownlint-disable -->`
* Enable all rules: `<!-- markdownlint-enable -->`
* Disable all rules for the next line only: `<!-- markdownlint-disable-next-line -->`
* Disable one or more rules by name: `<!-- markdownlint-disable MD001 MD005 -->`
* Enable one or more rules by name: `<!-- markdownlint-enable MD001 MD005 -->`
* Disable one or more rules by name for the next line only: `<!-- markdownlint-disable-next-line MD001 MD005 -->`
* Capture the current rule configuration: `<!-- markdownlint-capture -->`
* Restore the captured rule configuration: `<!-- markdownlint-restore -->`

For example:

```markdown
<!-- markdownlint-disable-next-line no-space-in-emphasis -->
deliberate space * in * emphasis
```

Or:

```markdown
<!-- markdownlint-disable no-space-in-emphasis -->
deliberate space * in * emphasis
<!-- markdownlint-enable no-space-in-emphasis -->
```

To temporarily disable rule(s), then restore the former configuration:

```markdown
<!-- markdownlint-capture -->
<!-- markdownlint-disable -->
any violations you want
<!-- markdownlint-restore -->
```

The initial configuration is captured by default (as if every document
began with `<!-- markdownlint-capture -->`), so the pattern above can
be expressed more simply:

```markdown
<!-- markdownlint-disable -->
any violations you want
<!-- markdownlint-restore -->
```

Changes take effect starting with the line a comment is on, so the following
has no effect:

```markdown
space * in * emphasis <!-- markdownlint-disable --> <!-- markdownlint-enable -->
```

To apply changes to an entire file regardless of where the comment is located,
the following syntax is supported:

* Disable all rules: `<!-- markdownlint-disable-file -->`
* Enable all rules: `<!-- markdownlint-enable-file -->`
* Disable one or more rules by name: `<!-- markdownlint-disable-file MD001 -->`
* Enable one or more rules by name: `<!-- markdownlint-enable-file MD001 -->`

This can be used to "hide" `markdownlint` comments at the bottom of a file.

In cases where it is desirable to change the configuration of one or
more rules for a file, the following more advanced syntax is supported:

* Configure: `<!-- markdownlint-configure-file { options.config JSON } -->`

For example:

```markdown
<!-- markdownlint-configure-file { "MD013": { "line_length": 70 } } -->
```

or

```markdown
<!-- markdownlint-configure-file
{
  "hr-style": {
    "style": "---"
  },
  "no-trailing-spaces": false
}
-->
```

These changes apply to the entire file regardless of where the comment
is located. Multiple such comments (if present) are applied top-to-bottom.

## API

### Linting

Standard asynchronous API:

```js
/**
 * Lint specified Markdown files.
 *
 * @param {Options} options Configuration options.
 * @param {LintCallback} callback Callback (err, result) function.
 * @returns {void}
 */
function markdownlint(options, callback) { ... }
```

Synchronous API (for build scripts, etc.):

```js
/**
 * Lint specified Markdown files synchronously.
 *
 * @param {Options} options Configuration options.
 * @returns {LintResults} Results object.
 */
function markdownlint.sync(options) { ... }
```

Promise API (in the `promises` namespace like Node.js's
[`fs` Promises API](https://nodejs.org/api/fs.html#fs_fs_promises_api)):

```js
/**
 * Lint specified Markdown files.
 *
 * @param {Options} options Configuration options.
 * @returns {Promise<LintResults>} Results object.
 */
function markdownlint(options) { ... }
```

#### options

Type: `Object`

Configures the function.

##### options.customRules

Type: `Array` of `Object`

List of custom rules to include with the default rule set for linting.

Each array element should define a rule. Rules are typically exported
by another package, but can be defined locally. Custom rules are
identified by the
[keyword `markdownlint-rule` on npm](https://www.npmjs.com/search?q=keywords:markdownlint-rule).

Example:

```js
const extraRules = require("extraRules");
const options = {
  "customRules": [ extraRules.one, extraRules.two ]
};
```

See [CustomRules.md](doc/CustomRules.md) for details about authoring
custom rules.

##### options.files

Type: `Array` of `String`

List of files to lint.

Each array element should be a single file (via relative or absolute path);
[globbing](https://en.wikipedia.org/wiki/Glob_%28programming%29) is the
caller's responsibility.

Example: `[ "one.md", "dir/two.md" ]`

##### options.strings

Type: `Object` mapping `String` to `String`

Map of identifiers to strings for linting.

When Markdown content is not available as files, it can be passed as
strings. The keys of the `strings` object are used to identify each
input value in the `result` summary.

Example:

```json
{
  "readme": "# README\n...",
  "changelog": "# CHANGELOG\n..."
}
```

##### options.config

Type: `Object` mapping `String` to `Boolean | Object`

Configures the rules to use.

Object keys are rule names or aliases and values are the rule's configuration.
The value `false` disables a rule, `true` enables its default configuration,
and passing an object customizes its settings. Setting the special `default`
rule to `true` or `false` includes/excludes all rules by default. Enabling
or disabling a tag name (ex: `whitespace`) affects all rules having that
tag.

The `default` rule is applied first, then keys are processed in order
from top to bottom with later values overriding earlier ones. Keys
(including rule names, aliases, tags, and `default`) are not case-sensitive.

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

See [.markdownlint.jsonc](schema/.markdownlint.jsonc) and/or
[.markdownlint.yaml](schema/.markdownlint.yaml) for an example
configuration object with all properties set to the default value.

Sets of rules (known as a "style") can be stored separately and loaded
as [JSON](https://en.wikipedia.org/wiki/JSON).

Example:

```js
const options = {
  "files": [ "..." ],
  "config": require("style/relaxed.json")
};
```

See the [style](style) directory for more samples.

See [markdownlint-config-schema.json](schema/markdownlint-config-schema.json)
for the [JSON Schema](https://json-schema.org/) of the `options.config`
object.

For more advanced scenarios, styles can reference and extend other styles.
The `readConfig` and `readConfigSync` functions can be used to read such
styles.

For example, assuming a `base.json` configuration file:

```json
{
  "default": true
}
```

And a `custom.json` configuration file:

```json
{
  "extends": "base.json",
  "line-length": false
}
```

Then code like the following:

```js
const options = {
  "config": markdownlint.readConfigSync("./custom.json")
};
```

Merges `custom.json` and `base.json` and is equivalent to:

```js
const options = {
  "config": {
    "default": true,
    "line-length": false
  }
};
```

##### options.frontMatter

Type: `RegExp`

Matches any [front matter](https://jekyllrb.com/docs/frontmatter/)
found at the beginning of a file.

Some Markdown content begins with metadata; the default `RegExp` for
this option ignores common forms of "front matter". To match differently,
specify a custom `RegExp` or use the value `null` to disable the feature.

The default value:

```js
/((^---\s*$[^]*?^---\s*$)|(^\+\+\+\s*$[^]*?^(\+\+\+|\.\.\.)\s*$)|(^\{\s*$[^]*?^\}\s*$))(\r\n|\r|\n|$)/m
```

Ignores [YAML](https://en.wikipedia.org/wiki/YAML),
[TOML](https://en.wikipedia.org/wiki/TOML), and
[JSON](https://en.wikipedia.org/wiki/JSON) front matter such as:

```text
---
layout: post
title: Title
---
```

Note: Matches must occur at the start of the file.

##### options.handleRuleFailures

Type: `Boolean`

Catches exceptions thrown during rule processing and reports the problem
as a rule violation.

By default, exceptions thrown by rules (or the library itself) are unhandled
and bubble up the stack to the caller in the conventional manner. By setting
`handleRuleFailures` to `true`, exceptions thrown by failing rules will
be handled by the library and the exception message logged as a rule violation.
This setting can be useful in the presence of (custom) rules that encounter
unexpected syntax and fail. By enabling this option, the linting process
is allowed to continue and report any violations that were found.

##### options.noInlineConfig

Type: `Boolean`

Disables the use of HTML comments like `<!-- markdownlint-disable -->` to toggle
rules within the body of Markdown content.

By default, properly-formatted inline comments can be used to create exceptions
for parts of a document. Setting `noInlineConfig` to `true` ignores all such
comments.

##### options.resultVersion

Type: `Number`

Specifies which version of the `result` object to return (see the "Usage" section
below for examples).

Passing a `resultVersion` of `0` corresponds to the original, simple format where
each error is identified by rule name and line number. *This is deprecated.*

Passing a `resultVersion` of `1` corresponds to a detailed format where each error
includes information about the line number, rule name, alias, description, as well
as any additional detail or context that is available. *This is deprecated.*

Passing a `resultVersion` of `2` corresponds to a detailed format where each error
includes information about the line number, rule names, description, as well as any
additional detail or context that is available. *This is the default.*

Passing a `resultVersion` of `3` corresponds to the detailed version `2` format
with additional information about how to fix automatically-fixable errors. In this
mode, all errors that occur on each line are reported (other versions report only
the first error for each rule).

##### options.markdownItPlugins

Type: `Array` of `Array` of `Function` and plugin parameters

Specifies additional [markdown-it plugins](https://www.npmjs.com/search?q=keywords:markdown-it-plugin)
to use when parsing input. Plugins can be used to support additional syntax and
features for advanced scenarios.

Each item in the top-level `Array` should be of the form:

```js
[ require("markdown-it-plugin"), plugin_param_0, plugin_param_1, ... ]
```

#### callback

Type: `Function` taking (`Error`, `Object`)

Standard completion callback.

#### result

Type: `Object`

Call `result.toString()` for convenience or see below for an example of the
structure of the `result` object. Passing the value `true` to `toString()`
uses rule aliases (ex: `no-hard-tabs`) instead of names (ex: `MD010`).

### Config

The `options.config` configuration object is simple and can be stored in a file
for readability and easy reuse. The `readConfig` and `readConfigSync` functions
load configuration settings and support the `extends` keyword for referencing
other files (see above).

By default, configuration files are parsed as JSON (and named `.markdownlint.json`).
Custom parsers can be provided to handle other formats like JSONC, YAML, and TOML.

Asynchronous API:

```js
/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[] | ReadConfigCallback} parsers Parsing function(s).
 * @param {ReadConfigCallback} [callback] Callback (err, result) function.
 * @returns {void}
 */
function readConfig(file, parsers, callback) { ... }
```

Synchronous API:

```js
/**
 * Read specified configuration file synchronously.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} [parsers] Parsing function(s).
 * @returns {Configuration} Configuration object.
 */
function readConfigSync(file, parsers) { ... }
```

Promise API (in the `promises` namespace like Node.js's
[`fs` Promises API](https://nodejs.org/api/fs.html#fs_fs_promises_api)):

```js
/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} [parsers] Parsing function(s).
 * @returns {Promise<Configuration>} Configuration object.
 */
function readConfig(file, parsers) { ... }
```

#### file

Type: `String`

Location of configuration file to read.

The `file` is resolved relative to the current working directory. If an `extends`
key is present once read, its value will be resolved as a path relative to `file`
and loaded recursively. Settings from a file referenced by `extends` are applied
first, then those of `file` are applied on top (overriding any of the same keys
appearing in the referenced file).

#### parsers

Type: *Optional* `Array` of `Function` taking (`String`) and returning `Object`

Array of functions to parse configuration files.

The contents of a configuration file are passed to each parser function until one
of them returns a value (vs. throwing an exception). Consequently, strict parsers
should come before flexible parsers.

For example:

```js
[ JSON.parse, require("toml").parse, require("js-yaml").load ]
```

#### callback

Type: `Function` taking (`Error`, `Object`)

Standard completion callback.

#### result

Type: `Object`

Configuration object.

## Usage

Invoke `markdownlint` and use the `result` object's `toString` method:

```js
const markdownlint = require("markdownlint");

const options = {
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
bad.string: 3: MD010/no-hard-tabs Hard tabs [Column: 19]
bad.string: 1: MD018/no-missing-space-atx No space after hash on atx style heading [Context: "#bad.string"]
bad.string: 3: MD018/no-missing-space-atx No space after hash on atx style heading [Context: "#This string fails        some rules."]
bad.string: 1: MD041/first-line-heading/first-line-h1 First line in a file should be a top-level heading [Context: "#bad.string"]
bad.md: 3: MD010/no-hard-tabs Hard tabs [Column: 17]
bad.md: 1: MD018/no-missing-space-atx No space after hash on atx style heading [Context: "#bad.md"]
bad.md: 3: MD018/no-missing-space-atx No space after hash on atx style heading [Context: "#This file fails      some rules."]
bad.md: 1: MD041/first-line-heading/first-line-h1 First line in a file should be a top-level heading [Context: "#bad.md"]
```

Or invoke `markdownlint.sync` for a synchronous call:

```js
const result = markdownlint.sync(options);
console.log(result.toString());
```

To examine the `result` object directly:

```js
markdownlint(options, function callback(err, result) {
  if (!err) {
    console.dir(result, { "colors": true, "depth": null });
  }
});
```

Output:

```json
{
  "good.md": [],
  "bad.md": [
    { "lineNumber": 3,
      "ruleNames": [ "MD010", "no-hard-tabs" ],
      "ruleDescription": "Hard tabs",
      "ruleInformation": "https://github.com/DavidAnson/markdownlint/blob/v0.0.0/doc/Rules.md#md010",
      "errorDetail": "Column: 17",
      "errorContext": null,
      "errorRange": [ 17, 1 ] },
    { "lineNumber": 1,
      "ruleNames": [ "MD018", "no-missing-space-atx" ],
      "ruleDescription": "No space after hash on atx style heading",
      "ruleInformation": "https://github.com/DavidAnson/markdownlint/blob/v0.0.0/doc/Rules.md#md018",
      "errorDetail": null,
      "errorContext": "#bad.md",
      "errorRange": [ 1, 2 ] },
    { "lineNumber": 3,
      "ruleNames": [ "MD018", "no-missing-space-atx" ],
      "ruleDescription": "No space after hash on atx style heading",
      "ruleInformation": "https://github.com/DavidAnson/markdownlint/blob/v0.0.0/doc/Rules.md#md018",
      "errorDetail": null,
      "errorContext": "#This file fails\tsome rules.",
      "errorRange": [ 1, 2 ] },
    { "lineNumber": 1,
      "ruleNames": [ "MD041", "first-line-heading", "first-line-h1" ],
      "ruleDescription": "First line in a file should be a top-level heading",
      "ruleInformation": "https://github.com/DavidAnson/markdownlint/blob/v0.0.0/doc/Rules.md#md041",
      "errorDetail": null,
      "errorContext": "#bad.md",
      "errorRange": null }
  ]
}
```

Integration with the [gulp](https://gulpjs.com/) build system is straightforward:

```js
const gulp = require("gulp");
const through2 = require("through2");
const markdownlint = require("markdownlint");

gulp.task("markdownlint", function task() {
  return gulp.src("*.md", { "read": false })
    .pipe(through2.obj(function obj(file, enc, next) {
      markdownlint(
        { "files": [ file.relative ] },
        function callback(err, result) {
          const resultString = (result || "").toString();
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
bad.md: 3: MD010/no-hard-tabs Hard tabs [Column: 17]
bad.md: 1: MD018/no-missing-space-atx No space after hash on atx style heading [Context: "#bad.md"]
bad.md: 3: MD018/no-missing-space-atx No space after hash on atx style heading [Context: "#This file fails      some rules."]
bad.md: 1: MD041/first-line-heading/first-line-h1 First line in a file should be a top-level heading [Context: "#bad.md"]
[00:00:00] Finished 'markdownlint' after 10 ms
```

Integration with the [Grunt](https://gruntjs.com/) build system is similar:

```js
const markdownlint = require("markdownlint");

module.exports = function wrapper(grunt) {
  grunt.initConfig({
    "markdownlint": {
      "example": {
        "src": [ "*.md" ]
      }
    }
  });

  grunt.registerMultiTask("markdownlint", function task() {
    const done = this.async();
    markdownlint(
      { "files": this.filesSrc },
      function callback(err, result) {
        const resultString = err || ((result || "").toString());
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
bad.md: 3: MD010/no-hard-tabs Hard tabs [Column: 17]
bad.md: 1: MD018/no-missing-space-atx No space after hash on atx style heading [Context: "#bad.md"]
bad.md: 3: MD018/no-missing-space-atx No space after hash on atx style heading [Context: "#This file fails      some rules."]
bad.md: 1: MD041/first-line-heading/first-line-h1 First line in a file should be a top-level heading [Context: "#bad.md"]
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
const options = {
  "strings": {
    "content": "Some Markdown to lint."
  }
};
const results = window.markdownlint.sync(options).toString();
```

## Examples

For ideas how to integrate `markdownlint` into your workflow, refer to the following projects:

* [.NET Documentation](https://docs.microsoft.com/en-us/dotnet/) ([Search repository](https://github.com/dotnet/docs/search?q=markdownlint))
* [ally.js](https://allyjs.io/) ([Search repository](https://github.com/medialize/ally.js/search?q=markdownlint))
* [Boostnote](https://boostnote.io/) ([Search repository](https://github.com/BoostIO/Boostnote/search?q=markdownlint))
* [CodiMD](https://github.com/hackmdio/codimd) ([Search repository](https://github.com/hackmdio/codimd/search?q=markdownlint))
* [ESLint](https://eslint.org/) ([Search repository](https://github.com/eslint/eslint/search?q=markdownlint))
* [Garden React Components](https://zendeskgarden.github.io/react-components/) ([Search repository](https://github.com/zendeskgarden/react-components/search?q=markdownlint))
* [MkDocs](https://www.mkdocs.org/) ([Search repository](https://github.com/mkdocs/mkdocs/search?q=markdownlint))
* [Mocha](https://mochajs.org/) ([Search repository](https://github.com/mochajs/mocha/search?q=markdownlint))
* [Reactable](https://glittershark.github.io/reactable/) ([Search repository](https://github.com/glittershark/reactable/search?q=markdownlint))
* [Sinon.JS](https://sinonjs.org/) ([Search repository](https://github.com/sinonjs/sinon/search?q=markdownlint))
* [TestCafe](https://devexpress.github.io/testcafe/) ([Search repository](https://github.com/DevExpress/testcafe/search?q=markdownlint))
* [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/basic-types.html) ([Search repository](https://github.com/Microsoft/TypeScript-Handbook/search?q=markdownlint))
* [V8](https://v8.dev/) ([Search repository](https://github.com/v8/v8.dev/search?q=markdownlint))
* [webhint](https://webhint.io/) ([Search repository](https://github.com/webhintio/hint/search?q=markdownlint))
* [webpack](https://webpack.js.org/) ([Search repository](https://github.com/webpack/webpack.js.org/search?q=markdownlint))
* [WordPress](https://wordpress.org/gutenberg/) ([Search repository](https://github.com/WordPress/gutenberg/search?q=markdownlint))

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

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
* 0.5.0 - Add shareable configuration, `noInlineConfig` option, README links, fix MD030,
          improve MD009/MD041, update dependencies.
* 0.6.0 - `resultVersion` defaults to 1 (breaking change), ignore HTML comments, TOML
          front matter, fixes for MD044, update dependencies.
  * 0.6.1 - Update `markdown-it` versioning, exclude demo/test from publishing.
  * 0.6.2 - Improve MD013/MD027/MD034/MD037/MD038/MD041/MD044, update dependencies.
  * 0.6.3 - Improve highlighting for MD020.
  * 0.6.4 - Improve MD029/MD042, update dependencies.
* 0.7.0 - `resultVersion` defaults to 2 (breaking change), add MD045, improve MD029,
          remove trimLeft/trimRight, split rules, refactor, update dependencies.
* 0.8.0 - Add support for using and authoring custom rules, improve MD004/MD007/MD013,
          add `engines` to `package.json`, refactor, update dependencies.
  * 0.8.1 - Update item loop to be iterative, improve MD014, update dependencies.
* 0.9.0 - Remove support for end-of-life Node versions 0.10/0.12/4, change "header" to
          "heading" per spec (non-breaking), improve MD003/MD009/MD041, handle uncommon
          line-break characters, refactor for ES6, update dependencies.
* 0.10.0 - Add support for non-JSON configuration files, pass file/string name to custom
           rules, update dependencies.
* 0.11.0 - Improve MD005/MD024/MD029/MD038, improve custom rule example, add CONTRIBUTING.md,
           update dependencies.
* 0.12.0 - Add `information` link for custom rules, `markdownItPlugins` for extensibility,
           improve MD023/MD032/MD038, update dependencies.
* 0.13.0 - Improve MD013/MD022/MD025/MD029/MD031/MD032/MD037/MD041/, deprecate MD002,
           improve pandoc YAML support, update dependencies.
* 0.14.0 - Remove support for end-of-life Node version 6, introduce `markdownlint-rule-helpers`,
           add MD046/MD047, improve MD033/MD034/MD039, improve custom rule validation and
           in-browser demo, update dependencies.
  * 0.14.1 - Improve MD033.
  * 0.14.2 - Improve MD047, add `handleRuleFailures` option.
* 0.15.0 - Add `markdownlint-capture`/`markdownlint-restore` inline comments, improve
           MD009/MD013/MD026/MD033/MD036, update dependencies.
* 0.16.0 - Add custom rule sample for linting code, improve MD026/MD031/MD033/MD038,
           update dependencies.
* 0.17.0 - Add `resultVersion` 3 to support fix information for default and custom rules,
           add fix information for 24 rules, update newline handling to match latest
           CommonMark specification, improve MD014/MD037/MD039, update dependencies.
  * 0.17.1 - Fix handling of front matter by fix information.
  * 0.17.2 - Improve MD020/MD033/MD044.
* 0.18.0 - Add MD048/code-fence-style, add fix information for MD007/ul-indent, add
           `markdownlint-disable-file`/`markdownlint-enable-file` inline comments, add
           type declaration file (.d.ts) for TypeScript dependents, update schema, improve
           MD006/MD007/MD009/MD013/MD030, update dependencies.
* 0.19.0 - Remove support for end-of-life Node version 8, add fix information for
           MD005/list-indent, improve MD007/MD013/MD014, deprecate MD006/ul-start-left, add
           rationale for every rule, update test runner and code coverage, add more JSDoc
           comments, update dependencies.
* 0.20.0 - Add `markdownlint-configure-file` inline comment, reimplement MD037,
           improve MD005/MD007/MD013/MD018/MD029/MD031/MD034/MD038/MD039, improve HTML
           comment handling, update dependencies.
  * 0.20.1 - Fix regression in MD037.
  * 0.20.2 - Fix regression in MD037, improve MD038.
  * 0.20.3 - Fix regression in MD037, improve MD044, add automatic regression testing.
  * 0.20.4 - Fix regression in MD037, improve MD034/MD044, improve documentation.
* 0.21.0 - Lint concurrently for better performance (async only), add Promise-based APIs,
           update TypeScript declaration file, hide `toString` on `LintResults`, add ability
           to fix in browser demo, allow custom rules in `.markdownlint.json` schema, improve
           MD042/MD044, improve documentation, update dependencies.
  * 0.21.1 - Improve MD011/MD031, export `getVersion` API.
* 0.22.0 - Allow `extends` in config to reference installed packages by name, add
           `markdownlint-disable-next-line` inline comment, support JSON front matter, improve
           MD009/MD026/MD028/MD043, update dependencies (including `markdown-it` to v12).
* 0.23.0 - Add comprehensive example `.markdownlint.jsonc`/`.markdownlint.yaml` files, add fix
           information for MD004/ul-style, improve MD018/MD019/MD020/MD021/MD037/MD041, improve
           HTML comment handling, update test runner and test suite, update dependencies.
  * 0.23.1 - Work around lack of webpack support for dynamic calls to `require` (`.resolve`).

[npm-image]: https://img.shields.io/npm/v/markdownlint.svg
[npm-url]: https://www.npmjs.com/package/markdownlint
[ci-image]: https://github.com/DavidAnson/markdownlint/workflows/CI/badge.svg?branch=main
[ci-url]: https://github.com/DavidAnson/markdownlint/actions?query=branch%3Amain
[license-image]: https://img.shields.io/npm/l/markdownlint.svg
[license-url]: https://opensource.org/licenses/MIT
