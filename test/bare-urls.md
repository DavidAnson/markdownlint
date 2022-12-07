# Detailed Results Bare URLs

For more, see https://example.com. {MD034}

For more, see https://example.com/. {MD034}

For more, see https://example.com/?query=string#hash. {MD034}

For more, see https://example.com/info.htm. {MD034}

Visit https://example.com, then refresh. {MD034}

The site (https://example.com) is down. {MD034}

<!-- markdownlint-disable line-length no-inline-html -->

Some documents use <a href="https://example.com">to link</a>.

Or <a href="https://example.com/info.htm">to link</a>.

Or repeat the URL <a href="https://example.com">https://example.com</a>.

Or <a href="https://example.com/info.htm">https://example.com/info.htm</a>.

This is allowed to avoid embedding angle brackets in HTML <a href="https://example.com">Text https://example.com</a>.

As is <a href="https://example.com/info.htm">https://example.com/info.htm text</a>.

<br> Another violation: https://example.com. {MD034} <br>

<br/> Another violation: https://example.com. {MD034} <br/>

This is not a bare [link]( https://example.com ).

URLs in HTML are not bare:

<element-name first-attribute=" https://example.com/first " second-attribute=" https://example.com/second ">
  Text
</element-name>

<element-name
  first-attribute=" https://example.com/first "
  second-attribute=" https://example.com/second "></element-name>

URLs in link and image text are not bare:

Text [link to https://example.com site](https://example.com) text.

Image ![for https://example.com site](https://example.com) text.
