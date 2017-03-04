This is a very very very very very very very very very very very very very very long line {MD013}

This line however, while very long, doesn't have whitespace after the 80th columnwhichallowsforURLsandotherlongthings.

[This long line is comprised entirely of a link](http://example.com "This is the long link's title")

> [This long line is comprised entirely of a link](http://example.com "This is the long link's title")

    [This long line is comprised entirely of a link](http://example.com "But is inside a code block") {MD013}

This [long line is comprised mostly of a link](http://example.com "This is the long link's title") {MD013}

[This long line is comprised mostly of a link](http://example.com "This is the long link's title") text {MD013}

This long line includes a simple [reference][label] link and is long enough to violate the rule. {MD013}

[This long line is comprised entirely of a reference link and is long enough to violate the rule][label]

[label]: http://example.org "Title for a link reference that is itself long enough to violate the rule"

[Link to broken label][notlabel]

[notlabel\]: notlink "Invalid syntax for a link label because the right bracket is backslash-escaped {MD013}"
