const Color = require("../structures/Color");

/**
 * The MessageActionRow class
 */
class MessageActionRow {

    /**
     * Creates new MessageActionRow instance
     * @param {Object} data 
    */
    constructor(data = {}) {
        this.setup(data);
    }

    setup(data) {
        this.type = 1;
        this.components = [];

        return this.toJSON();
    }

    /**
     * Method to addComponent
     * @param {MessageButton | MessageSelectMenu} cmponent  
    */
    addComponent(component) {
        if(typeof component != "object") return console.log(new Color("&d[GCommands] &cNeed provide MessageButton!").getText())
        this.components.push(component)
        return this;
    }

    /**
     * Method to addComponents
     * @param {MessageButton[] | MessageSelectMenu[]} components
    */
    addComponents(components) {
        if(typeof components != "object") return console.log(new Color("&d[GCommands] &cNeed provide MessageButton!").getText())
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
        if(typeof components != "object") return console.log(new Color("&d[GCommands] &cNeed provide MessageSelectOption!").getText())
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