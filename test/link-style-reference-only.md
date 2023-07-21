# Reference Link Style

Text [url {MD054}](https://example.com) text
Text ![url {MD054}](https://example.com) text
Text [url] text
Text ![url] text
Text [text][url] text
Text ![text][url] text
Text <https://example.com> {MD054} text
Text [url][] text
Text [link text][url] text

[url]: https://example.com

<!-- markdownlint-configure-file {
  "link-image-style": {
    "style": "reference_only"
  }
} -->
