# Ordered ist Item Prefix Double Digits Ordered

Good list:

1. Item
2. Item
3. Item
4. Item
5. Item
6. Item
7. Item
8. Item
9. Item
10. Item
11. Item

Bad list 1:

1. Item
10. Item {MD029}
9. Item {MD029}

Bad list 2:

11. Item {MD029}
10. Item {MD029}

Bad list 3

12. Item {MD029}
1. Item {MD029}

Bad list 4:

0. Item
10. Item {MD029}

<!-- markdownlint-configure-file {
  "ol-prefix": {
    "style": "ordered"
  }
} -->
