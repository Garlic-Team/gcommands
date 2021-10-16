const { resolveString } = require('../util/util');

/**
 * The builder for the command option choice
 */
class CommandArgsChoiceBuilder {
    /**
     * @param {CommandArgsChoice} data
     * @constructor
    */
     constructor(data = {}) {
        this.setup(data);
    }

    /**
     * Setup function
     * @param {CommandArgsChoice} data
     * @returns {CommandArgsChoice}
     * @private
     */
    setup(data) {
        /**
         * The name
         * @type {string}
        */
        this.name = 'name' in data ? resolveString(data.name) : null;

        /**
         * The value
         * @type {any}
        */
        this.value = 'value' in data ? data.value : null;

        return this.toJSON();
    }

    /**
     * Method to set name
     * @param {string} name
     * @returns {CommandArgsChoiceBuilder}
    */
    setName(name) {
        this.name = resolveString(name);
        return this;
    }

    /**
     * Method to set value
     * @param {any} value
     * @returns {CommandArgsChoiceBuilder}
    */
    setValue(value) {
        this.value = value;
        return this;
    }

    /**
     * Method to convert to JSON
     * @returns {Object}
    */
     toJSON() {
        return {
          name: this.name,
          value: this.value,
        };
      }
}

module.exports = CommandArgsChoiceBuilder;
