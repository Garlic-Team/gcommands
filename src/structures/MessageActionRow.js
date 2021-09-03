const GError = require('./GError');
const { MessageComponentTypes } = require('../util/Constants');
const BaseMessageComponent = require('./BaseMessageComponent');

/**
 * The MessageActionRow class
 * @extends BaseMessageComponent
 */
class MessageActionRow extends BaseMessageComponent {
    /**
     * Creates new MessageActionRow instance
     * @param {Array} data
    */
    constructor(data = {}) {
        super({ type: 'ACTION_ROW' });

        /**
         * Components
         * @type {Array}
        */
        this.components = [];

        this.setup(data);
    }

    /**
     * Setup
     * @param {Array} data
     * @returns {MessageActionRow}
     * @private
     */
    setup(data) {
        this.components = 'components' in data ? data.components.map(c => BaseMessageComponent.create(c)) : [];

        return this.toJSON();
    }

    /**
     * Method to addComponent
     * @param {MessageButton | MessageSelectMenu} component
    */
    addComponent(component) {
        if (typeof component !== 'object') throw new GError('[INVALID COMPONENT]','Need provide BaseMessageComponent');
        this.components.push(component);
        return this;
    }

    /**
     * Method to addComponents
     * @param {MessageButton[] | MessageSelectMenu[]} components
    */
    addComponents(components) {
        if (typeof components !== 'object') throw new GError('[INVALID COMPONENT]','Need provide BaseMessageComponent');
        this.components.push(...components.flat(Infinity).map(c => c));
        return this;
    }

    /**
     * Method to removeComponents
     * @param {number} index
     * @param {number} deleteCount
     * @param {MessageButton[] | MessageSelectMenu[]} components
    */
    removeComponents(index, deleteCount, ...components) {
        if (typeof components !== 'object') throw new GError('[INVALID COMPONENT]','Need provide BaseMessageComponent');
        this.components.splice(index, deleteCount, ...components.flat(Infinity).map(c => c));
        return this;
    }

    /**
     * Method to toJSON
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