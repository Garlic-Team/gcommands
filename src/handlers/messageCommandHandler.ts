import {Collection, Message} from 'discord.js';
import {GClient} from '../lib/GClient';
import {Events} from '../lib/util/Events';
import {CommandContext} from '../lib/structures/CommandContext';
import { CommandType } from '../lib/structures/Command';

const cooldowns = new Collection<string, Collection<string, number>>();

export async function messageCommandHandler(message: Message, commandName: string, args: Array<string> | Array<object>) {
	const command = GClient.gcommands.get(commandName);
	if (!command) return message.reply({
		content: GClient.responses.NOT_FOUND
	});

	if (!command.type.includes(CommandType.MESSAGE)) return;

	if (command.cooldown) {
		const cooldown = GClient.ghandlers.cooldownHandler(message.author.id, command, cooldowns);
		if (cooldown) return message.reply({
			content: GClient.responses.COOLDOWN.replace('{time}', String(cooldown)).replace('{name}', command.name + ' command')
		});
	}

	args = args.map((arg, i) => {
		return {
			name: command.arguments[i].name,
			type: command.arguments[i].type,
			choices: command.arguments[i].choices,
			value: arg
		}
	});

	const ctx = CommandContext.createWithMessage(message, args, command);

	if (!await command.inhibit(ctx)) return;
	await Promise.resolve(command.run(ctx)).catch(async (error) => {
		ctx.client.emit(Events.ERROR, error);
		const errorReply = () => ctx.reply({
			content: GClient.responses.ERROR,
			ephemeral: true,
		});
		if (typeof command.onError === 'function') await Promise.resolve(command.onError(ctx, error)).catch(async () => await errorReply());
		else await errorReply();
	});
}
