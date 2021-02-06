# sublist-bullet-style

1. item
   1. item
      + item
   1. item
      - item {MD004}

- item
  * item
    + item
      - item
    + item
  * item
- item
  * item
    + item
      - item

+ item {MD004}
  + item {MD004}
    + item
      + item {MD004}

- item
  * item
    * item {MD004}
      - item
        * item

+ item {MD004}
  - item {MD004}
    * item {MD004}

- item
  1. item
     + item
       1. item
          * item

1. item
   * item

- item
  * item
    + item
      - item
        * item
          * item {MD004}
          + item {MD004}

- item
  * item
    + item
      - item
        * item
          - item
          + item {MD004}

<!-- markdownlint-configure-file {
  "ul-style": {
    "style": "sublist"
  }
} -->
