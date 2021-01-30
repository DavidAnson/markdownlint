# HTML Comments

## Block Comments

<https://spec.commonmark.org/0.29/#html-blocks>

<!-- *comment * -->

<!-- *comment * -->text

   <!-- *comment * -->

    <!-- *code * -->

<!-- *comment *
*comment * -->

<!-- *comment *
*comment *
*comment * -->

<!--> *{MD037} * -->

<!---> *{MD037} * -->

<!-- *comment * --->

<!-- -- *comment * -->

<!-- *comment * -- -->

## Inline Comments

<https://spec.commonmark.org/0.29/#html-comment>

t<!-- *comment * -->

t<!-- *comment * -->text

   t<!-- *comment * -->

    t<!-- *code * -->

t<!-- *comment *
*comment * -->

t<!-- *comment *
*comment *
*comment * -->

t<!--> *{MD037} * -->

t<!---> *{MD037} * -->

t<!-- *{MD037} * --->

t<!-- -- *{MD037} * -->

t<!-- *{MD037} * -- -->

## Notes

It's important that the rule used above is one that calls
`helpers.forEachLine` so `markdown-it` doesn't ignore any
incorrectly-remaining comment blocks.
