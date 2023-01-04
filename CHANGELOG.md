# Changelog

## 0.27.0

- Improve MD011/MD013/MD022/MD031/MD032/MD033/MD034/MD040/MD043/MD051/MD053
- Generate/separate documentation
- Improve documentation
- Update dependencies

## 0.26.2

- Improve MD037/MD051/MD053

## 0.26.1

- Improve MD051

## 0.26.0

- Add MD051/MD052/MD053 for validating link fragments & reference
  links/images & link/image reference definitions (MD053 auto-fixable)
- Improve MD010/MD031/MD035/MD039/MD042/MD044/MD049/MD050
- Add `markdownlint-disable-line` inline comment support `~` paths
  in `readConfig/Sync`
- Add `configParsers` option
- Remove support for  end-of-life Node version 12
- Default `resultVersion` to 3
- Update browser script to use ES2015
- Simplify JSON schema
- Address remaining CodeQL issues
- Improve performance
- Update dependencies

## 0.25.1

- Update dependencies for CVE-2022-21670

## 0.25.0

- Add MD049/MD050 for consistent emphasis/strong style (both auto-fixable)
- Improve MD007/MD010/MD032/MD033/MD035/MD037/MD039
- Support asynchronous custom rules
- Improve performance
- Improve CI process
- Reduce dependencies
- Update dependencies

## 0.24.0

- Remove support for end-of-life Node version 10
- Add support for custom file system module
- Improve MD010/MD011/MD037/MD043/MD044
- Improve TypeScript declaration file and JSON schema
- Update dependencies

## 0.23.1

- Work around lack of webpack support for dynamic calls to `require`(`.resolve`)

## 0.23.0

- Add comprehensive example `.markdownlint.jsonc`/`.markdownlint.yaml` files
- Add fix information for MD004/ul-style
- Improve MD018/MD019/MD020/MD021/MD037/MD041
- Improve HTML comment handling
- Update test runner and test suite
- Update dependencies

## 0.22.0

