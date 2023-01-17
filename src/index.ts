import { JSONPath } from "jsonpath-plus"
import update, { extend, Context, Spec } from "immutability-helper"

export { update, extend, Context, Spec }

export declare type Operation<T> = (obj: T) => T | Spec<T>
export declare type Mapping<T> = { path: string; op: Operation<T> }

export function updatePath<T1, T2>(obj: T1, path: string, op: Operation<T2>) {
	return update(obj, transaction(obj, [{ path, op }]))
}

export function transaction<T1, T2>(obj: T1, mapping: Mapping<T2>[]): Spec<T1> {
	const diff = {} as Spec<T1, never>
	for (const { path, op } of mapping) {
		// @ts-ignore
		const results = JSONPath({
			path,
			// @ts-ignore
			json: obj,
			resultType: "path",
		}) as string[]

		for (const result of results) {
			let objPtr: any = obj
			let diffPtr: any = diff

			for (const component of JSONPath.toPathArray(result).slice(1)) {
				objPtr = objPtr[component]
				if (diffPtr[component] === undefined) diffPtr[component] = {}
				diffPtr = diffPtr[component]
			}

			Object.assign(diffPtr, typeof op == "object" ? op : op(objPtr))
		}
	}

	return diff
}

