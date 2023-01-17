### jsonpathupdate

`jsonpathupdate` is a library which allows the simple composition of `immutability-helper` and `jsonpath-plus`, getting the full benefits of immutability with the flexibility of jsonpath queries. It is also fully extendable in the same way as immutability-helper.

### Example usage

jsonpathupdate provides `updatePath`, which looks and feels like the update function in `immutability-helper`.

```js
const obj = {
	some: {
		a: {
			books: [
				{
					name: "moby",
                    type: "luxury",
					price: 3,
				},
			],
		},
	},
}

extend("$addTax", function (tax, original) {
	return original + tax * original
})

const changedObj = updatePath(obj, "some..books[?(@.price >= 1)]", {
	price: { $addTax: 0.2 },
})
```

Like `immutability-helper`'s `update`, you can optionally pass a function to change the values depending on the value. In the example below, we apply a higher percentage tax if the object is a luxury type book.

```js
const changedObj = updatePath(obj, "some..books[?(@.price >= 1)]", (obj) => {
    return {
        price: { $addTax: obj.type == "luxury" ? 0.3 : 0.2 },
    }
})
```

## Composability

You can also create new commands that use updatePath, since updatePath applies changes immutably.

```js
extend("$addTaxAll", (tax, object) =>
	updatePath("*.*.books[?(@.price >= 1)]", object, { price: { $addTax: tax } })
)

const changedObj = update(obj, { $addTaxAll: 0.2 })
```
