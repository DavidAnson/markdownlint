// @ts-check

import fs from "node:fs/promises";
import { globby } from "globby";

const [ command, ...args ] = process.argv.slice(2);

if (command === "copy") {
  const [ src, dest ] = args;
  await fs.copyFile(src, dest);
} else if (command === "delete") {
  await Promise.all(
    args.flatMap(
      (glob) => globby(glob)
        .then(
          (files) => files.map((file) => fs.unlink(file))
        )
    )
  );
} else if (command === "remove") {
  await Promise.all(args.map((dir) => fs.rm(dir, { "recursive": true })));
} else {
  throw new Error(`Unsupported command: ${command}`);
}
