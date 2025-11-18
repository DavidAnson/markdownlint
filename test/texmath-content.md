# texmath-content

## Inline

text $ x * y * z $ text

text $$ x * y * z $$ text

## Block

$$
x * y * z
$$

text

$$
x * y = x * y
$$

## Content

$$

Text (reversed)[link] text

Text [invalid](#link) text

Text [link](not-descriptive-link-text) text

Text javascript text

$$

Text $ (reversed)[link] $ text

Text $ [invalid](#link) $ text

Text $ [link](not-descriptive-link-text) $ text

Text $ javascript $ text

<!-- markdownlint-configure-file {
  "proper-names": {
    "names": [
      "JavaScript"
    ]
  }
} -->
