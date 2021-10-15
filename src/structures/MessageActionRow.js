const GError = require('./GError');
const { MessageComponentTypes } = require('../util/Constants');

/**
 * The builder for the MessageActionRow
 */
class MessageActionRow {
    /**
     * @param {Array} data
     * @constructor
    */
    constructor(data = {}) {
        /**
         * The type
         * @type {string}
        */
        this.type = 'ACTION_ROW';

        /**
         * The components
         * @type {Array}
        */
        this.components = [];

        this.setup(data);
    }

    /**
     * Setup function
     * @param {Array} data
     * @returns {MessageActionRow}
     * @private
     */
    setup(data) {
        this.components = 'components' in data ? data.components : [];

        return this.toJSON();
    }

    /**
     * Method to add component
     * @param {MessageButton | MessageSelectMenu} component
    */
    addComponent(component) {
        if (typeof component !== 'object') throw new GError('[INVALID COMPONENT]', 'Need provide BaseMessageComponent');
        this.components.push(component);
        return this;
    }

    /**
     * Method to add components
     * @param {MessageButton[] | MessageSelectMenu[]} components
    */
    addComponents(components) {
        if (typeof components !== 'object') throw new GError('[INVALID COMPONENT]', 'Need provide BaseMessageComponent');
        this.components.push(...components.flat(Infinity).map(c => c));
        return this;
    }

    /**
     * Method to remove components
     * @param {number} index
     * @param {number} deleteCount
     * @param {MessageButton[] | MessageSelectMenu[]} components
    */
    removeComponents(index, deleteCount, ...components) {
        if (typeof components !== 'object') throw new GError('[INVALID COMPONENT]', 'Need provide BaseMessageComponent');
        this.components.splice(index, deleteCount, ...components.flat(Infinity).map(c => c));
        return this;
    }

    /**
     * Method to convert to JSON
     * @return {Object}
    */
    toJSON() {
        return {
            type: MessageComponentTypes.ACTION_ROW,
            components: this.components,
        };
    }
}

module.exports = MessageActionRow;
