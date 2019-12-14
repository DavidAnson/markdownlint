/* markdownlint - https://github.com/DavidAnson/markdownlint - @license MIT */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.markdownlint = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

// Alias "markdown-it" (expected) to "markdownit" (exported)
module.exports = window.markdownit;
if (!module.exports) {
  console.error("markdown-it must be loaded before markdownlint.");
}

// Use browser's URL implementation if not available on url module
var url = require("url");
if (!url.URL) {
  url.URL = URL;
}

},{"url":59}],2:[function(require,module,exports){
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
/<!--\s*markdownlint-(disable|enable|capture|restore|disable-file|enable-file)((?:\s+[a-z0-9_-]+)*)\s*-->/ig;
module.exports.inlineCommentRe = inlineCommentRe;
// Regular expressions for range matching
module.exports.bareUrlRe = /(?:http|ftp)s?:\/\/[^\s]*/ig;
module.exports.listItemMarkerRe = /^([\s>]*)(?:[*+-]|\d+[.)])\s+/;
module.exports.orderedListItemMarkerRe = /^[\s>]*0*(\d+)[.)]/;
// readFile options for reading with the UTF-8 encoding
module.exports.utf8Encoding = { "encoding": "utf8" };
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
    return !line || !line.trim() || !line.replace(blankLineRe, "").trim();
};
// Returns true iff the sorted array contains the specified element
module.exports.includesSorted = function includesSorted(array, element) {
    var left = 0;
    var right = array.length - 1;
    while (left <= right) {
        /* eslint-disable no-bitwise */
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
            j = text.length;
            text += "\\\n";
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
// Returns the indent for a token
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
// Calls the provided function for each matching token
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
        for (var i = token.map[0]; i < token.map[1]; i++) {
            lineMetadata[i][5] = true;
        }
    });
    return lineMetadata;
};
// Calls the provided function for each line (with context)
module.exports.forEachLine = function forEachLine(lineMetadata, handler) {
    lineMetadata.forEach(function forMetadata(metadata) {
        // Parameters: line, lineIndex, inCode, onFence, inTable
        handler.apply(void 0, metadata);
    });
};
// Returns (nested) lists as a flat array (in order)
module.exports.flattenLists = function flattenLists(params) {
    var flattenedLists = [];
    var stack = [];
    var current = null;
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
                "nesting": stack.length - 1,
                "lastLineIndex": -1,
                "insert": flattenedLists.length
            };
        }
        else if ((token.type === "bullet_list_close") ||
            (token.type === "ordered_list_close")) {
            // Finalize current context and restore previous
            current.lastLineIndex = lastWithMap.map[1];
            flattenedLists.splice(current.insert, 0, current);
            delete current.insert;
            current = stack.pop();
        }
        else if (token.type === "list_item_open") {
            // Add list item
            current.items.push(token);
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
// Calls the provided function for each inline code span's content
module.exports.forEachInlineCodeSpan =
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
    };
// Adds a generic error object via the onError callback
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
        var frontMatterTitleRe = new RegExp(frontMatterTitlePattern || "^\\s*title\\s*[:=]", "i");
        return !ignoreFrontMatter &&
            frontMatterLines.some(function (line) { return frontMatterTitleRe.test(line); });
    };
