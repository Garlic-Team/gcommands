import {Listener} from '../lib/structures/Listener';
import {GClient} from '../lib/GClient';
import {Sync} from '../lib/util/Sync';

new Listener('ready', {
	name: 'gcommands-ready',
	run: async (client: GClient) => {
		await Sync(client);
	}
});
