import { execSync } from "child_process"

export default function getLatestGitTag() {
	const outputFromCommand = execSync("git tag").toString()
	const tagList = outputFromCommand.split("\n")
	tagList.pop() // remove extraneous linebreak
	const latestGitTag = tagList[tagList.length - 1]

	return latestGitTag
}