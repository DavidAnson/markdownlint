
# Testing one sentence per line

# MD054/sentences-per-line

This should? Produce a violation.

So should! This example.

Abbreviations (e.g. like) these (i.e. should) not.

"Sentences in." Quotes should, too.

Pausing... for... thought... should not?

This rule does weird things if a sentence is
already wrapped. It should maybe unwrap in
cases like this?

## Sugar cases

### Lower case

Lorem ipsum dolor sit amet. consetetur sadipscing elitr.{MD054}
Lorem ipsum dolor sit amet. consetetur sadipscing elitr. consetetur sadipscing elitr. consetetur sadipscing elitr.{MD054}
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
Lorem ipsum dolor sit ``amet! consetetur`` sadipscing elitr.
Lorem ipsum dolor sit ``amet! consetetur!`` sadipscing elitr.
Lorem ipsum dolor sit ``amet!`` consetetur! sadipscing elitr.{MD054}
Lorem ipsum dolor sit ```amet! consetetur``` sadipscing elitr.
Lorem ipsum dolor sit ```amet`! consetetur!``` sadipscing elitr.
Lorem ipsum dolor sit ```amet!``` consetetur! sadipscing elitr.{MD054}

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

Lorem ipsum dolor sit `amet.
consetetur. dd` sadipscing elitr.

Lorem ipsum dolor `sit
amet. consetetur.`
sadipscing. elitr.{MD054}

Lorem ipsum dolor
`sit amet. consetetur.` sadipscing. elitr.{MD054}
