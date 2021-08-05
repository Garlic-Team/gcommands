const Color = require('../../structures/Color');

/**
 * The ArgumentType class
 */
class ArgumentType {
    /**
     * The ArgumentType class
     * @param {Client}
     * @param {String} type
     */
    constructor(client, type) {
        if (!client) return console.log(new Color('&d[GCommands Args] &cNo discord.js client provided!').getText());
        if (!type) return console.log(new Color('&d[GCommands Args] &cNo argument provided!').getText());

        /**
         * Type
         * @type {string}
        */
        this.type = type;

        return this;
    }

    /**
     * Method to validate
     * @param {Argument}
     * @param {Message|Object}
     */
    validate(argument, message) { // eslint-disable-line no-unused-vars, require-await
        return console.log(new Color('&d[GCommands Args] &cArgument doesnt have provided validate() method'));
    }
}

module.exports = ArgumentType;
