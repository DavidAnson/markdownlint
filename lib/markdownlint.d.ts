export = markdownlint;
/**
 * Lint specified Markdown files.
 *
 * @param {Options} options Configuration options.
 * @param {LintCallback} callback Callback (err, result) function.
 * @returns {void}
 */
declare function markdownlint(options: Options, callback: LintCallback): void;
declare namespace markdownlint {
    export { markdownlintSync as sync, readConfig, readConfigSync, getVersion, promises, RuleFunction, RuleParams, MarkdownItToken, RuleOnError, RuleOnErrorInfo, RuleOnErrorFixInfo, Rule, Options, Plugin, ToStringCallback, LintResults, LintError, FixInfo, LintCallback, Configuration, RuleConfiguration, ConfigurationParser, ReadConfigCallback };
}
/**
 * Configuration options.
 */
type Options = {
    /**
     * Files to lint.
     */
    files?: string[] | string;
    /**
     * Strings to lint.
     */
    strings?: {
        [x: string]: string;
    };
    /**
     * Configuration object.
     */
    config?: Configuration;
    /**
     * Custom rules.
     */
    customRules?: Rule[] | Rule;
    /**
     * Front matter pattern.
     */
    frontMatter?: RegExp;
    /**
     * True to catch exceptions.
     */
    handleRuleFailures?: boolean;
    /**
     * True to ignore HTML directives.
     */
    noInlineConfig?: boolean;
    /**
     * Results object version.
     */
    resultVersion?: number;
    /**
     * Additional plugins.
     */
    markdownItPlugins?: Plugin[];
};
/**
 * Called with the result of the lint operation.
 */
type LintCallback = (err: Error | null, results?: LintResults) => void;
/**
 * Lint specified Markdown files synchronously.
 *
 * @param {Options} options Configuration options.
 * @returns {LintResults} Results object.
 */
declare function markdownlintSync(options: Options): LintResults;
/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[] | ReadConfigCallback} parsers Parsing
 * function(s).
 * @param {ReadConfigCallback} [callback] Callback (err, result) function.
 * @returns {void}
 */
declare function readConfig(file: string, parsers: ConfigurationParser[] | ReadConfigCallback, callback?: ReadConfigCallback): void;
/**
 * Read specified configuration file synchronously.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} [parsers] Parsing function(s).
 * @returns {Configuration} Configuration object.
 */
declare function readConfigSync(file: string, parsers?: ConfigurationParser[]): Configuration;
/**
 * Gets the (semantic) version of the library.
 *
 * @returns {string} SemVer string.
 */
declare function getVersion(): string;
declare namespace promises {
    export { markdownlintPromise as markdownlint };
    export { readConfigPromise as readConfig };
}
/**
 * Function to implement rule logic.
 */
type RuleFunction = (params: RuleParams, onError: RuleOnError) => void;
/**
 * Rule parameters.
 */
type RuleParams = {
    /**
     * File/string name.
     */
    name: string;
    /**
     * Token objects from markdown-it.
     */
    tokens: MarkdownItToken[];
    /**
     * File/string lines.
     */
    lines: string[];
    /**
     * Front matter lines.
     */
    frontMatterLines: string[];
    /**
     * Rule configuration.
     */
    config: RuleConfiguration;
};
/**
 * Markdown-It token.
 */
type MarkdownItToken = {
    /**
     * HTML attributes.
     */
    attrs: string[][];
    /**
     * Block-level token.
     */
    block: boolean;
    /**
     * Child nodes.
     */
    children: MarkdownItToken[];
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
    map: number[];
    /**
     * Markup text.
     */
    markup: string;
    /**
     * Arbitrary data.
     */
    meta: any;
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
 * Error-reporting callback.
 */
type RuleOnError = (onErrorInfo: RuleOnErrorInfo) => void;
/**
 * Fix information for RuleOnError callback.
 */
type RuleOnErrorInfo = {
    /**
     * Line number (1-based).
     */
    lineNumber: number;
    /**
     * Details about the error.
     */
    details?: string;
    /**
     * Context for the error.
     */
    context?: string;
    /**
     * Column number (1-based) and length.
     */
    range?: number[];
    /**
     * Fix information.
     */
    fixInfo?: RuleOnErrorFixInfo;
};
/**
 * Fix information for RuleOnErrorInfo.
 */
type RuleOnErrorFixInfo = {
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
/**
 * Rule definition.
 */
type Rule = {
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
     * Rule implementation.
     */
    function: RuleFunction;
};
/**
 * A markdown-it plugin.
 */
type Plugin = any[];
/**
 * Function to pretty-print lint results.
 */
type ToStringCallback = (ruleAliases?: boolean) => string;
/**
 * Lint results (for resultVersion 3).
 */
type LintResults = {
    [x: string]: LintError[];
};
/**
 * Lint error.
 */
type LintError = {
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
    ruleInformation: string;
    /**
     * Detail about the error.
     */
    errorDetail: string;
    /**
     * Context for the error.
     */
    errorContext: string;
    /**
     * Column number (1-based) and length.
     */
    errorRange: number[];
    /**
     * Fix information.
     */
    fixInfo?: FixInfo;
};
/**
 * Fix information.
 */
type FixInfo = {
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
/**
 * Configuration object for linting rules. For a detailed schema, see
 * {@link ../schema/markdownlint-config-schema.json}.
 */
type Configuration = {
    [x: string]: any;
};
/**
 * Rule configuration.
 */
type RuleConfiguration = any;
/**
 * Parses a configuration string and returns a configuration object.
 */
type ConfigurationParser = (text: string) => Configuration;
/**
 * Called with the result of the readConfig operation.
 */
type ReadConfigCallback = (err: Error | null, config?: Configuration) => void;
/**
 * Lint specified Markdown files.
 *
 * @param {Options} options Configuration options.
 * @returns {Promise<LintResults>} Results object.
 */
declare function markdownlintPromise(options: Options): Promise<LintResults>;
/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} [parsers] Parsing function(s).
 * @returns {Promise<Configuration>} Configuration object.
 */
declare function readConfigPromise(file: string, parsers?: ConfigurationParser[]): Promise<Configuration>;
