# List Indentation start_indent/no indent

 * item 1
 * item 2
   * item 2.1
   * item 2.2
     * item 2.2.1
   * item 2.3
      * item 2.3.1 {MD007}
 * item 3
  * item 4 {MD005} {MD007}

Text

  * item 1 {MD007}
  * item 2 {MD007}
    * item 2.1 {MD007}
    * item 2.2 {MD007}
      * item 2.2.1 {MD007}

Text

 * item 1
 * item 2
    * item 2.1 {MD007}
    * item 2.2 {MD007}
       * item 2.2.1 {MD007}

<!-- markdownlint-configure-file {
  "ul-indent": {
    "start_indented": true,
    "start_indent": 1
  }
} -->
