const MessageComponentInteraction = require('./MessageComponentInteraction');

/**
 * The SelectMenuInteraction class
 */
class SelectMenuInteraction extends MessageComponentInteraction {
    /**
     * Creates new SelectMenuInteraction instance
     * @param {Client} client
     * @param {Object} data
    */
    constructor(client, data) {
        super(client, data);

        /**
         * Values
         * @type {Array}
         */
        this.values = data.data.values ? data.data.values : undefined;
    }
}

module.exports = SelectMenuInteraction;
