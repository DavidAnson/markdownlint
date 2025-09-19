# Configure File With Severity

Text * text* {MD037}

Text ` text` {MD038}

Text [ text](.) {MD039}

+ List item {MD004}

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

+ List item {MD004}

Text (text)[.] {MD011}

2. List item {MD029}

<!-- markdownlint-configure-file {
  "default": false,
  "MD037": "error",
  "MD038": "error",
  "MD039": "error",
  "MD004": {
    "severity": "error",
    "style": "dash"
  },
  "MD011": {
    "severity": "error"
  },
  "MD029": {
    "severity": "error"
  }
} -->
