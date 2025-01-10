# Detailed Results Bare URLs

For more, see https://example.com. {MD034}

For more, see https://example.com/. {MD034}

For more, see https://example.com/?query=string#hash. {MD034}

For more, see https://example.com/info.htm. {MD034}

Visit https://example.com, then refresh. {MD034}

The site (https://example.com) is down. {MD034}

<!-- markdownlint-disable descriptive-link-text line-length no-inline-html -->

Some documents use <a href="https://example.com">to link</a>.

Or <a href="https://example.com/info.htm">to link</a>.

Or repeat the URL <a href="https://example.com">https://example.com</a>.

Or <a href="https://example.com/info.htm">https://example.com/info.htm</a>.

This is allowed to avoid embedding angle brackets in HTML <a href="https://example.com">Text https://example.com</a>.

As is <a href="https://example.com/info.htm">https://example.com/info.htm text</a>.

<br> Another violation: https://example.com. {MD034} <br>

<br/> Another violation: https://example.com. {MD034} <br/>

This is not a bare [link]( https://example.com ).

Nor is [link](https://example.com/path-with(parens)).

Or <https://example.com/path-with(parens)>.

URLs in HTML attributes are not bare:

<element-name first-attribute=" https://example.com/first " second-attribute=" https://example.com/second ">
  Text
</element-name>

<element-name
  first-attribute=" https://example.com/first "
  second-attribute=" https://example.com/second "></element-name>

URLs surrounded by HTML tags are not bare:

Not <code>https://example.com</code> bare.

Not <pre>https://example.com</pre> bare.

<p>
Not bare due to being in an HTML block:
https://example.com
<code>https://example.com</code>
<pre>https://example.com</pre>
</p>

<div>
https://example.com
</div>

<div>
https://example.com

</div>

<div>

https://example.com {MD034}
</div>

<div>

https://example.com {MD034}

</div>

URLs in link and image text are not bare:

Text [link to https://example.com site](https://example.com) text.

Image ![for https://example.com site](https://example.com) text.

URLs may end with a dash: https://example.com#heading- {MD034}

... when explicit: <https://example.com#heading->

... when embedded: <code>https://example.com#heading-</code>

Links with spaces inside angle brackets are okay: [blue jay](<https://en.wikipedia.org/wiki/Blue jay>)

Email addresses are treated similarly: user@example.com {MD034}

Angle brackets work the same for email: <user@example.com>

Unusual email addresses are handled: <user@.com>

---

[is-a-valid]: https://example.com

Links bind to the innermost [link that [is-a-valid] link](https://example.com) {MD034}

But not if the [link [is-not-a-valid] link](https://example.com)

Escaping both inner square brackets avoids confusion:
[link \[is-not-a-valid\] link](https://example.com)
