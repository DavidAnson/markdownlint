# Table Column Style - Empty Cells

## Aligned / Edge Pipes

| Heading | Heading   | Heading |
| ------- | --------- | ------- |
|         | Text text | Text    |
| Text    |           | Text    |
| Text    | Text text |         |

## Aligned / No Edge Pipes

Heading | Heading   | Heading
------- | --------- | -------
Text    | Text text | Text
Text    |           | Text
Text    | Text text | Text

## Compact / Edge Pipes

| Heading | Heading | Heading |
| - | - | - |
| | Text text | Text |
| Text text | | Text |
| Text | Text | |

## Compact / No Edge Pipes

Heading | Heading | Heading
-- | -- | --
Text | Text text | Text
Text text | | Text
Text | Text | Text

## Tight / Edge Pipes

|Heading|Heading|Heading|
|-|-|-|
||Text text|Text|
|Text text||Text|
|Text|Text||

## Tight / No Edge Pipes

Heading|Heading|Heading
-|-|-
Text|Text text|Text
Text text||Text
Text|Text|Text

<!-- markdownlint-configure-file {
  "table-pipe-style": false
} -->
