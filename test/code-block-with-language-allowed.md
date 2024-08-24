# Heading

```js
if (true) {
    console.log("true");
    if (false) {
        console.log("false");
    }
}
```

```js
if (true) {
	console.log("true");
	if (false) {
		console.log("false");
	}
}
```

    if (true) {
        console.log("true");
        if (false) {
            console.log("false");
        }
    }

``` Text
	hello
	world
}
```

	if (true) {                   // {MD010}
		console.log("true");      // {MD010}
		if (false) {              // {MD010}
			console.log("false"); // {MD010}
		}                         // {MD010}
	}                             // {MD010}

Line with	hard tab. {MD010}

```javascript
if (true) {
	console.log("true");      // {MD010}
	if (false) {              // {MD010}
		console.log("false"); // {MD010}
	}                         // {MD010}
}
```

<!-- markdownlint-configure-file {
  "no-hard-tabs": {
    "ignore_code_languages": [
      "js",
      "text"
    ]
  },
  "code-block-style": false
} -->
