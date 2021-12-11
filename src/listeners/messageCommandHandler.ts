import {Listener} from '../lib/structures/Listener';
import {GClient} from '../lib/GClient';
import {Events} from '../lib/util/Events';
import {Message} from 'discord.js';

new Listener('messageCreate', {
	name: 'gcommands-messageCommandHandler',
	run: async (message: Message): Promise<void> => {
        const mention = message.content.split(' ')[0].match(new RegExp(`^<@!?(${message.client.user.id})>`));

        const prefix = mention?.[0] ?? GClient.messagePrefix;

		if (!message.content.startsWith(prefix)) return;

        let [commandName, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
        if (commandName.length === 0) return;

        await GClient.ghandlers.messageCommandHandler(message, commandName, args).catch(error => message.client.emit(Events.ERROR, error));
	}
});
