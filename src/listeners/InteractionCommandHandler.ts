import {Listener} from '../lib/structures/Listener';
import {GClient} from '../lib/GClient';
import {Events} from '../lib/util/Events';
import {Interaction} from 'discord.js';

new Listener('interactionCreate', {
	name: 'gcommands-interactionCommandHandler',
	run: async (interaction: Interaction): Promise<void> => {
		const client = interaction.client as GClient;
		if (interaction.isCommand() || interaction.isContextMenu()) await Promise.resolve(client.ghandlers.interactionCommandHandler(interaction)).catch(error => client.emit(Events.ERROR, error));
	}
});