/*! markdownlint 0.27.0 https://github.com/DavidAnson/markdownlint @license MIT */
var markdownlint;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../lib sync recursive":
/*!********************!*\
  !*** ../lib/ sync ***!
  \********************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "../lib sync recursive";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "../helpers/helpers.js":
/*!*****************************!*\
  !*** ../helpers/helpers.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

// Regular expression for matching common newline characters
// See NEWLINES_RE in markdown-it/lib/rules_core/normalize.js
const newLineRe = /\r\n?|\n/g;
module.exports.newLineRe = newLineRe;
// Regular expression for matching common front matter (YAML and TOML)
module.exports.frontMatterRe =
    // eslint-disable-next-line max-len
    /((^---\s*$[\s\S]*?^---\s*)|(^\+\+\+\s*$[\s\S]*?^(\+\+\+|\.\.\.)\s*)|(^\{\s*$[\s\S]*?^\}\s*))(\r\n|\r|\n|$)/m;
// Regular expression for matching the start of inline disable/enable comments
const inlineCommentStartRe = 
// eslint-disable-next-line max-len
/(<!--\s*markdownlint-(disable|enable|capture|restore|disable-file|enable-file|disable-line|disable-next-line|configure-file))(?:\s|-->)/gi;
module.exports.inlineCommentStartRe = inlineCommentStartRe;
// Regular expression for matching HTML elements
const htmlElementRe = /<(([A-Za-z][A-Za-z\d-]*)(?:\s[^`>]*)?)\/?>/g;
module.exports.htmlElementRe = htmlElementRe;
// Regular expressions for range matching
module.exports.listItemMarkerRe = /^([\s>]*)(?:[*+-]|\d+[.)])\s+/;
module.exports.orderedListItemMarkerRe = /^[\s>]*0*(\d+)[.)]/;
// Regular expression for all instances of emphasis markers
const emphasisMarkersRe = /[_*]/g;
// Regular expression for blockquote prefixes
const blockquotePrefixRe = /^[>\s]*/;
module.exports.blockquotePrefixRe = blockquotePrefixRe;
// Regular expression for reference links (full, collapsed, and shortcut)
const referenceLinkRe = /!?\\?\[((?:\[[^\]\0]*\]|[^[\]\0])*)\](?:\[([^\]\0]*)\]|([^(])|$)/g;
// Regular expression for link reference definitions
const linkReferenceDefinitionRe = /^ {0,3}\[([^\]]*[^\\])\]:/;
module.exports.linkReferenceDefinitionRe = linkReferenceDefinitionRe;
// All punctuation characters (normal and full-width)
const allPunctuation = ".,;:!?。，；：！？";
module.exports.allPunctuation = allPunctuation;
// All punctuation characters without question mark (normal and full-width)
module.exports.allPunctuationNoQuestion = allPunctuation.replace(/[?？]/gu, "");
// Returns true iff the input is a number
module.exports.isNumber = function isNumber(obj) {
    return typeof obj === "number";
};
// Returns true iff the input is a string
module.exports.isString = function isString(obj) {
    return typeof obj === "string";
};
// Returns true iff the input string is empty
module.exports.isEmptyString = function isEmptyString(str) {
    return str.length === 0;
};
// Returns true iff the input is an object
module.exports.isObject = function isObject(obj) {
    return (obj !== null) && (typeof obj === "object") && !Array.isArray(obj);
};
/**
 * Returns true iff the input line is blank (contains nothing, whitespace, or
 * comments (unclosed start/end comments allowed)).
 *
 * @param {string} line Input line.
 * @returns {boolean} True iff line is blank.
 */
function isBlankLine(line) {
    const startComment = "<!--";
    const endComment = "-->";
    const removeComments = (s) => {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const start = s.indexOf(startComment);
            const end = s.indexOf(endComment);
            if ((end !== -1) && ((start === -1) || (end < start))) {
                // Unmatched end comment is first
                s = s.slice(end + endComment.length);
            }
            else if ((start !== -1) && (end !== -1)) {
                // Start comment is before end comment
                s = s.slice(0, start) + s.slice(end + endComment.length);
            }
            else if ((start !== -1) && (end === -1)) {
                // Unmatched start comment is last
                s = s.slice(0, start);
            }
            else {
                // No more comments to remove
                return s;
            }
        }
    };
    return (!line ||
        !line.trim() ||
        !removeComments(line).replace(/>/g, "").trim());
}
module.exports.isBlankLine = isBlankLine;
/**
 * Compare function for Array.prototype.sort for ascending order of numbers.
 *
 * @param {number} a First number.
 * @param {number} b Second number.
 * @returns {number} Positive value if a>b, negative value if b<a, 0 otherwise.
 */
module.exports.numericSortAscending = function numericSortAscending(a, b) {
    return a - b;
};
// Returns true iff the sorted array contains the specified element
module.exports.includesSorted = function includesSorted(array, element) {
    let left = 0;
    let right = array.length - 1;
    while (left <= right) {
        // eslint-disable-next-line no-bitwise
        const mid = (left + right) >> 1;
        if (array[mid] < element) {
            left = mid + 1;
        }
        else if (array[mid] > element) {
            right = mid - 1;
        }
        else {
            return true;
        }
    }
    return false;
};
// Replaces the content of properly-formatted CommonMark comments with "."
// This preserves the line/column information for the rest of the document
// https://spec.commonmark.org/0.29/#html-blocks
// https://spec.commonmark.org/0.29/#html-comment
const htmlCommentBegin = "<!--";
const htmlCommentEnd = "-->";
const safeCommentCharacter = ".";
const startsWithPipeRe = /^ *\|/;
const notCrLfRe = /[^\r\n]/g;
const notSpaceCrLfRe = /[^ \r\n]/g;
const trailingSpaceRe = / +[\r\n]/g;
const replaceTrailingSpace = (s) => s.replace(notCrLfRe, safeCommentCharacter);
module.exports.clearHtmlCommentText = function clearHtmlCommentText(text) {
    let i = 0;
    while ((i = text.indexOf(htmlCommentBegin, i)) !== -1) {
        const j = text.indexOf(htmlCommentEnd, i + 2);
        if (j === -1) {
            // Un-terminated comments are treated as text
            break;
        }
        // If the comment has content...
        if (j > i + htmlCommentBegin.length) {
            const content = text.slice(i + htmlCommentBegin.length, j);
            const lastLf = text.lastIndexOf("\n", i) + 1;
            const preText = text.slice(lastLf, i);
            const isBlock = preText.trim().length === 0;
            const couldBeTable = startsWithPipeRe.test(preText);
            const spansTableCells = couldBeTable && content.includes("\n");
            const isValid = isBlock ||
                !(spansTableCells ||
                    content.startsWith(">") ||
                    content.startsWith("->") ||
                    content.endsWith("-") ||
                    content.includes("--"));
            // If a valid block/inline comment...
            if (isValid) {
                const clearedContent = content
                    .replace(notSpaceCrLfRe, safeCommentCharacter)
                    .replace(trailingSpaceRe, replaceTrailingSpace);
                text =
                    text.slice(0, i + htmlCommentBegin.length) +
                        clearedContent +
                        text.slice(j);
            }
        }
        i = j + htmlCommentEnd.length;
    }
    return text;
};
// Escapes a string for use in a RegExp
module.exports.escapeForRegExp = function escapeForRegExp(str) {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
};
// Un-escapes Markdown content (simple algorithm; not a parser)
const escapedMarkdownRe = /\\./g;
module.exports.unescapeMarkdown =
    function unescapeMarkdown(markdown, replacement) {
        return markdown.replace(escapedMarkdownRe, (match) => {
            const char = match[1];
            if ("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~".includes(char)) {
                return replacement || char;
            }
            return match;
        });
    };
/**
 * Return the string representation of a fence markup character.
 *
 * @param {string} markup Fence string.
 * @returns {string} String representation.
 */
module.exports.fencedCodeBlockStyleFor =
    function fencedCodeBlockStyleFor(markup) {
        switch (markup[0]) {
            case "~":
                return "tilde";
            default:
                return "backtick";
        }
    };
/**
 * Return the string representation of a emphasis or strong markup character.
 *
 * @param {string} markup Emphasis or strong string.
 * @returns {string} String representation.
 */
module.exports.emphasisOrStrongStyleFor =
    function emphasisOrStrongStyleFor(markup) {
        switch (markup[0]) {
            case "*":
                return "asterisk";
            default:
                return "underscore";
        }
    };
/**
 * Return the number of characters of indent for a token.
 *
 * @param {Object} token MarkdownItToken instance.
 * @returns {number} Characters of indent.
 */
function indentFor(token) {
    const line = token.line.replace(/^[\s>]*(> |>)/, "");
    return line.length - line.trimStart().length;
}
module.exports.indentFor = indentFor;
// Returns the heading style for a heading token
module.exports.headingStyleFor = function headingStyleFor(token) {
    if ((token.map[1] - token.map[0]) === 1) {
        if (/[^\\]#\s*$/.test(token.line)) {
            return "atx_closed";
        }
        return "atx";
    }
    return "setext";
};
/**
 * Return the string representation of an unordered list marker.
 *
 * @param {Object} token MarkdownItToken instance.
 * @returns {string} String representation.
 */
module.exports.unorderedListStyleFor = function unorderedListStyleFor(token) {
    switch (token.markup) {
        case "-":
            return "dash";
        case "+":
            return "plus";
        // case "*":
        default:
            return "asterisk";
    }
};
/**
 * Calls the provided function for each matching token.
 *
 * @param {Object} params RuleParams instance.
 * @param {string} type Token type identifier.
 * @param {Function} handler Callback function.
 * @returns {void}
 */
function filterTokens(params, type, handler) {
    for (const token of params.tokens) {
        if (token.type === type) {
            handler(token);
        }
    }
}
module.exports.filterTokens = filterTokens;
/**
 * Returns whether a token is a math block (created by markdown-it-texmath).
 *
 * @param {Object} token MarkdownItToken instance.
 * @returns {boolean} True iff token is a math block.
 */
function isMathBlock(token) {
    return (((token.tag === "$$") || (token.tag === "math")) &&
        token.type.startsWith("math_block") &&
        !token.type.endsWith("_end"));
}
module.exports.isMathBlock = isMathBlock;
// Get line metadata array
module.exports.getLineMetadata = function getLineMetadata(params) {
    const lineMetadata = params.lines.map((line, index) => [line, index, false, 0, false, false, false, false]);
    filterTokens(params, "fence", (token) => {
        lineMetadata[token.map[0]][3] = 1;
        lineMetadata[token.map[1] - 1][3] = -1;
        for (let i = token.map[0] + 1; i < token.map[1] - 1; i++) {
            lineMetadata[i][2] = true;
        }
    });
    filterTokens(params, "code_block", (token) => {
        for (let i = token.map[0]; i < token.map[1]; i++) {
            lineMetadata[i][2] = true;
        }
    });
    filterTokens(params, "table_open", (token) => {
        for (let i = token.map[0]; i < token.map[1]; i++) {
            lineMetadata[i][4] = true;
        }
    });
    filterTokens(params, "list_item_open", (token) => {
        let count = 1;
        for (let i = token.map[0]; i < token.map[1]; i++) {
            lineMetadata[i][5] = count;
            count++;
        }
    });
    filterTokens(params, "hr", (token) => {
        lineMetadata[token.map[0]][6] = true;
    });
    for (const token of params.tokens.filter(isMathBlock)) {
        for (let i = token.map[0]; i < token.map[1]; i++) {
            lineMetadata[i][7] = true;
        }
    }
    return lineMetadata;
};
/**
 * Calls the provided function for each line.
 *
 * @param {Object} lineMetadata Line metadata object.
 * @param {Function} handler Function taking (line, lineIndex, inCode, onFence,
 * inTable, inItem, inBreak, inMath).
 * @returns {void}
 */
function forEachLine(lineMetadata, handler) {
    for (const metadata of lineMetadata) {
        handler(...metadata);
    }
}
module.exports.forEachLine = forEachLine;
// Returns (nested) lists as a flat array (in order)
module.exports.flattenLists = function flattenLists(tokens) {
    const flattenedLists = [];
    const stack = [];
    let current = null;
    let nesting = 0;
    const nestingStack = [];
    let lastWithMap = { "map": [0, 1] };
    for (const token of tokens) {
        if ((token.type === "bullet_list_open") ||
            (token.type === "ordered_list_open")) {
            // Save current context and start a new one
            stack.push(current);
            current = {
                "unordered": (token.type === "bullet_list_open"),
                "parentsUnordered": !current ||
                    (current.unordered && current.parentsUnordered),
                "open": token,
                "indent": indentFor(token),
                "parentIndent": (current && current.indent) || 0,
                "items": [],
                "nesting": nesting,
                "lastLineIndex": -1,
                "insert": flattenedLists.length
            };
            nesting++;
        }
        else if ((token.type === "bullet_list_close") ||
            (token.type === "ordered_list_close")) {
            // Finalize current context and restore previous
            current.lastLineIndex = lastWithMap.map[1];
            flattenedLists.splice(current.insert, 0, current);
            delete current.insert;
            current = stack.pop();
            nesting--;
        }
        else if (token.type === "list_item_open") {
            // Add list item
            current.items.push(token);
        }
        else if (token.type === "blockquote_open") {
            nestingStack.push(nesting);
            nesting = 0;
        }
        else if (token.type === "blockquote_close") {
            nesting = nestingStack.pop() || 0;
        }
        if (token.map) {
            // Track last token with map
            lastWithMap = token;
        }
    }
    return flattenedLists;
};
/**
 * Calls the provided function for each specified inline child token.
 *
 * @param {Object} params RuleParams instance.
 * @param {string} type Token type identifier.
 * @param {Function} handler Callback function.
 * @returns {void}
 */
function forEachInlineChild(params, type, handler) {
    filterTokens(params, "inline", (token) => {
        for (const child of token.children.filter((c) => c.type === type)) {
            handler(child, token);
        }
    });
}
module.exports.forEachInlineChild = forEachInlineChild;
// Calls the provided function for each heading's content
module.exports.forEachHeading = function forEachHeading(params, handler) {
    let heading = null;
    for (const token of params.tokens) {
        if (token.type === "heading_open") {
            heading = token;
        }
        else if (token.type === "heading_close") {
            heading = null;
        }
        else if ((token.type === "inline") && heading) {
            handler(heading, token.content, token);
        }
    }
};
/**
 * Calls the provided function for each inline code span's content.
 *
 * @param {string} input Markdown content.
 * @param {Function} handler Callback function taking (code, lineIndex,
 * columnIndex, ticks).
 * @returns {void}
 */
