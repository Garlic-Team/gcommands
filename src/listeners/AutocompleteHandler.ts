import { type Interaction, InteractionType } from 'discord.js';
import { Handlers } from '../lib/managers/HandlerManager';
import { Listener } from '../lib/structures/Listener';
import { Logger } from '../lib/util/logger/Logger';

new Listener({
	event: 'interactionCreate',
	name: 'gcommands-autocompleteHandler',
	run: async (interaction: Interaction): Promise<void> => {
		if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
			await Promise.resolve(Handlers.autocompleteHandler(interaction)).catch(
				error => {
					Logger.error(
						typeof error.code !== 'undefined' ? error.code : '',
						error.message,
					);
					if (error.stack) Logger.trace(error.stack);
				},
			);
		}
	},
});
