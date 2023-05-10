import helper from "./validateReleaseTypeArg"

describe("Changelog generator helper: `validateReleaseTypeArg`", () => {
	it("determines valid argument", () => {
		const invalidArg = "invalid"
		const receivedValue = helper(invalidArg)

		expect(receivedValue).toBeFalsy()
	})
})