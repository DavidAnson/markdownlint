
# Testing one sentence per line

At vero eos et accusam et justo duo dolores et `ea rebum.` Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
Lorem ipsum dolor sit `amet. consetetur.` sadipscing elitr.

## Sugar cases

### Lower case

Lorem ipsum dolor sit amet. consetetur sadipscing elitr.{MD054}
Lorem ipsum dolor sit amet! consetetur sadipscing elitr.{MD054}
Lorem ipsum dolor sit amet? consetetur sadipscing elitr.{MD054}

### Upper case

Lorem ipsum dolor sit amet. Consetetur sadipscing elitr.{MD054}
Lorem ipsum dolor sit amet! Consetetur sadipscing elitr.{MD054}
Lorem ipsum dolor sit amet? Consetetur sadipscing elitr.{MD054}

### Special beginnings

Theoretically a sentence does not need to start with a letter.

Lorem ipsum dolor sit amet. 'Consetetur sadipscing elitr.{MD054}
Lorem ipsum dolor sit amet! "Consetetur sadipscing elitr.{MD054}
Lorem ipsum dolor sit amet? *Consetetur sadipscing elitr.{MD054}
Lorem ipsum dolor sit amet? _Consetetur sadipscing elitr.{MD054}

### Multiple spaces

Lorem ipsum dolor sit amet.  consetetur sadipscing elitr.{MD054}
Lorem ipsum dolor sit amet!  consetetur sadipscing elitr.{MD054}
Lorem ipsum dolor sit amet?  consetetur sadipscing elitr.{MD054}

## Code blocks

Lorem ipsum dolor sit `amet. consetetur` sadipscing elitr.
Lorem ipsum dolor sit `amet. consetetur.` sadipscing elitr.
Lorem ipsum dolor sit `amet.` consetetur. sadipscing elitr.{MD054}
Lorem ipsum dolor sit `amet! consetetur` sadipscing elitr.
Lorem ipsum dolor sit `amet! consetetur!` sadipscing elitr.
Lorem ipsum dolor sit `amet!` consetetur! sadipscing elitr.{MD054}

### Code Blocks with multiple spaces

Lorem ipsum dolor sit `amet.  consetetur` sadipscing elitr.
Lorem ipsum dolor sit `amet.  consetetur.` sadipscing elitr.
Lorem ipsum dolor sit `amet.` consetetur.  sadipscing elitr.{MD054}
Lorem ipsum dolor sit `amet!  consetetur` sadipscing elitr.
Lorem ipsum dolor sit `amet!  consetetur!` sadipscing elitr.
Lorem ipsum dolor sit `amet!` consetetur!  sadipscing elitr.{MD054}

### multiple lines

Lorem ipsum dolor sit `amet.
consetetur` sadipscing elitr.

Lorem ipsum dolor sit `amet.
consetetur.` sadipscing elitr.

Lorem ipsum dolor `sit
amet. consetetur.`
sadipscing. elitr.{MD054}

Lorem ipsum dolor
`sit amet. consetetur.` sadipscing. elitr.{MD054}
