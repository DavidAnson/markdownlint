# Link Style Shortcut Only

Text [url](https://example.com) text {MD054}

Text ![url](https://example.com) text {MD054}

Text [url](<https://example.com>) text {MD054}

Text ![url](<https://example.com>) text {MD054}

Text [url](https://example.com "title") text {MD054}

Text ![url](https://example.com "title") text {MD054}

Text {MD054} [url](https://example.com
"title") text

Text {MD054} ![url](https://example.com
"title") text

Text [text][url] text {MD054}

Text ![text][url] text {MD054}

Text [url][] text {MD054}

Text ![url][] text {MD054}

Text [url] text

Text ![url] text

Text <https://example.com> text {MD054}

[url]: https://example.com "title"

[undefined]

Text [url](https://example.com/embedded\3backslash) text {MD054}

Text [url](https://example.com/backslash\[escape) text {MD054}

Text [embedded-backslash] text

Text [backslash-escape] text

Text <https://example.com/embedded\3backslash> text {MD054}

Text <https://example.com/backslash[no-escape> text {MD054}

[embedded-backslash]: https://example.com/embedded\3backslash

[backslash-escape]: https://example.com/backslash\[escape

Text [url](<https://example.com/embedded space>) text {MD054}

Text [url](<https://example.com/embedded)paren>) text {MD054}

Text [url](https://example.com/\(parens\)) text {MD054}

Text [url](https://example.com/pa(re(ns))) text {MD054}

Text [url](relative/path) text {MD054}

Text [url](#fragment) text {MD054}

Text <https://example.com/pa)re(ns> text {MD054}

Text [url](https://example.com/an>g<le>) text {MD054}

Text <user@example.com> text {MD054}

Text [user@example.com](user@example.com) text {MD054}

Text [user@example.com][email] text {MD054}

Text [email][] text {MD054}

Text [email] text

[email]: user@example.com

<!-- markdownlint-configure-file {
  "link-fragments": false,
  "link-image-style": {
    "autolink": false,
    "inline": false,
    "full": false,
    "collapsed": false
  }
} -->
