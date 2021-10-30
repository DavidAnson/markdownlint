// @ts-check

"use strict";

const { existsSync } = require("fs");
// eslint-disable-next-line unicorn/import-style
const { join } = require("path");
const { promisify } = require("util");
const globby = require("globby");
const jsYaml = require("js-yaml");
const stripJsonComments = require("strip-json-comments");
const test = require("ava").default;
const markdownlint = require("../lib/markdownlint");
const markdownlintPromise = promisify(markdownlint);
const readConfigPromise = promisify(markdownlint.readConfig);

/**
 * Parses JSONC text.
 *
 * @param {string} json JSON to parse.
 * @returns {Object} Object representation.
 */
function jsoncParse(json) {
  return JSON.parse(stripJsonComments(json));
}

/**
 * Parses YAML text.
 *
 * @param {string} yaml YAML to parse.
 * @returns {Object} Object representation.
 */
function yamlParse(yaml) {
  return jsYaml.load(yaml);
}

/**
 * Lints a test repository.
 *
 * @param {Object} t Test instance.
 * @param {string[]} globPatterns Array of files to in/exclude.
 * @param {string} configPath Path to config file.
 * @returns {Promise} Test result.
 */
function lintTestRepo(t, globPatterns, configPath) {
  t.plan(1);
  return Promise.all([
    globby(globPatterns),
    // @ts-ignore
    readConfigPromise(configPath, [ jsoncParse, yamlParse ])
  ]).then((globbyAndReadConfigResults) => {
    const [ files, config ] = globbyAndReadConfigResults;
    const options = {
      files,
      config
    };
    // eslint-disable-next-line no-console
    console.log(`${t.title}: Linting ${files.length} files...`);
    return markdownlintPromise(options).then((results) => {
      const resultsString = results.toString();
      if (resultsString.length > 0) {
        // eslint-disable-next-line no-console
        console.log(resultsString);
      }
      t.is(resultsString.length, 0, "Unexpected linting violations");
    });
  });
}

/**
 * Excludes a list of globs.
 *
 * @param {string} rootDir Root directory for globs.
 * @param {...string} globs Globs to exclude.
 * @returns {string[]} Array of excluded globs.
 */
function excludeGlobs(rootDir, ...globs) {
  return globs.map((glob) => "!" + join(rootDir, glob));
}

// Run markdownlint the same way the corresponding repositories do

test("https://github.com/eslint/eslint", (t) => {
  const rootDir = "./test-repos/eslint-eslint";
  const globPatterns = [
    join(rootDir, "docs/**/*.md"),
    ...excludeGlobs(rootDir, "docs/rules/array-callback-return.md")
  ];
  const configPath = join(rootDir, ".markdownlint.yml");
  return lintTestRepo(t, globPatterns, configPath);
});

test("https://github.com/mkdocs/mkdocs", (t) => {
  const rootDir = "./test-repos/mkdocs-mkdocs";
  const globPatterns = [
    join(rootDir, "README.md"),
    join(rootDir, "CONTRIBUTING.md"),
    join(rootDir, "docs/**/*.md"),
    ...excludeGlobs(rootDir, "docs/CNAME")
  ];
  const configPath = join(rootDir, ".markdownlintrc");
  return lintTestRepo(t, globPatterns, configPath);
});

test("https://github.com/mochajs/mocha", (t) => {
  const rootDir = "./test-repos/mochajs-mocha";
  const globPatterns = [
    join(rootDir, "*.md"),
    join(rootDir, "docs/**/*.md"),
    join(rootDir, ".github/*.md"),
    join(rootDir, "lib/**/*.md"),
    join(rootDir, "test/**/*.md"),
    join(rootDir, "example/**/*.md")
  ];
  const configPath = join(rootDir, ".markdownlint.json");
  return lintTestRepo(t, globPatterns, configPath);
});

test("https://github.com/pi-hole/docs", (t) => {
  const rootDir = "./test-repos/pi-hole-docs";
  const globPatterns = [
    join(rootDir, "**/*.md"),
    ...excludeGlobs(rootDir,
      "docs/guides/dns/unbound.md",
      "docs/index.md",
      "docs/main/prerequisites.md"
    )
  ];
  const configPath = join(rootDir, ".markdownlint.json");
  return lintTestRepo(t, globPatterns, configPath);
});

test("https://github.com/webhintio/hint", (t) => {
  const rootDir = "./test-repos/webhintio-hint";
  const globPatterns = [
    join(rootDir, "**/*.md"),
    ...excludeGlobs(rootDir, "**/CHANGELOG.md")
  ];
  const configPath = join(rootDir, ".markdownlintrc");
  return lintTestRepo(t, globPatterns, configPath);
});

test("https://github.com/webpack/webpack.js.org", (t) => {
  const rootDir = "./test-repos/webpack-webpack-js-org";
  const globPatterns = [ join(rootDir, "**/*.md") ];
  const configPath = join(rootDir, ".markdownlint.json");
  return lintTestRepo(t, globPatterns, configPath);
});

// Optional repositories (very large)

