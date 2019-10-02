The following code block shouldn't have $ before the commands:

    $ ls {MD014}
    $ less foo {MD014}

    $ cat bar {MD014}

However the following code block shows output, and $ can be used to
distinguish between command and output:

    $ ls
    foo bar
    $ less foo
    Hello world

    $ cat bar
    baz

The following code block uses variable names, and likewise shouldn't fire:

    $foo = 'bar';
    $baz = 'qux';

The following code block doesn't have any dollar signs, and shouldn't fire:

    ls foo
    cat bar

The following (fenced) code block doesn't have any content at all, and
shouldn't fire: {MD046:32}

```bash
```

Mixed content:

    $ ls
    file.md other.md
    $ git branch {MD014}
    $ cat stuff {MD014}

    output
    $ ls {MD014}
    $ git branch {MD014}
    $ cat stuff
    stuff here
    more stuff
    $ tail cat
    meow
