# Regular heading

<h1>Inline HTML Heading {MD033}</h1>

<p>More inline HTML {MD033}
but this time on multiple lines
</p>

    <h1>This shouldn't trigger as it's inside a code block</h1>

```text
<p>Neither should this as it's also in a code block {MD046:11}</p>
```

## Elements in code spans

Text `<code>` text \` text
Text \` text `<code>` text
Text \` text \` text `<code>` text
Text \` text `<code>` text `<code>` text
Text \` text `<code>` text \` text `<code>` text
Text \`\` text `<code>` text
Text `<code>` text \` text `<code>` text

## Elements in multiple line code spans

Text `code
<element/>`

`code
<element/>`

`code
<element/>` text

Text `code
code
<element/>
<element/>`

``code ``` ```` `
<code>code
</code>``

Text `code
</element>
code` text

Text `code code
code <element>` text

Text `code <element>
code code` text

Text `code code
code <element> code
code code` text

Text ````code code
code <element> code
code code```` text

Text `code code
code <element>` text
text `code code
code code` text

Text `code code
code code` text
text `code code
code <element>` text

Text `code code
code <element>` text
text `code code
code <element>` text

Text `code code
code` text <element> text `code {MD033}
code code` text

## Slash in element name

Text **\<base directory>\another\directory\\<slash/directory>** text

## Self-closing elements

<hr> {MD033}

<hr/> {MD033}

## Links

<a href="https://example.com">Google</a> {MD033}

<a href="https://example.com" target="_blank">Google</a> {MD033}

<a href="https://example.com:9999" target="_blank">Google</a> {MD033}

## Unterminated code span followed by element in code span

Text text `text text

Text `<element>` text

Text
text `text
text

Text `code <element> code` text

```lang
code {MD046:112}

<element>
```

Text `code <element> code` text

Text <element> text {MD033}
