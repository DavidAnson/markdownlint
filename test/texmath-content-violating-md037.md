# texmath-content-violating-md037

## Inline (not handled)

text `$ x * y * z $` text

text `$$ x * y * z $$` text

## Block (handled when used with markdown-it-texmath)

$$
x * y * z {MD037}
$$

text

$$
x * y = x * y {MD037}
$$
