import { Listener } from '../lib/structures/Listener';
import type { GClient } from '../lib/GClient';
import { sync } from '../lib/util/sync';
import { Logger } from '../lib/util/logger/Logger';

new Listener({
	event: 'ready',
	name: 'gcommands-ready',
	run: async (client: GClient<true>) => {
		Logger.info('Client is ready with %s guild(s)', client.guilds.cache.size);
		await sync(client);
	},
});
