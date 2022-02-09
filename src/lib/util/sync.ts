import type { GClient } from '../GClient';
import type { Command } from '../structures/Command';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import Logger from 'js-logger';
import { setTimeout } from 'node:timers';
import { Commands } from '../managers/CommandManager';

async function _sync(client: GClient, commands: Array<Command>, guildId?: string) {
	const rest = new REST({ version: '9' }).setToken(client.token as string);

	await rest
		.put(
			guildId ? Routes.applicationGuildCommands(client.user?.id, guildId) : Routes.applicationCommands(client.user?.id),
			{
				body: commands.flatMap((command) => command.toJSON()),
			},
		)
		.catch((error) => {
			if (error.status === 429) setTimeout(() => _sync(client, commands, guildId), error.data.retry_after * 1000);
			else {
				Logger.error(typeof error.code !== 'undefined' ? error.code : '', error.message);
				if (error.stack) Logger.trace(error.stack);
			}
		});
}

export async function sync(client: GClient) {
	if (Commands.size === 0) return;

	const [guild, global] = Commands.partition((command) => typeof command.guildId === 'string');

	const guildIds = new Set(guild.map((c) => c.guildId));
	for await (const guildId of guildIds) {
		const commands = guild.filter((item) => item.guildId === guildId);
		await _sync(client, [...commands.values()], guildId);
	}
	await _sync(client, [...global.values()]);
}