function forEachInlineCodeSpan(input, handler) {
    const backtickRe = /`+/g;
    let match = null;
    const backticksLengthAndIndex = [];
    while ((match = backtickRe.exec(input)) !== null) {
        backticksLengthAndIndex.push([match[0].length, match.index]);
    }
    const newLinesIndex = [];
    while ((match = newLineRe.exec(input)) !== null) {
        newLinesIndex.push(match.index);
    }
    let lineIndex = 0;
    let lineStartIndex = 0;
    let k = 0;
    for (let i = 0; i < backticksLengthAndIndex.length - 1; i++) {
        const [startLength, startIndex] = backticksLengthAndIndex[i];
        if ((startIndex === 0) || (input[startIndex - 1] !== "\\")) {
            for (let j = i + 1; j < backticksLengthAndIndex.length; j++) {
                const [endLength, endIndex] = backticksLengthAndIndex[j];
                if (startLength === endLength) {
                    for (; k < newLinesIndex.length; k++) {
                        const newLineIndex = newLinesIndex[k];
                        if (startIndex < newLineIndex) {
                            break;
                        }
                        lineIndex++;
                        lineStartIndex = newLineIndex + 1;
                    }
                    const columnIndex = startIndex - lineStartIndex + startLength;
                    handler(input.slice(startIndex + startLength, endIndex), lineIndex, columnIndex, startLength);
                    i = j;
                    break;
                }
            }
        }
    }
}
module.exports.forEachInlineCodeSpan = forEachInlineCodeSpan;
/**
 * Adds ellipsis to the left/right/middle of the specified text.
 *
 * @param {string} text Text to ellipsify.
 * @param {boolean} [start] True iff the start of the text is important.
 * @param {boolean} [end] True iff the end of the text is important.
 * @returns {string} Ellipsified text.
 */
function ellipsify(text, start, end) {
    if (text.length <= 30) {
        // Nothing to do
    }
    else if (start && end) {
        text = text.slice(0, 15) + "..." + text.slice(-15);
    }
    else if (end) {
        text = "..." + text.slice(-30);
    }
    else {
        text = text.slice(0, 30) + "...";
    }
    return text;
}
module.exports.ellipsify = ellipsify;
/**
 * Adds a generic error object via the onError callback.
 *
 * @param {Object} onError RuleOnError instance.
 * @param {number} lineNumber Line number.
 * @param {string} [detail] Error details.
 * @param {string} [context] Error context.
 * @param {number[]} [range] Column and length of error.
 * @param {Object} [fixInfo] RuleOnErrorFixInfo instance.
 * @returns {void}
 */
function addError(onError, lineNumber, detail, context, range, fixInfo) {
    onError({
        lineNumber,
        detail,
        context,
        range,
        fixInfo
    });
}
module.exports.addError = addError;
// Adds an error object with details conditionally via the onError callback
module.exports.addErrorDetailIf = function addErrorDetailIf(onError, lineNumber, expected, actual, detail, context, range, fixInfo) {
    if (expected !== actual) {
        addError(onError, lineNumber, "Expected: " + expected + "; Actual: " + actual +
            (detail ? "; " + detail : ""), context, range, fixInfo);
    }
};
// Adds an error object with context via the onError callback
module.exports.addErrorContext = function addErrorContext(onError, lineNumber, context, left, right, range, fixInfo) {
    context = ellipsify(context, left, right);
    addError(onError, lineNumber, undefined, context, range, fixInfo);
};
/**
 * Returns an array of code block and span content ranges.
 *
 * @param {Object} params RuleParams instance.
 * @param {Object} lineMetadata Line metadata object.
 * @returns {number[][]} Array of ranges (lineIndex, columnIndex, length).
 */
module.exports.codeBlockAndSpanRanges = (params, lineMetadata) => {
    const exclusions = [];
    // Add code block ranges (excludes fences)
    forEachLine(lineMetadata, (line, lineIndex, inCode, onFence) => {
        if (inCode && !onFence) {
            exclusions.push([lineIndex, 0, line.length]);
        }
    });
    // Add code span ranges (excludes ticks)
    filterTokens(params, "inline", (token) => {
        if (token.children.some((child) => child.type === "code_inline")) {
            const tokenLines = params.lines.slice(token.map[0], token.map[1]);
            forEachInlineCodeSpan(tokenLines.join("\n"), (code, lineIndex, columnIndex) => {
                const codeLines = code.split(newLineRe);
                for (const [i, line] of codeLines.entries()) {
                    exclusions.push([
                        token.lineNumber - 1 + lineIndex + i,
                        i ? 0 : columnIndex,
                        line.length
                    ]);
                }
            });
        }
    });
    return exclusions;
};
/**
 * Returns an array of HTML element ranges.
 *
 * @param {Object} params RuleParams instance.
 * @param {Object} lineMetadata Line metadata object.
 * @returns {number[][]} Array of ranges (lineIndex, columnIndex, length).
 */
module.exports.htmlElementRanges = (params, lineMetadata) => {
    const exclusions = [];
    // Match with htmlElementRe
    forEachLine(lineMetadata, (line, lineIndex, inCode) => {
        let match = null;
        // eslint-disable-next-line no-unmodified-loop-condition
        while (!inCode && ((match = htmlElementRe.exec(line)) !== null)) {
            exclusions.push([lineIndex, match.index, match[0].length]);
        }
    });
    // Match with html_inline
    forEachInlineChild(params, "html_inline", (token, parent) => {
        const parentContent = parent.content;
        let tokenContent = token.content;
        const parentIndex = parentContent.indexOf(tokenContent);
        let deltaLines = 0;
        let indent = 0;
        for (let i = parentIndex - 1; i >= 0; i--) {
            if (parentContent[i] === "\n") {
                deltaLines++;
            }
            else if (deltaLines === 0) {
                indent++;
            }
        }
        let lineIndex = token.lineNumber - 1 + deltaLines;
        do {
            const index = tokenContent.indexOf("\n");
            const length = (index === -1) ? tokenContent.length : index;
            exclusions.push([lineIndex, indent, length]);
            tokenContent = tokenContent.slice(length + 1);
            lineIndex++;
            indent = 0;
        } while (tokenContent.length > 0);
    });
    // Return results
    return exclusions;
};
/**
 * Determines whether the specified range is within another range.
 *
 * @param {number[][]} ranges Array of ranges (line, index, length).
 * @param {number} lineIndex Line index to check.
 * @param {number} index Index to check.
 * @param {number} length Length to check.
 * @returns {boolean} True iff the specified range is within.
 */
const withinAnyRange = (ranges, lineIndex, index, length) => (!ranges.every((span) => ((lineIndex !== span[0]) ||
    (index < span[1]) ||
    (index + length > span[1] + span[2]))));
module.exports.withinAnyRange = withinAnyRange;
// Returns a range object for a line by applying a RegExp
module.exports.rangeFromRegExp = function rangeFromRegExp(line, regexp) {
    let range = null;
    const match = line.match(regexp);
    if (match) {
        const column = match.index + 1;
        const length = match[0].length;
        range = [column, length];
    }
    return range;
};
// Determines if the front matter includes a title
module.exports.frontMatterHasTitle =
    function frontMatterHasTitle(frontMatterLines, frontMatterTitlePattern) {
        const ignoreFrontMatter = (frontMatterTitlePattern !== undefined) && !frontMatterTitlePattern;
        const frontMatterTitleRe = new RegExp(String(frontMatterTitlePattern || "^\\s*\"?title\"?\\s*[:=]"), "i");
        return !ignoreFrontMatter &&
            frontMatterLines.some((line) => frontMatterTitleRe.test(line));
    };
/**
 * Calls the provided function for each link.
 *
 * @param {string} line Line of Markdown input.
 * @param {Function} handler Function taking (index, link, text, destination).
 * @returns {void}
 */
function forEachLink(line, handler) {
    // Helper to find matching close symbol for link text/destination
    const findClosingSymbol = (index) => {
        const begin = line[index];
        const end = (begin === "[") ? "]" : ")";
        let nesting = 0;
        let escaping = false;
        let pointy = false;
        for (let i = index + 1; i < line.length; i++) {
            const current = line[i];
            if (current === "\\") {
                escaping = !escaping;
            }
            else if (!escaping && (current === begin)) {
                nesting++;
            }
            else if (!escaping && (current === end)) {
                if (nesting > 0) {
                    nesting--;
                }
                else if (!pointy) {
                    // Return index after matching close symbol
                    return i + 1;
                }
            }
            else if ((i === index + 1) && (begin === "(") && (current === "<")) {
                pointy = true;
            }
            else if (!escaping && pointy && current === ">") {
                pointy = false;
                nesting = 0;
            }
            else {
                escaping = false;
            }
        }
        // No match found
        return -1;
    };
    // Scan line for unescaped "[" character
    let escaping = false;
    for (let i = 0; i < line.length; i++) {
        const current = line[i];
        if (current === "\\") {
            escaping = !escaping;
        }
        else if (!escaping && (current === "[")) {
            // Scan for matching close "]" of link text
            const textEnd = findClosingSymbol(i);
            if (textEnd !== -1) {
                if ((line[textEnd] === "(") || (line[textEnd] === "[")) {
                    // Scan for matching close ")" or "]" of link destination
                    const destEnd = findClosingSymbol(textEnd);
                    if (destEnd !== -1) {
                        // Call handler with link text and destination
                        const link = line.slice(i, destEnd);
                        const text = line.slice(i, textEnd);
                        const dest = line.slice(textEnd, destEnd);
                        handler(i, link, text, dest);
                        i = destEnd;
                    }
                }
                if (i < textEnd) {
                    // Call handler with link text only
                    const text = line.slice(i, textEnd);
                    handler(i, text, text);
                    i = textEnd;
                }
            }
        }
        else {
            escaping = false;
        }
    }
}
module.exports.forEachLink = forEachLink;
/**
 * Returns a list of emphasis markers in code spans and links.
 *
 * @param {Object} params RuleParams instance.
 * @returns {number[][]} List of markers.
 */
function emphasisMarkersInContent(params) {
    const { lines } = params;
    const byLine = new Array(lines.length);
    // Search links
    for (const [tokenLineIndex, tokenLine] of lines.entries()) {
        const inLine = [];
        forEachLink(tokenLine, (index, match) => {
            let markerMatch = null;
            while ((markerMatch = emphasisMarkersRe.exec(match))) {
                inLine.push(index + markerMatch.index);
            }
        });
        byLine[tokenLineIndex] = inLine;
    }
    // Search code spans
    filterTokens(params, "inline", (token) => {
        const { children, lineNumber, map } = token;
        if (children.some((child) => child.type === "code_inline")) {
            const tokenLines = lines.slice(map[0], map[1]);
            forEachInlineCodeSpan(tokenLines.join("\n"), (code, lineIndex, column, tickCount) => {
                const codeLines = code.split(newLineRe);
                for (const [codeLineIndex, codeLine] of codeLines.entries()) {
                    const byLineIndex = lineNumber - 1 + lineIndex + codeLineIndex;
                    const inLine = byLine[byLineIndex];
                    const codeLineOffset = codeLineIndex ? 0 : column - 1 + tickCount;
                    let match = null;
                    while ((match = emphasisMarkersRe.exec(codeLine))) {
                        inLine.push(codeLineOffset + match.index);
                    }
                    byLine[byLineIndex] = inLine;
                }
            });
        }
    });
    return byLine;
}
module.exports.emphasisMarkersInContent = emphasisMarkersInContent;
/**
 * Returns an object with information about reference links and images.
 *
 * @param {Object} lineMetadata Line metadata object.
 * @returns {Object} Reference link/image data.
 */
function getReferenceLinkImageData(lineMetadata) {
    // Initialize return values
    const references = new Map();
    const shortcuts = new Map();
    const definitions = new Map();
    const duplicateDefinitions = [];
    const definitionLineIndices = [];
    // Define helper functions
    const normalizeLabel = (s) => s.toLowerCase().trim().replace(/\s+/g, " ");
    const exclusions = [];
    const excluded = (match) => withinAnyRange(exclusions, 0, match.index, match[0].length - (match[3] || "").length);
    // Convert input to single-line so multi-line links/images are easier
    const lineOffsets = [];
    let currentOffset = 0;
    const contentLines = [];
    forEachLine(lineMetadata, (line, lineIndex, inCode) => {
        lineOffsets[lineIndex] = currentOffset;
        if (!inCode) {
            line = line.replace(blockquotePrefixRe, "");
            if (line.trim().length === 0) {
                // Allow RegExp to detect the end of a block
                line = "\0";
            }
            contentLines.push(line);
            currentOffset += line.length + 1;
        }
    });
    lineOffsets.push(currentOffset);
    const contentLine = contentLines.join(" ");
    // Determine single-line exclusions for inline code spans
    forEachInlineCodeSpan(contentLine, (code, lineIndex, columnIndex) => {
        exclusions.push([0, columnIndex, code.length]);
    });
    // Identify all link/image reference definitions
    forEachLine(lineMetadata, (line, lineIndex, inCode) => {
        if (!inCode) {
            const linkReferenceDefinitionMatch = linkReferenceDefinitionRe.exec(line);
            if (linkReferenceDefinitionMatch) {
                const label = normalizeLabel(linkReferenceDefinitionMatch[1]);
                if (definitions.has(label)) {
                    duplicateDefinitions.push([label, lineIndex]);
                }
                else {
                    definitions.set(label, lineIndex);
                }
                const labelLength = linkReferenceDefinitionMatch[0].length;
                exclusions.push([0, lineOffsets[lineIndex], labelLength]);
                const hasDefinition = line.slice(labelLength).trim().length > 0;
                definitionLineIndices.push(lineIndex);
                if (!hasDefinition) {
                    definitionLineIndices.push(lineIndex + 1);
                }
            }
        }
    });
    // Identify all link and image references
    let lineIndex = 0;
    const pendingContents = [
        {
            "content": contentLine,
            "contentLineIndex": 0,
            "contentIndex": 0,
            "topLevel": true
        }
    ];
    let pendingContent = null;
    while ((pendingContent = pendingContents.shift())) {
        const { content, contentLineIndex, contentIndex, topLevel } = pendingContent;
        let referenceLinkMatch = null;
        while ((referenceLinkMatch = referenceLinkRe.exec(content)) !== null) {
            const [matchString, matchText, matchLabel] = referenceLinkMatch;
            if (!matchString.startsWith("\\") &&
                !matchString.startsWith("!\\") &&
                !matchText.endsWith("\\") &&
                !(matchLabel || "").endsWith("\\") &&
                !(topLevel && excluded(referenceLinkMatch))) {
                const shortcutLink = (matchLabel === undefined);
                const collapsedLink = (!shortcutLink && (matchLabel.length === 0));
                const label = normalizeLabel((shortcutLink || collapsedLink) ? matchText : matchLabel);
                if (label.length > 0) {
                    const referenceindex = referenceLinkMatch.index;
                    if (topLevel) {
                        // Calculate line index
                        while (lineOffsets[lineIndex + 1] <= referenceindex) {
                            lineIndex++;
                        }
                    }
                    else {
                        // Use provided line index
                        lineIndex = contentLineIndex;
                    }
                    const referenceIndex = referenceindex +
                        (topLevel ? -lineOffsets[lineIndex] : contentIndex);
                    const referenceDatum = [
                        lineIndex,
                        referenceIndex,
                        matchString.length,
                        matchText.length,
                        (matchLabel || "").length
                    ];
                    if (shortcutLink) {
                        // Track separately due to ambiguity in "text [text] text"
                        const shortcutData = shortcuts.get(label) || [];
                        shortcutData.push(referenceDatum);
                        shortcuts.set(label, shortcutData);
                    }
                    else {
                        // Track reference and location
                        const referenceData = references.get(label) || [];
                        referenceData.push(referenceDatum);
                        references.set(label, referenceData);
                    }
                    // Check for links embedded in brackets
                    if (!matchString.startsWith("!")) {
                        pendingContents.push({
                            "content": matchText,
                            "contentLineIndex": lineIndex,
                            "contentIndex": referenceIndex + 1,
                            "topLevel": false
                        });
                    }
                }
            }
        }
    }
    return {
        references,
        shortcuts,
        definitions,
        duplicateDefinitions,
        definitionLineIndices
    };
}
module.exports.getReferenceLinkImageData = getReferenceLinkImageData;
/**
 * Gets the most common line ending, falling back to the platform default.
 *
 * @param {string} input Markdown content to analyze.
 * @param {Object} [os] Node.js "os" module.
 * @returns {string} Preferred line ending.
 */
function getPreferredLineEnding(input, os) {
    let cr = 0;
    let lf = 0;
    let crlf = 0;
    const endings = input.match(newLineRe) || [];
    for (const ending of endings) {
        // eslint-disable-next-line default-case
        switch (ending) {
            case "\r":
                cr++;
                break;
            case "\n":
                lf++;
                break;
            case "\r\n":
                crlf++;
                break;
        }
    }
    let preferredLineEnding = null;
    if (!cr && !lf && !crlf) {
        preferredLineEnding = (os && os.EOL) || "\n";
    }
    else if ((lf >= crlf) && (lf >= cr)) {
        preferredLineEnding = "\n";
    }
    else if (crlf >= cr) {
        preferredLineEnding = "\r\n";
    }
    else {
        preferredLineEnding = "\r";
    }
    return preferredLineEnding;
}
module.exports.getPreferredLineEnding = getPreferredLineEnding;
/**
 * Normalizes the fields of a RuleOnErrorFixInfo instance.
 *
 * @param {Object} fixInfo RuleOnErrorFixInfo instance.
 * @param {number} [lineNumber] Line number.
 * @returns {Object} Normalized RuleOnErrorFixInfo instance.
 */
function normalizeFixInfo(fixInfo, lineNumber) {
    return {
        "lineNumber": fixInfo.lineNumber || lineNumber,
        "editColumn": fixInfo.editColumn || 1,
        "deleteCount": fixInfo.deleteCount || 0,
        "insertText": fixInfo.insertText || ""
    };
}
/**
 * Fixes the specified error on a line of Markdown content.
 *
 * @param {string} line Line of Markdown content.
 * @param {Object} fixInfo RuleOnErrorFixInfo instance.
 * @param {string} [lineEnding] Line ending to use.
 * @returns {string | null} Fixed content.
 */
function applyFix(line, fixInfo, lineEnding) {
    const { editColumn, deleteCount, insertText } = normalizeFixInfo(fixInfo);
    const editIndex = editColumn - 1;
    return (deleteCount === -1) ?
        null :
        line.slice(0, editIndex) +
            insertText.replace(/\n/g, lineEnding || "\n") +
            line.slice(editIndex + deleteCount);
}
module.exports.applyFix = applyFix;
/**
 * Applies as many fixes as possible to Markdown content.
 *
 * @param {string} input Lines of Markdown content.
 * @param {Object[]} errors RuleOnErrorInfo instances.
 * @returns {string} Corrected content.
 */
function applyFixes(input, errors) {
    const lineEnding = getPreferredLineEnding(input, __webpack_require__(/*! node:os */ "?0176"));
    const lines = input.split(newLineRe);
    // Normalize fixInfo objects
    let fixInfos = errors
        .filter((error) => error.fixInfo)
        .map((error) => normalizeFixInfo(error.fixInfo, error.lineNumber));
    // Sort bottom-to-top, line-deletes last, right-to-left, long-to-short
    fixInfos.sort((a, b) => {
        const aDeletingLine = (a.deleteCount === -1);
        const bDeletingLine = (b.deleteCount === -1);
        return ((b.lineNumber - a.lineNumber) ||
            (aDeletingLine ? 1 : (bDeletingLine ? -1 : 0)) ||
            (b.editColumn - a.editColumn) ||
            (b.insertText.length - a.insertText.length));
    });
    // Remove duplicate entries (needed for following collapse step)
    let lastFixInfo = {};
    fixInfos = fixInfos.filter((fixInfo) => {
        const unique = ((fixInfo.lineNumber !== lastFixInfo.lineNumber) ||
            (fixInfo.editColumn !== lastFixInfo.editColumn) ||
            (fixInfo.deleteCount !== lastFixInfo.deleteCount) ||
            (fixInfo.insertText !== lastFixInfo.insertText));
        lastFixInfo = fixInfo;
        return unique;
    });
    // Collapse insert/no-delete and no-insert/delete for same line/column
    lastFixInfo = {
        "lineNumber": -1
    };
    for (const fixInfo of fixInfos) {
        if ((fixInfo.lineNumber === lastFixInfo.lineNumber) &&
            (fixInfo.editColumn === lastFixInfo.editColumn) &&
            !fixInfo.insertText &&
            (fixInfo.deleteCount > 0) &&
            lastFixInfo.insertText &&
            !lastFixInfo.deleteCount) {
            fixInfo.insertText = lastFixInfo.insertText;
            lastFixInfo.lineNumber = 0;
        }
        lastFixInfo = fixInfo;
    }
    fixInfos = fixInfos.filter((fixInfo) => fixInfo.lineNumber);
    // Apply all (remaining/updated) fixes
    let lastLineIndex = -1;
    let lastEditIndex = -1;
    for (const fixInfo of fixInfos) {
        const { lineNumber, editColumn, deleteCount } = fixInfo;
        const lineIndex = lineNumber - 1;
        const editIndex = editColumn - 1;
        if ((lineIndex !== lastLineIndex) ||
            (deleteCount === -1) ||
            ((editIndex + deleteCount) <=
                (lastEditIndex - ((deleteCount > 0) ? 0 : 1)))) {
            // @ts-ignore
            lines[lineIndex] = applyFix(lines[lineIndex], fixInfo, lineEnding);
        }
        lastLineIndex = lineIndex;
        lastEditIndex = editIndex;
    }
    // Return corrected input
    return lines.filter((line) => line !== null).join(lineEnding);
}
module.exports.applyFixes = applyFixes;
/**
 * Gets the range and fixInfo values for reporting an error if the expected
 * text is found on the specified line.
 *
 * @param {string[]} lines Lines of Markdown content.
 * @param {number} lineIndex Line index to check.
 * @param {string} search Text to search for.
 * @param {string} replace Text to replace with.
 * @param {number} [instance] Instance on the line (1-based).
 * @returns {Object} Range and fixInfo wrapper.
 */
module.exports.getRangeAndFixInfoIfFound =
    (lines, lineIndex, search, replace, instance = 1) => {
        let range = null;
        let fixInfo = null;
        let searchIndex = -1;
        while (instance > 0) {
            searchIndex = lines[lineIndex].indexOf(search, searchIndex + 1);
            instance--;
        }
        if (searchIndex !== -1) {
            const column = searchIndex + 1;
            const length = search.length;
            range = [column, length];
            fixInfo = {
                "editColumn": column,
                "deleteCount": length,
                "insertText": replace
            };
        }
        return {
            range,
            fixInfo
        };
    };
/**
 * Gets the next (subsequent) child token if it is of the expected type.
 *
 * @param {Object} parentToken Parent token.
 * @param {Object} childToken Child token basis.
 * @param {string} nextType Token type of next token.
 * @param {string} nextNextType Token type of next-next token.
 * @returns {Object} Next token.
 */
function getNextChildToken(parentToken, childToken, nextType, nextNextType) {
    const { children } = parentToken;
    const index = children.indexOf(childToken);
    if ((index !== -1) &&
        (children.length > index + 2) &&
        (children[index + 1].type === nextType) &&
        (children[index + 2].type === nextNextType)) {
        return children[index + 1];
    }
    return null;
}
module.exports.getNextChildToken = getNextChildToken;
/**
 * Expands a path with a tilde to an absolute path.
 *
 * @param {string} file Path that may begin with a tilde.
 * @param {Object} os Node.js "os" module.
 * @returns {string} Absolute path (or original path).
 */
function expandTildePath(file, os) {
    const homedir = os && os.homedir && os.homedir();
    return homedir ? file.replace(/^~($|\/|\\)/, `${homedir}$1`) : file;
}
module.exports.expandTildePath = expandTildePath;
/**
 * RegExp.exec-style implementation of function expressions.
 *
 * @param {Function} funcExp Function that takes string and returns
 * [index, length] or null.
 * @param {string} input String to search.
 * @returns {string[] | null} RegExp.exec-style [match] with an index property.
 */
function funcExpExec(funcExp, input) {
    // Start or resume match
    // @ts-ignore
    const lastIndex = funcExp.lastIndex || 0;
    const result = funcExp(input.slice(lastIndex));
    if (result) {
        // Update lastIndex and return match
        const [subIndex, length] = result;
        const index = lastIndex + subIndex;
        // @ts-ignore
        funcExp.lastIndex = index + length;
        const match = [input.slice(index, index + length)];
        // @ts-ignore
        match.index = index;
        return match;
    }
    // Reset lastIndex and return no match
    // @ts-ignore
    funcExp.lastIndex = 0;
    return null;
}
module.exports.funcExpExec = funcExpExec;
const urlFeProtocolRe = /(?:http|ftp)s?:\/\//i;
const urlFeAutolinkTerminalsRe = / |$/;
const urlFeBareTerminalsRe = /[ ,!`'"\]]|$/;
const urlFeNonTerminalsRe = "-#/";
const urlFePunctuationRe = /\p{Punctuation}/u;
const urlFePrefixToPostfix = new Map([
    [" ", " "],
    ["`", "`"],
    ["'", "'"],
    ["\"", "\""],
    ["‘", "’"],
    ["“", "”"],
    ["«", "»"],
    ["*", "*"],
    ["_", "_"],
    ["(", ")"],
    ["[", "]"],
    ["{", "}"],
    ["<", ">"],
    [">", "<"]
]);
/**
 * Function expression that matches URLs.
 *
 * @param {string} input Substring to search for a URL.
 * @returns {Array | null} [index, length] of URL or null.
 */
function urlFe(input) {
    // Find start of URL by searching for protocol
    const match = input.match(urlFeProtocolRe);
    if (match) {
        // Look for matching pre/postfix characters (ex: <...>)
        const start = match.index || 0;
        const length = match[0].length;
        const prefix = input[start - 1] || " ";
        const postfix = urlFePrefixToPostfix.get(prefix);
        // @ts-ignore
        let endPostfix = input.indexOf(postfix, start + length);
        if (endPostfix === -1) {
            endPostfix = input.length;
        }
        // Look for characters that terminate a URL
        const terminalsRe = (prefix === "<") ? urlFeAutolinkTerminalsRe : urlFeBareTerminalsRe;
        const endTerminal = start + input.slice(start).search(terminalsRe);
        // Determine tentative end of URL
        let end = Math.min(endPostfix, endTerminal);
        if (prefix === " ") {
            // If the URL used " " as pre/postfix characters, trim the end
            if (input[end - 1] === ")") {
                // Trim any ")" beyond the last "(...)" pair
                const lastOpenParen = input.lastIndexOf("(", end - 2);
                if (lastOpenParen <= start) {
                    end--;
                }
                else {
                    const nextCloseParen = input.indexOf(")", lastOpenParen + 1);
                    end = nextCloseParen + 1;
                }
            }
            else {
                // Trim unwanted punctuation
                while (!urlFeNonTerminalsRe.includes(input[end - 1]) &&
                    urlFePunctuationRe.test(input[end - 1])) {
                    end--;
                }
            }
        }
        return [start, end - start];
    }
    // No match
    return null;
}
module.exports.urlFe = urlFe;


/***/ }),

