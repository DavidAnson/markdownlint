# Validating Configuration

A [JSON Schema][json-schema] is provided to enable validating configuration
objects: [`markdownlint-config-schema.json`][markdownlint-config-schema]

Some editors automatically use a JSON Schema with files that reference it. For
example, a `.markdownlint.json` file with:

```json
"$schema": "https://raw.githubusercontent.com/DavidAnson/markdownlint/main/schema/markdownlint-config-schema.json"
```

A JSON Schema validator can be used to check configuration files like so:

```bash
npx ajv-cli validate -s ./markdownlint/schema/markdownlint-config-schema.json -d "**/.markdownlint.{json,yaml}" --strict=false
```

By default, any rule name is valid in order to allow for custom rules. To ensure
that only built-in rules are used, change the value of `#/additionalProperties`
(at the bottom of the schema file) to `false` before validating:

```json
"additionalProperties": false
```

[json-schema]: https://json-schema.org
[markdownlint-config-schema]: markdownlint-config-schema.json
