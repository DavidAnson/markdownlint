# Configure File With Severity Name

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
  "MD037": "error",
  "MD038": "warning",
  "MD039": false,
  "MD004": {
    "severity": "error",
    "style": "dash"
  },
  "MD011": {
    "severity": "warning"
  },
  "MD029": {
    "enabled": false
  }
} -->
