const GInteraction = require('./GInteraction');

class CommandInteraction extends GInteraction {
    constructor(client, data) {
        super(client, data);

        /**
         * The invoked application command's id
         * @type {Snowflake}
         */
        this.commandId = data.data.id;

        /**
         * The invoked application command's name
         * @type {string}
         */
        this.commandName = data.data.name;

        /**
         * The invoked application command's arrayArguments
         * @type {Array}
         */
        this.arrayArguments = this.getSlashArgs(data.data.options);

        /**
         * The invoked application command's objectArguments
         * @type {object}
         */
        this.objectArguments = this.getSlashArgsObject(data.data.options);
    }

    /**
     * Internal method to getSlashArgs
     * @returns {Array}
     * @private
    */
    getSlashArgs(options) {
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
     * Internal method to getSlashArgsObject
     * @returns {object}
     * @private
    */
    getSlashArgsObject(options) {
        let args = {};

        for (let o of options) {
          if (o.type === 1) { args[o.name] = this.getSlashArgsObject(o.options || []); } else if (o.type === 2) { args[o.name] = this.getSlashArgsObject(o.options || []); } else {
              args[o.name] = o.value;
          }
        }

        return args;
    }
}

module.exports = CommandInteraction;
