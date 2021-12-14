# List Indentation - Start Indented/No Indent

  * item 1
  * item 2
    * item 2.1
    * item 2.2
      * item 2.2.1
    * item 2.3
  * item 3

## Disallowed List Indentation - Starts at Zero

* item 1 {MD007}
* item 2 {MD007}
   * item 2.1 {MD007}
   * item 2.2 {MD007}
     * item 2.2.1 {MD007}
   * item 2.3 {MD007}
* item 3 {MD007}

## Disallowed List Indentation - Starts at One

 * item 1 {MD007}
 * item 2 {MD007}
   * item 2.1 {MD007}
   * item 2.2 {MD007}
       * item 2.2.1 {MD007}
   * item 2.3 {MD007}
      * item 2.3.1
 * item 3 {MD007}

## Disallowed List Indentation - Starts at Three

   * item 1 {MD007}
   * item 2 {MD007}
      * item 2.1 {MD007}
      * item 2.2 {MD007}
         * item 2.2.1 {MD007}
      * item 2.3 {MD007}
   * item 3 {MD007}

<!-- markdownlint-configure-file {
  "ul-indent": {
    "start_indented": true
  }
} -->
