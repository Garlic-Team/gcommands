const { resolveString } = require('../util/util');

/**
 * The EventOptionsBuilder class
 */
class EventOptionsBuilder {
    /**
     * Creates new EventOptionsBuilder instance
     * @param {EventOptions} data
    */
     constructor(data = {}) {
        this.setup(data);
    }

    /**
     * Setup
     * @param {EventOptions} data
     * @returns {EventOptionss}
     * @private
     */
    setup(data) {
        /**
         * Name
         * @type {string}
        */
        this.name = 'name' in data ? resolveString(data.name) : null;

        /**
         * Once
         * @type {boolean}
        */
        this.once = 'once' in data ? Boolean(data.value) : null;

        /**
         * Ws
         * @type {boolean}
        */
         this.ws = 'ws' in data ? Boolean(data.ws) : null;

        return this.toJSON();
    }

    /**
     * Method to setName
     * @param {String} name
    */
    setName(name) {
        this.name = resolveString(name);
        return this;
    }

    /**
     * Method to setOnce
     * @param {boolean} once
    */
    setOnce(once) {
        this.once = Boolean(once);
        return this;
    }

    /**
     * Method to setWs
     * @param {boolean} ws
    */
     setWs(ws) {
        this.ws = Boolean(ws);
        return this;
    }

    /**
     * Method to toJSON
     * @returns {Object}
    */
     toJSON() {
        return {
          name: this.name,
          once: this.once,
          ws: this.ws,
        };
      }
}

module.exports = EventOptionsBuilder;
