import {Listener} from '../lib/structures/Listener';
import {Interaction} from 'discord.js';
import {Handlers} from '../lib/managers/HandlerManager';
import Logger from 'js-logger';

new Listener('interactionCreate', {
	name: 'gcommands-componentHandler',
	run: async (interaction: Interaction): Promise<void> => {
		if (interaction.isMessageComponent()) await Handlers.componentHandler(interaction).catch(error => {
			Logger.error(error.code, error.message);
			Logger.trace(error.trace);
		});
	}
});
