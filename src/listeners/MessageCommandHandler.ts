import {Listener} from '../lib/structures/Listener';
import {GClient} from '../lib/GClient';
import {Message} from 'discord.js';
import {Handlers} from '../lib/managers/HandlerManager';
import Logger from 'js-logger';

new Listener('messageCreate', {
	name: 'gcommands-messageCommandHandler',
	run: async (message: Message): Promise<void> => {
		const client = message.client as GClient;

		const mention = message.content.split(' ')[0].match(new RegExp(`^<@!?(${client.user.id})>`));

		const prefix = mention?.[0] || client.options?.messagePrefix;

		if (!message.content.startsWith(prefix)) return;

		const [commandName, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
		if (commandName.length === 0) return;

		await Promise.resolve(Handlers.messageCommandHandler(message, commandName, args)).catch(error => {
			Logger.error(error.code, error.message);
			if (error.stack) Logger.trace(error.stack);
		});
	}
});
