Some text

 # Heading 1 {MD023}

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
  # Test {MD022} {MD023} Valid heading for CommonMark (see section 5.2)
    # Test {MD022} {MD023} Also valid heading for CommonMark
