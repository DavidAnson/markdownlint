# Table Column Count

## Expected

| Table |
|-------|
| Cell  |
| Cell  |
| Cell  |

| Table | Header |
|-------|--------|
| Cell  | Cell   |
| Cell  | Cell   |
| Cell  | Cell   |

| Table | Header | Header |
|-------|--------|--------|
| Cell  | Cell   | Cell   |
| Cell  | Cell   | Cell   |
| Cell  | Cell   | Cell   |

 Table | Header
-------|--------
 Cell  | Cell

{MD055:-4} {MD055:-3} {MD055:-2}

 | Table | Header | 
 |-------|--------| 
 | Cell  | Cell   | 

{MD009:-4} {MD009:-3} {MD009:-2}

## Blank

| Table |
|-------|
|       |
| Cell  |

| Table | Header | Header |
|-------|--------|--------|
|       | Cell   | Cell   |
| Cell  |        | Cell   |
| Cell  | Cell   |        |
|       |        |        |

## Too Few

| Table | Header |
|-------|--------|
| Cell  |
| Cell  | Cell   |
| Cell  |

{MD056:-4} {MD056:-2}

| Table | Header | Header |
|-------|--------|--------|
| Cell  |
| Cell  | Cell   |
| Cell  | Cell   | Cell   |

{MD056:-4} {MD056:-3}

 Table | Header
-------|--------
 Cell

{MD055:-4} {MD055:-3} {MD055:-2} {MD056:-2}

 | Table | Header | 
 |-------|--------| 
 | Cell  | 

{MD009:-4} {MD009:-3} {MD009:-2} {MD056:-2}

## Too Many

| Table |
|-------|
| Cell  |
| Cell  | Cell  |
| Cell  |

{MD056:-3}

| Table | Header |
|-------|--------|
| Cell  | Cell   | Cell | Cell |
| Cell  | Cell   | Cell |
| Cell  | Cell   |

{MD056:-4} {MD056:-3}

| Table | Header | Header |
|-------|--------|--------|
| Cell  | Cell   | Cell   | Cell |
| Cell  | Cell   | Cell   |
| Cell  | Cell   | Cell   | Cell | Cell |

{MD056:-4} {MD056:-2}

 Table | Header
-------|--------
 Cell  | Cell   | Cell

{MD055:-4} {MD055:-3} {MD055:-2} {MD056:-2}

 | Table | Header | 
 |-------|--------| 
 | Cell  | Cell   | Cell   | 

{MD009:-4} {MD009:-3} {MD009:-2} {MD056:-2}

## Mixed

| Table |
|-------|
| Cell  | Cell |
| Cell  |
| Cell  | Cell |

{MD056:-4} {MD056:-2}

| Table | Header |
|-------|--------|
| Cell  | Cell   | Cell |
| Cell  |
| Cell  | Cell   |

{MD056:-4} {MD056:-3}

| Table | Header | Header |
|-------|--------|--------|
| Cell  | Cell   | Cell   |
| Cell  | Cell   | Cell   | Cell |
| Cell  |

{MD056:-3} {MD056:-2}
