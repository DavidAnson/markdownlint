Some text

 # Header 1 {MD023}

 Setext style fully indented {MD023}
 ===================================

 Setext style title only indented {MD023}
=========================================

* Test situations in which MD023 shouldn't be triggered.

  ```rb
  # This shouldn't trigger MD023 as it is a code comment.
  foo = "And here is some code"
  ```

* This is another case where MD023 shouldn't be triggered
  # Test {MD023} Valid header for CommonMark (see section 5.2)
    # Test {MD023} Also valid header for CommonMark