- Allow `extends` in config to reference installed packages by name
- Add `markdownlint-disable-next-line` inline comment
- Support JSON front matter
- Improve MD009/MD026/MD028/MD043
- Update dependencies (including `markdown-it` to v12

## 0.21.1

- Improve MD011/MD031, export `getVersion` API

## 0.21.0

- Lint concurrently for better performance (async only)
- Add Promise-based APIs
- Update TypeScript declaration file
- Hide `toString` on `LintResults`
- Add ability to fix in browser demo
- Allow custom rules in `.markdownlint.json` schema
- Improve MD042/MD044
- Improve documentation
- Update dependencies

## 0.20.4

- Fix regression in MD037
- Improve MD034/MD044
- Improve documentation

## 0.20.3

- Fix regression in MD037
- Improve MD044
- Add automatic regression testing

## 0.20.2

- Fix regression in MD037
- Improve MD038

## 0.20.1

- Fix regression in MD037

## 0.20.0

- Add `markdownlint-configure-file` inline comment
- Reimplement MD037
- improve MD005/MD007/MD013/MD018/MD029/MD031/MD034/MD038/MD039
- Improve HTML comment handling
- Update dependencies

## 0.19.0

- Remove support for end-of-life Node version 8
- Add fix information for MD005/list-indent
- Improve MD007/MD013/MD014
- Deprecate MD006/ul-start-left
- Add rationale for every rule
- Update test runner and code coverage
- Add more JSDoc comments
- Update dependencies

## 0.18.0

- Add MD048/code-fence-style
- Add fix information for MD007/ul-indent
- Add `markdownlint-disable-file`/`markdownlint-enable-file` inline comments
- Add type declaration file (.d.ts) for TypeScript dependents
- Update schema
- Improve MD006/MD007/MD009/MD013/MD030
- Update dependencies

## 0.17.2

- Improve MD020/MD033/MD044

## 0.17.1

- Fix handling of front matter by fix information

## 0.17.0

- Add `resultVersion` 3 to support fix information for default and custom rules
- Add fix information for 24 rules
- Update newline handling to match latest CommonMark specification
- Improve MD014/MD037/MD039
- Update dependencies

## 0.16.0

- Add custom rule sample for linting code
- Improve MD026/MD031/MD033/MD038
- Update dependencies

## 0.15.0

- Add `markdownlint-capture`/`markdownlint-restore` inline comments
- Improve MD009/MD013/MD026/MD033/MD036
- Update dependencies

## 0.14.2

- Improve MD047
- Add `handleRuleFailures` option

## 0.14.1

- Improve MD033

## 0.14.0

- Remove support for end-of-life Node version 6
- Introduce `markdownlint-rule-helpers`
- Add MD046/MD047
- Improve MD033/MD034/MD039
- Improve custom rule validation and in-browser demo
- Update dependencies

## 0.13.0

- Improve MD013/MD022/MD025/MD029/MD031/MD032/MD037/MD041
- Deprecate MD002
- Improve pandoc YAML support
- Update dependencies

## 0.12.0

- Add `information` link for custom rules
- Add `markdownItPlugins` for extensibility
- Improve MD023/MD032/MD038
- Update dependencies

## 0.11.0

- Improve MD005/MD024/MD029/MD038
- Improve custom rule example
- Add CONTRIBUTING.md
- Update dependencies

## 0.10.0

- Add support for non-JSON configuration files
- Pass file/string name to custom rules
- Update dependencies

## 0.9.0

- Remove support for end-of-life Node versions 0.10/0.12/4
- Change "header" to "heading" per spec (non-breaking)
- Improve MD003/MD009/MD041
- Handle uncommon line-break characters
- Refactor for ES6
- Update dependencies

## 0.8.1

- Update item loop to be iterative
- Improve MD014
- Update dependencies

## 0.8.0

- Add support for using and authoring custom rules
- Improve MD004/MD007/MD013
- Add `engines` to `package.json`
- Refactor
- Update dependencies

## 0.7.0

- `resultVersion` defaults to 2 (breaking change)
- Ad MD045
- Improve MD029
- Remove trimLeft/trimRight
- Split rules
- Refactor
- Update dependencies

## 0.6.4

- Improve MD029/MD042, update dependencies

## 0.6.3

- Improve highlighting for MD020

## 0.6.2

- Improve MD013/MD027/MD034/MD037/MD038/MD041/MD044
- Update dependencies

## 0.6.1

- Update `markdown-it` versioning
- Exclude demo/test from publishing

## 0.6.0

- `resultVersion` defaults to 1 (breaking change)
- Ignore HTML comments TOML front matter
- Fixes for MD044
- Update dependencies

## 0.5.0

- Add shareable configuration
- Add `noInlineConfig` option
- Add README links
- Fix MD030
- Improve MD009/MD041
- Update dependencies

## 0.4.1

- Fixes for MD038/front matter
- Improvements to MD044
- Update dependencies

## 0.4.0

- Add MD044
- Enhance MD013/MD032/MD041/MD042/MD043
- Fix for MD038 dependencies

## 0.3.1

- Fix regressions in MD032/MD038
- Update dependencies

## 0.3.0

- More detailed error reporting with `resultVersion`
- Enhance MD010/MD012/MD036
- Fixes for MD027/MD029/MD030
- Include JSON schema dependencies

## 0.2

- Add MD042/MD043
- Enhance MD002/MD003/MD004/MD007/MD011/MD025/MD041 dependencies

## 0.1.1

- Fix bug handling HTML in tables
- Reference markdownlint-cli

## 0.1.0

- Add aliases
- Exceptions for MD033
- Exclusions for MD013
- Update dependencies

## 0.0.8

- Support disabling/enabling rules inline
- Improve code fence dependencies

## 0.0.7

- Add MD041
- Improve MD003
- Ignore front matter
- Update dependencies

## 0.0.6

- Improve performance
- Simplify in-browser
- Update dependencies

## 0.0.5

- Add `strings` option to enable file-less scenarios
- Add in-browser demo

## 0.0.4

- Add tests MD033-MD040
- Update dependencies

## 0.0.3

- Add synchronous API
- Improve documentation and code

## 0.0.2

- Improve documentation, tests, and code

## 0.0.1

- Initial release
- Includes tests MD001-MD032
