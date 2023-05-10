import { releaseTypes } from "./constants"

export type ReleaseType = typeof releaseTypes[number]
export type GeneratorMode = "dry-run" | "write"