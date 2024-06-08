// @ts-check

"use strict";

const { parentPort, workerData } = require("node:worker_threads");
const markdownlint = require("../lib/markdownlint").promises.markdownlint;

// eslint-disable-next-line unicorn/prefer-top-level-await
markdownlint(workerData).then((lintResults) => {
  // @ts-ignore
  parentPort.
    // eslint-disable-next-line unicorn/require-post-message-target-origin
    postMessage(lintResults);
  // eslint-disable-next-line n/no-process-exit
  process.exit();
});
