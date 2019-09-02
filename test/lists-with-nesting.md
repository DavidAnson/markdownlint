# Heading

## Excessive nesting

- one
   1. two
   1. three
- four

1. one
    - two
    - three
1. four

## Insufficient nesting

- one {MD032}
 1. two {MD032}
- three {MD032}

1. one {MD032}
  - two {MD006} {MD032}
1. three {MD032}

## Correct nesting, same type

- one
  - two
  - three
- four

1. one
   1. two
   1. three
1. four

## Correct nesting, different types

- one
  1. two
  1. three
- four

1. one
   - two
   - three
1. four

1. one
   - two
     - three

- one
  1. two
     - three

- one
  - two
    1. three

1. one
   1. two
      - three

1. one
   - two
     1. three

- one
  1. two
     1. three
