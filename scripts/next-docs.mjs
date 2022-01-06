import {runGenerator} from '@discordjs/ts-docgen';

runGenerator({
	existingOutput: 'docs/out-next.json',
	output: 'docs/next.json',
    custom: 'docs.yml'
});
