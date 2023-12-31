# Table Pipe Style Explicit Leading

## Style: both {MD055:+2} {MD055:+3} {MD055:+4}

| Table | Heading |
| ----- | ------- |
| Cell  | Cell    |

## Style: none {MD055:+2} {MD055:+3} {MD055:+4}

Table | Heading
----- | -------
Cell  | Cell

## Style: leading

| Table | Heading
| ----- | -------
| Cell  | Cell

## Style: trailing {MD055:+2} {MD055:+3} {MD055:+4}

Table | Heading |
----- | ------- |
Cell  | Cell    |

<!-- markdownlint-configure-file {
  "table-pipe-style": {
    "style": "leading_only"
  }
} -->
