# Blanks Around

---

## MD022/blanks-around-headings

>
### Alpha
> >

<!-- comment -->
### Beta
<!-- comments --><!-- comments -->

> Text
>
> ### Gamma
> >
> > Text

---

## MD031/blanks-around-fences

> >
```js
console.log();
```
>

<!-- prettier-ignore -->
```js
console.log();
```
<!-- prettier-ignore -->

> Text
>
> ```js
> console.log();
> ```
> >
> >Text

---

## MD032/blanks-around-lists

>
- List item
>>

  <!--comments--><!--  comments  -->
- List item
<!--comment-->

> Text
>
> - List item
>>
>> Text
