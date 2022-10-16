# fenced_code_blocks

Code block with `html` not in allow_list:

```html
<h1>markdownlint</h1> {MD040:5}
```

Code block with `css` not in allow_list:

```css
body {}  {MD040:11}
```

Code block with `js` in allow_list:

```js
console.log('markdownlint')
```

Code block with `scss` in allow_list:

```scss
body {
  h1 {
    color: red;
  }
}
```