/***/ "markdown-it":
/*!*****************************!*\
  !*** external "markdownit" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = markdownit;

/***/ }),

/***/ "?0176":
/*!*************************!*\
  !*** node:os (ignored) ***!
  \*************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?d0ee":
/*!*************************!*\
  !*** node:fs (ignored) ***!
  \*************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?e6c4":
/*!*************************!*\
  !*** node:os (ignored) ***!
  \*************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?9a52":
/*!***************************!*\
  !*** node:path (ignored) ***!
  \***************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?39e5":
/*!***************************!*\
  !*** node:util (ignored) ***!
  \***************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "../lib/cache.js":
/*!***********************!*\
  !*** ../lib/cache.js ***!
  \***********************/
/***/ ((module) => {

"use strict";
// @ts-check

const map = new Map();
module.exports.set = (keyValuePairs) => {
    for (const [key, value] of Object.entries(keyValuePairs)) {
        map.set(key, value);
    }
};
module.exports.clear = () => map.clear();
module.exports.codeBlockAndSpanRanges =
    () => map.get("codeBlockAndSpanRanges");
module.exports.flattenedLists =
    () => map.get("flattenedLists");
module.exports.htmlElementRanges =
    () => map.get("htmlElementRanges");
module.exports.lineMetadata =
    () => map.get("lineMetadata");
module.exports.referenceLinkImageData =
    () => map.get("referenceLinkImageData");


/***/ }),

/***/ "../lib/constants.js":
/*!***************************!*\
  !*** ../lib/constants.js ***!
  \***************************/
/***/ ((module) => {

"use strict";
// @ts-check

module.exports.deprecatedRuleNames = ["MD002", "MD006"];
module.exports.fixableRuleNames = [
    "MD004", "MD005", "MD006", "MD007", "MD009", "MD010",
    "MD011", "MD012", "MD014", "MD018", "MD019", "MD020",
    "MD021", "MD022", "MD023", "MD026", "MD027", "MD030",
    "MD031", "MD032", "MD034", "MD037", "MD038", "MD039",
    "MD044", "MD047", "MD049", "MD050", "MD051", "MD053"
];
module.exports.homepage = "https://github.com/DavidAnson/markdownlint";
module.exports.version = "0.27.0";


/***/ }),

/***/ "../lib/markdownlint.js":
/*!******************************!*\
  !*** ../lib/markdownlint.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const path = __webpack_require__(/*! node:path */ "?9a52");
const { promisify } = __webpack_require__(/*! node:util */ "?39e5");
const markdownIt = __webpack_require__(/*! markdown-it */ "markdown-it");
const { deprecatedRuleNames } = __webpack_require__(/*! ./constants */ "../lib/constants.js");
const rules = __webpack_require__(/*! ./rules */ "../lib/rules.js");
const helpers = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const cache = __webpack_require__(/*! ./cache */ "../lib/cache.js");
// @ts-ignore
// eslint-disable-next-line camelcase, max-len, no-inline-comments, no-undef
const dynamicRequire = (typeof require === "undefined") ? __webpack_require__("../lib sync recursive") : /* c8 ignore next */ require;
// Capture native require implementation for dynamic loading of modules
/**
 * Validate the list of rules for structure and reuse.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {boolean} synchronous Whether to execute synchronously.
 * @returns {Error | null} Error message if validation fails.
 */
function validateRuleList(ruleList, synchronous) {
    let result = null;
    if (ruleList.length === rules.length) {
        // No need to validate if only using built-in rules
        return result;
    }
    const allIds = {};
    for (const [index, rule] of ruleList.entries()) {
        const customIndex = index - rules.length;
        // eslint-disable-next-line no-inner-declarations, jsdoc/require-jsdoc
        function newError(property) {
            return new Error("Property '" + property + "' of custom rule at index " +
                customIndex + " is incorrect.");
        }
        for (const property of ["names", "tags"]) {
            const value = rule[property];
            if (!result &&
                (!value || !Array.isArray(value) || (value.length === 0) ||
                    !value.every(helpers.isString) || value.some(helpers.isEmptyString))) {
                result = newError(property);
            }
        }
        for (const propertyInfo of [
            ["description", "string"],
            ["function", "function"]
        ]) {
            const property = propertyInfo[0];
            const value = rule[property];
            if (!result && (!value || (typeof value !== propertyInfo[1]))) {
                result = newError(property);
            }
        }
        if (!result &&
            rule.information &&
            (Object.getPrototypeOf(rule.information) !== URL.prototype)) {
            result = newError("information");
        }
        if (!result &&
            (rule.asynchronous !== undefined) &&
            (typeof rule.asynchronous !== "boolean")) {
            result = newError("asynchronous");
        }
        if (!result && rule.asynchronous && synchronous) {
            result = new Error("Custom rule " + rule.names.join("/") + " at index " + customIndex +
                " is asynchronous and can not be used in a synchronous context.");
        }
        if (!result) {
            for (const name of rule.names) {
                const nameUpper = name.toUpperCase();
                if (!result && (allIds[nameUpper] !== undefined)) {
                    result = new Error("Name '" + name + "' of custom rule at index " +
                        customIndex + " is already used as a name or tag.");
                }
                allIds[nameUpper] = true;
            }
            for (const tag of rule.tags) {
                const tagUpper = tag.toUpperCase();
                if (!result && allIds[tagUpper]) {
                    result = new Error("Tag '" + tag + "' of custom rule at index " +
                        customIndex + " is already used as a name.");
                }
                allIds[tagUpper] = false;
            }
        }
    }
    return result;
}
/**
 * Creates a LintResults instance with toString for pretty display.
 *
 * @param {Rule[]} ruleList List of rules.
 * @returns {LintResults} New LintResults instance.
 */
function newResults(ruleList) {
    const lintResults = {};
    // eslint-disable-next-line jsdoc/require-jsdoc
    function toString(useAlias) {
        let ruleNameToRule = null;
        const results = [];
        const keys = Object.keys(lintResults);
        keys.sort();
        for (const file of keys) {
            const fileResults = lintResults[file];
            if (Array.isArray(fileResults)) {
                for (const result of fileResults) {
                    const ruleMoniker = result.ruleNames ?
                        result.ruleNames.join("/") :
                        (result.ruleName + "/" + result.ruleAlias);
                    results.push(file + ": " +
                        result.lineNumber + ": " +
                        ruleMoniker + " " +
                        result.ruleDescription +
                        (result.errorDetail ?
                            " [" + result.errorDetail + "]" :
                            "") +
                        (result.errorContext ?
                            " [Context: \"" + result.errorContext + "\"]" :
                            ""));
                }
            }
            else {
                if (!ruleNameToRule) {
                    ruleNameToRule = {};
                    for (const rule of ruleList) {
                        const ruleName = rule.names[0].toUpperCase();
                        ruleNameToRule[ruleName] = rule;
                    }
                }
                for (const [ruleName, ruleResults] of Object.entries(fileResults)) {
                    const rule = ruleNameToRule[ruleName.toUpperCase()];
                    for (const lineNumber of ruleResults) {
                        // @ts-ignore
                        const nameIndex = Math.min(useAlias ? 1 : 0, rule.names.length - 1);
                        const result = file + ": " +
                            lineNumber + ": " +
                            // @ts-ignore
                            rule.names[nameIndex] + " " +
                            // @ts-ignore
                            rule.description;
                        results.push(result);
                    }
                }
            }
        }
        return results.join("\n");
    }
    Object.defineProperty(lintResults, "toString", { "value": toString });
    // @ts-ignore
    return lintResults;
}
/**
 * Remove front matter (if present at beginning of content).
 *
 * @param {string} content Markdown content.
 * @param {RegExp} frontMatter Regular expression to match front matter.
 * @returns {Object} Trimmed content and front matter lines.
 */
function removeFrontMatter(content, frontMatter) {
    let frontMatterLines = [];
    if (frontMatter) {
        const frontMatterMatch = content.match(frontMatter);
        if (frontMatterMatch && !frontMatterMatch.index) {
            const contentMatched = frontMatterMatch[0];
            content = content.slice(contentMatched.length);
            frontMatterLines = contentMatched.split(helpers.newLineRe);
            if ((frontMatterLines.length > 0) &&
                (frontMatterLines[frontMatterLines.length - 1] === "")) {
                frontMatterLines.length--;
            }
        }
    }
    return {
        "content": content,
        "frontMatterLines": frontMatterLines
    };
}
/**
 * Freeze all freeze-able members of a token and its children.
 *
 * @param {MarkdownItToken} token A markdown-it token.
 * @returns {void}
 */
function freezeToken(token) {
    if (token.attrs) {
        for (const attr of token.attrs) {
            Object.freeze(attr);
        }
        Object.freeze(token.attrs);
    }
    if (token.children) {
        for (const child of token.children) {
            freezeToken(child);
        }
        Object.freeze(token.children);
    }
    if (token.map) {
        Object.freeze(token.map);
    }
    Object.freeze(token);
}
/**
 * Annotate tokens with line/lineNumber and freeze them.
 *
 * @param {MarkdownItToken[]} tokens Array of markdown-it tokens.
 * @param {string[]} lines Lines of Markdown content.
 * @returns {void}
 */
function annotateAndFreezeTokens(tokens, lines) {
    let trMap = null;
    for (const token of tokens) {
        // Provide missing maps for table content
        if (token.type === "tr_open") {
            trMap = token.map;
        }
        else if (token.type === "tr_close") {
            trMap = null;
        }
        if (!token.map && trMap) {
            token.map = [...trMap];
        }
        // Update token metadata
        if (token.map) {
            token.line = lines[token.map[0]];
            token.lineNumber = token.map[0] + 1;
            // Trim bottom of token to exclude whitespace lines
            while (token.map[1] && !((lines[token.map[1] - 1] || "").trim())) {
                token.map[1]--;
            }
        }
        // Annotate children with lineNumber
        if (token.children) {
            const codeSpanExtraLines = [];
            if (token.children.some((child) => child.type === "code_inline")) {
                helpers.forEachInlineCodeSpan(token.content, (code) => {
                    codeSpanExtraLines.push(code.split(helpers.newLineRe).length - 1);
                });
            }
            let lineNumber = token.lineNumber;
            for (const child of token.children) {
                child.lineNumber = lineNumber;
                child.line = lines[lineNumber - 1];
                if ((child.type === "softbreak") || (child.type === "hardbreak")) {
                    lineNumber++;
                }
                else if (child.type === "code_inline") {
                    lineNumber += codeSpanExtraLines.shift();
                }
            }
        }
        freezeToken(token);
    }
    Object.freeze(tokens);
}
/**
 * Map rule names/tags to canonical rule name.
 *
 * @param {Rule[]} ruleList List of rules.
 * @returns {Object.<string, string[]>} Map of alias to rule name.
 */
function mapAliasToRuleNames(ruleList) {
    const aliasToRuleNames = {};
    // const tagToRuleNames = {};
    for (const rule of ruleList) {
        const ruleName = rule.names[0].toUpperCase();
        // The following is useful for updating README.md:
        // console.log(
        //   "* **[" + ruleName + "](doc/Rules.md#" + ruleName.toLowerCase() +
        //    ")** *" + rule.names.slice(1).join("/") + "* - " + rule.description);
        for (const name of rule.names) {
            const nameUpper = name.toUpperCase();
            aliasToRuleNames[nameUpper] = [ruleName];
        }
        for (const tag of rule.tags) {
            const tagUpper = tag.toUpperCase();
            const ruleNames = aliasToRuleNames[tagUpper] || [];
            ruleNames.push(ruleName);
            aliasToRuleNames[tagUpper] = ruleNames;
            // tagToRuleNames[tag] = ruleName;
        }
    }
    // The following is useful for updating README.md:
    // Object.keys(tagToRuleNames).sort().forEach(function forTag(tag) {
    //   console.log("* **" + tag + "** - " +
    //     aliasToRuleNames[tag.toUpperCase()].join(", "));
    // });
    // @ts-ignore
    return aliasToRuleNames;
}
/**
 * Apply (and normalize) configuration object.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {Configuration} config Configuration object.
 * @param {Object.<string, string[]>} aliasToRuleNames Map of alias to rule
 * names.
 * @returns {Configuration} Effective configuration.
 */
function getEffectiveConfig(ruleList, config, aliasToRuleNames) {
    const defaultKey = Object.keys(config).filter((key) => key.toUpperCase() === "DEFAULT");
    const ruleDefault = (defaultKey.length === 0) || !!config[defaultKey[0]];
    const effectiveConfig = {};
    for (const rule of ruleList) {
        const ruleName = rule.names[0].toUpperCase();
        effectiveConfig[ruleName] = ruleDefault;
    }
    for (const ruleName of deprecatedRuleNames) {
        effectiveConfig[ruleName] = false;
    }
    for (const key of Object.keys(config)) {
        let value = config[key];
        if (value) {
            if (!(value instanceof Object)) {
                value = {};
            }
        }
        else {
            value = false;
        }
        const keyUpper = key.toUpperCase();
        for (const ruleName of (aliasToRuleNames[keyUpper] || [])) {
            effectiveConfig[ruleName] = value;
        }
    }
    return effectiveConfig;
}
/**
 * Parse the content of a configuration file.
 *
 * @param {string} name Name of the configuration file.
 * @param {string} content Configuration content.
 * @param {ConfigurationParser[] | null} [parsers] Parsing function(s).
 * @returns {Object} Configuration object and error message.
 */
function parseConfiguration(name, content, parsers) {
    let config = null;
    let message = "";
    const errors = [];
    let index = 0;
    // Try each parser
    (parsers || [JSON.parse]).every((parser) => {
        try {
            config = parser(content);
        }
        catch (error) {
            errors.push(`Parser ${index++}: ${error.message}`);
        }
        return !config;
    });
    // Message if unable to parse
    if (!config) {
        errors.unshift(`Unable to parse '${name}'`);
        message = errors.join("; ");
    }
    return {
        config,
        message
    };
}
/**
 * Create a mapping of enabled rules per line.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {string[]} lines List of content lines.
 * @param {string[]} frontMatterLines List of front matter lines.
 * @param {boolean} noInlineConfig Whether to allow inline configuration.
 * @param {Configuration} config Configuration object.
 * @param {ConfigurationParser[] | null} configParsers Configuration parsers.
 * @param {Object.<string, string[]>} aliasToRuleNames Map of alias to rule
 * names.
 * @returns {Object} Effective configuration and enabled rules per line number.
 */
