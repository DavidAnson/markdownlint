/* markdownlint - https://github.com/DavidAnson/markdownlint - @license MIT */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.markdownlint = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

// Alias "markdown-it" (expected) to "markdownit" (exported)
module.exports = window.markdownit;
if (!module.exports) {
  console.error("markdown-it must be loaded before markdownlint.");
}

// Stub missing implementation of util.promisify (unused here)
var util = require("util");
if (!util.promisify) {
  util.promisify = function promisify(fn) {
    return fn;
  };
}

},{"util":57}],2:[function(require,module,exports){
// @ts-check
"use strict";
var os = require("os");
// Regular expression for matching common newline characters
// See NEWLINES_RE in markdown-it/lib/rules_core/normalize.js
var newLineRe = /\r\n?|\n/g;
module.exports.newLineRe = newLineRe;
// Regular expression for matching common front matter (YAML and TOML)
module.exports.frontMatterRe =
    // eslint-disable-next-line max-len
    /((^---\s*$[^]*?^---\s*$)|(^\+\+\+\s*$[^]*?^(\+\+\+|\.\.\.)\s*$))(\r\n|\r|\n|$)/m;
// Regular expression for matching inline disable/enable comments
var inlineCommentRe = 
// eslint-disable-next-line max-len
/<!--\s*markdownlint-(?:(?:(disable|enable|capture|restore|disable-file|enable-file)((?:\s+[a-z0-9_-]+)*))|(?:(configure-file)\s+([\s\S]*?)))\s*-->/ig;
module.exports.inlineCommentRe = inlineCommentRe;
// Regular expressions for range matching
module.exports.bareUrlRe = /(?:http|ftp)s?:\/\/[^\s\]"']*(?:\/|[^\s\]"'\W])/ig;
module.exports.listItemMarkerRe = /^([\s>]*)(?:[*+-]|\d+[.)])\s+/;
module.exports.orderedListItemMarkerRe = /^[\s>]*0*(\d+)[.)]/;
// Regular expression for all instances of emphasis markers
var emphasisMarkersRe = /[_*]/g;
// Regular expression for inline links and shortcut reference links
var linkRe = /\[(?:[^[\]]|\[[^\]]*\])*\](?:\(\S*\))?/g;
// readFile options for reading with the UTF-8 encoding
module.exports.utf8Encoding = "utf8";
// All punctuation characters (normal and full-width)
module.exports.allPunctuation = ".,;:!?。，；：！？";
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
// Example: Contains nothing, whitespace, or comments
var blankLineRe = />|(?:<!--.*?-->)/g;
module.exports.isBlankLine = function isBlankLine(line) {
    // Call to String.replace follows best practices and is not a security check
    // False-positive for js/incomplete-multi-character-sanitization
    return !line || !line.trim() || !line.replace(blankLineRe, "").trim();
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
// Replaces the text of all properly-formatted HTML comments with whitespace
// This preserves the line/column information for the rest of the document
// Trailing whitespace is avoided with a '\' character in the last column
// See https://www.w3.org/TR/html5/syntax.html#comments for details
var htmlCommentBegin = "<!--";
var htmlCommentEnd = "-->";
module.exports.clearHtmlCommentText = function clearHtmlCommentText(text) {
    var i = 0;
    while ((i = text.indexOf(htmlCommentBegin, i)) !== -1) {
        var j = text.indexOf(htmlCommentEnd, i);
        if (j === -1) {
            // Un-terminated comments are treated as text
            break;
        }
        var comment = text.slice(i + htmlCommentBegin.length, j);
        if ((comment.length > 0) &&
            (comment[0] !== ">") &&
            (comment[comment.length - 1] !== "-") &&
            !comment.includes("--") &&
            (text.slice(i, j + htmlCommentEnd.length)
                .search(inlineCommentRe) === -1)) {
            var blanks = comment
                .replace(/[^\r\n]/g, " ")
                .replace(/ ([\r\n])/g, "\\$1");
            text = text.slice(0, i + htmlCommentBegin.length) +
                blanks + text.slice(j);
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
 * Return the number of characters of indent for a token.
 *
 * @param {Object} token MarkdownItToken instance.
 * @returns {number} Characters of indent.
 */
function indentFor(token) {
    var line = token.line.replace(/^[\s>]*(> |>)/, "");
    return line.length - line.trimLeft().length;
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
// Get line metadata array
module.exports.getLineMetadata = function getLineMetadata(params) {
    var lineMetadata = params.lines.map(function mapLine(line, index) {
        return [line, index, false, 0, false, false];
    });
    filterTokens(params, "fence", function forToken(token) {
        lineMetadata[token.map[0]][3] = 1;
        lineMetadata[token.map[1] - 1][3] = -1;
        for (var i = token.map[0] + 1; i < token.map[1] - 1; i++) {
            lineMetadata[i][2] = true;
        }
    });
    filterTokens(params, "code_block", function forToken(token) {
        for (var i = token.map[0]; i < token.map[1]; i++) {
            lineMetadata[i][2] = true;
        }
    });
    filterTokens(params, "table_open", function forToken(token) {
        for (var i = token.map[0]; i < token.map[1]; i++) {
            lineMetadata[i][4] = true;
        }
    });
    filterTokens(params, "list_item_open", function forToken(token) {
        var count = 1;
        for (var i = token.map[0]; i < token.map[1]; i++) {
            lineMetadata[i][5] = count;
            count++;
        }
    });
    filterTokens(params, "hr", function forToken(token) {
        lineMetadata[token.map[0]][6] = true;
    });
    return lineMetadata;
};
// Calls the provided function for each line (with context)
module.exports.forEachLine = function forEachLine(lineMetadata, handler) {
    lineMetadata.forEach(function forMetadata(metadata) {
        // Parameters: line, lineIndex, inCode, onFence, inTable, inItem, inBreak
        handler.apply(void 0, metadata);
    });
};
// Returns (nested) lists as a flat array (in order)
module.exports.flattenLists = function flattenLists(params) {
    var flattenedLists = [];
    var stack = [];
    var current = null;
    var nesting = 0;
    var nestingStack = [];
    var lastWithMap = { "map": [0, 1] };
    params.tokens.forEach(function forToken(token) {
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
 * @param {Function} handler Callback function.
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
// Returns a range object for a line by applying a RegExp
module.exports.rangeFromRegExp = function rangeFromRegExp(line, regexp) {
    var range = null;
    var match = line.match(regexp);
    if (match) {
        var column = match.index + 1;
        var length_1 = match[0].length;
        range = [column, length_1];
    }
    return range;
};
// Determines if the front matter includes a title
module.exports.frontMatterHasTitle =
    function frontMatterHasTitle(frontMatterLines, frontMatterTitlePattern) {
        var ignoreFrontMatter = (frontMatterTitlePattern !== undefined) && !frontMatterTitlePattern;
        var frontMatterTitleRe = new RegExp(String(frontMatterTitlePattern || "^\\s*title\\s*[:=]"), "i");
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
    // Search code spans
    filterTokens(params, "inline", function (token) {
        var children = token.children, lineNumber = token.lineNumber, map = token.map;
        if (children.some(function (child) { return child.type === "code_inline"; })) {
            var tokenLines = lines.slice(map[0], map[1]);
            forEachInlineCodeSpan(tokenLines.join("\n"), function (code, lineIndex, column, tickCount) {
                var codeLines = code.split(newLineRe);
                codeLines.forEach(function (codeLine, codeLineIndex) {
                    var match = null;
                    while ((match = emphasisMarkersRe.exec(codeLine))) {
                        var byLineIndex = lineNumber - 1 + lineIndex + codeLineIndex;
                        var inLine = byLine[byLineIndex] || [];
                        var codeLineOffset = codeLineIndex ? 0 : column - 1 + tickCount;
                        inLine.push(codeLineOffset + match.index);
                        byLine[byLineIndex] = inLine;
                    }
                });
            });
        }
    });
    // Search links
    lines.forEach(function (tokenLine, tokenLineIndex) {
        var linkMatch = null;
        while ((linkMatch = linkRe.exec(tokenLine))) {
            var markerMatch = null;
            while ((markerMatch = emphasisMarkersRe.exec(linkMatch[0]))) {
                var inLine = byLine[tokenLineIndex] || [];
                inLine.push(linkMatch.index + markerMatch.index);
                byLine[tokenLineIndex] = inLine;
            }
        }
    });
    return byLine;
}
module.exports.emphasisMarkersInContent = emphasisMarkersInContent;
/**
 * Gets the most common line ending, falling back to the platform default.
 *
 * @param {string} input Markdown content to analyze.
 * @returns {string} Preferred line ending.
 */
function getPreferredLineEnding(input) {
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
        preferredLineEnding = os.EOL;
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
            ((editIndex + deleteCount) < lastEditIndex) ||
            (deleteCount === -1)) {
            lines[lineIndex] = applyFix(lines[lineIndex], fixInfo, lineEnding);
        }
        lastLineIndex = lineIndex;
        lastEditIndex = editIndex;
    });
    // Return corrected input
    return lines.filter(function (line) { return line !== null; }).join(lineEnding);
};

},{"os":52}],3:[function(require,module,exports){
// @ts-check
"use strict";
var lineMetadata = null;
module.exports.lineMetadata = function (value) {
    if (value) {
        lineMetadata = value;
    }
    return lineMetadata;
};
var flattenedLists = null;
module.exports.flattenedLists = function (value) {
    if (value) {
        flattenedLists = value;
    }
    return flattenedLists;
};
module.exports.clear = function () {
    lineMetadata = null;
    flattenedLists = null;
};

},{}],4:[function(require,module,exports){
// @ts-check
"use strict";
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var fs = require("fs");
var path = require("path");
var util = require("util");
var markdownIt = require("markdown-it");
var rules = require("./rules");
var helpers = require("../helpers");
var cache = require("./cache");
var deprecatedRuleNames = ["MD002", "MD006"];
/**
 * Validate the list of rules for structure and reuse.
 *
 * @param {Rule[]} ruleList List of rules.
 * @returns {string} Error message if validation fails.
 */
function validateRuleList(ruleList) {
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
        if (!result && rule.information) {
            if (Object.getPrototypeOf(rule.information) !== URL.prototype) {
                result = newError("information");
            }
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
    var tbodyMap = null;
    tokens.forEach(function forToken(token) {
        // Handle missing maps for table body
        if (token.type === "tbody_open") {
            tbodyMap = token.map.slice();
        }
        else if ((token.type === "tr_close") && tbodyMap) {
            tbodyMap[0]++;
        }
        else if (token.type === "tbody_close") {
            tbodyMap = null;
        }
        if (tbodyMap && !token.map) {
            token.map = tbodyMap.slice();
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
    function handleInlineConfig(perLine, forEachMatch, forEachLine) {
        var input = perLine ? lines : [lines.join("\n")];
        input.forEach(function (line) {
            if (!noInlineConfig) {
                var match = null;
                while ((match = helpers.inlineCommentRe.exec(line))) {
                    var action = (match[1] || match[3]).toUpperCase();
                    var parameter = match[2] || match[4];
                    forEachMatch(action, parameter);
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
    function applyEnableDisable(action, parameter) {
        var enabled = (action.startsWith("ENABLE"));
        var items = parameter ?
            parameter.trim().toUpperCase().split(/\s+/) :
            allRuleNames;
        items.forEach(function (nameUpper) {
            (aliasToRuleNames[nameUpper] || []).forEach(function (ruleName) {
                enabledRules[ruleName] = enabled;
            });
        });
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    function enableDisableFile(action, parameter) {
        if ((action === "ENABLE-FILE") || (action === "DISABLE-FILE")) {
            applyEnableDisable(action, parameter);
        }
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    function captureRestoreEnableDisable(action, parameter) {
        if (action === "CAPTURE") {
            capturedRules = __assign({}, enabledRules);
        }
        else if (action === "RESTORE") {
            enabledRules = __assign({}, capturedRules);
        }
        else if ((action === "ENABLE") || (action === "DISABLE")) {
            enabledRules = __assign({}, enabledRules);
            applyEnableDisable(action, parameter);
        }
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    function updateLineState() {
        enabledRulesPerLineNumber.push(enabledRules);
    }
    // Handle inline comments
    handleInlineConfig(false, configureFile);
    var effectiveConfig = getEffectiveConfig(ruleList, config, aliasToRuleNames);
    ruleList.forEach(function (rule) {
        var ruleName = rule.names[0].toUpperCase();
        allRuleNames.push(ruleName);
        enabledRules[ruleName] = !!effectiveConfig[ruleName];
    });
    capturedRules = enabledRules;
    handleInlineConfig(true, enableDisableFile);
    handleInlineConfig(true, captureRestoreEnableDisable, updateLineState);
    // Return results
    return {
        effectiveConfig: effectiveConfig,
        enabledRulesPerLineNumber: enabledRulesPerLineNumber
    };
}
/**
 * Compare function for Array.prototype.sort for ascending order of errors.
 *
 * @param {LintError} a First error.
 * @param {LintError} b Second error.
 * @returns {number} Positive value if a>b, negative value if b<a, 0 otherwise.
 */
function lineNumberComparison(a, b) {
    return a.lineNumber - b.lineNumber;
}
/**
 * Filter function to include everything.
 *
 * @returns {boolean} True.
 */
function filterAllValues() {
    return true;
}
/**
 * Function to return unique values from a sorted errors array.
 *
 * @param {LintError} value Error instance.
 * @param {number} index Index in array.
 * @param {LintError[]} array Array of errors.
 * @returns {boolean} Filter value.
 */
function uniqueFilterForSortedErrors(value, index, array) {
    return (index === 0) || (value.lineNumber > array[index - 1].lineNumber);
}
/**
 * Lints a string containing Markdown content.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {string} name Identifier for the content.
 * @param {string} content Markdown content
 * @param {Object} md markdown-it instance.
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
        name: name,
        tokens: tokens,
        lines: lines,
        frontMatterLines: frontMatterLines
    };
    cache.lineMetadata(helpers.getLineMetadata(params));
    cache.flattenedLists(helpers.flattenLists(params));
    // Function to run for each rule
    var result = (resultVersion === 0) ? {} : [];
    // eslint-disable-next-line jsdoc/require-jsdoc
    function forRule(rule) {
        // Configure rule
        var ruleNameFriendly = rule.names[0];
        var ruleName = ruleNameFriendly.toUpperCase();
        params.config = effectiveConfig[ruleName];
        // eslint-disable-next-line jsdoc/require-jsdoc
        function throwError(property) {
            throw new Error("Property '" + property + "' of onError parameter is incorrect.");
        }
        var errors = [];
        // eslint-disable-next-line jsdoc/require-jsdoc
        function onError(errorInfo) {
            if (!errorInfo ||
                !helpers.isNumber(errorInfo.lineNumber) ||
                (errorInfo.lineNumber < 1) ||
                (errorInfo.lineNumber > lines.length)) {
                throwError("lineNumber");
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
            errors.push({
                "lineNumber": errorInfo.lineNumber + frontMatterLines.length,
                "detail": errorInfo.detail || null,
                "context": errorInfo.context || null,
                "range": errorInfo.range ? __spreadArrays(errorInfo.range) : null,
                "fixInfo": fixInfo ? cleanFixInfo : null
            });
        }
        // Call (possibly external) rule function
        if (handleRuleFailures) {
            try {
                rule["function"](params, onError);
            }
            catch (error) {
                onError({
                    "lineNumber": 1,
                    "detail": "This rule threw an exception: " + error.message
                });
            }
        }
        else {
            rule["function"](params, onError);
        }
        // Record any errors (significant performance benefit from length check)
        if (errors.length > 0) {
            errors.sort(lineNumberComparison);
            var filteredErrors = errors
                .filter((resultVersion === 3) ?
                filterAllValues :
                uniqueFilterForSortedErrors)
                .filter(function removeDisabledRules(error) {
                return enabledRulesPerLineNumber[error.lineNumber][ruleName];
            })
                .map(function formatResults(error) {
                if (resultVersion === 0) {
                    return error.lineNumber;
                }
                var errorObject = {};
                errorObject.lineNumber = error.lineNumber;
                if (resultVersion === 1) {
                    errorObject.ruleName = ruleNameFriendly;
                    errorObject.ruleAlias = rule.names[1] || rule.names[0];
                }
                else {
                    errorObject.ruleNames = rule.names;
                }
                errorObject.ruleDescription = rule.description;
                errorObject.ruleInformation =
                    rule.information ? rule.information.href : null;
                errorObject.errorDetail = error.detail;
                errorObject.errorContext = error.context;
                errorObject.errorRange = error.range;
                if (resultVersion === 3) {
                    errorObject.fixInfo = error.fixInfo;
                }
                return errorObject;
            });
            if (filteredErrors.length > 0) {
                if (resultVersion === 0) {
                    result[ruleNameFriendly] = filteredErrors;
                }
                else {
                    Array.prototype.push.apply(result, filteredErrors);
                }
            }
        }
    }
    // Run all rules
    try {
        ruleList.forEach(forRule);
    }
    catch (error) {
        cache.clear();
        return callback(error);
    }
    cache.clear();
    return callback(null, result);
}
/**
 * Lints a file containing Markdown content.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {string} file Path of file to lint.
 * @param {Object} md markdown-it instance.
 * @param {Configuration} config Configuration object.
 * @param {RegExp} frontMatter Regular expression for front matter.
 * @param {boolean} handleRuleFailures Whether to handle exceptions in rules.
 * @param {boolean} noInlineConfig Whether to allow inline configuration.
 * @param {number} resultVersion Version of the LintResults object to return.
 * @param {boolean} synchronous Whether to execute synchronously.
 * @param {Function} callback Callback (err, result) function.
 * @returns {void}
 */
function lintFile(ruleList, file, md, config, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, synchronous, callback) {
    // eslint-disable-next-line jsdoc/require-jsdoc
    function lintContentWrapper(err, content) {
        if (err) {
            return callback(err);
        }
        return lintContent(ruleList, file, content, md, config, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, callback);
    }
    // Make a/synchronous call to read file
    if (synchronous) {
        // @ts-ignore
        lintContentWrapper(null, fs.readFileSync(file, helpers.utf8Encoding));
    }
    else {
        fs.readFile(file, helpers.utf8Encoding, lintContentWrapper);
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
    var ruleList = rules.concat(options.customRules || []);
    var ruleErr = validateRuleList(ruleList);
    if (ruleErr) {
        return callback(ruleErr);
    }
    var files = [];
    if (Array.isArray(options.files)) {
        files = options.files.slice();
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
    var results = newResults(ruleList);
    var done = false;
    // Linting of strings is always synchronous
    var syncItem = null;
    // eslint-disable-next-line jsdoc/require-jsdoc
    function syncCallback(err, result) {
        if (err) {
            done = true;
            return callback(err);
        }
        results[syncItem] = result;
        return null;
    }
    while (!done && (syncItem = stringsKeys.shift())) {
        lintContent(ruleList, syncItem, strings[syncItem] || "", md, config, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, syncCallback);
    }
    if (synchronous) {
        // Lint files synchronously
        while (!done && (syncItem = files.shift())) {
            lintFile(ruleList, syncItem, md, config, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, synchronous, syncCallback);
        }
        return done || callback(null, results);
    }
    // Lint files asynchronously
    var concurrency = 0;
    // eslint-disable-next-line jsdoc/require-jsdoc
    function lintConcurrently() {
        var asyncItem = files.shift();
        if (done) {
            // Nothing to do
        }
        else if (asyncItem) {
            concurrency++;
            lintFile(ruleList, asyncItem, md, config, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, synchronous, function (err, result) {
                concurrency--;
                if (err) {
                    done = true;
                    return callback(err);
                }
                results[asyncItem] = result;
                lintConcurrently();
                return null;
            });
        }
        else if (concurrency === 0) {
            done = true;
            return callback(null, results);
        }
        return null;
    }
    // Testing on a Raspberry Pi 4 Model B with an artificial 5ms file access
    // delay suggests that a concurrency factor of 8 can eliminate the impact
    // of that delay (i.e., total time is the same as with no delay).
    lintConcurrently();
    lintConcurrently();
    lintConcurrently();
    lintConcurrently();
    lintConcurrently();
    lintConcurrently();
    lintConcurrently();
    lintConcurrently();
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
var markdownlintPromisify = util.promisify(markdownlint);
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
    // Try each parser
    (parsers || [JSON.parse]).every(function (parser) {
        try {
            config = parser(content);
        }
        catch (error) {
            errors.push(error.message);
        }
        return !config;
    });
    // Message if unable to parse
    if (!config) {
        errors.unshift("Unable to parse '" + name + "'");
        message = errors.join("; ");
    }
    return {
        config: config,
        message: message
    };
}
/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[] | ReadConfigCallback} parsers Parsing
 * function(s).
 * @param {ReadConfigCallback} [callback] Callback (err, result) function.
 * @returns {void}
 */
function readConfig(file, parsers, callback) {
    if (!callback) {
        // @ts-ignore
        callback = parsers;
        parsers = null;
    }
    // Read file
    fs.readFile(file, helpers.utf8Encoding, function (err, content) {
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
        var configExtends = config["extends"];
        if (configExtends) {
            delete config["extends"];
            var extendsFile = path.resolve(path.dirname(file), configExtends);
            return readConfig(extendsFile, parsers, function (errr, extendsConfig) {
                if (errr) {
                    return callback(errr);
                }
                return callback(null, __assign(__assign({}, extendsConfig), config));
            });
        }
        return callback(null, config);
    });
}
var readConfigPromisify = util.promisify(readConfig);
/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} [parsers] Parsing function(s).
 * @returns {Promise<Configuration>} Configuration object.
 */
function readConfigPromise(file, parsers) {
    // @ts-ignore
    return readConfigPromisify(file, parsers);
}
/**
 * Read specified configuration file synchronously.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} [parsers] Parsing function(s).
 * @returns {Configuration} Configuration object.
 */
function readConfigSync(file, parsers) {
    // Read file
    // @ts-ignore
    var content = fs.readFileSync(file, helpers.utf8Encoding);
    // Try to parse file
    var _a = parseConfiguration(file, content, parsers), config = _a.config, message = _a.message;
    if (!config) {
        throw new Error(message);
    }
    // Extend configuration
    var configExtends = config["extends"];
    if (configExtends) {
        delete config["extends"];
        return __assign(__assign({}, readConfigSync(path.resolve(path.dirname(file), configExtends), parsers)), config);
    }
    return config;
}
/**
 * Gets the (semantic) version of the library.
 *
 * @returns {string} SemVer string.
 */
function getVersion() {
    return require("../package.json").version;
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

},{"../helpers":2,"../package.json":50,"./cache":3,"./rules":49,"fs":51,"markdown-it":1,"path":53,"util":57}],5:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorDetailIf = _a.addErrorDetailIf, filterTokens = _a.filterTokens;
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

},{"../helpers":2}],6:[function(require,module,exports){
// @ts-check
"use strict";
var addErrorDetailIf = require("../helpers").addErrorDetailIf;
module.exports = {
    "names": ["MD002", "first-heading-h1", "first-header-h1"],
    "description": "First heading should be a top level heading",
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

},{"../helpers":2}],7:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorDetailIf = _a.addErrorDetailIf, filterTokens = _a.filterTokens, headingStyleFor = _a.headingStyleFor;
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

},{"../helpers":2}],8:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorDetailIf = _a.addErrorDetailIf, listItemMarkerRe = _a.listItemMarkerRe, rangeFromRegExp = _a.rangeFromRegExp, unorderedListStyleFor = _a.unorderedListStyleFor;
var flattenedLists = require("./cache").flattenedLists;
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
                        if (!nestingStyles[nesting] &&
                            (itemStyle !== nestingStyles[nesting - 1])) {
                            nestingStyles[nesting] = itemStyle;
                        }
                        else {
                            addErrorDetailIf(onError, item.lineNumber, nestingStyles[nesting], itemStyle, null, null, rangeFromRegExp(item.line, listItemMarkerRe));
                        }
                    }
                    else {
                        addErrorDetailIf(onError, item.lineNumber, expectedStyle, itemStyle, null, null, rangeFromRegExp(item.line, listItemMarkerRe));
                    }
                });
            }
        });
    }
};

},{"../helpers":2,"./cache":3}],9:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addError = _a.addError, addErrorDetailIf = _a.addErrorDetailIf, indentFor = _a.indentFor, listItemMarkerRe = _a.listItemMarkerRe, orderedListItemMarkerRe = _a.orderedListItemMarkerRe, rangeFromRegExp = _a.rangeFromRegExp;
var flattenedLists = require("./cache").flattenedLists;
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
                                "Expected: (" + expectedEnd + "); Actual: (" + actualEnd + ")" :
                                "Expected: " + expectedIndent + "; Actual: " + actualIndent;
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

},{"../helpers":2,"./cache":3}],10:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorDetailIf = _a.addErrorDetailIf, listItemMarkerRe = _a.listItemMarkerRe, rangeFromRegExp = _a.rangeFromRegExp;
var flattenedLists = require("./cache").flattenedLists;
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
                        "deleteCount": line.length - line.trimLeft().length
                    });
                });
            }
        });
    }
};

},{"../helpers":2,"./cache":3}],11:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorDetailIf = _a.addErrorDetailIf, indentFor = _a.indentFor, listItemMarkerRe = _a.listItemMarkerRe;
var flattenedLists = require("./cache").flattenedLists;
module.exports = {
    "names": ["MD007", "ul-indent"],
    "description": "Unordered list indentation",
    "tags": ["bullet", "ul", "indentation"],
    "function": function MD007(params, onError) {
        var indent = Number(params.config.indent || 2);
        var startIndented = !!params.config.start_indented;
        flattenedLists().forEach(function (list) {
            if (list.unordered && list.parentsUnordered) {
                list.items.forEach(function (item) {
                    var lineNumber = item.lineNumber, line = item.line;
                    var expectedNesting = list.nesting + (startIndented ? 1 : 0);
                    var expectedIndent = expectedNesting * indent;
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

},{"../helpers":2,"./cache":3}],12:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addError = _a.addError, filterTokens = _a.filterTokens, forEachInlineCodeSpan = _a.forEachInlineCodeSpan, forEachLine = _a.forEachLine, includesSorted = _a.includesSorted, newLineRe = _a.newLineRe, numericSortAscending = _a.numericSortAscending;
var lineMetadata = require("./cache").lineMetadata;
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
        var inFencedCode = 0;
        forEachLine(lineMetadata(), function (line, lineIndex, inCode, onFence) {
            inFencedCode += onFence;
            var lineNumber = lineIndex + 1;
            var trailingSpaces = line.length - line.trimRight().length;
            if ((!inCode || inFencedCode) && trailingSpaces &&
                !includesSorted(listItemLineNumbers, lineNumber)) {
                if ((expected !== trailingSpaces) ||
                    (strict &&
                        (!includesSorted(paragraphLineNumbers, lineNumber) ||
                            includesSorted(codeInlineLineNumbers, lineNumber)))) {
                    var column = line.length - trailingSpaces + 1;
                    addError(onError, lineNumber, "Expected: " + (expected === 0 ? "" : "0 or ") +
                        expected + "; Actual: " + trailingSpaces, null, [column, trailingSpaces], {
                        "editColumn": column,
                        "deleteCount": trailingSpaces
                    });
                }
            }
        });
    }
};

},{"../helpers":2,"./cache":3}],13:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addError = _a.addError, forEachLine = _a.forEachLine;
var lineMetadata = require("./cache").lineMetadata;
var tabRe = /\t+/g;
module.exports = {
    "names": ["MD010", "no-hard-tabs"],
    "description": "Hard tabs",
    "tags": ["whitespace", "hard_tab"],
    "function": function MD010(params, onError) {
        var codeBlocks = params.config.code_blocks;
        var includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
        forEachLine(lineMetadata(), function (line, lineIndex, inCode) {
            if (!inCode || includeCodeBlocks) {
                var match = null;
                while ((match = tabRe.exec(line)) !== null) {
                    var column = match.index + 1;
                    var length_1 = match[0].length;
                    addError(onError, lineIndex + 1, "Column: " + column, null, [column, length_1], {
                        "editColumn": column,
                        "deleteCount": length_1,
                        "insertText": "".padEnd(length_1)
                    });
                }
            }
        });
    }
};

},{"../helpers":2,"./cache":3}],14:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addError = _a.addError, forEachInlineChild = _a.forEachInlineChild, unescapeMarkdown = _a.unescapeMarkdown;
var reversedLinkRe = /\(([^)]+)\)\[([^\]^][^\]]*)]/g;
module.exports = {
    "names": ["MD011", "no-reversed-links"],
    "description": "Reversed link syntax",
    "tags": ["links"],
    "function": function MD011(params, onError) {
        forEachInlineChild(params, "text", function (token) {
            var lineNumber = token.lineNumber, content = token.content;
            var match = null;
            while ((match = reversedLinkRe.exec(content)) !== null) {
                var reversedLink = match[0], linkText = match[1], linkDestination = match[2];
                var line = params.lines[lineNumber - 1];
                var column = unescapeMarkdown(line).indexOf(reversedLink) + 1;
                var length_1 = reversedLink.length;
                var range = column ? [column, length_1] : null;
                var fixInfo = column ?
                    {
                        "editColumn": column,
                        "deleteCount": length_1,
                        "insertText": "[" + linkText + "](" + linkDestination + ")"
                    } :
                    null;
                addError(onError, lineNumber, reversedLink, null, range, fixInfo);
            }
        });
    }
};

},{"../helpers":2}],15:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorDetailIf = _a.addErrorDetailIf, forEachLine = _a.forEachLine;
var lineMetadata = require("./cache").lineMetadata;
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

},{"../helpers":2,"./cache":3}],16:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorDetailIf = _a.addErrorDetailIf, filterTokens = _a.filterTokens, forEachHeading = _a.forEachHeading, forEachLine = _a.forEachLine, includesSorted = _a.includesSorted;
var lineMetadata = require("./cache").lineMetadata;
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

},{"../helpers":2,"./cache":3}],17:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, filterTokens = _a.filterTokens;
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
                            var length_1 = match[2].length;
                            dollarInstances.push([i, lineTrim, column, length_1]);
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

},{"../helpers":2}],18:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, forEachLine = _a.forEachLine;
var lineMetadata = require("./cache").lineMetadata;
module.exports = {
    "names": ["MD018", "no-missing-space-atx"],
    "description": "No space after hash on atx style heading",
    "tags": ["headings", "headers", "atx", "spaces"],
    "function": function MD018(params, onError) {
        forEachLine(lineMetadata(), function (line, lineIndex, inCode) {
            if (!inCode &&
                /^#+[^#\s]/.test(line) &&
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

},{"../helpers":2,"./cache":3}],19:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, filterTokens = _a.filterTokens, headingStyleFor = _a.headingStyleFor;
module.exports = {
    "names": ["MD019", "no-multiple-space-atx"],
    "description": "Multiple spaces after hash on atx style heading",
    "tags": ["headings", "headers", "atx", "spaces"],
    "function": function MD019(params, onError) {
        filterTokens(params, "heading_open", function (token) {
            if (headingStyleFor(token) === "atx") {
                var line = token.line, lineNumber = token.lineNumber;
                var match = /^(#+)(\s{2,})(?:\S)/.exec(line);
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

},{"../helpers":2}],20:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, forEachLine = _a.forEachLine;
var lineMetadata = require("./cache").lineMetadata;
module.exports = {
    "names": ["MD020", "no-missing-space-closed-atx"],
    "description": "No space inside hashes on closed atx style heading",
    "tags": ["headings", "headers", "atx_closed", "spaces"],
    "function": function MD020(params, onError) {
        forEachLine(lineMetadata(), function (line, lineIndex, inCode) {
            if (!inCode) {
                var match = /^(#+)(\s*)([^#]*?[^#\\])(\s*)((?:\\#)?)(#+)(\s*)$/.exec(line);
                if (match) {
                    var leftHash = match[1], leftSpaceLength = match[2]["length"], content = match[3], rightSpaceLength = match[4]["length"], rightEscape = match[5], rightHash = match[6], trailSpaceLength = match[7]["length"];
                    var leftHashLength = leftHash.length;
                    var rightHashLength = rightHash.length;
                    var left = !leftSpaceLength;
                    var right = !rightSpaceLength || rightEscape;
                    var rightEscapeReplacement = rightEscape ? rightEscape + " " : "";
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
                            "insertText": leftHash + " " + content + " " + rightEscapeReplacement + rightHash
                        });
                    }
                }
            }
        });
    }
};

},{"../helpers":2,"./cache":3}],21:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, filterTokens = _a.filterTokens, headingStyleFor = _a.headingStyleFor;
module.exports = {
    "names": ["MD021", "no-multiple-space-closed-atx"],
    "description": "Multiple spaces inside hashes on closed atx style heading",
    "tags": ["headings", "headers", "atx_closed", "spaces"],
    "function": function MD021(params, onError) {
        filterTokens(params, "heading_open", function (token) {
            if (headingStyleFor(token) === "atx_closed") {
                var line = token.line, lineNumber = token.lineNumber;
                var match = /^(#+)(\s+)([^#]+?)(\s+)(#+)(\s*)$/.exec(line);
                if (match) {
                    var leftHash = match[1], leftSpaceLength = match[2]["length"], content = match[3], rightSpaceLength = match[4]["length"], rightHash = match[5], trailSpaceLength = match[6]["length"];
                    var left = leftSpaceLength > 1;
                    var right = rightSpaceLength > 1;
                    if (left || right) {
                        var length_1 = line.length;
                        var leftHashLength = leftHash.length;
                        var rightHashLength = rightHash.length;
                        var range = left ?
                            [
                                1,
                                leftHashLength + leftSpaceLength + 1
                            ] :
                            [
                                length_1 - trailSpaceLength - rightHashLength - rightSpaceLength,
                                rightSpaceLength + rightHashLength + 1
                            ];
                        addErrorContext(onError, lineNumber, line.trim(), left, right, range, {
                            "editColumn": 1,
                            "deleteCount": length_1,
                            "insertText": leftHash + " " + content + " " + rightHash
                        });
                    }
                }
            }
        });
    }
};

},{"../helpers":2}],22:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorDetailIf = _a.addErrorDetailIf, filterTokens = _a.filterTokens, isBlankLine = _a.isBlankLine;
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

},{"../helpers":2}],23:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, filterTokens = _a.filterTokens;
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
                var prefixLengthNoSpace = prefix.trimRight().length;
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

},{"../helpers":2}],24:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, forEachHeading = _a.forEachHeading;
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

},{"../helpers":2}],25:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, filterTokens = _a.filterTokens, frontMatterHasTitle = _a.frontMatterHasTitle;
module.exports = {
    "names": ["MD025", "single-title", "single-h1"],
    "description": "Multiple top level headings in the same document",
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

},{"../helpers":2}],26:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addError = _a.addError, allPunctuation = _a.allPunctuation, escapeForRegExp = _a.escapeForRegExp, forEachHeading = _a.forEachHeading;
module.exports = {
    "names": ["MD026", "no-trailing-punctuation"],
    "description": "Trailing punctuation in heading",
    "tags": ["headings", "headers"],
    "function": function MD026(params, onError) {
        var punctuation = params.config.punctuation;
        punctuation =
            String((punctuation === undefined) ? allPunctuation : punctuation);
        var trailingPunctuationRe = new RegExp("\\s*[" + escapeForRegExp(punctuation) + "]+$");
        forEachHeading(params, function (heading) {
            var line = heading.line, lineNumber = heading.lineNumber;
            var trimmedLine = line.replace(/[\s#]*$/, "");
            var match = trailingPunctuationRe.exec(trimmedLine);
            if (match) {
                var fullMatch = match[0];
                var column = match.index + 1;
                var length_1 = fullMatch.length;
                addError(onError, lineNumber, "Punctuation: '" + fullMatch + "'", null, [column, length_1], {
                    "editColumn": column,
                    "deleteCount": length_1
                });
            }
        });
    }
};

},{"../helpers":2}],27:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, newLineRe = _a.newLineRe;
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

},{"../helpers":2}],28:[function(require,module,exports){
// @ts-check
"use strict";
var addError = require("../helpers").addError;
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
                    addError(onError, lineNumber, null, null, null, {
                        "deleteCount": -1
                    });
                }
            }
            prevToken = token;
            if (token.type === "blockquote_open") {
                prevLineNumber = token.map[1] + 1;
            }
        });
    }
};

},{"../helpers":2}],29:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorDetailIf = _a.addErrorDetailIf, listItemMarkerRe = _a.listItemMarkerRe, orderedListItemMarkerRe = _a.orderedListItemMarkerRe, rangeFromRegExp = _a.rangeFromRegExp;
var flattenedLists = require("./cache").flattenedLists;
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

},{"../helpers":2,"./cache":3}],30:[function(require,module,exports){
// @ts-check
"use strict";
var addErrorDetailIf = require("../helpers").addErrorDetailIf;
var flattenedLists = require("./cache").flattenedLists;
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

},{"../helpers":2,"./cache":3}],31:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, forEachLine = _a.forEachLine, isBlankLine = _a.isBlankLine;
var lineMetadata = require("./cache").lineMetadata;
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
                    "insertText": prefix + "\n"
                };
                addErrorContext(onError, i + 1, lines[i].trim(), null, null, null, fixInfo);
            }
        });
    }
};

},{"../helpers":2,"./cache":3}],32:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, isBlankLine = _a.isBlankLine;
var flattenedLists = require("./cache").flattenedLists;
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
                var quotePrefix = line.match(quotePrefixRe)[0].trimRight();
                addErrorContext(onError, firstIndex + 1, line.trim(), null, null, null, {
                    "insertText": quotePrefix + "\n"
                });
            }
            var lastIndex = list.lastLineIndex - 1;
            if (!isBlankLine(lines[lastIndex + 1])) {
                var line = lines[lastIndex];
                var quotePrefix = line.match(quotePrefixRe)[0].trimRight();
                addErrorContext(onError, lastIndex + 1, line.trim(), null, null, null, {
                    "lineNumber": lastIndex + 2,
                    "insertText": quotePrefix + "\n"
                });
            }
        });
    }
};

},{"../helpers":2,"./cache":3}],33:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addError = _a.addError, forEachLine = _a.forEachLine, unescapeMarkdown = _a.unescapeMarkdown;
var lineMetadata = require("./cache").lineMetadata;
var htmlElementRe = /<(([A-Za-z][A-Za-z0-9-]*)(?:\s[^>]*)?)\/?>/g;
var linkDestinationRe = /]\(\s*$/;
var inlineCodeRe = /^[^`]*(`+[^`]+`+[^`]+)*`+[^`]*$/;
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
        forEachLine(lineMetadata(), function (line, lineIndex, inCode) {
            var match = null;
            // eslint-disable-next-line no-unmodified-loop-condition
            while (!inCode && ((match = htmlElementRe.exec(line)) !== null)) {
                var tag = match[0], content = match[1], element = match[2];
                if (!allowedElements.includes(element.toLowerCase()) &&
                    !tag.endsWith("\\>") &&
                    !emailAddressRe.test(content)) {
                    var prefix = line.substring(0, match.index);
                    if (!linkDestinationRe.test(prefix) && !inlineCodeRe.test(prefix)) {
                        var unescaped = unescapeMarkdown(prefix + "<", "_");
                        if (!unescaped.endsWith("_") &&
                            ((unescaped + "`").match(/`/g).length % 2)) {
                            addError(onError, lineIndex + 1, "Element: " + element, null, [match.index + 1, tag.length]);
                        }
                    }
                }
            }
        });
    }
};

},{"../helpers":2,"./cache":3}],34:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, bareUrlRe = _a.bareUrlRe, filterTokens = _a.filterTokens;
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
                                "insertText": "<" + bareUrl + ">"
                            } : null;
                            addErrorContext(onError, lineNumber, bareUrl, null, null, range, fixInfo);
                        }
                    }
                }
            });
        });
    }
};

},{"../helpers":2}],35:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorDetailIf = _a.addErrorDetailIf, filterTokens = _a.filterTokens;
module.exports = {
    "names": ["MD035", "hr-style"],
    "description": "Horizontal rule style",
    "tags": ["hr"],
    "function": function MD035(params, onError) {
        var style = String(params.config.style || "consistent");
        filterTokens(params, "hr", function forToken(token) {
            var lineTrim = token.line.trim();
            if (style === "consistent") {
                style = lineTrim;
            }
            addErrorDetailIf(onError, token.lineNumber, style, lineTrim);
        });
    }
};

},{"../helpers":2}],36:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, allPunctuation = _a.allPunctuation;
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

},{"../helpers":2}],37:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, emphasisMarkersInContent = _a.emphasisMarkersInContent, forEachLine = _a.forEachLine, isBlankLine = _a.isBlankLine;
var lineMetadata = require("./cache").lineMetadata;
var emphasisRe = /(^|[^\\]|\\\\)(?:(\*\*?\*?)|(__?_?))/g;
var asteriskListItemMarkerRe = /^([\s>]*)\*(\s+)/;
var leftSpaceRe = /^\s+/;
var rightSpaceRe = /\s+$/;
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
        function handleRunEnd(line, lineIndex, contextLength, match, matchIndex) {
            // Close current run
            var content = line.substring(emphasisIndex, matchIndex);
            if (!emphasisLength) {
                content = content.trimLeft();
            }
            if (!match) {
                content = content.trimRight();
            }
            var leftSpace = leftSpaceRe.test(content);
            var rightSpace = rightSpaceRe.test(content);
            if (leftSpace || rightSpace) {
                // Report the violation
                var contextStart = emphasisIndex - emphasisLength;
                var contextEnd = matchIndex + contextLength;
                var context = line.substring(contextStart, contextEnd);
                var column = contextStart + 1;
                var length_1 = contextEnd - contextStart;
                var leftMarker = line.substring(contextStart, emphasisIndex);
                var rightMarker = match ? (match[2] || match[3]) : "";
                var fixedText = "" + leftMarker + content.trim() + rightMarker;
                return [
                    onError,
                    lineIndex + 1,
                    context,
                    leftSpace,
                    rightSpace,
                    [column, length_1],
                    {
                        "editColumn": column,
                        "deleteCount": length_1,
                        "insertText": fixedText
                    }
                ];
            }
            return null;
        }
        // Initialize
        var ignoreMarkersByLine = emphasisMarkersInContent(params);
        resetRunTracking();
        forEachLine(lineMetadata(), function (line, lineIndex, inCode, onFence, inTable, inItem, onBreak) {
            var onItemStart = (inItem === 1);
            if (inCode || inTable || onBreak || onItemStart || isBlankLine(line)) {
                // Emphasis resets when leaving a block
                resetRunTracking();
            }
            if (inCode || onBreak) {
                // Emphasis has no meaning here
                return;
            }
            if (onItemStart) {
                // Trim overlapping '*' list item marker
                line = line.replace(asteriskListItemMarkerRe, "$1 $2");
            }
            var match = null;
            // Match all emphasis-looking runs in the line...
            while ((match = emphasisRe.exec(line))) {
                var ignoreMarkersForLine = ignoreMarkersByLine[lineIndex] || [];
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
                            addErrorContext.apply(void 0, pendingError);
                            pendingError = null;
                        }
                        var error = handleRunEnd(line, lineIndex, effectiveEmphasisLength, match, matchIndex);
                        if (error) {
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
                    handleRunEnd(line, lineIndex, 0, null, line.length);
                // Adjust for pending run on new line
                emphasisIndex = 0;
                emphasisLength = 0;
            }
        });
    }
};

},{"../helpers":2,"./cache":3}],38:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, filterTokens = _a.filterTokens, forEachInlineCodeSpan = _a.forEachInlineCodeSpan, newLineRe = _a.newLineRe;
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

},{"../helpers":2}],39:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, filterTokens = _a.filterTokens;
var spaceInLinkRe = /\[(?:\s+(?:[^\]]*?)\s*|(?:[^\]]*?)\s+)](?=\(\S*\))/;
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
                    var left = linkText.trimLeft().length !== linkText.length;
                    var right = linkText.trimRight().length !== linkText.length;
                    if (left || right) {
                        var line = params.lines[lineNumber - 1];
                        var range = null;
                        var fixInfo = null;
                        var match = line.slice(lineIndex).match(spaceInLinkRe);
                        if (match) {
                            var column = match.index + lineIndex + 1;
                            var length_1 = match[0].length;
                            range = [column, length_1];
                            fixInfo = {
                                "editColumn": column + 1,
                                "deleteCount": length_1 - 2,
                                "insertText": linkText.trim()
                            };
                            lineIndex = column + length_1 - 1;
                        }
                        addErrorContext(onError, lineNumber, "[" + linkText + "]", left, right, range, fixInfo);
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

},{"../helpers":2}],40:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, filterTokens = _a.filterTokens;
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

},{"../helpers":2}],41:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, frontMatterHasTitle = _a.frontMatterHasTitle;
module.exports = {
    "names": ["MD041", "first-line-heading", "first-line-h1"],
    "description": "First line in file should be a top level heading",
    "tags": ["headings", "headers"],
    "function": function MD041(params, onError) {
        var level = Number(params.config.level || 1);
        var tag = "h" + level;
        var foundFrontMatterTitle = frontMatterHasTitle(params.frontMatterLines, params.config.front_matter_title);
        if (!foundFrontMatterTitle) {
            params.tokens.every(function (token) {
                if (token.type === "html_block") {
                    return true;
                }
                if ((token.type !== "heading_open") || (token.tag !== tag)) {
                    addErrorContext(onError, token.lineNumber, token.line);
                }
                return false;
            });
        }
    }
};

},{"../helpers":2}],42:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, filterTokens = _a.filterTokens, rangeFromRegExp = _a.rangeFromRegExp;
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

},{"../helpers":2}],43:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, addErrorDetailIf = _a.addErrorDetailIf, forEachHeading = _a.forEachHeading;
module.exports = {
    "names": ["MD043", "required-headings", "required-headers"],
    "description": "Required heading structure",
    "tags": ["headings", "headers"],
    "function": function MD043(params, onError) {
        var requiredHeadings = params.config.headings || params.config.headers;
        if (Array.isArray(requiredHeadings)) {
            var levels_1 = {};
            [1, 2, 3, 4, 5, 6].forEach(function forLevel(level) {
                levels_1["h" + level] = "######".substr(-level);
            });
            var i_1 = 0;
            var optional_1 = false;
            var errorCount_1 = 0;
            forEachHeading(params, function forHeading(heading, content) {
                if (!errorCount_1) {
                    var actual = levels_1[heading.tag] + " " + content;
                    var expected = requiredHeadings[i_1++] || "[None]";
                    if (expected === "*") {
                        optional_1 = true;
                    }
                    else if (expected.toLowerCase() === actual.toLowerCase()) {
                        optional_1 = false;
                    }
                    else if (optional_1) {
                        i_1--;
                    }
                    else {
                        addErrorDetailIf(onError, heading.lineNumber, expected, actual);
                        errorCount_1++;
                    }
                }
            });
            if ((i_1 < requiredHeadings.length) && !errorCount_1) {
                addErrorContext(onError, params.lines.length, requiredHeadings[i_1]);
            }
        }
    }
};

},{"../helpers":2}],44:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorDetailIf = _a.addErrorDetailIf, bareUrlRe = _a.bareUrlRe, escapeForRegExp = _a.escapeForRegExp, filterTokens = _a.filterTokens, forEachInlineChild = _a.forEachInlineChild, newLineRe = _a.newLineRe;
var startNonWordRe = /^\W/;
var endNonWordRe = /\W$/;
module.exports = {
    "names": ["MD044", "proper-names"],
    "description": "Proper names should have the correct capitalization",
    "tags": ["spelling"],
    "function": function MD044(params, onError) {
        var names = params.config.names;
        names = Array.isArray(names) ? names : [];
        var codeBlocks = params.config.code_blocks;
        var includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
        // Text of automatic hyperlinks is implicitly a URL
        var autolinkText = new Set();
        filterTokens(params, "inline", function (token) {
            var inAutoLink = false;
            token.children.forEach(function (child) {
                var info = child.info, type = child.type;
                if ((type === "link_open") && (info === "auto")) {
                    inAutoLink = true;
                }
                else if (type === "link_close") {
                    inAutoLink = false;
                }
                else if ((type === "text") && inAutoLink) {
                    autolinkText.add(child);
                }
            });
        });
        // For each proper name...
        names.forEach(function (name) {
            var escapedName = escapeForRegExp(name);
            var startNamePattern = startNonWordRe.test(name) ? "" : "\\S*\\b";
            var endNamePattern = endNonWordRe.test(name) ? "" : "\\b\\S*";
            var namePattern = "(" + startNamePattern + ")(" + escapedName + ")(" + endNamePattern + ")";
            var anyNameRe = new RegExp(namePattern, "gi");
            // eslint-disable-next-line jsdoc/require-jsdoc
            function forToken(token) {
                if (!autolinkText.has(token)) {
                    var fenceOffset_1 = (token.type === "fence") ? 1 : 0;
                    token.content.split(newLineRe).forEach(function (line, index) {
                        var match = null;
                        while ((match = anyNameRe.exec(line)) !== null) {
                            var fullMatch = match[0], leftMatch = match[1], nameMatch = match[2], rightMatch = match[3];
                            if (fullMatch.search(bareUrlRe) === -1) {
                                var wordMatch = fullMatch
                                    .replace(new RegExp("^\\W{0," + leftMatch.length + "}"), "")
                                    .replace(new RegExp("\\W{0," + rightMatch.length + "}$"), "");
                                if (!names.includes(wordMatch)) {
                                    var lineNumber = token.lineNumber + index + fenceOffset_1;
                                    var fullLine = params.lines[lineNumber - 1];
                                    var matchLength = wordMatch.length;
                                    var matchIndex = fullLine.indexOf(wordMatch);
                                    var range = (matchIndex === -1) ?
                                        null :
                                        [matchIndex + 1, matchLength];
                                    var fixInfo = (matchIndex === -1) ?
                                        null :
                                        {
                                            "editColumn": matchIndex + 1,
                                            "deleteCount": matchLength,
                                            "insertText": name
                                        };
                                    addErrorDetailIf(onError, lineNumber, name, nameMatch, null, null, range, fixInfo);
                                }
                            }
                        }
                    });
                }
            }
            forEachInlineChild(params, "text", forToken);
            if (includeCodeBlocks) {
                forEachInlineChild(params, "code_inline", forToken);
                filterTokens(params, "code_block", forToken);
                filterTokens(params, "fence", forToken);
            }
        });
    }
};

},{"../helpers":2}],45:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addError = _a.addError, forEachInlineChild = _a.forEachInlineChild;
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

},{"../helpers":2}],46:[function(require,module,exports){
// @ts-check
"use strict";
var addErrorDetailIf = require("../helpers").addErrorDetailIf;
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

},{"../helpers":2}],47:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addError = _a.addError, isBlankLine = _a.isBlankLine;
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

},{"../helpers":2}],48:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorDetailIf = _a.addErrorDetailIf, fencedCodeBlockStyleFor = _a.fencedCodeBlockStyleFor;
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

},{"../helpers":2}],49:[function(require,module,exports){
// @ts-check
"use strict";
var packageJson = require("../package.json");
var homepage = packageJson.homepage;
var version = packageJson.version;
var rules = [
    require("./md001"),
    require("./md002"),
    require("./md003"),
    require("./md004"),
    require("./md005"),
    require("./md006"),
    require("./md007"),
    require("./md009"),
    require("./md010"),
    require("./md011"),
    require("./md012"),
    require("./md013"),
    require("./md014"),
    require("./md018"),
    require("./md019"),
    require("./md020"),
    require("./md021"),
    require("./md022"),
    require("./md023"),
    require("./md024"),
    require("./md025"),
    require("./md026"),
    require("./md027"),
    require("./md028"),
    require("./md029"),
    require("./md030"),
    require("./md031"),
    require("./md032"),
    require("./md033"),
    require("./md034"),
    require("./md035"),
    require("./md036"),
    require("./md037"),
    require("./md038"),
    require("./md039"),
    require("./md040"),
    require("./md041"),
    require("./md042"),
    require("./md043"),
    require("./md044"),
    require("./md045"),
    require("./md046"),
    require("./md047"),
    require("./md048")
];
rules.forEach(function (rule) {
    var name = rule.names[0].toLowerCase();
    rule.information =
        new URL(homepage + "/blob/v" + version + "/doc/Rules.md#" + name);
});
module.exports = rules;

},{"../package.json":50,"./md001":5,"./md002":6,"./md003":7,"./md004":8,"./md005":9,"./md006":10,"./md007":11,"./md009":12,"./md010":13,"./md011":14,"./md012":15,"./md013":16,"./md014":17,"./md018":18,"./md019":19,"./md020":20,"./md021":21,"./md022":22,"./md023":23,"./md024":24,"./md025":25,"./md026":26,"./md027":27,"./md028":28,"./md029":29,"./md030":30,"./md031":31,"./md032":32,"./md033":33,"./md034":34,"./md035":35,"./md036":36,"./md037":37,"./md038":38,"./md039":39,"./md040":40,"./md041":41,"./md042":42,"./md043":43,"./md044":44,"./md045":45,"./md046":46,"./md047":47,"./md048":48}],50:[function(require,module,exports){
module.exports={
    "name": "markdownlint",
    "version": "0.21.1",
    "description": "A Node.js style checker and lint tool for Markdown/CommonMark files.",
    "main": "lib/markdownlint.js",
    "types": "lib/markdownlint.d.ts",
    "author": "David Anson (https://dlaa.me/)",
    "license": "MIT",
    "homepage": "https://github.com/DavidAnson/markdownlint",
    "repository": {
        "type": "git",
        "url": "https://github.com/DavidAnson/markdownlint.git"
    },
    "bugs": "https://github.com/DavidAnson/markdownlint/issues",
    "scripts": {
        "test": "tape test/markdownlint-test.js test/markdownlint-test-custom-rules.js test/markdownlint-test-helpers.js test/markdownlint-test-result-object.js test/markdownlint-test-scenarios.js",
        "test-cover": "c8 --check-coverage --branches 100 --functions 100 --lines 100 --statements 100 tape test/markdownlint-test.js test/markdownlint-test-custom-rules.js test/markdownlint-test-helpers.js test/markdownlint-test-result-object.js test/markdownlint-test-scenarios.js",
        "test-declaration": "cd example/typescript && tsc && node type-check.js",
        "test-extra": "node test/markdownlint-test-extra.js",
        "lint": "eslint --max-warnings 0 lib helpers test schema && eslint --env browser --global markdownit --global markdownlint --rule \"no-unused-vars: 0, no-extend-native: 0, max-statements: 0, no-console: 0, no-var: 0, unicorn/prefer-add-event-listener: 0, unicorn/prefer-query-selector: 0, unicorn/prefer-replace-all: 0\" demo && eslint --rule \"no-console: 0, no-invalid-this: 0, no-shadow: 0, object-property-newline: 0, node/no-missing-require: 0, node/no-extraneous-require: 0\" example",
        "ci": "npm run test-cover && npm run lint && npm run test-declaration",
        "build-config-schema": "node schema/build-config-schema.js",
        "build-declaration": "tsc --allowJs --declaration --emitDeclarationOnly --resolveJsonModule lib/markdownlint.js && rimraf 'lib/{c,md,r}*.d.ts' 'helpers/*.d.ts'",
        "build-demo": "cpy node_modules/markdown-it/dist/markdown-it.min.js demo && cd demo && rimraf markdownlint-browser.* && cpy file-header.js . --rename=markdownlint-browser.js && tsc --allowJs --resolveJsonModule --outDir ../lib-es3 ../lib/markdownlint.js && cpy ../helpers/package.json ../lib-es3/helpers && browserify ../lib-es3/lib/markdownlint.js --standalone markdownlint >> markdownlint-browser.js && browserify ../lib-es3/helpers/helpers.js --standalone helpers >> markdownlint-rule-helpers-browser.js && uglifyjs markdownlint-browser.js markdownlint-rule-helpers-browser.js --compress --mangle --comments --output markdownlint-browser.min.js",
        "build-example": "npm install --no-save --ignore-scripts grunt grunt-cli gulp through2",
        "example": "cd example && node standalone.js && grunt markdownlint --force && gulp markdownlint",
        "clone-test-repos": "make-dir test-repos && cd test-repos && git clone https://github.com/eslint/eslint eslint-eslint --depth 1 --no-tags --quiet && git clone https://github.com/mkdocs/mkdocs mkdocs-mkdocs --depth 1 --no-tags --quiet && git clone https://github.com/pi-hole/docs pi-hole-docs --depth 1 --no-tags --quiet",
        "clone-test-repos-large": "npm run clone-test-repos && cd test-repos && git clone https://github.com/dotnet/docs dotnet-docs --depth 1 --no-tags --quiet",
        "lint-test-repos": "node test/markdownlint-test-repos.js",
        "clean-test-repos": "rimraf test-repos"
    },
    "engines": {
        "node": ">=10"
    },
    "dependencies": {
        "markdown-it": "11.0.0"
    },
    "devDependencies": {
        "@types/node": "~14.6.4",
        "browserify": "~16.5.2",
        "c8": "~7.3.0",
        "cpy-cli": "~3.1.1",
        "eslint": "~7.8.1",
        "eslint-plugin-jsdoc": "~30.3.1",
        "eslint-plugin-node": "~11.1.0",
        "eslint-plugin-unicorn": "~21.0.0",
        "globby": "~11.0.1",
        "js-yaml": "~3.14.0",
        "make-dir-cli": "~2.0.0",
        "markdown-it-for-inline": "~0.1.1",
        "markdown-it-sub": "~1.0.0",
        "markdown-it-sup": "~1.0.0",
        "markdown-it-texmath": "~0.8.0",
        "markdownlint-rule-helpers": "~0.11.0",
        "rimraf": "~3.0.2",
        "strip-json-comments": "~3.1.1",
        "tape": "~5.0.1",
        "tape-player": "~0.1.1",
        "toml": "~3.0.0",
        "tv4": "~1.3.0",
        "typescript": "~4.0.2",
        "uglify-js": "~3.10.3"
    },
    "keywords": [
        "markdown",
        "lint",
        "md",
        "CommonMark",
        "markdownlint"
    ],
    "browser": {
        "markdown-it": "../demo/markdown-it-stub.js"
    }
}

},{}],51:[function(require,module,exports){

},{}],52:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};

},{}],53:[function(require,module,exports){
(function (process){(function (){
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this)}).call(this,require('_process'))
},{"_process":54}],54:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],55:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],56:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],57:[function(require,module,exports){
(function (process,global){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":56,"_process":54,"inherits":55}]},{},[4])(4)
});
