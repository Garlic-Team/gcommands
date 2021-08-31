const GInteraction = require('./GInteraction');

/**
 * The BaseCommandInteraction
 * @extends GInteraction
 */
class BaseCommandInteraction extends GInteraction {
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
         * The interaction's subcommands
         * @type {Array<string> | null}
         */
        this.subcommands = data.data && data.data.options ? data.data.options : null;
    }
}

module.exports = BaseCommandInteraction;
