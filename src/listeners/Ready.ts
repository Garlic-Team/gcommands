import type { Client } from 'discord.js';
import type { GClient } from '../lib/GClient';
import { Listener } from '../lib/structures/Listener';
import { Logger } from '../lib/util/logger/Logger';
import { sync } from '../lib/util/sync';

new Listener({
	event: 'ready',
	name: 'gcommands-ready',
	run: async (client: Client<true>) => {
		Logger.info('Client is ready with %s guild(s)', client.guilds.cache.size);
		await sync(client as GClient);
	},
});
