# Configure File With Severity Alias

Text * text* {MD037}

Text ` text` {MD038}

Text [ text](.)

+ List item {MD004}

Text (text)[.] {MD011}

2. List item

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

Text [ text](.)

+ List item {MD004}

Text (text)[.] {MD011}

2. List item

<!-- markdownlint-configure-file {
  "default": false,
  "no-space-in-emphasis": "error",
  "no-space-in-code": "warning",
  "no-space-in-links": false,
  "ul-style": {
    "severity": "error",
    "style": "dash"
  },
  "no-reversed-links": {
    "severity": "warning"
  },
  "ol-prefix": {
    "enabled": false
  }
} -->
