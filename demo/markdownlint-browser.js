/*! markdownlint 0.25.1 https://github.com/DavidAnson/markdownlint @license MIT */
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
/***/ ((module) => {

"use strict";
// @ts-check

// Regular expression for matching common newline characters
// See NEWLINES_RE in markdown-it/lib/rules_core/normalize.js
var newLineRe = /\r\n?|\n/g;
module.exports.newLineRe = newLineRe;
// Regular expression for matching common front matter (YAML and TOML)
module.exports.frontMatterRe =
    // eslint-disable-next-line max-len
    /((^---\s*$[^]*?^---\s*$)|(^\+\+\+\s*$[^]*?^(\+\+\+|\.\.\.)\s*$)|(^\{\s*$[^]*?^\}\s*$))(\r\n|\r|\n|$)/m;
// Regular expression for matching inline disable/enable comments
var inlineCommentRe = 
// eslint-disable-next-line max-len
/<!--\s*markdownlint-(?:(?:(disable|enable|capture|restore|disable-file|enable-file|disable-next-line)((?:\s+[a-z0-9_-]+)*))|(?:(configure-file)\s+([\s\S]*?)))\s*-->/ig;
module.exports.inlineCommentRe = inlineCommentRe;
// Regular expressions for range matching
module.exports.bareUrlRe = /(?:http|ftp)s?:\/\/[^\s\]"']*(?:\/|[^\s\]"'\W])/ig;
module.exports.listItemMarkerRe = /^([\s>]*)(?:[*+-]|\d+[.)])\s+/;
module.exports.orderedListItemMarkerRe = /^[\s>]*0*(\d+)[.)]/;
// Regular expression for all instances of emphasis markers
var emphasisMarkersRe = /[_*]/g;
// Regular expression for inline links and shortcut reference links
var linkRe = /(\[(?:[^[\]]|\[[^\]]*\])*\])(\(\S*\)|\[\S*\])?/g;
module.exports.linkRe = linkRe;
// Regular expression for link reference definition lines
module.exports.linkReferenceRe = /^ {0,3}\[[^\]]+]:\s.*$/;
// All punctuation characters (normal and full-width)
var allPunctuation = ".,;:!?。，；：！？";
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
// Returns true iff the input line is blank (no content)
// Example: Contains nothing, whitespace, or comment (unclosed start/end okay)
module.exports.isBlankLine = function isBlankLine(line) {
    // Call to String.replace follows best practices and is not a security check
    // False-positive for js/incomplete-multi-character-sanitization
    return (!line ||
        !line.trim() ||
        !line
            .replace(/<!--.*?-->/g, "")
            .replace(/<!--.*$/g, "")
            .replace(/^.*-->/g, "")
            .replace(/>/g, "")
            .trim());
};
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
    var left = 0;
    var right = array.length - 1;
    while (left <= right) {
        // eslint-disable-next-line no-bitwise
        var mid = (left + right) >> 1;
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
var htmlCommentBegin = "<!--";
var htmlCommentEnd = "-->";
module.exports.clearHtmlCommentText = function clearHtmlCommentText(text) {
    var i = 0;
    while ((i = text.indexOf(htmlCommentBegin, i)) !== -1) {
        var j = text.indexOf(htmlCommentEnd, i + 2);
        if (j === -1) {
            // Un-terminated comments are treated as text
            break;
        }
        // If the comment has content...
        if (j > i + htmlCommentBegin.length) {
            var k = i - 1;
            while (text[k] === " ") {
                k--;
            }
            // If comment is not within an indented code block...
            if (k >= i - 4) {
                var content = text.slice(i + htmlCommentBegin.length, j);
                var isBlock = (k < 0) || (text[k] === "\n");
                var isValid = isBlock ||
                    (!content.startsWith(">") && !content.startsWith("->") &&
                        !content.endsWith("-") && !content.includes("--"));
                // If a valid block/inline comment...
                if (isValid) {
                    var inlineCommentIndex = text
                        .slice(i, j + htmlCommentEnd.length)
                        .search(inlineCommentRe);
                    // If not a markdownlint inline directive...
                    if (inlineCommentIndex === -1) {
                        text =
                            text.slice(0, i + htmlCommentBegin.length) +
                                content.replace(/[^\r\n]/g, ".") +
                                text.slice(j);
                    }
                }
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
var escapedMarkdownRe = /\\./g;
module.exports.unescapeMarkdown =
    function unescapeMarkdown(markdown, replacement) {
        return markdown.replace(escapedMarkdownRe, function (match) {
            var char = match[1];
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
    var line = token.line.replace(/^[\s>]*(> |>)/, "");
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
    params.tokens.forEach(function forToken(token) {
        if (token.type === type) {
            handler(token);
        }
    });
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
    var lineMetadata = params.lines.map(function (line, index) { return [line, index, false, 0, false, false, false, false]; });
    filterTokens(params, "fence", function (token) {
        lineMetadata[token.map[0]][3] = 1;
        lineMetadata[token.map[1] - 1][3] = -1;
        for (var i = token.map[0] + 1; i < token.map[1] - 1; i++) {
            lineMetadata[i][2] = true;
        }
    });
    filterTokens(params, "code_block", function (token) {
        for (var i = token.map[0]; i < token.map[1]; i++) {
            lineMetadata[i][2] = true;
        }
    });
    filterTokens(params, "table_open", function (token) {
        for (var i = token.map[0]; i < token.map[1]; i++) {
            lineMetadata[i][4] = true;
        }
    });
    filterTokens(params, "list_item_open", function (token) {
        var count = 1;
        for (var i = token.map[0]; i < token.map[1]; i++) {
            lineMetadata[i][5] = count;
            count++;
        }
    });
    filterTokens(params, "hr", function (token) {
        lineMetadata[token.map[0]][6] = true;
    });
    params.tokens.filter(isMathBlock).forEach(function (token) {
        for (var i = token.map[0]; i < token.map[1]; i++) {
            lineMetadata[i][7] = true;
        }
    });
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
    lineMetadata.forEach(function forMetadata(metadata) {
        handler.apply(void 0, metadata);
    });
}
module.exports.forEachLine = forEachLine;
// Returns (nested) lists as a flat array (in order)
module.exports.flattenLists = function flattenLists(tokens) {
    var flattenedLists = [];
    var stack = [];
    var current = null;
    var nesting = 0;
    var nestingStack = [];
    var lastWithMap = { "map": [0, 1] };
    tokens.forEach(function (token) {
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
            nesting = nestingStack.pop();
        }
        else if (token.map) {
            // Track last token with map
            lastWithMap = token;
        }
    });
    return flattenedLists;
};
// Calls the provided function for each specified inline child token
module.exports.forEachInlineChild =
    function forEachInlineChild(params, type, handler) {
        filterTokens(params, "inline", function forToken(token) {
            token.children.forEach(function forChild(child) {
                if (child.type === type) {
                    handler(child, token);
                }
            });
        });
    };
// Calls the provided function for each heading's content
module.exports.forEachHeading = function forEachHeading(params, handler) {
    var heading = null;
    params.tokens.forEach(function forToken(token) {
        if (token.type === "heading_open") {
            heading = token;
        }
        else if (token.type === "heading_close") {
            heading = null;
        }
        else if ((token.type === "inline") && heading) {
            handler(heading, token.content);
        }
    });
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
    var currentLine = 0;
    var currentColumn = 0;
    var index = 0;
    while (index < input.length) {
        var startIndex = -1;
        var startLine = -1;
        var startColumn = -1;
        var tickCount = 0;
        var currentTicks = 0;
        var state = "normal";
        // Deliberate <= so trailing 0 completes the last span (ex: "text `code`")
        // False-positive for js/index-out-of-bounds
        for (; index <= input.length; index++) {
            var char = input[index];
            // Ignore backticks in link destination
            if ((char === "[") && (state === "normal")) {
                state = "linkTextOpen";
            }
            else if ((char === "]") && (state === "linkTextOpen")) {
                state = "linkTextClosed";
            }
            else if ((char === "(") && (state === "linkTextClosed")) {
                state = "linkDestinationOpen";
            }
            else if (((char === "(") && (state === "linkDestinationOpen")) ||
                ((char === ")") && (state === "linkDestinationOpen")) ||
                (state === "linkTextClosed")) {
                state = "normal";
            }
            // Parse backtick open/close
            if ((char === "`") && (state !== "linkDestinationOpen")) {
                // Count backticks at start or end of code span
                currentTicks++;
                if ((startIndex === -1) || (startColumn === -1)) {
                    startIndex = index + 1;
                }
            }
            else {
                if ((startIndex >= 0) &&
                    (startColumn >= 0) &&
                    (tickCount === currentTicks)) {
                    // Found end backticks; invoke callback for code span
                    handler(input.substring(startIndex, index - currentTicks), startLine, startColumn, tickCount);
                    startIndex = -1;
                    startColumn = -1;
                }
                else if ((startIndex >= 0) && (startColumn === -1)) {
                    // Found start backticks
                    tickCount = currentTicks;
                    startLine = currentLine;
                    startColumn = currentColumn;
                }
                // Not in backticks
                currentTicks = 0;
            }
            if (char === "\n") {
                // On next line
                currentLine++;
                currentColumn = 0;
            }
            else if ((char === "\\") &&
                ((startIndex === -1) || (startColumn === -1)) &&
                (input[index + 1] !== "\n")) {
                // Escape character outside code, skip next
                index++;
                currentColumn += 2;
            }
            else {
                // On next column
                currentColumn++;
            }
        }
        if (startIndex >= 0) {
            // Restart loop after unmatched start backticks (ex: "`text``code``")
            index = startIndex;
            currentLine = startLine;
            currentColumn = startColumn;
        }
    }
}
module.exports.forEachInlineCodeSpan = forEachInlineCodeSpan;
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
        lineNumber: lineNumber,
        detail: detail,
        context: context,
        range: range,
        fixInfo: fixInfo
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
    if (context.length <= 30) {
        // Nothing to do
    }
    else if (left && right) {
        context = context.substr(0, 15) + "..." + context.substr(-15);
    }
    else if (right) {
        context = "..." + context.substr(-30);
    }
    else {
        context = context.substr(0, 30) + "...";
    }
    addError(onError, lineNumber, null, context, range, fixInfo);
};
/**
 * Returns an array of code block and span content ranges.
 *
 * @param {Object} params RuleParams instance.
 * @param {Object} lineMetadata Line metadata object.
 * @returns {number[][]} Array of ranges (lineIndex, columnIndex, length).
 */
module.exports.codeBlockAndSpanRanges = function (params, lineMetadata) {
    var exclusions = [];
    // Add code block ranges (excludes fences)
    forEachLine(lineMetadata, function (line, lineIndex, inCode, onFence) {
        if (inCode && !onFence) {
            exclusions.push([lineIndex, 0, line.length]);
        }
    });
    // Add code span ranges (excludes ticks)
    filterTokens(params, "inline", function (token) {
        if (token.children.some(function (child) { return child.type === "code_inline"; })) {
            var tokenLines = params.lines.slice(token.map[0], token.map[1]);
            forEachInlineCodeSpan(tokenLines.join("\n"), function (code, lineIndex, columnIndex) {
                var codeLines = code.split(newLineRe);
                for (var _i = 0, _a = codeLines.entries(); _i < _a.length; _i++) {
                    var _b = _a[_i], i = _b[0], line = _b[1];
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
 * Determines whether the specified range overlaps another range.
 *
 * @param {number[][]} ranges Array of ranges (line, index, length).
 * @param {number} lineIndex Line index to check.
 * @param {number} index Index to check.
 * @param {number} length Length to check.
 * @returns {boolean} True iff the specified range overlaps.
 */
module.exports.overlapsAnyRange = function (ranges, lineIndex, index, length) { return (!ranges.every(function (span) { return ((lineIndex !== span[0]) ||
    (index + length < span[1]) ||
    (index > span[1] + span[2])); })); };
// Returns a range object for a line by applying a RegExp
module.exports.rangeFromRegExp = function rangeFromRegExp(line, regexp) {
    var range = null;
    var match = line.match(regexp);
    if (match) {
        var column = match.index + 1;
        var length = match[0].length;
        range = [column, length];
    }
    return range;
};
// Determines if the front matter includes a title
module.exports.frontMatterHasTitle =
    function frontMatterHasTitle(frontMatterLines, frontMatterTitlePattern) {
        var ignoreFrontMatter = (frontMatterTitlePattern !== undefined) && !frontMatterTitlePattern;
        var frontMatterTitleRe = new RegExp(String(frontMatterTitlePattern || "^\\s*\"?title\"?\\s*[:=]"), "i");
        return !ignoreFrontMatter &&
            frontMatterLines.some(function (line) { return frontMatterTitleRe.test(line); });
    };
/**
 * Returns a list of emphasis markers in code spans and links.
 *
 * @param {Object} params RuleParams instance.
 * @returns {number[][]} List of markers.
 */
function emphasisMarkersInContent(params) {
    var lines = params.lines;
    var byLine = new Array(lines.length);
    // Search links
    lines.forEach(function (tokenLine, tokenLineIndex) {
        var inLine = [];
        var linkMatch = null;
        while ((linkMatch = linkRe.exec(tokenLine))) {
            var markerMatch = null;
            while ((markerMatch = emphasisMarkersRe.exec(linkMatch[0]))) {
                inLine.push(linkMatch.index + markerMatch.index);
            }
        }
        byLine[tokenLineIndex] = inLine;
    });
    // Search code spans
    filterTokens(params, "inline", function (token) {
        var children = token.children, lineNumber = token.lineNumber, map = token.map;
        if (children.some(function (child) { return child.type === "code_inline"; })) {
            var tokenLines = lines.slice(map[0], map[1]);
            forEachInlineCodeSpan(tokenLines.join("\n"), function (code, lineIndex, column, tickCount) {
                var codeLines = code.split(newLineRe);
                codeLines.forEach(function (codeLine, codeLineIndex) {
                    var byLineIndex = lineNumber - 1 + lineIndex + codeLineIndex;
                    var inLine = byLine[byLineIndex];
                    var codeLineOffset = codeLineIndex ? 0 : column - 1 + tickCount;
                    var match = null;
                    while ((match = emphasisMarkersRe.exec(codeLine))) {
                        inLine.push(codeLineOffset + match.index);
                    }
                    byLine[byLineIndex] = inLine;
                });
            });
        }
    });
    return byLine;
}
module.exports.emphasisMarkersInContent = emphasisMarkersInContent;
/**
 * Gets the most common line ending, falling back to the platform default.
 *
 * @param {string} input Markdown content to analyze.
 * @param {string} [platform] Platform identifier (process.platform).
 * @returns {string} Preferred line ending.
 */
function getPreferredLineEnding(input, platform) {
    var cr = 0;
    var lf = 0;
    var crlf = 0;
    var endings = input.match(newLineRe) || [];
    endings.forEach(function (ending) {
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
    });
    var preferredLineEnding = null;
    if (!cr && !lf && !crlf) {
        preferredLineEnding =
            ((platform || process.platform) === "win32") ? "\r\n" : "\n";
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
 * @param {string} lineEnding Line ending to use.
 * @returns {string} Fixed content.
 */
function applyFix(line, fixInfo, lineEnding) {
    var _a = normalizeFixInfo(fixInfo), editColumn = _a.editColumn, deleteCount = _a.deleteCount, insertText = _a.insertText;
    var editIndex = editColumn - 1;
    return (deleteCount === -1) ?
        null :
        line.slice(0, editIndex) +
            insertText.replace(/\n/g, lineEnding || "\n") +
            line.slice(editIndex + deleteCount);
}
module.exports.applyFix = applyFix;
// Applies as many fixes as possible to the input lines
module.exports.applyFixes = function applyFixes(input, errors) {
    var lineEnding = getPreferredLineEnding(input);
    var lines = input.split(newLineRe);
    // Normalize fixInfo objects
    var fixInfos = errors
        .filter(function (error) { return error.fixInfo; })
        .map(function (error) { return normalizeFixInfo(error.fixInfo, error.lineNumber); });
    // Sort bottom-to-top, line-deletes last, right-to-left, long-to-short
    fixInfos.sort(function (a, b) {
        var aDeletingLine = (a.deleteCount === -1);
        var bDeletingLine = (b.deleteCount === -1);
        return ((b.lineNumber - a.lineNumber) ||
            (aDeletingLine ? 1 : (bDeletingLine ? -1 : 0)) ||
            (b.editColumn - a.editColumn) ||
            (b.insertText.length - a.insertText.length));
    });
    // Remove duplicate entries (needed for following collapse step)
    var lastFixInfo = {};
    fixInfos = fixInfos.filter(function (fixInfo) {
        var unique = ((fixInfo.lineNumber !== lastFixInfo.lineNumber) ||
            (fixInfo.editColumn !== lastFixInfo.editColumn) ||
            (fixInfo.deleteCount !== lastFixInfo.deleteCount) ||
            (fixInfo.insertText !== lastFixInfo.insertText));
        lastFixInfo = fixInfo;
        return unique;
    });
    // Collapse insert/no-delete and no-insert/delete for same line/column
    lastFixInfo = {};
    fixInfos.forEach(function (fixInfo) {
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
    });
    fixInfos = fixInfos.filter(function (fixInfo) { return fixInfo.lineNumber; });
    // Apply all (remaining/updated) fixes
    var lastLineIndex = -1;
    var lastEditIndex = -1;
    fixInfos.forEach(function (fixInfo) {
        var lineNumber = fixInfo.lineNumber, editColumn = fixInfo.editColumn, deleteCount = fixInfo.deleteCount;
        var lineIndex = lineNumber - 1;
        var editIndex = editColumn - 1;
        if ((lineIndex !== lastLineIndex) ||
            (deleteCount === -1) ||
            ((editIndex + deleteCount) <=
                (lastEditIndex - ((deleteCount > 0) ? 0 : 1)))) {
            lines[lineIndex] = applyFix(lines[lineIndex], fixInfo, lineEnding);
        }
        lastLineIndex = lineIndex;
        lastEditIndex = editIndex;
    });
    // Return corrected input
    return lines.filter(function (line) { return line !== null; }).join(lineEnding);
};
/**
 * Gets the range and fixInfo values for reporting an error if the expected
 * text is found on the specified line.
 *
 * @param {string[]} lines Lines of Markdown content.
 * @param {number} lineIndex Line index to check.
 * @param {string} search Text to search for.
 * @param {string} replace Text to replace with.
 * @returns {Object} Range and fixInfo wrapper.
 */
function getRangeAndFixInfoIfFound(lines, lineIndex, search, replace) {
    var range = null;
    var fixInfo = null;
    var searchIndex = lines[lineIndex].indexOf(search);
    if (searchIndex !== -1) {
        var column = searchIndex + 1;
        var length = search.length;
        range = [column, length];
        fixInfo = {
            "editColumn": column,
            "deleteCount": length,
            "insertText": replace
        };
    }
    return {
        range: range,
        fixInfo: fixInfo
    };
}
module.exports.getRangeAndFixInfoIfFound = getRangeAndFixInfoIfFound;
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
    var children = parentToken.children;
    var index = children.indexOf(childToken);
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
 * Calls Object.freeze() on an object and its children.
 *
 * @param {Object} obj Object to deep freeze.
 * @returns {Object} Object passed to the function.
 */
function deepFreeze(obj) {
    var pending = [obj];
    var current = null;
    while ((current = pending.shift())) {
        Object.freeze(current);
        for (var _i = 0, _a = Object.getOwnPropertyNames(current); _i < _a.length; _i++) {
            var name = _a[_i];
            var value = current[name];
            if (value && (typeof value === "object")) {
                pending.push(value);
            }
        }
    }
    return obj;
}
module.exports.deepFreeze = deepFreeze;


/***/ }),

/***/ "../lib/cache.js":
/*!***********************!*\
  !*** ../lib/cache.js ***!
  \***********************/
/***/ ((module) => {

"use strict";
// @ts-check

var codeBlockAndSpanRanges = null;
module.exports.codeBlockAndSpanRanges = function (value) {
    if (value) {
        codeBlockAndSpanRanges = value;
    }
    return codeBlockAndSpanRanges;
};
var flattenedLists = null;
module.exports.flattenedLists = function (value) {
    if (value) {
        flattenedLists = value;
    }
    return flattenedLists;
};
var lineMetadata = null;
module.exports.lineMetadata = function (value) {
    if (value) {
        lineMetadata = value;
    }
    return lineMetadata;
};
module.exports.clear = function () {
    codeBlockAndSpanRanges = null;
    flattenedLists = null;
    lineMetadata = null;
};


/***/ }),

/***/ "../lib/constants.js":
/*!***************************!*\
  !*** ../lib/constants.js ***!
  \***************************/
/***/ ((module) => {

"use strict";
// @ts-check

module.exports.deprecatedRuleNames = ["MD002", "MD006"];
module.exports.homepage = "https://github.com/DavidAnson/markdownlint";
module.exports.version = "0.25.1";


/***/ }),

/***/ "../lib/markdownlint.js":
/*!******************************!*\
  !*** ../lib/markdownlint.js ***!
  \******************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
// @ts-check

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var path = __webpack_require__(/*! path */ "?b85c");
var promisify = (__webpack_require__(/*! util */ "?96a2").promisify);
var markdownIt = __webpack_require__(/*! markdown-it */ "markdown-it");
var deprecatedRuleNames = (__webpack_require__(/*! ./constants */ "../lib/constants.js").deprecatedRuleNames);
var rules = __webpack_require__(/*! ./rules */ "../lib/rules.js");
var helpers = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js");
var cache = __webpack_require__(/*! ./cache */ "../lib/cache.js");
// @ts-ignore
// eslint-disable-next-line camelcase, max-len, no-inline-comments, no-undef
var dynamicRequire = (typeof require === "undefined") ? __webpack_require__("../lib sync recursive") : /* c8 ignore next */ require;
// Capture native require implementation for dynamic loading of modules
/**
 * Validate the list of rules for structure and reuse.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {boolean} synchronous Whether to execute synchronously.
 * @returns {string} Error message if validation fails.
 */
function validateRuleList(ruleList, synchronous) {
    var result = null;
    if (ruleList.length === rules.length) {
        // No need to validate if only using built-in rules
        return result;
    }
    var allIds = {};
    ruleList.forEach(function forRule(rule, index) {
        var customIndex = index - rules.length;
        // eslint-disable-next-line jsdoc/require-jsdoc
        function newError(property) {
            return new Error("Property '" + property + "' of custom rule at index " +
                customIndex + " is incorrect.");
        }
        ["names", "tags"].forEach(function forProperty(property) {
            var value = rule[property];
            if (!result &&
                (!value || !Array.isArray(value) || (value.length === 0) ||
                    !value.every(helpers.isString) || value.some(helpers.isEmptyString))) {
                result = newError(property);
            }
        });
        [
            ["description", "string"],
            ["function", "function"]
        ].forEach(function forProperty(propertyInfo) {
            var property = propertyInfo[0];
            var value = rule[property];
            if (!result && (!value || (typeof value !== propertyInfo[1]))) {
                result = newError(property);
            }
        });
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
            rule.names.forEach(function forName(name) {
                var nameUpper = name.toUpperCase();
                if (!result && (allIds[nameUpper] !== undefined)) {
                    result = new Error("Name '" + name + "' of custom rule at index " +
                        customIndex + " is already used as a name or tag.");
                }
                allIds[nameUpper] = true;
            });
            rule.tags.forEach(function forTag(tag) {
                var tagUpper = tag.toUpperCase();
                if (!result && allIds[tagUpper]) {
                    result = new Error("Tag '" + tag + "' of custom rule at index " +
                        customIndex + " is already used as a name.");
                }
                allIds[tagUpper] = false;
            });
        }
    });
    return result;
}
/**
 * Creates a LintResults instance with toString for pretty display.
 *
 * @param {Rule[]} ruleList List of rules.
 * @returns {LintResults} New LintResults instance.
 */
function newResults(ruleList) {
    var lintResults = {};
    // eslint-disable-next-line jsdoc/require-jsdoc
    function toString(useAlias) {
        var ruleNameToRule = null;
        var results = [];
        var keys = Object.keys(lintResults);
        keys.sort();
        keys.forEach(function forFile(file) {
            var fileResults = lintResults[file];
            if (Array.isArray(fileResults)) {
                fileResults.forEach(function forResult(result) {
                    var ruleMoniker = result.ruleNames ?
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
                });
            }
            else {
                if (!ruleNameToRule) {
                    ruleNameToRule = {};
                    ruleList.forEach(function forRule(rule) {
                        var ruleName = rule.names[0].toUpperCase();
                        ruleNameToRule[ruleName] = rule;
                    });
                }
                Object.keys(fileResults).forEach(function forRule(ruleName) {
                    var rule = ruleNameToRule[ruleName.toUpperCase()];
                    var ruleResults = fileResults[ruleName];
                    ruleResults.forEach(function forLine(lineNumber) {
                        var nameIndex = Math.min(useAlias ? 1 : 0, rule.names.length - 1);
                        var result = file + ": " +
                            lineNumber + ": " +
                            rule.names[nameIndex] + " " +
                            rule.description;
                        results.push(result);
                    });
                });
            }
        });
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
    var frontMatterLines = [];
    if (frontMatter) {
        var frontMatterMatch = content.match(frontMatter);
        if (frontMatterMatch && !frontMatterMatch.index) {
            var contentMatched = frontMatterMatch[0];
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
 * Annotate tokens with line/lineNumber.
 *
 * @param {MarkdownItToken[]} tokens Array of markdown-it tokens.
 * @param {string[]} lines Lines of Markdown content.
 * @returns {void}
 */
function annotateTokens(tokens, lines) {
    var trMap = null;
    tokens.forEach(function forToken(token) {
        // Provide missing maps for table content
        if (token.type === "tr_open") {
            trMap = token.map;
        }
        else if (token.type === "tr_close") {
            trMap = null;
        }
        if (!token.map && trMap) {
            token.map = __spreadArray([], trMap, true);
        }
        // Adjust maps for math blocks
        if (helpers.isMathBlock(token) && token.map[1]) {
            // markdown-it-texmath plugin does not account for math_block_end
            token.map[1]++;
        }
        // Update token metadata
        if (token.map) {
            token.line = lines[token.map[0]];
            token.lineNumber = token.map[0] + 1;
            // Trim bottom of token to exclude whitespace lines
            while (token.map[1] && !((lines[token.map[1] - 1] || "").trim())) {
                token.map[1]--;
            }
            // Annotate children with lineNumber
            var lineNumber_1 = token.lineNumber;
            var codeSpanExtraLines_1 = [];
            helpers.forEachInlineCodeSpan(token.content, function handleInlineCodeSpan(code) {
                codeSpanExtraLines_1.push(code.split(helpers.newLineRe).length - 1);
            });
            (token.children || []).forEach(function forChild(child) {
                child.lineNumber = lineNumber_1;
                child.line = lines[lineNumber_1 - 1];
                if ((child.type === "softbreak") || (child.type === "hardbreak")) {
                    lineNumber_1++;
                }
                else if (child.type === "code_inline") {
                    lineNumber_1 += codeSpanExtraLines_1.shift();
                }
            });
        }
    });
}
/**
 * Map rule names/tags to canonical rule name.
 *
 * @param {Rule[]} ruleList List of rules.
 * @returns {Object.<string, string[]>} Map of alias to rule name.
 */
function mapAliasToRuleNames(ruleList) {
    var aliasToRuleNames = {};
    // const tagToRuleNames = {};
    ruleList.forEach(function forRule(rule) {
        var ruleName = rule.names[0].toUpperCase();
        // The following is useful for updating README.md:
        // console.log(
        //   "* **[" + ruleName + "](doc/Rules.md#" + ruleName.toLowerCase() +
        //    ")** *" + rule.names.slice(1).join("/") + "* - " + rule.description);
        rule.names.forEach(function forName(name) {
            var nameUpper = name.toUpperCase();
            aliasToRuleNames[nameUpper] = [ruleName];
        });
        rule.tags.forEach(function forTag(tag) {
            var tagUpper = tag.toUpperCase();
            var ruleNames = aliasToRuleNames[tagUpper] || [];
            ruleNames.push(ruleName);
            aliasToRuleNames[tagUpper] = ruleNames;
            // tagToRuleNames[tag] = ruleName;
        });
    });
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
    var defaultKey = Object.keys(config).filter(function (key) { return key.toUpperCase() === "DEFAULT"; });
    var ruleDefault = (defaultKey.length === 0) || !!config[defaultKey[0]];
    var effectiveConfig = {};
    ruleList.forEach(function (rule) {
        var ruleName = rule.names[0].toUpperCase();
        effectiveConfig[ruleName] = ruleDefault;
    });
    deprecatedRuleNames.forEach(function (ruleName) {
        effectiveConfig[ruleName] = false;
    });
    Object.keys(config).forEach(function (key) {
        var value = config[key];
        if (value) {
            if (!(value instanceof Object)) {
                value = {};
            }
        }
        else {
            value = false;
        }
        var keyUpper = key.toUpperCase();
        (aliasToRuleNames[keyUpper] || []).forEach(function (ruleName) {
            effectiveConfig[ruleName] = value;
        });
    });
    return effectiveConfig;
}
/**
 * Create a mapping of enabled rules per line.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {string[]} lines List of content lines.
 * @param {string[]} frontMatterLines List of front matter lines.
 * @param {boolean} noInlineConfig Whether to allow inline configuration.
 * @param {Configuration} config Configuration object.
 * @param {Object.<string, string[]>} aliasToRuleNames Map of alias to rule
 * names.
 * @returns {Object} Effective configuration and enabled rules per line number.
 */
function getEnabledRulesPerLineNumber(ruleList, lines, frontMatterLines, noInlineConfig, config, aliasToRuleNames) {
    // Shared variables
    var enabledRules = {};
    var capturedRules = {};
    var allRuleNames = [];
    var enabledRulesPerLineNumber = new Array(1 + frontMatterLines.length);
    // Helper functions
    // eslint-disable-next-line jsdoc/require-jsdoc
    function handleInlineConfig(input, forEachMatch, forEachLine) {
        input.forEach(function (line, lineIndex) {
            if (!noInlineConfig) {
                var match = null;
                while ((match = helpers.inlineCommentRe.exec(line))) {
                    var action = (match[1] || match[3]).toUpperCase();
                    var parameter = match[2] || match[4];
                    forEachMatch(action, parameter, lineIndex + 1);
                }
            }
            if (forEachLine) {
                forEachLine();
            }
        });
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    function configureFile(action, parameter) {
        if (action === "CONFIGURE-FILE") {
            try {
                var json = JSON.parse(parameter);
                config = __assign(__assign({}, config), json);
            }
            catch (_a) {
                // Ignore parse errors for inline configuration
            }
        }
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    function applyEnableDisable(action, parameter, state) {
        state = __assign({}, state);
        var enabled = (action.startsWith("ENABLE"));
        var items = parameter ?
            parameter.trim().toUpperCase().split(/\s+/) :
            allRuleNames;
        items.forEach(function (nameUpper) {
            (aliasToRuleNames[nameUpper] || []).forEach(function (ruleName) {
                state[ruleName] = enabled;
            });
        });
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
    function disableNextLine(action, parameter, lineNumber) {
        if (action === "DISABLE-NEXT-LINE") {
            var nextLineNumber = frontMatterLines.length + lineNumber + 1;
            enabledRulesPerLineNumber[nextLineNumber] =
                applyEnableDisable(action, parameter, enabledRulesPerLineNumber[nextLineNumber] || {});
        }
    }
    // Handle inline comments
    handleInlineConfig([lines.join("\n")], configureFile);
    var effectiveConfig = getEffectiveConfig(ruleList, config, aliasToRuleNames);
    ruleList.forEach(function (rule) {
        var ruleName = rule.names[0].toUpperCase();
        allRuleNames.push(ruleName);
        enabledRules[ruleName] = !!effectiveConfig[ruleName];
    });
    capturedRules = enabledRules;
    handleInlineConfig(lines, enableDisableFile);
    handleInlineConfig(lines, captureRestoreEnableDisable, updateLineState);
    handleInlineConfig(lines, disableNextLine);
    // Return results
    return {
        effectiveConfig: effectiveConfig,
        enabledRulesPerLineNumber: enabledRulesPerLineNumber
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
 * @param {RegExp} frontMatter Regular expression for front matter.
 * @param {boolean} handleRuleFailures Whether to handle exceptions in rules.
 * @param {boolean} noInlineConfig Whether to allow inline configuration.
 * @param {number} resultVersion Version of the LintResults object to return.
 * @param {Function} callback Callback (err, result) function.
 * @returns {void}
 */
function lintContent(ruleList, name, content, md, config, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, callback) {
    // Remove UTF-8 byte order marker (if present)
    content = content.replace(/^\uFEFF/, "");
    // Remove front matter
    var removeFrontMatterResult = removeFrontMatter(content, frontMatter);
    var frontMatterLines = removeFrontMatterResult.frontMatterLines;
    // Ignore the content of HTML comments
    content = helpers.clearHtmlCommentText(removeFrontMatterResult.content);
    // Parse content into tokens and lines
    var tokens = md.parse(content, {});
    var lines = content.split(helpers.newLineRe);
    annotateTokens(tokens, lines);
    var aliasToRuleNames = mapAliasToRuleNames(ruleList);
    var _a = getEnabledRulesPerLineNumber(ruleList, lines, frontMatterLines, noInlineConfig, config, aliasToRuleNames), effectiveConfig = _a.effectiveConfig, enabledRulesPerLineNumber = _a.enabledRulesPerLineNumber;
    // Create parameters for rules
    var params = {
        "name": helpers.deepFreeze(name),
        "tokens": helpers.deepFreeze(tokens),
        "lines": helpers.deepFreeze(lines),
        "frontMatterLines": helpers.deepFreeze(frontMatterLines)
    };
    cache.lineMetadata(helpers.getLineMetadata(params));
    cache.flattenedLists(helpers.flattenLists(params.tokens));
    cache.codeBlockAndSpanRanges(helpers.codeBlockAndSpanRanges(params, cache.lineMetadata()));
    // Function to run for each rule
    var results = [];
    // eslint-disable-next-line jsdoc/require-jsdoc
    function forRule(rule) {
        // Configure rule
        var ruleName = rule.names[0].toUpperCase();
        params.config = effectiveConfig[ruleName];
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
            var lineNumber = errorInfo.lineNumber + frontMatterLines.length;
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
            var fixInfo = errorInfo.fixInfo;
            var cleanFixInfo = {};
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
                var effectiveLineNumber = fixInfo.lineNumber || errorInfo.lineNumber;
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
                lineNumber: lineNumber,
                "ruleName": rule.names[0],
                "ruleNames": rule.names,
                "ruleDescription": rule.description,
                "ruleInformation": rule.information ? rule.information.href : null,
                "errorDetail": errorInfo.detail || null,
                "errorContext": errorInfo.context || null,
                "errorRange": errorInfo.range ? __spreadArray([], errorInfo.range, true) : null,
                "fixInfo": fixInfo ? cleanFixInfo : null
            });
        }
        // Call (possibly external) rule function to report errors
        var catchCallsOnError = function (error) { return onError({
            "lineNumber": 1,
            "detail": "This rule threw an exception: ".concat(error.message || error)
        }); };
        var invokeRuleFunction = function () { return rule.function(params, onError); };
        if (rule.asynchronous) {
            // Asynchronous rule, ensure it returns a Promise
            var ruleFunctionPromise = Promise.resolve().then(invokeRuleFunction);
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
        results.sort(function (a, b) { return (a.ruleName.localeCompare(b.ruleName) ||
            a.lineNumber - b.lineNumber); });
        if (resultVersion < 3) {
            // Remove fixInfo and multiple errors for the same rule and line number
            var noPrevious_1 = {
                "ruleName": null,
                "lineNumber": -1
            };
            results = results.filter(function (error, index, array) {
                delete error.fixInfo;
                var previous = array[index - 1] || noPrevious_1;
                return ((error.ruleName !== previous.ruleName) ||
                    (error.lineNumber !== previous.lineNumber));
            });
        }
        if (resultVersion === 0) {
            // Return a dictionary of rule->[line numbers]
            var dictionary = {};
            for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
                var error = results_1[_i];
                var ruleLines = dictionary[error.ruleName] || [];
                ruleLines.push(error.lineNumber);
                dictionary[error.ruleName] = ruleLines;
            }
            // @ts-ignore
            results = dictionary;
        }
        else if (resultVersion === 1) {
            // Use ruleAlias instead of ruleNames
            for (var _a = 0, results_2 = results; _a < results_2.length; _a++) {
                var error = results_2[_a];
                error.ruleAlias = error.ruleNames[1] || error.ruleName;
                delete error.ruleNames;
            }
        }
        else {
            // resultVersion 2 or 3: Remove unwanted ruleName
            for (var _b = 0, results_3 = results; _b < results_3.length; _b++) {
                var error = results_3[_b];
                delete error.ruleName;
            }
        }
        return results;
    }
    // Run all rules
    var ruleListAsync = ruleList.filter(function (rule) { return rule.asynchronous; });
    var ruleListSync = ruleList.filter(function (rule) { return !rule.asynchronous; });
    var ruleListAsyncFirst = __spreadArray(__spreadArray([], ruleListAsync, true), ruleListSync, true);
    var callbackSuccess = function () { return callback(null, formatResults()); };
    var callbackError = function (error) { return callback(error instanceof Error ? error : new Error(error)); };
    try {
        var ruleResults = ruleListAsyncFirst.map(forRule);
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
 * @param {RegExp} frontMatter Regular expression for front matter.
 * @param {boolean} handleRuleFailures Whether to handle exceptions in rules.
 * @param {boolean} noInlineConfig Whether to allow inline configuration.
 * @param {number} resultVersion Version of the LintResults object to return.
 * @param {Object} fs File system implementation.
 * @param {boolean} synchronous Whether to execute synchronously.
 * @param {Function} callback Callback (err, result) function.
 * @returns {void}
 */
function lintFile(ruleList, file, md, config, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, fs, synchronous, callback) {
    // eslint-disable-next-line jsdoc/require-jsdoc
    function lintContentWrapper(err, content) {
        if (err) {
            return callback(err);
        }
        return lintContent(ruleList, file, content, md, config, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, callback);
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
    var ruleList = rules.concat(options.customRules || []);
    var ruleErr = validateRuleList(ruleList, synchronous);
    if (ruleErr) {
        return callback(ruleErr);
    }
    var files = [];
    if (Array.isArray(options.files)) {
        files = __spreadArray([], options.files, true);
    }
    else if (options.files) {
        files = [String(options.files)];
    }
    var strings = options.strings || {};
    var stringsKeys = Object.keys(strings);
    var config = options.config || { "default": true };
    var frontMatter = (options.frontMatter === undefined) ?
        helpers.frontMatterRe : options.frontMatter;
    var handleRuleFailures = !!options.handleRuleFailures;
    var noInlineConfig = !!options.noInlineConfig;
    var resultVersion = (options.resultVersion === undefined) ?
        2 : options.resultVersion;
    var md = markdownIt({ "html": true });
    var markdownItPlugins = options.markdownItPlugins || [];
    markdownItPlugins.forEach(function forPlugin(plugin) {
        // @ts-ignore
        md.use.apply(md, plugin);
    });
    var fs = options.fs || __webpack_require__(/*! fs */ "?ec0a");
    var results = newResults(ruleList);
    var done = false;
    var concurrency = 0;
    // eslint-disable-next-line jsdoc/require-jsdoc
    function lintWorker() {
        var currentItem = null;
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
            lintFile(ruleList, currentItem, md, config, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, fs, synchronous, lintWorkerCallback);
        }
        else if (stringsKeys.length > 0) {
            // Lint next string
            concurrency++;
            currentItem = stringsKeys.shift();
            lintContent(ruleList, currentItem, strings[currentItem] || "", md, config, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, lintWorkerCallback);
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
    return null;
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
var markdownlintPromisify = promisify && promisify(markdownlint);
/**
 * Lint specified Markdown files.
 *
 * @param {Options} options Configuration options.
 * @returns {Promise<LintResults>} Results object.
 */
function markdownlintPromise(options) {
    return markdownlintPromisify(options);
}
/**
 * Lint specified Markdown files synchronously.
 *
 * @param {Options} options Configuration options.
 * @returns {LintResults} Results object.
 */
function markdownlintSync(options) {
    var results = null;
    lintInput(options, true, function callback(error, res) {
        if (error) {
            throw error;
        }
        results = res;
    });
    return results;
}
/**
 * Parse the content of a configuration file.
 *
 * @param {string} name Name of the configuration file.
 * @param {string} content Configuration content.
 * @param {ConfigurationParser[]} parsers Parsing function(s).
 * @returns {Object} Configuration object and error message.
 */
function parseConfiguration(name, content, parsers) {
    var config = null;
    var message = "";
    var errors = [];
    var index = 0;
    // Try each parser
    (parsers || [JSON.parse]).every(function (parser) {
        try {
            config = parser(content);
        }
        catch (error) {
            errors.push("Parser ".concat(index++, ": ").concat(error.message));
        }
        return !config;
    });
    // Message if unable to parse
    if (!config) {
        errors.unshift("Unable to parse '".concat(name, "'"));
        message = errors.join("; ");
    }
    return {
        config: config,
        message: message
    };
}
/**
 * Resolve referenced "extends" path in a configuration file
 * using path.resolve() with require.resolve() as a fallback.
 *
 * @param {string} configFile Configuration file name.
 * @param {string} referenceId Referenced identifier to resolve.
 * @param {Object} fs File system implementation.
 * @param {ResolveConfigExtendsCallback} [callback] Callback (err, result)
 * function.
 * @returns {void}
 */
function resolveConfigExtends(configFile, referenceId, fs, callback) {
    var configFileDirname = path.dirname(configFile);
    var resolvedExtendsFile = path.resolve(configFileDirname, referenceId);
    fs.access(resolvedExtendsFile, function (err) {
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
    var configFileDirname = path.dirname(configFile);
    var resolvedExtendsFile = path.resolve(configFileDirname, referenceId);
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
            parsers = null;
        }
    }
    if (!fs) {
        fs = __webpack_require__(/*! fs */ "?ec0a");
    }
    // Read file
    fs.readFile(file, "utf8", function (err, content) {
        if (err) {
            return callback(err);
        }
        // Try to parse file
        // @ts-ignore
        var _a = parseConfiguration(file, content, parsers), config = _a.config, message = _a.message;
        if (!config) {
            return callback(new Error(message));
        }
        // Extend configuration
        var configExtends = config.extends;
        if (configExtends) {
            delete config.extends;
            return resolveConfigExtends(file, configExtends, fs, function (_, resolvedExtends) { return readConfig(resolvedExtends, parsers, fs, function (errr, extendsConfig) {
                if (errr) {
                    return callback(errr);
                }
                return callback(null, __assign(__assign({}, extendsConfig), config));
            }); });
        }
        return callback(null, config);
    });
}
var readConfigPromisify = promisify && promisify(readConfig);
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
        fs = __webpack_require__(/*! fs */ "?ec0a");
    }
    // Read file
    var content = fs.readFileSync(file, "utf8");
    // Try to parse file
    var _a = parseConfiguration(file, content, parsers), config = _a.config, message = _a.message;
    if (!config) {
        throw new Error(message);
    }
    // Extend configuration
    var configExtends = config.extends;
    if (configExtends) {
        delete config.extends;
        var resolvedExtends = resolveConfigExtendsSync(file, configExtends, fs);
        return __assign(__assign({}, readConfigSync(resolvedExtends, parsers, fs)), config);
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorDetailIf = _a.addErrorDetailIf, filterTokens = _a.filterTokens;
module.exports = {
    "names": ["MD001", "heading-increment", "header-increment"],
    "description": "Heading levels should only increment by one level at a time",
    "tags": ["headings", "headers"],
    "function": function MD001(params, onError) {
        var prevLevel = 0;
        filterTokens(params, "heading_open", function forToken(token) {
            var level = Number.parseInt(token.tag.slice(1), 10);
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

var addErrorDetailIf = (__webpack_require__(/*! ../helpers */ "../helpers/helpers.js").addErrorDetailIf);
module.exports = {
    "names": ["MD002", "first-heading-h1", "first-header-h1"],
    "description": "First heading should be a top-level heading",
    "tags": ["headings", "headers"],
    "function": function MD002(params, onError) {
        var level = Number(params.config.level || 1);
        var tag = "h" + level;
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorDetailIf = _a.addErrorDetailIf, filterTokens = _a.filterTokens, headingStyleFor = _a.headingStyleFor;
module.exports = {
    "names": ["MD003", "heading-style", "header-style"],
    "description": "Heading style",
    "tags": ["headings", "headers"],
    "function": function MD003(params, onError) {
        var style = String(params.config.style || "consistent");
        filterTokens(params, "heading_open", function forToken(token) {
            var styleForToken = headingStyleFor(token);
            if (style === "consistent") {
                style = styleForToken;
            }
            if (styleForToken !== style) {
                var h12 = /h[12]/.test(token.tag);
                var setextWithAtx = (style === "setext_with_atx") &&
                    ((h12 && (styleForToken === "setext")) ||
                        (!h12 && (styleForToken === "atx")));
                var setextWithAtxClosed = (style === "setext_with_atx_closed") &&
                    ((h12 && (styleForToken === "setext")) ||
                        (!h12 && (styleForToken === "atx_closed")));
                if (!setextWithAtx && !setextWithAtxClosed) {
                    var expected = style;
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorDetailIf = _a.addErrorDetailIf, listItemMarkerRe = _a.listItemMarkerRe, unorderedListStyleFor = _a.unorderedListStyleFor;
var flattenedLists = (__webpack_require__(/*! ./cache */ "../lib/cache.js").flattenedLists);
var expectedStyleToMarker = {
    "dash": "-",
    "plus": "+",
    "asterisk": "*"
};
var differentItemStyle = {
    "dash": "plus",
    "plus": "asterisk",
    "asterisk": "dash"
};
var validStyles = Object.keys(expectedStyleToMarker);
module.exports = {
    "names": ["MD004", "ul-style"],
    "description": "Unordered list style",
    "tags": ["bullet", "ul"],
    "function": function MD004(params, onError) {
        var style = String(params.config.style || "consistent");
        var expectedStyle = style;
        var nestingStyles = [];
        flattenedLists().forEach(function (list) {
            if (list.unordered) {
                if (expectedStyle === "consistent") {
                    expectedStyle = unorderedListStyleFor(list.items[0]);
                }
                list.items.forEach(function (item) {
                    var itemStyle = unorderedListStyleFor(item);
                    if (style === "sublist") {
                        var nesting = list.nesting;
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
                    var range = null;
                    var fixInfo = null;
                    var match = item.line.match(listItemMarkerRe);
                    if (match) {
                        var column = match.index + 1;
                        var length = match[0].length;
                        range = [column, length];
                        fixInfo = {
                            "editColumn": match[1].length + 1,
                            "deleteCount": 1,
                            "insertText": expectedStyleToMarker[expectedStyle]
                        };
                    }
                    addErrorDetailIf(onError, item.lineNumber, expectedStyle, itemStyle, null, null, range, fixInfo);
                });
            }
        });
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addError = _a.addError, addErrorDetailIf = _a.addErrorDetailIf, indentFor = _a.indentFor, listItemMarkerRe = _a.listItemMarkerRe, orderedListItemMarkerRe = _a.orderedListItemMarkerRe, rangeFromRegExp = _a.rangeFromRegExp;
var flattenedLists = (__webpack_require__(/*! ./cache */ "../lib/cache.js").flattenedLists);
module.exports = {
    "names": ["MD005", "list-indent"],
    "description": "Inconsistent indentation for list items at the same level",
    "tags": ["bullet", "ul", "indentation"],
    "function": function MD005(params, onError) {
        flattenedLists().forEach(function (list) {
            var expectedIndent = list.indent;
            var expectedEnd = 0;
            var actualEnd = -1;
            var endMatching = false;
            list.items.forEach(function (item) {
                var line = item.line, lineNumber = item.lineNumber;
                var actualIndent = indentFor(item);
                var match = null;
                if (list.unordered) {
                    addErrorDetailIf(onError, lineNumber, expectedIndent, actualIndent, null, null, rangeFromRegExp(line, listItemMarkerRe)
                    // No fixInfo; MD007 handles this scenario better
                    );
                }
                else if ((match = orderedListItemMarkerRe.exec(line))) {
                    actualEnd = match[0].length;
                    expectedEnd = expectedEnd || actualEnd;
                    var markerLength = match[1].length + 1;
                    if ((expectedIndent !== actualIndent) || endMatching) {
                        if (expectedEnd === actualEnd) {
                            endMatching = true;
                        }
                        else {
                            var detail = endMatching ?
                                "Expected: (".concat(expectedEnd, "); Actual: (").concat(actualEnd, ")") :
                                "Expected: ".concat(expectedIndent, "; Actual: ").concat(actualIndent);
                            var expected = endMatching ?
                                expectedEnd - markerLength :
                                expectedIndent;
                            var actual = endMatching ?
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
            });
        });
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorDetailIf = _a.addErrorDetailIf, listItemMarkerRe = _a.listItemMarkerRe, rangeFromRegExp = _a.rangeFromRegExp;
var flattenedLists = (__webpack_require__(/*! ./cache */ "../lib/cache.js").flattenedLists);
module.exports = {
    "names": ["MD006", "ul-start-left"],
    "description": "Consider starting bulleted lists at the beginning of the line",
    "tags": ["bullet", "ul", "indentation"],
    "function": function MD006(params, onError) {
        flattenedLists().forEach(function (list) {
            if (list.unordered && !list.nesting && (list.indent !== 0)) {
                list.items.forEach(function (item) {
                    var lineNumber = item.lineNumber, line = item.line;
                    addErrorDetailIf(onError, lineNumber, 0, list.indent, null, null, rangeFromRegExp(line, listItemMarkerRe), {
                        "deleteCount": line.length - line.trimStart().length
                    });
                });
            }
        });
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorDetailIf = _a.addErrorDetailIf, indentFor = _a.indentFor, listItemMarkerRe = _a.listItemMarkerRe;
var flattenedLists = (__webpack_require__(/*! ./cache */ "../lib/cache.js").flattenedLists);
module.exports = {
    "names": ["MD007", "ul-indent"],
    "description": "Unordered list indentation",
    "tags": ["bullet", "ul", "indentation"],
    "function": function MD007(params, onError) {
        var indent = Number(params.config.indent || 2);
        var startIndented = !!params.config.start_indented;
        var startIndent = Number(params.config.start_indent || indent);
        flattenedLists().forEach(function (list) {
            if (list.unordered && list.parentsUnordered) {
                list.items.forEach(function (item) {
                    var lineNumber = item.lineNumber, line = item.line;
                    var expectedIndent = (startIndented ? startIndent : 0) +
                        (list.nesting * indent);
                    var actualIndent = indentFor(item);
                    var range = null;
                    var editColumn = 1;
                    var match = line.match(listItemMarkerRe);
                    if (match) {
                        range = [1, match[0].length];
                        editColumn += match[1].length - actualIndent;
                    }
                    addErrorDetailIf(onError, lineNumber, expectedIndent, actualIndent, null, null, range, {
                        editColumn: editColumn,
                        "deleteCount": actualIndent,
                        "insertText": "".padEnd(expectedIndent)
                    });
                });
            }
        });
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addError = _a.addError, filterTokens = _a.filterTokens, forEachInlineCodeSpan = _a.forEachInlineCodeSpan, forEachLine = _a.forEachLine, includesSorted = _a.includesSorted, newLineRe = _a.newLineRe, numericSortAscending = _a.numericSortAscending;
var lineMetadata = (__webpack_require__(/*! ./cache */ "../lib/cache.js").lineMetadata);
module.exports = {
    "names": ["MD009", "no-trailing-spaces"],
    "description": "Trailing spaces",
    "tags": ["whitespace"],
    "function": function MD009(params, onError) {
        var brSpaces = params.config.br_spaces;
        brSpaces = Number((brSpaces === undefined) ? 2 : brSpaces);
        var listItemEmptyLines = !!params.config.list_item_empty_lines;
        var strict = !!params.config.strict;
        var listItemLineNumbers = [];
        if (listItemEmptyLines) {
            filterTokens(params, "list_item_open", function (token) {
                for (var i = token.map[0]; i < token.map[1]; i++) {
                    listItemLineNumbers.push(i + 1);
                }
            });
            listItemLineNumbers.sort(numericSortAscending);
        }
        var paragraphLineNumbers = [];
        var codeInlineLineNumbers = [];
        if (strict) {
            filterTokens(params, "paragraph_open", function (token) {
                for (var i = token.map[0]; i < token.map[1] - 1; i++) {
                    paragraphLineNumbers.push(i + 1);
                }
            });
            paragraphLineNumbers.sort(numericSortAscending);
            filterTokens(params, "inline", function (token) {
                if (token.children.some(function (child) { return child.type === "code_inline"; })) {
                    var tokenLines = params.lines.slice(token.map[0], token.map[1]);
                    forEachInlineCodeSpan(tokenLines.join("\n"), function (code, lineIndex) {
                        var codeLineCount = code.split(newLineRe).length;
                        for (var i = 0; i < codeLineCount; i++) {
                            codeInlineLineNumbers.push(token.lineNumber + lineIndex + i);
                        }
                    });
                }
            });
            codeInlineLineNumbers.sort(numericSortAscending);
        }
        var expected = (brSpaces < 2) ? 0 : brSpaces;
        forEachLine(lineMetadata(), function (line, lineIndex, inCode) {
            var lineNumber = lineIndex + 1;
            var trailingSpaces = line.length - line.trimEnd().length;
            if (trailingSpaces &&
                !inCode &&
                !includesSorted(listItemLineNumbers, lineNumber) &&
                ((expected !== trailingSpaces) ||
                    (strict &&
                        (!includesSorted(paragraphLineNumbers, lineNumber) ||
                            includesSorted(codeInlineLineNumbers, lineNumber))))) {
                var column = line.length - trailingSpaces + 1;
                addError(onError, lineNumber, "Expected: " + (expected === 0 ? "" : "0 or ") +
                    expected + "; Actual: " + trailingSpaces, null, [column, trailingSpaces], {
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addError = _a.addError, forEachLine = _a.forEachLine, overlapsAnyRange = _a.overlapsAnyRange;
var _b = __webpack_require__(/*! ./cache */ "../lib/cache.js"), codeBlockAndSpanRanges = _b.codeBlockAndSpanRanges, lineMetadata = _b.lineMetadata;
var tabRe = /\t+/g;
module.exports = {
    "names": ["MD010", "no-hard-tabs"],
    "description": "Hard tabs",
    "tags": ["whitespace", "hard_tab"],
    "function": function MD010(params, onError) {
        var codeBlocks = params.config.code_blocks;
        var includeCode = (codeBlocks === undefined) ? true : !!codeBlocks;
        var spacesPerTab = params.config.spaces_per_tab;
        var spaceMultiplier = (spacesPerTab === undefined) ?
            1 :
            Math.max(0, Number(spacesPerTab));
        var exclusions = includeCode ? [] : codeBlockAndSpanRanges();
        forEachLine(lineMetadata(), function (line, lineIndex, inCode) {
            if (includeCode || !inCode) {
                var match = null;
                while ((match = tabRe.exec(line)) !== null) {
                    var index = match.index;
                    var column = index + 1;
                    var length = match[0].length;
                    if (!overlapsAnyRange(exclusions, lineIndex, index, length)) {
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addError = _a.addError, forEachLine = _a.forEachLine, overlapsAnyRange = _a.overlapsAnyRange;
var _b = __webpack_require__(/*! ./cache */ "../lib/cache.js"), codeBlockAndSpanRanges = _b.codeBlockAndSpanRanges, lineMetadata = _b.lineMetadata;
var reversedLinkRe = /(^|[^\\])\(([^)]+)\)\[([^\]^][^\]]*)](?!\()/g;
module.exports = {
    "names": ["MD011", "no-reversed-links"],
    "description": "Reversed link syntax",
    "tags": ["links"],
    "function": function MD011(params, onError) {
        var exclusions = codeBlockAndSpanRanges();
        forEachLine(lineMetadata(), function (line, lineIndex, inCode, onFence) {
            if (!inCode && !onFence) {
                var match = null;
                while ((match = reversedLinkRe.exec(line)) !== null) {
                    var reversedLink = match[0], preChar = match[1], linkText = match[2], linkDestination = match[3];
                    var index = match.index + preChar.length;
                    var length = match[0].length - preChar.length;
                    if (!linkText.endsWith("\\") &&
                        !linkDestination.endsWith("\\") &&
                        !overlapsAnyRange(exclusions, lineIndex, index, length)) {
                        addError(onError, lineIndex + 1, reversedLink.slice(preChar.length), null, [index + 1, length], {
                            "editColumn": index + 1,
                            "deleteCount": length,
                            "insertText": "[".concat(linkText, "](").concat(linkDestination, ")")
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorDetailIf = _a.addErrorDetailIf, forEachLine = _a.forEachLine;
var lineMetadata = (__webpack_require__(/*! ./cache */ "../lib/cache.js").lineMetadata);
module.exports = {
    "names": ["MD012", "no-multiple-blanks"],
    "description": "Multiple consecutive blank lines",
    "tags": ["whitespace", "blank_lines"],
    "function": function MD012(params, onError) {
        var maximum = Number(params.config.maximum || 1);
        var count = 0;
        forEachLine(lineMetadata(), function (line, lineIndex, inCode) {
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorDetailIf = _a.addErrorDetailIf, filterTokens = _a.filterTokens, forEachHeading = _a.forEachHeading, forEachLine = _a.forEachLine, includesSorted = _a.includesSorted;
var lineMetadata = (__webpack_require__(/*! ./cache */ "../lib/cache.js").lineMetadata);
var longLineRePrefix = "^.{";
var longLineRePostfixRelaxed = "}.*\\s.*$";
var longLineRePostfixStrict = "}.+$";
var labelRe = /^\s*\[.*[^\\]]:/;
var linkOrImageOnlyLineRe = /^[es]*(lT?L|I)[ES]*$/;
var sternModeRe = /^([#>\s]*\s)?\S*$/;
var tokenTypeMap = {
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
        var lineLength = Number(params.config.line_length || 80);
        var headingLineLength = Number(params.config.heading_line_length || lineLength);
        var codeLineLength = Number(params.config.code_block_line_length || lineLength);
        var strict = !!params.config.strict;
        var stern = !!params.config.stern;
        var longLineRePostfix = (strict || stern) ? longLineRePostfixStrict : longLineRePostfixRelaxed;
        var longLineRe = new RegExp(longLineRePrefix + lineLength + longLineRePostfix);
        var longHeadingLineRe = new RegExp(longLineRePrefix + headingLineLength + longLineRePostfix);
        var longCodeLineRe = new RegExp(longLineRePrefix + codeLineLength + longLineRePostfix);
        var codeBlocks = params.config.code_blocks;
        var includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
        var tables = params.config.tables;
        var includeTables = (tables === undefined) ? true : !!tables;
        var headings = params.config.headings;
        if (headings === undefined) {
            headings = params.config.headers;
        }
        var includeHeadings = (headings === undefined) ? true : !!headings;
        var headingLineNumbers = [];
        forEachHeading(params, function (heading) {
            headingLineNumbers.push(heading.lineNumber);
        });
        var linkOnlyLineNumbers = [];
        filterTokens(params, "inline", function (token) {
            var childTokenTypes = "";
            token.children.forEach(function (child) {
                if (child.type !== "text" || child.content !== "") {
                    childTokenTypes += tokenTypeMap[child.type] || "x";
                }
            });
            if (linkOrImageOnlyLineRe.test(childTokenTypes)) {
                linkOnlyLineNumbers.push(token.lineNumber);
            }
        });
        forEachLine(lineMetadata(), function (line, lineIndex, inCode, onFence, inTable) {
            var lineNumber = lineIndex + 1;
            var isHeading = includesSorted(headingLineNumbers, lineNumber);
            var length = inCode ?
                codeLineLength :
                (isHeading ? headingLineLength : lineLength);
            var lengthRe = inCode ?
                longCodeLineRe :
                (isHeading ? longHeadingLineRe : longLineRe);
            if ((includeCodeBlocks || !inCode) &&
                (includeTables || !inTable) &&
                (includeHeadings || !isHeading) &&
                (strict ||
                    (!(stern && sternModeRe.test(line)) &&
                        !includesSorted(linkOnlyLineNumbers, lineNumber) &&
                        !labelRe.test(line))) &&
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorContext = _a.addErrorContext, filterTokens = _a.filterTokens;
var dollarCommandRe = /^(\s*)(\$\s+)/;
module.exports = {
    "names": ["MD014", "commands-show-output"],
    "description": "Dollar signs used before commands without showing output",
    "tags": ["code"],
    "function": function MD014(params, onError) {
        ["code_block", "fence"].forEach(function (type) {
            filterTokens(params, type, function (token) {
                var margin = (token.type === "fence") ? 1 : 0;
                var dollarInstances = [];
                var allDollars = true;
                for (var i = token.map[0] + margin; i < token.map[1] - margin; i++) {
                    var line = params.lines[i];
                    var lineTrim = line.trim();
                    if (lineTrim) {
                        var match = dollarCommandRe.exec(line);
                        if (match) {
                            var column = match[1].length + 1;
                            var length = match[2].length;
                            dollarInstances.push([i, lineTrim, column, length]);
                        }
                        else {
                            allDollars = false;
                        }
                    }
                }
                if (allDollars) {
                    dollarInstances.forEach(function (instance) {
                        var i = instance[0], lineTrim = instance[1], column = instance[2], length = instance[3];
                        addErrorContext(onError, i + 1, lineTrim, null, null, [column, length], {
                            "editColumn": column,
                            "deleteCount": length
                        });
                    });
                }
            });
        });
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorContext = _a.addErrorContext, forEachLine = _a.forEachLine;
var lineMetadata = (__webpack_require__(/*! ./cache */ "../lib/cache.js").lineMetadata);
module.exports = {
    "names": ["MD018", "no-missing-space-atx"],
    "description": "No space after hash on atx style heading",
    "tags": ["headings", "headers", "atx", "spaces"],
    "function": function MD018(params, onError) {
        forEachLine(lineMetadata(), function (line, lineIndex, inCode) {
            if (!inCode &&
                /^#+[^# \t]/.test(line) &&
                !/#\s*$/.test(line) &&
                !line.startsWith("#️⃣")) {
                var hashCount = /^#+/.exec(line)[0].length;
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorContext = _a.addErrorContext, filterTokens = _a.filterTokens, headingStyleFor = _a.headingStyleFor;
module.exports = {
    "names": ["MD019", "no-multiple-space-atx"],
    "description": "Multiple spaces after hash on atx style heading",
    "tags": ["headings", "headers", "atx", "spaces"],
    "function": function MD019(params, onError) {
        filterTokens(params, "heading_open", function (token) {
            if (headingStyleFor(token) === "atx") {
                var line = token.line, lineNumber = token.lineNumber;
                var match = /^(#+)([ \t]{2,})(?:\S)/.exec(line);
                if (match) {
                    var hashLength = match[1]["length"], spacesLength = match[2]["length"];
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorContext = _a.addErrorContext, forEachLine = _a.forEachLine;
var lineMetadata = (__webpack_require__(/*! ./cache */ "../lib/cache.js").lineMetadata);
module.exports = {
    "names": ["MD020", "no-missing-space-closed-atx"],
    "description": "No space inside hashes on closed atx style heading",
    "tags": ["headings", "headers", "atx_closed", "spaces"],
    "function": function MD020(params, onError) {
        forEachLine(lineMetadata(), function (line, lineIndex, inCode) {
            if (!inCode) {
                var match = /^(#+)([ \t]*)([^#]*?[^#\\])([ \t]*)((?:\\#)?)(#+)(\s*)$/.exec(line);
                if (match) {
                    var leftHash = match[1], leftSpaceLength = match[2]["length"], content = match[3], rightSpaceLength = match[4]["length"], rightEscape = match[5], rightHash = match[6], trailSpaceLength = match[7]["length"];
                    var leftHashLength = leftHash.length;
                    var rightHashLength = rightHash.length;
                    var left = !leftSpaceLength;
                    var right = !rightSpaceLength || rightEscape;
                    var rightEscapeReplacement = rightEscape ? "".concat(rightEscape, " ") : "";
                    if (left || right) {
                        var range = left ?
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
                            "insertText": "".concat(leftHash, " ").concat(content, " ").concat(rightEscapeReplacement).concat(rightHash)
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorContext = _a.addErrorContext, filterTokens = _a.filterTokens, headingStyleFor = _a.headingStyleFor;
module.exports = {
    "names": ["MD021", "no-multiple-space-closed-atx"],
    "description": "Multiple spaces inside hashes on closed atx style heading",
    "tags": ["headings", "headers", "atx_closed", "spaces"],
    "function": function MD021(params, onError) {
        filterTokens(params, "heading_open", function (token) {
            if (headingStyleFor(token) === "atx_closed") {
                var line = token.line, lineNumber = token.lineNumber;
                var match = /^(#+)([ \t]+)([^#]+?)([ \t]+)(#+)(\s*)$/.exec(line);
                if (match) {
                    var leftHash = match[1], leftSpaceLength = match[2]["length"], content = match[3], rightSpaceLength = match[4]["length"], rightHash = match[5], trailSpaceLength = match[6]["length"];
                    var left = leftSpaceLength > 1;
                    var right = rightSpaceLength > 1;
                    if (left || right) {
                        var length = line.length;
                        var leftHashLength = leftHash.length;
                        var rightHashLength = rightHash.length;
                        var range = left ?
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
                            "insertText": "".concat(leftHash, " ").concat(content, " ").concat(rightHash)
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorDetailIf = _a.addErrorDetailIf, filterTokens = _a.filterTokens, isBlankLine = _a.isBlankLine;
module.exports = {
    "names": ["MD022", "blanks-around-headings", "blanks-around-headers"],
    "description": "Headings should be surrounded by blank lines",
    "tags": ["headings", "headers", "blank_lines"],
    "function": function MD022(params, onError) {
        var linesAbove = params.config.lines_above;
        linesAbove = Number((linesAbove === undefined) ? 1 : linesAbove);
        var linesBelow = params.config.lines_below;
        linesBelow = Number((linesBelow === undefined) ? 1 : linesBelow);
        var lines = params.lines;
        filterTokens(params, "heading_open", function (token) {
            var _a = token.map, topIndex = _a[0], nextIndex = _a[1];
            var actualAbove = 0;
            for (var i = 0; i < linesAbove; i++) {
                if (isBlankLine(lines[topIndex - i - 1])) {
                    actualAbove++;
                }
            }
            addErrorDetailIf(onError, topIndex + 1, linesAbove, actualAbove, "Above", lines[topIndex].trim(), null, {
                "insertText": "".padEnd(linesAbove - actualAbove, "\n")
            });
            var actualBelow = 0;
            for (var i = 0; i < linesBelow; i++) {
                if (isBlankLine(lines[nextIndex + i])) {
                    actualBelow++;
                }
            }
            addErrorDetailIf(onError, topIndex + 1, linesBelow, actualBelow, "Below", lines[topIndex].trim(), null, {
                "lineNumber": nextIndex + 1,
                "insertText": "".padEnd(linesBelow - actualBelow, "\n")
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorContext = _a.addErrorContext, filterTokens = _a.filterTokens;
var spaceBeforeHeadingRe = /^((?:\s+)|(?:[>\s]+\s\s))[^>\s]/;
module.exports = {
    "names": ["MD023", "heading-start-left", "header-start-left"],
    "description": "Headings must start at the beginning of the line",
    "tags": ["headings", "headers", "spaces"],
    "function": function MD023(params, onError) {
        filterTokens(params, "heading_open", function forToken(token) {
            var lineNumber = token.lineNumber, line = token.line;
            var match = line.match(spaceBeforeHeadingRe);
            if (match) {
                var prefixAndFirstChar = match[0], prefix = match[1];
                var deleteCount = prefix.length;
                var prefixLengthNoSpace = prefix.trimEnd().length;
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorContext = _a.addErrorContext, forEachHeading = _a.forEachHeading;
module.exports = {
    "names": ["MD024", "no-duplicate-heading", "no-duplicate-header"],
    "description": "Multiple headings with the same content",
    "tags": ["headings", "headers"],
    "function": function MD024(params, onError) {
        var siblingsOnly = !!params.config.siblings_only ||
            !!params.config.allow_different_nesting || false;
        var knownContents = [null, []];
        var lastLevel = 1;
        var knownContent = knownContents[lastLevel];
        forEachHeading(params, function (heading, content) {
            if (siblingsOnly) {
                var newLevel = heading.tag.slice(1);
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorContext = _a.addErrorContext, filterTokens = _a.filterTokens, frontMatterHasTitle = _a.frontMatterHasTitle;
module.exports = {
    "names": ["MD025", "single-title", "single-h1"],
    "description": "Multiple top-level headings in the same document",
    "tags": ["headings", "headers"],
    "function": function MD025(params, onError) {
        var level = Number(params.config.level || 1);
        var tag = "h" + level;
        var foundFrontMatterTitle = frontMatterHasTitle(params.frontMatterLines, params.config.front_matter_title);
        var hasTopLevelHeading = false;
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addError = _a.addError, allPunctuationNoQuestion = _a.allPunctuationNoQuestion, escapeForRegExp = _a.escapeForRegExp, forEachHeading = _a.forEachHeading;
var endOfLineHtmlEntityRe = /&#?[0-9a-zA-Z]+;$/;
module.exports = {
    "names": ["MD026", "no-trailing-punctuation"],
    "description": "Trailing punctuation in heading",
    "tags": ["headings", "headers"],
    "function": function MD026(params, onError) {
        var punctuation = params.config.punctuation;
        punctuation = String((punctuation === undefined) ? allPunctuationNoQuestion : punctuation);
        var trailingPunctuationRe = new RegExp("\\s*[" + escapeForRegExp(punctuation) + "]+$");
        forEachHeading(params, function (heading) {
            var line = heading.line, lineNumber = heading.lineNumber;
            var trimmedLine = line.replace(/[\s#]*$/, "");
            var match = trailingPunctuationRe.exec(trimmedLine);
            if (match && !endOfLineHtmlEntityRe.test(trimmedLine)) {
                var fullMatch = match[0];
                var column = match.index + 1;
                var length = fullMatch.length;
                addError(onError, lineNumber, "Punctuation: '".concat(fullMatch, "'"), null, [column, length], {
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorContext = _a.addErrorContext, newLineRe = _a.newLineRe;
var spaceAfterBlockQuoteRe = /^((?:\s*>)+)(\s{2,})\S/;
module.exports = {
    "names": ["MD027", "no-multiple-space-blockquote"],
    "description": "Multiple spaces after blockquote symbol",
    "tags": ["blockquote", "whitespace", "indentation"],
    "function": function MD027(params, onError) {
        var blockquoteNesting = 0;
        var listItemNesting = 0;
        params.tokens.forEach(function (token) {
            var content = token.content, lineNumber = token.lineNumber, type = token.type;
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
                var lineCount = content.split(newLineRe).length;
                for (var i = 0; i < lineCount; i++) {
                    var line = params.lines[lineNumber + i - 1];
                    var match = line.match(spaceAfterBlockQuoteRe);
                    if (match) {
                        var fullMatch = match[0], blockquoteLength = match[1]["length"], spaceLength = match[2]["length"];
                        if (!listItemNesting || (fullMatch[fullMatch.length - 1] === ">")) {
                            addErrorContext(onError, lineNumber + i, line, null, null, [1, fullMatch.length], {
                                "editColumn": blockquoteLength + 1,
                                "deleteCount": spaceLength - 1
                            });
                        }
                    }
                }
            }
        });
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

var addError = (__webpack_require__(/*! ../helpers */ "../helpers/helpers.js").addError);
module.exports = {
    "names": ["MD028", "no-blanks-blockquote"],
    "description": "Blank line inside blockquote",
    "tags": ["blockquote", "whitespace"],
    "function": function MD028(params, onError) {
        var prevToken = {};
        var prevLineNumber = null;
        params.tokens.forEach(function forToken(token) {
            if ((token.type === "blockquote_open") &&
                (prevToken.type === "blockquote_close")) {
                for (var lineNumber = prevLineNumber; lineNumber < token.lineNumber; lineNumber++) {
                    addError(onError, lineNumber);
                }
            }
            prevToken = token;
            if (token.type === "blockquote_open") {
                prevLineNumber = token.map[1] + 1;
            }
        });
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorDetailIf = _a.addErrorDetailIf, listItemMarkerRe = _a.listItemMarkerRe, orderedListItemMarkerRe = _a.orderedListItemMarkerRe, rangeFromRegExp = _a.rangeFromRegExp;
var flattenedLists = (__webpack_require__(/*! ./cache */ "../lib/cache.js").flattenedLists);
var listStyleExamples = {
    "one": "1/1/1",
    "ordered": "1/2/3",
    "zero": "0/0/0"
};
module.exports = {
    "names": ["MD029", "ol-prefix"],
    "description": "Ordered list item prefix",
    "tags": ["ol"],
    "function": function MD029(params, onError) {
        var style = String(params.config.style || "one_or_ordered");
        flattenedLists().filter(function (list) { return !list.unordered; }).forEach(function (list) {
            var items = list.items;
            var current = 1;
            var incrementing = false;
            // Check for incrementing number pattern 1/2/3 or 0/1/2
            if (items.length >= 2) {
                var first = orderedListItemMarkerRe.exec(items[0].line);
                var second = orderedListItemMarkerRe.exec(items[1].line);
                if (first && second) {
                    var firstNumber = first[1];
                    var secondNumber = second[1];
                    if ((secondNumber !== "1") || (firstNumber === "0")) {
                        incrementing = true;
                        if (firstNumber === "0") {
                            current = 0;
                        }
                    }
                }
            }
            // Determine effective style
            var listStyle = style;
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
            items.forEach(function (item) {
                var match = orderedListItemMarkerRe.exec(item.line);
                if (match) {
                    addErrorDetailIf(onError, item.lineNumber, String(current), match[1], "Style: " + listStyleExamples[listStyle], null, rangeFromRegExp(item.line, listItemMarkerRe));
                    if (listStyle === "ordered") {
                        current++;
                    }
                }
            });
        });
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

var addErrorDetailIf = (__webpack_require__(/*! ../helpers */ "../helpers/helpers.js").addErrorDetailIf);
var flattenedLists = (__webpack_require__(/*! ./cache */ "../lib/cache.js").flattenedLists);
module.exports = {
    "names": ["MD030", "list-marker-space"],
    "description": "Spaces after list markers",
    "tags": ["ol", "ul", "whitespace"],
    "function": function MD030(params, onError) {
        var ulSingle = Number(params.config.ul_single || 1);
        var olSingle = Number(params.config.ol_single || 1);
        var ulMulti = Number(params.config.ul_multi || 1);
        var olMulti = Number(params.config.ol_multi || 1);
        flattenedLists().forEach(function (list) {
            var lineCount = list.lastLineIndex - list.open.map[0];
            var allSingle = lineCount === list.items.length;
            var expectedSpaces = list.unordered ?
                (allSingle ? ulSingle : ulMulti) :
                (allSingle ? olSingle : olMulti);
            list.items.forEach(function (item) {
                var line = item.line, lineNumber = item.lineNumber;
                var match = /^[\s>]*\S+(\s*)/.exec(line);
                var matchLength = match[0]["length"], actualSpaces = match[1]["length"];
                if (matchLength < line.length) {
                    var fixInfo = null;
                    if (expectedSpaces !== actualSpaces) {
                        fixInfo = {
                            "editColumn": matchLength - actualSpaces + 1,
                            "deleteCount": actualSpaces,
                            "insertText": "".padEnd(expectedSpaces)
                        };
                    }
                    addErrorDetailIf(onError, lineNumber, expectedSpaces, actualSpaces, null, null, [1, matchLength], fixInfo);
                }
            });
        });
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorContext = _a.addErrorContext, forEachLine = _a.forEachLine, isBlankLine = _a.isBlankLine;
var lineMetadata = (__webpack_require__(/*! ./cache */ "../lib/cache.js").lineMetadata);
var codeFencePrefixRe = /^(.*?)\s*[`~]/;
module.exports = {
    "names": ["MD031", "blanks-around-fences"],
    "description": "Fenced code blocks should be surrounded by blank lines",
    "tags": ["code", "blank_lines"],
    "function": function MD031(params, onError) {
        var listItems = params.config.list_items;
        var includeListItems = (listItems === undefined) ? true : !!listItems;
        var lines = params.lines;
        forEachLine(lineMetadata(), function (line, i, inCode, onFence, inTable, inItem) {
            var onTopFence = (onFence > 0);
            var onBottomFence = (onFence < 0);
            if ((includeListItems || !inItem) &&
                ((onTopFence && !isBlankLine(lines[i - 1])) ||
                    (onBottomFence && !isBlankLine(lines[i + 1])))) {
                var _a = line.match(codeFencePrefixRe) || [], prefix = _a[1];
                var fixInfo = (prefix === undefined) ? null : {
                    "lineNumber": i + (onTopFence ? 1 : 2),
                    "insertText": "".concat(prefix, "\n")
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorContext = _a.addErrorContext, isBlankLine = _a.isBlankLine;
var flattenedLists = (__webpack_require__(/*! ./cache */ "../lib/cache.js").flattenedLists);
var quotePrefixRe = /^[>\s]*/;
module.exports = {
    "names": ["MD032", "blanks-around-lists"],
    "description": "Lists should be surrounded by blank lines",
    "tags": ["bullet", "ul", "ol", "blank_lines"],
    "function": function MD032(params, onError) {
        var lines = params.lines;
        flattenedLists().filter(function (list) { return !list.nesting; }).forEach(function (list) {
            var firstIndex = list.open.map[0];
            if (!isBlankLine(lines[firstIndex - 1])) {
                var line = lines[firstIndex];
                var quotePrefix = line.match(quotePrefixRe)[0].trimEnd();
                addErrorContext(onError, firstIndex + 1, line.trim(), null, null, null, {
                    "insertText": "".concat(quotePrefix, "\n")
                });
            }
            var lastIndex = list.lastLineIndex - 1;
            if (!isBlankLine(lines[lastIndex + 1])) {
                var line = lines[lastIndex];
                var quotePrefix = line.match(quotePrefixRe)[0].trimEnd();
                addErrorContext(onError, lastIndex + 1, line.trim(), null, null, null, {
                    "lineNumber": lastIndex + 2,
                    "insertText": "".concat(quotePrefix, "\n")
                });
            }
        });
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addError = _a.addError, forEachLine = _a.forEachLine, overlapsAnyRange = _a.overlapsAnyRange, unescapeMarkdown = _a.unescapeMarkdown;
var _b = __webpack_require__(/*! ./cache */ "../lib/cache.js"), codeBlockAndSpanRanges = _b.codeBlockAndSpanRanges, lineMetadata = _b.lineMetadata;
var htmlElementRe = /<(([A-Za-z][A-Za-z0-9-]*)(?:\s[^>]*)?)\/?>/g;
var linkDestinationRe = /]\(\s*$/;
// See https://spec.commonmark.org/0.29/#autolinks
var emailAddressRe = 
// eslint-disable-next-line max-len
/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
module.exports = {
    "names": ["MD033", "no-inline-html"],
    "description": "Inline HTML",
    "tags": ["html"],
    "function": function MD033(params, onError) {
        var allowedElements = params.config.allowed_elements;
        allowedElements = Array.isArray(allowedElements) ? allowedElements : [];
        allowedElements = allowedElements.map(function (element) { return element.toLowerCase(); });
        var exclusions = codeBlockAndSpanRanges();
        forEachLine(lineMetadata(), function (line, lineIndex, inCode) {
            var match = null;
            // eslint-disable-next-line no-unmodified-loop-condition
            while (!inCode && ((match = htmlElementRe.exec(line)) !== null)) {
                var tag = match[0], content = match[1], element = match[2];
                if (!allowedElements.includes(element.toLowerCase()) &&
                    !tag.endsWith("\\>") &&
                    !emailAddressRe.test(content) &&
                    !overlapsAnyRange(exclusions, lineIndex, match.index, match[0].length)) {
                    var prefix = line.substring(0, match.index);
                    if (!linkDestinationRe.test(prefix)) {
                        var unescaped = unescapeMarkdown(prefix + "<", "_");
                        if (!unescaped.endsWith("_")) {
                            addError(onError, lineIndex + 1, "Element: " + element, null, [match.index + 1, tag.length]);
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorContext = _a.addErrorContext, bareUrlRe = _a.bareUrlRe, filterTokens = _a.filterTokens;
module.exports = {
    "names": ["MD034", "no-bare-urls"],
    "description": "Bare URL used",
    "tags": ["links", "url"],
    "function": function MD034(params, onError) {
        filterTokens(params, "inline", function (token) {
            var inLink = false;
            token.children.forEach(function (child) {
                var content = child.content, line = child.line, lineNumber = child.lineNumber, type = child.type;
                var match = null;
                if (type === "link_open") {
                    inLink = true;
                }
                else if (type === "link_close") {
                    inLink = false;
                }
                else if ((type === "text") && !inLink) {
                    while ((match = bareUrlRe.exec(content)) !== null) {
                        var bareUrl = match[0];
                        var matchIndex = match.index;
                        var bareUrlLength = bareUrl.length;
                        // Allow "[https://example.com]" to avoid conflicts with
                        // MD011/no-reversed-links; allow quoting as another way
                        // of deliberately including a bare URL
                        var leftChar = content[matchIndex - 1];
                        var rightChar = content[matchIndex + bareUrlLength];
                        if (!((leftChar === "[") && (rightChar === "]")) &&
                            !((leftChar === "\"") && (rightChar === "\"")) &&
                            !((leftChar === "'") && (rightChar === "'"))) {
                            var index = line.indexOf(content);
                            var range = (index === -1) ? null : [
                                index + matchIndex + 1,
                                bareUrlLength
                            ];
                            var fixInfo = range ? {
                                "editColumn": range[0],
                                "deleteCount": range[1],
                                "insertText": "<".concat(bareUrl, ">")
                            } : null;
                            addErrorContext(onError, lineNumber, bareUrl, null, null, range, fixInfo);
                        }
                    }
                }
            });
        });
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorDetailIf = _a.addErrorDetailIf, filterTokens = _a.filterTokens;
module.exports = {
    "names": ["MD035", "hr-style"],
    "description": "Horizontal rule style",
    "tags": ["hr"],
    "function": function MD035(params, onError) {
        var style = String(params.config.style || "consistent");
        filterTokens(params, "hr", function (token) {
            var lineNumber = token.lineNumber, markup = token.markup;
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorContext = _a.addErrorContext, allPunctuation = _a.allPunctuation;
module.exports = {
    "names": ["MD036", "no-emphasis-as-heading", "no-emphasis-as-header"],
    "description": "Emphasis used instead of a heading",
    "tags": ["headings", "headers", "emphasis"],
    "function": function MD036(params, onError) {
        var punctuation = params.config.punctuation;
        punctuation =
            String((punctuation === undefined) ? allPunctuation : punctuation);
        var re = new RegExp("[" + punctuation + "]$");
        // eslint-disable-next-line jsdoc/require-jsdoc
        function base(token) {
            if (token.type === "paragraph_open") {
                return function inParagraph(t) {
                    // Always paragraph_open/inline/paragraph_close,
                    var children = t.children.filter(function notEmptyText(child) {
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
        var state = base;
        params.tokens.forEach(function forToken(token) {
            state = state(token);
        });
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorContext = _a.addErrorContext, emphasisMarkersInContent = _a.emphasisMarkersInContent, forEachLine = _a.forEachLine, isBlankLine = _a.isBlankLine;
var lineMetadata = (__webpack_require__(/*! ./cache */ "../lib/cache.js").lineMetadata);
var emphasisRe = /(^|[^\\]|\\\\)(?:(\*\*?\*?)|(__?_?))/g;
var embeddedUnderscoreRe = /([A-Za-z0-9])_([A-Za-z0-9])/g;
var asteriskListItemMarkerRe = /^([\s>]*)\*(\s+)/;
var leftSpaceRe = /^\s+/;
var rightSpaceRe = /\s+$/;
var tablePipeRe = /\|/;
module.exports = {
    "names": ["MD037", "no-space-in-emphasis"],
    "description": "Spaces inside emphasis markers",
    "tags": ["whitespace", "emphasis"],
    "function": function MD037(params, onError) {
        // eslint-disable-next-line init-declarations
        var effectiveEmphasisLength, emphasisIndex, emphasisKind, emphasisLength, pendingError = null;
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
            var content = line.substring(emphasisIndex, matchIndex);
            if (!emphasisLength) {
                content = content.trimStart();
            }
            if (!match) {
                content = content.trimEnd();
            }
            var leftSpace = leftSpaceRe.test(content);
            var rightSpace = rightSpaceRe.test(content);
            if ((leftSpace || rightSpace) &&
                (!inTable || !tablePipeRe.test(content))) {
                // Report the violation
                var contextStart = emphasisIndex - emphasisLength;
                var contextEnd = matchIndex + contextLength;
                var context = line.substring(contextStart, contextEnd);
                var column = contextStart + 1;
                var length = contextEnd - contextStart;
                var leftMarker = line.substring(contextStart, emphasisIndex);
                var rightMarker = match ? (match[2] || match[3]) : "";
                var fixedText = "".concat(leftMarker).concat(content.trim()).concat(rightMarker);
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
            return null;
        }
        // Initialize
        var ignoreMarkersByLine = emphasisMarkersInContent(params);
        resetRunTracking();
        forEachLine(lineMetadata(), function (line, lineIndex, inCode, onFence, inTable, inItem, onBreak, inMath) {
            var onItemStart = (inItem === 1);
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
            var patchedLine = line.replace(embeddedUnderscoreRe, "$1 $2");
            if (onItemStart) {
                // Trim overlapping '*' list item marker
                patchedLine = patchedLine.replace(asteriskListItemMarkerRe, "$1 $2");
            }
            var match = null;
            // Match all emphasis-looking runs in the line...
            while ((match = emphasisRe.exec(patchedLine))) {
                var ignoreMarkersForLine = ignoreMarkersByLine[lineIndex];
                var matchIndex = match.index + match[1].length;
                if (ignoreMarkersForLine.includes(matchIndex)) {
                    // Ignore emphasis markers inside code spans and links
                    continue;
                }
                var matchLength = match[0].length - match[1].length;
                var matchKind = (match[2] || match[3])[0];
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
                            addErrorContext.apply(void 0, pendingError);
                            pendingError = null;
                        }
                        var error = handleRunEnd(line, lineIndex, effectiveEmphasisLength, match, matchIndex, inTable);
                        if (error) {
                            // @ts-ignore
                            addErrorContext.apply(void 0, error);
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorContext = _a.addErrorContext, filterTokens = _a.filterTokens, forEachInlineCodeSpan = _a.forEachInlineCodeSpan, newLineRe = _a.newLineRe;
var leftSpaceRe = /^\s([^`]|$)/;
var rightSpaceRe = /[^`]\s$/;
var singleLeftRightSpaceRe = /^\s(?:\S.*\S|\S)\s$/;
module.exports = {
    "names": ["MD038", "no-space-in-code"],
    "description": "Spaces inside code span elements",
    "tags": ["whitespace", "code"],
    "function": function MD038(params, onError) {
        filterTokens(params, "inline", function (token) {
            if (token.children.some(function (child) { return child.type === "code_inline"; })) {
                var tokenLines_1 = params.lines.slice(token.map[0], token.map[1]);
                forEachInlineCodeSpan(tokenLines_1.join("\n"), function (code, lineIndex, columnIndex, tickCount) {
                    var rangeIndex = columnIndex - tickCount;
                    var rangeLength = code.length + (2 * tickCount);
                    var rangeLineOffset = 0;
                    var fixIndex = columnIndex;
                    var fixLength = code.length;
                    var codeLines = code.split(newLineRe);
                    var left = leftSpaceRe.test(code);
                    var right = !left && rightSpaceRe.test(code);
                    if (right && (codeLines.length > 1)) {
                        rangeIndex = 0;
                        rangeLineOffset = codeLines.length - 1;
                        fixIndex = 0;
                    }
                    var allowed = singleLeftRightSpaceRe.test(code);
                    if ((left || right) && !allowed) {
                        var codeLinesRange = codeLines[rangeLineOffset];
                        if (codeLines.length > 1) {
                            rangeLength = codeLinesRange.length + tickCount;
                            fixLength = codeLinesRange.length;
                        }
                        var context = tokenLines_1[lineIndex + rangeLineOffset]
                            .substring(rangeIndex, rangeIndex + rangeLength);
                        var codeLinesRangeTrim = codeLinesRange.trim();
                        var fixText = (codeLinesRangeTrim.startsWith("`") ? " " : "") +
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorContext = _a.addErrorContext, filterTokens = _a.filterTokens;
var spaceInLinkRe = /\[(?:\s+(?:[^\]]*?)\s*|(?:[^\]]*?)\s+)](?=((?:\([^)]*\))|(?:\[[^\]]*\])))/;
module.exports = {
    "names": ["MD039", "no-space-in-links"],
    "description": "Spaces inside link text",
    "tags": ["whitespace", "links"],
    "function": function MD039(params, onError) {
        filterTokens(params, "inline", function (token) {
            var children = token.children;
            var lineNumber = token.lineNumber;
            var inLink = false;
            var linkText = "";
            var lineIndex = 0;
            children.forEach(function (child) {
                var content = child.content, type = child.type;
                if (type === "link_open") {
                    inLink = true;
                    linkText = "";
                }
                else if (type === "link_close") {
                    inLink = false;
                    var left = linkText.trimStart().length !== linkText.length;
                    var right = linkText.trimEnd().length !== linkText.length;
                    if (left || right) {
                        var line = params.lines[lineNumber - 1];
                        var range = null;
                        var fixInfo = null;
                        var match = line.slice(lineIndex).match(spaceInLinkRe);
                        if (match) {
                            var column = match.index + lineIndex + 1;
                            var length = match[0].length;
                            range = [column, length];
                            fixInfo = {
                                "editColumn": column + 1,
                                "deleteCount": length - 2,
                                "insertText": linkText.trim()
                            };
                            lineIndex = column + length - 1;
                        }
                        addErrorContext(onError, lineNumber, "[".concat(linkText, "]"), left, right, range, fixInfo);
                    }
                }
                else if ((type === "softbreak") || (type === "hardbreak")) {
                    lineNumber++;
                    lineIndex = 0;
                }
                else if (inLink) {
                    linkText += content;
                }
            });
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorContext = _a.addErrorContext, filterTokens = _a.filterTokens;
module.exports = {
    "names": ["MD040", "fenced-code-language"],
    "description": "Fenced code blocks should have a language specified",
    "tags": ["code", "language"],
    "function": function MD040(params, onError) {
        filterTokens(params, "fence", function forToken(token) {
            if (!token.info.trim()) {
                addErrorContext(onError, token.lineNumber, token.line);
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorContext = _a.addErrorContext, frontMatterHasTitle = _a.frontMatterHasTitle;
module.exports = {
    "names": ["MD041", "first-line-heading", "first-line-h1"],
    "description": "First line in a file should be a top-level heading",
    "tags": ["headings", "headers"],
    "function": function MD041(params, onError) {
        var level = Number(params.config.level || 1);
        var tag = "h" + level;
        var foundFrontMatterTitle = frontMatterHasTitle(params.frontMatterLines, params.config.front_matter_title);
        if (!foundFrontMatterTitle) {
            var htmlHeadingRe_1 = new RegExp("^<h".concat(level, "[ />]"), "i");
            params.tokens.every(function (token) {
                var isError = false;
                if (token.type === "html_block") {
                    if (token.content.startsWith("<!--")) {
                        // Ignore leading HTML comments
                        return true;
                    }
                    else if (!htmlHeadingRe_1.test(token.content)) {
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorContext = _a.addErrorContext, filterTokens = _a.filterTokens, rangeFromRegExp = _a.rangeFromRegExp;
var emptyLinkRe = /\[[^\]]*](?:\((?:#?|(?:<>))\))/;
module.exports = {
    "names": ["MD042", "no-empty-links"],
    "description": "No empty links",
    "tags": ["links"],
    "function": function MD042(params, onError) {
        filterTokens(params, "inline", function forToken(token) {
            var inLink = false;
            var linkText = "";
            var emptyLink = false;
            token.children.forEach(function forChild(child) {
                if (child.type === "link_open") {
                    inLink = true;
                    linkText = "";
                    child.attrs.forEach(function forAttr(attr) {
                        if (attr[0] === "href" && (!attr[1] || (attr[1] === "#"))) {
                            emptyLink = true;
                        }
                    });
                }
                else if (child.type === "link_close") {
                    inLink = false;
                    if (emptyLink) {
                        addErrorContext(onError, child.lineNumber, "[" + linkText + "]()", null, null, rangeFromRegExp(child.line, emptyLinkRe));
                        emptyLink = false;
                    }
                }
                else if (inLink) {
                    linkText += child.content;
                }
            });
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorContext = _a.addErrorContext, addErrorDetailIf = _a.addErrorDetailIf, forEachHeading = _a.forEachHeading;
module.exports = {
    "names": ["MD043", "required-headings", "required-headers"],
    "description": "Required heading structure",
    "tags": ["headings", "headers"],
    "function": function MD043(params, onError) {
        var requiredHeadings = params.config.headings || params.config.headers;
        if (Array.isArray(requiredHeadings)) {
            var levels_1 = {};
            [1, 2, 3, 4, 5, 6].forEach(function (level) {
                levels_1["h" + level] = "######".substr(-level);
            });
            var i_1 = 0;
            var matchAny_1 = false;
            var hasError_1 = false;
            var anyHeadings_1 = false;
            var getExpected_1 = function () { return requiredHeadings[i_1++] || "[None]"; };
            forEachHeading(params, function (heading, content) {
                if (!hasError_1) {
                    anyHeadings_1 = true;
                    var actual = levels_1[heading.tag] + " " + content;
                    var expected = getExpected_1();
                    if (expected === "*") {
                        var nextExpected = getExpected_1();
                        if (nextExpected.toLowerCase() !== actual.toLowerCase()) {
                            matchAny_1 = true;
                            i_1--;
                        }
                    }
                    else if (expected === "+") {
                        matchAny_1 = true;
                    }
                    else if (expected.toLowerCase() === actual.toLowerCase()) {
                        matchAny_1 = false;
                    }
                    else if (matchAny_1) {
                        i_1--;
                    }
                    else {
                        addErrorDetailIf(onError, heading.lineNumber, expected, actual);
                        hasError_1 = true;
                    }
                }
            });
            var extraHeadings = requiredHeadings.length - i_1;
            if (!hasError_1 &&
                ((extraHeadings > 1) ||
                    ((extraHeadings === 1) && (requiredHeadings[i_1] !== "*"))) &&
                (anyHeadings_1 || !requiredHeadings.every(function (heading) { return heading === "*"; }))) {
                addErrorContext(onError, params.lines.length, requiredHeadings[i_1]);
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorDetailIf = _a.addErrorDetailIf, bareUrlRe = _a.bareUrlRe, escapeForRegExp = _a.escapeForRegExp, forEachLine = _a.forEachLine, overlapsAnyRange = _a.overlapsAnyRange, linkRe = _a.linkRe, linkReferenceRe = _a.linkReferenceRe;
var _b = __webpack_require__(/*! ./cache */ "../lib/cache.js"), codeBlockAndSpanRanges = _b.codeBlockAndSpanRanges, lineMetadata = _b.lineMetadata;
module.exports = {
    "names": ["MD044", "proper-names"],
    "description": "Proper names should have the correct capitalization",
    "tags": ["spelling"],
    "function": function MD044(params, onError) {
        var names = params.config.names;
        names = Array.isArray(names) ? names : [];
        names.sort(function (a, b) { return (b.length - a.length) || a.localeCompare(b); });
        var codeBlocks = params.config.code_blocks;
        var includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
        var exclusions = [];
        forEachLine(lineMetadata(), function (line, lineIndex) {
            if (linkReferenceRe.test(line)) {
                exclusions.push([lineIndex, 0, line.length]);
            }
            else {
                var match = null;
                while ((match = bareUrlRe.exec(line)) !== null) {
                    exclusions.push([lineIndex, match.index, match[0].length]);
                }
                while ((match = linkRe.exec(line)) !== null) {
                    var text = match[1], destination = match[2];
                    if (destination) {
                        exclusions.push([lineIndex, match.index + text.length, destination.length]);
                    }
                }
            }
        });
        if (!includeCodeBlocks) {
            exclusions.push.apply(exclusions, codeBlockAndSpanRanges());
        }
        var _loop_1 = function (name) {
            var escapedName = escapeForRegExp(name);
            var startNamePattern = /^\W/.test(name) ? "" : "\\b_*";
            var endNamePattern = /\W$/.test(name) ? "" : "_*\\b";
            var namePattern = "(".concat(startNamePattern, ")(").concat(escapedName, ")").concat(endNamePattern);
            var nameRe = new RegExp(namePattern, "gi");
            forEachLine(lineMetadata(), function (line, lineIndex, inCode, onFence) {
                if (includeCodeBlocks || (!inCode && !onFence)) {
                    var match = null;
                    while ((match = nameRe.exec(line)) !== null) {
                        var leftMatch = match[1], nameMatch = match[2];
                        var index = match.index + leftMatch.length;
                        var length = nameMatch.length;
                        if (!overlapsAnyRange(exclusions, lineIndex, index, length)) {
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
        };
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name = names_1[_i];
            _loop_1(name);
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addError = _a.addError, forEachInlineChild = _a.forEachInlineChild;
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

var addErrorDetailIf = (__webpack_require__(/*! ../helpers */ "../helpers/helpers.js").addErrorDetailIf);
var tokenTypeToStyle = {
    "fence": "fenced",
    "code_block": "indented"
};
module.exports = {
    "names": ["MD046", "code-block-style"],
    "description": "Code block style",
    "tags": ["code"],
    "function": function MD046(params, onError) {
        var expectedStyle = String(params.config.style || "consistent");
        params.tokens
            .filter(function (token) { return token.type === "code_block" || token.type === "fence"; })
            .forEach(function (token) {
            var lineNumber = token.lineNumber, type = token.type;
            if (expectedStyle === "consistent") {
                expectedStyle = tokenTypeToStyle[type];
            }
            addErrorDetailIf(onError, lineNumber, expectedStyle, tokenTypeToStyle[type]);
        });
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addError = _a.addError, isBlankLine = _a.isBlankLine;
module.exports = {
    "names": ["MD047", "single-trailing-newline"],
    "description": "Files should end with a single newline character",
    "tags": ["blank_lines"],
    "function": function MD047(params, onError) {
        var lastLineNumber = params.lines.length;
        var lastLine = params.lines[lastLineNumber - 1];
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

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addErrorDetailIf = _a.addErrorDetailIf, fencedCodeBlockStyleFor = _a.fencedCodeBlockStyleFor;
module.exports = {
    "names": ["MD048", "code-fence-style"],
    "description": "Code fence style",
    "tags": ["code"],
    "function": function MD048(params, onError) {
        var style = String(params.config.style || "consistent");
        var expectedStyle = style;
        params.tokens
            .filter(function (token) { return token.type === "fence"; })
            .forEach(function (fenceToken) {
            var lineNumber = fenceToken.lineNumber, markup = fenceToken.markup;
            if (expectedStyle === "consistent") {
                expectedStyle = fencedCodeBlockStyleFor(markup);
            }
            addErrorDetailIf(onError, lineNumber, expectedStyle, fencedCodeBlockStyleFor(markup));
        });
    }
};


/***/ }),

/***/ "../lib/md049.js":
/*!***********************!*\
  !*** ../lib/md049.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addError = _a.addError, emphasisOrStrongStyleFor = _a.emphasisOrStrongStyleFor, forEachInlineChild = _a.forEachInlineChild, getNextChildToken = _a.getNextChildToken, getRangeAndFixInfoIfFound = _a.getRangeAndFixInfoIfFound;
module.exports = {
    "names": ["MD049", "emphasis-style"],
    "description": "Emphasis style should be consistent",
    "tags": ["emphasis"],
    "function": function MD049(params, onError) {
        var expectedStyle = String(params.config.style || "consistent");
        forEachInlineChild(params, "em_open", function (token, parent) {
            var lineNumber = token.lineNumber, markup = token.markup;
            var markupStyle = emphasisOrStrongStyleFor(markup);
            if (expectedStyle === "consistent") {
                expectedStyle = markupStyle;
            }
            if (expectedStyle !== markupStyle) {
                var rangeAndFixInfo = {};
                var contentToken = getNextChildToken(parent, token, "text", "em_close");
                if (contentToken) {
                    var content = contentToken.content;
                    var actual = "".concat(markup).concat(content).concat(markup);
                    var expectedMarkup = (expectedStyle === "asterisk") ? "*" : "_";
                    var expected = "".concat(expectedMarkup).concat(content).concat(expectedMarkup);
                    rangeAndFixInfo = getRangeAndFixInfoIfFound(params.lines, lineNumber - 1, actual, expected);
                }
                addError(onError, lineNumber, "Expected: ".concat(expectedStyle, "; Actual: ").concat(markupStyle), null, rangeAndFixInfo.range, rangeAndFixInfo.fixInfo);
            }
        });
    }
};


/***/ }),

/***/ "../lib/md050.js":
/*!***********************!*\
  !*** ../lib/md050.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// @ts-check

var _a = __webpack_require__(/*! ../helpers */ "../helpers/helpers.js"), addError = _a.addError, emphasisOrStrongStyleFor = _a.emphasisOrStrongStyleFor, forEachInlineChild = _a.forEachInlineChild, getNextChildToken = _a.getNextChildToken, getRangeAndFixInfoIfFound = _a.getRangeAndFixInfoIfFound;
module.exports = {
    "names": ["MD050", "strong-style"],
    "description": "Strong style should be consistent",
    "tags": ["emphasis"],
    "function": function MD050(params, onError) {
        var expectedStyle = String(params.config.style || "consistent");
        forEachInlineChild(params, "strong_open", function (token, parent) {
            var lineNumber = token.lineNumber, markup = token.markup;
            var markupStyle = emphasisOrStrongStyleFor(markup);
            if (expectedStyle === "consistent") {
                expectedStyle = markupStyle;
            }
            if (expectedStyle !== markupStyle) {
                var rangeAndFixInfo = {};
                var contentToken = getNextChildToken(parent, token, "text", "strong_close");
                if (contentToken) {
                    var content = contentToken.content;
                    var actual = "".concat(markup).concat(content).concat(markup);
                    var expectedMarkup = (expectedStyle === "asterisk") ? "**" : "__";
                    var expected = "".concat(expectedMarkup).concat(content).concat(expectedMarkup);
                    rangeAndFixInfo = getRangeAndFixInfoIfFound(params.lines, lineNumber - 1, actual, expected);
                }
                addError(onError, lineNumber, "Expected: ".concat(expectedStyle, "; Actual: ").concat(markupStyle), null, rangeAndFixInfo.range, rangeAndFixInfo.fixInfo);
            }
        });
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

var _a = __webpack_require__(/*! ./constants */ "../lib/constants.js"), homepage = _a.homepage, version = _a.version;
var rules = [
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
    __webpack_require__(/*! ./md049 */ "../lib/md049.js"),
    __webpack_require__(/*! ./md050 */ "../lib/md050.js")
];
rules.forEach(function (rule) {
    var name = rule.names[0].toLowerCase();
    // eslint-disable-next-line dot-notation
    rule["information"] =
        new URL("".concat(homepage, "/blob/v").concat(version, "/doc/Rules.md#").concat(name));
});
module.exports = rules;


/***/ }),

/***/ "markdown-it":
/*!*****************************!*\
  !*** external "markdownit" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = markdownit;

/***/ }),

/***/ "?ec0a":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?b85c":
/*!**********************!*\
  !*** path (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?96a2":
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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