const { resolveString } = require("../util/util");

class Event {
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
    }

    async run(...args) {
        return console.log(new Color(`&d[GEvents] &cEvent ${this.name} doesn't provide a run method!`).getText())
    }
}

module.exports = Event;