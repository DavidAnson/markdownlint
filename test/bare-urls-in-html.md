# Bare URLs in HTML

<p>
https://example.com/pass
</p>

Text https://example.com/fail text. {MD034}

Text <code>https://example.com/pass</code> text.

Text <code>https://example.com/pass</code> text https://example.com/fail text. {MD034}

Text <code>https://example.com/pass</code> text https://example.com/fail text <code>https://example.com/pass</code> text. {MD034}

Text <em> text <strong>text</strong> https://example.com/pass </em> text.

Text <em> text <em>text</em> https://example.com/pass </em> text.

Text <em> text <em>text</em> text </em> https://example.com/fail text. {MD034}

Text <br> text https://example.com/fail <br> text. {MD034}

Text <br/> text https://example.com/fail <br/> text. {MD034}

<!-- markdownlint-configure-file {
  "line-length": false,
  "no-inline-html": false
} -->
