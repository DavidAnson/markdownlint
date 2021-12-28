# Code With Tabs Blocked

Text	text {MD010}

Text `code	code` text {MD010}

Text `	code` text {MD010}

Text `code	` text {MD010}

Text `code code
code	code {MD010}
code code` text

    console.log("	"); // {MD010}

```js
console.log("	"); // {MD010}
```

```j	s {MD010}
console.log("	"); // {MD010}
```

	console.log(""); // {MD010}

<!-- markdownlint-configure-file {
  "code-block-style": false,
  "no-space-in-code": false,
  "no-hard-tabs": {
    "code_blocks": true
  }
} -->
