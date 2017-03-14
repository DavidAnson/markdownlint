`normal codespan element`

` codespan element with space inside left` {MD038}

`codespan element with space inside right ` {MD038}

` codespan element with spaces inside ` {MD038}

empty `` codespan element

single space ` ` codespan element {MD038}

`,`, `.`

`,`, `code`

`[`, `(`, `+`, `*`, `/`, `-`, `,`, `.`

`code` code `anything`

text `code` code `anything` text

text `code` text `anything` code `end`

text `anything` code `code` text `end`

text `anything` text `anything` code `anything` `code`

text ``code`` text ``code`` text

text `` code`` text {MD038}

text ``code `` text {MD038}

text ```code``` text ```code``` text

text ```code``` text `` code`` text {MD038}

text ```code``` text ``code `` text {MD038}

``embedded ` backtick`` text `code`

`backslash does not escape \` backtick in code span `

escaped \` backtick is ignored outside `code span`

`code` then escaped \` backtick

``code`` then escaped \` backtick then `code`

multiple \` escaped backticks \` in text

\` escaped backtick \` at start of text

text and ``\`code with ignored escaped \` backticks``

`` ` `` text `code`

` `` ` text `code`

``` ` leading space allowed for backtick``` text `code`

```  ` multiple leading spaces not allowed``` text `code` {MD038}

``trailing space allowed for backtick ` `` text `code`

``multiple trailing spaces not allowed `  `` text `code` {MD038}

`` ` leading and trailing space allowed for backtick ` `` text `code`
