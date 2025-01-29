function convertBigIntsToNumbers<T>(obj: T): T {
	if (typeof obj === "object" && obj !== null) {
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				obj[key] = convertBigIntsToNumbers(obj[key]);
			}
		}
	} else if (typeof obj === "bigint") {
		// biome-ignore lint/style/noParameterAssign: <explanation>
		obj = Number(obj) as unknown as T;
	}
	return obj;
}

export { convertBigIntsToNumbers };
