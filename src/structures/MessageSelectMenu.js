const { MessageComponentTypes } = require('../util/Constants');
const { resolveString } = require('../util/util');
const GError = require('./GError');

/**
 * The builder for the MessageSelectMenu
 * @extends BaseMessageComponent
 */
class MessageSelectMenu {
    /**
     * @param {Object} data
     * @constructor
    */
    constructor(data = {}) {
        /**
        * The type
        * @type {string}
       */
        this.type = 'SELECT_MENU';

        /**
         * The options
         * @type {Array}
        */
        this.options = [];

        this.setup(data);
    }

    /**
     * Setup function
     * @param {Object} data
     * @returns {MessageSelectMenu}
     * @private
     */
    setup(data) {
        /**
         * The placeholder
         * @type {string}
        */
        this.placeholder = 'placeholder' in data ? resolveString(data.placeholder) : null;

        /**
         * The max values
         * @type {number}
        */
        this.max_values = 'max_values' in data ? Number(data.max_values) : 1;

        /**
         * The min values
         * @type {number}
        */
        this.min_values = 'min_values' in data ? Number(data.min_values) : 1;

        /**
         * The custom ID
         * @type {string}
        */
        this.customId = data.custom_id || data.customId || null;

        this.options = 'options' in data ? Array(data.options) : [];

        /**
         * The disabled
         * @type {boolean}
        */
        this.disabled = 'disabled' in data ? Boolean(data.disabled) : false;

        return this.toJSON();
    }

    /**
     * Method to set disabled
     * @param {string} boolean
    */
    setPlaceholder(string) {
        this.placeholder = resolveString(string);
        return this;
    }

    /**
     * Method to set max values
     * @param {number} int
    */
    setMaxValues(int = 1) {
        this.max_values = Number(int);
        return this;
    }

    /**
     * Method to set min values
     * @param {number} int
    */
    setMinValues(int = 1) {
        this.min_values = Number(int);
        return this;
    }

    /**
     * Method to set ID
     * @param {string} id
     * @deprecated
    */
    setID(id) {
        this.customId = this.style === 5 ? null : resolveString(id);
        return this;
    }

    /**
     * Method to set custom ID
     * @param {string} id
    */
    setCustomId(id) {
        this.customId = this.style === 5 ? null : resolveString(id);
        return this;
    }

    /**
     * Method to set disabled
     * @param {string} boolean
    */
    setDisabled(boolean = true) {
        this.disabled = Boolean(boolean);
        return this;
    }

    /**
     * Method to add option
     * @param {MessageSelectMenuOption} MessageSelectMenuOption
    */
    addOption(option) {
        if (typeof option !== 'object') throw new GError('[INVALID COMPONENT]', 'Need provide MessageSelectMenuOption');
        this.options.push(option);
        return this;
    }

    /**
     * Method to add options
     * @param {MessageSelectMenuOption[]} MessageSelectMenuOption
    */
    addOptions(...options) {
        if (typeof options !== 'object') throw new GError('[INVALID COMPONENT]', 'Need provide MessageSelectMenuOption');
        this.options.push(...options.flat(Infinity).map(o => o));
        return this;
    }

    /**
     * Method to remove options
     * @param {number} index
     * @param {number} deleteCount
     * @param {MessageSelectMenuOption[]} MessageSelectMenuOption[]
    */
    removeOptions(index, deleteCount, ...options) {
        if (typeof options !== 'object') throw new GError('[INVALID COMPONENT]', 'Need provide MessageSelectMenuOption');
        this.components.splice(index, deleteCount, ...options.flat(Infinity).map(o => o));
        return this;
    }

    /**
     * Method to convert to JSON
     * @return {Object}
    */
    toJSON() {
        return {
            type: MessageComponentTypes.SELECT_MENU,
            min_values: this.min_values,
            max_values: this.max_values || this.options.length,
            placeholder: this.placeholder || '',
            custom_id: this.custom_id || this.customId,
            disabled: this.disabled,
            options: this.options,
        };
    }
}

module.exports = MessageSelectMenu;
