# Detailed Link Results

Text https://example.com/ text {MD034}

Text <https://example.com/brackets> text https://example.com/bare text {MD034}

Text https://example.com/bare text <https://example.com/brackets> text {MD034}

Text `code https://example.com/code code` text https://example.com/ text {MD034}

> Text <https://example.com/brackets> text https://example.com/bare text {MD034}

Text https://example.com/dir {MD034}
text https://example.com/file.txt {MD034}
text <https://example.com/dir/dir>
text https://example.com/dir/dir/file?query=param {MD034}

```text
Code https://example.com/code?type=fence code
```

    Code https://example.com/code?type=indent code

Text <https://example.com/same> more text https://example.com/same still more text <https://example.com/same> done {MD034}

Text <https://example.com/same> more \* text https://example.com/same more \[ text <https://example.com/same> done {MD034}

Text https://example.com/first more text https://example.com/second still more text https://example.com/third done {MD034}

(Incorrect link syntax)[https://www.example.com/] {MD011}

Text [link ](https://example.com/) text. {MD039}

Text [ link](https://example.com/) text. {MD039}

Text [ link ](https://example.com/) text. {MD039}

Text [link ][reference] text. {MD039}

Text [ link][reference] text. {MD039}

Text [ link ][reference] text. {MD039}

[reference]: https://example.com/

<!-- markdownlint-configure-file {
  "line-length": false,
  "code-block-style": false,
  "descriptive-link-text": false
} -->
