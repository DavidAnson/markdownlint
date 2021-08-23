# reversed_link

Go to [this website](https://www.example.com)

Go to (this website)[https://www.example.com] {MD011}

Go to (this)[website](https://www.example.com)

However, this shouldn't trigger inside code blocks:

    myObj.getFiles("test")[0]

Nor code fences:

```js
myObj.getFiles(test)[0];
```

Nor inline code: `myobj.getFiles("test")[0]`

Two (issues)[https://www.example.com/one] in {MD011}
the (same text)[https://www.example.com/two]. {MD011}

Two (issues)[https://www.example.com/three] on the (same line)[https://www.example.com/four]. {MD011}

`code code
code`
(reversed)[link] {MD011}

text
text `code
code code
code` text
text
text (reversed)[link] text {MD011}

## Escaped JavaScript Content

var IDENT_RE = '([a-zA-Z]|\\.[a-zA-Z.])[a-zA-Z0-9._]*'; {MD011}

begin: /\B(([\/.])[\w\-.\/=]+)+/, {MD011}

{begin: '%r\\(', end: '\\)[a-z]*'}

return /(?:(?:(^|\/)[!.])|[*?+()|\[\]{}]|[+@]\()/.test(str); {MD011}

## Escaped Parens

&lpar;reversed&rpar;[link]

a &rpar; a &lpar; a &rpar;[a]~

a<pre>&rpar; a &lpar; a &rpar;[a]~</pre>

## Backslash Escapes

xxx(xxx)[xxx] {MD011}

xxx\(xxx)[xxx]

xxx(xxx\)[xxx]

xxx(xxx)\[xxx]

xxx(xxx)[xxx\]

## Consecutive Links

text [link](destination) text [link](destination) text
text [link](destination)[link](destination) text
text [link](destination)[link](destination)[link](destination) text

text (reversed)[link] text (reversed)[link] text {MD011}

<!-- markdownlint-configure-file {
  "code-block-style": false,
  "line-length": false,
  "no-inline-html": false
} -->
