# md040-allowed_languages.md

Code block with `html` not in allowed_languages:

```html
<h1>markdownlint</h1> {MD040:5}
```

Code block with `css` not in allowed_languages:

```css
body {}  {MD040:11}
```

Code block with `MD` (uppercase) not in allowed_languages:

```MD
hello md {MD040:17}
```

Code block with `ts` (lowercase) not in allowed_languages:

```ts
let foo = "bar"; {MD040:23}
```

Code block with `js` in allowed_languages:

```js
console.log('markdownlint')
```

Code block with `js foo` allowed_languages:

```js foo
console.log('bar')
```

Code block with ` scss` (prefixed by a space) in allowed_languages: {MD038}

``` scss
body {
  h1 {
    color: red;
  }
}
```

Code block with `md` (lowercase) in allowed_languages:

```md
hello md
```

Code block with `TS` (uppercase) in allowed_languages:

```TS
body {
  h1 {
    color: red;
  }
}
```

<!-- markdownlint-configure-file {
  "MD040": {
    "allowed_languages": [
      "js",
      "scss",
      "md",
      "TS"
    ]
  }
} -->
