# Heading

## Empty links

[text]() {MD042}

[text](<>) {MD042}

[text]( <> ) {MD042}

[text](<> "title") {MD042}

[text]( <> "title" ) {MD042}

[text](#) {MD042}

[text]( # ) {MD042}

[text](# "title") {MD042}

[text]( # "title" ) {MD042}

[text][frag] {MD042}

[text][ frag ] {MD042}

[frag]: #

## Non-empty links

[text](link)

[text]( link )

[text](link "title")

[text]( link "title" )

[text](<link>)

[text]( <link> )

[text](<link> "title")

[text]( <link> "title" )

[text](#frag)

[text]( #frag )

[text](#frag "title")

[text]( #frag "title" )

[text][ref]

[text][ ref ]

[ref]: link

[text]

[text]: link

## Inline of links with empty link (#308)

[text](link-1)
[text]() {MD042}
[text](link-3)

[text](link-1)
[text]() {MD042}
[text](link-3)
[text]() {MD042}

[text](link-1)
[text]() {MD042}
[text](link-3)
[text]() {MD042}
[text](link-5)
