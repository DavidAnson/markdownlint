# Code Block Dollar

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
shouldn't fire: {MD046:34}

```bash
```

Mixed content:

    $ ls
    file.md other.md
    $ git branch
    $ cat stuff

    output

More mixed content:

    $ ls
    $ git branch
    $ cat stuff
    stuff here
    more stuff
    $ tail cat
    meow

Command with blank lines in output:

    $ dig example.com

    ; ...
    ;; ...

    ;; ...

Some commands with no output:

    $ mkdir test
    mkdir: created directory 'test'
    $ cd test
    $ ls test

All commands with no output:

    $ mkdir test {MD014}
    $ cd test {MD014}
    $ ls test {MD014}
