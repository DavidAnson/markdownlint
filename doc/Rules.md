
# Rules

This document contains a description of all rules, what they are checking for,
as well as an examples of documents that break the rule and corrected
versions of the examples.

<a name="md001"></a>

## MD001 - Heading levels should only increment by one level at a time

Tags: headings, headers

Aliases: heading-increment, header-increment

This rule is triggered when you skip heading levels in a markdown document, for
example:

```markdown
# Heading 1

### Heading 3

We skipped out a 2nd level heading in this document
```

When using multiple heading levels, nested headings should increase by only one
level at a time:

```markdown
# Heading 1

## Heading 2

### Heading 3

#### Heading 4

## Another Heading 2

### Another Heading 3
```

<a name="md002"></a>

## MD002 - First heading should be a top level heading

Tags: headings, headers

Aliases: first-heading-h1, first-header-h1

Parameters: level (number; default 1)

> Note: *MD002 has been deprecated and is disabled by default.*
> [MD041/first-line-heading](#md041) offers an improved implementation.

This rule is intended to ensure document headings start at the top level and
is triggered when the first heading in the document isn't an h1 heading:

```markdown
## This isn't an H1 heading

### Another heading
```

The first heading in the document should be an h1 heading:

```markdown
# Start with an H1 heading

## Then use an H2 for subsections
```

Note: The `level` parameter can be used to change the top level (ex: to h2) in
cases where an h1 is added externally.

<a name="md003"></a>

## MD003 - Heading style

Tags: headings, headers

Aliases: heading-style, header-style

Parameters: style ("consistent", "atx", "atx_closed", "setext",
"setext_with_atx", "setext_with_atx_closed"; default "consistent")

This rule is triggered when different heading styles (atx, setext, and 'closed'
atx) are used in the same document:

```markdown
# ATX style H1

## Closed ATX style H2 ##

Setext style H1
===============
```

Be consistent with the style of heading used in a document:

```markdown
# ATX style H1

## ATX style H2
```

The setext_with_atx and setext_with_atx_closed doc styles allow atx-style
headings of level 3 or more in documents with setext style headings:

```markdown
Setext style H1
===============

Setext style H2
---------------

### ATX style H3
```

Note: the configured heading style can be a specific style to use (atx,
atx_closed, setext, setext_with_atx, setext_with_atx_closed), or simply require
that the usage be consistent within the document.

<a name="md004"></a>

## MD004 - Unordered list style

Tags: bullet, ul

Aliases: ul-style

Parameters: style ("consistent", "asterisk", "plus", "dash", "sublist"; default
"consistent")

This rule is triggered when the symbols used in the document for unordered
list items do not match the configured unordered list style:

```markdown
* Item 1
+ Item 2
- Item 3
```

To fix this issue, use the configured style for list items throughout the
document:

```markdown
* Item 1
* Item 2
* Item 3
```

The configured list style can be a specific symbol to use (asterisk, plus, dash),
can require that usage be consistent within the document, or can require that each
sublist have a consistent symbol that is different from its parent list.

For example, the following is valid for the `sublist` style because the outer-most
indent uses asterisk, the middle indent uses plus, and the inner-most indent uses dash:

```markdown
* Item 1
  + Item 2
    - Item 3
  + Item 4
* Item 4
  + Item 5
```

<a name="md005"></a>

## MD005 - Inconsistent indentation for list items at the same level

Tags: bullet, ul, indentation

Aliases: list-indent

This rule is triggered when list items are parsed as being at the same level,
but don't have the same indentation:

```markdown
* Item 1
  * Nested Item 1
  * Nested Item 2
   * A misaligned item
```

Usually this rule will be triggered because of a typo. Correct the indentation
for the list to fix it:

```markdown
* Item 1
  * Nested Item 1
  * Nested Item 2
  * Nested Item 3
```

Sequentially-ordered list markers are usually left-aligned such that all items
have the same starting column:

```markdown
...
8. Item
9. Item
10. Item
11. Item
...
```

This rule also supports right-alignment of list markers such that all items have
the same ending column:

```markdown
...
 8. Item
 9. Item
10. Item
11. Item
...
```

<a name="md006"></a>

## MD006 - Consider starting bulleted lists at the beginning of the line

Tags: bullet, ul, indentation

Aliases: ul-start-left

This rule is triggered when top level lists don't start at the beginning of a
line:

```markdown
Some text

  * List item
  * List item
```

To fix, ensure that top level list items are not indented:

```markdown
Some test

* List item
* List item
```

Rationale: Starting lists at the beginning of the line means that nested list
items can all be indented by the same amount when an editor's indent function
or the tab key is used to indent. Starting a list 1 space in means that the
indent of the first nested list is less than the indent of the second level (3
characters if you use 4 space tabs, or 1 character if you use 2 space tabs).

Note: This rule is triggered for the following scenario because the unordered
sublist is not recognized as such by the parser. Not being nested 3 characters
as required by the outer ordered list, it creates a top-level unordered list
instead.

```markdown
1. List item
  - List item
  - List item
1. List item
```

<a name="md007"></a>

## MD007 - Unordered list indentation

Tags: bullet, ul, indentation

Aliases: ul-indent

Parameters: indent (number; default 2)

This rule is triggered when list items are not indented by the configured
number of spaces (default: 2).

Example:

```markdown
* List item
   * Nested list item indented by 3 spaces
```

Corrected Example:

```markdown
* List item
  * Nested list item indented by 2 spaces
```

Rationale (2 space indent): indenting by 2 spaces allows the content of a
nested list to be in line with the start of the content of the parent list
when a single space is used after the list marker.

Rationale (4 space indent): Same indent as code blocks, simpler for editors to
implement. See
<https://www.cirosantilli.com/markdown-style-guide/#indentation-of-content-inside-lists> for more
information.

In addition, this is a compatibility issue with multi-markdown parsers, which
require a 4 space indents. See
<http://support.markedapp.com/discussions/problems/21-sub-lists-not-indenting>
for a description of the problem.

Note: This rule applies to a sublist only if its parent lists are all also
unordered (otherwise, extra indentation of ordered lists interferes with the
rule).

<a name="md009"></a>

## MD009 - Trailing spaces

Tags: whitespace

Aliases: no-trailing-spaces

Parameters: br_spaces, list_item_empty_lines (number; default 2, boolean; default false)

This rule is triggered on any lines that end with unexpected whitespace. To fix this,
remove the trailing space from the end of the line.

The `br_spaces` parameter allows an exception to this rule for a specific number
of trailing spaces, typically used to insert an explicit line break. The default
value allows 2 spaces to indicate a hard break (\<br> element).

Note: You must set `br_spaces` to a value >= 2 for this parameter to take effect.
Setting `br_spaces` to 1 behaves the same as 0, disallowing any trailing spaces.

Using spaces to indent blank lines inside a list item is usually not necessary,
but some parsers require it. Set the `list_item_empty_lines` parameter to `true`
to allow this:

```markdown
- list item text
  [2 spaces]
  list item text
```

<a name="md010"></a>

## MD010 - Hard tabs

Tags: whitespace, hard_tab

Aliases: no-hard-tabs

Parameters: code_blocks (boolean; default true)

This rule is triggered by any lines that contain hard tab characters instead
of using spaces for indentation. To fix this, replace any hard tab characters
with spaces instead.

Example:

```markdown
Some text

	* hard tab character used to indent the list item
```

Corrected example:

```markdown
Some text

    * Spaces used to indent the list item instead
```

You have the option to exclude this rule for code blocks. To do so, set the
`code_blocks` parameter to `false`. Code blocks are included by default since
handling of tabs by tools is often inconsistent (ex: using 4 vs. 8 spaces).

<a name="md011"></a>

## MD011 - Reversed link syntax

Tags: links

Aliases: no-reversed-links

This rule is triggered when text that appears to be a link is encountered, but
where the syntax appears to have been reversed (the `[]` and `()` are
reversed):

```markdown
(Incorrect link syntax)[https://www.example.com/]
```

To fix this, swap the `[]` and `()` around:

```markdown
[Correct link syntax](https://www.example.com/)
```

Note: [Markdown Extra](https://en.wikipedia.org/wiki/Markdown_Extra)-style footnotes do not trigger this rule:

```markdown
For (example)[^1]
```

<a name="md012"></a>

## MD012 - Multiple consecutive blank lines

Tags: whitespace, blank_lines

Aliases: no-multiple-blanks

Parameters: maximum (number; default 1)

This rule is triggered when there are multiple consecutive blank lines in the
document:

```markdown
Some text here


Some more text here
```

To fix this, delete the offending lines:

```markdown
Some text here

Some more text here
```

Note: this rule will not be triggered if there are multiple consecutive blank
lines inside code blocks.

Note: The `maximum` parameter can be used to configure the maximum number of
consecutive blank lines.

<a name="md013"></a>

## MD013 - Line length

Tags: line_length

Aliases: line-length

Parameters: line_length, heading_line_length, code_blocks, tables, headings, headers (number; default 80, boolean; default true)

> If `headings` is not provided, `headers` (deprecated) will be used.

This rule is triggered when there are lines that are longer than the
configured `line_length` (default: 80 characters). To fix this, split the line
up into multiple lines. To set a different maximum length for headings, use
`heading_line_length`.

This rule has an exception where there is no whitespace beyond the configured
line length. This allows you to still include items such as long URLs without
being forced to break them in the middle.

You have the option to exclude this rule for code blocks, tables, or headings.
To do so, set the `code_blocks`, `tables`, or `headings` parameter(s) to false.

Code blocks are included in this rule by default since it is often a
requirement for document readability, and tentatively compatible with code
rules. Still, some languages do not lend themselves to short lines.

<a name="md014"></a>

## MD014 - Dollar signs used before commands without showing output

Tags: code

Aliases: commands-show-output

This rule is triggered when there are code blocks showing shell commands to be
typed, and the shell commands are preceded by dollar signs ($):

```markdown
$ ls
$ cat foo
$ less bar
```

The dollar signs are unnecessary in the above situation, and should not be
included:

```markdown
ls
cat foo
less bar
```

However, an exception is made when there is a need to distinguish between
typed commands and command output, as in the following example:

```markdown
$ ls
foo bar
$ cat foo
Hello world
$ cat bar
baz
```

Rationale: it is easier to copy and paste and less noisy if the dollar signs
are omitted when they are not needed. See
<https://www.cirosantilli.com/markdown-style-guide/#dollar-signs-in-shell-code>
for more information.

<a name="md018"></a>

## MD018 - No space after hash on atx style heading

Tags: headings, headers, atx, spaces

Aliases: no-missing-space-atx

This rule is triggered when spaces are missing after the hash characters
in an atx style heading:

```markdown
#Heading 1

##Heading 2
```

To fix this, separate the heading text from the hash character by a single
space:

```markdown
# Heading 1

## Heading 2
```

<a name="md019"></a>

## MD019 - Multiple spaces after hash on atx style heading

Tags: headings, headers, atx, spaces

Aliases: no-multiple-space-atx

This rule is triggered when more than one space is used to separate the
heading text from the hash characters in an atx style heading:

```markdown
#  Heading 1

##  Heading 2
```

To fix this, separate the heading text from the hash character by a single
space:

```markdown
# Heading 1

## Heading 2
```

<a name="md020"></a>

## MD020 - No space inside hashes on closed atx style heading

Tags: headings, headers, atx_closed, spaces

Aliases: no-missing-space-closed-atx

This rule is triggered when spaces are missing inside the hash characters
in a closed atx style heading:

```markdown
#Heading 1#

##Heading 2##
```

To fix this, separate the heading text from the hash character by a single
space:

```markdown
# Heading 1 #

## Heading 2 ##
```

Note: this rule will fire if either side of the heading is missing spaces.

<a name="md021"></a>

## MD021 - Multiple spaces inside hashes on closed atx style heading

Tags: headings, headers, atx_closed, spaces

Aliases: no-multiple-space-closed-atx

This rule is triggered when more than one space is used to separate the
heading text from the hash characters in a closed atx style heading:

```markdown
#  Heading 1  #

##  Heading 2  ##
```

To fix this, separate the heading text from the hash character by a single
space:

```markdown
# Heading 1 #

## Heading 2 ##
```

Note: this rule will fire if either side of the heading contains multiple
spaces.

<a name="md022"></a>

## MD022 - Headings should be surrounded by blank lines

Tags: headings, headers, blank_lines

Aliases: blanks-around-headings, blanks-around-headers

Parameters: lines_above, lines_below (number; default 1)

This rule is triggered when headings (any style) are either not preceded or not
followed by at least one blank line:

```markdown
# Heading 1
Some text

Some more text
## Heading 2
```

To fix this, ensure that all headings have a blank line both before and after
(except where the heading is at the beginning or end of the document):

```markdown
# Heading 1

Some text

Some more text

## Heading 2
```

Rationale: Aside from aesthetic reasons, some parsers, including kramdown, will
not parse headings that don't have a blank line before, and will parse them as
regular text.

The `lines_above` and `lines_below` parameters can be used to specify a different
number of blank lines (including 0) above or below each heading.

Note: If `lines_above` or `lines_below` are configured to require more than one
blank line, [MD012/no-multiple-blanks](#md012) should also be customized.

<a name="md023"></a>

## MD023 - Headings must start at the beginning of the line

Tags: headings, headers, spaces

Aliases: heading-start-left, header-start-left

This rule is triggered when a heading is indented by one or more spaces:

```markdown
Some text

  # Indented heading
```

To fix this, ensure that all headings start at the beginning of the line:

```markdown
Some text

# Heading
```

Rationale: Headings that don't start at the beginning of the line will not be
parsed as headings, and will instead appear as regular text.

<a name="md024"></a>

## MD024 - Multiple headings with the same content

Tags: headings, headers

Aliases: no-duplicate-heading, no-duplicate-header

Parameters: siblings_only, allow_different_nesting (boolean; default `false`)

This rule is triggered if there are multiple headings in the document that have
the same text:

```markdown
# Some text

## Some text
```

To fix this, ensure that the content of each heading is different:

```markdown
# Some text

## Some more text
```

Rationale: Some markdown parses generate anchors for headings based on the
heading name, and having headings with the same content can cause problems with
this.

If the parameter `siblings_only` (alternatively `allow_different_nesting`) is
set to `true`, heading duplication is allowed for non-sibling headings (common
in change logs):

```markdown
# Change log

## 1.0.0

### Features

## 2.0.0

### Features
```

<a name="md025"></a>

## MD025 - Multiple top level headings in the same document

Tags: headings, headers

Aliases: single-title, single-h1

Parameters: level, front_matter_title (number; default 1, string; default "^\s*title:")

This rule is triggered when a top level heading is in use (the first line of
the file is an h1 heading), and more than one h1 heading is in use in the
document:

```markdown
# Top level heading

# Another top level heading
```

To fix, structure your document so that there is a single h1 heading that is
the title for the document, and all later headings are h2 or lower level
headings:

```markdown
# Title

## Heading

## Another heading
```

Rationale: A top level heading is an h1 on the first line of the file, and
serves as the title for the document. If this convention is in use, then there
can not be more than one title for the document, and the entire document
should be contained within this heading.

Note: The `level` parameter can be used to change the top level (ex: to h2) in
cases where an h1 is added externally.

If [YAML](https://en.wikipedia.org/wiki/YAML) front matter is present and contains
a `title` property (commonly used with blog posts), this rule treats that as a top
level heading and will report a violation for any subsequent top level headings.
To use a different property name in front matter, specify the text of a regular
expression via the `front_matter_title` parameter. To disable the use of front
matter by this rule, specify `""` for `front_matter_title`.

<a name="md026"></a>

## MD026 - Trailing punctuation in heading

Tags: headings, headers

Aliases: no-trailing-punctuation

Parameters: punctuation (string; default ".,;:!?")

This rule is triggered on any heading that has a punctuation character as the
last character in the line:

```markdown
# This is a heading.
```

To fix this, remove any trailing punctuation:

```markdown
# This is a heading
```

Note: The punctuation parameter can be used to specify what characters class
as punctuation at the end of the heading. For example, you can set it to
`".,;:!"` to allow headings with question marks in them, such as might be used
in an FAQ.

<a name="md027"></a>

## MD027 - Multiple spaces after blockquote symbol

Tags: blockquote, whitespace, indentation

Aliases: no-multiple-space-blockquote

This rule is triggered when blockquotes have more than one space after the
blockquote (`>`) symbol:

```markdown
>  This is a block quote with bad indentation
>  there should only be one.
```

To fix, remove any extraneous space:

```markdown
> This is a blockquote with correct
> indentation.
```

<a name="md028"></a>

## MD028 - Blank line inside blockquote

Tags: blockquote, whitespace

Aliases: no-blanks-blockquote

This rule is triggered when two blockquote blocks are separated by nothing
except for a blank line:

```markdown
> This is a blockquote
> which is immediately followed by

> this blockquote. Unfortunately
> In some parsers, these are treated as the same blockquote.
```

To fix this, ensure that any blockquotes that are right next to each other
have some text in between:

```markdown
> This is a blockquote.

And Jimmy also said:

> This too is a blockquote.
```

Alternatively, if they are supposed to be the same quote, then add the
blockquote symbol at the beginning of the blank line:

```markdown
> This is a blockquote.
>
> This is the same blockquote.
```

Rationale: Some markdown parsers will treat two blockquotes separated by one
or more blank lines as the same blockquote, while others will treat them as
separate blockquotes.

<a name="md029"></a>

## MD029 - Ordered list item prefix

Tags: ol

Aliases: ol-prefix

Parameters: style ("one", "ordered", "one_or_ordered", "zero"; default "one_or_ordered")

This rule is triggered for ordered lists that do not either start with '1.' or
do not have a prefix that increases in numerical order (depending on the
configured style). The less-common pattern of using '0.' for all prefixes is
also supported.

Example valid list if the style is configured as 'one':

```markdown
1. Do this.
1. Do that.
1. Done.
```

Example valid list if the style is configured as 'ordered':

```markdown
1. Do this.
2. Do that.
3. Done.
```

Both examples are valid when the style is configured as 'one_or_ordered'.

Example valid list if the style is configured as 'zero':

```markdown
0. Do this.
0. Do that.
0. Done.
```

Example invalid list for all styles:

```markdown
1. Do this.
3. Done.
```

This rule supports 0-prefixing ordered list items for uniform indentation:

```markdown
...
08. Item
09. Item
10. Item
11. Item
...
```

<a name="md030"></a>

## MD030 - Spaces after list markers

Tags: ol, ul, whitespace

Aliases: list-marker-space

Parameters: ul_single, ol_single, ul_multi, ol_multi (number; default 1)

This rule checks for the number of spaces between a list marker (e.g. '`-`',
'`*`', '`+`' or '`1.`') and the text of the list item.

The number of spaces checked for depends on the document style in use, but the
default is 1 space after any list marker:

```markdown
* Foo
* Bar
* Baz

1. Foo
1. Bar
1. Baz

1. Foo
   * Bar
1. Baz
```

A document style may change the number of spaces after unordered list items
and ordered list items independently, as well as based on whether the content
of every item in the list consists of a single paragraph, or multiple
paragraphs (including sub-lists and code blocks).

For example, the style guide at
<https://www.cirosantilli.com/markdown-style-guide/#spaces-after-list-marker>
specifies that 1 space after the list marker should be used if every item in
the list fits within a single paragraph, but to use 2 or 3 spaces (for ordered
and unordered lists respectively) if there are multiple paragraphs of content
inside the list:

```markdown
* Foo
* Bar
* Baz
```

vs.

```markdown
*   Foo

    Second paragraph

*   Bar
```

or

```markdown
1.  Foo

    Second paragraph

1.  Bar
```

To fix this, ensure the correct number of spaces are used after list marker
for your selected document style.

<a name="md031"></a>

## MD031 - Fenced code blocks should be surrounded by blank lines

Tags: code, blank_lines

Aliases: blanks-around-fences

This rule is triggered when fenced code blocks are either not preceded or not
followed by a blank line:

````markdown
Some text
```
Code block
```

```
Another code block
```
Some more text
````

To fix this, ensure that all fenced code blocks have a blank line both before
and after (except where the block is at the beginning or end of the document):

````markdown
Some text

```
Code block
```

```
Another code block
```

Some more text
````

Rationale: Aside from aesthetic reasons, some parsers, including kramdown, will
not parse fenced code blocks that don't have blank lines before and after them.

<a name="md032"></a>

## MD032 - Lists should be surrounded by blank lines

Tags: bullet, ul, ol, blank_lines

Aliases: blanks-around-lists

This rule is triggered when lists (of any kind) are either not preceded or not
followed by a blank line:

```markdown
Some text
* Some
* List

1. Some
2. List
Some text
```

To fix this, ensure that all lists have a blank line both before and after
(except where the block is at the beginning or end of the document):

```markdown
Some text

* Some
* List

1. Some
2. List

Some text
```

Rationale: Aside from aesthetic reasons, some parsers, including kramdown, will
not parse lists that don't have blank lines before and after them.

Note: List items without hanging indents are a violation of this rule; list
items with hanging indents are okay:

```markdown
* This is
not okay

* This is
  okay
```

<a name="md033"></a>

## MD033 - Inline HTML

Tags: html

Aliases: no-inline-html

Parameters: allowed_elements (array of string; default empty)

This rule is triggered whenever raw HTML is used in a markdown document:

```markdown
<h1>Inline HTML heading</h1>
```

To fix this, use 'pure' markdown instead of including raw HTML:

```markdown
# Markdown heading
```

Rationale: Raw HTML is allowed in markdown, but this rule is included for
those who want their documents to only include "pure" markdown, or for those
who are rendering markdown documents in something other than HTML.

Note: To allow specific HTML elements, use the 'allowed_elements' parameter.

<a name="md034"></a>

## MD034 - Bare URL used

Tags: links, url

Aliases: no-bare-urls

This rule is triggered whenever a URL is given that isn't surrounded by angle
brackets:

```markdown
For more information, see https://www.example.com/.
```

To fix this, add angle brackets around the URL:

```markdown
For more information, see <https://www.example.com/>.
```

Rationale: Without angle brackets, the URL isn't converted into a link in many
markdown parsers.

Note: if you do want a bare URL without it being converted into a link,
enclose it in a code block, otherwise in some markdown parsers it _will_ be
converted:

```markdown
`https://www.example.com`
```

<a name="md035"></a>

## MD035 - Horizontal rule style

Tags: hr

Aliases: hr-style

Parameters: style ("consistent", "---", "***", or other string specifying the
horizontal rule; default "consistent")

This rule is triggered when inconsistent styles of horizontal rules are used
in the document:

```markdown
---

- - -

***

* * *

****
```

To fix this, ensure any horizontal rules used in the document are consistent,
or match the given style if the rule is so configured:

```markdown
---

---
```

Note: by default, this rule is configured to just require that all horizontal
rules in the document are the same, and will trigger if any of the horizontal
rules are different than the first one encountered in the document. If you
want to configure the rule to match a specific style, the parameter given to
the 'style' option is a string containing the exact horizontal rule text that
is allowed.

<a name="md036"></a>

## MD036 - Emphasis used instead of a heading

Tags: headings, headers, emphasis

Aliases: no-emphasis-as-heading, no-emphasis-as-header

Parameters: punctuation (string; default ".,;:!?")

This check looks for instances where emphasized (i.e. bold or italic) text is
used to separate sections, where a heading should be used instead:

```markdown
**My document**

Lorem ipsum dolor sit amet...

_Another section_

Consectetur adipiscing elit, sed do eiusmod.
```

To fix this, use markdown headings instead of emphasized text to denote
sections:

```markdown
# My document

Lorem ipsum dolor sit amet...

## Another section

Consectetur adipiscing elit, sed do eiusmod.
```

Note: this rule looks for single line paragraphs that consist entirely of
emphasized text.  It won't fire on emphasis used within regular text,
multi-line emphasized paragraphs, and paragraphs ending in punctuation.
Similarly to rule MD026, you can configure what characters are recognized as
punctuation.

<a name="md037"></a>

## MD037 - Spaces inside emphasis markers

Tags: whitespace, emphasis

Aliases: no-space-in-emphasis

This rule is triggered when emphasis markers (bold, italic) are used, but they
have spaces between the markers and the text:

```markdown
Here is some ** bold ** text.

Here is some * italic * text.

Here is some more __ bold __ text.

Here is some more _ italic _ text.
```

To fix this, remove the spaces around the emphasis markers:

```markdown
Here is some **bold** text.

Here is some *italic* text.

Here is some more __bold__ text.

Here is some more _italic_ text.
```

Rationale: Emphasis is only parsed as such when the asterisks/underscores
aren't completely surrounded by spaces. This rule attempts to detect where
they were surrounded by spaces, but it appears that emphasized text was
intended by the author.

<a name="md038"></a>

## MD038 - Spaces inside code span elements

Tags: whitespace, code

Aliases: no-space-in-code

This rule is triggered on code span elements that have spaces right inside the
backticks:

```markdown
` some text `

`some text `

` some text`
```

To fix this, remove the spaces inside the codespan markers:

```markdown
`some text`
```

Note: A single leading or trailing space is allowed if used to separate codespan
markers from an embedded backtick:

```markdown
`` ` embedded backtick``
```

<a name="md039"></a>

## MD039 - Spaces inside link text

Tags: whitespace, links

Aliases: no-space-in-links

This rule is triggered on links that have spaces surrounding the link text:

```markdown
[ a link ](https://www.example.com/)
```

To fix this, remove the spaces surrounding the link text:

```markdown
[a link](https://www.example.com/)
```

<a name="md040"></a>

## MD040 - Fenced code blocks should have a language specified

Tags: code, language

Aliases: fenced-code-language

This rule is triggered when fenced code blocks are used, but a language isn't
specified:

````markdown
```
#!/bin/bash
echo Hello world
```
````

To fix this, add a language specifier to the code block:

````markdown
```bash
#!/bin/bash
echo Hello world
```
````

<a name="md041"></a>

## MD041 - First line in file should be a top level heading

Tags: headings, headers

Aliases: first-line-heading, first-line-h1

Parameters: level, front_matter_title (number; default 1, string; default "^\s*title:")

This rule is intended to ensure documents have a title and is triggered when
the first line in the file isn't a top level (h1) heading:

```markdown
This is a file without a heading
```

To fix this, add a top level heading to the beginning of the file:

```markdown
# File with heading

This is a file with a top level heading
```

Note: The `level` parameter can be used to change the top level (ex: to h2) in cases
where an h1 is added externally.

If [YAML](https://en.wikipedia.org/wiki/YAML) front matter is present and contains a
`title` property (commonly used with blog posts), this rule will not report a
violation. To use a different property name in front matter, specify the text
of a regular expression via the `front_matter_title` parameter. To disable the
use of front matter by this rule, specify `""` for `front_matter_title`.

<a name="md042"></a>

## MD042 - No empty links

Tags: links

Aliases: no-empty-links

This rule is triggered when an empty link is encountered:

```markdown
[an empty link]()
```

To fix the violation, provide a destination for the link:

```markdown
[a valid link](https://example.com/)
```

Empty fragments will trigger this rule:

```markdown
[an empty fragment](#)
```

But non-empty fragments will not:

```markdown
[a valid fragment](#fragment)
```

<a name="md043"></a>

## MD043 - Required heading structure

Tags: headings, headers

Aliases: required-headings, required-headers

Parameters: headings, headers (array of string; default `null` for disabled)

> If `headings` is not provided, `headers` (deprecated) will be used.

This rule is triggered when the headings in a file do not match the array of
headings passed to the rule. It can be used to enforce a standard heading
structure for a set of files.

To require exactly the following structure:

```markdown
# Head
## Item
### Detail
```

Set the `headings` parameter to:

```json
[
    "# Head",
    "## Item",
    "### Detail"
]
```

To allow optional headings as with the following structure:

```markdown
# Head
## Item
### Detail (optional)
## Foot
### Notes (optional)
```

Use the special value `"*"` meaning "one or more unspecified headings" and set
the `headings` parameter to:

```json
[
    "# Head",
    "## Item",
    "*",
    "## Foot",
    "*"
]
```

When an error is detected, this rule outputs the line number of the first
problematic heading (otherwise, it outputs the last line number of the file).

Note that while the `headings` parameter uses the "## Text" ATX heading style for
simplicity, a file may use any supported heading style.

<a name="md044"></a>

## MD044 - Proper names should have the correct capitalization

Tags: spelling

Aliases: proper-names

Parameters: names, code_blocks (string array; default `null`, boolean; default `true`)

This rule is triggered when any of the strings in the `names` array do not have
the specified capitalization. It can be used to enforce a standard letter case
for the names of projects and products.

For example, the language "JavaScript" is usually written with both the 'J' and
'S' capitalized - though sometimes the 's' or 'j' appear in lower-case. To enforce
the proper capitalization, specify the desired letter case in the `names` array:

```json
[
    "JavaScript"
]
```

Set the `code_blocks` parameter to `false` to disable this rule for code blocks.

<a name="md045"></a>

## MD045 - Images should have alternate text (alt text)

Tags: accessibility, images

Aliases: no-alt-text

This rule is triggered when an image is missing alternate text (alt text) information.
Alternate text is important for accessibility, describing the content of an image for
people who may not be able to see it.

Alternate text is commonly specified inline as:

```markdown
![Alternate text](image.jpg)
```

Or with reference syntax as:

```markdown
![Alternate text][ref]

...

[ref]: image.jpg "Optional title"
```

Guidance for writing alternate text is available from the [W3C](https://www.w3.org/WAI/alt/),
[Wikipedia](https://en.wikipedia.org/wiki/Alt_attribute), and
[other locations](https://www.phase2technology.com/blog/no-more-excuses-definitive-guide-alt-text-field).

<a name="md046"></a>

## MD046 - Code block style

Tags: code

Aliases: code-block-style

Parameters: style ("consistent", "fenced", "indented"; default "consistent")

This rule is triggered when unwanted or different code block styles are used in
the same document.

In the default configuration this rule reports a violation for the following document:

    Some text.

        # Indented code

    More text.

    ```ruby
    # Fenced code
    ```

    More text.

To fix violations of this rule, use a consistent style (either indenting or code fences).

The specified style can be specific (`fenced`, `indented`) or simply require that usage
be consistent within the document (`consistent`).

<a name="md047"></a>

## MD047 - Files should end with a single newline character

Tags: blank_lines

Aliases: single-trailing-newline

This rule is triggered when there is not a single newline character at the end of a file.

Example that triggers the rule:

```markdown
# Heading

This file ends without a newline.[EOF]
```

To fix the violation, add a newline character to the end of the file:

```markdown
# Heading

This file ends with a newline.
[EOF]
```
