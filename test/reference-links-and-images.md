# Reference Links and Images

## Valid Links

Full reference link: [text][label]

Collapsed reference link: [label][]

Shortcut reference link: [label]

Same line: [text][label] [label][] [label]

Mixed case: [TEXT][LABEL] [LABEL][] [LABEL]

With spaces: [text][label with spaces] [text][ label  with spaces ]

With nested brackets: [t[ex]t][label]

With inline content: [*text*][label]

With inline code span: [`code`][label]

Shortcut inline code span: [`code`]

Multi-line full text: [multi
line][multi line full text]

Multi-line full label: [text][multi
line full label]

Multi-line collapsed label: [multi
line collapsed label][]

Multi-line shortcut label: [multi line
shortcut label]

Dedicated line:
[text][label]

Dedicated line with trailing colon:
[text][label]:

Shortcut ending in colon: [colon]:

Use of multi-line label: [multi-line-label][]

Standard link: [text](https://example.com/standard)

Wrapped in brackets: [[text][unique0]] [[unique1][]] [[unique2]]

[Embedded [text][unique3] in [unique4][] brackets [unique5]]

## Invalid Links

Missing label: [text][missing] {MD052}

Mixed valid/invalid: [text][label] [text][missing] {MD052}

Missing multi-line label {MD052}: [text][missing
label]

## Non-Links

Space: [text] [wrong]

Empty: [text][ ]

Code span: `[wrong]`

Code span: `[wrong][]`

Code span: `[text][wrong]`

Code span: `[[wrong]]`

Code span: `[[wrong][]]`

Code span: `[[text][wrong]]`

Escaped left text: \[text][wrong]

Escaped right text: [text\][wrong]

Escaped left label: [text]\[wrong]

Escaped right label: [text][wrong\]

## Valid Images

Full style: ![text][image]

Collapsed style: ![image][]

Shortcut style: ![image]

Image in link: [![text][image]][label] [![image][]][label] [![image]][label]

Wrapped in brackets: [![text][unique6]]

Embedded [in ![text][unique7] brackets]

## Invalid Images

Image only: ![text][missing] {MD052}

Image in link: [![text][missing]][label] {MD052}

## Non-Images

Escaped left text: !\[text][wrong]

Escaped right text: ![text\][wrong]

Escaped left label: ![text]\[wrong]

Escaped right label: ![text][wrong\]

## Valid Footnotes

Footnote[^1]

## Invalid Footnotes

Missing[^2]

## Valid Labels

[label]: https://example.com/label
[ label with  spaces ]: https://example.com/label-with-spaces
[image]:https://example.com/image
[`code`]: https://example.com/code
[^1]: https://example.com/footnote
[multi line full text]: https://example.com/multi-line-full-text
[multi line full label]: https://example.com/multi-line-full-label
[multi line collapsed label]: https://example.com/multi-line-collapsed-label
[multi line shortcut label]: https://example.com/multi-line-shortcut-label
[colon]: https://example.com/colon
[multi-line-label]:
https://example.com/multi-line-label
[unique0]: https://example.com/unique0
[unique1]: https://example.com/unique1
[unique2]: https://example.com/unique2
[unique3]: https://example.com/unique3
[unique4]: https://example.com/unique4
[unique5]: https://example.com/unique5
[unique6]: https://example.com/unique6
[unique7]: https://example.com/unique7

## Invalid Labels

Duplicate:
[label]: {MD053}

Unused:
[unused]: {MD053}

Unused footnote:
[^3]: {MD053}

[Duplicate unused multi-line label {MD053}]:
https://example.com/duplicate-unused-multi-line-label

[Duplicate unused multi-line label {MD053}]:
https://example.com/duplicate-unused-multi-line-label

\[Escaped left]: text

[Escaped right\]: text

## Valid Links and Images after Labels

Link and image: [text][label] [![text][image]][label]

## More Invalid Links and Images after Labels

Bad link with image [![text][image]][missing] {MD052}

## Shortcut One-Way Handling

Validates the label: [shortcut]

[shortcut]: https://example.com/shortcut

Not flagged due to ambiguity: [ignored]

## Open Bracket Pairs

Unmatched [ in text

Hidden reference: [hidden][] {MD052}
