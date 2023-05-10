import helper from "./getLatestGitTag"
import * as childProcess from "child_process"

// mock `execSync` from `child_process`
vi.mock("child_process", () => ({
	"execSync": vi.fn().mockReturnValue(Buffer.from("")) // returns empty string
}))

describe("Changelog generator helper - `getLatestGitTag`", () => {
	afterEach(() => {
		// It is important to clear mocks after each test case.
		// https://vitest.dev/api/vi.html#vi-clearallmocks
		vi.clearAllMocks()
	})

	it("can get latest git tag", () => {
		// By default, only one invocation of `vi.mock` will mock a module.
		// Reinvoking `vi.mock` inside a test case to redefine an exported function won't work.
		// See https://vitest.dev/guide/mocking.html#cheat-sheet ("mock exported function" section)
		// to re-mock a value, we can use `vi.spyOn` and `mockReturnValueOnce`
		const bufferedOutput = Buffer.from("v0.1.0\n")
		const execSyncSpy = vi.spyOn(childProcess, "execSync")
		execSyncSpy.mockReturnValueOnce(bufferedOutput) // not empty string anymore
		const receivedValue = helper()

		expect(receivedValue).toBeTypeOf("string")
		expect(receivedValue).toBeTruthy()
		expect(receivedValue).toMatch(/v\d\.\d\.\d/)
	})

	it("returns nothing", () => {
		const receivedValue = helper()

		expect(receivedValue).toBeFalsy()
	})
})