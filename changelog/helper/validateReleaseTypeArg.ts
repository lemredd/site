import type { ReleaseType } from "../types.js"

import { releaseTypes } from "../constants.js"


export default function(arg: string): boolean {
	return releaseTypes.includes(arg as ReleaseType)
}