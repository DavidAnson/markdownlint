# Table Missing Pipes

## Bad Header Row

| Table | {MD055}
|-------|---------|

  Table | {MD055} |
|-------|---------|

  Table | {MD055}
|-------|---------|

## Bad Separator Row

| Table | Header |
|-------|---------

{MD055:17}

| Table | Header |
 -------|--------|

{MD055:22}

| Table | Header |
 -------|--------

{MD055:27}

## Missing everything

 {MD055} | Header
---------|-------
 {MD055} | cell

{MD055:34}

 {MD055} | Header
--------:|:-----:
 {MD055} | cell

{MD055:40}

## Missing trailing pipe

| Table   | Header |
|--------:|:-------|
| {MD055} | cell

| Table   | Header |
|---------|--------|
| {MD055} | cell
| cell    | cell   |
| cell    | cell   |

| Table   | Header |
|---------|--------|
| cell    | cell   |
| {MD055} | cell
| cell    | cell   |

| Table   | Header |
|---------|--------|
| cell    | cell   |
| cell    | cell   |
| {MD055} | cell

## Missing leading pipe

| Table  | Header |
|-------:|:-------|
 {MD055} | cell   |

| Table  | Header |
|--------|--------|
 {MD055} | cell   |
| cell   | cell   |
| cell   | cell   |

| Table  | Header |
|--------|--------|
| cell   | cell   |
 {MD055} | cell   |
| cell   | cell   |

| Table  | Header |
|--------|--------|
| cell   | cell   |
| cell   | cell   |
 {MD055} | cell   |

## Missing both sides

| Table  | Header |
|-------:|:-------|
 {MD055} | cell

| Table  | Header |
|--------|--------|
 {MD055} | cell
| cell   | cell   |
| cell   | cell   |

| Table  | Header |
|--------|--------|
| cell   | cell   |
 {MD055} | cell
| cell   | cell   |

| Table  | Header |
|--------|--------|
| cell   | cell   |
| cell   | cell   |
 {MD055} | cell

## No false-positive

| Table | Header |
|-------|--------|
| cell  | cell   |

| Table | Header |
|-------|--------|
| cell  | cell   |
| cell  | cell   |
| cell  | cell   |

## No trailing blank line

| Table | Header |
|-------|--------|
| cell  | cell   |
{MD055} Text

## Markdown Combination

> | Table | Header |
> |-------|--------|
> -{MD055}| cell   |
