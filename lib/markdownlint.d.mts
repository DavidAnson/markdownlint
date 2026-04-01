/**
 * Lint specified Markdown files.
 *
 * @param {Options | null} options Configuration options.
 * @param {LintCallback} callback Callback (err, result) function.
 * @returns {void}
 */
export function lintAsync(options: Options | null, callback: LintCallback): void;
/**
 * Lint specified Markdown files.
 *
 * @param {Options | null} options Configuration options.
 * @returns {Promise<LintResults>} Results object.
 */
export function lintPromise(options: Options | null): Promise<LintResults>;
/**
 * Lint specified Markdown files.
 *
 * @param {Options | null} options Configuration options.
 * @returns {LintResults} Results object.
 */
export function lintSync(options: Options | null): LintResults;
/**
 * Extend specified configuration object.
 *
 * @param {Configuration} config Configuration object.
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[] | undefined} parsers Parsing function(s).
 * @param {FsLike} fs File system implementation.
 * @returns {Promise<Configuration>} Configuration object.
 */
export function extendConfigPromise(config: Configuration, file: string, parsers: ConfigurationParser[] | undefined, fs: FsLike): Promise<Configuration>;
/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[] | ReadConfigCallback} [parsers] Parsing function(s).
 * @param {FsLike | ReadConfigCallback} [fs] File system implementation.
 * @param {ReadConfigCallback} [callback] Callback (err, result) function.
 * @returns {void}
 */
export function readConfigAsync(file: string, parsers?: ConfigurationParser[] | ReadConfigCallback, fs?: FsLike | ReadConfigCallback, callback?: ReadConfigCallback): void;
/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} [parsers] Parsing function(s).
 * @param {FsLike} [fs] File system implementation.
 * @returns {Promise<Configuration>} Configuration object.
 */
export function readConfigPromise(file: string, parsers?: ConfigurationParser[], fs?: FsLike): Promise<Configuration>;
/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} [parsers] Parsing function(s).
 * @param {FsLike} [fs] File system implementation.
 * @returns {Configuration} Configuration object.
 */
export function readConfigSync(file: string, parsers?: ConfigurationParser[], fs?: FsLike): Configuration;
/**
 * Applies the specified fix to a Markdown content line.
 *
 * @param {string} line Line of Markdown content.
 * @param {FixInfo} fixInfo FixInfo instance.
 * @param {string} [lineEnding] Line ending to use.
 * @returns {string | null} Fixed content or null if deleted.
 */
export function applyFix(line: string, fixInfo: FixInfo, lineEnding?: string): string | null;
/**
 * Applies as many of the specified fixes as possible to Markdown content.
 *
 * @param {string} input Lines of Markdown content.
 * @param {LintError[]} errors LintError instances.
 * @returns {string} Fixed content.
 */
export function applyFixes(input: string, errors: LintError[]): string;
/**
 * Gets the (semantic) version of the library.
 *
 * @returns {string} SemVer string.
 */
export function getVersion(): string;
/**
 * Result object for removeFrontMatter.
 */
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
/**
 * Result object for getEffectiveConfig.
 */
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
/**
 * Result object for getEnabledRulesPerLineNumber.
 */
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
 * Node fs instance (or compatible object).
 */
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
 * Function to implement rule logic.
 */
export type RuleFunction = (params: RuleParams, onError: RuleOnError) => void;
/**
 * Rule parameters.
 */
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
/**
 * Markdown parser data.
 */
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
/**
 * Markdown parser data from markdown-it.
 */
export type ParserMarkdownIt = {
    /**
     * Token objects from markdown-it.
     */
    tokens: MarkdownItToken[];
};
/**
 * Markdown parser data from micromark.
 */
export type ParserMicromark = {
    /**
     * Token objects from micromark.
     */
    tokens: MicromarkToken[];
};
/**
 * markdown-it base token.
 */
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
/**
 * markdown-it extended token.
 */
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
/**
 * markdown-it token.
 */
export type MarkdownItToken = MarkdownItBaseToken & MarkdownItExtendedToken;
export type MicromarkTokenType = import("micromark-util-types").TokenType;
/**
 * micromark token.
 */
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
/**
 * Error-reporting callback.
 */
export type RuleOnError = (onErrorInfo: RuleOnErrorInfo) => void;
/**
 * Fix information for RuleOnError callback.
 */
