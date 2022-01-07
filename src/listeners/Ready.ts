import { Listener } from '../lib/structures/Listener';
import { GClient } from '../lib/GClient';
import { sync } from '../lib/util/sync';
import Logger from 'js-logger';

new Listener({
	event: 'ready',
	name: 'gcommands-ready',
	run: async (client: GClient) => {
		Logger.info('Client is ready with %s guild(s)', client.guilds.cache.size);
		await sync(client);
	},
});
