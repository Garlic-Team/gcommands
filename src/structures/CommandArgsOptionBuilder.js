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
         * Args
         * @type {Array<CommandArgsOption>}
        */
         this.args = 'args' in data ? data.args : null;

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
     * Method to addArg
     * @param {CommandArgsOption} arg
    */
     addArg(arg) {
        if (!Array.isArray(this.args)) this.args = [];
        this.args.push(arg);
        return this;
      }

      /**
       * Method to addArgs
       * @param {Array<CommandArgsOption>} args
      */
      addArgs(args) {
        for (const arg of Object.values(args)) {
          this.addArg(arg);
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
        };
      }
}

module.exports = CommandArgsOptionBuilder;
