# md040-language_only.md

Fence code block information with leading whitespace:

```  html
<h1>markdownlint</h1>
```

Fence code block information with trailing whitespace:

```css 
body {} {MD009:11}
```

Fence code block information with extra data:

```html version=5
<title>MarkdownLint</title> {MD040:17}
```

Fence code block information without whitespaces and extra data:

```css
a {}
```

<!-- markdownlint-configure-file {
  "fenced-code-language": {
    "allowed_languages": [
      "html",
      "css"
    ],
    "language_only": true
  }
} -->
