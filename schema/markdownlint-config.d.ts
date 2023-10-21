/* eslint-disable */
export interface Config {
  /**
   * accessibility - [MD045](https://github.com/DavidAnson/markdownlint/blob/main/doc/md045.md)
   */
  accessibility?: boolean;
  /**
   * atx - [MD018](https://github.com/DavidAnson/markdownlint/blob/main/doc/md018.md),
   * [MD019](https://github.com/DavidAnson/markdownlint/blob/main/doc/md019.md)
   */
  atx?: boolean;
  /**
   * atx_closed - [MD020](https://github.com/DavidAnson/markdownlint/blob/main/doc/md020.md),
   * [MD021](https://github.com/DavidAnson/markdownlint/blob/main/doc/md021.md)
   */
  atx_closed?: boolean;
  /**
   * blank_lines - [MD012](https://github.com/DavidAnson/markdownlint/blob/main/doc/md012.md),
   * [MD022](https://github.com/DavidAnson/markdownlint/blob/main/doc/md022.md),
   * [MD031](https://github.com/DavidAnson/markdownlint/blob/main/doc/md031.md),
   * [MD032](https://github.com/DavidAnson/markdownlint/blob/main/doc/md032.md),
   * [MD047](https://github.com/DavidAnson/markdownlint/blob/main/doc/md047.md)
   */
  blank_lines?: boolean;
  /**
   * Fenced code blocks should be surrounded by blank lines
   *
   * @see [MD031](https://github.com/DavidAnson/markdownlint/blob/main/doc/md031.md)
   */
  "blanks-around-fences"?: boolean | MD031Class;
  /**
   * Headings should be surrounded by blank lines
   *
   * @see [MD022](https://github.com/DavidAnson/markdownlint/blob/main/doc/md022.md)
   */
  "blanks-around-headers"?: boolean | MD022Class;
  /**
   * Headings should be surrounded by blank lines
   *
   * @see [MD022](https://github.com/DavidAnson/markdownlint/blob/main/doc/md022.md)
   */
  "blanks-around-headings"?: boolean | MD022Class;
  /**
   * Lists should be surrounded by blank lines
   *
   * @see [MD032](https://github.com/DavidAnson/markdownlint/blob/main/doc/md032.md)
   */
  "blanks-around-lists"?: boolean;
  /**
   * blockquote - [MD027](https://github.com/DavidAnson/markdownlint/blob/main/doc/md027.md),
   * [MD028](https://github.com/DavidAnson/markdownlint/blob/main/doc/md028.md)
   */
  blockquote?: boolean;
  /**
   * bullet - [MD004](https://github.com/DavidAnson/markdownlint/blob/main/doc/md004.md),
   * [MD005](https://github.com/DavidAnson/markdownlint/blob/main/doc/md005.md),
   * [MD006](https://github.com/DavidAnson/markdownlint/blob/main/doc/md006.md),
   * [MD007](https://github.com/DavidAnson/markdownlint/blob/main/doc/md007.md),
   * [MD032](https://github.com/DavidAnson/markdownlint/blob/main/doc/md032.md)
   */
  bullet?: boolean;
  /**
   * code - [MD014](https://github.com/DavidAnson/markdownlint/blob/main/doc/md014.md),
   * [MD031](https://github.com/DavidAnson/markdownlint/blob/main/doc/md031.md),
   * [MD038](https://github.com/DavidAnson/markdownlint/blob/main/doc/md038.md),
   * [MD040](https://github.com/DavidAnson/markdownlint/blob/main/doc/md040.md),
   * [MD046](https://github.com/DavidAnson/markdownlint/blob/main/doc/md046.md),
   * [MD048](https://github.com/DavidAnson/markdownlint/blob/main/doc/md048.md)
   */
  code?: boolean;
  /**
   * Code block style
   *
   * @see [MD046](https://github.com/DavidAnson/markdownlint/blob/main/doc/md046.md)
   */
  "code-block-style"?: boolean | MD046Class;
  /**
   * Code fence style
   *
   * @see [MD048](https://github.com/DavidAnson/markdownlint/blob/main/doc/md048.md)
   */
  "code-fence-style"?: boolean | MD048Class;
  /**
   * Dollar signs used before commands without showing output
   *
   * @see [MD014](https://github.com/DavidAnson/markdownlint/blob/main/doc/md014.md)
   */
  "commands-show-output"?: boolean;
  /**
   * Default state for all rules
   */
  default?: boolean;
  /**
   * emphasis - [MD036](https://github.com/DavidAnson/markdownlint/blob/main/doc/md036.md),
   * [MD037](https://github.com/DavidAnson/markdownlint/blob/main/doc/md037.md),
   * [MD049](https://github.com/DavidAnson/markdownlint/blob/main/doc/md049.md),
   * [MD050](https://github.com/DavidAnson/markdownlint/blob/main/doc/md050.md)
   */
  emphasis?: boolean;
  /**
   * Emphasis style should be consistent
   *
   * @see [MD049](https://github.com/DavidAnson/markdownlint/blob/main/doc/md049.md)
   */
  "emphasis-style"?: boolean | MD049Class;
  /**
   * Path to configuration file to extend
   */
  extends?: null | string;
  /**
   * Fenced code blocks should have a language specified
   *
   * @see [MD040](https://github.com/DavidAnson/markdownlint/blob/main/doc/md040.md)
   */
  "fenced-code-language"?: boolean | MD040Class;
  /**
   * First heading should be a top-level heading
   *
   * @see [MD002](https://github.com/DavidAnson/markdownlint/blob/main/doc/md002.md)
   * @deprecated
   */
  "first-header-h1"?: boolean | MD002Class;
  /**
   * First heading should be a top-level heading
   *
   * @see [MD002](https://github.com/DavidAnson/markdownlint/blob/main/doc/md002.md)
   * @deprecated
   */
  "first-heading-h1"?: boolean | MD002Class;
  /**
   * First line in a file should be a top-level heading
   *
   * @see [MD041](https://github.com/DavidAnson/markdownlint/blob/main/doc/md041.md)
   */
  "first-line-h1"?: boolean | MD041Class;
  /**
   * First line in a file should be a top-level heading
   *
   * @see [MD041](https://github.com/DavidAnson/markdownlint/blob/main/doc/md041.md)
   */
  "first-line-heading"?: boolean | MD041Class;
  /**
   * hard_tab - [MD010](https://github.com/DavidAnson/markdownlint/blob/main/doc/md010.md)
   */
  hard_tab?: boolean;
  /**
   * Heading levels should only increment by one level at a time
   *
   * @see [MD001](https://github.com/DavidAnson/markdownlint/blob/main/doc/md001.md)
   */
  "header-increment"?: boolean;
  /**
   * Headings must start at the beginning of the line
   *
   * @see [MD023](https://github.com/DavidAnson/markdownlint/blob/main/doc/md023.md)
   */
  "header-start-left"?: boolean;
  /**
   * Heading style
   *
   * @see [MD003](https://github.com/DavidAnson/markdownlint/blob/main/doc/md003.md)
   */
  "header-style"?: boolean | MD003Class;
  /**
   * headers - [MD001](https://github.com/DavidAnson/markdownlint/blob/main/doc/md001.md),
   * [MD002](https://github.com/DavidAnson/markdownlint/blob/main/doc/md002.md),
   * [MD003](https://github.com/DavidAnson/markdownlint/blob/main/doc/md003.md),
   * [MD018](https://github.com/DavidAnson/markdownlint/blob/main/doc/md018.md),
   * [MD019](https://github.com/DavidAnson/markdownlint/blob/main/doc/md019.md),
   * [MD020](https://github.com/DavidAnson/markdownlint/blob/main/doc/md020.md),
   * [MD021](https://github.com/DavidAnson/markdownlint/blob/main/doc/md021.md),
   * [MD022](https://github.com/DavidAnson/markdownlint/blob/main/doc/md022.md),
   * [MD023](https://github.com/DavidAnson/markdownlint/blob/main/doc/md023.md),
   * [MD024](https://github.com/DavidAnson/markdownlint/blob/main/doc/md024.md),
   * [MD025](https://github.com/DavidAnson/markdownlint/blob/main/doc/md025.md),
   * [MD026](https://github.com/DavidAnson/markdownlint/blob/main/doc/md026.md),
   * [MD036](https://github.com/DavidAnson/markdownlint/blob/main/doc/md036.md),
   * [MD041](https://github.com/DavidAnson/markdownlint/blob/main/doc/md041.md),
   * [MD043](https://github.com/DavidAnson/markdownlint/blob/main/doc/md043.md)
   */
  headers?: boolean;
  /**
   * Heading levels should only increment by one level at a time
   *
   * @see [MD001](https://github.com/DavidAnson/markdownlint/blob/main/doc/md001.md)
   */
  "heading-increment"?: boolean;
  /**
   * Headings must start at the beginning of the line
   *
   * @see [MD023](https://github.com/DavidAnson/markdownlint/blob/main/doc/md023.md)
   */
  "heading-start-left"?: boolean;
  /**
   * Heading style
   *
   * @see [MD003](https://github.com/DavidAnson/markdownlint/blob/main/doc/md003.md)
   */
  "heading-style"?: boolean | MD003Class;
  /**
   * headings - [MD001](https://github.com/DavidAnson/markdownlint/blob/main/doc/md001.md),
   * [MD002](https://github.com/DavidAnson/markdownlint/blob/main/doc/md002.md),
   * [MD003](https://github.com/DavidAnson/markdownlint/blob/main/doc/md003.md),
   * [MD018](https://github.com/DavidAnson/markdownlint/blob/main/doc/md018.md),
   * [MD019](https://github.com/DavidAnson/markdownlint/blob/main/doc/md019.md),
   * [MD020](https://github.com/DavidAnson/markdownlint/blob/main/doc/md020.md),
   * [MD021](https://github.com/DavidAnson/markdownlint/blob/main/doc/md021.md),
   * [MD022](https://github.com/DavidAnson/markdownlint/blob/main/doc/md022.md),
   * [MD023](https://github.com/DavidAnson/markdownlint/blob/main/doc/md023.md),
   * [MD024](https://github.com/DavidAnson/markdownlint/blob/main/doc/md024.md),
   * [MD025](https://github.com/DavidAnson/markdownlint/blob/main/doc/md025.md),
   * [MD026](https://github.com/DavidAnson/markdownlint/blob/main/doc/md026.md),
   * [MD036](https://github.com/DavidAnson/markdownlint/blob/main/doc/md036.md),
   * [MD041](https://github.com/DavidAnson/markdownlint/blob/main/doc/md041.md),
   * [MD043](https://github.com/DavidAnson/markdownlint/blob/main/doc/md043.md)
   */
  headings?: boolean;
  /**
   * hr - [MD035](https://github.com/DavidAnson/markdownlint/blob/main/doc/md035.md)
   */
  hr?: boolean;
  /**
   * Horizontal rule style
   *
   * @see [MD035](https://github.com/DavidAnson/markdownlint/blob/main/doc/md035.md)
   */
  "hr-style"?: boolean | MD035Class;
  /**
   * html - [MD033](https://github.com/DavidAnson/markdownlint/blob/main/doc/md033.md)
   */
  html?: boolean;
  /**
   * images - [MD045](https://github.com/DavidAnson/markdownlint/blob/main/doc/md045.md),
   * [MD052](https://github.com/DavidAnson/markdownlint/blob/main/doc/md052.md),
   * [MD053](https://github.com/DavidAnson/markdownlint/blob/main/doc/md053.md)
   */
  images?: boolean;
  /**
   * indentation - [MD005](https://github.com/DavidAnson/markdownlint/blob/main/doc/md005.md),
   * [MD006](https://github.com/DavidAnson/markdownlint/blob/main/doc/md006.md),
   * [MD007](https://github.com/DavidAnson/markdownlint/blob/main/doc/md007.md),
   * [MD027](https://github.com/DavidAnson/markdownlint/blob/main/doc/md027.md)
   */
  indentation?: boolean;
  /**
   * language - [MD040](https://github.com/DavidAnson/markdownlint/blob/main/doc/md040.md)
   */
  language?: boolean;
  /**
   * Line length
   *
   * @see [MD013](https://github.com/DavidAnson/markdownlint/blob/main/doc/md013.md)
   */
  "line-length"?: boolean | MD013Class;
  /**
   * line_length - [MD013](https://github.com/DavidAnson/markdownlint/blob/main/doc/md013.md)
   */
  line_length?: boolean;
  /**
   * Link fragments should be valid
   *
   * @see [MD051](https://github.com/DavidAnson/markdownlint/blob/main/doc/md051.md)
   */
  "link-fragments"?: boolean;
  /**
   * Link and image reference definitions should be needed
   *
   * @see [MD053](https://github.com/DavidAnson/markdownlint/blob/main/doc/md053.md)
   */
  "link-image-reference-definitions"?: boolean | MD053Class;
  /**
   * links - [MD011](https://github.com/DavidAnson/markdownlint/blob/main/doc/md011.md),
   * [MD034](https://github.com/DavidAnson/markdownlint/blob/main/doc/md034.md),
   * [MD039](https://github.com/DavidAnson/markdownlint/blob/main/doc/md039.md),
   * [MD042](https://github.com/DavidAnson/markdownlint/blob/main/doc/md042.md),
   * [MD051](https://github.com/DavidAnson/markdownlint/blob/main/doc/md051.md),
   * [MD052](https://github.com/DavidAnson/markdownlint/blob/main/doc/md052.md),
   * [MD053](https://github.com/DavidAnson/markdownlint/blob/main/doc/md053.md)
   */
  links?: boolean;
  /**
   * Inconsistent indentation for list items at the same level
   *
   * @see [MD005](https://github.com/DavidAnson/markdownlint/blob/main/doc/md005.md)
   */
  "list-indent"?: boolean;
  /**
   * Spaces after list markers
   *
   * @see [MD030](https://github.com/DavidAnson/markdownlint/blob/main/doc/md030.md)
   */
  "list-marker-space"?: boolean | MD030Class;
  /**
   * Heading levels should only increment by one level at a time.
   *
   * Aliases: `heading-increment`, `header-increment`
   *
   * @see [MD001](https://github.com/DavidAnson/markdownlint/blob/main/doc/md001.md)
   */
  MD001?: boolean;
  /**
   * First heading should be a top-level heading.
   *
   * Aliases: `first-heading-h1`, `first-header-h1`
   *
   * @see [MD002](https://github.com/DavidAnson/markdownlint/blob/main/doc/md002.md)
   * @deprecated
   */
  MD002?: boolean | MD002Class;
  /**
   * Heading style.
   *
   * Aliases: `heading-style`, `header-style`
   *
   * @see [MD003](https://github.com/DavidAnson/markdownlint/blob/main/doc/md003.md)
   */
  MD003?: boolean | MD003Class;
  /**
   * Unordered list style.
   *
   * Aliases: `ul-style`
   *
   * @see [MD004](https://github.com/DavidAnson/markdownlint/blob/main/doc/md004.md)
   */
  MD004?: boolean | Md004;
  /**
   * Inconsistent indentation for list items at the same level.
   *
   * Aliases: `list-indent`
   *
   * @see [MD005](https://github.com/DavidAnson/markdownlint/blob/main/doc/md005.md)
   */
  MD005?: boolean;
  /**
   * Consider starting bulleted lists at the beginning of the line.
   *
   * Aliases: `ul-start-left`
   *
   * @see [MD006](https://github.com/DavidAnson/markdownlint/blob/main/doc/md006.md)
   * @deprecated
   */
  MD006?: boolean;
  /**
   * Unordered list indentation.
   *
   * Aliases: `ul-indent`
   *
   * @see [MD007](https://github.com/DavidAnson/markdownlint/blob/main/doc/md007.md)
   */
  MD007?: boolean | Md007;
  /**
   * Trailing spaces.
   *
   * Aliases: `no-trailing-spaces`
   *
   * @see [MD009](https://github.com/DavidAnson/markdownlint/blob/main/doc/md009.md)
   */
  MD009?: boolean | Md009;
  /**
   * Hard tabs.
   *
   * Aliases: `no-hard-tabs`
   *
   * @see [MD010](https://github.com/DavidAnson/markdownlint/blob/main/doc/md010.md)
   */
  MD010?: boolean | Md010;
  /**
   * Reversed link syntax.
   *
   * Aliases: `no-reversed-links`
   *
   * @see [MD011](https://github.com/DavidAnson/markdownlint/blob/main/doc/md011.md)
   */
  MD011?: boolean;
  /**
   * Multiple consecutive blank lines.
   *
   * Aliases: `no-multiple-blanks`
   *
   * @see [MD012](https://github.com/DavidAnson/markdownlint/blob/main/doc/md012.md)
   */
  MD012?: boolean | Md012;
  /**
   * Line length.
   *
   * Aliases: `line-length`
   *
   * @see [MD013](https://github.com/DavidAnson/markdownlint/blob/main/doc/md013.md)
   */
  MD013?: boolean | MD013Class;
  /**
   * Dollar signs used before commands without showing output.
   *
   * Aliases: `commands-show-output`
   *
   * @see [MD014](https://github.com/DavidAnson/markdownlint/blob/main/doc/md014.md)
   */
  MD014?: boolean;
  /**
   * No space after hash on atx style heading.
   *
   * Aliases: `no-missing-space-atx`
   *
   * @see [MD018](https://github.com/DavidAnson/markdownlint/blob/main/doc/md018.md)
   */
  MD018?: boolean;
  /**
   * Multiple spaces after hash on atx style heading.
   *
   * Aliases: `no-multiple-space-atx`
   *
   * @see [MD019](https://github.com/DavidAnson/markdownlint/blob/main/doc/md019.md)
   */
  MD019?: boolean;
  /**
   * No space inside hashes on closed atx style heading.
   *
   * Aliases: `no-missing-space-closed-atx`
   *
   * @see [MD020](https://github.com/DavidAnson/markdownlint/blob/main/doc/md020.md)
   */
  MD020?: boolean;
  /**
   * Multiple spaces inside hashes on closed atx style heading.
   *
   * Aliases: `no-multiple-space-closed-atx`
   *
   * @see [MD021](https://github.com/DavidAnson/markdownlint/blob/main/doc/md021.md)
   */
  MD021?: boolean;
  /**
   * Headings should be surrounded by blank lines.
   *
   * Aliases: `blanks-around-headings`, `blanks-around-headers`
   *
   * @see [MD022](https://github.com/DavidAnson/markdownlint/blob/main/doc/md022.md)
   */
  MD022?: boolean | MD022Class;
  /**
   * Headings must start at the beginning of the line.
   *
   * Aliases: `heading-start-left`, `header-start-left`
   *
   * @see [MD023](https://github.com/DavidAnson/markdownlint/blob/main/doc/md023.md)
   */
  MD023?: boolean;
  /**
   * Multiple headings with the same content.
   *
   * Aliases: `no-duplicate-heading`, `no-duplicate-header`
   *
   * @see [MD024](https://github.com/DavidAnson/markdownlint/blob/main/doc/md024.md)
   */
  MD024?: boolean | Md024;
  /**
   * Multiple top-level headings in the same document.
   *
   * Aliases: `single-title`, `single-h1`
   *
   * @see [MD025](https://github.com/DavidAnson/markdownlint/blob/main/doc/md025.md)
   */
  MD025?: boolean | Md025;
  /**
   * Trailing punctuation in heading.
   *
   * Aliases: `no-trailing-punctuation`
   *
   * @see [MD026](https://github.com/DavidAnson/markdownlint/blob/main/doc/md026.md)
   */
  MD026?: boolean | Md026;
  /**
   * Multiple spaces after blockquote symbol.
   *
   * Aliases: `no-multiple-space-blockquote`
   *
   * @see [MD027](https://github.com/DavidAnson/markdownlint/blob/main/doc/md027.md)
   */
  MD027?: boolean;
  /**
   * Blank line inside blockquote.
   *
   * Aliases: `no-blanks-blockquote`
   *
   * @see [MD028](https://github.com/DavidAnson/markdownlint/blob/main/doc/md028.md)
   */
  MD028?: boolean;
  /**
   * Ordered list item prefix.
   *
   * Aliases: `ol-prefix`
   *
   * @see [MD029](https://github.com/DavidAnson/markdownlint/blob/main/doc/md029.md)
   */
  MD029?: boolean | Md029;
  /**
   * Spaces after list markers.
   *
   * Aliases: `list-marker-space`
   *
   * @see [MD030](https://github.com/DavidAnson/markdownlint/blob/main/doc/md030.md)
   */
  MD030?: boolean | MD030Class;
  /**
   * Fenced code blocks should be surrounded by blank lines.
   *
   * Aliases: `blanks-around-fences`
   *
   * @see [MD031](https://github.com/DavidAnson/markdownlint/blob/main/doc/md031.md)
   */
  MD031?: boolean | MD031Class;
  /**
   * Lists should be surrounded by blank lines.
   *
   * Aliases: `blanks-around-lists`
   *
   * @see [MD032](https://github.com/DavidAnson/markdownlint/blob/main/doc/md032.md)
   */
  MD032?: boolean;
  /**
   * Inline HTML.
   *
   * Aliases: `no-inline-html`
   *
   * @see [MD033](https://github.com/DavidAnson/markdownlint/blob/main/doc/md033.md)
   */
  MD033?: boolean | Md033;
  /**
   * Bare URL used.
   *
   * Aliases: `no-bare-urls`
   *
   * @see [MD034](https://github.com/DavidAnson/markdownlint/blob/main/doc/md034.md)
   */
  MD034?: boolean;
  /**
   * Horizontal rule style.
   *
   * Aliases: `hr-style`
   *
   * @see [MD035](https://github.com/DavidAnson/markdownlint/blob/main/doc/md035.md)
   */
  MD035?: boolean | MD035Class;
  /**
   * Emphasis used instead of a heading.
   *
   * Aliases: `no-emphasis-as-heading`, `no-emphasis-as-header`
   *
   * @see [MD036](https://github.com/DavidAnson/markdownlint/blob/main/doc/md036.md)
   */
  MD036?: boolean | Md036;
  /**
   * Spaces inside emphasis markers.
   *
   * Aliases: `no-space-in-emphasis`
   *
   * @see [MD037](https://github.com/DavidAnson/markdownlint/blob/main/doc/md037.md)
   */
  MD037?: boolean;
  /**
   * Spaces inside code span elements.
   *
   * Aliases: `no-space-in-code`
   *
   * @see [MD038](https://github.com/DavidAnson/markdownlint/blob/main/doc/md038.md)
   */
  MD038?: boolean;
  /**
   * Spaces inside link text.
   *
   * Aliases: `no-space-in-links`
   *
   * @see [MD039](https://github.com/DavidAnson/markdownlint/blob/main/doc/md039.md)
   */
  MD039?: boolean;
  /**
   * Fenced code blocks should have a language specified.
   *
   * Aliases: `fenced-code-language`
   *
   * @see [MD040](https://github.com/DavidAnson/markdownlint/blob/main/doc/md040.md)
   */
  MD040?: boolean | MD040Class;
  /**
   * First line in a file should be a top-level heading.
   *
   * Aliases: `first-line-heading`, `first-line-h1`
   *
   * @see [MD041](https://github.com/DavidAnson/markdownlint/blob/main/doc/md041.md)
   */
  MD041?: boolean | MD041Class;
  /**
   * No empty links.
   *
   * Aliases: `no-empty-links`
   *
   * @see [MD042](https://github.com/DavidAnson/markdownlint/blob/main/doc/md042.md)
   */
  MD042?: boolean;
  /**
   * Required heading structure.
   *
   * Aliases: `required-headings`, `required-headers`
   *
   * @see [MD043](https://github.com/DavidAnson/markdownlint/blob/main/doc/md043.md)
   */
  MD043?: boolean | Md043;
  /**
   * Proper names should have the correct capitalization.
   *
   * Aliases: `proper-names`
   *
   * @see [MD044](https://github.com/DavidAnson/markdownlint/blob/main/doc/md044.md)
   */
  MD044?: boolean | Md044;
  /**
   * Images should have alternate text (alt text).
   *
   * Aliases: `no-alt-text`
   *
   * @see [MD045](https://github.com/DavidAnson/markdownlint/blob/main/doc/md045.md)
   */
  MD045?: boolean;
  /**
   * Code block style.
   *
   * Aliases: `code-block-style`
   *
   * @see [MD046](https://github.com/DavidAnson/markdownlint/blob/main/doc/md046.md)
   */
  MD046?: boolean | MD046Class;
  /**
   * Files should end with a single newline character.
   *
   * Aliases: `single-trailing-newline`
   *
   * @see [MD047](https://github.com/DavidAnson/markdownlint/blob/main/doc/md047.md)
   */
  MD047?: boolean;
  /**
   * Code fence style.
   *
   * Aliases: `code-fence-style`
   *
   * @see [MD048](https://github.com/DavidAnson/markdownlint/blob/main/doc/md048.md)
   */
  MD048?: boolean | MD048Class;
  /**
   * Emphasis style should be consistent.
   *
   * Aliases: `emphasis-style`
   *
   * @see [MD049](https://github.com/DavidAnson/markdownlint/blob/main/doc/md049.md)
   */
  MD049?: boolean | MD049Class;
  /**
   * Strong style should be consistent.
   *
   * Aliases: `strong-style`
   *
   * @see [MD050](https://github.com/DavidAnson/markdownlint/blob/main/doc/md050.md)
   */
  MD050?: boolean | Md050;
  /**
   * Link fragments should be valid.
   *
   * Aliases: `link-fragments`
   *
   * @see [MD051](https://github.com/DavidAnson/markdownlint/blob/main/doc/md051.md)
   */
  MD051?: boolean;
  /**
   * Reference links and images should use a label that is defined.
   *
   * Aliases: `reference-links-images`
   *
   * @see [MD052](https://github.com/DavidAnson/markdownlint/blob/main/doc/md052.md)
   */
  MD052?: boolean | Md052;
  /**
   * Link and image reference definitions should be needed.
   *
   * Aliases: `link-image-reference-definitions`
   *
   * @see [MD053](https://github.com/DavidAnson/markdownlint/blob/main/doc/md053.md)
   */
  MD053?: boolean | MD053Class;
  /**
   * Images should have alternate text (alt text)
   *
   * @see [MD045](https://github.com/DavidAnson/markdownlint/blob/main/doc/md045.md)
   */
  "no-alt-text"?: boolean;
  /**
   * Bare URL used
   *
   * @see [MD034](https://github.com/DavidAnson/markdownlint/blob/main/doc/md034.md)
   */
  "no-bare-urls"?: boolean;
  /**
   * Blank line inside blockquote
   *
   * @see [MD028](https://github.com/DavidAnson/markdownlint/blob/main/doc/md028.md)
   */
  "no-blanks-blockquote"?: boolean;
  /**
   * Multiple headings with the same content
   *
   * @see [MD024](https://github.com/DavidAnson/markdownlint/blob/main/doc/md024.md)
   */
  "no-duplicate-header"?: boolean | Md024;
  /**
   * Multiple headings with the same content
   *
   * @see [MD024](https://github.com/DavidAnson/markdownlint/blob/main/doc/md024.md)
   */
  "no-duplicate-heading"?: boolean | Md024;
  /**
   * Emphasis used instead of a heading
   *
   * @see [MD036](https://github.com/DavidAnson/markdownlint/blob/main/doc/md036.md)
   */
  "no-emphasis-as-header"?: boolean | Md036;
  /**
   * Emphasis used instead of a heading
   *
   * @see [MD036](https://github.com/DavidAnson/markdownlint/blob/main/doc/md036.md)
   */
  "no-emphasis-as-heading"?: boolean | Md036;
  /**
   * No empty links
   *
   * @see [MD042](https://github.com/DavidAnson/markdownlint/blob/main/doc/md042.md)
   */
  "no-empty-links"?: boolean;
  /**
   * Hard tabs
   *
   * @see [MD010](https://github.com/DavidAnson/markdownlint/blob/main/doc/md010.md)
   */
  "no-hard-tabs"?: boolean | Md010;
  /**
   * Inline HTML
   *
   * @see [MD033](https://github.com/DavidAnson/markdownlint/blob/main/doc/md033.md)
   */
  "no-inline-html"?: boolean | Md033;
  /**
   * No space after hash on atx style heading
   *
   * @see [MD018](https://github.com/DavidAnson/markdownlint/blob/main/doc/md018.md)
   */
  "no-missing-space-atx"?: boolean;
  /**
   * No space inside hashes on closed atx style heading
   *
   * @see [MD020](https://github.com/DavidAnson/markdownlint/blob/main/doc/md020.md)
   */
  "no-missing-space-closed-atx"?: boolean;
  /**
   * Multiple consecutive blank lines
   *
   * @see [MD012](https://github.com/DavidAnson/markdownlint/blob/main/doc/md012.md)
   */
  "no-multiple-blanks"?: boolean | Md012;
  /**
   * Multiple spaces after hash on atx style heading
   *
   * @see [MD019](https://github.com/DavidAnson/markdownlint/blob/main/doc/md019.md)
   */
  "no-multiple-space-atx"?: boolean;
  /**
   * Multiple spaces after blockquote symbol
   *
   * @see [MD027](https://github.com/DavidAnson/markdownlint/blob/main/doc/md027.md)
   */
  "no-multiple-space-blockquote"?: boolean;
  /**
   * Multiple spaces inside hashes on closed atx style heading
   *
   * @see [MD021](https://github.com/DavidAnson/markdownlint/blob/main/doc/md021.md)
   */
  "no-multiple-space-closed-atx"?: boolean;
  /**
   * Reversed link syntax
   *
   * @see [MD011](https://github.com/DavidAnson/markdownlint/blob/main/doc/md011.md)
   */
  "no-reversed-links"?: boolean;
  /**
   * Spaces inside code span elements
   *
   * @see [MD038](https://github.com/DavidAnson/markdownlint/blob/main/doc/md038.md)
   */
  "no-space-in-code"?: boolean;
  /**
   * Spaces inside emphasis markers
   *
   * @see [MD037](https://github.com/DavidAnson/markdownlint/blob/main/doc/md037.md)
   */
  "no-space-in-emphasis"?: boolean;
  /**
   * Spaces inside link text
   *
   * @see [MD039](https://github.com/DavidAnson/markdownlint/blob/main/doc/md039.md)
   */
  "no-space-in-links"?: boolean;
  /**
   * Trailing punctuation in heading
   *
   * @see [MD026](https://github.com/DavidAnson/markdownlint/blob/main/doc/md026.md)
   */
  "no-trailing-punctuation"?: boolean | Md026;
  /**
   * Trailing spaces
   *
   * @see [MD009](https://github.com/DavidAnson/markdownlint/blob/main/doc/md009.md)
   */
  "no-trailing-spaces"?: boolean | Md009;
  /**
   * ol - [MD029](https://github.com/DavidAnson/markdownlint/blob/main/doc/md029.md),
   * [MD030](https://github.com/DavidAnson/markdownlint/blob/main/doc/md030.md),
   * [MD032](https://github.com/DavidAnson/markdownlint/blob/main/doc/md032.md)
   */
  ol?: boolean;
  /**
   * Ordered list item prefix
   *
   * @see [MD029](https://github.com/DavidAnson/markdownlint/blob/main/doc/md029.md)
   */
  "ol-prefix"?: boolean | Md029;
  /**
   * Proper names should have the correct capitalization
   *
   * @see [MD044](https://github.com/DavidAnson/markdownlint/blob/main/doc/md044.md)
   */
  "proper-names"?: boolean | Md044;
  /**
   * Reference links and images should use a label that is defined
   *
   * @see [MD052](https://github.com/DavidAnson/markdownlint/blob/main/doc/md052.md)
   */
  "reference-links-images"?: boolean | Md052;
  /**
   * Required heading structure
   *
   * @see [MD043](https://github.com/DavidAnson/markdownlint/blob/main/doc/md043.md)
   */
  "required-headers"?: boolean | Md043;
  /**
   * Required heading structure
   *
   * @see [MD043](https://github.com/DavidAnson/markdownlint/blob/main/doc/md043.md)
   */
  "required-headings"?: boolean | Md043;
  /**
   * Multiple top-level headings in the same document
   *
   * @see [MD025](https://github.com/DavidAnson/markdownlint/blob/main/doc/md025.md)
   */
  "single-h1"?: boolean | Md025;
  /**
   * Multiple top-level headings in the same document
   *
   * @see [MD025](https://github.com/DavidAnson/markdownlint/blob/main/doc/md025.md)
   */
  "single-title"?: boolean | Md025;
  /**
   * Files should end with a single newline character
   *
   * @see [MD047](https://github.com/DavidAnson/markdownlint/blob/main/doc/md047.md)
   */
  "single-trailing-newline"?: boolean;
  /**
   * spaces - [MD018](https://github.com/DavidAnson/markdownlint/blob/main/doc/md018.md),
   * [MD019](https://github.com/DavidAnson/markdownlint/blob/main/doc/md019.md),
   * [MD020](https://github.com/DavidAnson/markdownlint/blob/main/doc/md020.md),
   * [MD021](https://github.com/DavidAnson/markdownlint/blob/main/doc/md021.md),
   * [MD023](https://github.com/DavidAnson/markdownlint/blob/main/doc/md023.md)
   */
  spaces?: boolean;
  /**
   * spelling - [MD044](https://github.com/DavidAnson/markdownlint/blob/main/doc/md044.md)
   */
  spelling?: boolean;
  /**
   * Strong style should be consistent
   *
   * @see [MD050](https://github.com/DavidAnson/markdownlint/blob/main/doc/md050.md)
   */
  "strong-style"?: boolean | Md050;
  /**
   * ul - [MD004](https://github.com/DavidAnson/markdownlint/blob/main/doc/md004.md),
   * [MD005](https://github.com/DavidAnson/markdownlint/blob/main/doc/md005.md),
   * [MD006](https://github.com/DavidAnson/markdownlint/blob/main/doc/md006.md),
   * [MD007](https://github.com/DavidAnson/markdownlint/blob/main/doc/md007.md),
   * [MD030](https://github.com/DavidAnson/markdownlint/blob/main/doc/md030.md),
   * [MD032](https://github.com/DavidAnson/markdownlint/blob/main/doc/md032.md)
   */
  ul?: boolean;
  /**
   * Unordered list indentation
   *
   * @see [MD007](https://github.com/DavidAnson/markdownlint/blob/main/doc/md007.md)
   */
  "ul-indent"?: boolean | Md007;
  /**
   * Consider starting bulleted lists at the beginning of the line
   *
   * @see [MD006](https://github.com/DavidAnson/markdownlint/blob/main/doc/md006.md)
   * @deprecated
   */
  "ul-start-left"?: boolean;
  /**
   * Unordered list style
   *
   * @see [MD004](https://github.com/DavidAnson/markdownlint/blob/main/doc/md004.md)
   */
  "ul-style"?: boolean | Md004;
  /**
   * url - [MD034](https://github.com/DavidAnson/markdownlint/blob/main/doc/md034.md)
   */
  url?: boolean;
  /**
   * whitespace - [MD009](https://github.com/DavidAnson/markdownlint/blob/main/doc/md009.md),
   * [MD010](https://github.com/DavidAnson/markdownlint/blob/main/doc/md010.md),
   * [MD012](https://github.com/DavidAnson/markdownlint/blob/main/doc/md012.md),
   * [MD027](https://github.com/DavidAnson/markdownlint/blob/main/doc/md027.md),
   * [MD028](https://github.com/DavidAnson/markdownlint/blob/main/doc/md028.md),
   * [MD030](https://github.com/DavidAnson/markdownlint/blob/main/doc/md030.md),
   * [MD037](https://github.com/DavidAnson/markdownlint/blob/main/doc/md037.md),
   * [MD038](https://github.com/DavidAnson/markdownlint/blob/main/doc/md038.md),
   * [MD039](https://github.com/DavidAnson/markdownlint/blob/main/doc/md039.md)
   */
  whitespace?: boolean;
  [property: string]: any;
}

