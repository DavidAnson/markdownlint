# Long Lines Thresholds (Wide Characters)

00000000011111111112222222222333333333344444444445
12345678901234567890123456789012345678901234567890

Texxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx t

Texxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx t

Texxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx✅ t

{MD013:-2} {MD013:-4}

## Texxxxxxxxxxxxxxxxxxxxxxxx t

## Texxxxxxxxxxxxxxxxxxxxxxxxx t

## Texxxxxxxxxxxxxxxxxxxxxxx✅ t

{MD013:-2} {MD013:-4}

```text
Texxxxxxxxxxxxxxxxx t
Texxxxxxxxxxxxxxxxxx t
Texxxxxxxxxxxxxxxx✅ t
```

{MD013:-3} {MD013:-4}

    Texxxxxxxxxxxxx t
    Texxxxxxxxxxxxxx t
    Texxxxxxxxxxxx✅ t

{MD013:-2} {MD013:-3}

/ 👋🌎 / 你好，世界 / こんにちは世界 / 안녕 세상 /

むかしむかし，あるところに，おじいさんとおばあさんがくらしていました。

{MD013:-2} {MD013:-4}

<!-- markdownlint-configure-file {
  "code-block-style": false,
  "line-length": {
    "line_length": 40,
    "heading_line_length": 30,
    "code_block_line_length": 20,
    "wide_characters": true
  }
} -->
