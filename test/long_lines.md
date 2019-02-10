This is a very very very very very very very very very very very very very very long line {MD013}

This line however, while very long, doesn't have whitespace after the 80th columnwhichallowsforURLsandotherlongthings.

[This long line is comprised entirely of a link](https://example.com "This is the long link's title")

> [This long line is comprised entirely of a link](https://example.com "This is the long link's title")

    [This long line is comprised entirely of a link](https://example.com "But is inside a code block") {MD013}

```markdown
[This long line is comprised entirely of a link](https://example.com "But is inside a code block") {MD013}
```

This [long line is comprised mostly of a link](https://example.com "This is the long link's title") {MD013}

[This long line is comprised mostly of a link](https://example.com "This is the long link's title") text {MD013}

This long line includes a simple [reference][label] link and is long enough to violate the rule. {MD013}

[This long line is comprised entirely of a reference link and is long enough to violate the rule][label]

[label]: https://example.org "Title for a link reference that is itself long enough to violate the rule"

[Link to broken label][notlabel]

[notlabel\]: notlink "Invalid syntax for a link label because the right bracket is backslash-escaped {MD013}"

[](https://example.com "This long line is comprised entirely of a link with empty text and a non-empty title")

*[This long line is comprised of an emphasized link](https://example.com "This is the long link's title")*

_[This long line is comprised of an emphasized link](https://example.com "This is the long link's title")_

**[This long line is comprised of a bolded link](https://example.com "This is the long link's title")**

__[This long line is comprised of a bolded link](https://example.com "This is the long link's title")__

_**[This long line is comprised of an emphasized and bolded link](https://example.com "This is the long link's title")**_

**_[This long line is comprised of an emphasized and bolded link](https://example.com "This is the long link's title")_**

*[](https://example.com "This long line is comprised of an emphasized link with empty text and a non-empty title")*

**[](https://example.com "This long line is comprised of a bolded link with empty text and a non-empty title")**
