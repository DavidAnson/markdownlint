# List Alignment

## Leading Spaces

 1. One
 2. Two
 3. Three
 4. Four
 5. Five
 6. Six
 7. Seven
 8. Eight
 9. Nine
10. Ten
11. Eleven
12. Twelve

## Leading Zeroes

01. One
02. Two
03. Three
04. Four
05. Five
06. Six
07. Seven
08. Eight
09. Nine
10. Ten
11. Eleven
12. Twelve

## Double Leading Zeroes

001. One
002. Two
003. Three

## Nested Lists

- Item
- Item
  01. One
  02. Two
  03. Three
  04. Four
  05. Five
  06. Six
  07. Seven
  08. Eight
  09. Nine
  10. Ten
  11. Eleven
  12. Twelve
- Item
- Item
   1. One
   2. Two
   3. Three
   4. Four
   5. Five
   6. Six
   7. Seven
   8. Eight
   9. Nine
  10. Ten
  11. Eleven
  12. Twelve
- Item
- Item

## Another Nested List

01. One
02. Two
    01. One
    02. Two
03. Three
04. Four

## Leading Spaces Errors

  1. One
  2. Two
  3. Three
  4. Four
 5. Five {MD005}
  6. Six
  7. Seven
  8. Eight
  9. Nine
 10. Ten
  11. Eleven {MD005}
 12. Twelve
13. Thirteen {MD005}
 14. Fourteen

## Leading Spaces Errors with Nesting

  1. One
 2. Two {MD005}
  3. Three
     1. One
     2. Two
     3. Three
     4. Four
      5. Five {MD005}
     6. Six
     7. Seven
      8. Eight {MD005}
     9. Nine
     10. Ten
  4. Four
 5. Five {MD005}
  6. Six
      1. One
      2. Two
     3. Three {MD005}
      4. Four
      5. Five
      6. Six
       7. Seven {MD005}
      8. Eight
      9. Nine
     10. Ten
  7. Seven
 8. Eight {MD005}
  9. Nine
 10. Ten
