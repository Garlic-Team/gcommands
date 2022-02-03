import { Collection } from 'discord.js';
import { Command } from '../structures/Command';
import Logger from 'js-logger';
import { Plugins } from './PluginManager';

export class CommandManager extends Collection<string, Command> {
	public register(command: any): CommandManager {
		if (command instanceof Command) {
			if (this.has(command.name) && !this.get(command.name)?.reloading) Logger.warn('Overriding command', command.name);
			if (Plugins.currentlyLoading) command.owner = Plugins.currentlyLoading;
			this.set(command.name, command);
			Logger.debug('Registered command', command.name, command.owner ? `(by plugin ${command.owner})` : '');
		} else Logger.warn('Command must be a instance of Command');

		return this;
	}
}

export const Commands = new CommandManager();
