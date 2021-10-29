const { resolveString, parseEmoji, resolvePartialEmoji } = require('../util/util');

/**
 * The builder for the MessageSelectMenuOption
 * @deprecated
 */
class MessageSelectMenuOption {
    /**
     * @param {Object} data
     * @constructor
     * @deprecated
    */
    constructor(data = {}) {
        this.setup(data);
    }

    /**
     * Setup function
     * @param {Object} data
     * @returns {MessageButton}
     * @private
     */
    setup(data) {
        /**
         * The label
         * @type {string}
        */
        this.label = 'label' in data ? resolveString(data.label) : null;

        /**
         * The value
         * @type {string}
        */
        this.value = 'value' in data ? resolveString(data.value) : null;

        /**
         * The description
         * @type {string}
        */
        this.description = 'description' in data ? resolveString(data.description) : null;

        /**
         * The emoji
         * @type {string}
        */
        this.emoji = 'emoji' in data ? resolvePartialEmoji(data.emoji) : null;

        /**
         * The default
         * @type {boolean}
        */
        this.default = 'default' in data ? Boolean(data.default) : false;

        return this.toJSON();
    }

    /**
     * Method to set label
     * @param {string} label
    */
    setLabel(label) {
        this.label = resolveString(label);
        return this;
    }

    /**
     * Method to set value
     * @param {string} value
    */
    setValue(value) {
        this.value = resolveString(value);
        return this;
    }

    /**
     * Method to set description
     * @param {string} desc
    */
    setDescription(desc) {
        this.description = resolveString(desc);
        return this;
    }

    /**
     * Method to set emoji
     * @param {string} emoji
    */
    setEmoji(emoji) {
        this.emoji = parseEmoji(`${emoji}`);
        return this;
    }

    /**
     * Method to set default
     * @param {boolean} default
    */
    setDefault(def = true) {
        this.default = Boolean(def);
        return this;
    }

    /**
     * Method to convert to JSON
     * @return {Object}
    */
    toJSON() {
        return {
            label: this.label,
            value: this.value,
            description: this.description,
            emoji: this.emoji,
            default: this.default,
        };
    }
}

module.exports = MessageSelectMenuOption;
