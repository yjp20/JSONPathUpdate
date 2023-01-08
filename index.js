import { JSONPath } from "jsonpath-plus"
import update, {extend} from 'immutability-helper';

export {extend, update}

export function updatePath(path, obj, callback) {
	JSONPath({
		path,
		json: obj,
		callback: (value, _, { parent, parentProperty }) => {
			callback({
				value: value,
				parent: parent,
				parentProperty: parentProperty,
			})
		}
	})
}

export function transaction(obj, mapping) {
	const diff = {}
	for (const [path,immut] of mapping) {
		const results = JSONPath({
			path,
			json: obj,
			resultType: "path",
		})

		for (const result of results) {
			let objPtr = obj
			let diffPtr = diff

			for (const component of JSONPath.toPathArray(result).slice(1)) {
				objPtr = objPtr[component]
				if (diffPtr[component] === undefined)
					diffPtr[component] = {}
				diffPtr = diffPtr[component]
			}

			Object.assign(diffPtr, typeof immut == "object"
				? immut
				: immut(diffPtr))
		}
	}

	return diff
}

