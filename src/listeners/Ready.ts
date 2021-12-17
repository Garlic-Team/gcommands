import {Listener} from '../lib/structures/Listener';
import {GClient} from '../lib/GClient';
import {Sync} from '../lib/util/Sync';
import Logger from 'js-logger';

new Listener('ready', {
	name: 'gcommands-ready',
	run: async (client: GClient) => {
		Logger.info('Client is ready with', client.guilds.cache.size, 'guild(s)');
		await Sync(client);
	}
});
