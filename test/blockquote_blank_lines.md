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

{MD028:5} {MD028:8} {MD028:10} {MD028:17}
{MD009:10} (trailing space is intentional)
{MD012:8} (multiple blank lines are intentional)
