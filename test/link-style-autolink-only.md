# Autolink Link Style

Text [url](https://example.com) text {MD054}
Text ![url](https://example.com) text {MD054}
Text [url] text {MD054}
Text ![url] text {MD054}
Text [text][url] text {MD054}
Text ![text][url] text {MD054}
Text <https://example.com> text
Text [url][] text {MD054}

[url]: https://example.com

<!-- markdownlint-configure-file {
  "no-bare-urls": false,
  "link-image-reference-definitions": false,
  "link-image-style": {
    "style": "autolink_only"
  }
} -->
