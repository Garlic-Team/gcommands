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


        /**
         * The interaction's subCommands
         * @type {Array<string> | null}
         */
        this.subCommands = this.getSubCommands(data.data.options);
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

        let fill = (options) => {
          for (let o of options) {
            if([1, 2].includes(o.type)) {
              fill(o.options)
            } else {
              args[o.name] = o.value;
            }
          }
        }

        fill(options)

        return args;
    }

    /**
     * Internal method to getSubCommands
     * @returns {object}
     * @private
    */
    getSubCommands(options) {
      let args = [];

      let check = option => {
        if (!option) return;
        if(![1, 2].includes(option.type)) return;
        this.arrayArguments.shift();

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
}

module.exports = CommandInteraction;
