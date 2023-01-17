import { update, extend, updatePath } from "./index"

extend("$addTax", function (tax: number, original: number) {
	return original + tax * original
})

extend("$addTaxAll", (tax, object: any) =>
	// @ts-ignore
	updatePath(object, "*.*.books[?(@.price >= 1)]", { price: { $addTax: tax } })
)

const testobj = {
	some: {
		a: {
			books: [
				{
					name: "grapes",
					type: "normal",
					price: 2,
				},
				{
					name: "moby",
					type: "luxury",
					price: 3,
				},
			],
		},
	},
}

const saved = JSON.stringify(testobj)

describe("updatePath", () => {
	it("should apply change while keeping original object immutable", () => {
		const changed = updatePath(testobj, "some..books[?(@.price >= 1)]", {
			// @ts-ignore
			price: { $addTax: 0.2 },
		})

		const expected = {
			some: {
				a: {
					books: [
						{
							name: "grapes",
							type: "normal",
							price: 2.4,
						},
						{
							name: "moby",
							type: "luxury",
							price: 3.6,
						},
					],
				},
			},
		}
		expect(JSON.stringify(testobj)).toEqual(saved)
		expect(changed).toEqual(expected)
	})

	it("should apply functional change while keeping original object immutable", () => {
		const changed = updatePath(
			testobj,
			"some..books[?(@.price >= 1)]",
			(obj) => {
				return {
					// @ts-ignore
					price: { $addTax: obj.type == "luxury" ? 0.3 : 0.2 },
				}
			}
		)

		const expected = {
			some: {
				a: {
					books: [
						{
							name: "grapes",
							type: "normal",
							price: 2.4,
						},
						{
							name: "moby",
							type: "luxury",
							price: 3.9,
						},
					],
				},
			},
		}

		expect(JSON.stringify(testobj)).toEqual(saved)
		expect(changed).toEqual(expected)
	})

	it("should apply composed change", () => {
		// @ts-ignore
		const changed = update(testobj, { $addTaxAll: 0.2 })

		const expected = {
			some: {
				a: {
					books: [
						{
							name: "grapes",
							type: "normal",
							price: 2.4,
						},
						{
							name: "moby",
							type: "luxury",
							price: 3.6,
						},
					],
				},
			},
		}

		expect(JSON.stringify(testobj)).toEqual(saved)
		expect(changed).toEqual(expected)
	})
})

// @ts-ignore
