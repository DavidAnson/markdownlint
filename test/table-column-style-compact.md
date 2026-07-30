# Table Column Style - Compact

## Aligned / Edge Pipes

| Heading | Heading   | Heading |
| ------- | --------- | ------- |
| Text    | Text text | Text    |
| Text    | Text text | Text    |
| Text    | Text text | Text    |

{MD060:-6} {MD060:-4} {MD060:-3} {MD060:-2}

| Heading | Heading   | Heading |
| ------- | -------- | ------- |
| Text    | Text text | Text    |
| Text     | Text text | Text   |
| Text    | Text tex | Text    |

{MD060:-6} {MD060:-4} {MD060:-3} {MD060:-2}

## Aligned / No Edge Pipes

Heading | Heading   | Heading
------- | --------- | -------
Text    | Text text | Text
Text    | Text text | Text
Text    | Text text | Text

{MD060:-6} {MD060:-4} {MD060:-3} {MD060:-2}

Heading | Heading   | Heading
------- | -------- | --------
Text    | Text text | Text
Text     | Text text | Text
Text    | Text tex | Text

{MD060:-6} {MD060:-4} {MD060:-3} {MD060:-2}

## Compact / Edge Pipes

| Heading | Heading | Heading |
| ------- | ------- | ------- |
| Text | Text text | Text |
| Text text | Text text text | Text |
| Text | Text | Text |

| Heading | Heading | Heading |
| - | - | - |
| Text | Text text | Text |
| Text text | Text text text | Text |
| Text | Text | Text |

| Heading | Heading  | Heading |
| -       |  ---     | -       |
| Text    | Text text | Text  |
|  Text |  Text  |   Text   |
| Text  |  Text |        Text |

{MD060:-6} {MD060:-5} {MD060:-4} {MD060:-3} {MD060:-2}

## Compact / No Edge Pipes

Heading | Heading | Heading
------- | ------- | -------
Text | Text text | Text
Text text | Text text text | Text
Text | Text | Text

Heading | Heading | Heading
-- | -- | --
Text | Text text | Text
Text text | Text text text | Text
Text | Text | Text

Heading | Heading  | Heading
-- |  ---  | --
Text    | Text text |  Text
Text text | Text text text | Text
Text  | Text |  Text

{MD060:-6} {MD060:-5} {MD060:-4} {MD060:-2}

## Tight / Edge Pipes

|Heading|Heading|Heading|
|-------|-------|-------|
|Text|Text text|Text|
|Text text|Text text text|Text|
|Text|Text|Text|

{MD060:-6} {MD060:-5} {MD060:-4} {MD060:-3} {MD060:-2}

|Heading|Heading|Heading|
|--|--|--|
|Text|Text text|Text|
|Text text|Text text text|Text|
|Text|Text|Text|

{MD060:-6} {MD060:-5} {MD060:-4} {MD060:-3} {MD060:-2}

|Heading|Heading |Heading|
|-------|-------|------- |
| Text|Text text |Text|
|Text text |Text text text|Text|
|Text| Text |Text|

{MD060:-6} {MD060:-5} {MD060:-4} {MD060:-3} {MD060:-2}

## Tight / No Edge Pipes

Heading|Heading|Heading
-------|-------|-------
Text|Text text|Text
Text text|Text text text|Text
Text|Text|Text

{MD060:-6} {MD060:-5} {MD060:-4} {MD060:-3} {MD060:-2}

Heading|Heading|Heading
--|--|--
Text|Text text|Text
Text text|Text text text|Text
Text|Text|Text

{MD060:-6} {MD060:-5} {MD060:-4} {MD060:-3} {MD060:-2}

Heading|Heading |Heading
-------|-------| -------
Text |Text text|Text
Text text|Text text text|Text
Text| Text |Text

{MD060:-6} {MD060:-5} {MD060:-4} {MD060:-3} {MD060:-2}

## Compact / Empty Cells

An empty cell has no content, so one space on each side of that content is a
two-character gap. Both that and a single space are accepted.

| Heading | Heading |
| ------- | ------- |
|  |  |
| | |
| Text | Text |
| Text |  |

A gap of three or more spaces is still extra padding, reported once per cell.

| Heading | Heading |
| ------- | ------- |
|   |   |

{MD060:-2} {MD060:-2}

<!-- markdownlint-configure-file {
  "table-column-style": {
    "style": "compact"
  },
  "table-pipe-style": false
} -->
