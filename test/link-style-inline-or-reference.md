# Inline Link Style

Text [url](https://example.com) text
Text ![url](https://example.com) text
Text [url] text
Text ![url] text
Text [text][url] text
Text ![text][url] text
Text <https://example.com> {MD054} text
Text [url][] text

[url]: https://example.com

<!-- markdownlint-configure-file {
  "no-bare-urls": false,
  "link-image-reference-definitions": false,
  "link-image-style": {
    "style": "inline_or_reference"
  }
} -->
