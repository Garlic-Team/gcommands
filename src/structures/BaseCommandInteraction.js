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
    }
}

module.exports = BaseCommandInteraction;
