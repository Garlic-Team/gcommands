/* From discord-buttons edited */
const { resolveString, parseEmoji } = require('../util/util');
const Color = require('./Color')
const styles = {
    'blurple': 1,
    'gray': 2,
    'grey': 2,
    'green': 3,
    'red': 4,
    'url': 5,
    'primary': 1,
    'secondary': 2,
    'success': 3,
    'danger': 4,
    'link': 5
};

/**
 * The MessageButton class
 */
class MessageButton {

    /**
     * Creates new MessageButton instance
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
         * style
         * @type {String} 
        */
        this.style = 'style' in data ? this.resolveStyle(resolveString(data.style)) : null;

        /**
         * label
         * @type {String} 
        */
        this.label = 'label' in data ? resolveString(data.label) : null;

        /**
         * disabled
         * @type {Boolean} 
        */
        this.disabled = 'disabled' in data ? Boolean(data.disabled) : false;

        if (this.style === 5) {
            /**
             * url
             * @type {String} 
            */
            this.url = 'url' in data ? resolveString(data.url) : null;
        } else {
            /**
             * customId
             * @type {String} 
            */
            this.custom_id = 'id' in data ? resolveString(data.id): null;
        }

        /**
         * type
         * @type {Number} 
        */
        this.type = 2;

        return this.toJSON();
    }

    /**
     * Method to setStyle
     * @param {String} style 
    */
    setStyle(style) {
        this.style = this.resolveStyle(resolveString(style.toLocaleLowerCase()));
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
        this.url = this.style === 5 ? resolveString(url) : null;
        return this;
    }

    /**
     * Method to setID
     * @param {String} id 
    */
    setID(id) {
        this.custom_id = this.style === 5 ? null : resolveString(id);
        return this;
    }

    /**
     * Method to toJSON
     * @return {Object}
    */
    toJSON() {
        return {
            type: 2,
            style: this.style,
            label: this.label,
            disabled: this.disabled,
            url: this.url,
            custom_id: this.custom_id,
            emoji: this.emoji
        }
    }

    resolveStyle(style) {
        if (!style || style === undefined || style === null) return console.log(new Color('&d[GCommands] &cAn invalid button styles was provided').getText())
    
        if (!styles[style] || styles[style] === undefined || styles[style] === null) return console.log(new Color('&d[GCommands] &cAn invalid button styles was provided').getText())
    
        return styles[style] || style;
    }
    
    resolveButton(data) {
        if (!data.style) return console.log(new Color('&d[GCommands] &cPlease provide button style').getText())
    
        if (!data.label) return console.log(new Color('&d[GCommands] &cPlease provide button label').getText())
    
        if (data.style === 5) {
            if (!data.url) return console.log(new Color('&d[GCommands] &cYou provided url style, you must provide an URL').getText())
        } else {
            if (!data.custom_id) return console.log(new Color('&d[GCommands] &cPlease provide button id').getText())
        }
    
        return {
            style: data.style,
            label: data.label,
            disabled: Boolean(data.disabled),
            url: data.url,
            custom_id: data.custom_id,
            type: 2
        }
    }
}

module.exports = MessageButton;