# Configure File Off Enable Inline

+ List item

Text (text)[.]

<!-- markdownlint-disable -->

+ List item

Text (text)[.]

<!-- markdownlint-restore -->

+ List item

Text (text)[.]

<!-- markdownlint-enable MD004 MD011 -->

+ List item {MD004}

Text (text)[.] {MD011}

<!-- markdownlint-disable -->

+ List item

Text (text)[.]

<!-- markdownlint-enable MD004 MD011 -->

+ List item {MD004}

Text (text)[.] {MD011}

<!-- markdownlint-configure-file {
  "MD004": {
    "enabled": false,
    "severity": "warning",
    "style": "dash"
  },
  "MD011": {
    "enabled": false,
    "severity": "error"
  }
} -->
