import { Collection } from 'discord.js';
import { Command } from '../structures/Command';
import type { GClient } from '../GClient';
import Logger from 'js-logger';
import { Plugins } from './PluginManager';

export class CommandManager extends Collection<string, Command> {
	private client: GClient;

	public register(command: any): CommandManager {
		if (command instanceof Command) {
			if (this.has(command.name) && !this.get(command.name)?.reloading) Logger.warn('Overriding command', command.name);
			if (this.client) command.initialize(this.client);
			if (Plugins.currentlyLoading) command.owner = Plugins.currentlyLoading;
			this.set(command.name, command);
			Logger.debug('Registered command', command.name, command.owner ? `(by plugin ${command.owner})` : '');
		} else Logger.warn('Command must be a instance of Command');

		return this;
	}

	public unregister(commandName: string): Command | undefined {
		const command = this.get(commandName);
		if (command) {
			this.delete(commandName);
			Logger.debug('Unregistered command', command.name);
		}

		return command;
	}

	public async initiate(client: GClient): Promise<void> {
		this.client = client;
		this.forEach(command => command.initialize(client));
	}
}

export const Commands = new CommandManager();
