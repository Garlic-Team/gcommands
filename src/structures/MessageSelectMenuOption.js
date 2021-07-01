const { resolveString } = require("../util/util");

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

    setup(data) {
        this.label = 'label' in data ? resolveString(data.label) : null;

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
        this.emoji = this.parseEmoji(`${emoji}`);
        return this;
    }

    /**
     * Method to setDefault
     * @param {Boolean} default  
    */
    setDefault(def = true) {
        this.default = Boolean(def)
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
            default: this.default
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

module.exports = MessageSelectMenuOption;