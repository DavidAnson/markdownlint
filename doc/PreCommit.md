# Using markdownlint with pre-commit

There are two command line interfaces for MarkdownLint

- https://github.com/igorshubovych/markdownlint-cli
- https://github.com/DavidAnson/markdownlint-cli2

Both can be easily used as pre-commit hooks by adding the following to your `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: https://github.com/igorshubovych/markdownlint-cli
    rev: v0.29.0
    hooks:
      - id: markdownlint
```

```yaml
repos:
  - repo: https://github.com/DavidAnson/markdownlint-cli2
    rev: v0.3.2
    hooks:
      - id: markdownlint-cli2
```

To specify additional command line arguments, use the `args` key:

```yaml
repos:
  - repo: https://github.com/igorshubovych/markdownlint-cli
    rev: v0.29.0
    hooks:
      - id: markdownlint
        args: [--config, .markdownlint.yml]
```
