# Rules

This document contains a description of all rules, what they are checking for,
as well as an examples of documents that break the rule and corrected
versions of the examples.

<a name="md001"></a>

## MD001 - Header levels should only increment by one level at a time

Tags: headers

Aliases: header-increment

This rule is triggered when you skip header levels in a markdown document, for
example:

```markdown
# Header 1

### Header 3

We skipped out a 2nd level header in this document
```

When using multiple header levels, nested headers should increase by only one
level at a time:

```markdown
# Header 1

## Header 2

### Header 3

#### Header 4

## Another Header 2

### Another Header 3
```

<a name="md002"></a>

## MD002 - First header should be a top level header

Tags: headers

Aliases: first-header-h1

Parameters: level (number; default 1)

This rule is triggered when the first header in the document isn't a h1 header:

```markdown
## This isn't a H1 header

### Another header
```

The first header in the document should be a h1 header:

```markdown
# Start with a H1 header

## Then use a H2 for subsections
```

Note: The `level` parameter can be used to change the top level (ex: to h2) in
cases where an h1 is added externally.

<a name="md003"></a>

## MD003 - Header style

Tags: headers

Aliases: header-style

Parameters: style ("consistent", "atx", "atx_closed", "setext",
"setext_with_atx", "setext_with_atx_closed"; default "consistent")

This rule is triggered when different header styles (atx, setext, and 'closed'
atx) are used in the same document:

```markdown
# ATX style H1

## Closed ATX style H2 ##

Setext style H1
===============
```

Be consistent with the style of header used in a document:

```markdown
# ATX style H1

## ATX style H2
```

The setext_with_atx and setext_with_atx_closed doc styles allow atx-style
headers of level 3 or more in documents with setext style headers:

```markdown
Setext style H1
===============

Setext style H2
---------------

### ATX style H3
```

