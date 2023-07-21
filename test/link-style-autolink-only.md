# Autolink Link Style

Text [url](https://example.com) text {MD054}
Text ![url](https://example.com) text {MD054}
Text [url] text {MD054}
Text ![url] text {MD054}
Text [text][url] text {MD054}
Text ![text][url] text {MD054}
Text <https://example.com> text
Text [url][] text {MD054}
Text [link text][url] text {MD054}

[url]: https://example.com

<!-- markdownlint-configure-file {
  "MD034": false,
  "MD053": false,
  "MD054": {
    "style": "autolink_only"
  }
} -->
