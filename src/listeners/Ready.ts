import {Listener} from '../lib/structures/Listener';
import {GClient} from '../lib/GClient';
import {sync} from '../lib/util/sync';
import Logger from 'js-logger';

new Listener('ready', {
	name: 'gcommands-ready',
	run: async (client: GClient) => {
		Logger.info('Client is ready with', String(client.guilds.cache.size), 'guild(s)');
		await sync(client);
	}
});
