import {Listener} from '../lib/structures/Listener';
import {Interaction} from 'discord.js';
import {GClient} from '../lib/GClient';
import {Events} from '../lib/util/Events';

new Listener('interactionCreate', {
	name: 'gcommands-componentHandler',
	run: async (interaction: Interaction): Promise<void> => {
		const client = interaction.client as GClient;
		if (interaction.isMessageComponent()) await client.ghandlers.componentHandler(interaction).catch(error => client.emit(Events.ERROR, error));
	}
});
