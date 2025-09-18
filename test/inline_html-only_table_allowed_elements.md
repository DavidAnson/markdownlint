# inline_html-only_table_allowed_elements.md

<h1>This is not allowed {MD033}</h1>

<br> This is not allowed {MD033}

<br/> This is not allowed {MD033}

| Allowed             | Not Allowed        |
| ------------------- | ------------------ |
| <br>                |                    |
| <br/>               |                    |
| <table><br></table> |                    |
|                     | <h1> {MD033} </h1> |

<table> {MD033}
  <br/> {MD033}
</table>

<!-- markdownlint-configure-file {
  "no-inline-html": {
    "table_allowed_elements": [
      "br",
      "tAbLE"
    ]
  }
} -->
