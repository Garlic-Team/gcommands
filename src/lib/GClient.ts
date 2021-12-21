import {Client, ClientOptions} from 'discord.js';
import {Plugins} from './managers/PluginManager';
import {Commands} from './managers/CommandManager';
import {Listeners} from './managers/ListenerManager';
import {Components} from './managers/ComponentManager';
import Responses from '../responses.json';
import {registerDirectory} from './util/registerDirectory';
import {registerDirectories} from './util/registerDirectories';

export enum AutoDeferType {
	'EPHEMERAL' = 1,
	'NORMAL' = 2,
}

export interface GClientOptions extends ClientOptions {
	messagePrefix?: string;
	dir?: string;
	dirs?: Array<string>;
	devGuildId?: string;
	cooldown?: string;
	autoDefer?: AutoDeferType;
}

// TODO Add interface for database

export class GClient<Ready extends boolean = boolean> extends Client<Ready> {
	public responses: Record<string, string> = Responses;
	public options: GClientOptions;

	constructor(options: GClientOptions) {
		super(options);

		if (options.dir) registerDirectory(options.dir);
		if (options.dirs) registerDirectories(options.dirs);

		setImmediate(async (): Promise<void> => {
			await Promise.all([
				Plugins.initiate(this),
				Commands.initiate(this),
				Components.initiate(this),
				Listeners.initiate(this),
			]);
		});
	}
}