function getEnabledRulesPerLineNumber(ruleList, lines, frontMatterLines, noInlineConfig, config, configParsers, aliasToRuleNames) {
    // Shared variables
    let enabledRules = {};
    let capturedRules = {};
    const allRuleNames = [];
    const enabledRulesPerLineNumber = new Array(1 + frontMatterLines.length);
    // Helper functions
    // eslint-disable-next-line jsdoc/require-jsdoc
    function handleInlineConfig(input, forEachMatch, forEachLine) {
        for (const [lineIndex, line] of input.entries()) {
            if (!noInlineConfig) {
                let match = null;
                while ((match = helpers.inlineCommentStartRe.exec(line))) {
                    const action = match[2].toUpperCase();
                    const startIndex = match.index + match[1].length;
                    const endIndex = line.indexOf("-->", startIndex);
                    if (endIndex === -1) {
                        break;
                    }
                    const parameter = line.slice(startIndex, endIndex);
                    forEachMatch(action, parameter, lineIndex + 1);
                }
            }
            if (forEachLine) {
                forEachLine();
            }
        }
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    function configureFile(action, parameter) {
        if (action === "CONFIGURE-FILE") {
            const { "config": parsed } = parseConfiguration("CONFIGURE-FILE", parameter, configParsers);
            if (parsed) {
                config = Object.assign(Object.assign({}, config), parsed);
            }
        }
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    function applyEnableDisable(action, parameter, state) {
        state = Object.assign({}, state);
        const enabled = (action.startsWith("ENABLE"));
        const trimmed = parameter && parameter.trim();
        const items = trimmed ? trimmed.toUpperCase().split(/\s+/) : allRuleNames;
        for (const nameUpper of items) {
            for (const ruleName of (aliasToRuleNames[nameUpper] || [])) {
                state[ruleName] = enabled;
            }
        }
        return state;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    function enableDisableFile(action, parameter) {
        if ((action === "ENABLE-FILE") || (action === "DISABLE-FILE")) {
            enabledRules = applyEnableDisable(action, parameter, enabledRules);
        }
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    function captureRestoreEnableDisable(action, parameter) {
        if (action === "CAPTURE") {
            capturedRules = enabledRules;
        }
        else if (action === "RESTORE") {
            enabledRules = capturedRules;
        }
        else if ((action === "ENABLE") || (action === "DISABLE")) {
            enabledRules = applyEnableDisable(action, parameter, enabledRules);
        }
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    function updateLineState() {
        enabledRulesPerLineNumber.push(enabledRules);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    function disableLineNextLine(action, parameter, lineNumber) {
        const disableLine = (action === "DISABLE-LINE");
        const disableNextLine = (action === "DISABLE-NEXT-LINE");
        if (disableLine || disableNextLine) {
            const nextLineNumber = frontMatterLines.length + lineNumber + (disableNextLine ? 1 : 0);
            enabledRulesPerLineNumber[nextLineNumber] =
                applyEnableDisable(action, parameter, enabledRulesPerLineNumber[nextLineNumber] || {});
        }
    }
    // Handle inline comments
    handleInlineConfig([lines.join("\n")], configureFile);
    const effectiveConfig = getEffectiveConfig(ruleList, config, aliasToRuleNames);
    for (const rule of ruleList) {
        const ruleName = rule.names[0].toUpperCase();
        allRuleNames.push(ruleName);
        enabledRules[ruleName] = !!effectiveConfig[ruleName];
    }
    capturedRules = enabledRules;
    handleInlineConfig(lines, enableDisableFile);
    handleInlineConfig(lines, captureRestoreEnableDisable, updateLineState);
    handleInlineConfig(lines, disableLineNextLine);
    // Return results
    return {
        effectiveConfig,
        enabledRulesPerLineNumber
    };
}
/**
 * Lints a string containing Markdown content.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {string} name Identifier for the content.
 * @param {string} content Markdown content.
 * @param {Object} md Instance of markdown-it.
 * @param {Configuration} config Configuration object.
 * @param {ConfigurationParser[] | null} configParsers Configuration parsers.
 * @param {RegExp} frontMatter Regular expression for front matter.
 * @param {boolean} handleRuleFailures Whether to handle exceptions in rules.
 * @param {boolean} noInlineConfig Whether to allow inline configuration.
 * @param {number} resultVersion Version of the LintResults object to return.
 * @param {Function} callback Callback (err, result) function.
 * @returns {void}
 */
function lintContent(ruleList, name, content, md, config, configParsers, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, callback) {
    // Remove UTF-8 byte order marker (if present)
    content = content.replace(/^\uFEFF/, "");
    // Remove front matter
    const removeFrontMatterResult = removeFrontMatter(content, frontMatter);
    const { frontMatterLines } = removeFrontMatterResult;
    content = removeFrontMatterResult.content;
    // Get enabled rules per line (with HTML comments present)
    const { effectiveConfig, enabledRulesPerLineNumber } = getEnabledRulesPerLineNumber(ruleList, content.split(helpers.newLineRe), frontMatterLines, noInlineConfig, config, configParsers, mapAliasToRuleNames(ruleList));
    // Hide the content of HTML comments from rules, etc.
    content = helpers.clearHtmlCommentText(content);
    // Parse content into tokens and lines
    const tokens = md.parse(content, {});
    const lines = content.split(helpers.newLineRe);
    annotateAndFreezeTokens(tokens, lines);
    // Create (frozen) parameters for rules
    const paramsBase = {
        name,
        tokens,
        "lines": Object.freeze(lines),
        "frontMatterLines": Object.freeze(frontMatterLines)
    };
    const lineMetadata = helpers.getLineMetadata(paramsBase);
    const codeBlockAndSpanRanges = helpers.codeBlockAndSpanRanges(paramsBase, lineMetadata);
    const flattenedLists = helpers.flattenLists(paramsBase.tokens);
    const htmlElementRanges = helpers.htmlElementRanges(paramsBase, lineMetadata);
    const referenceLinkImageData = helpers.getReferenceLinkImageData(lineMetadata);
    cache.set({
        codeBlockAndSpanRanges,
        flattenedLists,
        htmlElementRanges,
        lineMetadata,
        referenceLinkImageData
    });
    // Function to run for each rule
    let results = [];
    // eslint-disable-next-line jsdoc/require-jsdoc
    function forRule(rule) {
        // Configure rule
        const ruleName = rule.names[0].toUpperCase();
        const params = Object.assign(Object.assign({}, paramsBase), { "config": effectiveConfig[ruleName] });
        // eslint-disable-next-line jsdoc/require-jsdoc
        function throwError(property) {
            throw new Error("Property '" + property + "' of onError parameter is incorrect.");
        }
        // eslint-disable-next-line jsdoc/require-jsdoc
        function onError(errorInfo) {
            if (!errorInfo ||
                !helpers.isNumber(errorInfo.lineNumber) ||
                (errorInfo.lineNumber < 1) ||
                (errorInfo.lineNumber > lines.length)) {
                throwError("lineNumber");
            }
            const lineNumber = errorInfo.lineNumber + frontMatterLines.length;
            if (!enabledRulesPerLineNumber[lineNumber][ruleName]) {
                return;
            }
            if (errorInfo.detail &&
                !helpers.isString(errorInfo.detail)) {
                throwError("detail");
            }
            if (errorInfo.context &&
                !helpers.isString(errorInfo.context)) {
                throwError("context");
            }
            if (errorInfo.range &&
                (!Array.isArray(errorInfo.range) ||
                    (errorInfo.range.length !== 2) ||
                    !helpers.isNumber(errorInfo.range[0]) ||
                    (errorInfo.range[0] < 1) ||
                    !helpers.isNumber(errorInfo.range[1]) ||
                    (errorInfo.range[1] < 1) ||
                    ((errorInfo.range[0] + errorInfo.range[1] - 1) >
                        lines[errorInfo.lineNumber - 1].length))) {
                throwError("range");
            }
            const fixInfo = errorInfo.fixInfo;
            const cleanFixInfo = {};
            if (fixInfo) {
                if (!helpers.isObject(fixInfo)) {
                    throwError("fixInfo");
                }
                if (fixInfo.lineNumber !== undefined) {
                    if ((!helpers.isNumber(fixInfo.lineNumber) ||
                        (fixInfo.lineNumber < 1) ||
                        (fixInfo.lineNumber > lines.length))) {
                        throwError("fixInfo.lineNumber");
                    }
                    cleanFixInfo.lineNumber =
                        fixInfo.lineNumber + frontMatterLines.length;
                }
                const effectiveLineNumber = fixInfo.lineNumber || errorInfo.lineNumber;
                if (fixInfo.editColumn !== undefined) {
                    if ((!helpers.isNumber(fixInfo.editColumn) ||
                        (fixInfo.editColumn < 1) ||
                        (fixInfo.editColumn >
                            lines[effectiveLineNumber - 1].length + 1))) {
                        throwError("fixInfo.editColumn");
                    }
                    cleanFixInfo.editColumn = fixInfo.editColumn;
                }
                if (fixInfo.deleteCount !== undefined) {
                    if ((!helpers.isNumber(fixInfo.deleteCount) ||
                        (fixInfo.deleteCount < -1) ||
                        (fixInfo.deleteCount >
                            lines[effectiveLineNumber - 1].length))) {
                        throwError("fixInfo.deleteCount");
                    }
                    cleanFixInfo.deleteCount = fixInfo.deleteCount;
                }
                if (fixInfo.insertText !== undefined) {
                    if (!helpers.isString(fixInfo.insertText)) {
                        throwError("fixInfo.insertText");
                    }
                    cleanFixInfo.insertText = fixInfo.insertText;
                }
            }
            results.push({
                lineNumber,
                "ruleName": rule.names[0],
                "ruleNames": rule.names,
                "ruleDescription": rule.description,
                "ruleInformation": rule.information ? rule.information.href : null,
                "errorDetail": errorInfo.detail || null,
                "errorContext": errorInfo.context || null,
                "errorRange": errorInfo.range ? [...errorInfo.range] : null,
                "fixInfo": fixInfo ? cleanFixInfo : null
            });
        }
        // Call (possibly external) rule function to report errors
        const catchCallsOnError = (error) => onError({
            "lineNumber": 1,
            "detail": `This rule threw an exception: ${error.message || error}`
        });
        const invokeRuleFunction = () => rule.function(params, onError);
        if (rule.asynchronous) {
            // Asynchronous rule, ensure it returns a Promise
            const ruleFunctionPromise = Promise.resolve().then(invokeRuleFunction);
            return handleRuleFailures ?
                ruleFunctionPromise.catch(catchCallsOnError) :
                ruleFunctionPromise;
        }
        // Synchronous rule
        try {
            invokeRuleFunction();
        }
        catch (error) {
            if (handleRuleFailures) {
                catchCallsOnError(error);
            }
            else {
                throw error;
            }
        }
        return null;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    function formatResults() {
        // Sort results by rule name by line number
        results.sort((a, b) => (a.ruleName.localeCompare(b.ruleName) ||
            a.lineNumber - b.lineNumber));
        if (resultVersion < 3) {
            // Remove fixInfo and multiple errors for the same rule and line number
            const noPrevious = {
                "ruleName": null,
                "lineNumber": -1
            };
            results = results.filter((error, index, array) => {
                delete error.fixInfo;
                const previous = array[index - 1] || noPrevious;
                return ((error.ruleName !== previous.ruleName) ||
                    (error.lineNumber !== previous.lineNumber));
            });
        }
        if (resultVersion === 0) {
            // Return a dictionary of rule->[line numbers]
            const dictionary = {};
            for (const error of results) {
                const ruleLines = dictionary[error.ruleName] || [];
                ruleLines.push(error.lineNumber);
                dictionary[error.ruleName] = ruleLines;
            }
            // @ts-ignore
            results = dictionary;
        }
        else if (resultVersion === 1) {
            // Use ruleAlias instead of ruleNames
            for (const error of results) {
                error.ruleAlias = error.ruleNames[1] || error.ruleName;
                delete error.ruleNames;
            }
        }
        else {
            // resultVersion 2 or 3: Remove unwanted ruleName
            for (const error of results) {
                delete error.ruleName;
            }
        }
        return results;
    }
    // Run all rules
    const ruleListAsync = ruleList.filter((rule) => rule.asynchronous);
    const ruleListSync = ruleList.filter((rule) => !rule.asynchronous);
    const ruleListAsyncFirst = [
        ...ruleListAsync,
        ...ruleListSync
    ];
    const callbackSuccess = () => callback(null, formatResults());
    const callbackError = (error) => callback(error instanceof Error ? error : new Error(error));
    try {
        const ruleResults = ruleListAsyncFirst.map(forRule);
        if (ruleListAsync.length > 0) {
            Promise.all(ruleResults.slice(0, ruleListAsync.length))
                .then(callbackSuccess)
                .catch(callbackError);
        }
        else {
            callbackSuccess();
        }
    }
    catch (error) {
        callbackError(error);
    }
    finally {
        cache.clear();
    }
}
/**
 * Lints a file containing Markdown content.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {string} file Path of file to lint.
 * @param {Object} md Instance of markdown-it.
 * @param {Configuration} config Configuration object.
 * @param {ConfigurationParser[] | null} configParsers Configuration parsers.
 * @param {RegExp} frontMatter Regular expression for front matter.
 * @param {boolean} handleRuleFailures Whether to handle exceptions in rules.
 * @param {boolean} noInlineConfig Whether to allow inline configuration.
 * @param {number} resultVersion Version of the LintResults object to return.
 * @param {Object} fs File system implementation.
 * @param {boolean} synchronous Whether to execute synchronously.
 * @param {Function} callback Callback (err, result) function.
 * @returns {void}
 */
function lintFile(ruleList, file, md, config, configParsers, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, fs, synchronous, callback) {
    // eslint-disable-next-line jsdoc/require-jsdoc
    function lintContentWrapper(err, content) {
        if (err) {
            return callback(err);
        }
        return lintContent(ruleList, file, content, md, config, configParsers, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, callback);
    }
    // Make a/synchronous call to read file
    if (synchronous) {
        lintContentWrapper(null, fs.readFileSync(file, "utf8"));
    }
    else {
        fs.readFile(file, "utf8", lintContentWrapper);
    }
}
/**
 * Lint files and strings specified in the Options object.
 *
 * @param {Options} options Options object.
 * @param {boolean} synchronous Whether to execute synchronously.
 * @param {Function} callback Callback (err, result) function.
 * @returns {void}
 */
function lintInput(options, synchronous, callback) {
    // Normalize inputs
    options = options || {};
    callback = callback || function noop() { };
    // eslint-disable-next-line unicorn/prefer-spread
    const ruleList = rules.concat(options.customRules || []);
    const ruleErr = validateRuleList(ruleList, synchronous);
    if (ruleErr) {
        callback(ruleErr);
        return;
    }
    let files = [];
    if (Array.isArray(options.files)) {
        files = [...options.files];
    }
    else if (options.files) {
        files = [String(options.files)];
    }
    const strings = options.strings || {};
    const stringsKeys = Object.keys(strings);
    const config = options.config || { "default": true };
    const configParsers = options.configParsers || null;
    const frontMatter = (options.frontMatter === undefined) ?
        helpers.frontMatterRe : options.frontMatter;
    const handleRuleFailures = !!options.handleRuleFailures;
    const noInlineConfig = !!options.noInlineConfig;
    const resultVersion = (options.resultVersion === undefined) ?
        3 : options.resultVersion;
    const md = markdownIt({ "html": true });
    const markdownItPlugins = options.markdownItPlugins || [];
    for (const plugin of markdownItPlugins) {
        // @ts-ignore
        md.use(...plugin);
    }
    const fs = options.fs || __webpack_require__(/*! node:fs */ "?d0ee");
    const results = newResults(ruleList);
    let done = false;
    let concurrency = 0;
    // eslint-disable-next-line jsdoc/require-jsdoc
    function lintWorker() {
        let currentItem = null;
        // eslint-disable-next-line jsdoc/require-jsdoc
        function lintWorkerCallback(err, result) {
            concurrency--;
            if (err) {
                done = true;
                return callback(err);
            }
            results[currentItem] = result;
            if (!synchronous) {
                lintWorker();
            }
            return null;
        }
        if (done) {
            // Abort for error or nothing left to do
        }
        else if (files.length > 0) {
            // Lint next file
            concurrency++;
            currentItem = files.shift();
            lintFile(ruleList, currentItem, md, config, configParsers, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, fs, synchronous, lintWorkerCallback);
        }
        else if ((currentItem = stringsKeys.shift())) {
            // Lint next string
            concurrency++;
            lintContent(ruleList, currentItem, strings[currentItem] || "", md, config, configParsers, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, lintWorkerCallback);
        }
        else if (concurrency === 0) {
            // Finish
            done = true;
            return callback(null, results);
        }
        return null;
    }
    if (synchronous) {
        while (!done) {
            lintWorker();
        }
    }
    else {
        // Testing on a Raspberry Pi 4 Model B with an artificial 5ms file access
        // delay suggests that a concurrency factor of 8 can eliminate the impact
        // of that delay (i.e., total time is the same as with no delay).
        lintWorker();
        lintWorker();
        lintWorker();
        lintWorker();
        lintWorker();
        lintWorker();
        lintWorker();
        lintWorker();
    }
}
/**
 * Lint specified Markdown files.
 *
 * @param {Options} options Configuration options.
 * @param {LintCallback} callback Callback (err, result) function.
 * @returns {void}
 */
function markdownlint(options, callback) {
    return lintInput(options, false, callback);
}
const markdownlintPromisify = promisify && promisify(markdownlint);
/**
 * Lint specified Markdown files.
 *
 * @param {Options} options Configuration options.
 * @returns {Promise<LintResults>} Results object.
 */
function markdownlintPromise(options) {
    // @ts-ignore
    return markdownlintPromisify(options);
}
/**
 * Lint specified Markdown files synchronously.
 *
 * @param {Options} options Configuration options.
 * @returns {LintResults} Results object.
 */
function markdownlintSync(options) {
    let results = {};
    lintInput(options, true, function callback(error, res) {
        if (error) {
            throw error;
        }
        results = res;
    });
    // @ts-ignore
    return results;
}
/**
 * Resolve referenced "extends" path in a configuration file
 * using path.resolve() with require.resolve() as a fallback.
 *
 * @param {string} configFile Configuration file name.
 * @param {string} referenceId Referenced identifier to resolve.
 * @param {Object} fs File system implementation.
 * @param {ResolveConfigExtendsCallback} callback Callback (err, result)
 * function.
 * @returns {void}
 */
function resolveConfigExtends(configFile, referenceId, fs, callback) {
    const configFileDirname = path.dirname(configFile);
    const resolvedExtendsFile = path.resolve(configFileDirname, referenceId);
    fs.access(resolvedExtendsFile, (err) => {
        if (err) {
            // Not a file, try require.resolve
            try {
                return callback(null, dynamicRequire.resolve(referenceId, { "paths": [configFileDirname] }));
            }
            catch (_a) {
                // Unable to resolve, use resolvedExtendsFile
            }
        }
        return callback(null, resolvedExtendsFile);
    });
}
/**
 * Resolve referenced "extends" path in a configuration file
 * using path.resolve() with require.resolve() as a fallback.
 *
 * @param {string} configFile Configuration file name.
 * @param {string} referenceId Referenced identifier to resolve.
 * @param {Object} fs File system implementation.
 * @returns {string} Resolved path to file.
 */
function resolveConfigExtendsSync(configFile, referenceId, fs) {
    const configFileDirname = path.dirname(configFile);
    const resolvedExtendsFile = path.resolve(configFileDirname, referenceId);
    try {
        fs.accessSync(resolvedExtendsFile);
        return resolvedExtendsFile;
    }
    catch (_a) {
        // Not a file, try require.resolve
    }
    try {
        return dynamicRequire.resolve(referenceId, { "paths": [configFileDirname] });
    }
    catch (_b) {
        // Unable to resolve, return resolvedExtendsFile
    }
    return resolvedExtendsFile;
}
/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[] | ReadConfigCallback} parsers Parsing
 * function(s).
 * @param {Object} [fs] File system implementation.
 * @param {ReadConfigCallback} [callback] Callback (err, result) function.
 * @returns {void}
 */
function readConfig(file, parsers, fs, callback) {
    if (!callback) {
        if (fs) {
            callback = fs;
            fs = null;
        }
        else {
            // @ts-ignore
            callback = parsers;
            // @ts-ignore
            parsers = null;
        }
    }
    if (!fs) {
        fs = __webpack_require__(/*! node:fs */ "?d0ee");
    }
    // Read file
    const os = __webpack_require__(/*! node:os */ "?e6c4");
    file = helpers.expandTildePath(file, os);
    fs.readFile(file, "utf8", (err, content) => {
        if (err) {
            // @ts-ignore
            return callback(err);
        }
        // Try to parse file
        // @ts-ignore
        const { config, message } = parseConfiguration(file, content, parsers);
        if (!config) {
            // @ts-ignore
            return callback(new Error(message));
        }
        // Extend configuration
        const configExtends = config.extends;
        if (configExtends) {
            delete config.extends;
            return resolveConfigExtends(file, helpers.expandTildePath(configExtends, os), fs, (_, resolvedExtends) => readConfig(
            // @ts-ignore
            resolvedExtends, parsers, fs, (errr, extendsConfig) => {
                if (errr) {
                    // @ts-ignore
                    return callback(errr);
                }
                // @ts-ignore
                return callback(null, Object.assign(Object.assign({}, extendsConfig), config));
            }));
        }
        // @ts-ignore
        return callback(null, config);
    });
}
const readConfigPromisify = promisify && promisify(readConfig);
/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} [parsers] Parsing function(s).
 * @param {Object} [fs] File system implementation.
 * @returns {Promise<Configuration>} Configuration object.
 */
function readConfigPromise(file, parsers, fs) {
    // @ts-ignore
    return readConfigPromisify(file, parsers, fs);
}
/**
 * Read specified configuration file synchronously.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} [parsers] Parsing function(s).
 * @param {Object} [fs] File system implementation.
 * @returns {Configuration} Configuration object.
 * @throws An Error if processing fails.
 */
function readConfigSync(file, parsers, fs) {
    if (!fs) {
        fs = __webpack_require__(/*! node:fs */ "?d0ee");
    }
    // Read file
    const os = __webpack_require__(/*! node:os */ "?e6c4");
    file = helpers.expandTildePath(file, os);
    const content = fs.readFileSync(file, "utf8");
    // Try to parse file
    const { config, message } = parseConfiguration(file, content, parsers);
    if (!config) {
        throw new Error(message);
    }
    // Extend configuration
    const configExtends = config.extends;
    if (configExtends) {
        delete config.extends;
        const resolvedExtends = resolveConfigExtendsSync(file, helpers.expandTildePath(configExtends, os), fs);
        return Object.assign(Object.assign({}, readConfigSync(resolvedExtends, parsers, fs)), config);
    }
    return config;
}
/**
 * Gets the (semantic) version of the library.
 *
 * @returns {string} SemVer string.
 */
function getVersion() {
    return (__webpack_require__(/*! ./constants */ "../lib/constants.js").version);
}
// Export a/synchronous/Promise APIs
markdownlint.sync = markdownlintSync;
markdownlint.readConfig = readConfig;
markdownlint.readConfigSync = readConfigSync;
markdownlint.getVersion = getVersion;
markdownlint.promises = {
    "markdownlint": markdownlintPromise,
    "readConfig": readConfigPromise
};
module.exports = markdownlint;


/***/ }),

/***/ "../lib/md001.js":
/*!***********************!*\
  !*** ../lib/md001.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorDetailIf, filterTokens } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
module.exports = {
    "names": ["MD001", "heading-increment", "header-increment"],
    "description": "Heading levels should only increment by one level at a time",
    "tags": ["headings", "headers"],
    "function": function MD001(params, onError) {
        let prevLevel = 0;
        filterTokens(params, "heading_open", function forToken(token) {
            const level = Number.parseInt(token.tag.slice(1), 10);
            if (prevLevel && (level > prevLevel)) {
                addErrorDetailIf(onError, token.lineNumber, "h" + (prevLevel + 1), "h" + level);
            }
            prevLevel = level;
        });
    }
};


/***/ }),

/***/ "../lib/md002.js":
/*!***********************!*\
  !*** ../lib/md002.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorDetailIf } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
module.exports = {
    "names": ["MD002", "first-heading-h1", "first-header-h1"],
    "description": "First heading should be a top-level heading",
    "tags": ["headings", "headers"],
    "function": function MD002(params, onError) {
        const level = Number(params.config.level || 1);
        const tag = "h" + level;
        params.tokens.every(function forToken(token) {
            if (token.type === "heading_open") {
                addErrorDetailIf(onError, token.lineNumber, tag, token.tag);
                return false;
            }
            return true;
        });
    }
};


/***/ }),

