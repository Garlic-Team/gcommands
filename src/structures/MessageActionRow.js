const Color = require("../structures/Color")

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
     * @param {MessageButton} button  
    */
    addComponent(component) {
        if(typeof component != "object") return console.log(new Color("&d[GCommands] &cNeed provide MessageButton!").getText())
        this.components.push(component)
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