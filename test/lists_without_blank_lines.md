# lists_without_blank_lines

* list (on first line)

text

* list

---
* list {MD032}
---
+ list {MD032}
---
- list {MD032}
---
1. list {MD032}
---

* list
* list {MD032}
---

text
1. list {MD032}
2. list

text

* list
  * list
    * list

text

* list
  with hanging indent
  * list
    with hanging indent
* list
  with hanging indent

Note: list without hanging indent violates MD032

* list

  item with blank lines

* list

  item with blank lines

text

```js
/*
 * code block
 * not a list
 */
```

text

* list {MD032} {MD031:64}
```
code
```

text

```
code
```
* list {MD032} {MD031:72}

text

<p>
1. Not a
2. list
</p>

<p>1. Not a list</p>

<p>
* Not a
* list
</p>

<p>* Not a list</p>

1. Undefined reference token
   <pre>
   [()]
   </pre>

<!-- markdownlint-configure-file {
  "no-inline-html": false,
  "ul-style": false,
  "ol-prefix": false,
  "fenced-code-language": false
} -->

* list (on last line without newline) {MD047}