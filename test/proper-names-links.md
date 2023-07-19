# Proper names in links

javascript {MD044}

Learn about JavaScript here: https://example.com/javascript/about

Learn about JavaScript here: <https://example.com/javascript/about>

Learn about [JavaScript](https://example.com/javascript/about).

Learn about [JavaScript](wiki/javascript/about).

Learn about [JavaScript](wiki/javascript).

Learn about [JavaScript](javascript/about).

Learn about [JavaScript](javascript).

Learn about [JavaScript][js].

Learn about [JavaScript][example-js].

Learn about [JavaScript][javascript].

Learn about [javascript][js]. {MD044}

Learn about [javascript][example-js]. {MD044}

Learn about [javascript]. {MD044}

[js]: https://example.com/javascript/about
 [example-js]: javascript
   [javascript]: https://example.com/js
    [javascript]: https://example.com/js {MD044}

<!-- markdownlint-configure-file {
  "proper-names": {
    "names": [
      "JavaScript"
    ]
  },
  "no-bare-urls": false
} -->
