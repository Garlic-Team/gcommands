import {Listener} from '../lib/structures/Listener';
import {Interaction} from 'discord.js';
import {GClient} from '../lib/GClient';
import {Events} from '../lib/util/Events';

new Listener('interactionCreate', {
	name: 'gcommands-componentHandler',
	run: async (interaction: Interaction): Promise<void> => {
		if (interaction.isMessageComponent()) await GClient.ghandlers.componentHandler(interaction).catch(error => interaction.client.emit(Events.ERROR, error));
	}
});
