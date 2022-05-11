# Detailed Link Results

Text https://example.com/ text

Text <https://example.com/brackets> text https://example.com/bare text

Text https://example.com/bare text <https://example.com/brackets> text

Text `code https://example.com/code code` text https://example.com/ text

> Text <https://example.com/brackets> text https://example.com/bare text

Text https://example.com/dir
text https://example.com/file.txt
text <https://example.com/dir/dir>
text https://example.com/dir/dir/file?query=param

```text
Code https://example.com/code?type=fence code
```

    Code https://example.com/code?type=indent code

Text <https://example.com/same> more text https://example.com/same still more text <https://example.com/same> done

Text <https://example.com/same> more \* text https://example.com/same more \[ text <https://example.com/same> done

Text https://example.com/first more text https://example.com/second still more text https://example.com/third done

(Incorrect link syntax)[https://www.example.com/]

Text [link ](https://example.com/) text.

Text [ link](https://example.com/) text.

Text [ link ](https://example.com/) text.

Text [link ][reference] text.

Text [ link][reference] text.

Text [ link ][reference] text.

[reference]: https://example.com/
