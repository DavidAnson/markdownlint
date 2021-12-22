# Spaces Inside Link Text

[](http://bar/)

[foo](https://bar/)

["foo"](https://bar/)

[`foo`](https://bar/)

[*foo*](https://bar/)

[**foo**](https://bar/)

[foo "bar"](https://baz/)

[ ](https://bar/) {MD039}

[foo ](https://bar/) {MD039}

[ foo](https://bar/) {MD039}

[ foo ](https://bar/) {MD039}

[ "foo" ](https://bar/) {MD039}

[ `foo` ](https://bar/) {MD039}

[ *foo* ](https://bar/) {MD039}

The following shouldn't break anything:
[![Screenshot.png](/images/Screenshot.png)](/images/Screenshot.png)

function CodeButNotCode(input) {
  return input.replace(/[- ]([a-z])/g, "one"); // {MD039}
}

function MoreCodeButNotCode(input) {
  input = input.replace(/[- ]([a-z])/g, "two"); // {MD039}
  input = input.toLowerCase();
  input = input.replace(/[- ]([a-z])/g, "three"); // {MD039}
  return input;
}

[Links](ending)  
[with](spaces)  
[error ]({MD039})

Wrapped [ link with leading space
  ](https://example.com) {MD039}

Non-wrapped [ link with leading space](https://example.com) {MD039}

[][ref]

[link][ref]

[link ][ref] {MD039}

[ link][ref] {MD039}

[ link ][ref] {MD039}

[ref]: https://example.com
