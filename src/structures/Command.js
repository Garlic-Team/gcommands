const Color = require("./Color");

class Command {
    constructor(client, options = {}) {
        /**
         * Name
         * @type {String}
         */
        this.name = String(options.name);

        /**
         * Description
         * @type {String}
         */
        this.description = String(options.description);

        /**
         * Cooldown
         * @type {String}
         */
        this.cooldown = String(options.cooldown);

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
         * @type {import("discord.js").Snowflake | Array}
         */
        this.userOnly = options.userOnly;

        /**
         * channelOnly
         * @type {import("discord.js").Snowflake | Array}
         */
        this.channelOnly = options.channelOnly;

        /**
         * guildOnly
         * @type {import("discord.js").Snowflake}
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
    }

    async run() {
        return console.log(new Color(`&d[GCommands] &cCommand ${this.name} doesn't provide a run method!`).getText())
    }
}

module.exports = Command;