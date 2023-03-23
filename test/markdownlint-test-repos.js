// @ts-check

"use strict";

const { join } = require("node:path").posix;
const { promisify } = require("node:util");
const jsYaml = require("js-yaml");
const test = require("ava").default;
const markdownlint = require("../lib/markdownlint");
const markdownlintPromise = promisify(markdownlint);
const readConfigPromise = promisify(markdownlint.readConfig);

/**
 * Lints a test repository.
 *
 * @param {Object} t Test instance.
 * @param {string[]} globPatterns Array of files to in/exclude.
 * @param {string} configPath Path to config file.
 * @param {RegExp[]} [ignoreRes] Array of RegExp violations to ignore.
 * @returns {Promise} Test result.
 */
async function lintTestRepo(t, globPatterns, configPath, ignoreRes) {
  t.plan(1);
  const { globby } = await import("globby");
  const { "default": stripJsonComments } = await import("strip-json-comments");
  const jsoncParse = (json) => {
    const config = JSON.parse(stripJsonComments(json));
    return config.config || config;
  };
  const yamlParse = (yaml) => jsYaml.load(yaml);
  return Promise.all([
    globby(globPatterns),
    // @ts-ignore
    readConfigPromise(configPath, [ jsoncParse, yamlParse ])
  ]).then((globbyAndReadConfigResults) => {
    const [ files, config ] = globbyAndReadConfigResults;
    // eslint-disable-next-line no-console
    console.log(`${t.title}: Linting ${files.length} files...`);
    return markdownlintPromise({
      files,
      config
    // }).then((results) => {
    //   // Cross-check MD051/link-fragments results with markdown-link-check
    //   const resultFiles = [];
    //   const detectedErrors = new Set();
    //   for (const file of Object.keys(results)) {
    //     const errors =
    //       results[file].filter((error) => error.ruleNames[0] === "MD051");
    //     if (errors.length > 0) {
    //       resultFiles.push(file);
    //     }
    //     for (const error of errors) {
    //       const fragment = error.errorContext.replace(/^.*\((#.*)\)$/, "$1");
    //       detectedErrors.add(file + fragment);
    //     }
    //   }
    //   const { readFile } = require("fs").promises;
    //   const markdownLinkCheck = promisify(require("markdown-link-check"));
    //   const expectedErrors = new Set();
    //   return Promise.all(
    //     resultFiles.map((file) => readFile(file, "utf8")
    //       // @ts-ignore
    //       .then((markdown) => markdownLinkCheck(markdown, {
    //         "ignorePatterns": [
    //           {
    //             "pattern": "^[^#]"
    //           }
    //         ]
    //       }))
    //       .then((mlcResults) => {
    //         const deadResults =
    //           mlcResults.filter((result) => result.status === "dead");
    //         for (const link of deadResults.map((result) => result.link)) {
    //           expectedErrors.add(file + link);
    //         }
    //       })
    //     )
    //   ).then(() => {
    //     const extraErrors = [];
    //     // @ts-ignore
    //     for (const detectedError of detectedErrors) {
    //       if (!expectedErrors.has(detectedError)) {
    //         extraErrors.push(detectedError);
    //       }
    //     }
    //     t.deepEqual(extraErrors, [], "Extra errors");
    //     const missingErrors = [];
    //     // @ts-ignore
    //     for (const expectedError of expectedErrors) {
    //       if (!detectedErrors.has(expectedError)) {
    //         missingErrors.push(expectedError);
    //       }
    //     }
    //     t.deepEqual(missingErrors, [], "Missing errors");
    //     return results;
    //   });
    }).then((results) => {
      // Fail if any issues were found (that aren't ignored)
      // @ts-ignore
      let resultsString = results.toString();
      for (const ignoreRe of (ignoreRes || [])) {
        const lengthBefore = resultsString.length;
        resultsString = resultsString.replace(ignoreRe, "");
        if (resultsString.length === lengthBefore) {
          t.fail(`Unnecessary ignore: ${ignoreRe}`);
        }
      }
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
/* eslint-disable max-len */

test("https://github.com/apache/airflow", (t) => {
  const rootDir = "./test-repos/apache-airflow";
  const globPatterns = [ join(rootDir, "**/*.{md,mdown,markdown}") ];
  const configPath = join(rootDir, ".markdownlint.yml");
  return lintTestRepo(t, globPatterns, configPath);
});

test("https://github.com/dotnet/docs", (t) => {
  const rootDir = "./test-repos/dotnet-docs";
  const globPatterns = [ join(rootDir, "**/*.md") ];
  const configPath = join(rootDir, ".markdownlint-cli2.jsonc");
  const ignoreRes = [
    /^test-repos\/dotnet-docs\/docs\/core\/diagnostics\/dotnet-symbol\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/core\/install\/linux-package-mixup\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/core\/porting\/third-party-deps\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/framework\/configure-apps\/file-schema\/wcf\/issuedtokenparameters\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/framework\/configure-apps\/file-schema\/wcf\/servicemetadata\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/framework\/configure-apps\/file-schema\/wcf\/userprincipalname\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/framework\/wcf\/extending\/how-to-compare-claims\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/framework\/wcf\/extending\/overriding-the-identity-of-a-service-for-authentication\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/framework\/wcf\/feature-details\/managing-claims-and-authorization-with-the-identity-model\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/framework\/wcf\/feature-details\/message-filters\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/framework\/wcf\/feature-details\/stand-alone-json-serialization\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/framework\/wcf\/feature-details\/wcf-security-terminology\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/framework\/wcf\/feature-details\/xml-and-ado-net-types-in-data-contracts\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/framework\/wcf\/privacy-information\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/framework\/wcf\/samples\/custom-channel-dispatcher\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/framework\/wcf\/samples\/security-validation\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/framework\/wcf\/service-versioning\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/framework\/whats-new\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/orleans\/tutorials-and-samples\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/standard\/base-types\/regular-expression-source-generators\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/standard\/generics\/math\.md: \d+: MD038\/.*$\r?\n?/gm,
    /^test-repos\/dotnet-docs\/docs\/standard\/serialization\/xml-schema-def-tool-gen\.md: \d+: MD034\/.*$\r?\n?/gm
  ];
  return lintTestRepo(t, globPatterns, configPath, ignoreRes);
});

test("https://github.com/electron/electron", (t) => {
  const rootDir = "./test-repos/electron-electron";
  const globPatterns = [
    join(rootDir, "*.md"),
    join(rootDir, "docs/**/*.md")
  ];
  const configPath = join(rootDir, ".markdownlint.json");
  const ignoreRes = [
    /^test-repos\/electron-electron\/docs\/tutorial\/offscreen-rendering\.md: \d+: MD052\/.*$\r?\n?/gm,
    /^test-repos\/electron-electron\/docs\/tutorial\/progress-bar\.md: \d+: MD052\/.*$\r?\n?/gm
  ];
  return lintTestRepo(t, globPatterns, configPath, ignoreRes);
});

test("https://github.com/eslint/eslint", (t) => {
  const rootDir = "./test-repos/eslint-eslint";
  const globPatterns = [ join(rootDir, "docs/**/*.md") ];
  const configPath = join(rootDir, ".markdownlint.yml");
  const ignoreRes = [
    /^[^:]+: \d+: MD051\/.*$\r?\n?/gm,
    /^test-repos\/eslint-eslint\/docs\/src\/library\/link-card\.md: \d+: MD034\/.*$\r?\n?/gm
  ];
  return lintTestRepo(t, globPatterns, configPath, ignoreRes);
});

const mdnIgnoreRes = [
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/techniques\/3d_on_the_web\/building_up_a_basic_demo_with_a-frame\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/techniques\/3d_on_the_web\/building_up_a_basic_demo_with_babylon.js\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/techniques\/3d_on_the_web\/building_up_a_basic_demo_with_playcanvas\/engine\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/techniques\/3d_on_the_web\/building_up_a_basic_demo_with_three.js\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_phaser\/animations_and_tweens\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_phaser\/bounce_off_the_walls\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_phaser\/build_the_brick_field\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_phaser\/buttons\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_phaser\/collision_detection\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_phaser\/extra_lives\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_phaser\/game_over\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_phaser\/initialize_the_framework\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_phaser\/load_the_assets_and_print_them_on_screen\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_phaser\/move_the_ball\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_phaser\/physics\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_phaser\/player_paddle_and_controls\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_phaser\/randomizing_gameplay\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_phaser\/scaling\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_phaser\/the_score\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_phaser\/win_the_game\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_pure_javascript\/bounce_off_the_walls\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_pure_javascript\/build_the_brick_field\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_pure_javascript\/collision_detection\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_pure_javascript\/create_the_canvas_and_draw_on_it\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_pure_javascript\/finishing_up\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_pure_javascript\/game_over\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_pure_javascript\/mouse_controls\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_pure_javascript\/move_the_ball\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_pure_javascript\/paddle_and_keyboard_controls\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/games\/tutorials\/2d_breakout_game_pure_javascript\/track_the_score_and_win\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/learn\/server-side\/apache_configuration_htaccess\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/mozilla\/add-ons\/webextensions\/manifest.json\/content_security_policy\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/web\/api\/window\/window\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/web\/html\/element\/input\/email\/index\.md: \d+: MD034\/.*$\r?\n?/gm,
  /^test-repos\/mdn-(?:translated-)?content\/files\/[^/]+\/web\/http\/headers\/www-authenticate\/index\.md: \d+: MD034\/.*$\r?\n?/gm
];

test("https://github.com/mdn/content", (t) => {
  const rootDir = "./test-repos/mdn-content";
  const globPatterns = [ join(rootDir, "**/*.md") ];
  const configPath = join(rootDir, ".markdownlint-cli2.jsonc");
  return lintTestRepo(t, globPatterns, configPath, mdnIgnoreRes);
});

test.skip("https://github.com/mdn/translated-content", (t) => {
  const rootDir = "./test-repos/mdn-translated-content";
  const globPatterns = [ join(rootDir, "**/*.md") ];
  const configPath = join(rootDir, ".markdownlint-cli2.jsonc");
  const ignoreRes = [
    ...mdnIgnoreRes,
    /^.*\/(?:conflicting|orphaned)\/.*$\r?\n?/gm
  ];
  return lintTestRepo(t, globPatterns, configPath, ignoreRes);
});

test("https://github.com/mkdocs/mkdocs", (t) => {
  const rootDir = "./test-repos/mkdocs-mkdocs";
  const globPatterns = [
    join(rootDir, "README.md"),
    join(rootDir, "CONTRIBUTING.md"),
    join(rootDir, "docs"),
    ...excludeGlobs(
      rootDir,
      "docs/CNAME",
      "docs/**/*.css",
      "docs/**/*.png",
      "docs/**/*.py",
      "docs/**/*.svg"
    )
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
  const ignoreRes = [
    /^[^:]+: \d+: MD051\/.*$\r?\n?/gm,
    /^test-repos\/mochajs-mocha\/\.github\/CODE_OF_CONDUCT\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/mochajs-mocha\/docs\/index\.md: \d+: MD053\/.*$\r?\n?/gm
  ];
  return lintTestRepo(t, globPatterns, configPath, ignoreRes);
});

test("https://github.com/pi-hole/docs", (t) => {
  const rootDir = "./test-repos/pi-hole-docs";
  const globPatterns = [ join(rootDir, "**/*.md") ];
  const configPath = join(rootDir, ".markdownlint.json");
  const ignoreRes = [ /^test-repos\/pi-hole-docs\/docs\/guides\/vpn\/wireguard\/route-everything\.md: \d+: MD034\/.*$\r?\n?/gm ];
  return lintTestRepo(t, globPatterns, configPath, ignoreRes);
});

test("https://github.com/v8/v8.dev", (t) => {
  const rootDir = "./test-repos/v8-v8-dev";
  const globPatterns = [ join(rootDir, "src/**/*.md") ];
  const configPath = join(rootDir, ".markdownlint.json");
  const ignoreRes = [
    /^[^:]+: \d+: MD033\/.*\[Element: feature-support\].*$\r?\n?/gm,
    /^test-repos\/v8-v8-dev\/src\/docs\/become-committer\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/v8-v8-dev\/src\/docs\/design-review-guidelines\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/v8-v8-dev\/src\/docs\/feature-launch-process\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/v8-v8-dev\/src\/docs\/official-support\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/v8-v8-dev\/src\/features\/import-assertions\.md: \d+: MD034\/.*$\r?\n?/gm,
    /^test-repos\/v8-v8-dev\/src\/features\/private-brand-checks\.md: \d+: MD034\/.*$\r?\n?/gm
  ];
  return lintTestRepo(t, globPatterns, configPath, ignoreRes);
});

test("https://github.com/webhintio/hint", (t) => {
  const rootDir = "./test-repos/webhintio-hint";
  const globPatterns = [
    join(rootDir, "**/*.md"),
    ...excludeGlobs(rootDir, "**/CHANGELOG.md")
  ];
  const configPath = join(rootDir, ".markdownlintrc");
  const ignoreRes = [
    /test-repos\/webhintio-hint\/packages\/hint-apple-touch-icons\/README\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint-axe\/README\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint-compat-api\/README\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint-compat-api\/docs\/html\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint-detect-css-reflows\/README\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint-detect-css-reflows\/docs\/composite\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint-detect-css-reflows\/docs\/layout\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint-detect-css-reflows\/docs\/paint\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint-doctype\/README\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint-highest-available-document-mode\/README\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint-http-compression\/README\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint-meta-viewport\/README\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint-minified-js\/README\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint-no-p3p\/README\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint-no-protocol-relative-urls\/README\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint-performance-budget\/README\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint-strict-transport-security\/README\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint-x-content-type-options\/README\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint\/docs\/about\/GOVERNANCE.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint\/docs\/contributor-guide\/getting-started\/architecture\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint\/docs\/contributor-guide\/getting-started\/development-environment\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint\/docs\/contributor-guide\/how-to\/hint\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint\/docs\/user-guide\/development-flow-integration\/local-server\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint\/docs\/user-guide\/index\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/hint\/docs\/user-guide\/troubleshoot\/summary\.md: \d+: MD053\/.*$\r?\n?/gm,
    /test-repos\/webhintio-hint\/packages\/parser-html\/README\.md: \d+: MD053\/.*$\r?\n?/gm
  ];
  return lintTestRepo(t, globPatterns, configPath, ignoreRes);
});

test("https://github.com/webpack/webpack.js.org", (t) => {
  const rootDir = "./test-repos/webpack-webpack-js-org";
  const globPatterns = [ join(rootDir, "**/*.md") ];
  const configPath = join(rootDir, ".markdownlint.json");
  return lintTestRepo(t, globPatterns, configPath);
});
