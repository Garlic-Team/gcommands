const { resolveString, isClass } = require('../util/util');
const Color = require('../structures/Color');

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
         * @type {String | Array}
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
         * @type {Number}
         * @deprecated use args
         */
        this.minArgs = Number(options.minArgs);

        /**
         * UserRequiredPermissions
         * @type {String | Array}
         */
        this.userRequiredPermissions = options.userRequiredPermissions;

        /**
         * UserRequiredRoles
         * @type {String | Array}
         */
        this.userRequiredRoles = options.userRequiredRoles;

        /**
         * ClientRequiredPermissions
         * @type {String | Array}
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
         * @type {Boolean}
         */
        this.channelTextOnly = options.channelTextOnly ? Boolean(options.channelTextOnly) : null;

        /**
         * ChannelNewsOnly
         * @type {Boolean}
         */
        this.channelNewsOnly = options.channelNewsOnly ? Boolean(options.channelNewsOnly) : null;

        /**
         * ChannelThreadOnly
         * @type {Boolean}
         */
        this.channelThreadOnly = options.channelThreadOnly ? Boolean(options.channelThreadOnly) : null;

        /**
         * GuildOnly
         * @type {Snowflake | Array}
         */
        this.guildOnly = options.guildOnly;

        /**
         * Nsfw
         * @type {Boolean}
         */
        this.nsfw = options.nsfw ? Boolean(options.nsfw) : null;

        /**
         * Slash
         * @type {Boolean}
         */
        this.slash = options.slash ? Boolean(options.slash) : null;

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
    }

    /**
     * Run function
     * @param {CommandRunOptions} options
     * @param {Array} arrayArgs
     * @param {Object} objectArgs
     */
    async run(options, arrayArgs, objectArgs) { // eslint-disable-line no-unused-vars, require-await
        return console.log(new Color(`&d[GCommands] &cCommand ${this.name} doesn't provide a run method!`).getText());
    }

	/**
	 * Reloads the command
	 */
    async reload() {
        let cmdPath = this.client.gcommands.get(this.name)._path;

        delete require.cache[require.resolve(cmdPath)];
        this.client.gcommands.delete(this.name);

        let newCommand = await require(cmdPath);

        if (!isClass(newCommand)) return console.log(new Color('&d[GCommands] &cThe command must be class!').getText());
        else newCommand = new newCommand(this.client);

        if (!(newCommand instanceof Command)) return console.log(new Color(`&d[GCommands] &cCommand ${newCommand.name} doesnt belong in Commands.`).getText());

        if (newCommand.name !== this.name) return console.log(new Color('&d[GCommands] &cCommand name cannot change.').getText());
        if (newCommand.guildOnly !== this.guildOnly) return console.log(new Color('&d[GCommands] &cCommand guildOnly cannot change.').getText());

        newCommand._path = cmdPath;
        this.client.gcommands.set(newCommand.name, newCommand);
        return true;
    }
}

module.exports = Command;
