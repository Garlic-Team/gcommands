const { Snowflake } = require("discord.js");
const { resolveString } = require("../util/util");
const Color = require("./Color");

class Command {
    constructor(client, options = {}) {
        /**
         * Name
         * @type {String}
         */
        this.name = resolveString(options.name);

        /**
         * Description
         * @type {String}
         */
        this.description = resolveString(options.description);

        /**
         * Cooldown
         * @type {String}
         */
        this.cooldown = resolveString(options.cooldown);

        /**
         * expectedArgs
         * @type {String | Array}
         */
        this.expectedArgs = options.expectedArgs;

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
         * guildOnly
         * @type {Snowflake}
         */
        this.guildOnly = options.guildOnly;    

        /**
         * nsfw
         * @type {String | Array}
         */
        this.nsfw = Boolean(options.nfsw) || false;

        /**
         * aliases
         * @type {Array}
         */
        this.aliases = Array(options.aliases);

        /**
         * category
         * @type {String}
         */
        this.category = resolveString(options.category);
    }

    async run({client, interaction, member, message, guild, channel, respond, edit}, arrayArgs, objectArgs) {
        return console.log(new Color(`&d[GCommands] &cCommand ${this.name} doesn't provide a run method!`).getText())
    }
}

module.exports = Command;