/***/ "../lib/md003.js":
/*!***********************!*\
  !*** ../lib/md003.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorDetailIf, filterTokens, headingStyleFor } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
module.exports = {
    "names": ["MD003", "heading-style", "header-style"],
    "description": "Heading style",
    "tags": ["headings", "headers"],
    "function": function MD003(params, onError) {
        let style = String(params.config.style || "consistent");
        filterTokens(params, "heading_open", function forToken(token) {
            const styleForToken = headingStyleFor(token);
            if (style === "consistent") {
                style = styleForToken;
            }
            if (styleForToken !== style) {
                const h12 = /h[12]/.test(token.tag);
                const setextWithAtx = (style === "setext_with_atx") &&
                    ((h12 && (styleForToken === "setext")) ||
                        (!h12 && (styleForToken === "atx")));
                const setextWithAtxClosed = (style === "setext_with_atx_closed") &&
                    ((h12 && (styleForToken === "setext")) ||
                        (!h12 && (styleForToken === "atx_closed")));
                if (!setextWithAtx && !setextWithAtxClosed) {
                    let expected = style;
                    if (style === "setext_with_atx") {
                        expected = h12 ? "setext" : "atx";
                    }
                    else if (style === "setext_with_atx_closed") {
                        expected = h12 ? "setext" : "atx_closed";
                    }
                    addErrorDetailIf(onError, token.lineNumber, expected, styleForToken);
                }
            }
        });
    }
};


/***/ }),

/***/ "../lib/md004.js":
/*!***********************!*\
  !*** ../lib/md004.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorDetailIf, listItemMarkerRe, unorderedListStyleFor } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { flattenedLists } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
const expectedStyleToMarker = {
    "dash": "-",
    "plus": "+",
    "asterisk": "*"
};
const differentItemStyle = {
    "dash": "plus",
    "plus": "asterisk",
    "asterisk": "dash"
};
const validStyles = Object.keys(expectedStyleToMarker);
module.exports = {
    "names": ["MD004", "ul-style"],
    "description": "Unordered list style",
    "tags": ["bullet", "ul"],
    "function": function MD004(params, onError) {
        const style = String(params.config.style || "consistent");
        let expectedStyle = style;
        const nestingStyles = [];
        for (const list of flattenedLists()) {
            if (list.unordered) {
                if (expectedStyle === "consistent") {
                    expectedStyle = unorderedListStyleFor(list.items[0]);
                }
                for (const item of list.items) {
                    const itemStyle = unorderedListStyleFor(item);
                    if (style === "sublist") {
                        const nesting = list.nesting;
                        if (!nestingStyles[nesting]) {
                            nestingStyles[nesting] =
                                (itemStyle === nestingStyles[nesting - 1]) ?
                                    differentItemStyle[itemStyle] :
                                    itemStyle;
                        }
                        expectedStyle = nestingStyles[nesting];
                    }
                    if (!validStyles.includes(expectedStyle)) {
                        expectedStyle = validStyles[0];
                    }
                    let range = null;
                    let fixInfo = null;
                    const match = item.line.match(listItemMarkerRe);
                    if (match) {
                        const column = match.index + 1;
                        const length = match[0].length;
                        range = [column, length];
                        fixInfo = {
                            "editColumn": match[1].length + 1,
                            "deleteCount": 1,
                            "insertText": expectedStyleToMarker[expectedStyle]
                        };
                    }
                    addErrorDetailIf(onError, item.lineNumber, expectedStyle, itemStyle, null, null, range, fixInfo);
                }
            }
        }
    }
};


/***/ }),

/***/ "../lib/md005.js":
/*!***********************!*\
  !*** ../lib/md005.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addError, addErrorDetailIf, indentFor, listItemMarkerRe, orderedListItemMarkerRe, rangeFromRegExp } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { flattenedLists } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
module.exports = {
    "names": ["MD005", "list-indent"],
    "description": "Inconsistent indentation for list items at the same level",
    "tags": ["bullet", "ul", "indentation"],
    "function": function MD005(params, onError) {
        for (const list of flattenedLists()) {
            const expectedIndent = list.indent;
            let expectedEnd = 0;
            let actualEnd = -1;
            let endMatching = false;
            for (const item of list.items) {
                const { line, lineNumber } = item;
                const actualIndent = indentFor(item);
                let match = null;
                if (list.unordered) {
                    addErrorDetailIf(onError, lineNumber, expectedIndent, actualIndent, null, null, rangeFromRegExp(line, listItemMarkerRe)
                    // No fixInfo; MD007 handles this scenario better
                    );
                }
                else if ((match = orderedListItemMarkerRe.exec(line))) {
                    actualEnd = match[0].length;
                    expectedEnd = expectedEnd || actualEnd;
                    const markerLength = match[1].length + 1;
                    if ((expectedIndent !== actualIndent) || endMatching) {
                        if (expectedEnd === actualEnd) {
                            endMatching = true;
                        }
                        else {
                            const detail = endMatching ?
                                `Expected: (${expectedEnd}); Actual: (${actualEnd})` :
                                `Expected: ${expectedIndent}; Actual: ${actualIndent}`;
                            const expected = endMatching ?
                                expectedEnd - markerLength :
                                expectedIndent;
                            const actual = endMatching ?
                                actualEnd - markerLength :
                                actualIndent;
                            addError(onError, lineNumber, detail, null, rangeFromRegExp(line, listItemMarkerRe), {
                                "editColumn": Math.min(actual, expected) + 1,
                                "deleteCount": Math.max(actual - expected, 0),
                                "insertText": "".padEnd(Math.max(expected - actual, 0))
                            });
                        }
                    }
                }
            }
        }
    }
};


/***/ }),

/***/ "../lib/md006.js":
/*!***********************!*\
  !*** ../lib/md006.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorDetailIf, listItemMarkerRe, rangeFromRegExp } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { flattenedLists } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
module.exports = {
    "names": ["MD006", "ul-start-left"],
    "description": "Consider starting bulleted lists at the beginning of the line",
    "tags": ["bullet", "ul", "indentation"],
    "function": function MD006(params, onError) {
        for (const list of flattenedLists()) {
            if (list.unordered && !list.nesting && (list.indent !== 0)) {
                for (const item of list.items) {
                    const { lineNumber, line } = item;
                    addErrorDetailIf(onError, lineNumber, 0, list.indent, null, null, rangeFromRegExp(line, listItemMarkerRe), {
                        "deleteCount": line.length - line.trimStart().length
                    });
                }
            }
        }
    }
};


/***/ }),

/***/ "../lib/md007.js":
/*!***********************!*\
  !*** ../lib/md007.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorDetailIf, indentFor, listItemMarkerRe } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { flattenedLists } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
module.exports = {
    "names": ["MD007", "ul-indent"],
    "description": "Unordered list indentation",
    "tags": ["bullet", "ul", "indentation"],
    "function": function MD007(params, onError) {
        const indent = Number(params.config.indent || 2);
        const startIndented = !!params.config.start_indented;
        const startIndent = Number(params.config.start_indent || indent);
        for (const list of flattenedLists()) {
            if (list.unordered && list.parentsUnordered) {
                for (const item of list.items) {
                    const { lineNumber, line } = item;
                    const expectedIndent = (startIndented ? startIndent : 0) +
                        (list.nesting * indent);
                    const actualIndent = indentFor(item);
                    let range = null;
                    let editColumn = 1;
                    const match = line.match(listItemMarkerRe);
                    if (match) {
                        range = [1, match[0].length];
                        editColumn += match[1].length - actualIndent;
                    }
                    addErrorDetailIf(onError, lineNumber, expectedIndent, actualIndent, null, null, range, {
                        editColumn,
                        "deleteCount": actualIndent,
                        "insertText": "".padEnd(expectedIndent)
                    });
                }
            }
        }
    }
};


/***/ }),

/***/ "../lib/md009.js":
/*!***********************!*\
  !*** ../lib/md009.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addError, filterTokens, forEachLine, includesSorted, numericSortAscending } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { lineMetadata } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
module.exports = {
    "names": ["MD009", "no-trailing-spaces"],
    "description": "Trailing spaces",
    "tags": ["whitespace"],
    "function": function MD009(params, onError) {
        let brSpaces = params.config.br_spaces;
        brSpaces = Number((brSpaces === undefined) ? 2 : brSpaces);
        const listItemEmptyLines = !!params.config.list_item_empty_lines;
        const strict = !!params.config.strict;
        const listItemLineNumbers = [];
        if (listItemEmptyLines) {
            filterTokens(params, "list_item_open", (token) => {
                for (let i = token.map[0]; i < token.map[1]; i++) {
                    listItemLineNumbers.push(i + 1);
                }
            });
            listItemLineNumbers.sort(numericSortAscending);
        }
        const paragraphLineNumbers = [];
        const codeInlineLineNumbers = [];
        if (strict) {
            filterTokens(params, "paragraph_open", (token) => {
                for (let i = token.map[0]; i < token.map[1] - 1; i++) {
                    paragraphLineNumbers.push(i + 1);
                }
            });
            const addLineNumberRange = (start, end) => {
                for (let i = start; i < end; i++) {
                    codeInlineLineNumbers.push(i);
                }
            };
            filterTokens(params, "inline", (token) => {
                let start = 0;
                for (const child of token.children) {
                    if (start > 0) {
                        addLineNumberRange(start, child.lineNumber);
                        start = 0;
                    }
                    if (child.type === "code_inline") {
                        start = child.lineNumber;
                    }
                }
                if (start > 0) {
                    addLineNumberRange(start, token.map[1]);
                }
            });
        }
        const expected = (brSpaces < 2) ? 0 : brSpaces;
        forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
            const lineNumber = lineIndex + 1;
            const trailingSpaces = line.length - line.trimEnd().length;
            if (trailingSpaces &&
                !inCode &&
                !includesSorted(listItemLineNumbers, lineNumber) &&
                ((expected !== trailingSpaces) ||
                    (strict &&
                        (!includesSorted(paragraphLineNumbers, lineNumber) ||
                            includesSorted(codeInlineLineNumbers, lineNumber))))) {
                const column = line.length - trailingSpaces + 1;
                addError(onError, lineNumber, "Expected: " + (expected === 0 ? "" : "0 or ") +
                    expected + "; Actual: " + trailingSpaces, undefined, [column, trailingSpaces], {
                    "editColumn": column,
                    "deleteCount": trailingSpaces
                });
            }
        });
    }
};


/***/ }),

/***/ "../lib/md010.js":
/*!***********************!*\
  !*** ../lib/md010.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addError, filterTokens, forEachLine, withinAnyRange } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { codeBlockAndSpanRanges, lineMetadata } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
const tabRe = /\t+/g;
module.exports = {
    "names": ["MD010", "no-hard-tabs"],
    "description": "Hard tabs",
    "tags": ["whitespace", "hard_tab"],
    "function": function MD010(params, onError) {
        const codeBlocks = params.config.code_blocks;
        const includeCode = (codeBlocks === undefined) ? true : !!codeBlocks;
        const ignoreCodeLanguages = new Set((params.config.ignore_code_languages || [])
            .map((language) => language.toLowerCase()));
        const spacesPerTab = params.config.spaces_per_tab;
        const spaceMultiplier = (spacesPerTab === undefined) ?
            1 :
            Math.max(0, Number(spacesPerTab));
        const exclusions = includeCode ? [] : codeBlockAndSpanRanges();
        filterTokens(params, "fence", (token) => {
            const language = token.info.trim().toLowerCase();
            if (ignoreCodeLanguages.has(language)) {
                for (let i = token.map[0] + 1; i < token.map[1] - 1; i++) {
                    exclusions.push([i, 0, params.lines[i].length]);
                }
            }
        });
        forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
            if (includeCode || !inCode) {
                let match = null;
                while ((match = tabRe.exec(line)) !== null) {
                    const { index } = match;
                    const column = index + 1;
                    const length = match[0].length;
                    if (!withinAnyRange(exclusions, lineIndex, index, length)) {
                        addError(onError, lineIndex + 1, "Column: " + column, null, [column, length], {
                            "editColumn": column,
                            "deleteCount": length,
                            "insertText": "".padEnd(length * spaceMultiplier)
                        });
                    }
                }
            }
        });
    }
};


/***/ }),

/***/ "../lib/md011.js":
/*!***********************!*\
  !*** ../lib/md011.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addError, forEachLine, withinAnyRange } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { codeBlockAndSpanRanges, lineMetadata } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
const reversedLinkRe = /(^|[^\\])\(([^()]+)\)\[([^\]^][^\]]*)\](?!\()/g;
module.exports = {
    "names": ["MD011", "no-reversed-links"],
    "description": "Reversed link syntax",
    "tags": ["links"],
    "function": function MD011(params, onError) {
        const exclusions = codeBlockAndSpanRanges();
        forEachLine(lineMetadata(), (line, lineIndex, inCode, onFence) => {
            if (!inCode && !onFence) {
                let match = null;
                while ((match = reversedLinkRe.exec(line)) !== null) {
                    const [reversedLink, preChar, linkText, linkDestination] = match;
                    const index = match.index + preChar.length;
                    const length = match[0].length - preChar.length;
                    if (!linkText.endsWith("\\") &&
                        !linkDestination.endsWith("\\") &&
                        !withinAnyRange(exclusions, lineIndex, index, length)) {
                        addError(onError, lineIndex + 1, reversedLink.slice(preChar.length), undefined, [index + 1, length], {
                            "editColumn": index + 1,
                            "deleteCount": length,
                            "insertText": `[${linkText}](${linkDestination})`
                        });
                    }
                }
            }
        });
    }
};


/***/ }),

/***/ "../lib/md012.js":
/*!***********************!*\
  !*** ../lib/md012.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorDetailIf, forEachLine } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { lineMetadata } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
module.exports = {
    "names": ["MD012", "no-multiple-blanks"],
    "description": "Multiple consecutive blank lines",
    "tags": ["whitespace", "blank_lines"],
    "function": function MD012(params, onError) {
        const maximum = Number(params.config.maximum || 1);
        let count = 0;
        forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
            count = (inCode || (line.trim().length > 0)) ? 0 : count + 1;
            if (maximum < count) {
                addErrorDetailIf(onError, lineIndex + 1, maximum, count, null, null, null, {
                    "deleteCount": -1
                });
            }
        });
    }
};


/***/ }),

/***/ "../lib/md013.js":
/*!***********************!*\
  !*** ../lib/md013.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorDetailIf, filterTokens, forEachHeading, forEachLine, includesSorted } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { lineMetadata, referenceLinkImageData } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
const longLineRePrefix = "^.{";
const longLineRePostfixRelaxed = "}.*\\s.*$";
const longLineRePostfixStrict = "}.+$";
const linkOrImageOnlyLineRe = /^[es]*(?:lT?L|I)[ES]*$/;
const sternModeRe = /^(?:[#>\s]*\s)?\S*$/;
const tokenTypeMap = {
    "em_open": "e",
    "em_close": "E",
    "image": "I",
    "link_open": "l",
    "link_close": "L",
    "strong_open": "s",
    "strong_close": "S",
    "text": "T"
};
module.exports = {
    "names": ["MD013", "line-length"],
    "description": "Line length",
    "tags": ["line_length"],
    "function": function MD013(params, onError) {
        const lineLength = Number(params.config.line_length || 80);
        const headingLineLength = Number(params.config.heading_line_length || lineLength);
        const codeLineLength = Number(params.config.code_block_line_length || lineLength);
        const strict = !!params.config.strict;
        const stern = !!params.config.stern;
        const longLineRePostfix = (strict || stern) ? longLineRePostfixStrict : longLineRePostfixRelaxed;
        const longLineRe = new RegExp(longLineRePrefix + lineLength + longLineRePostfix);
        const longHeadingLineRe = new RegExp(longLineRePrefix + headingLineLength + longLineRePostfix);
        const longCodeLineRe = new RegExp(longLineRePrefix + codeLineLength + longLineRePostfix);
        const codeBlocks = params.config.code_blocks;
        const includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
        const tables = params.config.tables;
        const includeTables = (tables === undefined) ? true : !!tables;
        let headings = params.config.headings;
        if (headings === undefined) {
            headings = params.config.headers;
        }
        const includeHeadings = (headings === undefined) ? true : !!headings;
        const headingLineNumbers = [];
        forEachHeading(params, (heading) => {
            headingLineNumbers.push(heading.lineNumber);
        });
        const linkOnlyLineNumbers = [];
        filterTokens(params, "inline", (token) => {
            let childTokenTypes = "";
            for (const child of token.children) {
                if (child.type !== "text" || child.content !== "") {
                    childTokenTypes += tokenTypeMap[child.type] || "x";
                }
            }
            if (linkOrImageOnlyLineRe.test(childTokenTypes)) {
                linkOnlyLineNumbers.push(token.lineNumber);
            }
        });
        const { definitionLineIndices } = referenceLinkImageData();
        forEachLine(lineMetadata(), (line, lineIndex, inCode, onFence, inTable) => {
            const lineNumber = lineIndex + 1;
            const isHeading = includesSorted(headingLineNumbers, lineNumber);
            const length = inCode ?
                codeLineLength :
                (isHeading ? headingLineLength : lineLength);
            const lengthRe = inCode ?
                longCodeLineRe :
                (isHeading ? longHeadingLineRe : longLineRe);
            if ((includeCodeBlocks || !inCode) &&
                (includeTables || !inTable) &&
                (includeHeadings || !isHeading) &&
                !includesSorted(definitionLineIndices, lineIndex) &&
                (strict ||
                    (!(stern && sternModeRe.test(line)) &&
                        !includesSorted(linkOnlyLineNumbers, lineNumber))) &&
                lengthRe.test(line)) {
                addErrorDetailIf(onError, lineNumber, length, line.length, null, null, [length + 1, line.length - length]);
            }
        });
    }
};


/***/ }),

/***/ "../lib/md014.js":
/*!***********************!*\
  !*** ../lib/md014.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorContext, filterTokens } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const dollarCommandRe = /^(\s*)(\$\s+)/;
module.exports = {
    "names": ["MD014", "commands-show-output"],
    "description": "Dollar signs used before commands without showing output",
    "tags": ["code"],
    "function": function MD014(params, onError) {
        for (const type of ["code_block", "fence"]) {
            filterTokens(params, type, (token) => {
                const margin = (token.type === "fence") ? 1 : 0;
                const dollarInstances = [];
                let allDollars = true;
                for (let i = token.map[0] + margin; i < token.map[1] - margin; i++) {
                    const line = params.lines[i];
                    const lineTrim = line.trim();
                    if (lineTrim) {
                        const match = dollarCommandRe.exec(line);
                        if (match) {
                            const column = match[1].length + 1;
                            const length = match[2].length;
                            dollarInstances.push([i, lineTrim, column, length]);
                        }
                        else {
                            allDollars = false;
                        }
                    }
                }
                if (allDollars) {
                    for (const instance of dollarInstances) {
                        const [i, lineTrim, column, length] = instance;
                        addErrorContext(onError, i + 1, lineTrim, null, null, [column, length], {
                            "editColumn": column,
                            "deleteCount": length
                        });
                    }
                }
            });
        }
    }
};


/***/ }),

/***/ "../lib/md018.js":
/*!***********************!*\
  !*** ../lib/md018.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorContext, forEachLine } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { lineMetadata } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
module.exports = {
    "names": ["MD018", "no-missing-space-atx"],
    "description": "No space after hash on atx style heading",
    "tags": ["headings", "headers", "atx", "spaces"],
    "function": function MD018(params, onError) {
        forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
            if (!inCode &&
                /^#+[^# \t]/.test(line) &&
                !/#\s*$/.test(line) &&
                !line.startsWith("#️⃣")) {
                const hashCount = /^#+/.exec(line)[0].length;
                addErrorContext(onError, lineIndex + 1, line.trim(), null, null, [1, hashCount + 1], {
                    "editColumn": hashCount + 1,
                    "insertText": " "
                });
            }
        });
    }
};


/***/ }),

/***/ "../lib/md019.js":
/*!***********************!*\
  !*** ../lib/md019.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorContext, filterTokens, headingStyleFor } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
module.exports = {
    "names": ["MD019", "no-multiple-space-atx"],
    "description": "Multiple spaces after hash on atx style heading",
    "tags": ["headings", "headers", "atx", "spaces"],
    "function": function MD019(params, onError) {
        filterTokens(params, "heading_open", (token) => {
            if (headingStyleFor(token) === "atx") {
                const { line, lineNumber } = token;
                const match = /^(#+)([ \t]{2,})\S/.exec(line);
                if (match) {
                    const [, { "length": hashLength }, { "length": spacesLength }] = match;
                    addErrorContext(onError, lineNumber, line.trim(), null, null, [1, hashLength + spacesLength + 1], {
                        "editColumn": hashLength + 1,
                        "deleteCount": spacesLength - 1
                    });
                }
            }
        });
    }
};


/***/ }),