// Gets the most common line ending, falling back to platform default
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
// Normalizes the fields of a fixInfo object
function normalizeFixInfo(fixInfo, lineNumber) {
    return {
        "lineNumber": fixInfo.lineNumber || lineNumber,
        "editColumn": fixInfo.editColumn || 1,
        "deleteCount": fixInfo.deleteCount || 0,
        "insertText": fixInfo.insertText || ""
    };
}
// Fixes the specifide error on a line
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
var fs = require("fs");
var path = require("path");
var URL = require("url").URL;
var markdownIt = require("markdown-it");
var rules = require("./rules");
var helpers = require("../helpers");
var cache = require("./cache");
var deprecatedRuleNames = ["MD002"];
// Validates the list of rules for structure and reuse
function validateRuleList(ruleList) {
    var result = null;
    if (ruleList.length === rules.length) {
        // No need to validate if only using built-in rules
        return result;
    }
    var allIds = {};
    ruleList.forEach(function forRule(rule, index) {
        var customIndex = index - rules.length;
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
// Class for results with toString for pretty display
function newResults(ruleList) {
    function Results() { }
    Results.prototype.toString = function toString(useAlias) {
        var that = this;
        var ruleNameToRule = null;
        var results = [];
        Object.keys(that).forEach(function forFile(file) {
            var fileResults = that[file];
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
    };
    return new Results();
}
// Remove front matter (if present at beginning of content)
function removeFrontMatter(content, frontMatter) {
    var frontMatterLines = [];
    if (frontMatter) {
        var frontMatterMatch = content.match(frontMatter);
        if (frontMatterMatch && !frontMatterMatch.index) {
            var contentMatched = frontMatterMatch[0];
            content = content.slice(contentMatched.length);
            frontMatterLines = contentMatched.split(helpers.newLineRe);
            if (frontMatterLines.length &&
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
// Annotate tokens with line/lineNumber
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
// Map rule names/tags to canonical rule name
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
    return aliasToRuleNames;
}
// Apply (and normalize) config
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
// Create mapping of enabled rules per line
function getEnabledRulesPerLineNumber(ruleList, lines, frontMatterLines, noInlineConfig, effectiveConfig, aliasToRuleNames) {
    var enabledRules = {};
    var allRuleNames = [];
    ruleList.forEach(function (rule) {
        var ruleName = rule.names[0].toUpperCase();
        allRuleNames.push(ruleName);
        enabledRules[ruleName] = !!effectiveConfig[ruleName];
    });
    var capturedRules = enabledRules;
    function forMatch(match, byLine) {
        var action = match[1].toUpperCase();
        if (action === "CAPTURE") {
            if (byLine) {
                capturedRules = __assign({}, enabledRules);
            }
        }
        else if (action === "RESTORE") {
            if (byLine) {
                enabledRules = __assign({}, capturedRules);
            }
        }
        else {
            // action in [ENABLE, DISABLE, ENABLE-FILE, DISABLE-FILE]
            var isfile = action.endsWith("-FILE");
            if ((byLine && !isfile) || (!byLine && isfile)) {
                var enabled_1 = (action.startsWith("ENABLE"));
                var items = match[2] ?
                    match[2].trim().toUpperCase().split(/\s+/) :
                    allRuleNames;
                items.forEach(function (nameUpper) {
                    (aliasToRuleNames[nameUpper] || []).forEach(function (ruleName) {
                        enabledRules[ruleName] = enabled_1;
                    });
                });
            }
        }
    }
    var enabledRulesPerLineNumber = new Array(1 + frontMatterLines.length);
    [false, true].forEach(function (byLine) {
        lines.forEach(function (line) {
            if (!noInlineConfig) {
                var match = helpers.inlineCommentRe.exec(line);
                if (match) {
                    enabledRules = __assign({}, enabledRules);
                    while (match) {
                        forMatch(match, byLine);
                        match = helpers.inlineCommentRe.exec(line);
                    }
                }
            }
            if (byLine) {
                enabledRulesPerLineNumber.push(enabledRules);
            }
        });
    });
    return enabledRulesPerLineNumber;
}
// Array.sort comparison for objects in errors array
function lineNumberComparison(a, b) {
    return a.lineNumber - b.lineNumber;
}
// Function to return true for all inputs
function filterAllValues() {
    return true;
}
// Function to return unique values from a sorted errors array
function uniqueFilterForSortedErrors(value, index, array) {
    return (index === 0) || (value.lineNumber > array[index - 1].lineNumber);
}
// Lints a single string
function lintContent(ruleList, name, content, md, config, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, callback) {
    // Remove UTF-8 byte order marker (if present)
    content = content.replace(/^\ufeff/, "");
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
    var effectiveConfig = getEffectiveConfig(ruleList, config, aliasToRuleNames);
    var enabledRulesPerLineNumber = getEnabledRulesPerLineNumber(ruleList, lines, frontMatterLines, noInlineConfig, effectiveConfig, aliasToRuleNames);
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
    function forRule(rule) {
        // Configure rule
        var ruleNameFriendly = rule.names[0];
        var ruleName = ruleNameFriendly.toUpperCase();
        params.config = effectiveConfig[ruleName];
        function throwError(property) {
            throw new Error("Property '" + property + "' of onError parameter is incorrect.");
        }
        var errors = [];
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
                "range": errorInfo.range || null,
                "fixInfo": fixInfo ? cleanFixInfo : null
            });
        }
        // Call (possibly external) rule function
        if (handleRuleFailures) {
            try {
                rule["function"](params, onError);
            }
            catch (ex) {
                onError({
                    "lineNumber": 1,
                    "detail": "This rule threw an exception: " + ex.message
                });
            }
        }
        else {
            rule["function"](params, onError);
        }
        // Record any errors (significant performance benefit from length check)
        if (errors.length) {
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
            if (filteredErrors.length) {
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
    catch (ex) {
        cache.clear();
        return callback(ex);
    }
    cache.clear();
    return callback(null, result);
}
// Lints a single file
function lintFile(ruleList, file, md, config, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, synchronous, callback) {
    function lintContentWrapper(err, content) {
        if (err) {
            return callback(err);
        }
        return lintContent(ruleList, file, content, md, config, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, callback);
    }
    // Make a/synchronous call to read file
    if (synchronous) {
        lintContentWrapper(null, fs.readFileSync(file, helpers.utf8Encoding));
    }
    else {
        fs.readFile(file, helpers.utf8Encoding, lintContentWrapper);
    }
}
// Lints files and strings
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
    // Helper to lint the next string or file
    /* eslint-disable consistent-return */
    function lintNextItem() {
        var iterating = true;
        var item = null;
        function lintNextItemCallback(err, result) {
            if (err) {
                iterating = false;
                return callback(err);
            }
            results[item] = result;
            return iterating || lintNextItem();
        }
        while (iterating) {
            if ((item = stringsKeys.shift())) {
                lintContent(ruleList, item, strings[item] || "", md, config, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, lintNextItemCallback);
            }
            else if ((item = files.shift())) {
                iterating = synchronous;
                lintFile(ruleList, item, md, config, frontMatter, handleRuleFailures, noInlineConfig, resultVersion, synchronous, lintNextItemCallback);
            }
            else {
                return callback(null, results);
            }
        }
    }
    return lintNextItem();
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
// Parses the content of a configuration file
function parseConfiguration(name, content, parsers) {
    var config = null;
    var message = "";
    var errors = [];
    // Try each parser
    (parsers || [JSON.parse]).every(function (parser) {
        try {
            config = parser(content);
        }
        catch (ex) {
            errors.push(ex.message);
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
 * @param {ConfigurationParser[] | null} parsers Parsing function(s).
 * @param {ReadConfigCallback} callback Callback (err, result) function.
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
/**
 * Read specified configuration file synchronously.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} [parsers] Parsing function(s).
 * @returns {Configuration} Configuration object.
 */
function readConfigSync(file, parsers) {
    // Read file
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
// Export a/synchronous APIs
markdownlint.sync = markdownlintSync;
markdownlint.readConfig = readConfig;
markdownlint.readConfigSync = readConfigSync;
module.exports = markdownlint;

},{"../helpers":2,"./cache":3,"./rules":49,"fs":51,"markdown-it":1,"path":53,"url":59}],5:[function(require,module,exports){
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
            var level = parseInt(token.tag.slice(1), 10);
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
        var level = params.config.level || 1;
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
        var style = params.config.style || "consistent";
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
var _a = require("../helpers"), addErrorDetailIf = _a.addErrorDetailIf, listItemMarkerRe = _a.listItemMarkerRe, rangeFromRegExp = _a.rangeFromRegExp;
var flattenedLists = require("./cache").flattenedLists;
// Returns the unordered list style for a list item token
function unorderedListStyleFor(token) {
    switch (token.markup) {
        case "-":
            return "dash";
        case "+":
            return "plus";
        // case "*":
        default:
            return "asterisk";
    }
}
module.exports = {
    "names": ["MD004", "ul-style"],
    "description": "Unordered list style",
    "tags": ["bullet", "ul"],
    "function": function MD004(params, onError) {
        var style = params.config.style || "consistent";
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
                var actualIndent = indentFor(item);
                if (list.unordered) {
                    addErrorDetailIf(onError, item.lineNumber, expectedIndent, actualIndent, null, null, rangeFromRegExp(item.line, listItemMarkerRe));
                }
                else {
                    var match = orderedListItemMarkerRe.exec(item.line);
                    actualEnd = match && match[0].length;
                    expectedEnd = expectedEnd || actualEnd;
                    if ((expectedIndent !== actualIndent) || endMatching) {
                        if (expectedEnd === actualEnd) {
                            endMatching = true;
                        }
                        else {
                            var detail = endMatching ?
                                "Expected: (" + expectedEnd + "); Actual: (" + actualEnd + ")" :
                                "Expected: " + expectedIndent + "; Actual: " + actualIndent;
                            addError(onError, item.lineNumber, detail, null, rangeFromRegExp(item.line, listItemMarkerRe));
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
        var optionsIndent = params.config.indent || 2;
        flattenedLists().forEach(function (list) {
            if (list.unordered && list.parentsUnordered) {
                list.items.forEach(function (item) {
                    var lineNumber = item.lineNumber, line = item.line;
                    var expectedIndent = list.nesting * optionsIndent;
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
var _a = require("../helpers"), addError = _a.addError, filterTokens = _a.filterTokens, forEachInlineCodeSpan = _a.forEachInlineCodeSpan, forEachLine = _a.forEachLine, includesSorted = _a.includesSorted, newLineRe = _a.newLineRe;
var lineMetadata = require("./cache").lineMetadata;
function numericSortAscending(a, b) {
    return a - b;
}
module.exports = {
    "names": ["MD009", "no-trailing-spaces"],
    "description": "Trailing spaces",
    "tags": ["whitespace"],
    "function": function MD009(params, onError) {
        var brSpaces = params.config.br_spaces;
        if (brSpaces === undefined) {
            brSpaces = 2;
        }
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
                addError(onError, lineNumber, reversedLink, null, [column, length_1], {
                    "editColumn": column,
                    "deleteCount": length_1,
                    "insertText": "[" + linkText + "](" + linkDestination + ")"
                });
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
        var maximum = params.config.maximum || 1;
        var count = 0;
        forEachLine(lineMetadata(), function (line, lineIndex, inCode) {
            count = (inCode || line.trim().length) ? 0 : count + 1;
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
var linkOnlyLineRe = /^[es]*lT?L[ES]*$/;
var tokenTypeMap = {
    "em_open": "e",
    "em_close": "E",
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
        var lineLength = params.config.line_length || 80;
        var headingLineLength = params.config.heading_line_length || lineLength;
        var codeLineLength = params.config.code_block_line_length || lineLength;
        var strict = !!params.config.strict;
        var longLineRePostfix = strict ? longLineRePostfixStrict : longLineRePostfixRelaxed;
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
            if (linkOnlyLineRe.test(childTokenTypes)) {
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
                    (!includesSorted(linkOnlyLineNumbers, lineNumber) &&
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
function addErrorIfPreviousWasCommand(onError, previous) {
    if (previous) {
        var lineNumber = previous.lineNumber, lineTrim = previous.lineTrim, column = previous.column, length_1 = previous.length;
        addErrorContext(onError, lineNumber, lineTrim, null, null, [column, length_1], {
            "editColumn": column,
            "deleteCount": length_1
        });
    }
}
module.exports = {
    "names": ["MD014", "commands-show-output"],
    "description": "Dollar signs used before commands without showing output",
    "tags": ["code"],
    "function": function MD014(params, onError) {
        ["code_block", "fence"].forEach(function (type) {
            filterTokens(params, type, function (token) {
                var previous = null;
                var margin = (token.type === "fence") ? 1 : 0;
                for (var i = token.map[0] + margin; i < token.map[1] - margin; i++) {
                    var line = params.lines[i];
                    var lineTrim = line.trim();
                    var match = dollarCommandRe.exec(line);
                    if (!lineTrim || match) {
                        addErrorIfPreviousWasCommand(onError, previous);
                    }
                    previous = match ? {
                        "lineNumber": i + 1,
                        "lineTrim": lineTrim,
                        "column": match[1].length + 1,
                        "length": match[2].length
                    } : null;
                }
                addErrorIfPreviousWasCommand(onError, previous);
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
            if (!inCode && /^#+[^#\s]/.test(line) && !/#\s*$/.test(line)) {
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
        if (linesAbove === undefined) {
            linesAbove = 1;
        }
        var linesBelow = params.config.lines_below;
        if (linesBelow === undefined) {
            linesBelow = 1;
        }
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
        var siblingsOnly = params.config.siblings_only ||
            params.config.allow_different_nesting || false;
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
        var level = params.config.level || 1;
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
        if (punctuation === undefined) {
            punctuation = allPunctuation;
        }
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
        var style = params.config.style || "one_or_ordered";
        flattenedLists().forEach(function (list) {
            if (!list.unordered) {
                var listStyle_1 = style;
                if (listStyle_1 === "one_or_ordered") {
                    var second = (list.items.length > 1) &&
                        orderedListItemMarkerRe.exec(list.items[1].line);
                    listStyle_1 = (second && (second[1] !== "1")) ? "ordered" : "one";
                }
                var number_1 = (listStyle_1 === "zero") ? 0 : 1;
                list.items.forEach(function (item) {
                    var match = orderedListItemMarkerRe.exec(item.line);
                    addErrorDetailIf(onError, item.lineNumber, String(number_1), !match || match[1], "Style: " + listStyleExamples[listStyle_1], null, rangeFromRegExp(item.line, listItemMarkerRe));
                    if (listStyle_1 === "ordered") {
                        number_1++;
                    }
                });
            }
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
        var ulSingle = params.config.ul_single || 1;
        var olSingle = params.config.ol_single || 1;
        var ulMulti = params.config.ul_multi || 1;
        var olMulti = params.config.ol_multi || 1;
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
                addErrorContext(onError, i + 1, lines[i].trim(), null, null, null, {
                    "lineNumber": i + (onTopFence ? 1 : 2),
                    "insertText": "\n"
                });
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
        var allowedElements = (params.config.allowed_elements || [])
            .map(function (element) { return element.toLowerCase(); });
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
                        var index = line.indexOf(content);
                        var range = (index === -1) ? null : [
                            line.indexOf(content) + match.index + 1,
                            bareUrl.length
                        ];
                        var fixInfo = range ? {
                            "editColumn": range[0],
                            "deleteCount": range[1],
                            "insertText": "<" + bareUrl + ">"
                        } : null;
                        addErrorContext(onError, lineNumber, bareUrl, null, null, range, fixInfo);
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
        var style = params.config.style || "consistent";
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
        var punctuation = params.config.punctuation || allPunctuation;
        var re = new RegExp("[" + punctuation + "]$");
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
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, forEachInlineChild = _a.forEachInlineChild;
var leftSpaceRe = /(?:^|\s)(\*\*?\*?|__?_?)\s.*[^\\]\1/g;
var rightSpaceRe = /(?:^|[^\\])(\*\*?\*?|__?_?).+\s\1(?:\s|$)/g;
module.exports = {
    "names": ["MD037", "no-space-in-emphasis"],
    "description": "Spaces inside emphasis markers",
    "tags": ["whitespace", "emphasis"],
    "function": function MD037(params, onError) {
        forEachInlineChild(params, "text", function (token) {
            var content = token.content, lineNumber = token.lineNumber;
            var columnsReported = [];
            [leftSpaceRe, rightSpaceRe].forEach(function (spaceRe, index) {
                var match = null;
                while ((match = spaceRe.exec(content)) !== null) {
                    var fullText = match[0], marker = match[1];
                    var line = params.lines[lineNumber - 1];
                    if (line.includes(fullText)) {
                        var text = fullText.trim();
                        var column = line.indexOf(text) + 1;
                        if (!columnsReported.includes(column)) {
                            var length_1 = text.length;
                            var markerLength = marker.length;
                            var emphasized = text.slice(markerLength, length_1 - markerLength);
                            var fixedText = "" + marker + emphasized.trim() + marker;
                            addErrorContext(onError, lineNumber, text, index === 0, index !== 0, [column, length_1], {
                                "editColumn": column,
                                "deleteCount": length_1,
                                "insertText": fixedText
                            });
                            columnsReported.push(column);
                        }
                    }
                }
            });
        });
    }
};

},{"../helpers":2}],38:[function(require,module,exports){
// @ts-check
"use strict";
var _a = require("../helpers"), addErrorContext = _a.addErrorContext, filterTokens = _a.filterTokens, forEachInlineCodeSpan = _a.forEachInlineCodeSpan, newLineRe = _a.newLineRe;
var leftSpaceRe = /^\s([^`]|$)/;
var rightSpaceRe = /[^`]\s$/;
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
                    if (left || right) {
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
                        var match = line.slice(lineIndex).match(spaceInLinkRe);
                        var column = match.index + lineIndex + 1;
                        var length_1 = match[0].length;
                        lineIndex = column + length_1 - 1;
                        addErrorContext(onError, lineNumber, "[" + linkText + "]", left, right, [column, length_1], {
                            "editColumn": column + 1,
                            "deleteCount": length_1 - 2,
                            "insertText": linkText.trim()
                        });
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
        var level = params.config.level || 1;
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
        if (requiredHeadings) {
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
module.exports = {
    "names": ["MD044", "proper-names"],
    "description": "Proper names should have the correct capitalization",
    "tags": ["spelling"],
    "function": function MD044(params, onError) {
        var names = params.config.names || [];
        var codeBlocks = params.config.code_blocks;
        var includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
        names.forEach(function (name) {
            var escapedName = escapeForRegExp(name);
            var namePattern = "\\S*\\b(" + escapedName + ")\\b\\S*";
            var anyNameRe = new RegExp(namePattern, "gi");
            function forToken(token) {
                var fenceOffset = (token.type === "fence") ? 1 : 0;
                token.content.split(newLineRe)
                    .forEach(function (line, index) {
                    var match = null;
                    while ((match = anyNameRe.exec(line)) !== null) {
                        var fullMatch = match[0];
                        if (fullMatch.search(bareUrlRe) === -1) {
                            var wordMatch = fullMatch
                                .replace(/^\W*/, "").replace(/\W*$/, "");
                            if (!names.includes(wordMatch)) {
                                var lineNumber = token.lineNumber + index + fenceOffset;
                                var fullLine = params.lines[lineNumber - 1];
                                var matchIndex = match.index;
                                var matchLength = wordMatch.length;
                                var fullLineWord = fullLine.slice(matchIndex, matchIndex + matchLength);
                                if (fullLineWord !== wordMatch) {
                                    // Attempt to fix bad offset due to inline content
                                    matchIndex = fullLine.indexOf(wordMatch);
                                }
                                var range = [matchIndex + 1, matchLength];
                                addErrorDetailIf(onError, lineNumber, name, match[1], null, null, range, {
                                    "editColumn": matchIndex + 1,
                                    "deleteCount": matchLength,
                                    "insertText": name
                                });
                            }
                        }
                    }
                });
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
        var expectedStyle = params.config.style || "consistent";
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
var addErrorDetailIf = require("../helpers").addErrorDetailIf;
function fencedCodeBlockStyleFor(markup) {
    switch (markup[0]) {
        case "~":
            return "tilde";
        default:
            return "backtick";
    }
}
module.exports = {
    "names": ["MD048", "code-fence-style"],
    "description": "Code fence style",
    "tags": ["code"],
    "function": function MD048(params, onError) {
        var style = params.config.style || "consistent";
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
var URL = require("url").URL;
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

},{"../package.json":50,"./md001":5,"./md002":6,"./md003":7,"./md004":8,"./md005":9,"./md006":10,"./md007":11,"./md009":12,"./md010":13,"./md011":14,"./md012":15,"./md013":16,"./md014":17,"./md018":18,"./md019":19,"./md020":20,"./md021":21,"./md022":22,"./md023":23,"./md024":24,"./md025":25,"./md026":26,"./md027":27,"./md028":28,"./md029":29,"./md030":30,"./md031":31,"./md032":32,"./md033":33,"./md034":34,"./md035":35,"./md036":36,"./md037":37,"./md038":38,"./md039":39,"./md040":40,"./md041":41,"./md042":42,"./md043":43,"./md044":44,"./md045":45,"./md046":46,"./md047":47,"./md048":48,"url":59}],50:[function(require,module,exports){
module.exports={
    "name": "markdownlint",
    "version": "0.18.0",
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
        "test": "nodeunit test/markdownlint-test.js",
        "test-cover": "nyc --check-coverage --skip-full node_modules/nodeunit/bin/nodeunit test/markdownlint-test.js",
        "test-declaration": "cd example/typescript && tsc && node type-check.js",
        "test-extra": "nodeunit test/markdownlint-test-extra.js",
        "debug": "node debug node_modules/nodeunit/bin/nodeunit",
        "lint": "eslint lib helpers test schema && eslint --env browser --global markdownit --global markdownlint --rule \"no-unused-vars: 0, no-extend-native: 0, max-statements: 0, no-console: 0, no-var: 0\" demo && eslint --rule \"no-console: 0, no-invalid-this: 0, no-shadow: 0, object-property-newline: 0\" example",
        "ci": "npm run test && npm run lint && npm run test-cover && npm run test-declaration",
        "build-config-schema": "node schema/build-config-schema.js",
        "build-declaration": "tsc --allowJs --declaration --outDir declaration --resolveJsonModule lib/markdownlint.js && cpy declaration/lib/markdownlint.d.ts lib && rimraf declaration",
        "build-demo": "cpy node_modules/markdown-it/dist/markdown-it.min.js demo && cd demo && rimraf markdownlint-browser.* && cpy file-header.js . --rename=markdownlint-browser.js && tsc --allowJs --resolveJsonModule --outDir ../lib-es3 ../lib/markdownlint.js && cpy ../helpers/package.json ../lib-es3/helpers && browserify ../lib-es3/lib/markdownlint.js --standalone markdownlint >> markdownlint-browser.js && uglifyjs markdownlint-browser.js --compress --mangle --comments --output markdownlint-browser.min.js",
        "build-example": "npm install --no-save --ignore-scripts grunt grunt-cli gulp through2",
        "example": "cd example && node standalone.js && grunt markdownlint --force && gulp markdownlint"
    },
    "engines": {
        "node": ">=8"
    },
    "dependencies": {
        "markdown-it": "10.0.0"
    },
    "devDependencies": {
        "@types/node": "~12.12.17",
        "browserify": "~16.5.0",
        "cpy-cli": "~3.0.0",
        "eslint": "~6.7.2",
        "glob": "~7.1.6",
        "js-yaml": "~3.13.1",
        "markdown-it-for-inline": "~0.1.1",
        "markdown-it-katex": "~2.0.3",
        "markdown-it-sub": "~1.0.0",
        "markdown-it-sup": "~1.0.0",
        "markdownlint-rule-helpers": "~0.5.0",
        "nodeunit": "~0.11.3",
        "nyc": "~14.1.1",
        "rimraf": "~3.0.0",
        "toml": "~3.0.0",
        "tv4": "~1.3.0",
        "typescript": "~3.7.3",
        "uglify-js": "~3.7.2"
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
(function (process){
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

}).call(this,require('_process'))
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
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],56:[function(require,module,exports){
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

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],57:[function(require,module,exports){
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

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],58:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":56,"./encode":57}],59:[function(require,module,exports){
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

'use strict';

var punycode = require('punycode');
var util = require('./util');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

},{"./util":60,"punycode":55,"querystring":58}],60:[function(require,module,exports){
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

},{}]},{},[4])(4)
});
