import { Collection } from 'discord.js';
import { Command } from '../structures/Command';
import { Events, Logger } from '../util/logger/Logger';
import { container } from '../structures/Container';

export class CommandManager extends Collection<string, Command> {
	public register(command: any): CommandManager {
		if (command instanceof Command) {
			if (this.has(command.name) && !this.get(command.name)?.reloading) Logger.warn('Overriding command', command.name);
			if (container.client) command.load();
			this.set(command.name, command);
			Logger.emit(Events.COMMAND_REGISTERED, command);
			Logger.debug('Registered command', command.name);
		} else Logger.warn('Command must be a instance of Command');

		return this;
	}

	public unregister(commandName: string): Command | undefined {
		const command = this.get(commandName);
		if (command) {
			this.delete(commandName);
			Logger.emit(Events.COMMAND_UNREGISTERED, command);
			Logger.debug('Unregistered command', command.name);
		}

		return command;
	}

	public load() {
		this.forEach((command) => command.load());
	}
}

export const Commands = new CommandManager();
