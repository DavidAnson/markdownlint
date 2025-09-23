# Configure File With Severity Tag

Text * text* {MD037}

Text ` text` {MD038}

Text [ text](.) {MD039}

+ List item

Text (text)[.] {MD011}

2. List item {MD029}

<!-- markdownlint-disable -->

Text * text*

Text ` text`

Text [ text](.)

+ List item

Text (text)[.]

2. List item

<!-- markdownlint-restore -->

Text * text* {MD037}

Text ` text` {MD038}

Text [ text](.) {MD039}

+ List item

Text (text)[.] {MD011}

2. List item {MD029}

<!-- markdownlint-configure-file {
  "default": false,
  "emphasis": "error",
  "code": "warning",
  "bullet": false,
  "links": "warning",
  "ol": "error"
} -->
