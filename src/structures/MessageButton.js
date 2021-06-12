/* From discord-buttons edited */
const { resolveString } = require("../util/util");
const Color = require("../structures/Color")
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
     * @param {String} style 
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
        this.emoji = this.parseEmoji(`${emoji}`);
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
    
    parseEmoji(text) {
        if (text.includes('%')) text = decodeURIComponent(text);
        if (!text.includes(':')) return { animated: false, name: text, id: null };
        const m = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
        if (!m) return null;
        return { animated: Boolean(m[1]), name: m[2], id: m[3] || null };
    }
}

module.exports = MessageButton;