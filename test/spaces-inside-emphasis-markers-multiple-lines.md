# Space Inside Emphasis Markers, Multiple Lines

Text *emphasis
emphasis* text

Text *emphasis* *emphasis
emphasis* *emphasis* text

Text *emphasis* text *emphasis
emphasis* text *emphasis* text

Text *emphasis* *emphasis
emphasis* *emphasis* *emphasis
emphasis* text *emphasis
emphasis* text *emphasis* text

Text text
text *emphasis
emphasis emphasis
emphasis* text
text text

Text * asterisk

Text * asterisk

* Item *emphasis* item
* Item *emphasis* item
* Item *emphasis
  emphasis* item
* Item *emphasis* item

* Item * asterisk
* Item * asterisk

Text * emphasis {MD037}
emphasis* text

Text *emphasis
emphasis * text {MD037}

Text * emphasis {MD037}
emphasis * text {MD037}

Text *emphasis * *emphasis {MD037}
emphasis* * emphasis* text {MD037}

Text *emphasis* * emphasis {MD037}
emphasis * *emphasis* text {MD037}

Text * emphasis * * emphasis {MD037}
emphasis * * emphasis * text {MD037}

Text text
text * emphasis {MD037}
emphasis emphasis
emphasis * text {MD037}
text text

* Item *emphasis* item
* Item * emphasis {MD037}
  emphasis* item
* Item *emphasis
  emphasis * item {MD037}
* Item * emphasis {MD037}
  emphasis * item {MD037}
* Item *emphasis* item
* Item item item
  item * emphasis * item {MD037}

Text _ emphasis {MD037}
emphasis _ text {MD037}

Text ** bold {MD037}
bold ** text {MD037}

Emphasis `inside
of * code *
blocks` is okay.

Emphasis `* inside`
code
`blocks *` is okay.

Emphasis `inside *`
code
`* blocks` is okay.

Emphasis `inside
_ code _
blocks` is okay.

Emphasis `_ inside`
code
`blocks _` is okay.

Emphasis `inside _`
code
`_ blocks` is okay.

Mixed `code_span`
scenarios
are _also_ okay. {MD049}

Mixed `code*span`
scenarios
are *also* okay.

This paragraph
contains *a* mix
of `*` emphasis
scenarios and *should*
not trigger `*` any
violations at *all*.

This paragraph
contains `a * slightly
more complicated
multi-line emphasis
scenario * that
should * not trigger
violations * either`.

<!-- markdownlint-disable MD031 -->
*text
```text
```
text *
<!-- markdownlint-restore -->
