const { resolveString, parseEmoji, resolvePartialEmoji } = require('../util/util');
const { MessageComponentTypes } = require('../util/Constants');
const GError = require('./GError');
const styles = {
    blurple: 1,
    gray: 2,
    grey: 2,
    green: 3,
    red: 4,
    url: 5,
    primary: 1,
    secondary: 2,
    success: 3,
    danger: 4,
    link: 5,
};

/**
 * The builder for the MessageButton
 * @extends BaseMessageComponent
 */
class MessageButton {
    /**
     * @param {Object} data
     * @constructor
    */
    constructor(data = {}) {
        /**
         * The type
         * @type {string}
        */
        this.type = 'BUTTON';

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
         * The style
         * @type {string}
        */
        this.style = 'style' in data ? this.resolveStyle(data.style) : null;

        /**
         * The label
         * @type {string}
        */
        this.label = 'label' in data ? resolveString(data.label) : null;

        /**
         * The disabled
         * @type {boolean}
        */
        this.disabled = 'disabled' in data ? Boolean(data.disabled) : false;

        /**
         * The emoji
         * @type {boolean}
        */
        this.emoji = 'emoji' in data ? resolvePartialEmoji(data.emoji) : false;

        if (this.style === 5) {
            /**
             * The url
             * @type {string}
            */
            this.url = 'url' in data ? resolveString(data.url) : null;
        } else {
            /**
             * The custom id
             * @type {string}
            */
            this.customId = data.custom_id || data.customId || null;
        }

        return this.toJSON();
    }

    /**
     * Method to set style
     * @param {string} style
    */
    setStyle(style) {
        this.style = this.resolveStyle(style);
        return this;
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
     * Method to set emoji
     * @param {string} emoji
    */
    setEmoji(emoji) {
        this.emoji = parseEmoji(`${emoji}`);
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
     * Method to set URL
     * @param {string} url
    */
    setURL(url) {
        this.url = resolveString(url);
        this.style = 5;
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
     * Method to convert to JSON
     * @return {Object}
    */
    toJSON() {
        return {
            type: MessageComponentTypes.BUTTON,
            style: this.style,
            label: this.label || '',
            disabled: this.disabled,
            url: this.url,
            custom_id: this.url ? null : this.customId,
            emoji: this.emoji,
        };
    }

    resolveStyle(style) {
        if (!style) throw new GError('[INVALID STYLE]', 'An invalid button style was provided');

        if (typeof style === 'number' && style >= 1 && style <= 5) return style;
        else if (typeof style === 'number') throw new GError('[INVALID STYLE]', 'An invalid button style was provided');

        if (typeof style === 'string') style = style.toLowerCase();

        if (!styles[style]) throw new GError('[INVALID STYLE]', 'An invalid button style was provided');

        return styles[style] || style;
    }
}

module.exports = MessageButton;
