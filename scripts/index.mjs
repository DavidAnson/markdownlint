// @ts-check

// eslint-disable-next-line n/no-unsupported-features/node-builtins
import { constants, copyFile, rm, unlink } from "node:fs/promises";
import { globby } from "globby";

const [ command, ...args ] = process.argv.slice(2);

if (command === "copy") {
  const [ src, dest ] = args;
  await copyFile(src, dest, constants.COPYFILE_FICLONE);
} else if (command === "delete") {
  await Promise.all(
    args.flatMap(
      (glob) => globby(glob)
        .then(
          (files) => files.map((file) => unlink(file))
        )
    )
  );
} else if (command === "remove") {
  await Promise.all(args.map((dir) => rm(dir, { "recursive": true })));
} else {
  throw new Error(`Unsupported command: ${command}`);
}