/***/ "../lib/md020.js":
/*!***********************!*\
  !*** ../lib/md020.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorContext, forEachLine } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { lineMetadata } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
module.exports = {
    "names": ["MD020", "no-missing-space-closed-atx"],
    "description": "No space inside hashes on closed atx style heading",
    "tags": ["headings", "headers", "atx_closed", "spaces"],
    "function": function MD020(params, onError) {
        forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
            if (!inCode) {
                const match = /^(#+)([ \t]*)([^#]*?[^#\\])([ \t]*)((?:\\#)?)(#+)(\s*)$/.exec(line);
                if (match) {
                    const [, leftHash, { "length": leftSpaceLength }, content, { "length": rightSpaceLength }, rightEscape, rightHash, { "length": trailSpaceLength }] = match;
                    const leftHashLength = leftHash.length;
                    const rightHashLength = rightHash.length;
                    const left = !leftSpaceLength;
                    const right = !rightSpaceLength || rightEscape;
                    const rightEscapeReplacement = rightEscape ? `${rightEscape} ` : "";
                    if (left || right) {
                        const range = left ?
                            [
                                1,
                                leftHashLength + 1
                            ] :
                            [
                                line.length - trailSpaceLength - rightHashLength,
                                rightHashLength + 1
                            ];
                        addErrorContext(onError, lineIndex + 1, line.trim(), left, right, range, {
                            "editColumn": 1,
                            "deleteCount": line.length,
                            "insertText": `${leftHash} ${content} ${rightEscapeReplacement}${rightHash}`
                        });
                    }
                }
            }
        });
    }
};


/***/ }),

/***/ "../lib/md021.js":
/*!***********************!*\
  !*** ../lib/md021.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorContext, filterTokens, headingStyleFor } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const closedAtxRe = /^(#+)([ \t]+)([^ \t]|[^ \t].*[^ \t])([ \t]+)(#+)(\s*)$/;
module.exports = {
    "names": ["MD021", "no-multiple-space-closed-atx"],
    "description": "Multiple spaces inside hashes on closed atx style heading",
    "tags": ["headings", "headers", "atx_closed", "spaces"],
    "function": function MD021(params, onError) {
        filterTokens(params, "heading_open", (token) => {
            if (headingStyleFor(token) === "atx_closed") {
                const { line, lineNumber } = token;
                const match = closedAtxRe.exec(line);
                if (match) {
                    const [, leftHash, { "length": leftSpaceLength }, content, { "length": rightSpaceLength }, rightHash, { "length": trailSpaceLength }] = match;
                    const left = leftSpaceLength > 1;
                    const right = rightSpaceLength > 1;
                    if (left || right) {
                        const length = line.length;
                        const leftHashLength = leftHash.length;
                        const rightHashLength = rightHash.length;
                        const range = left ?
                            [
                                1,
                                leftHashLength + leftSpaceLength + 1
                            ] :
                            [
                                length - trailSpaceLength - rightHashLength - rightSpaceLength,
                                rightSpaceLength + rightHashLength + 1
                            ];
                        addErrorContext(onError, lineNumber, line.trim(), left, right, range, {
                            "editColumn": 1,
                            "deleteCount": length,
                            "insertText": `${leftHash} ${content} ${rightHash}`
                        });
                    }
                }
            }
        });
    }
};


/***/ }),

/***/ "../lib/md022.js":
/*!***********************!*\
  !*** ../lib/md022.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorDetailIf, blockquotePrefixRe, filterTokens, isBlankLine } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const getBlockQuote = (str, count) => ((str || "")
    .match(blockquotePrefixRe)[0]
    .trimEnd()
    // eslint-disable-next-line unicorn/prefer-spread
    .concat("\n")
    .repeat(count));
module.exports = {
    "names": ["MD022", "blanks-around-headings", "blanks-around-headers"],
    "description": "Headings should be surrounded by blank lines",
    "tags": ["headings", "headers", "blank_lines"],
    "function": function MD022(params, onError) {
        let linesAbove = params.config.lines_above;
        linesAbove = Number((linesAbove === undefined) ? 1 : linesAbove);
        let linesBelow = params.config.lines_below;
        linesBelow = Number((linesBelow === undefined) ? 1 : linesBelow);
        const { lines } = params;
        filterTokens(params, "heading_open", (token) => {
            const [topIndex, nextIndex] = token.map;
            let actualAbove = 0;
            for (let i = 0; i < linesAbove; i++) {
                if (isBlankLine(lines[topIndex - i - 1])) {
                    actualAbove++;
                }
            }
            addErrorDetailIf(onError, topIndex + 1, linesAbove, actualAbove, "Above", lines[topIndex].trim(), null, {
                "insertText": getBlockQuote(lines[topIndex - 1], linesAbove - actualAbove)
            });
            let actualBelow = 0;
            for (let i = 0; i < linesBelow; i++) {
                if (isBlankLine(lines[nextIndex + i])) {
                    actualBelow++;
                }
            }
            addErrorDetailIf(onError, topIndex + 1, linesBelow, actualBelow, "Below", lines[topIndex].trim(), null, {
                "lineNumber": nextIndex + 1,
                "insertText": getBlockQuote(lines[nextIndex], linesBelow - actualBelow)
            });
        });
    }
};


/***/ }),

/***/ "../lib/md023.js":
/*!***********************!*\
  !*** ../lib/md023.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorContext, filterTokens } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const spaceBeforeHeadingRe = /^(\s+|[>\s]+\s\s)[^>\s]/;
module.exports = {
    "names": ["MD023", "heading-start-left", "header-start-left"],
    "description": "Headings must start at the beginning of the line",
    "tags": ["headings", "headers", "spaces"],
    "function": function MD023(params, onError) {
        filterTokens(params, "heading_open", function forToken(token) {
            const { lineNumber, line } = token;
            const match = line.match(spaceBeforeHeadingRe);
            if (match) {
                const [prefixAndFirstChar, prefix] = match;
                let deleteCount = prefix.length;
                const prefixLengthNoSpace = prefix.trimEnd().length;
                if (prefixLengthNoSpace) {
                    deleteCount -= prefixLengthNoSpace - 1;
                }
                addErrorContext(onError, lineNumber, line, null, null, [1, prefixAndFirstChar.length], {
                    "editColumn": prefixLengthNoSpace + 1,
                    "deleteCount": deleteCount
                });
            }
        });
    }
};


/***/ }),

/***/ "../lib/md024.js":
/*!***********************!*\
  !*** ../lib/md024.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorContext, forEachHeading } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
module.exports = {
    "names": ["MD024", "no-duplicate-heading", "no-duplicate-header"],
    "description": "Multiple headings with the same content",
    "tags": ["headings", "headers"],
    "function": function MD024(params, onError) {
        const siblingsOnly = !!params.config.siblings_only ||
            !!params.config.allow_different_nesting || false;
        const knownContents = [null, []];
        let lastLevel = 1;
        let knownContent = knownContents[lastLevel];
        forEachHeading(params, (heading, content) => {
            if (siblingsOnly) {
                const newLevel = heading.tag.slice(1);
                while (lastLevel < newLevel) {
                    lastLevel++;
                    knownContents[lastLevel] = [];
                }
                while (lastLevel > newLevel) {
                    knownContents[lastLevel] = [];
                    lastLevel--;
                }
                knownContent = knownContents[newLevel];
            }
            if (knownContent.includes(content)) {
                addErrorContext(onError, heading.lineNumber, heading.line.trim());
            }
            else {
                knownContent.push(content);
            }
        });
    }
};


/***/ }),

/***/ "../lib/md025.js":
/*!***********************!*\
  !*** ../lib/md025.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorContext, filterTokens, frontMatterHasTitle } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
module.exports = {
    "names": ["MD025", "single-title", "single-h1"],
    "description": "Multiple top-level headings in the same document",
    "tags": ["headings", "headers"],
    "function": function MD025(params, onError) {
        const level = Number(params.config.level || 1);
        const tag = "h" + level;
        const foundFrontMatterTitle = frontMatterHasTitle(params.frontMatterLines, params.config.front_matter_title);
        let hasTopLevelHeading = false;
        filterTokens(params, "heading_open", function forToken(token) {
            if (token.tag === tag) {
                if (hasTopLevelHeading || foundFrontMatterTitle) {
                    addErrorContext(onError, token.lineNumber, token.line.trim());
                }
                else if (token.lineNumber === 1) {
                    hasTopLevelHeading = true;
                }
            }
        });
    }
};


/***/ }),

/***/ "../lib/md026.js":
/*!***********************!*\
  !*** ../lib/md026.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addError, allPunctuationNoQuestion, escapeForRegExp, forEachHeading } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const endOfLineHtmlEntityRe = /&#?[\da-zA-Z]+;$/;
module.exports = {
    "names": ["MD026", "no-trailing-punctuation"],
    "description": "Trailing punctuation in heading",
    "tags": ["headings", "headers"],
    "function": function MD026(params, onError) {
        let punctuation = params.config.punctuation;
        punctuation = String((punctuation === undefined) ? allPunctuationNoQuestion : punctuation);
        const trailingPunctuationRe = new RegExp("\\s*[" + escapeForRegExp(punctuation) + "]+$");
        forEachHeading(params, (heading) => {
            const { line, lineNumber } = heading;
            const trimmedLine = line.replace(/([^\s#])[\s#]+$/, "$1");
            const match = trailingPunctuationRe.exec(trimmedLine);
            if (match && !endOfLineHtmlEntityRe.test(trimmedLine)) {
                const fullMatch = match[0];
                const column = match.index + 1;
                const length = fullMatch.length;
                addError(onError, lineNumber, `Punctuation: '${fullMatch}'`, null, [column, length], {
                    "editColumn": column,
                    "deleteCount": length
                });
            }
        });
    }
};


/***/ }),

/***/ "../lib/md027.js":
/*!***********************!*\
  !*** ../lib/md027.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorContext, newLineRe } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const spaceAfterBlockQuoteRe = /^((?:\s*>)+)(\s{2,})\S/;
module.exports = {
    "names": ["MD027", "no-multiple-space-blockquote"],
    "description": "Multiple spaces after blockquote symbol",
    "tags": ["blockquote", "whitespace", "indentation"],
    "function": function MD027(params, onError) {
        let blockquoteNesting = 0;
        let listItemNesting = 0;
        for (const token of params.tokens) {
            const { content, lineNumber, type } = token;
            if (type === "blockquote_open") {
                blockquoteNesting++;
            }
            else if (type === "blockquote_close") {
                blockquoteNesting--;
            }
            else if (type === "list_item_open") {
                listItemNesting++;
            }
            else if (type === "list_item_close") {
                listItemNesting--;
            }
            else if ((type === "inline") && blockquoteNesting) {
                const lineCount = content.split(newLineRe).length;
                for (let i = 0; i < lineCount; i++) {
                    const line = params.lines[lineNumber + i - 1];
                    const match = line.match(spaceAfterBlockQuoteRe);
                    if (match) {
                        const [fullMatch, { "length": blockquoteLength }, { "length": spaceLength }] = match;
                        if (!listItemNesting || (fullMatch[fullMatch.length - 1] === ">")) {
                            addErrorContext(onError, lineNumber + i, line, null, null, [1, fullMatch.length], {
                                "editColumn": blockquoteLength + 1,
                                "deleteCount": spaceLength - 1
                            });
                        }
                    }
                }
            }
        }
    }
};


/***/ }),

/***/ "../lib/md028.js":
/*!***********************!*\
  !*** ../lib/md028.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addError } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
module.exports = {
    "names": ["MD028", "no-blanks-blockquote"],
    "description": "Blank line inside blockquote",
    "tags": ["blockquote", "whitespace"],
    "function": function MD028(params, onError) {
        let prevToken = {};
        let prevLineNumber = null;
        for (const token of params.tokens) {
            if ((token.type === "blockquote_open") &&
                (prevToken.type === "blockquote_close")) {
                for (let lineNumber = prevLineNumber; lineNumber < token.lineNumber; lineNumber++) {
                    addError(onError, lineNumber);
                }
            }
            prevToken = token;
            if (token.type === "blockquote_open") {
                prevLineNumber = token.map[1] + 1;
            }
        }
    }
};


/***/ }),

/***/ "../lib/md029.js":
/*!***********************!*\
  !*** ../lib/md029.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorDetailIf, listItemMarkerRe, orderedListItemMarkerRe, rangeFromRegExp } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { flattenedLists } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
const listStyleExamples = {
    "one": "1/1/1",
    "ordered": "1/2/3",
    "zero": "0/0/0"
};
module.exports = {
    "names": ["MD029", "ol-prefix"],
    "description": "Ordered list item prefix",
    "tags": ["ol"],
    "function": function MD029(params, onError) {
        const style = String(params.config.style || "one_or_ordered");
        const filteredLists = flattenedLists().filter((list) => !list.unordered);
        for (const list of filteredLists) {
            const { items } = list;
            let current = 1;
            let incrementing = false;
            // Check for incrementing number pattern 1/2/3 or 0/1/2
            if (items.length >= 2) {
                const first = orderedListItemMarkerRe.exec(items[0].line);
                const second = orderedListItemMarkerRe.exec(items[1].line);
                if (first && second) {
                    const [, firstNumber] = first;
                    const [, secondNumber] = second;
                    if ((secondNumber !== "1") || (firstNumber === "0")) {
                        incrementing = true;
                        if (firstNumber === "0") {
                            current = 0;
                        }
                    }
                }
            }
            // Determine effective style
            let listStyle = style;
            if (listStyle === "one_or_ordered") {
                listStyle = incrementing ? "ordered" : "one";
            }
            // Force expected value for 0/0/0 and 1/1/1 patterns
            if (listStyle === "zero") {
                current = 0;
            }
            else if (listStyle === "one") {
                current = 1;
            }
            // Validate each list item marker
            for (const item of items) {
                const match = orderedListItemMarkerRe.exec(item.line);
                if (match) {
                    addErrorDetailIf(onError, item.lineNumber, String(current), match[1], "Style: " + listStyleExamples[listStyle], null, rangeFromRegExp(item.line, listItemMarkerRe));
                    if (listStyle === "ordered") {
                        current++;
                    }
                }
            }
        }
    }
};


/***/ }),

/***/ "../lib/md030.js":
/*!***********************!*\
  !*** ../lib/md030.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorDetailIf } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { flattenedLists } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
module.exports = {
    "names": ["MD030", "list-marker-space"],
    "description": "Spaces after list markers",
    "tags": ["ol", "ul", "whitespace"],
    "function": function MD030(params, onError) {
        const ulSingle = Number(params.config.ul_single || 1);
        const olSingle = Number(params.config.ol_single || 1);
        const ulMulti = Number(params.config.ul_multi || 1);
        const olMulti = Number(params.config.ol_multi || 1);
        for (const list of flattenedLists()) {
            const lineCount = list.lastLineIndex - list.open.map[0];
            const allSingle = lineCount === list.items.length;
            const expectedSpaces = list.unordered ?
                (allSingle ? ulSingle : ulMulti) :
                (allSingle ? olSingle : olMulti);
            for (const item of list.items) {
                const { line, lineNumber } = item;
                const match = /^[\s>]*\S+(\s*)/.exec(line);
                const [{ "length": matchLength }, { "length": actualSpaces }] = match;
                if (matchLength < line.length) {
                    let fixInfo = null;
                    if (expectedSpaces !== actualSpaces) {
                        fixInfo = {
                            "editColumn": matchLength - actualSpaces + 1,
                            "deleteCount": actualSpaces,
                            "insertText": "".padEnd(expectedSpaces)
                        };
                    }
                    addErrorDetailIf(onError, lineNumber, expectedSpaces, actualSpaces, null, null, [1, matchLength], fixInfo);
                }
            }
        }
    }
};


/***/ }),

/***/ "../lib/md031.js":
/*!***********************!*\
  !*** ../lib/md031.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorContext, forEachLine, isBlankLine } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { lineMetadata } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
const codeFencePrefixRe = /^(.*?)[`~]/;
module.exports = {
    "names": ["MD031", "blanks-around-fences"],
    "description": "Fenced code blocks should be surrounded by blank lines",
    "tags": ["code", "blank_lines"],
    "function": function MD031(params, onError) {
        const listItems = params.config.list_items;
        const includeListItems = (listItems === undefined) ? true : !!listItems;
        const { lines } = params;
        forEachLine(lineMetadata(), (line, i, inCode, onFence, inTable, inItem) => {
            const onTopFence = (onFence > 0);
            const onBottomFence = (onFence < 0);
            if ((includeListItems || !inItem) &&
                ((onTopFence && !isBlankLine(lines[i - 1])) ||
                    (onBottomFence && !isBlankLine(lines[i + 1])))) {
                const [, prefix] = line.match(codeFencePrefixRe) || [];
                const fixInfo = (prefix === undefined) ? null : {
                    "lineNumber": i + (onTopFence ? 1 : 2),
                    "insertText": `${prefix.replace(/[^>]/g, " ").trim()}\n`
                };
                addErrorContext(onError, i + 1, lines[i].trim(), null, null, null, fixInfo);
            }
        });
    }
};


/***/ }),

/***/ "../lib/md032.js":
/*!***********************!*\
  !*** ../lib/md032.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorContext, blockquotePrefixRe, isBlankLine } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { flattenedLists } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
module.exports = {
    "names": ["MD032", "blanks-around-lists"],
    "description": "Lists should be surrounded by blank lines",
    "tags": ["bullet", "ul", "ol", "blank_lines"],
    "function": function MD032(params, onError) {
        const { lines } = params;
        const filteredLists = flattenedLists().filter((list) => !list.nesting);
        for (const list of filteredLists) {
            const firstIndex = list.open.map[0];
            if (!isBlankLine(lines[firstIndex - 1])) {
                const line = lines[firstIndex];
                const quotePrefix = line.match(blockquotePrefixRe)[0].trimEnd();
                addErrorContext(onError, firstIndex + 1, line.trim(), null, null, null, {
                    "insertText": `${quotePrefix}\n`
                });
            }
            const lastIndex = list.lastLineIndex - 1;
            if (!isBlankLine(lines[lastIndex + 1])) {
                const line = lines[lastIndex];
                const quotePrefix = line.match(blockquotePrefixRe)[0].trimEnd();
                addErrorContext(onError, lastIndex + 1, line.trim(), null, null, null, {
                    "lineNumber": lastIndex + 2,
                    "insertText": `${quotePrefix}\n`
                });
            }
        }
    }
};


/***/ }),

/***/ "../lib/md033.js":
/*!***********************!*\
  !*** ../lib/md033.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addError, forEachLine, htmlElementRe, withinAnyRange, unescapeMarkdown } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { codeBlockAndSpanRanges, lineMetadata, referenceLinkImageData } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
const linkDestinationRe = /\]\(\s*$/;
// See https://spec.commonmark.org/0.29/#autolinks
const emailAddressRe = 
// eslint-disable-next-line max-len
/^[\w.!#$%&'*+/=?^`{|}~-]+@[a-zA-Z\d](?:[a-zA-Z\d-]{0,61}[a-zA-Z\d])?(?:\.[a-zA-Z\d](?:[a-zA-Z\d-]{0,61}[a-zA-Z\d])?)*$/;
module.exports = {
    "names": ["MD033", "no-inline-html"],
    "description": "Inline HTML",
    "tags": ["html"],
    "function": function MD033(params, onError) {
        let allowedElements = params.config.allowed_elements;
        allowedElements = Array.isArray(allowedElements) ? allowedElements : [];
        allowedElements = allowedElements.map((element) => element.toLowerCase());
        const exclusions = codeBlockAndSpanRanges();
        const { references, definitionLineIndices } = referenceLinkImageData();
        for (const datas of references.values()) {
            for (const data of datas) {
                const [lineIndex, index, , textLength, labelLength] = data;
                if (labelLength > 0) {
                    exclusions.push([lineIndex, index + 3 + textLength, labelLength]);
                }
            }
        }
        forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
            let match = null;
            // eslint-disable-next-line no-unmodified-loop-condition
            while (!inCode && ((match = htmlElementRe.exec(line)) !== null)) {
                const [tag, content, element] = match;
                if (!allowedElements.includes(element.toLowerCase()) &&
                    !tag.endsWith("\\>") &&
                    !emailAddressRe.test(content) &&
                    !withinAnyRange(exclusions, lineIndex, match.index, tag.length) &&
                    !definitionLineIndices.includes(lineIndex)) {
                    const prefix = line.substring(0, match.index);
                    if (!linkDestinationRe.test(prefix)) {
                        const unescaped = unescapeMarkdown(prefix + "<", "_");
                        if (!unescaped.endsWith("_")) {
                            addError(onError, lineIndex + 1, "Element: " + element, undefined, [match.index + 1, tag.length]);
                        }
                    }
                }
            }
        });
    }
};


/***/ }),