export interface MD002Class {
  /**
   * Heading level
   */
  level?: number;
}

export interface MD003Class {
  /**
   * Heading style
   */
  style?: MD003Style;
}

/**
 * Heading style
 */
export type MD003Style = "consistent" | "atx" | "atx_closed" | "setext" | "setext_with_atx" | "setext_with_atx_closed";

export interface Md004 {
  /**
   * List style
   */
  style?: MD004Style;
}

/**
 * List style
 */
export type MD004Style = "consistent" | "asterisk" | "plus" | "dash" | "sublist";

export interface Md007 {
  /**
   * Spaces for indent
   */
  indent?: number;
  /**
   * Spaces for first level indent (when start_indented is set)
   */
  start_indent?: number;
  /**
   * Whether to indent the first level of the list
   */
  start_indented?: boolean;
}

export interface Md009 {
  /**
   * Spaces for line break
   */
  br_spaces?: number;
  /**
   * Allow spaces for empty lines in list items
   */
  list_item_empty_lines?: boolean;
  /**
   * Include unnecessary breaks
   */
  strict?: boolean;
}

export interface Md010 {
  /**
   * Include code blocks
   */
  code_blocks?: boolean;
  /**
   * Fenced code languages to ignore
   */
  ignore_code_languages?: string[];
  /**
   * Number of spaces for each hard tab
   */
  spaces_per_tab?: number;
}

