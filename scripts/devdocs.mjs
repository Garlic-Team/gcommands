import { runGenerator } from '@discordjs/ts-docgen';

runGenerator({
	existingOutput: 'docs/out-dev.json',
	output: 'docs/dev.json',
	custom: 'docs.yml',
});
