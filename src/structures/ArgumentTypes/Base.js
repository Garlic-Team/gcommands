const GError = require('../GError');

/**
 * The ArgumentType class
 */
class ArgumentType {
    /**
     * The ArgumentType class
     * @param {Client}
     * @param {string} type
     */
    constructor(client, type) {
        if (!client) throw new GError('[ARGUMENTS]', 'You must specify the client');
        if (!type) throw new GError('[ARGUMENTS]', 'You must specify the argument type');

        /**
         * Type
         * @type {string}
        */
        this.type = type;

        /**
         * Client
         * @type {Client}
        */
        this.client = client;

        return this;
    }

    /**
     * Method to validate
     * @param {Argument}
     * @param {Message|Object}
     */
    validate(argument, message) { // eslint-disable-line no-unused-vars, require-await
        throw new GError('[ARGUMENTS]', 'Argument doesnt have provided validate() method');
    }

    /**
     * Method to get
    */
    get() { // eslint-disable-line no-unused-vars, require-await
        return this.value?.value;
    }

    /**
     * Method to resolve
     * @param {Object} option
    */
    resolve(option) {
        return option;
    }
}

module.exports = ArgumentType;
