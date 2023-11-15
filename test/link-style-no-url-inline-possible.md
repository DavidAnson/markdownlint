# Link Style No URL Inline Possible

Text [https://example.com](https://example.com) text {MD054}

Text ![https://example.com](https://example.com) text

Text [https://example.com](<https://example.com>) text {MD054}

Text ![https://example.com](<https://example.com>) text

Text [https://example.com](https://example.com/page "title") text

Text ![https://example.com](https://example.com/page "title") text

Text [https://example.com](https://example.com "title") text

Text ![https://example.com](https://example.com "title") text

Text [https://example.com][url] text

Text ![https://example.com][url] text

Text [https://example.com][url-title] text

Text ![https://example.com][url-title] text

Text <https://example.com> text

[url]: https://example.com
[url-title]: https://example.com "title"

Text [link](https://example.com) text

Text ![link](https://example.com) text

Text [link][url] text

Text ![link][url] text

Text [url][] text

Text ![url][] text

Text [url] text

Text ![url] text

Text [file.md](file.md) text

<!-- markdownlint-configure-file {
  "link-image-style": {
    "url_inline": false
  }
} -->
