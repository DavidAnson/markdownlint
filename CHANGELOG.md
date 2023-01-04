# Changes

- 0.27.0 - Improve MD011/MD013/MD022/MD031/MD032/MD033/MD034/MD040/MD043/MD051/
           MD053, generate/separate documentation, improve documentation, update
           dependencies.
- 0.26.2 - Improve MD037/MD051/MD053.
- 0.26.1 - Improve MD051.
- 0.26.0 - Add MD051/MD052/MD053 for validating link fragments & reference
           links/images & link/image reference definitions (MD053 auto-fixable),
           improve MD010/MD031/MD035/MD039/MD042/MD044/MD049/MD050, add
           `markdownlint-disable-line` inline comment, support `~` paths in
           `readConfig/Sync`, add `configParsers` option, remove support for
           end-of-life Node version 12, default `resultVersion` to 3, update
           browser script to use ES2015, simplify JSON schema, address remaining
           CodeQL issues, improve performance, update dependencies.
- 0.25.1 - Update dependencies for CVE-2022-21670.
- 0.25.0 - Add MD049/MD050 for consistent emphasis/strong style (both
           auto-fixable), improve MD007/MD010/MD032/MD033/MD035/MD037/MD039,
           support asynchronous custom rules, improve performance, improve CI
           process, reduce dependencies, update dependencies.
- 0.24.0 - Remove support for end-of-life Node version 10, add support for
           custom file system module, improve MD010/MD011/MD037/MD043/MD044,
           improve TypeScript declaration file and JSON schema, update
           dependencies.
- 0.23.1 - Work around lack of webpack support for dynamic calls to
           `require`(`.resolve`).
- 0.23.0 - Add comprehensive example `.markdownlint.jsonc`/`.markdownlint.yaml`
           files, add fix information for MD004/ul-style, improve
           MD018/MD019/MD020/MD021/MD037/MD041, improve HTML comment handling,
           update test runner and test suite, update dependencies.
- 0.22.0 - Allow `extends` in config to reference installed packages by name,
           add `markdownlint-disable-next-line` inline comment, support JSON
           front matter, improve MD009/MD026/MD028/MD043, update dependencies
           (including `markdown-it` to v12).
- 0.21.1 - Improve MD011/MD031, export `getVersion` API.
- 0.21.0 - Lint concurrently for better performance (async only), add
           Promise-based APIs, update TypeScript declaration file, hide
           `toString` on `LintResults`, add ability to fix in browser demo,
           allow custom rules in `.markdownlint.json` schema, improve
           MD042/MD044, improve documentation, update dependencies.
- 0.20.4 - Fix regression in MD037, improve MD034/MD044, improve
           documentation.
- 0.20.3 - Fix regression in MD037, improve MD044, add automatic regression
           testing.
- 0.20.2 - Fix regression in MD037, improve MD038.
- 0.20.1 - Fix regression in MD037.
- 0.20.0 - Add `markdownlint-configure-file` inline comment, reimplement MD037,
           improve MD005/MD007/MD013/MD018/MD029/MD031/MD034/MD038/MD039,
           improve HTML comment handling, update dependencies.
- 0.19.0 - Remove support for end-of-life Node version 8, add fix information
           for MD005/list-indent, improve MD007/MD013/MD014, deprecate
           MD006/ul-start-left, add rationale for every rule, update test runner
           and code coverage, add more JSDoc comments, update dependencies.
- 0.18.0 - Add MD048/code-fence-style, add fix information for MD007/ul-indent,
           add `markdownlint-disable-file`/`markdownlint-enable-file` inline
           comments, add type declaration file (.d.ts) for TypeScript
           dependents, update schema, improve MD006/MD007/MD009/MD013/MD030,
           update dependencies.
- 0.17.2 - Improve MD020/MD033/MD044.
- 0.17.1 - Fix handling of front matter by fix information.
- 0.17.0 - Add `resultVersion` 3 to support fix information for default and
           custom rules, add fix information for 24 rules, update newline
           handling to match latest CommonMark specification, improve
           MD014/MD037/MD039, update dependencies.
