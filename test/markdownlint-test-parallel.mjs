// @ts-check

import { availableParallelism } from "node:os";
import { Worker } from "node:worker_threads";
import { lint } from "markdownlint/sync";
import { __filename } from "./esm-helpers.mjs";

/**
 * Lint specified Markdown files (using multiple threads).
 *
 * @param {import("markdownlint").Options} options Configuration options.
 * @returns {Promise<import("markdownlint").LintResults>} Results object.
 */
export function markdownlintParallel(options) {
  const workerCount = availableParallelism();
  const files = options.files || [];
  const chunkSize = Math.ceil(files.length / workerCount);
  const promises = [];
  for (let i = 0; i < workerCount; i++) {
    promises.push(new Promise((resolve, reject) => {
      const workerData = {
        ...options,
        "files": files.slice(i * chunkSize, (i + 1) * chunkSize)
      };
      const worker = new Worker(__filename(import.meta).replace(/parallel\.mjs$/, "worker.mjs"), { workerData });
      worker.on("message", resolve);
      worker.on("error", reject);
    }));
  }
  return Promise.all(promises).then((workerResults) => {
    const combinedResults = lint(null);
    for (const workerResult of workerResults) {
      // eslint-disable-next-line guard-for-in
      for (const result in workerResult) {
        combinedResults[result] = workerResult[result];
      }
    }
    return combinedResults;
  });
}
