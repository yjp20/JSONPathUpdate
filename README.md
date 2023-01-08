### Example object

```js
const testobj = {
	some: {
		a: {
			books: [
				{
					name: "moby",
					price: 3,
				},
			],
		},
	},
}
```

### UpdatePath

```js
extend("$addTax", function (tax, original) {
	return original + tax * original
})

const changed = updatePath("some..books[?(@.price >= 1)]", testobj, {
	price: { $addTax: 0.2 },
})
```

### Compose commands

```js
extend("$addTaxAll", (tax, object) =>
	updatePath("*.*.books[?(@.price >= 1)]", object, { price: { $addTax: tax } })
)
```
