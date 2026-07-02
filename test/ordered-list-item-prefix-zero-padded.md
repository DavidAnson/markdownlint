# Ordered list item prefix zero-padded

Regression test: zero-padded, multi-character list item markers used to be
mis-fixed because the delete count for the fix was computed from
`Number(text).toString().length` (the re-stringified numeric value) rather
than the actual source text length. For "08." that produced a delete count of
1 instead of 2, so fixing it inserted "1" without removing the full "08" and
left "18." behind instead of "1.".

08. Item {MD029}
09. Item {MD029}
10. Item {MD029}
11. Item {MD029}

<!-- markdownlint-configure-file {
  "ol-prefix": {
    "style": "ordered"
  }
} -->
