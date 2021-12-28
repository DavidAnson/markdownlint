# Heading

<!-- markdownlint-disable-file emphasis-style strong-style -->

Line with *Normal emphasis*

Line with **Normal strong**

Line with ***Normal strong and emphasis***

Line with _Normal emphasis_

Line with __Normal strong__

Line with ___Normal strong and emphasis___

Broken * emphasis * with spaces in {MD037}

Broken ** strong ** with spaces in {MD037}

Broken *** strong and emphasis *** with spaces in {MD037}

Broken _ emphasis _ with spaces in {MD037}

Broken __ strong __ with spaces in {MD037}

Broken ___ strong and emphasis ___ with spaces in {MD037}

Mixed *ok emphasis* and * broken emphasis * {MD037}

Mixed **ok strong** and ** broken strong ** {MD037}

Mixed ***ok strong and emphasis*** and *** broken strong and emphasis *** {MD037}

Mixed _ok emphasis_ and _ broken emphasis _ {MD037}

Mixed __ok strong__ and __ broken strong __ {MD037}

Mixed ___ok strong and emphasis___ and ___ broken strong and emphasis ___ {MD037}

Mixed *ok emphasis* **ok strong** * broken emphasis * {MD037}

Multiple * broken emphasis * _ broken emphasis _ {MD037}

One-sided *broken emphasis * {MD037}

One-sided * broken emphasis* {MD037}

Will _flag on _words with underscores before them. {MD037}

The same goes for words* with asterisks* after them. {MD037}

But not with escaped\* asterisks\* \_and \_underscores.

* Emphasis* with left space is recognized as a list

** Strong** with left space {MD037}

*** Strong and emphasis*** with left space {MD037}

_ Emphasis_ with left space {MD037}

__ Strong__ with left space {MD037}

___ Strong and emphasis___ with left space {MD037}

*Emphasis * with right space {MD037}

**Strong ** with right space {MD037}

***Strong and emphasis *** with right space {MD037}

_Emphasis _ with right space {MD037}

__Strong __ with right space {MD037}

___Strong and emphasis ___ with right space {MD037}

{MD037} Left space * emphasis*

{MD037} Left space ** strong**

{MD037} Left space *** strong and emphasis***

{MD037} Left space _ emphasis_

{MD037} Left space __ strong__

{MD037} Left space ___ strong and emphasis___

{MD037} Right space *emphasis *

{MD037} Right space **strong **

{MD037} Right space ***strong and emphasis ***

{MD037} Right space _emphasis _

{MD037} Right space __strong __

{MD037} Right space ___strong and emphasis ___

**Multiple ** spaces **in ** emphasis **at ** once. {MD037}

**Multiple ** spaces ** in** emphasis ** at ** once. {MD037}

This is * an ambiguous * scenario {MD037}

* List item *with emphasis* on the
  first and *second lines*.
* List * item* {MD037}
* List *item * {MD037}
* List * item * {MD037}
* List item with
  *hanging* emphasis
  and * some* lines {MD037}
  with *space * problems {MD037}
  throughout * the * content {MD037}

Uncommon scenarios from the CommonMark specification (and some variations):
***strong emph***
***strong** in emph*
***emph* in strong**
**in strong *emph***
*in emph **strong***

*** strong emph*** {MD037}
*** strong** in emph* {MD037}
*** emph* in strong** {MD037}
** in strong *emph*** {MD037}

***strong emph *** {MD037}
***strong** in emph * {MD037}
***emph* in strong ** {MD037}
**in strong *emph *** {MD037}
*in emph **strong *** {MD037}

** *strong emph*** {MD037}
** *strong** in emph* {MD037}
** *emph* in strong** {MD037}
**in strong * emph*** (internal spaces are not detected)
*in emph ** strong*** (internal spaces are not detected)

***strong emph* ** {MD037}
***strong ** in emph* (internal spaces are not detected)
***emph * in strong** (internal spaces are not detected)
**in strong *emph* ** {MD037}
*in emph **strong* ** {MD037}

