export type RemoveFrontMatterResult = {
    /**
     * Markdown content.
     */
    content: string;
    /**
     * Front matter lines.
     */
    frontMatterLines: string[];
};
export type GetEffectiveConfigResult = {
    /**
     * Effective configuration.
     */
    effectiveConfig: Configuration;
    /**
     * Rules enabled.
     */
    rulesEnabled: Map<string, boolean>;
    /**
     * Rules severity.
     */
    rulesSeverity: Map<string, "error" | "warning">;
};
export type EnabledRulesPerLineNumberResult = {
    /**
     * Effective configuration.
     */
    effectiveConfig: Configuration;
    /**
     * Enabled rules per line number.
     */
    enabledRulesPerLineNumber: Map<string, boolean>[];
    /**
     * Enabled rule list.
     */
    enabledRuleList: Rule[];
    /**
     * Rules severity.
     */
    rulesSeverity: Map<string, "error" | "warning">;
};
/**
 * Lint specified Markdown files.
 *
 * @param {Options | null} options Configuration options.
 * @param {LintCallback} callback Callback (err, result) function.
 * @returns {void}
 */
export declare function lintAsync(options: Options | null, callback: LintCallback): void;
/**
 * Lint specified Markdown files.
 *
 * @param {Options | null} options Configuration options.
 * @returns {Promise<LintResults>} Results object.
 */
export declare function lintPromise(options: Options | null): Promise<LintResults>;
/**
 * Lint specified Markdown files.
 *
 * @param {Options | null} options Configuration options.
 * @returns {LintResults} Results object.
 */
export declare function lintSync(options: Options | null): LintResults;
export type FsLike = {
    /**
     * access method.
     */
    access: (path: string, callback: (err: Error) => void) => void;
    /**
     * accessSync method.
     */
    accessSync: (path: string) => void;
    /**
     * readFile method.
     */
    readFile: (path: string, encoding: string, callback: (err: Error, data: string) => void) => void;
    /**
     * readFileSync method.
     */
    readFileSync: (path: string, encoding: string) => string;
};
/**
 * Extend specified configuration object.
 *
 * @param {Configuration} config Configuration object.
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[] | undefined} parsers Parsing function(s).
 * @param {FsLike} fs File system implementation.
 * @returns {Promise<Configuration>} Configuration object.
 */
export declare function extendConfigPromise(config: Configuration, file: string, parsers: ConfigurationParser[] | undefined, fs: FsLike): Promise<Configuration>;
/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[] | ReadConfigCallback} [parsers] Parsing function(s).
 * @param {FsLike | ReadConfigCallback} [fs] File system implementation.
 * @param {ReadConfigCallback} [callback] Callback (err, result) function.
 * @returns {void}
 */
export declare function readConfigAsync(file: string, parsers?: ConfigurationParser[] | ReadConfigCallback, fs?: FsLike | ReadConfigCallback, callback?: ReadConfigCallback): void;
/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} [parsers] Parsing function(s).
 * @param {FsLike} [fs] File system implementation.
 * @returns {Promise<Configuration>} Configuration object.
 */
export declare function readConfigPromise(file: string, parsers?: ConfigurationParser[], fs?: FsLike): Promise<Configuration>;
/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} [parsers] Parsing function(s).
 * @param {FsLike} [fs] File system implementation.
 * @returns {Configuration} Configuration object.
 */
export declare function readConfigSync(file: string, parsers?: ConfigurationParser[], fs?: FsLike): Configuration;
/**
 * Applies the specified fix to a Markdown content line.
 *
 * @param {string} line Line of Markdown content.
 * @param {FixInfo} fixInfo FixInfo instance.
 * @param {string} [lineEnding] Line ending to use.
 * @returns {string | null} Fixed content or null if deleted.
 */
export declare function applyFix(line: string, fixInfo: FixInfo, lineEnding?: string): string | null;
/**
 * Applies as many of the specified fixes as possible to Markdown content.
 *
 * @param {string} input Lines of Markdown content.
 * @param {LintError[]} errors LintError instances.
 * @returns {string} Fixed content.
 */
export declare function applyFixes(input: string, errors: LintError[]): string;
/**
 * Gets the (semantic) version of the library.
 *
 * @returns {string} SemVer string.
 */
