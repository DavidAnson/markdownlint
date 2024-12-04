// @ts-check

import { parentPort, workerData } from "node:worker_threads";
import { lint } from "markdownlint/promise";

const lintResults = await lint(workerData);
// @ts-ignore
parentPort
  // eslint-disable-next-line unicorn/require-post-message-target-origin
  .postMessage(lintResults);
// eslint-disable-next-line n/no-process-exit
process.exit();