Text *emph***strong** text
Text * emph***strong** text {MD037}
Text *emph ***strong** text (internal spaces are not detected)
Text *emph*** strong** text (internal spaces are not detected)
Text *emph***strong ** text {MD037}

```markdown
Violations * are * allowed in code blocks where emphasis does not apply.
```

Emphasis `inside * code * blocks` is okay.

Emphasis `* inside` code `blocks *` is okay.

Emphasis `inside *` code `* blocks` is okay.

Emphasis `inside _ code _ blocks` is okay.

Emphasis `_ inside` code `blocks _` is okay.

Emphasis `inside _` code `_ blocks` is okay.

Mixed `code_span` scenarios are _also_ okay.

Mixed `code*span` scenarios are *also* okay.

Mixed `code*span` scenarios are _also_ okay.

Mixed `code_span` scenarios are *also* okay.

[Link](under_score) followed by _underscore_

[Link](un_der_score) followed by _underscore_

[Link](un_der_sco_re) followed by _underscore_

[Link](star*star) followed by *star*

* [Link](star*star) followed by *star*

Text [Link](under_score) text _underscore_ text [Link](st*ar) text *star* text

[Link [link] link](under_score) followed by _underscore_

**under_score** text *under_score*

*under_score* text **under_score**

__star*star__ text _star*star_

_star*star_ text __star*star__

*_emphasis* text *emphasis*

*emphasis_* text *emphasis*

*emphasis* text *_emphasis*

*emphasis* text *emphasis_*

text \\*emphasis* text *emphasis* text

text *emphasis\\* text *emphasis* text

text *emphasis* text \\*emphasis* text

text *emphasis* text *emphasis\\* text

text *star*_underscore_ text **star**_underscore_ text

text **star**_underscore_ text *star*_underscore_ text

text **star**_underscore_ text **star**_underscore_ text

text *star*_underscore_ text *star*__underscore__ text

text *star*__underscore__ text *star*_underscore_ text

text *star*__underscore__ text *star*__underscore__ text

text _underscore_*star* text __underscore__*star* text

text __underscore__*star* text _underscore_*star* text

text __underscore__*star* text __underscore__*star* text

text _underscore_*star* text _underscore_**star** text

text _underscore_**star** text _underscore_*star* text

text _underscore_**star** text _underscore_**star** text

> * List with *emphasis* in blockquote
>
> > * List with *emphasis* in blockquote

`* text *`

`** text **`

`*** text ***`

`**** text ****`

`***** text *****`

`****** text ******`

`******* text *******`

under_score
_underscore_

st*ar
*star*

under_score
*star*

st*ar
_underscore_

*star*
_underscore_

_underscore_
*star*

_underscore
_*star*

*star
*_underscore_

[reference_link]
_first_ and _second_

[reference_link]
*first* and *second*

[reference*link]
_first_ and _second_

[reference*link]
*first* and *second*

text [reference_link] under _ score text

text [reference*link] star * star text

[reference_link]: https://example.com
[reference*link]: https://example.com

***text
*text*
***

*** text
*text*
***

*** text
\*text\*
***

*** text
**text**
***

| Table | Table |
| ----- | ----- |
| star  | x * y |
| under | x _ y |

| Table | Table |
| ----- | ----- |
| star  | x * y |
| star  | x * y |
| under | x _ y |
| under | x _ y |

| Table | Table                     |
| ----- | ------------------------- |
| star  | text *text* text          |
| star  | text * text* text {MD037} |
| star  | text *text * text {MD037} |
| under | text _text_ text          |
| under | text _ text_ text {MD037} |
| under | text _text _ text {MD037} |

| Table | Table |
| ----- | ----- |
| x * y | x * y |
| x** y | x** y |
| x _ y | x _ y |
| x__ y | x__ y |

```yaml /* autogenerated */
# YAML...
```

new_value from *old_value* and *older_value*.

:ballot_box_with_check: _Emoji syntax_

some_snake_case_function() is _called_

_~/.ssh/id_rsa_ and _emphasis_

Partial *em*phasis of a *wo*rd.