export declare function getVersion(): string;
export type RuleFunction = (params: RuleParams, onError: RuleOnError) => void;
export type RuleParams = {
    /**
     * File/string name.
     */
    name: string;
    /**
     * Markdown parser data.
     */
    parsers: MarkdownParsers;
    /**
     * File/string lines.
     */
    lines: readonly string[];
    /**
     * Front matter lines.
     */
    frontMatterLines: readonly string[];
    /**
     * Rule configuration.
     */
    config: RuleConfiguration;
    /**
     * Version of the markdownlint library.
     */
    version: string;
};
export type MarkdownParsers = {
    /**
     * Markdown parser data from markdown-it (only present when Rule.parser is "markdownit").
     */
    markdownit: ParserMarkdownIt;
    /**
     * Markdown parser data from micromark (only present when Rule.parser is "micromark").
     */
    micromark: ParserMicromark;
};
export type ParserMarkdownIt = {
    /**
     * Token objects from markdown-it.
     */
    tokens: MarkdownItToken[];
};
export type ParserMicromark = {
    /**
     * Token objects from micromark.
     */
    tokens: MicromarkToken[];
};
export type MarkdownItBaseToken = {
    /**
     * HTML attributes.
     */
    attrs: string[][] | null;
    /**
     * Block-level token.
     */
    block: boolean;
    /**
     * Child nodes.
     */
    children: MarkdownItBaseToken[] | null;
    /**
     * Tag contents.
     */
    content: string;
    /**
     * Ignore element.
     */
    hidden: boolean;
    /**
     * Fence info.
     */
    info: string;
    /**
     * Nesting level.
     */
    level: number;
    /**
     * Beginning/ending line numbers.
     */
    map: number[] | null;
    /**
     * Markup text.
     */
    markup: string;
    /**
     * Arbitrary data.
     */
    meta: Object;
    /**
     * Level change.
     */
    nesting: number;
    /**
     * HTML tag name.
     */
    tag: string;
    /**
     * Token type.
     */
    type: string;
};
export type MarkdownItExtendedToken = {
    /**
     * Child nodes.
     */
    children: MarkdownItExtendedToken[] | null;
    /**
     * Line number (1-based).
     */
    lineNumber: number;
    /**
     * Line content.
     */
    line: string;
};
export type MarkdownItToken = MarkdownItBaseToken & MarkdownItExtendedToken;
export type MicromarkTokenType = import("micromark-util-types").TokenType;
export type MicromarkToken = {
    /**
     * Token type.
     */
    type: MicromarkTokenType;
    /**
     * Start line (1-based).
     */
    startLine: number;
    /**
     * Start column (1-based).
     */
    startColumn: number;
    /**
     * End line (1-based).
     */
    endLine: number;
    /**
     * End column (1-based).
     */
    endColumn: number;
    /**
     * Token text.
     */
    text: string;
    /**
     * Child tokens.
     */
    children: MicromarkToken[];
    /**
     * Parent token.
     */
    parent: MicromarkToken | null;
};
export type RuleOnError = (onErrorInfo: RuleOnErrorInfo) => void;
export type RuleOnErrorInfo = {
    /**
     * True if in front matter.
     */
    frontMatter?: boolean;
    /**
     * Line number (1-based).
     */
    lineNumber: number;
    /**
     * Detail about the error.
     */
    detail?: string;
    /**
     * Context for the error.
     */
    context?: string;
    /**
     * Link to more information.
     */
    information?: URL;
    /**
     * Column number (1-based) and length.
     */
    range?: number[];
    /**
     * Fix information.
     */
    fixInfo?: RuleOnErrorFixInfo;
};
export type RuleOnErrorFixInfo = {
    /**
     * Line number (1-based).
     */
    lineNumber?: number;
    /**
     * Column of the fix (1-based).
     */
    editColumn?: number;
    /**
     * Count of characters to delete.
     */
    deleteCount?: number;
    /**
     * Text to insert (after deleting).
     */
    insertText?: string;
};
export type Rule = {
    /**
     * Rule name(s).
     */
    names: string[];
    /**
     * Rule description.
     */
    description: string;
    /**
     * Link to more information.
     */
    information?: URL;
    /**
     * Rule tag(s).
     */
    tags: string[];
    /**
     * Parser used.
     */
    parser: "markdownit" | "micromark" | "none";
    /**
     * True if asynchronous.
     */
    asynchronous?: boolean;
    /**
     * Rule implementation.
     */
    function: RuleFunction;
};
export type MarkdownItParse = (src: string, env: Object) => MarkdownItBaseToken[];
export type MarkdownIt = import("markdown-it").MarkdownIt;
export type MarkdownItFactory = () => MarkdownIt | Promise<MarkdownIt>;
export type Options = {
    /**
     * Configuration object.
     */
    config?: Configuration;
    /**
     * Configuration parsers.
     */
    configParsers?: ConfigurationParser[];
    /**
     * Custom rules.
     */
    customRules?: Rule[] | Rule;
    /**
     * Files to lint.
     */
    files?: string[] | string;
    /**
     * Front matter pattern.
     */
    frontMatter?: RegExp | null;
    /**
     * File system implementation.
     */
    fs?: FsLike;
    /**
     * True to catch exceptions.
     */
    handleRuleFailures?: boolean;
    /**
     * Function to create a markdown-it parser.
     */
    markdownItFactory?: MarkdownItFactory;
    /**
     * True to ignore HTML directives.
     */
    noInlineConfig?: boolean;
    /**
     * Strings to lint.
     */
    strings?: Record<string, string>;
};
export type Plugin = Object[];
export type LintResults = {
    [k: string]: LintError[];
};
export type LintError = {
    /**
     * Line number (1-based).
     */
    lineNumber: number;
    /**
     * Rule name(s).
     */
    ruleNames: string[];
    /**
     * Rule description.
     */
    ruleDescription: string;
    /**
     * Link to more information.
     */
    ruleInformation: string | null;
    /**
     * Detail about the error.
     */
    errorDetail: string | null;
    /**
     * Context for the error.
     */
    errorContext: string | null;
    /**
     * Column number (1-based) and length.
     */
    errorRange: number[] | null;
    /**
     * Fix information.
     */
    fixInfo: FixInfo | null;
    /**
     * Severity of the error.
     */
    severity: "error" | "warning";
};
export type FixInfo = {
    /**
     * Line number (1-based).
     */
    lineNumber?: number;
    /**
     * Column of the fix (1-based).
     */
    editColumn?: number;
    /**
     * Count of characters to delete.
     */
    deleteCount?: number;
    /**
     * Text to insert (after deleting).
     */
    insertText?: string;
};
export type FixInfoNormalized = {
    /**
     * Line number (1-based).
     */
    lineNumber: number;
    /**
     * Column of the fix (1-based).
     */
    editColumn: number;
    /**
     * Count of characters to delete.
     */
    deleteCount: number;
    /**
     * Text to insert (after deleting).
     */
    insertText: string;
};
export type LintContentCallback = (error: Error | null, result?: LintError[]) => void;
export type LintCallback = (error: Error | null, results?: LintResults) => void;
export type Configuration = import("./configuration.d.ts").Configuration;
export type ConfigurationStrict = import("./configuration-strict.d.ts").ConfigurationStrict;
export type ConfigurationParser = (text: string) => Configuration;
export type ReadConfigCallback = (err: Error | null, config?: Configuration) => void;
export type ResolveConfigExtendsCallback = (err: Error | null, path?: string) => void;
export type RuleConfiguration = boolean | any;
/**
 * Function to implement rule logic.
 *
 * @callback RuleFunction
 * @param {RuleParams} params Rule parameters.
 * @param {RuleOnError} onError Error-reporting callback.
 * @returns {void}
 */
