import { update, extend, updatePath, transaction } from "./index.js"

extend("$addTax", function (tax, original) {
	return original + tax * original
})

extend("$addTaxAll", (tax, object) =>
	updatePath("*.*.books[?(@.price >= 1)]", object, { price: { $addTax: tax } })
)

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

const changed = updatePath("some..books[?(@.price >= 1)]", testobj, {
	price: { $addTax: 0.2 },
})

console.log(JSON.stringify(changed, null, 2))

const changedCompose = update(testobj, { $addTaxAll: 0.2 })

console.log(JSON.stringify(changedCompose, null, 2))
