# spaces_after_list_marker

Normal list

* Foo
* Bar
* Baz

List with incorrect spacing

*  Foo {MD030}
*  Bar {MD030}
*   Baz {MD030}

List with children:

* Foo {MD030}
    * Bar {MD030}
        * Baz

List with children and correct spacing:

*   Foo
    *   Bar
        * Baz (This sublist has no children)

List with Multiple paragraphs and correct spacing

*   Foo

    Here is the second paragraph

*   All items in the list need the same indent

List with multiple paragraphs and incorrect spacing

*  Foo {MD030}

    Here is the second paragraph

*    Bar {MD030}

List with code blocks:

*   Foo

        Here is some code

*   Bar

Ordered lists:

1. Foo
1. Bar
1. Baz

And with incorrect spacing:

1.  Foo {MD030}
1.  Bar {MD030}
1.  Baz {MD030}

Ordered lists with children:

1. Foo {MD030}
    * Hi
1. Bar {MD030}
1. Baz {MD030}

Ordered lists with children (correct spacing), and with something other than
the first item determining that the entire list has children:

1.  Foo
1.  Bar
    * Hi
1.  Baz
