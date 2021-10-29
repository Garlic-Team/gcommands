const { resolveString } = require('../util/util');

/**
 * The builder for the command option
 */
class CommandArgsOptionBuilder {
    /**
     * @param {CommandArgsOption} data
     * @constructor
    */
    constructor(data = {}) {
        this.setup(data);
    }

    /**
     * Setup function
     * @param {CommandArgsOption} data
     * @returns {CommandArgsOption}
     * @private
     */
    setup(data) {
        /**
         * The name
         * @type {string}
        */
        this.name = 'name' in data ? resolveString(data.name) : null;

        /**
         * The description
         * @type {string}
        */
        this.description = 'description' in data ? resolveString(data.description) : null;

        /**
         * The type
         * @type {number}
        */
        this.type = 'type' in data ? Number(data.type) : null;

        /**
         * The prompt
         * @type {string}
        */
        this.prompt = 'prompt' in data ? resolveString(data.prompt) : null;

        /**
         * Wheter the argument is required
         * @type {boolean}
        */
        this.required = 'required' in data ? Boolean(data.required) : null;

        /**
         * The channel types
         * @type {ArgumentChannelTypes}
         */
        this.channel_types = 'channel_types' in data ? data.channel_types : null;

        /**
         * The choices
         * @type {Array<CommandArgsChoice>}
        */
        this.choices = 'choices' in data ? data.choises : null;

        /**
         * The options
         * @type {Array<CommandArgsOption>}
        */
         this.options = 'options' in data ? data.options : null;

        return this.toJSON();
    }

    /**
     * Method to set name
     * @param {string} name
     * @returns {CommandArgsOptionBuilder}
    */
    setName(name) {
        this.name = resolveString(name);
        return this;
    }

    /**
     * Method to set description
     * @param {string} description
     * @returns {CommandArgsOptionBuilder}
    */
    setDescription(description) {
        this.description = resolveString(description);
        return this;
    }

    /**
     * Method to set type
     * @param {string} type
     * @returns {CommandArgsOptionBuilder}
    */
    setType(type) {
        this.type = Number(type);
        return this;
    }

    /**
     * Method to set prompt
     * @param {string} prompt
     * @returns {CommandArgsOptionBuilder}
    */
    setPrompt(prompt) {
        this.prompt = resolveString(prompt);
        return this;
    }

    /**
     * Method to set required
     * @param {boolean} required
     * @returns {CommandArgsOptionBuilder}
    */
    setRequired(required) {
        this.required = Boolean(required);
        return this;
    }

    /**
     * Method to set channel types
     * @param {ArgumentChannelTypes} types
     * @returns {CommandArgsOptionBuilder}
    */
    setChannelTypes(types) {
        this.channel_types = types;
        return this;
    }

    /**
     * Method to add choice
     * @param {CommandArgsChoice} choice
     * @returns {CommandArgsOptionBuilder}
    */
    addChoice(choice) {
        if (!Array.isArray(this.choices)) this.choices = [];
        this.choices.push(choice);
        return this;
    }

    /**
     * Method to add choices
     * @param {Array<CommandArgsChoice>} choices
     * @returns {CommandArgsOptionBuilder}
    */
    addChoices(choices) {
        for (const choice of Object.values(choices)) {
            this.addChoice(choice);
        }
        return this;
    }

    /**
     * Method to add option
     * @param {CommandArgsOption} option
     * @returns {CommandArgsOptionBuilder}
    */
     addOption(option) {
        if (!Array.isArray(this.options)) this.options = [];
        this.options.push(option);
        return this;
      }

      /**
       * Method to add options
       * @param {Array<CommandArgsOption>} options
       * @returns {CommandArgsOptionBuilder}
      */
      addOptions(options) {
        for (const option of Object.values(options)) {
          this.addOption(option);
        }
        return this;
      }

    /**
     * Method to convert to JSON
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
          options: this.options,
        };
      }
}

module.exports = CommandArgsOptionBuilder;