const dotnetDocsDir = "./test-repos/dotnet-docs";
if (existsSync(dotnetDocsDir)) {
  test("https://github.com/dotnet/docs", (t) => {
    const rootDir = dotnetDocsDir;
    const globPatterns = [
      join(rootDir, "**/*.md"),
      ...excludeGlobs(rootDir,
        "samples/**/*.md",
        /* eslint-disable max-len */
        "docs/architecture/cloud-native/candidate-apps.md",
        "docs/architecture/containerized-lifecycle/docker-devops-workflow/docker-application-outer-loop-devops-workflow.md",
        "docs/architecture/dapr-for-net-developers/getting-started.md",
        "docs/architecture/grpc-for-wcf-developers/channel-credentials.md",
        "docs/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests.md",
        "docs/architecture/microservices/multi-container-microservice-net-applications/implement-api-gateways-with-ocelot.md",
        "docs/architecture/modern-web-apps-azure/architectural-principles.md",
        "docs/architecture/modern-web-apps-azure/azure-hosting-recommendations-for-asp-net-web-apps.md",
        "docs/architecture/modern-web-apps-azure/common-client-side-web-technologies.md",
        "docs/architecture/modern-web-apps-azure/develop-asp-net-core-mvc-apps.md",
        "docs/architecture/modern-web-apps-azure/development-process-for-azure.md",
        "docs/architecture/modern-web-apps-azure/index.md",
        "docs/core/additional-tools/dotnet-svcutil-guide.md",
        "docs/core/dependency-loading/collect-details.md",
        "docs/core/deploying/single-file.md",
        "docs/core/deploying/trimming/trimming-options.md",
        "docs/core/extensions/cloud-service.md",
        "docs/core/extensions/console-log-formatter.md",
        "docs/core/extensions/create-resource-files.md",
        "docs/core/extensions/localization.md",
        "docs/core/install/linux-alpine.md",
        "docs/core/install/windows.md",
        "docs/core/porting/third-party-deps.md",
        "docs/core/project-sdk/msbuild-props-desktop.md",
        "docs/core/testing/unit-testing-code-coverage.md",
        "docs/core/tools/troubleshoot-usage-issues.md",
        "docs/core/tutorials/cli-templates-create-item-template.md",
        "docs/core/tutorials/cli-templates-create-project-template.md",
        "docs/core/tutorials/cli-templates-create-template-pack.md",
        "docs/core/tutorials/cli-templates-create-template-package.md",
        "docs/core/tutorials/cli-templates-create-item-template.md",
        "docs/core/tutorials/cli-templates-create-project-template.md",
        "docs/core/tutorials/cli-templates-create-template-pack.md",
        "docs/core/whats-new/dotnet-core-3-0.md",
        "docs/csharp/language-reference/compiler-options/code-generation.md",
        "docs/csharp/linq/query-expression-basics.md",
        "docs/csharp/programming-guide/classes-and-structs/named-and-optional-arguments.md",
        "docs/csharp/roslyn-sdk/tutorials/how-to-write-csharp-analyzer-code-fix.md",
        "docs/csharp/tutorials/attributes.md",
        "docs/csharp/whats-new/csharp-version-history.md",
        "docs/framework/data/adonet/dataset-datatable-dataview/security-guidance.md",
        "docs/fsharp/language-reference/compiler-directives.md",
        "docs/fsharp/language-reference/exception-handling/the-try-with-expression.md",
        "docs/fsharp/language-reference/xml-documentation.md",
        "docs/fsharp/style-guide/conventions.md",
        "docs/fsharp/tutorials/asynchronous-and-concurrent-programming/async.md",
        "docs/fundamentals/code-analysis/configuration-files.md",
        "docs/fundamentals/code-analysis/style-rules/naming-rules.md",
        "docs/machine-learning/tutorials/health-violation-classification-model-builder.md",
        "docs/machine-learning/tutorials/object-detection-model-builder.md",
        "docs/machine-learning/tutorials/object-detection-onnx.md",
        "docs/machine-learning/tutorials/text-classification-tf.md",
        "docs/standard/asynchronous-programming-patterns/event-based-asynchronous-pattern-overview.md",
        "docs/standard/asynchronous-programming-patterns/implementing-the-event-based-asynchronous-pattern.md",
        "docs/standard/base-types/string-comparison-net-5-plus.md",
        "docs/standard/delegates-lambdas.md",
        "docs/standard/io/isolated-storage.md",
        "docs/standard/native-interop/tutorial-comwrappers.md",
        "docs/standard/serialization/xml-schema-definition-tool-xsd-exe.md",
        "docs/standard/serialization/xml-serializer-generator-tool-sgen-exe.md",
        "docs/standard/native-interop/best-practices.md",
        "docs/standard/serialization/binaryformatter-security-guide.md",
        "docs/framework/windows-workflow-foundation/authoring-workflows-activities-and-expressions-using-imperative-code.md",
        "docs/spark/how-to-guides/deploy-worker-udf-binaries.md"
        /* eslint-enable max-len */
      )
    ];
    const configPath = join(rootDir, ".markdownlint.json");
    return lintTestRepo(t, globPatterns, configPath);
  });
}

const v8v8DevDir = "./test-repos/v8-v8-dev";
if (existsSync(v8v8DevDir)) {
  test("https://github.com/v8/v8.dev", (t) => {
    const rootDir = v8v8DevDir;
    const globPatterns = [
      join(rootDir, "src/**/*.md"),
      ...excludeGlobs(rootDir,
        "src/blog/array-sort.md",
        "src/blog/code-caching-for-devs.md",
        "src/blog/fast-async.md",
        "src/blog/liftoff.md",
        "src/blog/pointer-compression.md",
        "src/blog/react-cliff.md",
        "src/blog/slack-tracking.md",
        "src/blog/v8-release-74.md",
        "src/features/bigint.md",
        "src/features/dynamic-import.md",
        "src/features/globalthis.md",
        "src/features/modules.md"
      )
    ];
    const configPath = join(rootDir, ".markdownlint.json");
    return lintTestRepo(t, globPatterns, configPath);
  });
}
