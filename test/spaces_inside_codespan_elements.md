# spaces_inside_codespan_elements

`normal codespan element`

` codespan element with space inside left` {MD038}

`codespan element with space inside right ` {MD038}

` codespan element with spaces inside ` (allowed per spec)

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

Text [link](https://example.com/link`link) text `code`.

Text [link](https://example.com/link```link) text ```code```.

Text [link](https://example.com/link`link`link`link) text `code`.

Text [link](https://example.com/link "title`title") text `code`.

Text [link](#link`link) text `code`.

Text [link] (#link`link) text `code`. {MD038}

Text [link[link](#link`link) text `code`.

Text [link(link](#link`link) text `code`.

Text [link)link](#link`link) text `code`.

Text [link](#link[link`link) text `code`.

Text [link](#link]link`link) text `code`.

Text [link](#link(link`link) text `code`. {MD038}

Text [`link`](xref:custom.link`1) text `code`.

Text ``code [link](#link`link) code`` text `code`.

No space, start or end: `code`

Start space, no end space: ` code` {MD038}

No start space, end space: `code ` {MD038}

Single start and end space: ` code ` (explicitly allowed/trimmed by the specification)

All spaces: `    ` {MD038}

Double start and single end space: `  code ` {MD038}

Single start and double end spaces: ` code  ` {MD038}

Double start and end spaces: `  code  ` {MD038}

Spaces before and after: ` codecode `
As above, with an internal space: ` code code `
As above, practical example with a backtick: `` Ctrl + ` ``
As above, no internal space: `` Ctrl+` ``
Again, 3 characters: ` abc `
Again, 2 characters: ` ab `
Again, 1 character: ` a `
Many internal spaces: ` code code  code   code    code     code `
