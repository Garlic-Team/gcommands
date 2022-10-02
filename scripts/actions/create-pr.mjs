// From https://github.com/discordjs/discord-api-types/blob/main/scripts/actions/create-pr.mjs

/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/restrict-template-expressions */
import { Octokit } from '@octokit/action';
import { readFile } from 'node:fs/promises';

const packageJson = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), { encoding: 'utf8' }));
const octokit = new Octokit();
const [OWNER, REPOSITORY] = process.env.GITHUB_REPOSITORY.split('/');

console.log('👀 Getting the previous release version');
const previousReleases = await octokit.repos.listReleases({
	owner: OWNER,
	repo: REPOSITORY,
});

// Releases are sorted from newest to oldest, this should work™️
const previousRelease = previousReleases.data.find((release) => !release.draft);
console.log('👀 Previous release version:', previousRelease?.tag_name);

const pullRequestBody = [
	'**Please describe the changes this PR makes and why it should be merged:**',
	'',
	`This pull request bumps GCommands from **${previousRelease?.tag_name ?? 'unknown'}** to **${
		packageJson.version
	}**.`,
	'',
	'⚠️ **Do not change the commit message when merging. It must stay in the format `chore(release): ...`!**',
];

console.log(`🎉 Creating pull request for gcommands ${packageJson.version}`);

const pullRequest = await octokit.pulls.create({
	base: 'next',
	// The format must stay in sync with the one in release.yml
	head: `chore/release/${packageJson.version}`,
	owner: OWNER,
	repo: REPOSITORY,
	maintainer_can_modify: true,
	title: `chore(release): ${packageJson.version} 🎉`,
	body: pullRequestBody.join('\n'),
});

console.log(`✅ Done! Created pull request ${pullRequest.data.html_url}`);
