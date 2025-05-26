# inline_html-table_allowed_elements.md

<h1>This is allowed</h1>

<h2>This is not allowed {MD033}</h2>

<br> This is not allowed {MD033}

<br/> This is not allowed {MD033}

| Allowed             | Not Allowed        |
| ------------------- | ------------------ |
| <br>                |                    |
| <br/>               |                    |
| <table><br></table> |                    |
|                     | <h1> {MD033} </h1> |

<table>
  <br/> {MD033}
</table>

<!-- markdownlint-configure-file {
  "no-inline-html": {
    "allowed_elements": [
      "h1",
      "tAbLE"
    ],
    "table_allowed_elements": [
      "br",
      "tAbLE"
    ]
  }
} -->
