# Emphasis style underscore

_This_ is fine

This _is_ fine

This is _fine_

*This* is not

This *is* not

This is *not*

{MD049:-2} {MD049:-4} {MD049:-6}

Internal emphasis is preserved:
apple*banana*cherry, apple*banana*, *banana*cherry
apple_banana_cherry, apple_banana_, _banana_cherry

<!-- markdownlint-configure-file {
  "no-space-in-emphasis": false,
  "emphasis-style": {
    "style": "underscore"
  }
} -->