- 0.16.0 - Add custom rule sample for linting code, improve
           MD026/MD031/MD033/MD038, update dependencies.
- 0.15.0 - Add `markdownlint-capture`/`markdownlint-restore` inline comments,
           improve MD009/MD013/MD026/MD033/MD036, update dependencies.
- 0.14.2 - Improve MD047, add `handleRuleFailures` option.
- 0.14.1 - Improve MD033.
- 0.14.0 - Remove support for end-of-life Node version 6, introduce
           `markdownlint-rule-helpers`, add MD046/MD047, improve
           MD033/MD034/MD039, improve custom rule validation and in-browser
           demo, update dependencies.
- 0.13.0 - Improve MD013/MD022/MD025/MD029/MD031/MD032/MD037/MD041/, deprecate
           MD002, improve pandoc YAML support, update dependencies.
- 0.12.0 - Add `information` link for custom rules, `markdownItPlugins` for
           extensibility, improve MD023/MD032/MD038, update dependencies.
- 0.11.0 - Improve MD005/MD024/MD029/MD038, improve custom rule example, add
           CONTRIBUTING.md, update dependencies.
- 0.10.0 - Add support for non-JSON configuration files, pass file/string name
          to custom rules, update dependencies.
- 0.9.0 - Remove support for end-of-life Node versions 0.10/0.12/4, change
          "header" to "heading" per spec (non-breaking), improve
          MD003/MD009/MD041, handle uncommon line-break characters, refactor for
          ES6, update dependencies.
- 0.8.1 - Update item loop to be iterative, improve MD014, update
          dependencies.
- 0.8.0 - Add support for using and authoring custom rules, improve
          MD004/MD007/MD013, add `engines` to `package.json`, refactor, update
          dependencies.
- 0.7.0 - `resultVersion` defaults to 2 (breaking change), add MD045, improve
          MD029, remove trimLeft/trimRight, split rules, refactor, update
          dependencies.
- 0.6.4 - Improve MD029/MD042, update dependencies.
- 0.6.3 - Improve highlighting for MD020.
- 0.6.2 - Improve MD013/MD027/MD034/MD037/MD038/MD041/MD044, update
          dependencies.
- 0.6.1 - Update `markdown-it` versioning, exclude demo/test from publishing.
- 0.6.0 - `resultVersion` defaults to 1 (breaking change), ignore HTML comments,
          TOML front matter, fixes for MD044, update dependencies.
- 0.5.0 - Add shareable configuration, `noInlineConfig` option, README links,
          fix MD030, improve MD009/MD041, update dependencies.
- 0.4.1 - Fixes for MD038/front matter, improvements to MD044, update
          dependencies.
- 0.4.0 - Add MD044, enhance MD013/MD032/MD041/MD042/MD043, fix for MD038,
          dependencies.
- 0.3.1 - Fix regressions in MD032/MD038, update dependencies.
- 0.3.0 - More detailed error reporting with `resultVersion`, enhance
          MD010/MD012/MD036, fixes for MD027/MD029/MD030, include JSON schema,
          dependencies.
- 0.2.0 - Add MD042/MD043, enhance MD002/MD003/MD004/MD007/MD011/MD025/MD041,
          dependencies.
- 0.1.1 - Fix bug handling HTML in tables, reference markdownlint-cli.
- 0.1.0 - Add aliases, exceptions for MD033, exclusions for MD013, dependencies.
- 0.0.8 - Support disabling/enabling rules inline, improve code fence,
          dependencies.
- 0.0.7 - Add MD041, improve MD003, ignore front matter, update dependencies.
- 0.0.6 - Improve performance, simplify in-browser, update dependencies.
- 0.0.5 - Add `strings` option to enable file-less scenarios, add in-browser
          demo.
- 0.0.4 - Add tests MD033-MD040, update dependencies.
- 0.0.3 - Add synchronous API, improve documentation and code.
- 0.0.2 - Improve documentation, tests, and code.
- 0.0.1 - Initial release, includes tests MD001-MD032.