export interface Md012 {
  /**
   * Consecutive blank lines
   */
  maximum?: number;
}

export interface MD013Class {
  /**
   * Number of characters for code blocks
   */
  code_block_line_length?: number;
  /**
   * Include code blocks
   */
  code_blocks?: boolean;
  /**
   * Include headings
   */
  headers?: boolean;
  /**
   * Number of characters for headings
   */
  heading_line_length?: number;
  /**
   * Include headings
   */
  headings?: boolean;
  /**
   * Number of characters
   */
  line_length?: number;
  /**
   * Stern length checking
   */
  stern?: boolean;
  /**
   * Strict length checking
   */
  strict?: boolean;
  /**
   * Include tables
   */
  tables?: boolean;
}

export interface MD022Class {
  /**
   * Blank lines above heading
   */
  lines_above?: number[] | number;
  /**
   * Blank lines below heading
   */
  lines_below?: number[] | number;
}

export interface Md024 {
  /**
   * Only check sibling headings
   */
  allow_different_nesting?: boolean;
  /**
   * Only check sibling headings
   */
  siblings_only?: boolean;
}

export interface Md025 {
  /**
   * RegExp for matching title in front matter
   */
  front_matter_title?: string;
  /**
   * Heading level
   */
  level?: number;
}

export interface Md026 {
  /**
   * Punctuation characters
   */
  punctuation?: string;
}

