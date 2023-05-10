import { exec, execSync } from "child_process"

import helper from "./generateByMode"
import * as getLatestGitTag from "./getLatestGitTag"

vi.mock("./getLatestGitTag", () => ({
	"default": vi.fn()
}))
vi.mock("child_process", () => ({
	"exec": vi.fn(),
	"execSync": vi.fn()
}))

describe("Changelog helper - `generateByMode`: tags", () => {
	beforeEach(() => {
		console.log = vi.fn()
	})
	afterEach(() => {
		vi.clearAllMocks()
	})

	it("can set initial git tag", async () => {
		await helper("major", "dry-run")

		expect(console.log).toHaveBeenCalledWith("Git tag set to", "v0.0.0")
	})

	it("can determine release type bump", async () => {
		await helper("patch", "dry-run")
		expect(console.log).toBeCalledWith("new patch version ->", "v0.0.1")

		await helper("minor", "dry-run")
		expect(console.log).toBeCalledWith("new minor version ->", "v0.1.0")

		await helper("major", "dry-run")
		expect(console.log).toBeCalledWith("new major version ->", "v1.0.0")
	})

	it("can continue from latest git tag", async () => {
		vi.spyOn(getLatestGitTag, "default").mockReturnValueOnce("v0.2.0")
		await helper("patch", "dry-run")
		expect(console.log).toBeCalledWith("new patch version ->", "v0.2.1")

		vi.spyOn(getLatestGitTag, "default").mockReturnValueOnce("v0.2.0")
		await helper("minor", "dry-run")
		expect(console.log).toBeCalledWith("new minor version ->", "v0.3.0")

		await helper("major", "dry-run")
		expect(console.log).toBeCalledWith("new major version ->", "v1.0.0")
	})
})

describe("Changelog helper - `generateByMode`: output", () => {
	it("can show dry run", async () => {
		await helper("major", "dry-run")

		expect(exec).toHaveBeenCalled()
	})

	it("can write to `CHANGELOG.md`", async () => {
		await helper("patch")
		const expectedPatCommand = "pnpm changelogen -r 0.0.1 --patch --bump"
		expect(execSync).toHaveBeenCalledWith(expectedPatCommand)
		expect(execSync).toHaveBeenCalledWith("git add . && git commit -m \"release: v0.0.1\" && git tag v0.0.1")

		await helper("minor")
		const expectedMinCommand = "pnpm changelogen -r 0.1.0 --minor --bump"
		expect(execSync).toHaveBeenCalledWith(expectedMinCommand)
		expect(execSync).toHaveBeenCalledWith("git add . && git commit -m \"release: v0.1.0\" && git tag v0.1.0")

		await helper("major")
		const expectedMajCommand = "pnpm changelogen -r 1.0.0 --major --bump"
		expect(execSync).toHaveBeenCalledWith(expectedMajCommand)
		expect(execSync).toHaveBeenCalledWith("git add . && git commit -m \"release: v1.0.0\" && git tag v1.0.0")
	})

	it("can log commit from given starting point", async () => {
		vi.spyOn(getLatestGitTag, "default").mockReturnValueOnce("v0.1.0")
		const expectedPatCommand = "pnpm changelogen --from v0.1.0 -r 0.1.1 --patch --bump"
		await helper("patch")
		expect(execSync).toHaveBeenCalledWith(expectedPatCommand)
	})
})