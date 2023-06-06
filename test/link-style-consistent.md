# Consistent Link Style

Text [url](https://example.com) text
Text ![url](https://example.com) text
Text [url] {MD054} text
Text ![url] {MD054} text
Text [text][url] {MD054} text
Text ![text][url] {MD054} text
Text <https://example.com> text
Text [url][] text {MD054}
Text [link text][url] text {MD054}

[url]: https://example.com

<!-- markdownlint-configure-file {
  "MD034": false,
  "MD054": {
    "style": "consistent"
  }
} -->