export interface Md029 {
  /**
   * List style
   */
  style?: MD029Style;
}

/**
 * List style
 */
export type MD029Style = "one" | "ordered" | "one_or_ordered" | "zero";

export interface MD030Class {
  /**
   * Spaces for multi-line ordered list items
   */
  ol_multi?: number;
  /**
   * Spaces for single-line ordered list items
   */
  ol_single?: number;
  /**
   * Spaces for multi-line unordered list items
   */
  ul_multi?: number;
  /**
   * Spaces for single-line unordered list items
   */
  ul_single?: number;
}

export interface MD031Class {
  /**
   * Include list items
   */
  list_items?: boolean;
}

export interface Md033 {
  /**
   * Allowed elements
   */
  allowed_elements?: string[];
}

export interface MD035Class {
  /**
   * Horizontal rule style
   */
  style?: string;
}

export interface Md036 {
  /**
   * Punctuation characters
   */
  punctuation?: string;
}

export interface MD040Class {
  /**
   * List of languages
   */
  allowed_languages?: string[];
  /**
   * Require language only
   */
  language_only?: boolean;
}

export interface MD041Class {
  /**
   * RegExp for matching title in front matter
   */
  front_matter_title?: string;
  /**
   * Heading level
   */
  level?: number;
}

export interface Md043 {
  /**
   * List of headings
   */
  headers?: string[];
  /**
   * List of headings
   */
  headings?: string[];
  /**
   * Match case of headings
   */
  match_case?: boolean;
}

export interface Md044 {
  /**
   * Include code blocks
   */
  code_blocks?: boolean;
  /**
   * Include HTML elements
   */
  html_elements?: boolean;
  /**
   * List of proper names
   */
  names?: string[];
}

export interface MD046Class {
  /**
   * Block style
   */
  style?: MD046Style;
}

/**
 * Block style
 */
export type MD046Style = "consistent" | "fenced" | "indented";

export interface MD048Class {
  /**
   * Code fence style
   */
  style?: MD048Style;
}

/**
 * Code fence style
 */
export type MD048Style = "consistent" | "backtick" | "tilde";

export interface MD049Class {
  /**
   * Emphasis style
   */
  style?: MD049Style;
}

/**
 * Emphasis style
 *
 * Strong style
 */
export type MD049Style = "consistent" | "asterisk" | "underscore";

export interface Md050 {
  /**
   * Strong style
   */
  style?: MD049Style;
}

export interface Md052 {
  /**
   * Include shortcut syntax
   */
  shortcut_syntax?: boolean;
}

export interface MD053Class {
  /**
   * Ignored definitions
   */
  ignored_definitions?: string[];
}
