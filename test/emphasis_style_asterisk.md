# Emphasis style asterisk

*This* is fine

This *is* fine

This is *fine*

_This_ is not

This _is_ not

This is _not_

{MD049:-2} {MD049:-4} {MD049:-6}

Internal emphasis is preserved:
apple*banana*cherry, apple*banana*, *banana*cherry
apple_banana_cherry, apple_banana_, _banana_cherry

<!-- markdownlint-configure-file {
  "no-space-in-emphasis": false,
  "emphasis-style": {
    "style": "asterisk"
  }
} -->
