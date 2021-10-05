const { resolveString, parseEmoji, resolvePartialEmoji } = require('../util/util');
const { MessageComponentTypes } = require('../util/Constants');
const BaseMessageComponent = require('./BaseMessageComponent');
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
 * The MessageButton class
 * @extends BaseMessageComponent
 */
class MessageButton extends BaseMessageComponent {
    /**
     * Creates new MessageButton instance
     * @param {Object} data
    */
    constructor(data = {}) {
        super({ type: 'BUTTON' });

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
         * Style
         * @type {string}
        */
        this.style = 'style' in data ? this.resolveStyle(data.style) : null;

        /**
         * Label
         * @type {string}
        */
        this.label = 'label' in data ? resolveString(data.label) : null;

        /**
         * Disabled
         * @type {boolean}
        */
        this.disabled = 'disabled' in data ? Boolean(data.disabled) : false;

        /**
         * Emoji
         * @type {boolean}
        */
         this.emoji = 'emoji' in data ? resolvePartialEmoji(data.emoji) : false;

        if (this.style === 5) {
            /**
             * Url
             * @type {string}
            */
            this.url = 'url' in data ? resolveString(data.url) : null;
        } else {
            /**
             * CustomId
             * @type {string}
            */
            this.customId = data.custom_id || data.customId || null;
        }

        return this.toJSON();
    }

    /**
     * Method to setStyle
     * @param {string} style
    */
    setStyle(style) {
        this.style = this.resolveStyle(resolveString(style.toLowerCase()));
        return this;
    }

    /**
     * Method to setLabel
     * @param {string} label
    */
    setLabel(label) {
        this.label = resolveString(label);
        return this;
    }

    /**
     * Method to setEmoji
     * @param {string} emoji
    */
    setEmoji(emoji) {
        this.emoji = parseEmoji(`${emoji}`);
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
     * Method to setURL
     * @param {string} url
    */
    setURL(url) {
        this.url = resolveString(url);
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
     * Method to toJSON
     * @return {Object}
    */
    toJSON() {
        return {
            type: MessageComponentTypes.BUTTON,
            style: this.url ? 5 : this.style,
            label: this.label || "",
            disabled: this.disabled,
            url: this.url,
            custom_id: this.url ? null : this.customId,
            emoji: this.emoji,
        };
    }

    resolveStyle(style) {
        if (!style) throw new GError('[INVALID STYLE]','An invalid button styles was provided');

        if (typeof style === 'string') style = style.toLowerCase();
        if (typeof style === 'number') style = Object.keys(styles)[style];

        if (!styles[style]) throw new GError('[INVALID STYLE]','An invalid button styles was provided');

        return styles[style] || style;
    }
}

module.exports = MessageButton;
