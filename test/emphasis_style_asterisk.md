# Emphasis style asterisk

This is *fine*

This is _not_ {MD049}

Internal emphasis is preserved:
apple*banana*cherry, apple*banana*, *banana*cherry
apple_banana_cherry, apple_banana_, _banana_cherry

<!-- markdownlint-configure-file {
  "MD037": false,
  "MD049": {
    "style": "asterisk"
  }
} -->