/**
 * Rule parameters.
 *
 * @typedef {Object} RuleParams
 * @property {string} name File/string name.
 * @property {MarkdownParsers} parsers Markdown parser data.
 * @property {readonly string[]} lines File/string lines.
 * @property {readonly string[]} frontMatterLines Front matter lines.
 * @property {RuleConfiguration} config Rule configuration.
 * @property {string} version Version of the markdownlint library.
 */
/**
 * Markdown parser data.
 *
 * @typedef {Object} MarkdownParsers
 * @property {ParserMarkdownIt} markdownit Markdown parser data from markdown-it (only present when Rule.parser is "markdownit").
 * @property {ParserMicromark} micromark Markdown parser data from micromark (only present when Rule.parser is "micromark").
 */
/**
 * Markdown parser data from markdown-it.
 *
 * @typedef {Object} ParserMarkdownIt
 * @property {MarkdownItToken[]} tokens Token objects from markdown-it.
 */
/**
 * Markdown parser data from micromark.
 *
 * @typedef {Object} ParserMicromark
 * @property {MicromarkToken[]} tokens Token objects from micromark.
 */
/**
 * markdown-it base token.
 *
 * @typedef {Object} MarkdownItBaseToken
 * @property {string[][] | null} attrs HTML attributes.
 * @property {boolean} block Block-level token.
 * @property {MarkdownItBaseToken[] | null} children Child nodes.
 * @property {string} content Tag contents.
 * @property {boolean} hidden Ignore element.
 * @property {string} info Fence info.
 * @property {number} level Nesting level.
 * @property {number[] | null} map Beginning/ending line numbers.
 * @property {string} markup Markup text.
 * @property {Object} meta Arbitrary data.
 * @property {number} nesting Level change.
 * @property {string} tag HTML tag name.
 * @property {string} type Token type.
 */
