# Table Pipe Style Explicit None

## Style: both {MD055:+2} {MD055:+3} {MD055:+4}

| Table | Heading |
| ----- | ------- |
| Cell  | Cell    |

## Style: none

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
    "style": "no_leading_or_trailing"
  }
} -->
