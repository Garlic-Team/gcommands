const { MessageComponentTypes } = require('../util/Constants');
const { resolveString } = require('../util/util');
const BaseMessageComponent = require('./BaseMessageComponent');
const GError = require('./GError');

/**
 * The MessageSelectMenu class
 * @extends BaseMessageComponent
 */
class MessageSelectMenu extends BaseMessageComponent {
    /**
     * Creates new MessageSelectMenu instance
     * @param {Object} data
    */
     constructor(data = {}) {
        super({ type: 'SELECT_MENU' });

        /**
         * Options
         * @type {Array}
        */
        this.options = [];

        this.setup(data);
    }

    /**
     * Setup
     * @param {Object} data
     * @returns {MessageSelectMenu}
     * @private
     */
     setup(data) {
        /**
         * Placeholder
         * @type {string}
        */
        this.placeholder = 'placeholder' in data ? resolveString(data.placeholder) : null;

        /**
         * MaxValues
         * @type {number}
        */
        this.max_values = 'max_values' in data ? Number(data.max_values) : 1;

        /**
         * MinValues
         * @type {number}
        */
        this.min_values = 'min_values' in data ? Number(data.min_values) : 1;

        /**
         * CustomId
         * @type {string}
        */
        this.customId = data.custom_id || data.customId || null;

        this.options = 'options' in data ? Array(data.options) : [];

        /**
         * Disabled
         * @type {boolean}
        */
        this.disabled = 'disabled' in data ? Boolean(data.disabled) : false;

        return this.toJSON();
    }

    /**
     * Method to setDisabled
     * @param {string} boolean
    */
    setPlaceholder(string) {
        this.placeholder = resolveString(string);
        return this;
    }

    /**
     * Method to setMaxValues
     * @param {number} int
    */
    setMaxValues(int = 1) {
        this.max_values = Number(int);
        return this;
    }

    /**
     * Method to setMinValues
     * @param {number} int
    */
    setMinValues(int = 1) {
        this.min_values = Number(int);
        return this;
    }

    /**
     * Method to setID
     * @param {string} id
     * @deprecated
    */
    setID(id) {
        this.customId = this.style === 5 ? null : resolveString(id);
        return this;
    }

    /**
     * Method to setCustomId
     * @param {string} id
    */
    setCustomId(id) {
        this.customId = this.style === 5 ? null : resolveString(id);
        return this;
    }

    /**
     * Method to setDisabled
     * @param {string} boolean
    */
    setDisabled(boolean = true) {
        this.disabled = Boolean(boolean);
        return this;
    }

    /**
     * Method to addOption
     * @param {MessageSelectMenuOption} MessageSelectMenuOption
    */
    addOption(option) {
        if (typeof option !== 'object') throw new GError('[INVALID COMPONENT]','Need provide MessageSelectMenuOption');
        this.options.push(option);
        return this;
    }

    /**
     * Method to addOptions
     * @param {MessageSelectMenuOption[]} MessageSelectMenuOption
    */
    addOptions(...options) {
        if (typeof options !== 'object') throw new GError('[INVALID COMPONENT]','Need provide MessageSelectMenuOption');
        this.options.push(...options.flat(Infinity).map(o => o));
        return this;
    }

    /**
     * Method to removeOptions
     * @param {number} index
     * @param {number} deleteCount
     * @param {MessageSelectMenuOption[]} MessageSelectMenuOption[]
    */
    removeOptions(index, deleteCount, ...options) {
        if (typeof options !== 'object') throw new GError('[INVALID COMPONENT]','Need provide MessageSelectMenuOption');
        this.components.splice(index, deleteCount, ...options.flat(Infinity).map(o => o));
        return this;
    }

    /**
     * Method to toJSON
     * @return {Object}
    */
    toJSON() {
        return {
            type: MessageComponentTypes.SELECT_MENU,
            min_values: this.min_values,
            max_values: this.max_values || this.options.length,
            placeholder: this.placeholder || '',
            custom_id: this.customId,
            disabled: this.disabled,
            options: this.options,
        };
    }
}

module.exports = MessageSelectMenu;