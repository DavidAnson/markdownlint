# Link test

For more information, please see the
following page: https://www.example.com/ {MD034}
which will tell you all you want to know.

https://www.google.com/ {MD034}

hTtPs://gOoGlE.cOm/ {MD034}

This link should be fine: <https://www.google.com/>

The following are allowed to avoid conflicts with MD011/no-reversed-links:

[https://example.com]
[https://example.com/search?query=text]

Other enclosures are not allowed:

(https://example.com) {MD034}
{https://example.com} {MD034}

Duplicate links in tables should be handled:

| Link                 | Same Link            | Violation |
|----------------------|----------------------|-----------|
| https://example.com/ | https://example.com/ | {MD034}   |
