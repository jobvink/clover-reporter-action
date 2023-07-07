import { promises as fs } from "fs"
import core from "@actions/core"
import { GitHub, context } from "@actions/github"

import { parse } from "./clover"
import { diff } from "./comment"

async function main() {
	const token = core.getInput("github-token")
	const cloverFile = core.getInput("clover-file") || "./coverage/clover.xml"
	const baseFile = core.getInput("clover-base")

	const raw = await fs.readFile(cloverFile, "utf-8").catch(err => null)
	if (!raw) {
		console.log(`No coverage report found at '${cloverFile}', exiting...`)
		return
	}

	const baseRaw =
		baseFile && (await fs.readFile(baseFile, "utf-8").catch(err => null))
	if (baseFile && !baseRaw) {
		console.log(`No coverage report found at '${baseFile}', ignoring...`)
	}

	const options = {
		repository: context.payload.repository.full_name,
		commit: context.payload.pull_request.head.sha,
		prefix: `${process.env.GITHUB_WORKSPACE}/`,
		head: context.payload.pull_request.head.ref,
		base: context.payload.pull_request.base.ref,
	}

	const clover = await parse(raw)
	const baseclover = baseRaw && (await parse(baseRaw))
	const body = diff(clover, baseclover, options)

	const github = new GitHub(token)

	const { data: comments } = await github.issues.listComments({
		owner: context.repo.owner,
		repo: context.repo.repo,
		issue_number: context.issue.number,
	})

	const botComment = comments.find(comment => {
		return comment.user.type === 'Bot' && comment.body.includes('Coverage after merging')
	})

	if (botComment) {
		await github.issues.updateComment({
			owner: context.repo.owner,
			repo: context.repo.repo,
			comment_id: botComment.id,
			body: body
		})
	} else {
		await github.issues.createComment({
			repo: context.repo.repo,
			owner: context.repo.owner,
			issue_number: context.payload.pull_request.number,
			body: diff(clover, baseclover, options),
		})
	}
}

main().catch(function(err) {
	console.log(err)
	core.setFailed(err.message)
})
