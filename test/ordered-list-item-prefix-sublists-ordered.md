# Ordered List Item Prefix Sublists Ordered

Good list and sublist:

1. Item
2. Item
   1. Item
   2. Item
3. Item

Good list and bad sublist:

1. Item
2. Item
   3. Item
   4. Item
3. Item

Bad list and good sublist:

1. Item
4. Item {MD029}
   1. Item
   2. Item
5. Item {MD029}

Bad list and bad sublist:

1. Item
4. Item {MD029}
   1. Item
   3. Item {MD029}
5. Item {MD029}

Bad list and bad sublist (0):

0. Item
4. Item {MD029}
   1. Item
   3. Item {MD029}
5. Item {MD029}

<!-- markdownlint-configure-file {
  "ol-prefix": {
    "style": "ordered"
  }
} -->
