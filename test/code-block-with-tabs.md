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
	console.log("true");      // {MD010}
	if (false) {              // {MD010}
		console.log("false"); // {MD010}
	}                         // {MD010}
}
```

    if (true) {                   // {MD046}
        console.log("true");
        if (false) {
            console.log("false");
        }
    }

	if (true) {                   // {MD010}
		console.log("true");      // {MD010}
		if (false) {              // {MD010}
			console.log("false"); // {MD010}
		}                         // {MD010}
	}                             // {MD010}

Line with	hard tab. {MD010}
