import { Client, ClientOptions } from 'discord.js';
import { PluginHookType, Plugins } from './managers/PluginManager';
import { Listeners } from './managers/ListenerManager';
import Responses from '../responses.json';
import { setImmediate } from 'timers';
import { registerDirectories } from './util/registerDirectories';
import { container } from './structures/Container';
import { Commands } from './managers/CommandManager';
import { Components } from './managers/ComponentManager';

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

		container.client = this;
		Commands.load();
		Components.load();
		Listeners.load();

		setImmediate(async (): Promise<void> => {
			await Plugins.load(PluginHookType.AfterInitialization);
		});
	}

	public async login(token?: string): Promise<string> {
		await Plugins.load(PluginHookType.BeforeLogin);

		const login = await super.login(token);

		await Plugins.load(PluginHookType.AfterLogin);

		return login;
	}
}
