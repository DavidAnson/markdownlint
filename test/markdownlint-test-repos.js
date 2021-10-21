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

// Run markdownlint the same way the corresponding repositories do

test("https://github.com/eslint/eslint", (t) => {
  const rootDir = "./test-repos/eslint-eslint";
  const globPatterns = [
    join(rootDir, "docs/**/*.md"),
    "!" + join(
      rootDir,
      "docs/rules/array-callback-return.md"
    )
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
    "!" + join(rootDir, "docs/CNAME")
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
    "!" + join(rootDir, "docs/guides/dns/unbound.md"),
    "!" + join(rootDir, "docs/index.md"),
    "!" + join(rootDir, "docs/main/prerequisites.md")
  ];
  const configPath = join(rootDir, ".markdownlint.json");
  return lintTestRepo(t, globPatterns, configPath);
});

test("https://github.com/webhintio/hint", (t) => {
  const rootDir = "./test-repos/webhintio-hint";
  const globPatterns = [
    join(rootDir, "**/*.md"),
    "!" + join(rootDir, "**/CHANGELOG.md")
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
      "!" + join(rootDir, "docs/architecture/cloud-native/candidate-apps.md"),
      "!" + join(
        rootDir,
        "docs/architecture/containerized-lifecycle/docker-devops-workflow" +
          "/docker-application-outer-loop-devops-workflow.md"
      ),
      "!" + join(
        rootDir,
        "docs/architecture/dapr-for-net-developers/getting-started.md"
      ),
      "!" + join(
        rootDir,
        "docs/architecture/grpc-for-wcf-developers/channel-credentials.md"
      ),
      "!" + join(
        rootDir,
        "docs/architecture/microservices/implement-resilient-applications" +
          "/use-httpclientfactory-to-implement-resilient-http-requests.md"
      ),
      "!" + join(
        rootDir,
        "docs/architecture/microservices" +
          "/multi-container-microservice-net-applications" +
          "/implement-api-gateways-with-ocelot.md"
      ),
      "!" + join(
        rootDir,
        "docs/architecture/modern-web-apps-azure/architectural-principles.md"
      ),
      "!" + join(
        rootDir,
        "docs/architecture/modern-web-apps-azure" +
          "/azure-hosting-recommendations-for-asp-net-web-apps.md"
      ),
      "!" + join(
        rootDir,
        "docs/architecture/modern-web-apps-azure" +
          "/common-client-side-web-technologies.md"
      ),
      "!" + join(
        rootDir,
        "docs/architecture/modern-web-apps-azure" +
          "/develop-asp-net-core-mvc-apps.md"
      ),
      "!" + join(
        rootDir,
        "docs/architecture/modern-web-apps-azure" +
          "/development-process-for-azure.md"
      ),
      "!" + join(rootDir, "docs/architecture/modern-web-apps-azure/index.md"),
      "!" + join(rootDir, "docs/core/additional-tools/dotnet-svcutil-guide.md"),
      "!" + join(rootDir, "docs/core/dependency-loading/collect-details.md"),
      "!" + join(rootDir, "docs/core/deploying/single-file.md"),
      "!" + join(rootDir, "docs/core/deploying/trimming/trimming-options.md"),
      "!" + join(rootDir, "docs/core/extensions/cloud-service.md"),
      "!" + join(rootDir, "docs/core/extensions/console-log-formatter.md"),
      "!" + join(rootDir, "docs/core/extensions/create-resource-files.md"),
      "!" + join(rootDir, "docs/core/extensions/localization.md"),
      "!" + join(rootDir, "docs/core/install/linux-alpine.md"),
      "!" + join(rootDir, "docs/core/install/windows.md"),
      "!" + join(rootDir, "docs/core/porting/third-party-deps.md"),
      "!" + join(rootDir, "docs/core/project-sdk/msbuild-props-desktop.md"),
      "!" + join(rootDir, "docs/core/testing/unit-testing-code-coverage.md"),
      "!" + join(rootDir, "docs/core/tools/troubleshoot-usage-issues.md"),
      "!" + join(
        rootDir,
        "docs/core/tutorials/cli-templates-create-item-template.md"
      ),
      "!" + join(
        rootDir,
        "docs/core/tutorials/cli-templates-create-project-template.md"
      ),
      "!" + join(
        rootDir,
        "docs/core/tutorials/cli-templates-create-template-pack.md"
      ),
      "!" + join(
        rootDir,
        "docs/core/tutorials/cli-templates-create-item-template.md"
      ),
      "!" + join(
        rootDir,
        "docs/core/tutorials/cli-templates-create-project-template.md"
      ),
      "!" + join(
        rootDir,
        "docs/core/tutorials/cli-templates-create-template-pack.md"
      ),
      "!" + join(rootDir, "docs/core/whats-new/dotnet-core-3-0.md"),
      "!" + join(
        rootDir,
        "docs/csharp/language-reference/compiler-options/code-generation.md"
      ),
      "!" + join(rootDir, "docs/csharp/linq/query-expression-basics.md"),
      "!" + join(
        rootDir,
        "docs/csharp/programming-guide/classes-and-structs" +
          "/named-and-optional-arguments.md"
      ),
      "!" + join(
        rootDir,
        "docs/csharp/roslyn-sdk/tutorials" +
          "/how-to-write-csharp-analyzer-code-fix.md"
      ),
      "!" + join(rootDir, "docs/csharp/tutorials/attributes.md"),
      "!" + join(rootDir, "docs/csharp/whats-new/csharp-version-history.md"),
      "!" + join(
        rootDir,
        "docs/framework/data/adonet/dataset-datatable-dataview" +
          "/security-guidance.md"
      ),
      "!" + join(
        rootDir,
        "docs/fsharp/language-reference/compiler-directives.md"
      ),
      "!" + join(
        rootDir,
        "docs/fsharp/language-reference/exception-handling" +
          "/the-try-with-expression.md"
      ),
      "!" + join(
        rootDir,
        "docs/fsharp/language-reference/xml-documentation.md"
      ),
      "!" + join(rootDir, "docs/fsharp/style-guide/conventions.md"),
      "!" + join(
        rootDir,
        "docs/fsharp/tutorials/asynchronous-and-concurrent-programming/async.md"
      ),
      "!" + join(
        rootDir,
        "docs/fundamentals/code-analysis/configuration-files.md"
      ),
      "!" + join(
        rootDir,
        "docs/fundamentals/code-analysis/style-rules/naming-rules.md"
      ),
      "!" + join(
        rootDir,
        "docs/machine-learning/tutorials" +
          "/health-violation-classification-model-builder.md"
      ),
      "!" + join(
        rootDir,
        "docs/machine-learning/tutorials/object-detection-model-builder.md"
      ),
      "!" + join(
        rootDir,
        "docs/machine-learning/tutorials/object-detection-onnx.md"
      ),
      "!" + join(
        rootDir,
        "docs/machine-learning/tutorials/text-classification-tf.md"
      ),
      "!" + join(
        rootDir,
        "docs/standard/asynchronous-programming-patterns" +
          "/event-based-asynchronous-pattern-overview.md"
      ),
      "!" + join(
        rootDir,
        "docs/standard/asynchronous-programming-patterns" +
          "/implementing-the-event-based-asynchronous-pattern.md"
      ),
      "!" + join(
        rootDir,
        "docs/standard/base-types/string-comparison-net-5-plus.md"
      ),
      "!" + join(rootDir, "docs/standard/delegates-lambdas.md"),
      "!" + join(rootDir, "docs/standard/io/isolated-storage.md"),
      "!" + join(
        rootDir,
        "docs/standard/native-interop/tutorial-comwrappers.md"
      ),
      "!" + join(
        rootDir,
        "docs/standard/serialization/xml-schema-definition-tool-xsd-exe.md"
      ),
      "!" + join(
        rootDir,
        "docs/standard/serialization/xml-serializer-generator-tool-sgen-exe.md"
      ),
      "!" + join(rootDir, "docs/standard/native-interop/best-practices.md"),
      "!" + join(
        rootDir,
        "docs/standard/serialization/binaryformatter-security-guide.md"
      ),
      "!" + join(rootDir, "samples/**/*.md")
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
      "!" + join(rootDir, "src/blog/array-sort.md"),
      "!" + join(rootDir, "src/blog/code-caching-for-devs.md"),
      "!" + join(rootDir, "src/blog/fast-async.md"),
      "!" + join(rootDir, "src/blog/liftoff.md"),
      "!" + join(rootDir, "src/blog/pointer-compression.md"),
      "!" + join(rootDir, "src/blog/react-cliff.md"),
      "!" + join(rootDir, "src/blog/slack-tracking.md"),
      "!" + join(rootDir, "src/blog/v8-release-74.md"),
      "!" + join(rootDir, "src/features/bigint.md"),
      "!" + join(rootDir, "src/features/dynamic-import.md"),
      "!" + join(rootDir, "src/features/globalthis.md"),
      "!" + join(rootDir, "src/features/modules.md")
    ];
    const configPath = join(rootDir, ".markdownlint.json");
    return lintTestRepo(t, globPatterns, configPath);
  });
}
