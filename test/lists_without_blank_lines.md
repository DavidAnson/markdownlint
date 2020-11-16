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

* list (on last line without newline) {MD047}