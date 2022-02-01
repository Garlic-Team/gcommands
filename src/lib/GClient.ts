import { Client, ClientOptions } from 'discord.js';
import { Plugins } from './managers/PluginManager';
import { Commands } from './managers/CommandManager';
import { Listeners } from './managers/ListenerManager';
import { Components } from './managers/ComponentManager';
import Responses from '../responses.json';
import { setImmediate } from 'timers';
import { registerDirectories } from './util/registerDirectories';

export enum AutoDeferType {
	'EPHEMERAL' = 1,
	'NORMAL' = 2,
	'UPDATE' = 3,
}

export interface GClientOptions extends ClientOptions {
	messageSupport?: boolean;
	messagePrefix?: string;
	unknownCommandMessage?: boolean;
	dirs?: Array<string>;
	database?: any;
	devGuildId?: string;
}

export class GClient<Ready extends boolean = boolean> extends Client<Ready> {
	public responses: Record<string, string> = Responses;
	public declare options: GClientOptions;

	constructor(options: GClientOptions) {
		super(options);

		if (options.dirs) registerDirectories(options.dirs);
		if (this.options.database) {
			if (typeof this.options.database.init === 'function') this.options.database.init();
		}

		setImmediate(async (): Promise<void> => {
			await Promise.all([
				Plugins.initiate(this),
				Commands.initiate(this),
				Components.initiate(this),
				Listeners.initiate(this),
			]);
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public getDatabase<Database>(_?: Database): Database {
		return this.options.database;
	}
}
