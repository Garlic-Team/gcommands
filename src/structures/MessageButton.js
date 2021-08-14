/* From discord-buttons edited */
const { resolveString, parseEmoji } = require('../util/util');
const { MessageComponentTypes } = require('../util/Constants');
const BaseMessageComponent = require('./BaseMessageComponent');
const Color = require('./Color');
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
        this.style = 'style' in data ? data.style : null;

        /**
         * Label
         * @type {string}
        */
        this.label = 'label' in data ? resolveString(data.label) : null;

        /**
         * Disabled
         * @type {Boolean}
        */
        this.disabled = 'disabled' in data ? Boolean(data.disabled) : false;

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
     * @param {String} style
    */
    setStyle(style) {
        this.style = this.resolveStyle(resolveString(style.toLowerCase()));
        return this;
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
     * Method to setEmoji
     * @param {String} emoji
    */
    setEmoji(emoji) {
        this.emoji = parseEmoji(`${emoji}`);
        return this;
    }

    /**
     * Method to setDisabled
     * @param {String} boolean
    */
    setDisabled(boolean = true) {
        this.disabled = Boolean(boolean);
        return this;
    }

    /**
     * Method to setURL
     * @param {String} url
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
            label: this.label,
            disabled: this.disabled,
            url: this.url,
            custom_id: this.url ? null : this.customId,
            emoji: this.emoji,
        };
    }

    resolveStyle(style) {
        if (!style || style === undefined || style === null) return console.log(new Color('&d[GCommands] &cAn invalid button styles was provided').getText());

        if (!styles[style] || styles[style] === undefined || styles[style] === null) return console.log(new Color('&d[GCommands] &cAn invalid button styles was provided').getText());

        return styles[style] || style;
    }
}

module.exports = MessageButton;