/**
 * markdown-it extended token.
 *
 * @typedef {Object} MarkdownItExtendedToken
 * @property {MarkdownItExtendedToken[] | null} children Child nodes.
 * @property {number} lineNumber Line number (1-based).
 * @property {string} line Line content.
 */
/**
 * markdown-it token.
 *
 * @typedef {MarkdownItBaseToken & MarkdownItExtendedToken} MarkdownItToken
 */
/** @typedef {import("micromark-util-types").TokenType} MicromarkTokenType */
/**
 * micromark token.
 *
 * @typedef {Object} MicromarkToken
 * @property {MicromarkTokenType} type Token type.
 * @property {number} startLine Start line (1-based).
 * @property {number} startColumn Start column (1-based).
 * @property {number} endLine End line (1-based).
 * @property {number} endColumn End column (1-based).
 * @property {string} text Token text.
 * @property {MicromarkToken[]} children Child tokens.
 * @property {MicromarkToken | null} parent Parent token.
 */
/**
 * Error-reporting callback.
 *
 * @callback RuleOnError
 * @param {RuleOnErrorInfo} onErrorInfo Error information.
 * @returns {void}
 */
/**
 * Fix information for RuleOnError callback.
 *
 * @typedef {Object} RuleOnErrorInfo
 * @property {boolean} [frontMatter] True if in front matter.
 * @property {number} lineNumber Line number (1-based).
 * @property {string} [detail] Detail about the error.
 * @property {string} [context] Context for the error.
 * @property {URL} [information] Link to more information.
 * @property {number[]} [range] Column number (1-based) and length.
 * @property {RuleOnErrorFixInfo} [fixInfo] Fix information.
 */
/**
 * Fix information for RuleOnErrorInfo.
 *
 * @typedef {Object} RuleOnErrorFixInfo
 * @property {number} [lineNumber] Line number (1-based).
 * @property {number} [editColumn] Column of the fix (1-based).
 * @property {number} [deleteCount] Count of characters to delete.
 * @property {string} [insertText] Text to insert (after deleting).
 */
/**
 * Rule definition.
 *
 * @typedef {Object} Rule
 * @property {string[]} names Rule name(s).
 * @property {string} description Rule description.
 * @property {URL} [information] Link to more information.
 * @property {string[]} tags Rule tag(s).
 * @property {"markdownit" | "micromark" | "none"} parser Parser used.
 * @property {boolean} [asynchronous] True if asynchronous.
 * @property {RuleFunction} function Rule implementation.
 */
/**
 * Method used by the markdown-it parser to parse input.
 *
 * @callback MarkdownItParse
 * @param {string} src Source string.
 * @param {Object} env Environment sandbox.
 * @returns {MarkdownItBaseToken[]} Tokens.
 */
