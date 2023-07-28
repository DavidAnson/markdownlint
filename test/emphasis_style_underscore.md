# Emphasis style underscore

This is _fine_

This is *not* {MD049}

Internal emphasis is preserved:
apple*banana*cherry, apple*banana*, *banana*cherry
apple_banana_cherry, apple_banana_, _banana_cherry

<!-- markdownlint-configure-file {
  "no-space-in-emphasis": false,
  "emphasis-style": {
    "style": "underscore"
  }
} -->