export type RuleOnErrorInfo = {
    /**
     * Line number (1-based).
     */
    lineNumber: number;
    /**
     * Detail about the error.
     */
    detail?: string | undefined;
    /**
     * Context for the error.
     */
    context?: string | undefined;
    /**
     * Link to more information.
     */
    information?: URL | undefined;
    /**
     * Column number (1-based) and length.
     */
    range?: number[] | undefined;
    /**
     * Fix information.
     */
    fixInfo?: RuleOnErrorFixInfo | undefined;
};
/**
 * Fix information for RuleOnErrorInfo.
 */
export type RuleOnErrorFixInfo = {
    /**
     * Line number (1-based).
     */
    lineNumber?: number | undefined;
    /**
     * Column of the fix (1-based).
     */
    editColumn?: number | undefined;
    /**
     * Count of characters to delete.
     */
    deleteCount?: number | undefined;
    /**
     * Text to insert (after deleting).
     */
    insertText?: string | undefined;
};
/**
 * Rule definition.
 */
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
    information?: URL | undefined;
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
    asynchronous?: boolean | undefined;
    /**
     * Rule implementation.
     */
    function: RuleFunction;
};
/**
 * Method used by the markdown-it parser to parse input.
 */
export type MarkdownItParse = (src: string, env: Object) => MarkdownItBaseToken[];
/**
 * Instance of the markdown-it parser.
 */
export type MarkdownIt = {
    /**
     * Method to parse input.
     */
    parse: MarkdownItParse;
};
/**
 * Gets an instance of the markdown-it parser. Any plugins should already have been loaded.
 */
export type MarkdownItFactory = () => MarkdownIt | Promise<MarkdownIt>;
/**
 * Configuration options.
 */
export type Options = {
    /**
     * Configuration object.
     */
    config?: import("./configuration.d.ts").Configuration | undefined;
    /**
     * Configuration parsers.
     */
    configParsers?: ConfigurationParser[] | undefined;
    /**
     * Custom rules.
     */
    customRules?: Rule | Rule[] | undefined;
    /**
     * Files to lint.
     */
    files?: string | string[] | undefined;
    /**
     * Front matter pattern.
     */
    frontMatter?: RegExp | null | undefined;
    /**
     * File system implementation.
     */
    fs?: FsLike | undefined;
    /**
     * True to catch exceptions.
     */
    handleRuleFailures?: boolean | undefined;
    /**
     * Function to create a markdown-it parser.
     */
    markdownItFactory?: MarkdownItFactory | undefined;
    /**
     * True to ignore HTML directives.
     */
    noInlineConfig?: boolean | undefined;
    /**
     * Strings to lint.
     */
    strings?: {
        [x: string]: string;
    } | undefined;
};
/**
 * A markdown-it plugin.
 */
export type Plugin = Object[];
/**
 * Lint results.
 */
export type LintResults = {
    [x: string]: LintError[];
};
/**
 * Lint error.
 */
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
/**
 * Fix information.
 */
export type FixInfo = {
    /**
     * Line number (1-based).
     */
    lineNumber?: number | undefined;
    /**
     * Column of the fix (1-based).
     */
    editColumn?: number | undefined;
    /**
     * Count of characters to delete.
     */
    deleteCount?: number | undefined;
    /**
     * Text to insert (after deleting).
     */
    insertText?: string | undefined;
};
/**
 * FixInfo with all optional properties present.
 */
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
/**
 * Called with the result of linting a string or document.
 */
export type LintContentCallback = (error: Error | null, result?: LintError[] | undefined) => void;
/**
 * Called with the result of the lint function.
 */
export type LintCallback = (error: Error | null, results?: {
    [x: string]: LintError[];
} | undefined) => void;
/**
 * Configuration object for linting rules. For the JSON schema, see
 * {@link  ../schema/markdownlint-config-schema.json}.
 */
export type Configuration = import("./configuration.d.ts").Configuration;
/**
 * Configuration object for linting rules strictly. For the JSON schema, see
 * {@link  ../schema/markdownlint-config-schema-strict.json}.
 */
export type ConfigurationStrict = import("./configuration-strict.d.ts").ConfigurationStrict;
/**
 * Parses a configuration string and returns a configuration object.
 */
export type ConfigurationParser = (text: string) => Configuration;
/**
 * Called with the result of the readConfig function.
 */
export type ReadConfigCallback = (err: Error | null, config?: import("./configuration.d.ts").Configuration | undefined) => void;
/**
 * Called with the result of the resolveConfigExtends function.
 */
export type ResolveConfigExtendsCallback = (err: Error | null, path?: string | undefined) => void;
/**
 * Rule configuration.
 */
export type RuleConfiguration = boolean | any;
