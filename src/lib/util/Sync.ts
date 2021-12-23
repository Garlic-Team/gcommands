import {GClient} from '../GClient';
import {Command, CommandArgument, CommandType} from '../structures/Command';
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import {Argument, ArgumentType} from '../arguments/Argument';
import Logger from 'js-logger';
import {Commands} from '../managers/CommandManager';

function ResolveArgumentOptions(options): any {
	for (const [ key, value ] of Object.entries(options)) {
		const option = key.match(/[A-Z]/g)?.[0] ? key.replace(key.match(/[A-Z]/g)[0], `_${key.match(/[A-Z]/g)[0].toLowerCase()}`) : key;

		if (option !== key) {
			delete options[key];

			options[option] = value;
		}
	}

	return options;
}

function ResolveArgument(argument: CommandArgument | Argument): any {
	if (argument.type === (ArgumentType.SUB_COMMAND || ArgumentType.SUB_COMMAND_GROUP)) {
		return argument.options ? {
			...argument,
			options: argument.options.map(a => ResolveArgument(a)),
		} : argument;
	}

	return {
		...ResolveArgumentOptions(argument),
		autocomplete: typeof argument.run === 'function',
	};
}

async function _sync(client: GClient, commands: Array<Command>, guildId?: string) {
	const rest = new REST({version: '9'}).setToken(client.token);

	await rest.put(
		guildId ? Routes.applicationGuildCommands(client.user.id, guildId) : Routes.applicationCommands(client.user.id),
		{
			body: commands.flatMap(command => {
				return command.type.filter(type => type !== CommandType.MESSAGE).map(type => {
					if (type === CommandType.SLASH) return {
						name: command.name,
						description: command.description,
						options: (Array.isArray(command.arguments) && command.arguments[0]) ? command.arguments.map(argument => ResolveArgument(argument)) : undefined,
						type: type
					};
					else return {
						name: command.name,
						type: type,
					};
				});
			})
		},
	).catch(error => {
		if (error.status === 429) setTimeout(() => _sync(client, commands, guildId), error.data.retry_after * 1000);
		else {
			Logger.error(error.code, error.message);
			if (error.stack) Logger.trace(error.stack);
		}
	});
}

export async function Sync(client: GClient) {
	if (Commands.size === 0) return;

	const [guild, global] = Commands.partition(command => typeof command.guildId === 'string');

	const guildIds = new Set(guild.map(c => c.guildId));
	for await(const guildId of guildIds) {
		const commands = guild.filter(item => item.guildId === guildId);
		await _sync(client, [...commands.values()], guildId);
	}
	await _sync(client, [...global.values()]);
}
