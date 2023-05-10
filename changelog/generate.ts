import type { ReleaseType, GeneratorMode } from "./types.js"

import { releaseTypes } from "./constants.js"
import generateByMode from "./helper/generateByMode.js"
import validateReleaseTypeArg from "./helper/validateReleaseTypeArg.js"

const [
	releaseTypeArg,
	generatorModeArg
] = process.argv.slice(2) as [ReleaseType, GeneratorMode]

if (!validateReleaseTypeArg(releaseTypeArg)) {
	console.error("Invalid release type!\n", `\bshould be at least one of these: ${releaseTypes.join(" / ")}`)
	process.exit(1)
}

generateByMode(releaseTypeArg, generatorModeArg)