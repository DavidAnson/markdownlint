# Table Pipe Style Explicit Both

## Style: both

| Table | Heading |
| ----- | ------- |
| Cell  | Cell    |

## Style: none {MD055:+2} {MD055:+3} {MD055:+4}

Table | Heading
----- | -------
Cell  | Cell

## Style: leading {MD055:+2} {MD055:+3} {MD055:+4}

| Table | Heading
| ----- | -------
| Cell  | Cell

## Style: trailing {MD055:+2} {MD055:+3} {MD055:+4}

Table | Heading |
----- | ------- |
Cell  | Cell    |

<!-- markdownlint-configure-file {
  "table-pipe-style": {
    "style": "leading_and_trailing"
  }
} -->
