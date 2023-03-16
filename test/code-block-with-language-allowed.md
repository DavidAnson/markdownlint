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

```text
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
  "MD010": {
    "ignore_code_languages": [
      "js",
      "text"
    ]
  },
  "MD046": false
} -->
