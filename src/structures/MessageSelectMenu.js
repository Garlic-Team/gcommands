const { resolveString } = require("../util/util");
const Color = require("./Color")

/**
 * The MessageSelectMenu class
 */
class MessageSelectMenu {

    /**
     * Creates new MessageSelectMenu instance
     * @param {Object} data 
    */
    constructor(data = {}) {
        this.type = 3;
        this.options = [];

        this.setup(data);
    }

    setup(data) {
        this.placeholder = 'placeholder' in data ? resolveString(data.placeholder) : null;
        this.max_values = 'max_values' in data ? Number(data.max_values) : 1;
        this.min_values = 'min_values' in data ? Number(data.min_values) : 1;
        this.id = 'id' in data ? resolveString(data.id) : null;
        this.options = 'options' in data ? Array(data.options) : [];
        this.disabled = 'disabled' in data ? Boolean(data.disabled) : false;

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
     * Method to setDisabled
     * @param {String} boolean 
    */
     setDisabled(boolean = true) {
        this.disabled = Boolean(boolean);
        return this;
    }

    /**
     * Method to addOption
     * @param {MessageSelectOption} MessageSelectOption 
    */
    addOption(option) {
        if(typeof option != "object") return console.log(new Color("&d[GCommands] &cNeed provide MessageSelectOption!").getText())
        this.options.push(option)
        return this;
    }

    /**
     * Method to addOptions
     * @param {MessageSelectOption[]} MessageSelectOptions 
    */
    addOptions(...options) {
        if(typeof options != "object") return console.log(new Color("&d[GCommands] &cNeed provide MessageSelectOption!").getText())
        this.options.push(...options.flat(Infinity).map((o) => o));
        return this;
    }
    
    /**
     * Method to removeOptions
     * @param {Number} index
     * @param {Number} deleteCount
     * @param {MessageSelectOption[]} MessageSelectOptions 
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
            disabled: this.disabled,
            options: this.options
        }
    }
}

module.exports = MessageSelectMenu;