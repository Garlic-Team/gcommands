import { setImmediate } from 'node:timers';
import {
	Awaitable,
	Client,
	ClientOptions,
	IntentsBitField,
	Message,
	Snowflake,
} from 'discord.js';
import { Commands } from './managers/CommandManager';
import { Components } from './managers/ComponentManager';
import { Listeners } from './managers/ListenerManager';
import { Plugins } from './managers/PluginManager';
import { registerDirectories } from './util/registerDirectories';
import Responses from '../responses.json';

/**
 * A valid prefix for GCommands.
 * * `string`: for single prefix, like `'?'`.
 * * `string[]`: an array of prefixes, like `['?', '!']`.
 * * `null`: disabled prefix, only mention works.
 */
export type GClientMessagePrefix = string | string[] | null;

/**
 * Enum for the auto defer feature.
 *
 * Automatically defers interaction if application doesn't respond in 3s
 * * EPHEMERAL
 * * NORMAL
 * * UPDATE
 */
export enum AutoDeferType {
	/**
	 * Automatically deferReply interaction (+ ephemeral) if application doesn't respond in 3s
	 * @example interaction.deferReply({ ephemeral: true })
	 * @type {number}
	 */
	'EPHEMERAL' = 1,
	/**
	 * Automatically deferReply interaction if application doesn't respond in 3s
	 * @example interaction.deferReply()
	 * @type {number}
	 */
	'NORMAL' = 2,
	/**
	 * Automatically deferUpdate interaction if application doesn't respond in 3s
	 * @example interaction.deferUpdate()
	 * @type {number}
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
	 */
	messagePrefix?:
		| ((message: Message) => Awaitable<GClientMessagePrefix>)
		| GClientMessagePrefix;
	/**
	 * Whether to send a message for an unknown message command.
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
	 * However, if the command contains the `guildId` option, it is used instead of this option.
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
	 * Object of the default responses that GCommands uses for auto responding in the case of something happening.
	 *
	 * You can customize these messages using the
	 * [@gcommands/plugin-language](https://github.com/Garlic-Team/gcommands-addons/tree/master/packages/plugin-language)
	 * plugin.
	 *
	 * @see {@link Responses}
	 */
	public responses: Record<string, string> = Responses;

	/**
	 * Object of all provided options.
	 * @see {@link GClientOptions}
	 */
	public declare options: Omit<GClientOptions, 'intents'> & {
		intents: IntentsBitField;
	};

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
	 * The method that returns the database option provided in {@link GClientOptions}
	 * @param {any} _ Used for typings
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
	 * // returns <MongoDBProvider>
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
	 * // returns <MongoDBProvider>
	 * ```
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public getDatabase<Database>(_?: Database): Database {
		return this.options.database;
	}
}
