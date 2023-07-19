# Pandoc Footnotes

> Examples taken from [GitHub issue 599](https://github.com/DavidAnson/markdownlint/issues/599)

## Example with Pandoc Footnotes

A sentence with footnotes: [^1] [^2]
A sentence with named footnotes: [^name] [^name2]
A sentence with a link reference: [Pandoc's User Guide][Pandoc1]

[^1]: I am a footnote!
[^2]: I reference a [PCW][PCW1] article!
[^name]: I am a footnote with name!
[^name2]: I am also a named footnote! I also reference the [PCW][PCW1] article!

[PCW1]: https://www.example.com/article.html
[Pandoc1]: https://pandoc.org/MANUAL.html#extension-footnotes

## Example with Long Pandoc Footnotes

A sentence with a long footnotes: [^long] [^longer] [^longest]

[^long]: I am a long footnote!
    I don't do any harm :)
[^longer]: I am a longer footnote. I do reference the [PCW][PCW2] article.
    I do harm. Though, not here: [Pandoc's User Guide][Pandoc2]
[^longest]: I am the longest footnote. I also reference the [PCW][PCW2] article.

    I am a harmful new block of text: [Another][Another2]

> The previous line of text is treated by CommonMark as an indented code block.
> To handle it as a Pandoc footnote, consider the `markdown-it-footnote` plugin.

[PCW2]: https://www.example.com/article.html
[Pandoc2]: https://pandoc.org/MANUAL.html#extension-footnotes
[Another2]: https://www.example.com/another.html

## GitHub Footnotes

Sample footnotes [^3] [^note3]

[^3]: A line
  A new line

[^note3]:
    I am a new block of text
    With a new line as well
