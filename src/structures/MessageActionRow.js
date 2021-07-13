const Color = require("../structures/Color");

/**
 * The MessageActionRow class
 */
class MessageActionRow {

    /**
     * Creates new MessageActionRow instance
     * @param {Array} data 
    */
    constructor(data = {}) {

        /**
         * type
         * @type {Number} 
        */
        this.type = 1;

        /**
         * components
         * @type {Array} 
        */
        this.components = [];

        this.setup(data);
    }

    /**
     * Setup
     * @param {Array} data 
     * @returns {MessageActionRow}
     * @private
     */
    setup(data) {
        this.components = 'components' in data ? Array(data.components) : [];

        return this.toJSON();
    }

    /**
     * Method to addComponent
     * @param {MessageButton | MessageSelectMenu} cmponent  
    */
    addComponent(component) {
        if(typeof component !== "object") return console.log(new Color("&d[GCommands] &cNeed provide MessageButton!").getText())
        this.components.push(component)
        return this;
    }

    /**
     * Method to addComponents
     * @param {MessageButton[] | MessageSelectMenu[]} components
    */
    addComponents(components) {
        if(typeof components !== "object") return console.log(new Color("&d[GCommands] &cNeed provide MessageButton!").getText())
        this.components.push(...components.flat(Infinity).map((c) => c));
        return this;
    }

    /**
     * Method to removeComponents
     * @param {Number} index
     * @param {Number} deleteCount
     * @param {MessageButton[] | MessageSelectMenu[]} components 
    */
    removeComponents(index, deleteCount, ...components) {
        if(typeof components !== "object") return console.log(new Color("&d[GCommands] &cNeed provide MessageSelectOption!").getText())
        this.components.splice(index, deleteCount, ...components.flat(Infinity).map((c) => c));
        return this;
    }

    /**
     * Method to toJSON
     * @return {Object}
    */
    toJSON() {
        return {
            type: 1,
            components: this.components
        }
    }
}

module.exports = MessageActionRow;