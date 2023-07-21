# Inline Link Style

Text [url](https://example.com) text {MD054}
Text ![url](https://example.com) text {MD054}
Text [url] text
Text ![url] text
Text [text][url] text
Text ![text][url] text
Text <https://example.com> text
Text [url][] text
Text [link text][url] text

[url]: https://example.com

<!-- markdownlint-configure-file {
  "no-bare-urls": false,
  "link-image-reference-definitions": false,
  "link-image-style": {
    "style": "reference_or_autolink"
  }
} -->
