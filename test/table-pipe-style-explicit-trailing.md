# Table Pipe Style Explicit Trailing

## Style: both {MD055:+2} {MD055:+3} {MD055:+4}

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

## Style: trailing

Table | Heading |
----- | ------- |
Cell  | Cell    |

<!-- markdownlint-configure-file {
  "table-pipe-style": {
    "style": "trailing_only"
  }
} -->
