# Lists in Blockquote Start Indented

Text

  + Item
  + Item
    more
    item
  + Item
    + Item
    + Item
      more
      item
    + Item
      + Item
      + Item
    + Item
  + Item

Text

    Code

Text

<!-- markdownlint-disable ul-indent -->

> Text
>
>   + Item
>   + Item
>     more
>     item
>   + Item
>     + Item
>     + Item
>       more
>       item
>     + Item
>       + Item
>       + Item
>     + Item
>   + Item
>
> Text
>
>     Code

<!-- markdownlint-restore -->

Text

  1. Item
  1. Item
     more
     item
  1. Item
     1. Item
     1. Item
        more
        item
     1. Item
        1. Item
        1. Item
     1. Item
  1. Item

Text

    Code

Text

> Text
>
>   1. Item
>   1. Item
>      more
>      item
>   1. Item
>      1. Item
>      1. Item
>         more
>         item
>      1. Item
>         1. Item
>         1. Item
>      1. Item
>   1. Item
>
> Text
>
>     Code

Text

<!-- markdownlint-configure-file {
  "no-multiple-space-blockquote": {
    "list_items": false
  },
  "ul-indent": {
    "start_indented": true
  }
} -->
