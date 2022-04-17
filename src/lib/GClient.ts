import { setImmediate } from 'node:timers';
import { Client, ClientOptions } from 'discord.js';
import { Commands } from './managers/CommandManager';
import { Components } from './managers/ComponentManager';
import { Listeners } from './managers/ListenerManager';
import { Plugins } from './managers/PluginManager';
import { registerDirectories } from './util/registerDirectories';
import Responses from '../responses.json';

export enum AutoDeferType {
	/**
	 * @example interaction.deferReply({ ephemeral: true })
	 */
	'EPHEMERAL' = 1,
	/**
	 * @example interaction.deferReply()
	 */
	'NORMAL' = 2,
	/**
	 * @example interaction.deferUpdate()
	 */
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
			if (typeof this.options.database.init === 'function')
				this.options.database.init();
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
