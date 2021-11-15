const { resolveString, isClass } = require('../util/util');
const GError = require('./GError');
const { ArgumentChannelTypes } = require('../util/Constants');

/**
 * The Command class
 */
class Command {
    /**
     * @param {Client} client
     * @param {CommandOptions} options
     * @constructor
    */
    constructor(client, options = {}) {
        /**
         * The client
         * @type {Client}
         */
        this.client = client;

        /**
         * The name
         * @type {string}
         */
        this.name = resolveString(options.name);

        /**
         * The context menu name
         * @type {string}
         */
        this.contextMenuName = resolveString(options.contextMenuName);

        /**
         * The description
         * @type {string}
         */
        this.description = resolveString(options.description);

        /**
         * The cooldown
         * @type {string}
         * @default undefined
         */
        this.cooldown = options.cooldown ? resolveString(options.cooldown) : undefined;

        /**
         * The arguments
         * @type {CommandArgsOption[]}
         */
        this.args = options.args ? options.args.map(arg => {
            const types = arg.channel_types ? !Array.isArray(arg.channel_types) ? [arg.channel_types] : arg.channel_types : [];
            const final = [];

            for (const type of types) {
                final.push(ArgumentChannelTypes[type]);
            }

            if (final.length !== 0) arg.channel_types = final;

            return arg;
        }) : null;

        /**
         * Whether always obtain is enabled
         * @type {boolean}
         */
         this.alwaysObtain = options.alwaysObtain ? Boolean(options.alwaysObtain) : false;

        /**
         * The permissions required by a user
         * @type {string | Array}
         */
        this.userRequiredPermissions = options.userRequiredPermissions;

        /**
         * The roles required by a user
         * @type {string | Array}
         */
        this.userRequiredRoles = options.userRequiredRoles;

        /**
         * The permissions required by the client
         * @type {string | Array}
         */
        this.clientRequiredPermissions = options.clientRequiredPermissions;

        /**
         * The users who can use this command
         * @type {Snowflake | Array}
         */
        this.userOnly = options.userOnly;

        /**
         * The channels in wich this command can get used
         * @type {Snowflake | Array}
         */
        this.channelOnly = options.channelOnly;

        /**
         * Wheter the command can only be used inside a text channel
         * @type {boolean}
         */
        this.channelTextOnly = options.channelTextOnly;

        /**
         * Wheter the command can only be used inside a news channel
         * @type {boolean}
         */
        this.channelNewsOnly = options.channelNewsOnly;

        /**
         * Wheter the command can only be used inside a thread channel
         * @type {boolean}
         */
        this.channelThreadOnly = options.channelThreadOnly;

        /**
         * Wheter the command can be used in DM's
         * @type {boolean}
         */
         this.allowDm = options.allowDm;

        /**
         * The guilds in wich this command can get used
         * @type {Snowflake | Array}
         */
        this.guildOnly = options.guildOnly ? Array.isArray(options.guildOnly) ? options.guildOnly : Array(options.guildOnly) : undefined;

        /**
         * Wheter this command can be only be used inside NSFW channels
         * @type {boolean}
         */
        this.nsfw = options.nsfw;

        /**
         * Wheter this command should be a slash command
         * @type {boolean}
         */
        this.slash = options.slash;

        /**
         * Wheter this command should be a context menu
         * @type {GCommandsOptionsCommandsContext}
         */
        this.context = options.context;

        /**
         * The aliases
         * @type {Array}
         */
        this.aliases = Array.isArray(options.aliases) ? options.aliases : Array(options.aliases);

        /**
         * The category
         * @type {string}
         */
        this.category = options.category ? resolveString(options.category) : undefined;

        /**
         * The usage
         * @type {string}
         */
        this.usage = resolveString(options.usage);

        /**
         * The file path
         * @type {string}
         * @private
         */
        this._path;

        /**
         * Options, ability to add own options
         * @type {Object}
         */
        this._options = options;
    }

    /**
     * Run function
     * @param {CommandRunOptions} options
     */
    async run(options) { // eslint-disable-line no-unused-vars, require-await
        throw new GError('[COMMAND]',`Command ${this.name} doesn't provide a run method!`);
    }

	/**
	 * Reloads the command
     * @returns {boolean}
	 */
    async reload() {
        const cmdPath = this.client.gcommands.get(this.name)._path;

        delete require.cache[require.resolve(cmdPath)];
        this.client.gcommands.delete(this.name);

        let newCommand = await require(cmdPath);

        if (!isClass(newCommand)) throw new GError('[COMMAND]',`Command ${this.name} must be class!`);
        else newCommand = new newCommand(this.client);

        if (!(newCommand instanceof Command)) throw new GError('[COMMAND]',`Command ${newCommand.name} doesnt belong in Commands.`);

        if (newCommand.name !== this.name) throw new GError('[COMMAND]','Command name cannot change.');

        const nglds = newCommand.guildOnly ? Array.isArray(newCommand.guildOnly) ? newCommand.guildOnly : Array(newCommand.guildOnly) : undefined;

        const check1 = nglds.every((x, i) => x === this.guildOnly[i]);
        const check2 = this.guildOnly.every((x, i) => x === nglds[i]);
        if (!check1 || !check2) throw new GError('[COMMAND]','Command guildOnly cannot change.');

        newCommand._path = cmdPath;
        this.client.gcommands.set(newCommand.name, newCommand);
        return true;
    }
}

module.exports = Command;