/** @typedef {import("markdown-it").MarkdownIt} MarkdownIt */
/**
 * Gets an instance of the markdown-it parser. Any plugins should already have been loaded.
 *
 * @callback MarkdownItFactory
 * @returns {MarkdownIt|Promise<MarkdownIt>} Instance of the markdown-it parser.
 */
/**
 * Configuration options.
 *
 * @typedef {Object} Options
 * @property {Configuration} [config] Configuration object.
 * @property {ConfigurationParser[]} [configParsers] Configuration parsers.
 * @property {Rule[] | Rule} [customRules] Custom rules.
 * @property {string[] | string} [files] Files to lint.
 * @property {RegExp | null} [frontMatter] Front matter pattern.
 * @property {FsLike} [fs] File system implementation.
 * @property {boolean} [handleRuleFailures] True to catch exceptions.
 * @property {MarkdownItFactory} [markdownItFactory] Function to create a markdown-it parser.
 * @property {boolean} [noInlineConfig] True to ignore HTML directives.
 * @property {Object.<string, string>} [strings] Strings to lint.
 */
/**
 * A markdown-it plugin.
 *
 * @typedef {Object[]} Plugin
 */
/**
 * Lint results.
 *
 * @typedef {{[k: string]: LintError[]}} LintResults
 */
/**
 * Lint error.
 *
 * @typedef {Object} LintError
 * @property {number} lineNumber Line number (1-based).
 * @property {string[]} ruleNames Rule name(s).
 * @property {string} ruleDescription Rule description.
 * @property {string | null} ruleInformation Link to more information.
 * @property {string | null} errorDetail Detail about the error.
 * @property {string | null} errorContext Context for the error.
 * @property {number[] | null} errorRange Column number (1-based) and length.
 * @property {FixInfo | null} fixInfo Fix information.
 * @property {"error" | "warning"} severity Severity of the error.
 */
/**
 * Fix information.
 *
 * @typedef {Object} FixInfo
 * @property {number} [lineNumber] Line number (1-based).
 * @property {number} [editColumn] Column of the fix (1-based).
 * @property {number} [deleteCount] Count of characters to delete.
 * @property {string} [insertText] Text to insert (after deleting).
 */
/**
 * FixInfo with all optional properties present.
 *
 * @typedef {Object} FixInfoNormalized
 * @property {number} lineNumber Line number (1-based).
 * @property {number} editColumn Column of the fix (1-based).
 * @property {number} deleteCount Count of characters to delete.
 * @property {string} insertText Text to insert (after deleting).
 */
/**
 * Called with the result of linting a string or document.
 *
 * @callback LintContentCallback
 * @param {Error | null} error Error iff failed.
 * @param {LintError[]} [result] Result iff successful.
 * @returns {void}
 */
/**
 * Called with the result of the lint function.
 *
 * @callback LintCallback
 * @param {Error | null} error Error object iff failed.
 * @param {LintResults} [results] Lint results iff succeeded.
 * @returns {void}
 */
/**
 * Configuration object for linting rules. For the JSON schema, see
 * {@link ../schema/markdownlint-config-schema.json}.
 *
 * @typedef {import("./configuration.d.ts").Configuration} Configuration
 */
/**
 * Configuration object for linting rules strictly. For the JSON schema, see
 * {@link ../schema/markdownlint-config-schema-strict.json}.
 *
 * @typedef {import("./configuration-strict.d.ts").ConfigurationStrict} ConfigurationStrict
 */
/**
 * Parses a configuration string and returns a configuration object.
 *
 * @callback ConfigurationParser
 * @param {string} text Configuration string.
 * @returns {Configuration}
 */
/**
 * Called with the result of the readConfig function.
 *
 * @callback ReadConfigCallback
 * @param {Error | null} err Error object or null.
 * @param {Configuration} [config] Configuration object.
 * @returns {void}
 */
/**
 * Called with the result of the resolveConfigExtends function.
 *
 * @callback ResolveConfigExtendsCallback
 * @param {Error | null} err Error object or null.
 * @param {string} [path] Resolved path to file.
 * @returns {void}
 */
/**
 * Rule configuration object.
 *
 * @typedef {boolean | any} RuleConfiguration Rule configuration.
 */
