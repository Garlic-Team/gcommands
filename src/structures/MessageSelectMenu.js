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
 * The MessageSelectMenu class
 */
class MessageSelectMenu {

    /**
     * Creates new MessageSelectMenu instance
     * @param {Object} data 
    */
    constructor(data = {}) {
        this.options = [];

        this.setup(data);
    }

    setup(data) {
        this.type = 3;

        return this.toJSON();
    }

    /**
     * Method to setDisabled
     * @param {String} boolean 
    */
    setPlaceholder(string) {
        this.placeholder = resolveString(string);
        return this;
    }

    /**
     * Method to setMaxValues
     * @param {Number} int 
    */
    setMaxValues(int = 1) {
        this.max_values = Number(int)
        return this;
    }

    /**
     * Method to setMinValues
     * @param {Number} int 
    */
    setMinValues(int = 1) {
        this.min_values = Number(int)
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
     * Method to addOption
     * @param {Object} MessageSelectOption 
    */
    addOption(option) {
        if(typeof option != "object") return console.log(new Color("&d[GCommands] &cNeed provide MessageSelectOption!").getText())
        this.options.push(option)
        return this;
    }

    /**
     * Method to addOptions
     * @param {Object} MessageSelectOptions 
    */
    addOptions(...options) {
        if(typeof options != "object") return console.log(new Color("&d[GCommands] &cNeed provide MessageSelectOption!").getText())
        this.options.push(...options.flat(Infinity).map((o) => o));
        return this;
    }
    
    /**
     * Method to removeOptions
     * @param {Object} MessageSelectOptions 
    */
    removeOptions(index, deleteCount, ...options) {
        if(typeof options != "object") return console.log(new Color("&d[GCommands] &cNeed provide MessageSelectOption!").getText())
        this.components.splice(index, deleteCount, ...options.flat(Infinity).map((o) => o));
        return this;
    }

    /**
     * Method to toJSON
     * @return {Object}
    */
    toJSON() {
        return {
            type: 3,
            min_values: this.min_values,
            max_values: this.max_values || this.options.length,
            placeholder: this.placeholder || "",
            custom_id: this.custom_id,
            options: this.options
        }
    }
}

module.exports = MessageSelectMenu;