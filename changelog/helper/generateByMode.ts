import { exec, execSync } from "child_process"

import type { ReleaseType, GeneratorMode } from "../types"

import getLatestGitTag from "./getLatestGitTag.js"

// git tag manipulation
function setInitialGitTag() {
	const initialGitTag = "v0.0.0"
	console.log("Git tag set to", initialGitTag)
	return initialGitTag
}
function bumpTagByReleaseType(releaseType: ReleaseType, latestGitTag: string) {
	const [majorVersion, minorVersion, patchVersion] = latestGitTag.slice(1).split(".")
	let bumpedGitTag = ""

	switch (releaseType) {
		case "patch": {
			const bumpedPatch = Number(patchVersion) + 1
			bumpedGitTag = `v${majorVersion}.${minorVersion}.${bumpedPatch}`

			break
		}
		case "minor": {
			const bumpedMinor = Number(minorVersion) + 1
			bumpedGitTag = `v${majorVersion}.${bumpedMinor}.0`

			break
		}
		case "major": {
			const bumpedMajor = Number(majorVersion) + 1
			bumpedGitTag = `v${bumpedMajor}.0.0`

			break
		}
	}

	console.log(`new ${releaseType} version ->`, bumpedGitTag)
	return bumpedGitTag
}

function buildChangelogCommand(
	latestGitTag: string,
	bumpedGitTag: string,
	releaseType: ReleaseType
) {
	const isInitialGitTag = latestGitTag === "v0.0.0"
	const slicedBumpedGitTag = bumpedGitTag.slice(1)
	const baseCommand = "pnpm changelogen "
	const changelogBoundaryArg = !isInitialGitTag
		? `--from ${latestGitTag} `
		: ""
	const specificReleaseVersionArg = `-r ${slicedBumpedGitTag} `
	const bumpTypeArg = `--${releaseType} --bump`

	return baseCommand + changelogBoundaryArg + specificReleaseVersionArg + bumpTypeArg
}

export default function(
	releaseTypeArg: ReleaseType,
	mode: GeneratorMode = "write"
) {
	let latestGitTag = getLatestGitTag()
	if (!latestGitTag) latestGitTag = setInitialGitTag()
	const bumpedGitTag = bumpTagByReleaseType(releaseTypeArg, latestGitTag)

	if (mode === "dry-run") {
		console.log("\n\nDry run output")
		exec("pnpm changelogen", (unusedError, stdout, unusedStderr) => {
			console.log(stdout)
		})
	} else {
		const commandToExec = buildChangelogCommand(
			latestGitTag,
			bumpedGitTag,
			releaseTypeArg
		)

		execSync(commandToExec)

		execSync(`git add . && git commit -m "release: ${bumpedGitTag}" && git tag ${bumpedGitTag}`)

		console.log("done!")
	}
}
