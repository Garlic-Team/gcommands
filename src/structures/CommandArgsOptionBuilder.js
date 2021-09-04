const { resolveString } = require('../util/util');

/**
 * The CommandArgsOptionBuilder class
 */
class CommandArgsOptionBuilder {
    /**
     * Creates new CommandArgsOptionBuilder instance
     * @param {CommandArgsOption} data
    */
    constructor(data = {}) {
        this.setup(data);
    }

    /**
     * Setup
     * @param {CommandArgsOption} data
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
         * @type {number}
        */
        this.type = 'type' in data ? Number(data.type) : null;

        /**
         * Prompt
         * @type {string}
        */
        this.prompt = 'prompt' in data ? resolveString(data.prompt) : null;

        /**
         * Required
         * @type {boolean}
        */
        this.required = 'required' in data ? Boolean(data.required) : null;

        /**
         * Choices
         * @type {Array<CommandArgsChoice>}
        */
        this.choices = 'choices' in data ? data.choises : null;

        /**
         * Options
         * @type {Array<CommandArgsOption>}
        */
         this.options = 'options' in data ? data.options : null;

        return this.toJSON();
    }

    /**
     * Method to setName
     * @param {string} name
    */
    setName(name) {
        this.name = resolveString(name);
        return this;
    }

    /**
     * Method to setDescription
     * @param {string} description
    */
    setDescription(description) {
        this.description = resolveString(description);
        return this;
    }

    /**
     * Method to setType
     * @param {string} type
    */
    setType(type) {
        this.type = Number(type);
        return this;
    }

    /**
     * Method to setPrompt
     * @param {string} prompt
    */
    setPrompt(prompt) {
        this.prompt = resolveString(prompt);
        return this;
    }

    /**
     * Method to setRequired
     * @param {boolean} required
    */
    setRequired(required) {
        this.required = Boolean(required);
        return this;
    }

    /**
     * Method to addChoice
     * @param {CommandArgsChoice} choice
    */
    addChoice(choice) {
        if (!Array.isArray(this.choices)) this.choices = [];
        this.choices.push(choice);
        return this;
    }

    /**
     * Method to addChoices
     * @param {Array<CommandArgsChoice>} choices
    */
    addChoices(choices) {
        for (const choice of Object.values(choices)) {
            this.addChoice(choice);
        }
        return this;
    }

    /**
     * Method to addOption
     * @param {CommandArgsOption} option
    */
     addOption(option) {
        if (!Array.isArray(this.options)) this.options = [];
        this.options.push(option);
        return this;
      }

      /**
       * Method to addOptions
       * @param {Array<CommandArgsOption>} options
      */
      addOptions(options) {
        for (const option of Object.values(options)) {
          this.addOption(option);
        }
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
          options: this.options,
        };
      }
}

module.exports = CommandArgsOptionBuilder;