/***/ "../lib/md034.js":
/*!***********************!*\
  !*** ../lib/md034.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorContext, filterTokens, funcExpExec, urlFe, withinAnyRange } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { codeBlockAndSpanRanges, htmlElementRanges, referenceLinkImageData } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
const htmlLinkRe = /<a(?:\s[^>]*)?>[^<>]*<\/a\s*>/gi;
module.exports = {
    "names": ["MD034", "no-bare-urls"],
    "description": "Bare URL used",
    "tags": ["links", "url"],
    "function": function MD034(params, onError) {
        const { lines } = params;
        const codeExclusions = [
            ...codeBlockAndSpanRanges(),
            ...htmlElementRanges()
        ];
        filterTokens(params, "html_block", (token) => {
            for (let i = token.map[0]; i < token.map[1]; i++) {
                codeExclusions.push([i, 0, lines[i].length]);
            }
        });
        const { definitionLineIndices } = referenceLinkImageData();
        for (const [lineIndex, line] of lines.entries()) {
            if (definitionLineIndices[0] === lineIndex) {
                definitionLineIndices.shift();
            }
            else {
                let match = null;
                const lineExclusions = [];
                while ((match = htmlLinkRe.exec(line)) !== null) {
                    lineExclusions.push([lineIndex, match.index, match[0].length]);
                }
                while ((match = funcExpExec(urlFe, line)) !== null) {
                    const [bareUrl] = match;
                    // @ts-ignore
                    const matchIndex = match.index;
                    const bareUrlLength = bareUrl.length;
                    const prefix = line.slice(0, matchIndex);
                    const postfix = line.slice(matchIndex + bareUrlLength);
                    if (
                    // Allow <...> to avoid reporting non-bare links
                    !(prefix.endsWith("<") && postfix.startsWith(">")) &&
                        // Allow >...</ to avoid reporting <code>...</code>
                        !(prefix.endsWith(">") && postfix.startsWith("</")) &&
                        // Allow "..." and '...' to allow quoting a bare link
                        !(prefix.endsWith("\"") && postfix.startsWith("\"")) &&
                        !(prefix.endsWith("'") && postfix.startsWith("'")) &&
                        // Allow ](... to avoid reporting Markdown-style links
                        !(/\]\(\s*$/.test(prefix)) &&
                        // Allow [...] to avoid MD011/no-reversed-links and nested links
                        !(/\[[^\]]*$/.test(prefix) && /^[^[]*\]/.test(postfix)) &&
                        !withinAnyRange(lineExclusions, lineIndex, matchIndex, bareUrlLength) &&
                        !withinAnyRange(codeExclusions, lineIndex, matchIndex, bareUrlLength)) {
                        const range = [
                            matchIndex + 1,
                            bareUrlLength
                        ];
                        const fixInfo = {
                            "editColumn": range[0],
                            "deleteCount": range[1],
                            "insertText": `<${bareUrl}>`
                        };
                        addErrorContext(onError, lineIndex + 1, bareUrl, null, null, range, fixInfo);
                    }
                }
            }
        }
    }
};


/***/ }),

/***/ "../lib/md035.js":
/*!***********************!*\
  !*** ../lib/md035.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorDetailIf, filterTokens } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
module.exports = {
    "names": ["MD035", "hr-style"],
    "description": "Horizontal rule style",
    "tags": ["hr"],
    "function": function MD035(params, onError) {
        let style = String(params.config.style || "consistent").trim();
        filterTokens(params, "hr", (token) => {
            const { line, lineNumber } = token;
            let { markup } = token;
            const match = line.match(/[_*\-\s]+$/);
            if (match) {
                markup = match[0].trim();
            }
            if (style === "consistent") {
                style = markup;
            }
            addErrorDetailIf(onError, lineNumber, style, markup);
        });
    }
};


/***/ }),

/***/ "../lib/md036.js":
/*!***********************!*\
  !*** ../lib/md036.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorContext, allPunctuation } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
module.exports = {
    "names": ["MD036", "no-emphasis-as-heading", "no-emphasis-as-header"],
    "description": "Emphasis used instead of a heading",
    "tags": ["headings", "headers", "emphasis"],
    "function": function MD036(params, onError) {
        let punctuation = params.config.punctuation;
        punctuation =
            String((punctuation === undefined) ? allPunctuation : punctuation);
        const re = new RegExp("[" + punctuation + "]$");
        // eslint-disable-next-line jsdoc/require-jsdoc
        function base(token) {
            if (token.type === "paragraph_open") {
                return function inParagraph(t) {
                    // Always paragraph_open/inline/paragraph_close,
                    const children = t.children.filter(function notEmptyText(child) {
                        return (child.type !== "text") || (child.content !== "");
                    });
                    if ((children.length === 3) &&
                        ((children[0].type === "strong_open") ||
                            (children[0].type === "em_open")) &&
                        (children[1].type === "text") &&
                        !re.test(children[1].content)) {
                        addErrorContext(onError, t.lineNumber, children[1].content);
                    }
                    return base;
                };
            }
            else if (token.type === "blockquote_open") {
                return function inBlockquote(t) {
                    if (t.type !== "blockquote_close") {
                        return inBlockquote;
                    }
                    return base;
                };
            }
            else if (token.type === "list_item_open") {
                return function inListItem(t) {
                    if (t.type !== "list_item_close") {
                        return inListItem;
                    }
                    return base;
                };
            }
            return base;
        }
        let state = base;
        for (const token of params.tokens) {
            state = state(token);
        }
    }
};


/***/ }),

/***/ "../lib/md037.js":
/*!***********************!*\
  !*** ../lib/md037.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorContext, emphasisMarkersInContent, forEachLine, isBlankLine, withinAnyRange } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { htmlElementRanges, lineMetadata } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
const emphasisRe = /(^|[^\\]|\\\\)(?:(\*{1,3})|(_{1,3}))/g;
const embeddedUnderscoreRe = /([A-Za-z\d])_([A-Za-z\d])/g;
const asteriskListItemMarkerRe = /^([\s>]*)\*(\s+)/;
const leftSpaceRe = /^\s+/;
const rightSpaceRe = /\s+$/;
const tablePipeRe = /\|/;
module.exports = {
    "names": ["MD037", "no-space-in-emphasis"],
    "description": "Spaces inside emphasis markers",
    "tags": ["whitespace", "emphasis"],
    "function": function MD037(params, onError) {
        const exclusions = htmlElementRanges();
        // eslint-disable-next-line init-declarations
        let effectiveEmphasisLength, emphasisIndex, emphasisKind, emphasisLength, pendingError = null;
        // eslint-disable-next-line jsdoc/require-jsdoc
        function resetRunTracking() {
            emphasisIndex = -1;
            emphasisLength = 0;
            emphasisKind = "";
            effectiveEmphasisLength = 0;
            pendingError = null;
        }
        // eslint-disable-next-line jsdoc/require-jsdoc
        function handleRunEnd(line, lineIndex, contextLength, match, matchIndex, inTable) {
            // Close current run
            let content = line.substring(emphasisIndex, matchIndex);
            if (!emphasisLength) {
                content = content.trimStart();
            }
            if (!match) {
                content = content.trimEnd();
            }
            const leftSpace = leftSpaceRe.test(content);
            const rightSpace = rightSpaceRe.test(content);
            if ((leftSpace || rightSpace) &&
                (!inTable || !tablePipeRe.test(content))) {
                // Report the violation
                const contextStart = emphasisIndex - emphasisLength;
                const contextEnd = matchIndex + contextLength;
                const column = contextStart + 1;
                const length = contextEnd - contextStart;
                if (!withinAnyRange(exclusions, lineIndex, column, length)) {
                    const context = line.substring(contextStart, contextEnd);
                    const leftMarker = line.substring(contextStart, emphasisIndex);
                    const rightMarker = match ? (match[2] || match[3]) : "";
                    const fixedText = `${leftMarker}${content.trim()}${rightMarker}`;
                    return [
                        onError,
                        lineIndex + 1,
                        context,
                        leftSpace,
                        rightSpace,
                        [column, length],
                        {
                            "editColumn": column,
                            "deleteCount": length,
                            "insertText": fixedText
                        }
                    ];
                }
            }
            return null;
        }
        // Initialize
        const ignoreMarkersByLine = emphasisMarkersInContent(params);
        resetRunTracking();
        forEachLine(lineMetadata(), (line, lineIndex, inCode, onFence, inTable, inItem, onBreak, inMath) => {
            const onItemStart = (inItem === 1);
            if (inCode ||
                onFence ||
                inTable ||
                onBreak ||
                onItemStart ||
                isBlankLine(line)) {
                // Emphasis resets when leaving a block
                resetRunTracking();
            }
            if (inCode ||
                onFence ||
                onBreak ||
                inMath) {
                // Emphasis has no meaning here
                return;
            }
            let patchedLine = line.replace(embeddedUnderscoreRe, "$1 $2");
            if (onItemStart) {
                // Trim overlapping '*' list item marker
                patchedLine = patchedLine.replace(asteriskListItemMarkerRe, "$1 $2");
            }
            let match = null;
            // Match all emphasis-looking runs in the line...
            while ((match = emphasisRe.exec(patchedLine))) {
                const ignoreMarkersForLine = ignoreMarkersByLine[lineIndex];
                const matchIndex = match.index + match[1].length;
                if (ignoreMarkersForLine.includes(matchIndex)) {
                    // Ignore emphasis markers inside code spans and links
                    continue;
                }
                const matchLength = match[0].length - match[1].length;
                const matchKind = (match[2] || match[3])[0];
                if (emphasisIndex === -1) {
                    // New run
                    emphasisIndex = matchIndex + matchLength;
                    emphasisLength = matchLength;
                    emphasisKind = matchKind;
                    effectiveEmphasisLength = matchLength;
                }
                else if (matchKind === emphasisKind) {
                    // Matching emphasis markers
                    if (matchLength === effectiveEmphasisLength) {
                        // Ending an existing run, report any pending error
                        if (pendingError) {
                            // @ts-ignore
                            addErrorContext(...pendingError);
                            pendingError = null;
                        }
                        const error = handleRunEnd(line, lineIndex, effectiveEmphasisLength, match, matchIndex, inTable);
                        if (error) {
                            // @ts-ignore
                            addErrorContext(...error);
                        }
                        // Reset
                        resetRunTracking();
                    }
                    else if (matchLength === 3) {
                        // Swap internal run length (1->2 or 2->1)
                        effectiveEmphasisLength = matchLength - effectiveEmphasisLength;
                    }
                    else if (effectiveEmphasisLength === 3) {
                        // Downgrade internal run (3->1 or 3->2)
                        effectiveEmphasisLength -= matchLength;
                    }
                    else {
                        // Upgrade to internal run (1->3 or 2->3)
                        effectiveEmphasisLength += matchLength;
                    }
                    // Back up one character so RegExp has a chance to match the
                    // next marker (ex: "**star**_underscore_")
                    if (emphasisRe.lastIndex > 1) {
                        emphasisRe.lastIndex--;
                    }
                }
                else if (emphasisRe.lastIndex > 1) {
                    // Back up one character so RegExp has a chance to match the
                    // mis-matched marker (ex: "*text_*")
                    emphasisRe.lastIndex--;
                }
            }
            if (emphasisIndex !== -1) {
                pendingError = pendingError ||
                    handleRunEnd(line, lineIndex, 0, null, line.length, inTable);
                // Adjust for pending run on new line
                emphasisIndex = 0;
                emphasisLength = 0;
            }
        });
    }
};


/***/ }),

/***/ "../lib/md038.js":
/*!***********************!*\
  !*** ../lib/md038.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorContext, filterTokens, forEachInlineCodeSpan, newLineRe } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const leftSpaceRe = /^\s(?:[^`]|$)/;
const rightSpaceRe = /[^`]\s$/;
const spaceInsideCodeInline = (token) => ((token.type === "code_inline") &&
    (leftSpaceRe.test(token.content) || rightSpaceRe.test(token.content)));
module.exports = {
    "names": ["MD038", "no-space-in-code"],
    "description": "Spaces inside code span elements",
    "tags": ["whitespace", "code"],
    "function": function MD038(params, onError) {
        filterTokens(params, "inline", (token) => {
            if (token.children.some(spaceInsideCodeInline)) {
                const tokenLines = params.lines.slice(token.map[0], token.map[1]);
                forEachInlineCodeSpan(tokenLines.join("\n"), (code, lineIndex, columnIndex, tickCount) => {
                    let rangeIndex = columnIndex - tickCount;
                    let rangeLength = code.length + (2 * tickCount);
                    let rangeLineOffset = 0;
                    let fixIndex = columnIndex;
                    let fixLength = code.length;
                    const codeLines = code.split(newLineRe);
                    const left = leftSpaceRe.test(code);
                    const right = !left && rightSpaceRe.test(code);
                    if (right && (codeLines.length > 1)) {
                        rangeIndex = 0;
                        rangeLineOffset = codeLines.length - 1;
                        fixIndex = 0;
                    }
                    if (left || right) {
                        const codeLinesRange = codeLines[rangeLineOffset];
                        if (codeLines.length > 1) {
                            rangeLength = codeLinesRange.length + tickCount;
                            fixLength = codeLinesRange.length;
                        }
                        const context = tokenLines[lineIndex + rangeLineOffset]
                            .substring(rangeIndex, rangeIndex + rangeLength);
                        const codeLinesRangeTrim = codeLinesRange.trim();
                        const fixText = (codeLinesRangeTrim.startsWith("`") ? " " : "") +
                            codeLinesRangeTrim +
                            (codeLinesRangeTrim.endsWith("`") ? " " : "");
                        addErrorContext(onError, token.lineNumber + lineIndex + rangeLineOffset, context, left, right, [rangeIndex + 1, rangeLength], {
                            "editColumn": fixIndex + 1,
                            "deleteCount": fixLength,
                            "insertText": fixText
                        });
                    }
                });
            }
        });
    }
};


/***/ }),

/***/ "../lib/md039.js":
/*!***********************!*\
  !*** ../lib/md039.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorContext, filterTokens } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const spaceInLinkRe = /\[(?:\s[^\]]*|[^\]]*?\s)\](?=(\([^)]*\)|\[[^\]]*\]))/;
module.exports = {
    "names": ["MD039", "no-space-in-links"],
    "description": "Spaces inside link text",
    "tags": ["whitespace", "links"],
    "function": function MD039(params, onError) {
        filterTokens(params, "inline", (token) => {
            const { children } = token;
            let { lineNumber } = token;
            let inLink = false;
            let linkText = "";
            let lineIndex = 0;
            for (const child of children) {
                const { content, markup, type } = child;
                if (type === "link_open") {
                    inLink = true;
                    linkText = "";
                }
                else if (type === "link_close") {
                    inLink = false;
                    const left = linkText.trimStart().length !== linkText.length;
                    const right = linkText.trimEnd().length !== linkText.length;
                    if (left || right) {
                        const line = params.lines[lineNumber - 1];
                        let range = null;
                        let fixInfo = null;
                        const match = line.slice(lineIndex).match(spaceInLinkRe);
                        if (match) {
                            const column = match.index + lineIndex + 1;
                            const length = match[0].length;
                            range = [column, length];
                            fixInfo = {
                                "editColumn": column + 1,
                                "deleteCount": length - 2,
                                "insertText": linkText.trim()
                            };
                            lineIndex = column + length - 1;
                        }
                        addErrorContext(onError, lineNumber, `[${linkText}]`, left, right, range, fixInfo);
                    }
                }
                else if ((type === "softbreak") || (type === "hardbreak")) {
                    lineNumber++;
                    lineIndex = 0;
                }
                else if (inLink) {
                    linkText += type.endsWith("_inline") ?
                        `${markup}${content}${markup}` :
                        (content || markup);
                }
            }
        });
    }
};


/***/ }),

/***/ "../lib/md040.js":
/*!***********************!*\
  !*** ../lib/md040.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addError, addErrorContext, filterTokens } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
module.exports = {
    "names": ["MD040", "fenced-code-language"],
    "description": "Fenced code blocks should have a language specified",
    "tags": ["code", "language"],
    "function": function MD040(params, onError) {
        let allowed = params.config.allowed_languages;
        allowed = Array.isArray(allowed) ? allowed : [];
        const languageOnly = !!params.config.language_only;
        filterTokens(params, "fence", function forToken(token) {
            const lang = token.info.trim().split(/\s+/u).shift();
            if (lang === "") {
                addErrorContext(onError, token.lineNumber, token.line);
            }
            else if ((allowed.length > 0) && !allowed.includes(lang)) {
                addError(onError, token.lineNumber, `"${lang}" is not allowed`);
            }
            if (languageOnly && (token.info !== lang)) {
                addError(onError, token.lineNumber, `Info string contains more than language: "${token.info}"`);
            }
        });
    }
};


/***/ }),

/***/ "../lib/md041.js":
/*!***********************!*\
  !*** ../lib/md041.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorContext, frontMatterHasTitle } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
module.exports = {
    "names": ["MD041", "first-line-heading", "first-line-h1"],
    "description": "First line in a file should be a top-level heading",
    "tags": ["headings", "headers"],
    "function": function MD041(params, onError) {
        const level = Number(params.config.level || 1);
        const tag = "h" + level;
        const foundFrontMatterTitle = frontMatterHasTitle(params.frontMatterLines, params.config.front_matter_title);
        if (!foundFrontMatterTitle) {
            const htmlHeadingRe = new RegExp(`^<h${level}[ />]`, "i");
            params.tokens.every((token) => {
                let isError = false;
                if (token.type === "html_block") {
                    if (token.content.startsWith("<!--")) {
                        // Ignore leading HTML comments
                        return true;
                    }
                    else if (!htmlHeadingRe.test(token.content)) {
                        // Something other than an HTML heading
                        isError = true;
                    }
                }
                else if ((token.type !== "heading_open") || (token.tag !== tag)) {
                    // Something other than a Markdown heading
                    isError = true;
                }
                if (isError) {
                    addErrorContext(onError, token.lineNumber, token.line);
                }
                return false;
            });
        }
    }
};


/***/ }),

/***/ "../lib/md042.js":
/*!***********************!*\
  !*** ../lib/md042.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorContext, escapeForRegExp, filterTokens } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
module.exports = {
    "names": ["MD042", "no-empty-links"],
    "description": "No empty links",
    "tags": ["links"],
    "function": function MD042(params, onError) {
        filterTokens(params, "inline", function forToken(token) {
            let inLink = false;
            let linkText = "";
            let emptyLink = false;
            for (const child of token.children) {
                if (child.type === "link_open") {
                    inLink = true;
                    linkText = "";
                    for (const attr of child.attrs) {
                        if (attr[0] === "href" && (!attr[1] || (attr[1] === "#"))) {
                            emptyLink = true;
                        }
                    }
                }
                else if (child.type === "link_close") {
                    inLink = false;
                    if (emptyLink) {
                        let context = `[${linkText}]`;
                        let range = null;
                        const match = child.line.match(new RegExp(`${escapeForRegExp(context)}\\((?:|#|<>)\\)`));
                        if (match) {
                            context = match[0];
                            range = [match.index + 1, match[0].length];
                        }
                        addErrorContext(onError, child.lineNumber, context, null, null, range);
                        emptyLink = false;
                    }
                }
                else if (inLink) {
                    linkText += child.content;
                }
            }
        });
    }
};


/***/ }),

