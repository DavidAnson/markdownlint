// @ts-check

"use strict";

const { addError, addErrorDetailIf, getHtmlAttributeRe } =
  require("../helpers");
const { filterByPredicate, filterByTypes, getHtmlTagInfo } =
  require("../helpers/micromark.cjs");

// Regular expression for identifying HTML anchor names
const idRe = getHtmlAttributeRe("id");
const nameRe = getHtmlAttributeRe("name");
const anchorRe = /\{(#[a-z\d]+(?:[-_][a-z\d]+)*)\}/gu;

// Sets for filtering heading tokens during conversion
const childrenExclude = new Set([ "image", "reference", "resource" ]);
const tokensInclude = new Set(
  [ "characterEscapeValue", "codeTextData", "data" ]
);

/**
 * @typedef {import("../helpers/micromark.cjs").Token} Token
 */

/**
 * Converts a Markdown heading into an HTML fragment according to the rules
 * used by GitHub.
 *
 * @param {Token} headingText Heading text token.
 * @returns {string} Fragment string for heading.
 */
function convertHeadingToHTMLFragment(headingText) {
  const inlineText =
    filterByPredicate(
      headingText.children,
      (token) => tokensInclude.has(token.type),
      (token) => (childrenExclude.has(token.type) ? [] : token.children)
    )
      .map((token) => token.text)
      .join("");
  return "#" + encodeURIComponent(
    inlineText
      .toLowerCase()
      // RegExp source with Ruby's \p{Word} expanded into its General Categories
      // https://github.com/gjtorikian/html-pipeline/blob/main/lib/html/pipeline/toc_filter.rb
      // https://ruby-doc.org/core-3.0.2/Regexp.html
      .replace(
        /[^\p{Letter}\p{Mark}\p{Number}\p{Connector_Punctuation}\- ]/gu,
        ""
      )
      .replace(/ /gu, "-")
  );
}

/**
 * Unescapes the text of a String-type micromark Token.
 *
 * @param {Token} token String-type micromark Token.
 * @returns {string} Unescaped token text.
 */
function unescapeStringTokenText(token) {
  return filterByTypes(token.children, [ "characterEscapeValue", "data" ])
    .map((child) => child.text)
    .join("");
}

module.exports = {
  "names": [ "MD051", "link-fragments" ],
  "description": "Link fragments should be valid",
  "tags": [ "links" ],
  "function": function MD051(params, onError) {
    const { tokens } = params.parsers.micromark;
    const fragments = new Map();

    // Process headings
    const headingTexts = filterByTypes(
      tokens,
      [ "atxHeadingText", "setextHeadingText" ]
    );
    for (const headingText of headingTexts) {
      const fragment = convertHeadingToHTMLFragment(headingText);
      if (fragment !== "#") {
        const count = fragments.get(fragment) || 0;
        if (count) {
          fragments.set(`${fragment}-${count}`, 0);
        }
        fragments.set(fragment, count + 1);
        let match = null;
        while ((match = anchorRe.exec(headingText.text)) !== null) {
          const [ , anchor ] = match;
          if (!fragments.has(anchor)) {
            fragments.set(anchor, 1);
          }
        }
      }
    }

    // Process HTML anchors
    for (const token of filterByTypes(tokens, [ "htmlText" ])) {
      const htmlTagInfo = getHtmlTagInfo(token);
      if (htmlTagInfo && !htmlTagInfo.close) {
        const anchorMatch = idRe.exec(token.text) ||
          (htmlTagInfo.name.toLowerCase() === "a" && nameRe.exec(token.text));
        if (anchorMatch && anchorMatch.length > 0) {
          fragments.set(`#${anchorMatch[1]}`, 0);
        }
      }
    }

    // Process link and definition fragments
    const parentChilds = [
      [ "link", "resourceDestinationString" ],
      [ "definition", "definitionDestinationString" ]
    ];
    for (const [ parentType, definitionType ] of parentChilds) {
      const links = filterByTypes(tokens, [ parentType ]);
      for (const link of links) {
        const definitions = filterByTypes(link.children, [ definitionType ]);
        for (const definition of definitions) {
          const { endColumn, startColumn } = definition;
          const text = unescapeStringTokenText(definition);
          if (
            (text.length > 1) &&
            text.startsWith("#") &&
            !fragments.has(text) &&
            !fragments.has(`#${encodeURIComponent(text.slice(1))}`)
          ) {
            // eslint-disable-next-line no-undef-init
            let context = undefined;
            // eslint-disable-next-line no-undef-init
            let range = undefined;
            // eslint-disable-next-line no-undef-init
            let fixInfo = undefined;
            if (link.startLine === link.endLine) {
              context = link.text;
              range = [ link.startColumn, link.endColumn - link.startColumn ];
              fixInfo = {
                "editColumn": startColumn,
                "deleteCount": endColumn - startColumn
              };
            }
            const textLower = text.toLowerCase();
            const mixedCaseKey = [ ...fragments.keys() ]
              .find((key) => textLower === key.toLowerCase());
            if (mixedCaseKey) {
              // @ts-ignore
              (fixInfo || {}).insertText = mixedCaseKey;
              addErrorDetailIf(
                onError,
                link.startLine,
                mixedCaseKey,
                text,
                undefined,
                context,
                range,
                fixInfo
              );
            } else {
              addError(
                onError,
                link.startLine,
                undefined,
                context,
                range
              );
            }
          }
        }
      }
    }
  }
};
