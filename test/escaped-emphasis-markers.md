# Heading

## Single-character markers

None are valid emphasis without spaces.

Escaped asterisks \* should \* be ignored by MD037.

Escaped asterisks \* should * be ignored by MD037.

Escaped asterisks * should \* be ignored by MD037.

Escaped underscores \_ should \_ be ignored by MD037.

Escaped underscores \_ should _ be ignored by MD037.

Escaped underscores _ should \_ be ignored by MD037.

## Double-character markers, start

All *could* be reported because they are valid single-character
marker emphasis when no spaces are present.

Escaped asterisks \** should ** be ignored by MD037.

Escaped asterisks *\* should ** be ignored by MD037.

Escaped underscores \__ should __ be ignored by MD037.

Escaped underscores _\_ should __ be ignored by MD037.

## Double-character markers, end

All should be reported, but are ignored because they look like
the start of an embedded emphasis.

Escaped asterisks ** should \** be ignored by MD037.

Escaped asterisks ** should *\* be ignored by MD037.

Escaped underscores __ should \__ be ignored by MD037.

Escaped underscores __ should _\_ be ignored by MD037.
