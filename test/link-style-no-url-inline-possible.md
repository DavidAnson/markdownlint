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

Text <user@example.com> text

Text [user@example.com](user@example.com) text
(allowed by !url_inline because email address is not an absolute URL)

Text [user@example.com][email] text

Text [email][] text

Text [email] text

[email]: user@example.com

<!-- markdownlint-configure-file {
  "descriptive-link-text": false,
  "link-image-style": {
    "url_inline": false
  }
} -->
