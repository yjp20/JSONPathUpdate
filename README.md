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

### Method 1: UpdatePath

```js
updatePath("some..books[?(@.price >= 1)]", testobj, (node) => {
	const newValue = update(node.value, { price: { $addTax: 0.2 } })
	node.parent[node.parentProperty] = newValue
})
```

### Method 2: Generate a transaction

```js
const diff = transaction(testobj, [
	["some..books[?(@.price >= 1)]", { price: { $addTax: 0.2 } }]
])

const updated = update(testobj, diff)
```
