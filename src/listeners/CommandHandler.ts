import {Listener} from '../lib/structures/Listener';
import {GClient} from '../lib/GClient';
import {Events} from '../lib/util/Events';
import {Interaction} from 'discord.js';

new Listener('interactionCreate', {
	name: 'gcommands-commandHandler',
	run: async (interaction: Interaction): Promise<void> => {
		if (interaction.isCommand() || interaction.isContextMenu()) await GClient.ghandlers.commandHandler(interaction).catch(error => interaction.client.emit(Events.ERROR, error));
	}
});
