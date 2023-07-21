# Inline Link Style

Text [url](https://example.com) text
Text ![url](https://example.com) text
Text [url] text
Text ![url] text
Text [text][url] text
Text ![text][url] text
Text <https://example.com> {MD054} text
Text [url][] text
Text [link text][url] text

[url]: https://example.com

<!-- markdownlint-configure-file {
  "MD034": false,
  "MD053": false,
  "MD054": {
    "style": "inline_or_reference"
  }
} -->
