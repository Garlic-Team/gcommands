const { resolveString, isClass } = require('../util/util');
const GError = require('../structures/GError');

/**
 * The Command class
 */
class Command {
    /**
     * Creates new Command instance
     * @param {Client} client
     * @param {CommandOptions} options
    */
    constructor(client, options = {}) {
        /**
         * Client
         * @type {Client}
         */
        this.client = client;

        /**
         * Name
         * @type {string}
         */
        this.name = resolveString(options.name);

        /**
         * Description
         * @type {string}
         */
        this.description = resolveString(options.description);

        /**
         * Cooldown
         * @type {string}
         */
        this.cooldown = resolveString(options.cooldown);

        /**
         * ExpectedArgs
         * @type {string | Array}
         * @deprecated
         */
        this.expectedArgs = options.expectedArgs;

        /**
         * Args
         * @type {CommandArgsOption[]}
         */
        this.args = options.args;

        /**
         * MinArgs
         * @type {number}
         * @deprecated use args
         */
        this.minArgs = Number(options.minArgs);

        /**
         * UserRequiredPermissions
         * @type {string | Array}
         */
        this.userRequiredPermissions = options.userRequiredPermissions;

        /**
         * UserRequiredRoles
         * @type {string | Array}
         */
        this.userRequiredRoles = options.userRequiredRoles;

        /**
         * ClientRequiredPermissions
         * @type {string | Array}
         */
        this.clientRequiredPermissions = options.clientRequiredPermissions;

        /**
         * UserOnly
         * @type {Snowflake | Array}
         */
        this.userOnly = options.userOnly;

        /**
         * ChannelOnly
         * @type {Snowflake | Array}
         */
        this.channelOnly = options.channelOnly;

        /**
         * ChannelTextOnly
         * @type {boolean}
         */
        this.channelTextOnly = options.channelTextOnly;

        /**
         * ChannelNewsOnly
         * @type {boolean}
         */
        this.channelNewsOnly = options.channelNewsOnly;

        /**
         * ChannelThreadOnly
         * @type {boolean}
         */
        this.channelThreadOnly = options.channelThreadOnly;

        /**
         * GuildOnly
         * @type {Snowflake | Array}
         */
        this.guildOnly = options.guildOnly;

        /**
         * Nsfw
         * @type {boolean}
         */
        this.nsfw = options.nsfw;

        /**
         * Slash
         * @type {boolean}
         */
        this.slash = options.slash;

        /**
         * Context
         * @type {GCommandsOptionsCommandsContext}
         */
        this.context = options.context;

        /**
         * Aliases
         * @type {Array}
         */
        this.aliases = Array.isArray(options.aliases) ? options.aliases : Array(options.aliases);

        /**
         * Category
         * @type {string}
         */
        this.category = resolveString(options.category);

        /**
         * Usage
         * @type {string}
         */
        this.usage = resolveString(options.usage);

        /**
         * Command Path
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
     * @param {Array} arrayArgs
     * @param {Object} objectArgs
     */
    async run(options, arrayArgs, objectArgs) { // eslint-disable-line no-unused-vars, require-await
        throw new GError('[COMMAND]',`Command ${this.name} doesn't provide a run method!`);
    }

	/**
	 * Reloads the command
	 */
    async reload() {
        let cmdPath = this.client.gcommands.get(this.name)._path;

        delete require.cache[require.resolve(cmdPath)];
        this.client.gcommands.delete(this.name);

        let newCommand = await require(cmdPath);

        if (!isClass(newCommand)) throw new GError('[COMMAND]',`Command ${this.name} must be class!`);
        else newCommand = new newCommand(this.client);

        if (!(newCommand instanceof Command)) throw new GError('[COMMAND]',`Command ${newCommand.name} doesnt belong in Commands.`);

        if (newCommand.name !== this.name) throw new GError('[COMMAND]','Command name cannot change.');
        if (newCommand.guildOnly !== this.guildOnly) throw new GError('[COMMAND]','Command guildOnly cannot change.');

        newCommand._path = cmdPath;
        this.client.gcommands.set(newCommand.name, newCommand);
        return true;
    }
}

module.exports = Command;
