# Valid/Invalid Link Fragments

## Valid Fragments

[Valid](#validinvalid-link-fragments)

[Valid](#valid-fragments)

[Valid](#valid-h3-heading)

[Valid](#valid-heading-with-underscores-_)

[Valid](#valid-heading-with-emphasis)

[Valid](#valid-heading-with-quotes--and-double-quotes-)

[Valid](#-valid-heading-with-emoji)

[Valid](#valid-heading--with-emoji-2)

[Valid](#valid-closed-atx-heading)

[Valid](#valid-setext-heading)

[Valid](#namedlink)

[Valid](#idlink)

[Valid](#myident)

[Valid](#HREFandID)

[Valid][goodref]

### Valid H3 Heading

Text

### Valid Heading With Underscores _

Text

### Valid *Heading* With _Emphasis_

Text

### Valid Heading With Quotes ' And Double Quotes "

Text

### 🚀 Valid Heading With Emoji

Text

### Valid Heading 👀 With Emoji 2

Text

### Valid Closed ATX Heading ###

Text

Valid Setext Heading
--------------------

Text

<a name="namedlink"></a>

<a id = idlink></a>

<a id="myident" name="myname"/>

<A href="https://example.com" id="HREFandID">Text</A>

[goodref]: #namedlink

## Invalid Fragments

[Invalid](#invalid-fragment) {MD051}

[Invalid](#myname) {MD051}

[Invalid](#hrefandid) {MD051}

[Invalid][badref] {MD051}

[badref]: #missing

<!-- markdownlint-configure-file {
  "emphasis-style": false,
  "heading-style": false,
  "no-inline-html": false
} -->
