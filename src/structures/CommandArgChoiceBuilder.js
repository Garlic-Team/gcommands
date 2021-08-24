const { resolveString } = require('../util/util');

/**
 * The CommandArgChoiceBuilder class
 */
class CommandArgChoiceBuilder {
    /**
     * Creates new CommandArgChoiceBuilder instance
     * @param {Object} data
    */
     constructor(data = {}) {
        this.setup(data);
    }

    setup(data) {
        /**
         * Name
         * @type {string}
        */
        this.name = 'name' in data ? resolveString(data.name) : null;

        /**
         * Value
         * @type {any}
        */
        this.value = 'value' in data ? data.value : null;

        return this.toJSON();
    }

    /**
     * Method to setName
     * @param {String} name
    */
    setName(name) {
        this.name = resolveString(name);
        return this;
    }

    /**
     * Method to setValue
     * @param {any} value
    */
    setValue(value) {
        this.value = value;
        return this;
    }

    /**
     * Method to toJSON
     * @returns {Object}
    */
     toJSON() {
        return {
          name: this.name,
          value: this.value,
        };
      }
}

module.exports = CommandArgChoiceBuilder;
