# HTML Comment in Markdown Table

```xml
<!-- comment -->
```

| Table |
|-------|
| <!--  |
| cell  |
| -->   |

| Table      |
|------------|
| <!--       |
| `{MD038} ` |
| -->        |

| Table          |
|----------------|
| <!--
  `{MD038} ` --> |
| cell           |

| Table          |
|----------------|
| <!--           \
  `{MD038} ` --> |
| cell           |

| Table | Table |
|-------|-------|
| cell  | <!--  |
| cell  | cell  |
| cell  | -->   |

| Table | Table      |
|-------|------------|
| cell  | <!--       |
| cell  | `{MD038} ` |
| cell  | -->        |

| Table | Table          |
|-------|----------------|
| cell  | <!--
| cell  | `{MD038} ` --> |
| cell  | cell           |

| Table | Table          |
|-------|----------------|
| cell  | <!--           \
| cell  | `{MD038} ` --> |
| cell  | cell           |

<!-- markdownlint-configure-file {
  "table-column-style": false,
  "table-pipe-style": false
} -->
