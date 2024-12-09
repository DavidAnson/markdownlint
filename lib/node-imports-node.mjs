// @ts-check

import { access, accessSync, readFile, readFileSync } from "node:fs";
export const fs = { access, accessSync, readFile, readFileSync };

import { createRequire } from "node:module";
export const module = { createRequire };

import { EOL, homedir } from "node:os";
export const os = { EOL, homedir };

// eslint-disable-next-line unicorn/import-style
import { dirname, resolve } from "node:path";
export const path = { dirname, resolve };
