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
>   + Item {MD027}
>   + Item {MD027}
>     more
>     item
>   + Item {MD027}
>     + Item
>     + Item
>       more
>       item
>     + Item
>       + Item
>       + Item
>     + Item
>   + Item {MD027}
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
>   1. Item {MD027}
>   1. Item {MD027}
>      more
>      item
>   1. Item {MD027}
>      1. Item
>      1. Item
>         more
>         item
>      1. Item
>         1. Item
>         1. Item
>      1. Item
>   1. Item {MD027}
>
> Text
>
>     Code

Text

<!-- markdownlint-configure-file {
  "ul-indent": {
    "start_indented": true
  }
} -->
