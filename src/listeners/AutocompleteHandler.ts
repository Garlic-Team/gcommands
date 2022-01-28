import { Listener } from '../lib/structures/Listener';
import type { Interaction } from 'discord.js';
import { Handlers } from '../lib/managers/HandlerManager';
import Logger from 'js-logger';

new Listener({
	event: 'interactionCreate',
	name: 'gcommands-autocompleteHandler',
	run: async (interaction: Interaction): Promise<void> => {
		if (interaction.isAutocomplete())
			await Promise.resolve(Handlers.autocompleteHandler(interaction)).catch((error) => {
				Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
				if (error.stack) Logger.trace(error.stack);
			});
	},
});
