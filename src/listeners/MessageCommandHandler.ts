import type { Message } from 'discord.js';
import type { GClient, GClientMessagePrefix } from '../lib/GClient';
import { Handlers } from '../lib/managers/HandlerManager';
import { Listener } from '../lib/structures/Listener';
import { Logger } from '../lib/util/logger/Logger';

const getMentionPrefix = (message: Message): string | null => {
	if (message.content.length < 20 || !message.content.startsWith('<@'))
		return null;

	const mention = message.content
		.split(' ')[0]
		.match(new RegExp(`^<@!?(${message.client.user.id})>`));

	return mention?.[0] ?? null;
};

const getPrefix = (
	message: Message,
	prefixes: GClientMessagePrefix,
): string | null => {
	const mention = getMentionPrefix(message);
	if (mention) return mention;

	if (typeof prefixes === 'string')
		return message.content.startsWith(prefixes) ? prefixes : null;

	return prefixes.find(prefix => message.content.startsWith(prefix)) ?? null;
};

new Listener({
	event: 'messageCreate',
	name: 'gcommands-messageCommandHandler',
	run: async (message: Message): Promise<void> => {
		const client = message.client as GClient;

		if (!client.options.messageSupport) return;

		const prefix = getPrefix(
			message,
			typeof client.options.messagePrefix === 'function'
				? await client.options.messagePrefix(message)
				: client.options.messagePrefix,
		);

		if (!prefix || !message.content.startsWith(prefix)) return;

		const [commandName, ...args] = message.content
			.slice(prefix?.length)
			.trim()
			.split(/ +/g);
		if (commandName.length === 0) return;

		await Promise.resolve(
			Handlers.messageCommandHandler(message, commandName, args),
		).catch(error => {
			Logger.error(
				typeof error.code !== 'undefined' ? error.code : '',
				error.message,
			);
			if (error.stack) Logger.trace(error.stack);
		});
	},
});