/***/ "../lib/md043.js":
/*!***********************!*\
  !*** ../lib/md043.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorContext, addErrorDetailIf, forEachHeading } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
module.exports = {
    "names": ["MD043", "required-headings", "required-headers"],
    "description": "Required heading structure",
    "tags": ["headings", "headers"],
    "function": function MD043(params, onError) {
        const requiredHeadings = params.config.headings || params.config.headers;
        const matchCase = params.config.match_case || false;
        if (Array.isArray(requiredHeadings)) {
            const levels = {};
            for (const level of [1, 2, 3, 4, 5, 6]) {
                levels["h" + level] = "######".substr(-level);
            }
            let i = 0;
            let matchAny = false;
            let hasError = false;
            let anyHeadings = false;
            const getExpected = () => requiredHeadings[i++] || "[None]";
            const handleCase = (str) => (matchCase ? str : str.toLowerCase());
            forEachHeading(params, (heading, content) => {
                if (!hasError) {
                    anyHeadings = true;
                    const actual = levels[heading.tag] + " " + content;
                    const expected = getExpected();
                    if (expected === "*") {
                        const nextExpected = getExpected();
                        if (handleCase(nextExpected) !== handleCase(actual)) {
                            matchAny = true;
                            i--;
                        }
                    }
                    else if (expected === "+") {
                        matchAny = true;
                    }
                    else if (handleCase(expected) === handleCase(actual)) {
                        matchAny = false;
                    }
                    else if (matchAny) {
                        i--;
                    }
                    else {
                        addErrorDetailIf(onError, heading.lineNumber, expected, actual);
                        hasError = true;
                    }
                }
            });
            const extraHeadings = requiredHeadings.length - i;
            if (!hasError &&
                ((extraHeadings > 1) ||
                    ((extraHeadings === 1) && (requiredHeadings[i] !== "*"))) &&
                (anyHeadings || !requiredHeadings.every((heading) => heading === "*"))) {
                addErrorContext(onError, params.lines.length, requiredHeadings[i]);
            }
        }
    }
};


/***/ }),

/***/ "../lib/md044.js":
/*!***********************!*\
  !*** ../lib/md044.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorDetailIf, escapeForRegExp, forEachLine, forEachLink, funcExpExec, linkReferenceDefinitionRe, urlFe, withinAnyRange } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { codeBlockAndSpanRanges, htmlElementRanges, lineMetadata } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
module.exports = {
    "names": ["MD044", "proper-names"],
    "description": "Proper names should have the correct capitalization",
    "tags": ["spelling"],
    "function": function MD044(params, onError) {
        let names = params.config.names;
        names = Array.isArray(names) ? names : [];
        names.sort((a, b) => (b.length - a.length) || a.localeCompare(b));
        const codeBlocks = params.config.code_blocks;
        const includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
        const htmlElements = params.config.html_elements;
        const includeHtmlElements = (htmlElements === undefined) ? true : !!htmlElements;
        const exclusions = [];
        forEachLine(lineMetadata(), (line, lineIndex) => {
            if (linkReferenceDefinitionRe.test(line)) {
                exclusions.push([lineIndex, 0, line.length]);
            }
            else {
                let match = null;
                while ((match = funcExpExec(urlFe, line)) !== null) {
                    // @ts-ignore
                    exclusions.push([lineIndex, match.index, match[0].length]);
                }
                forEachLink(line, (index, _, text, destination) => {
                    if (destination) {
                        exclusions.push([lineIndex, index + text.length, destination.length]);
                    }
                });
            }
        });
        if (!includeCodeBlocks) {
            exclusions.push(...codeBlockAndSpanRanges());
        }
        if (!includeHtmlElements) {
            exclusions.push(...htmlElementRanges());
        }
        for (const name of names) {
            const escapedName = escapeForRegExp(name);
            const startNamePattern = /^\W/.test(name) ? "" : "\\b_*";
            const endNamePattern = /\W$/.test(name) ? "" : "_*\\b";
            const namePattern = `(${startNamePattern})(${escapedName})${endNamePattern}`;
            const nameRe = new RegExp(namePattern, "gi");
            forEachLine(lineMetadata(), (line, lineIndex, inCode, onFence) => {
                if (includeCodeBlocks || (!inCode && !onFence)) {
                    let match = null;
                    while ((match = nameRe.exec(line)) !== null) {
                        const [, leftMatch, nameMatch] = match;
                        const index = match.index + leftMatch.length;
                        const length = nameMatch.length;
                        if (!withinAnyRange(exclusions, lineIndex, index, length) &&
                            !names.includes(nameMatch)) {
                            addErrorDetailIf(onError, lineIndex + 1, name, nameMatch, null, null, [index + 1, length], {
                                "editColumn": index + 1,
                                "deleteCount": length,
                                "insertText": name
                            });
                        }
                        exclusions.push([lineIndex, index, length]);
                    }
                }
            });
        }
    }
};


/***/ }),

/***/ "../lib/md045.js":
/*!***********************!*\
  !*** ../lib/md045.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addError, forEachInlineChild } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
module.exports = {
    "names": ["MD045", "no-alt-text"],
    "description": "Images should have alternate text (alt text)",
    "tags": ["accessibility", "images"],
    "function": function MD045(params, onError) {
        forEachInlineChild(params, "image", function forToken(token) {
            if (token.content === "") {
                addError(onError, token.lineNumber);
            }
        });
    }
};


/***/ }),

/***/ "../lib/md046.js":
/*!***********************!*\
  !*** ../lib/md046.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorDetailIf } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const tokenTypeToStyle = {
    "fence": "fenced",
    "code_block": "indented"
};
module.exports = {
    "names": ["MD046", "code-block-style"],
    "description": "Code block style",
    "tags": ["code"],
    "function": function MD046(params, onError) {
        let expectedStyle = String(params.config.style || "consistent");
        const codeBlocksAndFences = params.tokens.filter((token) => (token.type === "code_block") || (token.type === "fence"));
        for (const token of codeBlocksAndFences) {
            const { lineNumber, type } = token;
            if (expectedStyle === "consistent") {
                expectedStyle = tokenTypeToStyle[type];
            }
            addErrorDetailIf(onError, lineNumber, expectedStyle, tokenTypeToStyle[type]);
        }
    }
};


/***/ }),

/***/ "../lib/md047.js":
/*!***********************!*\
  !*** ../lib/md047.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addError, isBlankLine } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
module.exports = {
    "names": ["MD047", "single-trailing-newline"],
    "description": "Files should end with a single newline character",
    "tags": ["blank_lines"],
    "function": function MD047(params, onError) {
        const lastLineNumber = params.lines.length;
        const lastLine = params.lines[lastLineNumber - 1];
        if (!isBlankLine(lastLine)) {
            addError(onError, lastLineNumber, null, null, [lastLine.length, 1], {
                "insertText": "\n",
                "editColumn": lastLine.length + 1
            });
        }
    }
};


/***/ }),

/***/ "../lib/md048.js":
/*!***********************!*\
  !*** ../lib/md048.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addErrorDetailIf, fencedCodeBlockStyleFor } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
module.exports = {
    "names": ["MD048", "code-fence-style"],
    "description": "Code fence style",
    "tags": ["code"],
    "function": function MD048(params, onError) {
        const style = String(params.config.style || "consistent");
        let expectedStyle = style;
        const fenceTokens = params.tokens.filter((token) => token.type === "fence");
        for (const fenceToken of fenceTokens) {
            const { lineNumber, markup } = fenceToken;
            if (expectedStyle === "consistent") {
                expectedStyle = fencedCodeBlockStyleFor(markup);
            }
            addErrorDetailIf(onError, lineNumber, expectedStyle, fencedCodeBlockStyleFor(markup));
        }
    }
};


/***/ }),

/***/ "../lib/md049-md050.js":
/*!*****************************!*\
  !*** ../lib/md049-md050.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addError, emphasisOrStrongStyleFor, forEachInlineChild, getNextChildToken, getRangeAndFixInfoIfFound } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const impl = (params, onError, tagPrefix, asterisk, underline, style) => {
    let lastLineNumber = -1;
    const instances = new Map();
    forEachInlineChild(params, `${tagPrefix}_open`, (token, parent) => {
        const { lineNumber, markup } = token;
        const markupStyle = emphasisOrStrongStyleFor(markup);
        if (style === "consistent") {
            style = markupStyle;
        }
        if (style !== markupStyle) {
            let rangeAndFixInfo = {};
            const contentToken = getNextChildToken(parent, token, "text", `${tagPrefix}_close`);
            if (contentToken) {
                const { content } = contentToken;
                const actual = `${markup}${content}${markup}`;
                const expectedMarkup = (style === "asterisk") ? asterisk : underline;
                const expected = `${expectedMarkup}${content}${expectedMarkup}`;
                if (lastLineNumber !== lineNumber) {
                    lastLineNumber = lineNumber;
                    instances.clear();
                }
                const instance = (instances.get(expected) || 0) + 1;
                instances.set(expected, instance);
                rangeAndFixInfo = getRangeAndFixInfoIfFound(params.lines, lineNumber - 1, actual, expected, instance);
            }
            addError(onError, lineNumber, `Expected: ${style}; Actual: ${markupStyle}`, null, rangeAndFixInfo.range, rangeAndFixInfo.fixInfo);
        }
    });
};
module.exports = [
    {
        "names": ["MD049", "emphasis-style"],
        "description": "Emphasis style should be consistent",
        "tags": ["emphasis"],
        "function": function MD049(params, onError) {
            const style = String(params.config.style || "consistent");
            return impl(params, onError, "em", "*", "_", style);
        }
    },
    {
        "names": ["MD050", "strong-style"],
        "description": "Strong style should be consistent",
        "tags": ["emphasis"],
        "function": function MD050(params, onError) {
            const style = String(params.config.style || "consistent");
            return impl(params, onError, "strong", "**", "__", style);
        }
    }
];


/***/ }),

/***/ "../lib/md051.js":
/*!***********************!*\
  !*** ../lib/md051.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addError, addErrorDetailIf, escapeForRegExp, filterTokens, forEachInlineChild, forEachHeading, htmlElementRe } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
// Regular expression for identifying HTML anchor names
const idRe = /\sid\s*=\s*['"]?([^'"\s>]+)/iu;
const nameRe = /\sname\s*=\s*['"]?([^'"\s>]+)/iu;
/**
 * Converts a Markdown heading into an HTML fragment according to the rules
 * used by GitHub.
 *
 * @param {Object} inline Inline token for heading.
 * @returns {string} Fragment string for heading.
 */
function convertHeadingToHTMLFragment(inline) {
    const inlineText = inline.children
        .filter((token) => token.type !== "html_inline")
        .map((token) => token.content)
        .join("");
    return "#" + encodeURIComponent(inlineText
        .toLowerCase()
        // RegExp source with Ruby's \p{Word} expanded into its General Categories
        // eslint-disable-next-line max-len
        // https://github.com/gjtorikian/html-pipeline/blob/main/lib/html/pipeline/toc_filter.rb
        // https://ruby-doc.org/core-3.0.2/Regexp.html
        .replace(/[^\p{Letter}\p{Mark}\p{Number}\p{Connector_Punctuation}\- ]/gu, "")
        .replace(/ /gu, "-"));
}
module.exports = {
    "names": ["MD051", "link-fragments"],
    "description": "Link fragments should be valid",
    "tags": ["links"],
    "function": function MD051(params, onError) {
        const fragments = new Map();
        // Process headings
        forEachHeading(params, (heading, content, inline) => {
            const fragment = convertHeadingToHTMLFragment(inline);
            const count = fragments.get(fragment) || 0;
            if (count) {
                fragments.set(`${fragment}-${count}`, 0);
            }
            fragments.set(fragment, count + 1);
        });
        // Process HTML anchors
        const processHtmlToken = (token) => {
            let match = null;
            while ((match = htmlElementRe.exec(token.content)) !== null) {
                const [tag, , element] = match;
                const anchorMatch = idRe.exec(tag) ||
                    (element.toLowerCase() === "a" && nameRe.exec(tag));
                if (anchorMatch) {
                    fragments.set(`#${anchorMatch[1]}`, 0);
                }
            }
        };
        filterTokens(params, "html_block", processHtmlToken);
        forEachInlineChild(params, "html_inline", processHtmlToken);
        // Process link fragments
        forEachInlineChild(params, "link_open", (token) => {
            const { attrs, lineNumber, line } = token;
            const href = attrs.find((attr) => attr[0] === "href");
            const id = href && href[1];
            if (id && (id.length > 1) && (id[0] === "#") && !fragments.has(id)) {
                let context = id;
                let range = null;
                let fixInfo = null;
                const match = line.match(new RegExp(`\\[.*?\\]\\(${escapeForRegExp(context)}\\)`));
                if (match) {
                    [context] = match;
                    const index = match.index;
                    const length = context.length;
                    range = [index + 1, length];
                    fixInfo = {
                        "editColumn": index + (length - id.length),
                        "deleteCount": id.length,
                        "insertText": null
                    };
                }
                const idLower = id.toLowerCase();
                const mixedCaseKey = [...fragments.keys()]
                    .find((key) => idLower === key.toLowerCase());
                if (mixedCaseKey) {
                    (fixInfo || {}).insertText = mixedCaseKey;
                    addErrorDetailIf(onError, lineNumber, mixedCaseKey, id, undefined, context, range, fixInfo);
                }
                else {
                    addError(onError, lineNumber, undefined, context, 
                    // @ts-ignore
                    range);
                }
            }
        });
    }
};


/***/ }),

/***/ "../lib/md052.js":
/*!***********************!*\
  !*** ../lib/md052.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addError } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { referenceLinkImageData } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
module.exports = {
    "names": ["MD052", "reference-links-images"],
    "description": "Reference links and images should use a label that is defined",
    "tags": ["images", "links"],
    "function": function MD052(params, onError) {
        const { lines } = params;
        const { references, definitions } = referenceLinkImageData();
        // Look for links/images that use an undefined link reference
        for (const reference of references.entries()) {
            const [label, datas] = reference;
            if (!definitions.has(label)) {
                for (const data of datas) {
                    const [lineIndex, index, length] = data;
                    // Context will be incomplete if reporting for a multi-line link
                    const context = lines[lineIndex].slice(index, index + length);
                    addError(onError, lineIndex + 1, `Missing link or image reference definition: "${label}"`, context, [index + 1, context.length]);
                }
            }
        }
    }
};


/***/ }),

/***/ "../lib/md053.js":
/*!***********************!*\
  !*** ../lib/md053.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { addError, ellipsify, linkReferenceDefinitionRe } = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
const { referenceLinkImageData } = __webpack_require__(/*! ./cache */ "../lib/cache.js");
module.exports = {
    "names": ["MD053", "link-image-reference-definitions"],
    "description": "Link and image reference definitions should be needed",
    "tags": ["images", "links"],
    "function": function MD053(params, onError) {
        const ignored = new Set(params.config.ignored_definitions || ["//"]);
        const lines = params.lines;
        const { references, shortcuts, definitions, duplicateDefinitions } = referenceLinkImageData();
        const singleLineDefinition = (line) => (line.replace(linkReferenceDefinitionRe, "").trim().length > 0);
        const deleteFixInfo = {
            "deleteCount": -1
        };
        // Look for unused link references (unreferenced by any link/image)
        for (const definition of definitions.entries()) {
            const [label, lineIndex] = definition;
            if (!ignored.has(label) &&
                !references.has(label) &&
                !shortcuts.has(label)) {
                const line = lines[lineIndex];
                addError(onError, lineIndex + 1, `Unused link or image reference definition: "${label}"`, ellipsify(line), [1, line.length], singleLineDefinition(line) ? deleteFixInfo : 0);
            }
        }
        // Look for duplicate link references (defined more than once)
        for (const duplicateDefinition of duplicateDefinitions) {
            const [label, lineIndex] = duplicateDefinition;
            if (!ignored.has(label)) {
                const line = lines[lineIndex];
                addError(onError, lineIndex + 1, `Duplicate link or image reference definition: "${label}"`, ellipsify(line), [1, line.length], singleLineDefinition(line) ? deleteFixInfo : 0);
            }
        }
    }
};


/***/ }),

/***/ "../lib/rules.js":
/*!***********************!*\
  !*** ../lib/rules.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

const { homepage, version } = __webpack_require__(/*! ./constants */ "../lib/constants.js");
const rules = [
    __webpack_require__(/*! ./md001 */ "../lib/md001.js"),
    __webpack_require__(/*! ./md002 */ "../lib/md002.js"),
    __webpack_require__(/*! ./md003 */ "../lib/md003.js"),
    __webpack_require__(/*! ./md004 */ "../lib/md004.js"),
    __webpack_require__(/*! ./md005 */ "../lib/md005.js"),
    __webpack_require__(/*! ./md006 */ "../lib/md006.js"),
    __webpack_require__(/*! ./md007 */ "../lib/md007.js"),
    __webpack_require__(/*! ./md009 */ "../lib/md009.js"),
    __webpack_require__(/*! ./md010 */ "../lib/md010.js"),
    __webpack_require__(/*! ./md011 */ "../lib/md011.js"),
    __webpack_require__(/*! ./md012 */ "../lib/md012.js"),
    __webpack_require__(/*! ./md013 */ "../lib/md013.js"),
    __webpack_require__(/*! ./md014 */ "../lib/md014.js"),
    __webpack_require__(/*! ./md018 */ "../lib/md018.js"),
    __webpack_require__(/*! ./md019 */ "../lib/md019.js"),
    __webpack_require__(/*! ./md020 */ "../lib/md020.js"),
    __webpack_require__(/*! ./md021 */ "../lib/md021.js"),
    __webpack_require__(/*! ./md022 */ "../lib/md022.js"),
    __webpack_require__(/*! ./md023 */ "../lib/md023.js"),
    __webpack_require__(/*! ./md024 */ "../lib/md024.js"),
    __webpack_require__(/*! ./md025 */ "../lib/md025.js"),
    __webpack_require__(/*! ./md026 */ "../lib/md026.js"),
    __webpack_require__(/*! ./md027 */ "../lib/md027.js"),
    __webpack_require__(/*! ./md028 */ "../lib/md028.js"),
    __webpack_require__(/*! ./md029 */ "../lib/md029.js"),
    __webpack_require__(/*! ./md030 */ "../lib/md030.js"),
    __webpack_require__(/*! ./md031 */ "../lib/md031.js"),
    __webpack_require__(/*! ./md032 */ "../lib/md032.js"),
    __webpack_require__(/*! ./md033 */ "../lib/md033.js"),
    __webpack_require__(/*! ./md034 */ "../lib/md034.js"),
    __webpack_require__(/*! ./md035 */ "../lib/md035.js"),
    __webpack_require__(/*! ./md036 */ "../lib/md036.js"),
    __webpack_require__(/*! ./md037 */ "../lib/md037.js"),
    __webpack_require__(/*! ./md038 */ "../lib/md038.js"),
    __webpack_require__(/*! ./md039 */ "../lib/md039.js"),
    __webpack_require__(/*! ./md040 */ "../lib/md040.js"),
    __webpack_require__(/*! ./md041 */ "../lib/md041.js"),
    __webpack_require__(/*! ./md042 */ "../lib/md042.js"),
    __webpack_require__(/*! ./md043 */ "../lib/md043.js"),
    __webpack_require__(/*! ./md044 */ "../lib/md044.js"),
    __webpack_require__(/*! ./md045 */ "../lib/md045.js"),
    __webpack_require__(/*! ./md046 */ "../lib/md046.js"),
    __webpack_require__(/*! ./md047 */ "../lib/md047.js"),
    __webpack_require__(/*! ./md048 */ "../lib/md048.js"),
    ...__webpack_require__(/*! ./md049-md050 */ "../lib/md049-md050.js"),
    __webpack_require__(/*! ./md051 */ "../lib/md051.js"),
    __webpack_require__(/*! ./md052 */ "../lib/md052.js"),
    __webpack_require__(/*! ./md053 */ "../lib/md053.js")
];
for (const rule of rules) {
    const name = rule.names[0].toLowerCase();
    // eslint-disable-next-line dot-notation
    rule["information"] =
        new URL(`${homepage}/blob/v${version}/doc/${name}.md`);
}
module.exports = rules;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("../lib/markdownlint.js");
/******/ 	markdownlint = __webpack_exports__;
/******/ 	
/******/ })()
;