// Manually update due to api-extractor limitations including:
// - https://github.com/microsoft/rushstack/issues/1709
// - ERROR: Failed to fetch entity for import() type node: import('micromark-util-types').ParseContext
// - Unwillingness to treat "katex" as one of bundledPackages
//
// 1. npm install
// 2. Comment-out micromark-util-types/ParseContext in node_modules/micromark-extension-gfm-footnote/index.d.ts
// 3. npm run types
// 4. Remove "import { KatexOptions as KatexOptions_2 } from 'katex';" in micromark.d.cts
// 5. Replace "KatexOptions_2" with "Object" in micromark.d.cts
// 6. Append "declare module 'micromark-util-types' { interface TokenTypeMap { ... } }"  in micromark.d.cts from:
//    - node_modules/micromark-extension-directive/index.d.ts
//    - node_modules/micromark-extension-gfm-autolink-literal/index.d.ts
//    - node_modules/micromark-extension-gfm-footnote/index.d.ts
//    - node_modules/micromark-extension-gfm-table/index.d.ts
//    - node_modules/micromark-extension-math/index.d.ts

export type { directive, directiveHtml } from "micromark-extension-directive";
export type { gfmAutolinkLiteral, gfmAutolinkLiteralHtml } from "micromark-extension-gfm-autolink-literal";
export type { gfmFootnote, gfmFootnoteHtml } from "micromark-extension-gfm-footnote";
export type { gfmTable, gfmTableHtml } from "micromark-extension-gfm-table";
export type { math, mathHtml } from "micromark-extension-math";
export type { compile, parse, postprocess, preprocess } from "micromark";

export type { CompileData, Event, ParseOptions, Token, TokenType, TokenTypeMap } from "micromark-util-types";
