import {runGenerator} from '@discordjs/ts-docgen';

runGenerator({
	existingOutput: 'docs/out-latest.json',
	output: 'docs/latest.json',
    custom: 'docs.yml'
});