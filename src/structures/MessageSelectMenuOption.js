const { resolveString, parseEmoji } = require('../util/util');

/**
 * The MessageSelectMenuOption class
 */
class MessageSelectMenuOption {
    /**
     * Creates new MessageSelectMenuOption instance
     * @param {Object} data
    */
    constructor(data = {}) {
        this.setup(data);
    }

    /**
     * Setup
     * @param {Object} data
     * @returns {MessageButton}
     * @private
     */
    setup(data) {
        /**
         * Label
         * @type {string}
        */
        this.label = 'label' in data ? resolveString(data.label) : null;

        /**
         * Value
         * @type {string}
        */
        this.value = 'value' in data ? resolveString(data.value) : null;

        /**
         * Description
         * @type {string}
        */
        this.description = 'description' in data ? resolveString(data.description) : null;

        /**
         * Emoji
         * @type {string}
        */
        this.emoji = 'emoji' in data ? parseEmoji(data.emoji) : null;

        /**
         * Default
         * @type {Boolean}
        */
        this.default = 'default' in data ? Boolean(data.default) : false;

        return this.toJSON();
    }

    /**
     * Method to setLabel
     * @param {String} label
    */
    setLabel(label) {
        this.label = resolveString(label);
        return this;
    }

    /**
     * Method to setValue
     * @param {String} value
    */
    setValue(value) {
        this.value = resolveString(value);
        return this;
    }

    /**
     * Method to setValue
     * @param {String} desc
    */
    setDescription(desc) {
        this.description = resolveString(desc);
        return this;
    }

    /**
     * Method to setEmoji
     * @param {String} emoji
    */
    setEmoji(emoji) {
        this.emoji = parseEmoji(`${emoji}`);
        return this;
    }

    /**
     * Method to setDefault
     * @param {Boolean} default
    */
    setDefault(def = true) {
        this.default = Boolean(def);
        return this;
    }

    /**
     * Method to toJSON
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
