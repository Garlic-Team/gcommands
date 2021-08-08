const { resolveString } = require('../util/util');
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
}

module.exports = Command;
