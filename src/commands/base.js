const { Snowflake } = require('discord.js');
const { resolveString } = require('../util/util');
const Color = require('../structures/Color');

/**
 * The Command class
 */
class Command {

    /**
     * Creates new Command instance
     * @param {Client} client
     * @param {Object} options 
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
         * expectedArgs
         * @type {String | Array}
         * @deprecated
         */
        this.expectedArgs = options.expectedArgs;

        /**
         * args
         * @type {String | Array}
         */
        this.args = options.args;

        /**
         * minArgs
         * @type {Number}
         */
        this.minArgs = Number(options.minArgs);

        /**
         * userRequiredPermissions
         * @type {String | Array}
         */
        this.userRequiredPermissions = options.userRequiredPermissions;

        /**
         * userRequiredRoles
         * @type {String | Array}
         */
        this.userRequiredRoles = options.userRequiredRoles;

        /**
         * clientRequiredPermissions
         * @type {String | Array}
         */
        this.clientRequiredPermissions = options.clientRequiredPermissions;

        /**
         * userOnly
         * @type {Snowflake | Array}
         */
        this.userOnly = options.userOnly;

        /**
         * channelOnly
         * @type {Snowflake | Array}
         */
        this.channelOnly = options.channelOnly;

        /**
         * channelTextOnly
         * @type {Boolean}
         */
        this.channelTextOnly = Boolean(options.channelTextOnly);

        /**
         * channelNewsOnly
         * @type {Boolean}
         */
         this.channelNewsOnly = Boolean(options.channelNewsOnly);

        /**
         * guildOnly
         * @type {Snowflake | Array}
         */
        this.guildOnly = options.guildOnly;    

        /**
         * nsfw
         * @type {Boolean}
         */
        this.nsfw = Boolean(options.nfsw);

        /**
         * slash
         * @type {Boolean}
         */
        this.slash = Boolean(options.slash);

        /**
         * aliases
         * @type {Array}
         */
        this.aliases = Array.isArray(options.aliases) ? options.aliases : Array(options.aliases);

        /**
         * category
         * @type {string}
         */
        this.category = resolveString(options.category);
    }

    /**
     * run function
     * @param {CommandRunOptions} options 
     * @param {Array} arrayArgs 
     * @param {Array | Object} objectArgs 
     */
    async run({client, interaction, member, message, guild, channel, respond, edit}, arrayArgs, objectArgs) {
        return console.log(new Color(`&d[GCommands] &cCommand ${this.name} doesn't provide a run method!`).getText())
    }
}

module.exports = Command;