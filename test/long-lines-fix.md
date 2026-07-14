# Long Lines Fix

This paragraph of ordinary text is long enough that it needs to be wrapped one time to satisfy the rule {MD013}

This paragraph of ordinary text is much much much much much much much much much longer so that it needs to be wrapped two times or more times to satisfy the length rule for every line of text {MD013}

> This quoted paragraph of text is long enough that it needs to be wrapped and prefixed to satisfy the rule {MD013}

Text between the block quotes.

> > This nested quoted paragraph of text is long enough that it needs to be wrapped and prefixed {MD013}

- This unordered list item of text is long enough that it needs to be wrapped and indented to satisfy the rule {MD013}

1. This ordered list item of text is long enough that it needs to be wrapped and indented to satisfy the rule {MD013}

- Short first line
  followed by a continuation line of text long enough that it needs to be wrapped and indented {MD013}

This paragraph contains `a code span that is not an acceptable position for a break` so wrapping happens elsewhere {MD013}

This paragraph contains <!-- an HTML comment that is not an acceptable position for a break --> so wrapping happens nearby {MD013}

This paragraph contains <!-- one HTML comment --> and <!-- another HTML comment --> so wrapping happens after both {MD013}

This paragraph would otherwise be wrapped right before the following dash - but that would create a list {MD013}

This paragraph would otherwise be wrapped right after this backslash\ but that would create a hard line break {MD013}

This paragraph of ordinary text is long enough that it needs wrapping and it ends with a hard line break {MD013}  

This paragraph of ordinary text is long enough that it needs to be wrapped and has `a code span
that spans lines` {MD013:-1}

This paragraph has one long link [link text](https://example.com/a-long-link-destination-that-can-not-be-broken) inside it {MD013}
