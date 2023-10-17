# Detailed HTML Results

Text

<em>Block block {MD033}</em>

Text <em>inline inline {MD033}</em> text

Text

<strong>Block block</strong>

Text <strong>inline inline</strong> text

Text

<p>
Block  {MD033:17}
block <em>block {MD033}</em> block
block
block <strong>block</strong> block
block
block <em>block</em> block <strong>block</strong> block {MD033}
block <strong>block</strong> block <em>block</em> block {MD033}
</p>

Text

<strong><em>Block</em> block {MD033}</strong>

Text <strong><em>inline</em> inline {MD033}</strong> text

Text

<em><strong>Block</strong> block {MD033}</em>

Text <em><strong>inline</strong> inline {MD033}</em> text

Text

Text <em>inline</em> text <strong>inline</strong> text <em>inline</em> text {MD033}

Text <strong>inline</strong> text <em>inline</em> text <strong>inline</strong> {MD033}

Text

\<not>Block block\</not>

\\<problem>Block block {MD033}\\</problem>

<not\>Block block</not\>

Text \<not>inline inline\</not> text

Text \\<problem>inline inline {MD033}\\</problem> text

Text <not\>inline inline</not\> text

Text

> Text <em>inline inline {MD033}</em> text
> text <strong>inline inline</strong> text

Text

    Text <em>inline inline</em> text
    text <strong>inline inline</strong> text

Text

```html
Text <em>inline inline</em> text
text <strong>inline inline</strong> text
```

Text

`<em>`

Text ``<em>`` text

Text `<em>` text ``<em>`` text ```<em>``` text

Text `<em>` text <em>inline {MD033}</em> text

Text ``text <em> text`` text

Text

Text <a href="#anchor">inline {MD033}</a> text
text <img src="src.png" alt="Description" /> text {MD033}

Text

<name@example.com> is an email autolink.

Another email autolink: <first+last@ex.exa-mple.com>.

Text

<foo-bar-baz> is an HTML element. {MD033}

But <foo.bar.baz> is not an autolink or HTML element.
And neither is <foo_bar>.
Nor <123abc>.

Text

<details>

{MD033:109}

	<details>

- Item
	<details>

{MD033:116}

<custom-element attribute1="value1"
                attribute2="value2" />

{MD033:120}

Text <!-- <commented-out html="tag"> --> text.

<!-- markdownlint-configure-file {
  "no-hard-tabs": false,
  "no-inline-html": {
    "allowed_elements": [
      "strong"
    ]
  },
  "code-block-style": false
} -->
