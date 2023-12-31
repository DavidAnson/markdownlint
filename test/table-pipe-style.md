# Table Pipe Style

<!-- markdownlint-configure-file {
  "table-pipe-style": {
    "style": "leading_and_trailing"
  }
} -->

## Missing in Heading Row

| Table | {MD055}
|-------|---------|

  Table | {MD055} |
|-------|---------|

  Table | {MD055}
|-------|---------|

## Missing in Separator Row

| Table | Heading |
|-------|---------

{MD055:-2}

| Table | Heading |
 -------|---------|

{MD055:-2}

| Table | Heading |
 -------|---------

{MD055:-2}

## Missing Leading and Trailing

 {MD055} | Heading
---------|---------
 {MD055} | Cell

{MD055:-3}

 {MD055} | Heading
--------:|:-------:
 {MD055} | Cell

{MD055:-3}

| Table   | Heading |
|--------:|:--------|
  {MD055} | Cell

| Table   | Heading |
|---------|---------|
  {MD055} | Cell
| Cell    | Cell    |
| Cell    | Cell    |

| Table   | Heading |
|---------|---------|
| Cell    | Cell    |
  {MD055} | Cell
| Cell    | Cell    |

| Table   | Heading |
|---------|---------|
| Cell    | Cell    |
| Cell    | Cell    |
  {MD055} | Cell

## Missing Trailing

| Table   | Heading |
|--------:|:--------|
| {MD055} | Cell

| Table   | Heading |
|---------|---------|
| {MD055} | Cell
| Cell    | Cell    |
| Cell    | Cell    |

| Table   | Heading |
|---------|---------|
| Cell    | Cell    |
| {MD055} | Cell
| Cell    | Cell    |

| Table   | Heading |
|---------|---------|
| Cell    | Cell    |
| Cell    | Cell    |
| {MD055} | Cell

## Missing Leading

| Table   | Heading |
|--------:|:--------|
  {MD055} | Cell    |

| Table   | Heading |
|---------|---------|
  {MD055} | Cell    |
| Cell    | Cell    |
| Cell    | Cell    |

| Table   | Heading |
|---------|---------|
| Cell    | Cell    |
  {MD055} | Cell    |
| Cell    | Cell    |

| Table   | Heading |
|---------|---------|
| Cell    | Cell    |
| Cell    | Cell    |
  {MD055} | Cell    |

## Followed by Text

| Table | Heading |
|-------|---------|
| Cell  | Cell    |
{MD055} Text

## Table inside Blockquote

> | Table   | {MD055}
> |---------|---------|
>   {MD055} | {MD027} |

## Well-Formed

| Table | Heading |
|-------|---------|
| Cell  | Cell    |

| Table | Heading |
|-------|---------|
| Cell  | Cell    |
| Cell  | Cell    |
| Cell  | Cell    |

## Leading and Trailing Spaces

 | Table | {MD009} | 
 |-------|---------|
 | Cell  | {MD009} | 
