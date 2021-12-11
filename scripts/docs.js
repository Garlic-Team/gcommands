import {runGenerator} from '@discordjs/ts-docgen';

runGenerator({
	existingOutput: 'docs/out-main.json',
	output: 'docs/main.json'
});
