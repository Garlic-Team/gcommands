import { setImmediate } from 'node:timers';
import { Client, ClientOptions, Snowflake } from 'discord.js';
import { Commands } from './managers/CommandManager';
import { Components } from './managers/ComponentManager';
import { Listeners } from './managers/ListenerManager';
import { Plugins } from './managers/PluginManager';
import { registerDirectories } from './util/registerDirectories';
import Responses from '../responses.json';

/**
 * Enum for auto defer feature.
 * Automatic defer if bot does not reply within more than 3s
 * * EPHEMERAL
 * * NORMAL
 * * UPDATE
 */
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

/**
 * Options for the GClient.
 * @extends {ClientOptions}
 */
export interface GClientOptions extends ClientOptions {
	/**
	 * Support for message commands.
	 * @type {boolean}
	 */
	messageSupport?: boolean;
	/**
	 * Prefix for message commands
	 * @requires {@link GClientOptions.messageSupport} to be enabled
	 * @type {string}
	 */
	messagePrefix?: string;
	/**
	 * Whether to send a message for an unknown command.
	 * @type {boolean}
	 */
	unknownCommandMessage?: boolean;
	/**
	 * Array of all folders to be loaded by GCommands.
	 *
	 * GCommands will check all the files in each folder for these classes:
	 * * Command
	 * * Listener
	 * * Component
	 *
	 * @type {string[]}
	 * @example
	 * ```typescript
	 * new GClient({
	 * 		dirs: [
	 * 			join(__dirname, 'commands'),
	 * 			join(__dirname, 'events'),
	 * 			join(__dirname, 'components'),
	 * 		]
	 * })
	 * ```
	 */
	dirs?: Array<string>;
	/**
	 * The database to be used in the project.
	 *
	 * This option is only for easier access and is not used by GCommands.
	 *
	 * @type {any}
	 */
	database?: any;
	/**
	 * The guild id that will serve as the development server for your application.
	 *
	 * If this option is present, all slash commands will be registered only for the specified guild id.
	 *
	 * @type {Snowflake}
	 */
	devGuildId?: Snowflake;
}

/**
 * The base {@link Client} that GCommands uses.
 *
 * @see {@link GClientOptions} for all available options for GClient.
 *
 * @extends {Client}
 */
export class GClient<Ready extends boolean = boolean> extends Client<Ready> {
	/**
	 * Object of all basic messages if a problem occurs.
	 *
	 * However, you can customize these messages using the
	 * [@gcommands/plugin-language](https://github.com/Garlic-Team/gcommands-addons/tree/master/packages/plugin-language)
	 * plugin.
	 *
	 * @see {@link Responses}
	 */
	public responses: Record<string, string> = Responses;

	/**
	 * Object of all provided options.
	 */
	public declare options: GClientOptions;

	constructor(options: GClientOptions) {
		super(options);

		if (options.dirs) registerDirectories(options.dirs);
		if (this.options.database) {
			if (typeof this.options.database.init === 'function')
				this.options.database.init();
		}

		// Load all managers before login.
		setImmediate(async (): Promise<void> => {
			await Promise.all([
				Plugins.initiate(this),
				Commands.initiate(this),
				Components.initiate(this),
				Listeners.initiate(this),
			]);
		});
	}

	/**
	 * The method that returns original types from {@link GClientOptions.database}
	 * @param {any} _ Prototype of your class to get types.
	 * @returns {Database}
	 * @example TypeScript example
	 * ```typescript
	 * import { MongoDBProvider } from 'gcommands/dist/providers/MongoDBProvider';
	 *
	 * const client = new GClient({
	 * 		..settings,
	 * 		database: new MongoDBProvider('mongodb://localhost:27017/database')
	 * })
	 *
	 * const db = client.getDatabase(MongoDBProvider.prototype);
	 * // Types working in `db`
	 * ```
	 * @example JavaScript example
	 * ```javascript
	 * const { MongoDBProvider } = require('gcommands/dist/providers/MongoDBProvider');
	 *
	 * const client = new GClient({
	 * 		..settings,
	 * 		database: new MongoDBProvider('mongodb://localhost:27017/database')
	 * })
	 *
	 * const db = client.getDatabase(MongoDBProvider.prototype);
	 * // Types working in `db`
	 * ```
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public getDatabase<Database>(_?: Database): Database {
		return this.options.database;
	}
}
