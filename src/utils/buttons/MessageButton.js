/* From discord-buttons edited */
const { resolveString } = require('discord.js').Util;
const Color = require("../color/Color")
const styles = {
    'blurple': 1,
    'gray': 2,
    'grey': 2,
    'green': 3,
    'red': 4,
    'url': 5
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

    setup(data) {
        this.style = 'style' in data ? this.resolveStyle(resolveString(data.style)) : null;
        this.label = 'label' in data ? resolveString(data.label) : null;
        this.disabled = 'disabled' in data ? Boolean(data.disabled) : false;
        this.emoji = 'emoji' in data ? resolveString(data.emoji) : null;

        if (this.style === 5) {
            this.url = 'url' in data ? resolveString(data.url) : null;
        } else {
            this.custom_id = 'id' in data ? resolveString(data.id): null;
        }

        this.type = 2;

        return this.toJSON();
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
     * Method to setEmoji
     * @param {Object} emoji  
    */
     setEmoji({name, id}) {
        name = resolveString(name);
        id = resolveString(id);

        if (this.isEmoji(name) === true) this.emoji = { name: name }
        else if (id.length > 0) this.emoji = { name: name, id: id }
        else this.emoji = { name: null, id: null };
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

        if (!style || style === undefined || style === null) return console.log(new Color("&d[GCommands] &cAn invalid button styles was provided").getText())
    
        if (!styles[style] || styles[style] === undefined || styles[style] === null) return console.log(new Color("&d[GCommands] &cAn invalid button styles was provided").getText())
    
        return styles[style] || style;
    }
    
    resolveButton(data) {
    
        if (!data.style) return console.log(new Color("&d[GCommands] &cPlease provide button style").getText())
    
        if (!data.label) return console.log(new Color("&d[GCommands] &cPlease provide button label").getText())
    
        if (data.style === 5) {
            if (!data.url) return console.log(new Color("&d[GCommands] &cYou provided url style, you must provide an URL").getText())
        } else {
            if (!data.custom_id) return console.log(new Color("&d[GCommands] &cPlease provide button id").getText())
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
    
    isEmoji(string) {
        var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
        return regex.test(string)
    }
}

module.exports = MessageButton;