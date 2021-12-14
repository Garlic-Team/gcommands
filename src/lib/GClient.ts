import {Client, ClientOptions} from 'discord.js';
import {PluginManager, PluginType} from './managers/PluginManager';
import {CommandManager} from './managers/CommandManager';
import {Command} from './structures/Command';
import {Plugin} from './structures/Plugin';
import {Listener} from './structures/Listener';
import {Component} from './structures/Component';
import {ListenerManager} from './managers/ListenerManager';
import {ComponentManager} from './managers/ComponentManager';
import {DirectoryLoader} from './loaders/DirectoryLoader';
import {Events} from './util/Events';
import Responses from '../responses.json';
import {HandlerManager} from './managers/HandlerManager';

export interface GClientOptions extends ClientOptions {
	messagePrefix?: string;
	dir?: string;
	dirs?: Array<string>;
	devGuildId?: string;
	cooldown?: string;
}

// TODO Add interface for database

export class GClient<Ready extends boolean = boolean> extends Client<Ready> {
	public static ghandlers: HandlerManager = new HandlerManager();
	public static gplugins: PluginManager = new PluginManager();
	public static gcommands: CommandManager = new CommandManager();
	public static gcomponents: ComponentManager = new ComponentManager();
	public static glisteners: ListenerManager = new ListenerManager();
	public static responses: Record<string, string> = Responses;
	public static options: GClientOptions;

	constructor(options: GClientOptions) {
		super(options);
		this.options = options;

		if (options.dir) this.registerDirectory(options.dir);
		if (options.dirs) this.registerDirectories(options.dirs);

		setImmediate(async (): Promise<void> => {
			await Promise.all([
				this.gplugins.initiate(this),
				this.gplugins.load(PluginType.BEFORE_INITIALIZATION),
				this.glisteners.initiate(this),
				this.gcommands.initiate(this),
				this.gcomponents.initiate(this),
			]);

			this.gplugins.forEach(plugin => this.emit(Events.PLUGIN_REGISTER, plugin));
			this.glisteners.forEach(listener => this.emit(Events.LISTENER_REGISTER, listener));
			this.gcommands.forEach(command => this.emit(Events.COMMAND_REGISTER, command));
			this.gcomponents.forEach(component => this.emit(Events.COMPONENT_REGISTER, component));
		});
	}

	public static async registerDirectory(path: string): Promise<void> {
		await DirectoryLoader(path, {importOnly: true});
	}

	public static async registerDirectories(paths: Array<string>): Promise<void> {
		for await(const path of paths) {
			await DirectoryLoader(path, {importOnly: true});
		}
	}

	public static setDevServer(guildId: string): void {
		this.options.devGuildId = guildId;
	}

	public static setResponses(responses: Record<string, string>): void {
		this.responses = responses;
	}

	public static setCooldown(cooldown: string): void {
		this.options.cooldown = cooldown;
	}

	public static setMessagePrefix(prefix: string): void {
		this.options.messagePrefix = prefix;
	}

	public async login(token?: string): Promise<string> {
		await this.gplugins.load(PluginType.BEFORE_LOGIN);

		const login = await super.login(token);

		await this.gplugins.load(PluginType.AFTER_LOGIN);

		return login;
	}

	public ghandlers: HandlerManager = GClient.ghandlers;
	public gplugins: PluginManager = GClient.gplugins;
	public gcommands: CommandManager = GClient.gcommands;
	public gcomponents: ComponentManager = GClient.gcomponents;
	public glisteners: ListenerManager = GClient.glisteners;
	public responses = GClient.responses;
	public options: GClientOptions = GClient.options;
	public registerDirectory = GClient.registerDirectory;
	public registerDirectories = GClient.registerDirectories;
	public setResponses = GClient.setResponses;
	public setDevServer = GClient.setDevServer;
	public setCooldown = GClient.setCooldown;
	public setMessagePrefix = GClient.setMessagePrefix;
}

declare module 'discord.js' {
	interface ClientEvents {
		// Commands
		commandRegister: [Command];
		commandUnregister: [Command];
		preCommandRun: [Interaction: CommandInteraction];

		// Components
		componentRegister: [Component];
		componentUnregister: [Component];
		preComponentRun: [Interaction: MessageComponentInteraction];

		// Listeners
		listenerRegister: [Listener<any>];
		listenerLoaded: [Listener<any>];

		// Plugins
		pluginRegister: [Plugin];
	}
}
