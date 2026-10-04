# Table Pipe Style Per Table

## Style: both {MD055:+5}

| Table | Heading |
| ----- | ------- |
| Cell  | Cell    |
| Cell  | Cell

## Style: none {MD055:+5}

Table | Heading
----- | -------
Cell  | Cell
Cell  | Cell |

## Style: leading {MD055:+5}

| Table | Heading
| ----- | -------
| Cell  | Cell
  Cell  | Cell

## Style: trailing {MD055:+5}

Table | Heading |
----- | ------- |
Cell  | Cell    |
Cell  | Cell

<!-- markdownlint-configure-file {
  "table-pipe-style": {
    "style": "per_table"
  }
} -->
