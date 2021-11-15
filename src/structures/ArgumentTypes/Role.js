const ArgumentType = require('./Base');

/**
 * The RoleArgumentType class
 * @param {Client}
 */
class RoleArgumentType extends ArgumentType {
    /**
     * The RoleArgumentType class
     * @param {Client}
     */
    constructor(client) {
        super(client, 'ROLE');

        /**
         * Client
         * @type {Client}
        */
        this.client = client;

        /**
        * Value
        * @type {Object}
       */
        this.value = {};
    }

    validate(argument, message, language) {
        const matches = message.content.match(/([0-9]+)/);

        if (!matches?.[0]) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'role');
        this.value.value = matches[0];

        const role = message.guild.roles.cache.get(matches[1]);
        if (!role) return this.client.languageFile.ARGS_MUST_CONTAIN[language].replace('{argument}', argument.name).replace('{type}', 'role');
        else this.value.role = role;
    }
    resolve(option) {
        if (this.value.role) option.role = this.value.role;

        return option;
    }
}

module.exports = RoleArgumentType;
