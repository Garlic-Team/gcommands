import {GClient} from '../GClient';
import {Command, CommandType} from '../structures/Command';
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import {Events} from './Events';

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
						options: command.arguments,
						type: type,
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
		else client.emit(Events.ERROR, error);
	});
}

export async function Sync(client: GClient) {
	if (client.gcommands.size === 0) return;

	const [guild, global] = client.gcommands.partition(command => typeof command.guildId === 'string');

	const guildIds = new Set(guild.map(c => c.guildId));
	for await(const guildId of guildIds) {
		const commands = guild.filter(item => item.guildId === guildId);
		await _sync(client, [...commands.values()], guildId);
	}
	await _sync(client, [...global.values()]);
}
