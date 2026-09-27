# Table Column Style No Leading Pipe

## Auto-detected as "aligned"

### Not fixable (no fixes for aligned style)

HH |
--|
TT |
++|
TT |
**|
TT |

{MD060:-3} {MD060:-5} {MD060:-7}

 HH |
 --|
 TT |
 ++|
 TT |
 **|
 TT |

{MD060:-3} {MD060:-5} {MD060:-7}

> HH |
> --|
> TT |
> ++|
> TT |
> **|
> TT |

{MD060:-3} {MD060:-5} {MD060:-7}

### Not fixable (adding space creates unordered list)

H |
-|
T |
+|
T |
*|
T |

{MD060:-3} {MD060:-5} {MD060:-7}

 H |
 -|
 T |
 +|
 T |
 *|
 T |

{MD060:-3} {MD060:-5} {MD060:-7}

> H |
> -|
> T |
> +|
> T |
> *|
> T |

{MD060:-3} {MD060:-5} {MD060:-7}

## Auto-detected as "compact"

### Fixable

Header |
--|
Text |
++|
Text |
**|
Text |

{MD060:-3} {MD060:-5} {MD060:-7}

 Header |
 --|
 Text |
 ++|
 Text |
 **|
 Text |

{MD060:-3} {MD060:-5} {MD060:-7}

> Header |
> --|
> Text |
> ++|
> Text |
> **|
> Text |

{MD060:-3} {MD060:-5} {MD060:-7}

### Not fixable (adding space creates unordered list)

Header |
-|
Text |
+|
Text |
*|
Text |

{MD060:-3} {MD060:-5} {MD060:-7}

 Header |
 -|
 Text |
 +|
 Text |
 *|
 Text |

{MD060:-3} {MD060:-5} {MD060:-7}

> Header |
> -|
> Text |
> +|
> Text |
> *|
> Text |

{MD060:-3} {MD060:-5} {MD060:-7}

## Auto-detected as "tight"

### Fixable

Header|
-- |
Text|
++ |
Text|
** |
Text|

{MD060:-3} {MD060:-5} {MD060:-7}

 Header|
 -- |
 Text|
 ++ |
 Text|
 ** |
 Text|

{MD060:-3} {MD060:-5} {MD060:-7}

> Header|
> -- |
> Text|
> ++ |
> Text|
> ** |
> Text|

{MD060:-3} {MD060:-5} {MD060:-7}

### Not a table (space creates unordered list)

```markdown
Header|
- |
Text|
+ |
Text|
* |
Text|
```

<!-- markdownlint-disable-file no-duplicate-heading -->
