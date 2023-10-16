# Lists on a Line

## Correct

Text

* * Item

Text

* * * Item

Text

- + * Item

Text

- 1. Item

Text

- 1. + Item

Text

* * * Item
    * Item
  * Item
* Item

## Incorrect

Text

  * * Item {MD007}

Text

  * * * Item {MD007}

Text

  - + * Item {MD007}

Text

  - 1. Item {MD007}

Text

  - 1. + Item {MD007}

Text

  * * * Item {MD007}
       * Item {MD005} {MD007}
     * Item {MD005} {MD007}
   * Item {MD005} {MD007}

<!-- markdownlint-configure-file {
  "ul-style": false
} -->
