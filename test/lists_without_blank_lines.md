* list (on first line)

text

* list

text
* list {MD032}
text
+ list {MD032}
text
- list {MD032}
text
1. list {MD032}
text

* list
* list {MD032}
text

text
10. list {MD032}
20. list

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

* list {MD032}
``` {MD031}
code
```

text

```
code
``` {MD031}
* list {MD032}

text

* list (on last line without newline)