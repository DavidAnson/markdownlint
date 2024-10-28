# Link Style Inline Only

Text [url](https://example.com) text

Text ![url](https://example.com) text

Text [url](<https://example.com>) text

Text ![url](<https://example.com>) text

Text [url](https://example.com "title") text

Text ![url](https://example.com "title") text

Text [url](https://example.com
"title") text

Text ![url](https://example.com
"title") text

Text [text][url] text {MD054}

Text ![text][url] text {MD054}

Text [url][] text {MD054}

Text ![url][] text {MD054}

Text [url] text {MD054}

Text ![url] text {MD054}

Text <https://example.com> text {MD054}

[url]: https://example.com "title"

[undefined]

Text [url](https://example.com/embedded\3backslash) text

Text [url](https://example.com/backslash\[escape) text

Text [embedded-backslash] text {MD054}

Text [backslash-escape] text {MD054}

Text <https://example.com/embedded\3backslash> text {MD054}

Text <https://example.com/backslash[no-escape> text {MD054}

[embedded-backslash]: https://example.com/embedded\3backslash

[backslash-escape]: https://example.com/backslash\[escape

Text [url](<https://example.com/embedded space>) text

Text [url](<https://example.com/embedded)paren>) text

Text [url](https://example.com/\(parens\)) text

Text [url](https://example.com/pa(re(ns))) text

Text [url](relative/path) text

Text [url](#fragment) text

Text <https://example.com/pa)re(ns> text {MD054}

Text [url](https://example.com/an>g<le>) text

Text <user@example.com> text {MD054}

Text [user@example.com](user@example.com)

Text [user@example.com][email] text {MD054}

Text [email][] text {MD054}

Text [email] text {MD054}

[email]: user@example.com

<!-- markdownlint-configure-file {
  "link-fragments": false,
  "link-image-reference-definitions": false,
  "link-image-style": {
    "autolink": false,
    "full": false,
    "collapsed": false,
    "shortcut": false
  }
} -->
