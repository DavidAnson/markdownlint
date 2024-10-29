# blockquote_spaces

Some text

> Hello world
>  Foo {MD027}
>  Bar {MD027}

This tests other things embedded in the blockquote:

- foo

> *Hello world*
>  *foo* {MD027}
>  **bar** {MD027}
>   "Baz" {MD027}
>   `qux` {MD027}
> *foo* more text
> **bar** more text
> 'baz' more text
> `qux` more text
>
> - foo

Test the first line being indented too much:

>  Foo {MD027}
>  Bar {MD027}
> Baz

Test spaces before the blockquote:

 >  Text {MD027}

Text

  >  Text {MD027}

Text

   >  Text {MD027}

Test nothing in the blockquote:

<!-- markdownlint-disable no-trailing-spaces -->

>  
{MD027:-1}

<!-- markdownlint-disable code-block-style -->

> Blockquoted code blocks:
>
>     Code
>     Code
>      Code
>
> ```text
> Code
> Code
>  Code
> ```
