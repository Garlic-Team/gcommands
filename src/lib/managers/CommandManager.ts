import {Collection} from 'discord.js';
import {Command} from '../structures/Command';
import {GClient} from '../GClient';
import {Events} from '../util/Events';

export class CommandManager extends Collection<string, Command> {
	private client: GClient;

	public register(command: any): CommandManager {
		if (command instanceof Command) {
			if (this.client) command.initialize(this.client);
			if (this.has(command.name) && this.client) this.client.emit(Events.WARN, `Overwriting command ${command.name}`);
			this.set(command.name, command);
		} else throw new TypeError('Command does not implement or extend the Command class');

		if (this.client) this.client.emit(Events.COMMAND_REGISTER, command);

		return this;
	}

	public unregister(commandName: string): Command | undefined {
		const command = this.get(commandName);
		if (command) {
			this.delete(commandName);
			this.client.emit(Events.COMMAND_UNREGISTER, command);
		}

		return command;
	}

	public async initiate(client: GClient): Promise<void> {
		this.client = client;
		this.forEach(command => command.initialize(client));
	}
}
