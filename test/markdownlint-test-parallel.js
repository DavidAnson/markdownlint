// @ts-check

"use strict";

// eslint-disable-next-line n/no-unsupported-features/node-builtins
const { availableParallelism } = require("node:os");
const { Worker } = require("node:worker_threads");
const markdownlintSync = require("../lib/markdownlint").sync;

/**
 * Lint specified Markdown files (using multiple threads).
 *
 * @param {import("../lib/markdownlint").Options} options Configuration options.
 * @returns {Promise<import("../lib/markdownlint").LintResults>} Results object.
 */
function markdownlintParallel(options) {
  const workerCount = availableParallelism();
  const files = options.files || [];
  const chunkSize = Math.ceil(files.length / workerCount);
  const promises = [];
  for (let i = 0; i < workerCount; i++) {
    promises.push(new Promise((resolve, reject) => {
      const workerData = {
        ...options,
        "files": files.slice(i * chunkSize, (i + 1) * chunkSize)
      }
      const worker = new Worker(__filename.replace(/parallel\.js$/, "worker.js"), { workerData });
      worker.on("message", resolve);
      worker.on("error", reject);
    }));
  }
  return Promise.all(promises).then((workerResults) => {
    const combinedResults = markdownlintSync(null);
    for (const workerResult of workerResults) {
      // eslint-disable-next-line guard-for-in
      for (const result in workerResult) {
        combinedResults[result] = workerResult[result];
      }
    }
    return combinedResults;
  });
}

module.exports = markdownlintParallel;