Note: the configured header style can be a specific style to use (atx,
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
<http://www.cirosantilli.com/markdown-styleguide/#indented-lists> for more
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

Parameters: br_spaces, list_item_empty_lines (number; default 0, boolean; default false)

This rule is triggered on any lines that end with whitespace. To fix this,
find the line that is triggered and remove any trailing spaces from the end.

The `br_spaces` parameter allows an exception to this rule for a specific amount
of trailing spaces used to insert an explicit line break/br element. For
example, set `br_spaces` to 2 to allow exactly 2 spaces at the end of a line.

Note: you have to set `br_spaces` to 2 or higher for this exception to take
effect - you can't insert a br element with just a single trailing space, so
if you set `br_spaces` to 1, the exception will be disabled, just as if it was
set to the default of 0.

Using spaces to indent blank lines inside a list item is usually not necessary,
but some parsers require it. Set the `list_item_empty_lines` parameter to `true`
to allow this:

```markdown
- list item text
  
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
(Incorrect link syntax)[http://www.example.com/]
```

To fix this, swap the `[]` and `()` around:

```markdown
[Correct link syntax](http://www.example.com/)
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

Parameters: line_length, code_blocks, tables, headers (number; default 80, boolean; default true)

This rule is triggered when there are lines that are longer than the
configured line length (default: 80 characters). To fix this, split the line
up into multiple lines.

This rule has an exception where there is no whitespace beyond the configured
line length. This allows you to still include items such as long URLs without
being forced to break them in the middle.

You have the option to exclude this rule for code blocks, tables, or headers.
To do so, set the `code_blocks`, `tables`, or `headers` parameter(s) to false.

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
<http://www.cirosantilli.com/markdown-styleguide/#dollar-signs-in-shell-code>
for more information.

<a name="md018"></a>

## MD018 - No space after hash on atx style header

Tags: headers, atx, spaces

Aliases: no-missing-space-atx

This rule is triggered when spaces are missing after the hash characters
in an atx style header:

```markdown
#Header 1

##Header 2
```

To fix this, separate the header text from the hash character by a single
space:

```markdown
# Header 1

## Header 2
```

<a name="md019"></a>

## MD019 - Multiple spaces after hash on atx style header

Tags: headers, atx, spaces

Aliases: no-multiple-space-atx

This rule is triggered when more than one space is used to separate the
header text from the hash characters in an atx style header:

```markdown
#  Header 1

##  Header 2
```

To fix this, separate the header text from the hash character by a single
space:

```markdown
# Header 1

## Header 2
```

<a name="md020"></a>

## MD020 - No space inside hashes on closed atx style header

Tags: headers, atx_closed, spaces

Aliases: no-missing-space-closed-atx

This rule is triggered when spaces are missing inside the hash characters
in a closed atx style header:

```markdown
#Header 1#

##Header 2##
```

To fix this, separate the header text from the hash character by a single
space:

```markdown
# Header 1 #

## Header 2 ##
```

Note: this rule will fire if either side of the header is missing spaces.

<a name="md021"></a>

## MD021 - Multiple spaces inside hashes on closed atx style header

Tags: headers, atx_closed, spaces

Aliases: no-multiple-space-closed-atx

This rule is triggered when more than one space is used to separate the
header text from the hash characters in a closed atx style header:

```markdown
#  Header 1  #

##  Header 2  ##
```

To fix this, separate the header text from the hash character by a single
space:

```markdown
# Header 1 #

## Header 2 ##
```

Note: this rule will fire if either side of the header contains multiple
spaces.

<a name="md022"></a>

## MD022 - Headers should be surrounded by blank lines

Tags: headers, blank_lines

Aliases: blanks-around-headers

This rule is triggered when headers (any style) are either not preceded or not
followed by a blank line:

```markdown
# Header 1
Some text

Some more text
## Header 2
```

To fix this, ensure that all headers have a blank line both before and after
(except where the header is at the beginning or end of the document):

```markdown
# Header 1

Some text

Some more text

## Header 2
```

Rationale: Aside from aesthetic reasons, some parsers, including kramdown, will
not parse headers that don't have a blank line before, and will parse them as
regular text.

<a name="md023"></a>

## MD023 - Headers must start at the beginning of the line

Tags: headers, spaces

Aliases: header-start-left

This rule is triggered when a header is indented by one or more spaces:

```markdown
Some text

  # Indented header
```

To fix this, ensure that all headers start at the beginning of the line:

```markdown
Some text

# Header
```

Rationale: Headers that don't start at the beginning of the line will not be
parsed as headers, and will instead appear as regular text.

<a name="md024"></a>

## MD024 - Multiple headers with the same content

Tags: headers

Aliases: no-duplicate-header

This rule is triggered if there are multiple headers in the document that have
the same text:

```markdown
# Some text

## Some text
```

To fix this, ensure that the content of each header is different:

```markdown
# Some text

## Some more text
```

Rationale: Some markdown parses generate anchors for headers based on the
header name, and having headers with the same content can cause problems with
this.

<a name="md025"></a>

## MD025 - Multiple top level headers in the same document

Tags: headers

Aliases: single-h1

Parameters: level (number; default 1)

This rule is triggered when a top level header is in use (the first line of
the file is a h1 header), and more than one h1 header is in use in the
document:

```markdown
# Top level header

# Another top level header
```

To fix, structure your document so that there is a single h1 header that is
the title for the document, and all later headers are h2 or lower level
headers:

```markdown
# Title

## Header

## Another header
```

Rationale: A top level header is a h1 on the first line of the file, and
serves as the title for the document. If this convention is in use, then there
can not be more than one title for the document, and the entire document
should be contained within this header.

Note: The `level` parameter can be used to change the top level (ex: to h2) in
cases where an h1 is added externally.

<a name="md026"></a>

## MD026 - Trailing punctuation in header

Tags: headers

Aliases: no-trailing-punctuation

Parameters: punctuation (string; default ".,;:!?")

This rule is triggered on any header that has a punctuation character as the
last character in the line:

```markdown
# This is a header.
```

To fix this, remove any trailing punctuation:

```markdown
# This is a header
```

Note: The punctuation parameter can be used to specify what characters class
as punctuation at the end of the header. For example, you can set it to
`".,;:!"` to allow headers with question marks in them, such as might be used
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

Parameters: style ("one", "ordered", "one_or_ordered"; default "one_or_ordered")

This rule is triggered on ordered lists that do not either start with '1.' or
do not have a prefix that increases in numerical order (depending on the
configured style).

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

Example invalid list for all styles:

```markdown
1. Do this.
3. Done.
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
<http://www.cirosantilli.com/markdown-styleguide/#spaces-after-marker>
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
<h1>Inline HTML header</h1>
```

To fix this, use 'pure' markdown instead of including raw HTML:

```markdown
# Markdown header
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
For more information, see http://www.example.com/.
```

To fix this, add angle brackets around the URL:

```markdown
For more information, see <http://www.example.com/>.
```

Rationale: Without angle brackets, the URL isn't converted into a link in many
markdown parsers.

Note: if you do want a bare URL without it being converted into a link,
enclose it in a code block, otherwise in some markdown parsers it _will_ be
converted:

```markdown
`http://www.example.com`
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

## MD036 - Emphasis used instead of a header

Tags: headers, emphasis

Aliases: no-emphasis-as-header

Parameters: punctuation (string; default ".,;:!?")

This check looks for instances where emphasized (i.e. bold or italic) text is
used to separate sections, where a header should be used instead:

```markdown
**My document**

Lorem ipsum dolor sit amet...

_Another section_

Consectetur adipiscing elit, sed do eiusmod.
```

To fix this, use markdown headers instead of emphasized text to denote
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
[ a link ](http://www.example.com/)
```

To fix this, remove the spaces surrounding the link text:

```markdown
[a link](http://www.example.com/)
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

## MD041 - First line in file should be a top level header

Tags: headers

Aliases: first-line-h1

Parameters: level, front_matter_title (number; default 1, string; default "^\s*title:")

This rule is triggered when the first line in the file isn't a top level (h1)
header:

```markdown
This is a file without a header
```

To fix this, add a header to the top of your file:

```markdown
# File with header

This is a file with a top level header
```

The `level` parameter can be used to change the top level (ex: to h2) in cases
where an h1 is added externally.

If front matter is present and contains a [YAML](https://en.wikipedia.org/wiki/YAML)
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

## MD043 - Required header structure

Tags: headers

Aliases: required-headers

Parameters: headers (array of string; default `null` for disabled)

This rule is triggered when the headers in a file do not match the array of
headers passed to the rule. It can be used to enforce a standard header
structure for a set of files.

To require exactly the following structure:

```markdown
# Head
## Item
### Detail
```

Set the `headers` parameter to:

```json
[
    "# Head",
    "## Item",
    "### Detail"
]
```

To allow optional headers as with the following structure:

```markdown
# Head
## Item
### Detail (optional)
## Foot
### Notes (optional)
```

Use the special value `"*"` meaning "one or more unspecified headers" and set
the `headers` parameter to:

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
problematic header (otherwise, it outputs the last line number of the file).

Note that while the `headers` parameter uses the "## Text" ATX header style for
simplicity, a file may use any supported header style.

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
