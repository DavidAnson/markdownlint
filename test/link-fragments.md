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

[Valid](#valid-heading-2010-)

[Valid](#valid-heading-2004-%EF%B8%8F)

[Valid](#valid-closed-atx-heading)

[Valid](#valid-setext-heading)

[Valid](#valid-repeated-heading)

[Valid](#valid-repeated-heading-1)

[Valid](#valid-repeated-heading-2)

[Valid](#valid-heading-with-trailing-space-)

[Valid](#valid-heading-with-two-trailing-spaces--)

[Valid](#valid-heading-with-embedded--comment)

[Valid](#the-best-headin-for-testin-quotes)

[Valid](#valid-heading-about-lh%C3%B4pitals-rule)

[Valid](#en-t%C3%AAte-valide-dans-fran%C3%A7ais-pour-v%C3%A9rification)

[Valid](#namedlink)

[Valid](#idlink)

[Valid](#myident)

[Valid](#HREFandID)

[Valid](#id-for-other-element)

[Valid](#id-after-name)

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

### Valid Heading 20.10 ❌

Text

### Valid Heading 20.04 ✔️

Text

### Valid Closed ATX Heading ###

Text

Valid Setext Heading
--------------------

Text

### Valid Repeated Heading

Text

### Valid Repeated Heading

Text

### Valid Repeated Heading

### Valid Heading With Trailing Space <!-- comment -->

### Valid Heading With Two Trailing Spaces  <!-- comment -->

### Valid Heading With Embedded <!-- comment --> Comment

### The "Best" Headin' for Testin' Quotes

### Valid Heading About L'Hôpital's Rule

### En-tête Valide Dans Français Pour Vérification

<a name="namedlink"></a>

<a id = idlink></a>

<a id="myident" name="myname"/>

<A href="https://example.com" id="HREFandID">Text</A>

<p id="id-for-other-element"></p>

<p name="name-for-other-element"></p>

<input name="name-should-be-ignored" id="id-after-name">

<a data-id="not-an-id-should-be-ignored">

[goodref]: #namedlink

## Invalid Fragments

[Invalid](#valid-heading-2004-) {MD051}

[Invalid](#valid-repeated-heading-3) {MD051}

[Invalid](#invalid-fragment) {MD051}

[Invalid](#myname) {MD051}

[Invalid](#hrefandid) {MD051}

[Invalid](#name-for-other-element) {MD051}

[Invalid](#name-should-be-ignored) {MD051}

[Invalid](#not-an-id-should-be-ignored) {MD051}

[Invalid][badref] {MD051}

[badref]: #missing

## Inconsistent Case Fragments

[Title](#Valid-Fragments) {MD051}

[ALL CAPS](#NAMEDLINK) {MD051}

[MiXeD][mixedref] {MD051}

[mixedref]: #idLINK

<!-- markdownlint-configure-file {
  "emphasis-style": false,
  "heading-style": false,
  "no-duplicate-heading": false,
  "no-inline-html": false
} -->
