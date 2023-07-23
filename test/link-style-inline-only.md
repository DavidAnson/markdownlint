# Inline Link Style

Text [url](https://example.com) text
Text ![url](https://example.com) text
Text [url] {MD054} text
Text ![url] {MD054} text
Text [text][url] {MD054} text
Text ![text][url] {MD054} text
Text <https://example.com> {MD054} text
Text [url][] text {MD054}

[url]: https://example.com

<!-- markdownlint-configure-file {
  "no-bare-urls": false,
  "link-image-reference-definitions": false,
  "link-image-style": {
    "style": "inline_only"
  }
} -->
