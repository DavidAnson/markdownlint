# Valid/Invalid Link Fragments

## Valid Fragments

[Valid](#validinvalid-link-fragments)

[Valid](#valid-fragments)

[Valid](#valid-h3-heading)

[Valid](#valid-heading-with-underscores-_)

[Valid](#valid-heading-with-emphasis)

[Valid](#valid-heading-with-code)

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

[Valid](#valid-heading-about-lhôpitals-rule)

[Valid](#en-t%C3%AAte-valide-dans-fran%C3%A7ais-pour-v%C3%A9rification)

[Valid](#en-tête-valide-dans-français-pour-vérification)

[Valid](#%E6%A0%87%E9%A2%98)

[Valid](#标题)

[Valid](#valid-heading-is-a-link)

[Valid](#valid-heading-has-a-link)

[Valid](#valid-heading-is-a-reference-link)

[Valid](#valid-heading-has-a-reference-link)

[Valid](#valid-heading-has-)

[Valid](#valid_heading-escaped_underscores)

[Valid](#valid\_heading\-escaped\_underscores)

[Valid](#valid-heading-with_embedded_escaping)

[Valid](#namedlink)

[Valid](#idlink)

[Valid](#myident)

[Valid](#HREFandID)

[Valid](#id-for-other-element)

[Valid](#id-after-name)

[Valid][goodref]

[Valid][escapedref]

[Valid](#l12-not-a-line-link)

[Valid](#latex-style)

[Valid](#area-pi--r2)

[Valid](#L7)

[Valid](#L30-L31)

[Valid](#L3C24-L88)

[Valid](#L304-L314C98)

[Valid](#L200C4-L3244C2)

### Valid H3 Heading

Text

### Valid Heading With Underscores _

Text

### Valid *Heading* With _Emphasis_

Text

### Valid Heading With `Code`

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

### 标题

### [Valid Heading Is a Link](https://example.com)

### Valid Heading [Has a Link](https://example.com)

### [Valid Heading Is a Reference Link][goodref]

### Valid Heading [Has a Reference Link][goodref]

### ![Valid Heading Is an Image](https://example.com)

### Valid Heading Has ![an Image](https://example.com)

### Valid_Heading Escaped_Underscores

### Valid Heading\-With\_Embedded\_Escaping

### L12 Not A Line Link

## $\LaTeX$ Style

## Area: $\pi * r^2$

<a name="namedlink"></a>

<a id = idlink></a>

<a id="myident" name="myname"/>

<A href="https://example.com" id="HREFandID">Text</A>

<p id="id-for-other-element"></p>

<p name="name-for-other-element"></p>

<input name="name-should-be-ignored" id="id-after-name">

<a data-id="not-an-id-should-be-ignored">

[goodref]: #namedlink

[escapedref]: #valid\_heading\-escaped\_underscores

## Invalid Fragments

[Invalid](#valid-heading-is-an-image) {MD051}

[Invalid](#valid-heading-2004-) {MD051}

[Invalid](#valid-repeated-heading-3) {MD051}

[Invalid](#invalid-fragment) {MD051}

[Invalid](#myname) {MD051}

[Invalid](#hrefandid) {MD051}

[Invalid](#name-for-other-element) {MD051}

[Invalid](#name-should-be-ignored) {MD051}

[Invalid](#not-an-id-should-be-ignored) {MD051}

[Invalid {MD051}](#multi-line
"Title")

[Invalid][badref]

[badref]: #missing "{MD051}"

## Inconsistent Case Fragments

[Title](#Valid-Fragments) {MD051}

[ALL CAPS](#NAMEDLINK) {MD051}

[Multi-line {MD051}](#NAMEDLINK
"Title")

[MiXeD][mixedref]

[mixedref]: #idLINK "{MD051}"

## Valid Named Fragments

[Valid](#named-fragment)

[Valid](#valid-heading-with-named-fragment-named-fragment)

[Valid](#another_fragment_123)

[Valid](#valid-heading-with-another-named-fragment-another_fragment_123)

[Valid](#closed-atx)

[Valid](#setext)

### Valid Heading with Named Fragment {#named-fragment}

### Valid Heading with Another Named Fragment {#another_fragment_123}

### Valid Closed ATX Heading with Named Fragment {#closed-atx} ###

Valid Setext Heading with Named Fragment {#setext}
--------------------------------------------------

## Invalid Named Fragments

### Invalid Heading with Named Fragment {#embedded space}

### Invalid Heading with Named Fragment {#hyphen--run}

### Invalid Heading with Named Fragment {#UpperCase}

{#named-fragment-outside-heading}

[Invalid](#embedded-space) {MD051}

[Invalid](#embedded_space) {MD051}

[Invalid](#embedded) {MD051}

[Invalid](#hyphen--run) {MD051}

[Invalid](#hyphen-run) {MD051}

[Invalid](#named-fragment-outside-heading) {MD051}

[Invalid](#UpperCase) {MD051}

[Invalid](#uppercase) {MD051}

[Invalid](#L12-not-a-line-link) {MD051}

[Invalid](#l7) {MD051}

[Invalid](#L) {MD051}

[Invalid](#L7extra) {MD051}

[Invalid](#L30C) {MD051}

[Invalid](#L30Cextra) {MD051}

[Invalid](#L30L12) {MD051}

[Invalid](#L30C12) {MD051}

[Invalid](#L30C11-) {MD051}

[Invalid](#L30C11-L) {MD051}

[Invalid](#L30C11-L31C) {MD051}

[Invalid](#L30C11-C31) {MD051}

[Invalid](#C30) {MD051}

[Invalid](#C11-C31) {MD051}

[Invalid](#C11-L4C31) {MD051}

## Implicit Fragments

[Valid](#top)

[Invalid](#ToP) {MD051}

<!-- markdownlint-configure-file {
  "emphasis-style": false,
  "heading-style": false,
  "no-duplicate-heading": false,
  "no-inline-html": false
} -->
