const { resolveString } = require('../util/util');

/**
 * The CommandArgBuilder class
 */
class CommandArgBuilder {
    /**
     * Creates new CommandArgBuilder instance
     * @param {Object} data
    */
    constructor(data = {}) {
        this.setup(data);
    }

    /**
     * Setup
     * @param {Object} data
     * @returns {CommandArgsOption}
     * @private
     */
    setup(data) {
        /**
         * Name
         * @type {string}
        */
        this.name = 'name' in data ? resolveString(data.name) : null;

        /**
         * Description
         * @type {string}
        */
        this.description = 'description' in data ? resolveString(data.description) : null;

        /**
         * Type
         * @type {Number}
        */
        this.type = 'type' in data ? Number(data.type) : null;

        /**
         * Prompt
         * @type {string}
        */
        this.prompt = 'prompt' in data ? resolveString(data.prompt) : null;

        /**
         * Required
         * @type {Boolean}
        */
        this.required = 'required' in data ? Boolean(data.required) : null;

        /**
         * Choices
         * @type {}
        */
        this.choices = 'choices' in data ? data.choises : null;

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
     * Method to setDescription
     * @param {String} description
    */
    setDescription(description) {
        this.description = resolveString(description);
        return this;
    }

    /**
     * Method to setType
     * @param {String} type
    */
    setType(type) {
        this.type = Number(type);
        return this;
    }

    /**
     * Method to setPrompt
     * @param {String} prompt
    */
    setPrompt(prompt) {
        this.prompt = resolveString(prompt);
        return this;
    }

    /**
     * Method to setRequired
     * @param {Boolean} required
    */
    setRequired(required) {
        this.required = Boolean(required);
        return this;
    }

    /**
     * Method to addChoice
     * @param {CommandArgsChoice} choice
    */
    addChoice() {
        return this;
    }

    /**
     * Method to addChoices
     * @param {Array<CommandArgsChoice>} choices
    */
    addChoices() {
        return this;
    }

    /**
     * Method to toJSON
     * @returns {Object}
    */
     toJSON() {
        return {
          name: this.name,
          description: this.description,
          type: this.type,
          prompt: this.prompt,
          required: this.required,
          choises: this.choices,
        };
      }
}

module.exports = CommandArgBuilder;
