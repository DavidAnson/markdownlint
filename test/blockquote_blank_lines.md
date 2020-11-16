# blockquote_blank_lines

Some text

> a quote
> same quote

> blank line above me


> two blank lines above me
 
> space above me

* List with embedded blockquote

  > Test
  > Test

  > Test

* Item 2

  > Test. The blank line below should _not_ trigger MD028 as one blockquote is
  > inside the list, and the other is outside it.

> Test

Expected errors:

{MD028:7} {MD028:9} {MD028:10} {MD028:12} {MD028:19}
{MD009:12} (trailing space is intentional)
{MD012:10} (multiple blank lines are intentional)
