# Contributing

Interested in contributing? Great! Here are some suggestions to make it a good experience:

Start by [opening an issue](https://github.com/DavidAnson/markdownlint/issues), whether to identify a problem or outline a change.
That issue should be used to discuss the situation and agree on a plan of action before writing code or sending a pull request.
Maybe the problem isn't really a problem, or maybe there are more things to consider.
If so, it's best to realize that before spending time and effort writing code that may not get used.

Match the coding style of the files you edit.
Although everyone has their own preferences and opinions, a pull request is not the right forum to debate them.

Do not add new [`dependencies` to `package.json`](https://docs.npmjs.com/files/package.json#dependencies).
The excellent Markdown parser [markdown-it](https://www.npmjs.com/package/markdown-it) is this project's one and only dependency.

If developing a new rule, start by creating a [custom rule](doc/CustomRules.md) in its own project.
Once written, published, and tested in real world scenarios, open an issue to consider adding it to this project.
For rule ideas, see [issues tagged with the `new rule` label](https://github.com/DavidAnson/markdownlint/labels/new%20rule).

Add tests for all new/changed functionality.
Test positive and negative scenarios.
Try to break the new code now, or else it will get broken later.

Run tests before sending a pull request via `npm test` in the [usual manner](https://docs.npmjs.com/misc/scripts).
Tests should all pass on all platforms.
The test runner is [tape](https://www.npmjs.com/package/tape) and test cases are located in `test/markdownlint-test*.js`.
When running tests, `test/*.md` files are enumerated, linted, and fail if any violations are missing a corresponding `{MD###}` marker in the test file.
For example, the line `### Heading {MD001}` is expected to trigger the rule `MD001`.
For cases where the marker text can not be present on the same line, the syntax `{MD###:#}` can be used to include a line number.
If `some-test.md` needs custom configuration, a `some-test.json` is used to provide a custom `options.config` for that scenario.

Lint before sending a pull request by running `npm run lint`.
There should be no issues.

Run a full continuous integration pass before sending a pull request via `npm run ci`.
Code coverage should remain at 100%.

Pull requests should contain a single commit.
If necessary, squash multiple commits before creating the pull request and when making changes.
(See [Git Tools - Rewriting History](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History) for details.)

Open pull requests against the `next` branch.
That's where the latest changes are staged for the next release.
Include the text "(fixes #??)" at the end of the commit message so the pull request will be associated with the relevant issue.
End commit messages with a period (`.`).
Do not include `package-lock.json` in the pull request.
Once accepted, the tag `fixed in next` will be added to the issue.
When the commit is merged to the main branch during the release process, the issue will be closed automatically.
(See [Closing issues using keywords](https://help.github.com/articles/closing-issues-using-keywords/) for details.)

Thank you!
