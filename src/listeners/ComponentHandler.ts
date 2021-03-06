import type { Interaction } from 'discord.js';
import { Handlers } from '../lib/managers/HandlerManager';
import { Listener } from '../lib/structures/Listener';
import { Logger } from '../lib/util/logger/Logger';

new Listener({
	event: 'interactionCreate',
	name: 'gcommands-componentHandler',
	run: async (interaction: Interaction): Promise<void> => {
		if (interaction.isMessageComponent() || interaction.isModalSubmit()) {
			await Handlers.componentHandler(interaction).catch(error => {
				Logger.error(
					typeof error.code !== 'undefined' ? error.code : '',
					error.message,
				);
				if (error.stack) Logger.trace(error.stack);
			});
		}
	},
});
