const BaseCommandInteraction = require('./BaseCommandInteraction');

/**
 * The CommandInteraction
 * @extends BaseCommandInteraction
 */
class CommandInteraction extends BaseCommandInteraction {
    constructor(client, data) {
        super(client, data);

        /**
         * The invoked application command's arrayArguments
         * @type {Array}
         */
        this.arrayArguments = this.getArgs(data.data.options);

        /**
         * The invoked application command's objectArguments
         * @type {object}
         */
        this.objectArguments = this.getArgsObject(data.data.options);
    }

    /**
     * Internal method to getArgs
     * @returns {Array}
     * @private
    */
     getArgs(options) {
        let args = [];

        let check = option => {
          if (!option) return;
          if (option.value) args.push(option.value);
          else args.push(option.name);

          if (option.options) {
            for (let o = 0; o < option.options.length; o++) {
              check(option.options[o]);
            }
          }
        };

        if (Array.isArray(options)) {
          for (let o = 0; o < options.length; o++) {
            check(options[o]);
          }
        } else {
          check(options);
        }

        return args;
    }

    /**
     * Internal method to getArgsObject
     * @returns {object}
     * @private
    */
     getArgsObject(options) {
        if (!Array.isArray(options)) return {};
        let args = {};

        for (let o of options) {
          if (o.type === 1) {
            args[o.name] = this.getArgsObject(o.options || []);
          } else if (o.type === 2) {
            args[o.name] = this.getArgsObject(o.options || []);
          } else {
            args[o.name] = o.value;
          }
        }

        return args;
    }
}

module.exports = CommandInteraction;
