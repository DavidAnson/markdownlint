// @ts-check

import { parentPort, workerData } from "node:worker_threads";
import library from "../lib/markdownlint.mjs";
const { markdownlint } = library.promises;

const lintResults = await markdownlint(workerData);
// @ts-ignore
parentPort
  // eslint-disable-next-line unicorn/require-post-message-target-origin
  .postMessage(lintResults);
// eslint-disable-next-line n/no-process-exit
process.exit();
