import { update, extend, updatePath, transaction } from "./index.js"

extend("$addTax", function (tax, original) {
	return original + tax * original
})

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

console.log(JSON.stringify(testobj, null, 2))

updatePath("some..books[?(@.price >= 1)]", testobj, (node) => {
	const newValue = update(node.value, { price: { $addTax: 0.2 } })
	node.parent[node.parentProperty] = newValue
})

console.log(JSON.stringify(testobj, null, 2))

const diff = transaction(testobj, [
	["some..books[?(@.price >= 1)]", { price: { $addTax: 0.2 } }]
])


console.log(JSON.stringify(diff, null, 2))

const after = update(testobj, diff)

console.log(JSON.stringify(after, null, 2))
