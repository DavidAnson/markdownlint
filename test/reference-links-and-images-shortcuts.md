# Reference Links and Images (Shortcuts)

## Shortcut Handling

Validates the shortcut: [shortcut]

[shortcut]: https://example.com/shortcut

Missing reference: [missing] {MD052}

## Valid Links

Full reference link: [text][label]

Collapsed reference link: [label][]

Shortcut reference link: [label]

Same line: [text][label] [label][] [label]

Mixed case: [TEXT][LABEL] [LABEL][] [LABEL]

With nested brackets: [t\[ex\]t][label]

Shortcut inline code span: [`code`]

Shortcut ending in colon: [colon]:

## Invalid Links

Missing: [missing] {MD052}

> Missing in blockquote: [missing] {MD052}

## Non-Links

Code span: `[code]`

Escaped left: \[escaped]

Escaped right: [escaped\]

Escaped both: \[escaped\]

Unmatched [ in text

Unmatched ] in text

## Valid Images

Full style: ![text][image0]

Collapsed style: ![image1][]

Shortcut style: ![image2]

Image in link: [![text][image3]](link) [![image4][]](link) [![image5]](link)

Image in shortcut link: [![text][image6]][unique6] [![image7][]][unique7] [![image8]][unique8]

Wrapped in brackets: \[![text][unique9]\]

Embedded \[in ![text][unique10] brackets\]

## Invalid Images

Missing: ![missing] {MD052}

> Missing in blockquote: ![missing] {MD052}

## Non-Images

Escaped left: !\[escaped]

Escaped right: ![escaped\]

Escaped both: !\[escaped\]

## Valid Footnotes

Footnote[^1]

## Invalid Footnotes

Missing[^2] {MD052}

## GitHub Flavored Markdown Task List Items

- [ ] Unchecked task list item
- [x] Checked task list item

- [x] alpha
  - [ ] beta
  - [x] charlie
- [ ] delta

## Valid Labels

[label]: https://example.com/label
[image0]: https://example.com/image0
[image1]: https://example.com/image1
[image2]: https://example.com/image2
[image3]: https://example.com/image3
[image4]: https://example.com/image4
[image5]: https://example.com/image5
[image6]: https://example.com/image6
[image7]: https://example.com/image7
[image8]: https://example.com/image8
[`code`]: https://example.com/code
[colon]: https://example.com/colon
[unique6]: https://example.com/unique6
[unique7]: https://example.com/unique7
[unique8]: https://example.com/unique8
[unique9]: https://example.com/unique9
[unique10]: https://example.com/unique10
[^1]: https://example.com/footnote {MD034}

<!-- markdownlint-configure-file {
  "reference-links-images": {
    "shortcut_syntax": true
  }
} -->
