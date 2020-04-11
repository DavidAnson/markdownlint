# test doc

this is some text

* This is a list item

    ```fenced
    this is a code block within the list item.
    ```

    with more text here

* and another list item here

And another paragraph.

    But this code block {MD046}

    is *NOT* in a list and should error.

And in addition to that...

    ```text
    This code block is both indented
    and fenced and should *also* error.
    ```

And finally:

```text
This is a code block

    And this is a code block in a code block and should *not* error

More stuff here
```

all

{MD046:23}
