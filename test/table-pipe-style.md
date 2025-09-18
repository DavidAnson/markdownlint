# Table Pipe Style

<!-- markdownlint-configure-file {
  "table-column-style": false,
  "table-pipe-style": {
    "style": "leading_and_trailing"
  }
} -->

## Missing in Header Row

| Table | {MD055}
|-------|---------|

  Table | {MD055} |
|-------|---------|

  Table | {MD055}
|-------|---------|

## Missing in Separator Row

| Table | Header |
|-------|--------

{MD055:-2}

| Table | Header |
 -------|--------|

{MD055:-2}

| Table | Header |
 -------|--------

{MD055:-2}

## Missing Leading and Trailing

 {MD055} | Header
---------|--------
 {MD055} | Cell

{MD055:-3}

 {MD055} | Header
--------:|:------:
 {MD055} | Cell

{MD055:-3}

| Table   | Header |
|--------:|:-------|
  {MD055} | Cell

| Table   | Header |
|---------|--------|
  {MD055} | Cell
| Cell    | Cell   |
| Cell    | Cell   |

| Table   | Header |
|---------|--------|
| Cell    | Cell   |
  {MD055} | Cell
| Cell    | Cell   |

| Table   | Header |
|---------|--------|
| Cell    | Cell   |
| Cell    | Cell   |
  {MD055} | Cell

## Missing Trailing

| Table   | Header |
|--------:|:-------|
| {MD055} | Cell

| Table   | Header |
|---------|--------|
| {MD055} | Cell
| Cell    | Cell   |
| Cell    | Cell   |

| Table   | Header |
|---------|--------|
| Cell    | Cell   |
| {MD055} | Cell
| Cell    | Cell   |

| Table   | Header |
|---------|--------|
| Cell    | Cell   |
| Cell    | Cell   |
| {MD055} | Cell

## Missing Leading

| Table   | Header |
|--------:|:-------|
  {MD055} | Cell   |

| Table   | Header |
|---------|--------|
  {MD055} | Cell   |
| Cell    | Cell   |
| Cell    | Cell   |

| Table   | Header |
|---------|--------|
| Cell    | Cell   |
  {MD055} | Cell   |
| Cell    | Cell   |

| Table   | Header |
|---------|--------|
| Cell    | Cell   |
| Cell    | Cell   |
  {MD055} | Cell   |

## Followed by Text

| Table | Header |
|-------|--------|
| Cell  | Cell   |
{MD055} {MD056} Text

## Table inside Blockquote

> | Table   | {MD055}
> |---------|---------|
>   {MD055} | {MD027} |

## Well-Formed

| Table | Header |
|-------|--------|
| Cell  | Cell   |

| Table | Header |
|-------|--------|
| Cell  | Cell   |
| Cell  | Cell   |
| Cell  | Cell   |

## Leading and Trailing Spaces

 | Table | {MD009} | 
 |-------|---------|
 | Cell  | {MD009} | 
