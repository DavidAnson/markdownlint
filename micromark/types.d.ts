// Manually update due to api-extractor limitations including:
// - https://github.com/microsoft/rushstack/issues/1709
// - ERROR: Failed to fetch entity for import() type node: import('micromark-util-types').ParseContext
// - Unwillingness to treat "katex" as one of bundledPackages
//
// 1. npm install
// 2. Comment-out micromark-util-types/ParseContext in micromark/node_modules/micromark-extension-gfm-footnote/index.d.ts
// 3. npm run types
// 4. Remove "import type { KatexOptions } from 'katex';" in micromark/micromark.d.cts
// 5. Replace "KatexOptions" with "Object" in micromark/micromark.d.cts
// 6. Append "declare module 'micromark-util-types' { interface TokenTypeMap { ... } }"  in micromark/micromark.d.cts from:
//    - micromark/node_modules/micromark-extension-directive/index.d.ts
//    - micromark/node_modules/micromark-extension-gfm-autolink-literal/index.d.ts
//    - micromark/node_modules/micromark-extension-gfm-footnote/index.d.ts
//    - micromark/node_modules/micromark-extension-gfm-table/index.d.ts
//    - micromark/node_modules/micromark-extension-math/index.d.ts
// 7. Update version number in package.json and stage changes
// 8. Test: npm run build, npm pack, npm install ./micromark/markdownlint-micromark-0.1.11.tgz, npm run ci, verify types like gfmFootnote* in getReferenceLinkImageData(...)
// 9. Publish: git clean -dfx, npm install, npm run build, npm publish ., git push

export type { directive, directiveHtml } from "micromark-extension-directive";
export type { gfmAutolinkLiteral, gfmAutolinkLiteralHtml } from "micromark-extension-gfm-autolink-literal";
export type { gfmFootnote, gfmFootnoteHtml } from "micromark-extension-gfm-footnote";
export type { gfmTable, gfmTableHtml } from "micromark-extension-gfm-table";
export type { math, mathHtml } from "micromark-extension-math";
export type { compile, parse, postprocess, preprocess } from "micromark";

export type { CompileData, Event, ParseOptions, Token, TokenType, TokenTypeMap } from "micromark-util-types";
