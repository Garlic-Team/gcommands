/* From discord-buttons edited */
const { resolveString } = require('discord.js').Util;
const styles = {
    'blurple': 1,
    'gray': 2,
    'green': 3,
    'red': 4,
    'url': 5
};

/**
 * The Buttons class
 */
class MessageButton {

    /**
     * Creates new Buttons instance
     * @param {Object} data 
    */
    constructor(data = {}) {
        this.setup(data);
    }

    setup(data) {
        this.style = 'style' in data ? this.resolveStyle(resolveString(data.style)) : null;
        this.label = 'label' in data ? resolveString(data.label) : null;
        this.disabled = 'disabled' in data ? Boolean(data.disabled) : false;

        if (this.style === 5) {
            this.url = 'url' in data ? resolveString(data.url) : null;
        } else {
            this.custom_id = 'id' in data ? resolveString(data.id): null;
        }

        this.type = 2;

        return this;
    }

    /**
     * Method to setStyle
     * @param {String} style 
    */
    setStyle(style) {
        style = this.resolveStyle(resolveString(style));
        this.style = style;
        return this;
    }

    /**
     * Method to setLabel
     * @param {String} style 
    */
    setLabel(label) {
        label = resolveString(label);
        this.label = label;
        return this;
    }

    /**
     * Method to setDisabled
     * @param {String} boolean 
    */
    setDisabled(boolean) {
        this.disabled = Boolean(boolean || true);
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

    toJSON() {
        return {
            type: 2,
            style: this.style,
            label: this.label,
            disabled: this.disabled,
            url: this.url,
            custom_id: this.custom_id
        }
    }

    resolveStyle(style) {

        if (!style || style === undefined || style === null) return console.log(new Color("&d[GCommands] &cAn invalid button styles was provided"))
    
        if (!styles[style] || styles[style] === undefined || styles[style] === null) return console.log(new Color("&d[GCommands] &cAn invalid button styles was provided"))
    
        return styles[style] || style;
    }
    
    resolveButton(data) {
    
        if (!data.style) return console.log(new Color("&d[GCommands] &cPlease provide button style"))
    
        if (!data.label) return console.log(new Color("&d[GCommands] &cPlease provide button label"))
    
        if (data.style === 5) {
            if (!data.url) return console.log(new Color("&d[GCommands] &cYou provided url style, you must provide an URL"))
        } else {
            if (!data.custom_id) return console.log(new Color("&d[GCommands] &cPlease provide button id"))
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