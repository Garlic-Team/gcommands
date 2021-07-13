const { resolveString } = require('../util/util');

/**
 * The Event class
 */
class Event {

    /**
     * Creates new Event instance
     * @param {Client} client
     * @param {Object} options 
    */
    constructor(client, options = {}) {
        /**
         * Name
         * @type {String}
         */
        this.name = resolveString(options.name);

        /**
         * once
         * @type {Boolean}
         */
         this.once = Boolean(options.once) || false;

        /**
         * ws
         * @type {Boolean}
         */
         this.ws = Boolean(options.ws) || false;
    }

    async run(client, ...args) {
        return console.log(new Color(`&d[GEvents] &cEvent ${this.name} doesn't provide a run method!`).getText())
    }
}

module.exports = Event;