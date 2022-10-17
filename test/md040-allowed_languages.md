# md040-allowed_languages.md

Code block with `html` not in allowed_languages:

```html
<h1>markdownlint</h1> {MD040:5}
```

Code block with `css` not in allowed_languages:

```css
body {}  {MD040:11}
```

Code block with `js` in allowed_languages:

```js
console.log('markdownlint')
```

Code block with `scss` in allowed_languages:

```scss
body {
  h1 {
    color: red;
  }
}
```

Code block with `md` in allowed_languages:

```MD
hello md
```

Code block with `TS` in allowed_languages:

```ts
body {
  h1 {
    color: red;
  }
}
```
