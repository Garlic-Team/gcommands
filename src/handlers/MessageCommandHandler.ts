import {Collection, Message} from 'discord.js';
import {GClient} from '../lib/GClient';
import {CommandContext} from '../lib/structures/CommandContext';
import {CommandType} from '../lib/structures/Command';
import {ArgumentType} from '../lib/arguments/Argument';
import {Commands} from '../lib/managers/CommandManager';
import {Handlers} from '../lib/managers/HandlerManager';
import Logger from 'js-logger';

const cooldowns = new Collection<string, Collection<string, number>>();

export async function MessageCommandHandler(message: Message, commandName: string, args: Array<string> | Array<object>) {
	const client = message.client as GClient;

	const command = Commands.get(commandName);
	if (!command) return message.reply({
		content: client.responses.NOT_FOUND
	});

	if (!command.type.includes(CommandType.MESSAGE)) return;

	if (command.cooldown) {
		const cooldown = Handlers.cooldownHandler(message.author.id, command, cooldowns);
		if (cooldown) return message.reply({
			content: client.responses.COOLDOWN.replace('{time}', String(cooldown)).replace('{name}', command.name + ' command')
		});
	}

	args = args.map((arg, i) => new Object({
		name: command.arguments[i].name,
		type: command.arguments[i].type,
		choices: command.arguments[i].choices,
		options: [],
		value: arg
	}));

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	if (args[0]?.type === (ArgumentType.SUB_COMMAND_GROUP || ArgumentType.SUB_COMMAND)) args[0].options = args.splice(1);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	if (args[0]?.type === ArgumentType.SUB_COMMAND_GROUP && args[0]?.options[0]?.type === ArgumentType.SUB_COMMAND) args[0].options[0].options = args[0].options.splice(1);

	const ctx = CommandContext.createWithMessage(message, command, args);

	if (!await command.inhibit(ctx)) return;
	await Promise.resolve(command.run(ctx)).catch(async (error) => {
		Logger.error(error.code, error.message);
		Logger.trace(error.trace);
		const errorReply = () => ctx.reply(client.responses.ERROR);
		if (typeof command.onError === 'function') await Promise.resolve(command.onError(ctx, error)).catch(async () => await errorReply());
		else await errorReply();
	});
}
