# List Indentation

Text

- Item
    - Item {MD007}
- Item
    - Item {MD007}

Text

- Item
  - Item
- Item
    - Item {MD007}

Text

- Item
    - Item {MD007}
- Item
  - Item

Text

- Item
  - Item
   - Item {MD005} {MD007}
  - Item
   - Item {MD005} {MD007}
   - Item {MD005} {MD007}
  - Item
- Item
  - Item
   - Item {MD005} {MD007}
  - Item
- Item
   - Item {MD007}
   - Item {MD007}
   - Item {MD007}
- Item
   - Item {MD007}
   - Item {MD007}
  - Item {MD005}

Text

## Invalid Indentation - Should Start at Zero

  - item 1 {MD006} {MD007}
  - item 2 {MD006} {MD007}
    - item 2.1 {MD007}
    - item 2.2 {MD007}
      - item 2.2.1 {MD007}
    - item 2.3 {MD007}
  - item 3 {MD006} {MD007}
