const { Message } = require('discord.js')
const GInteraction = require('./GInteraction');

/**
 * The InteractionEvent class
 */
class InteractionEvent extends GInteraction {

    /**
     * Creates new InteractionEvent instance
     * @param {Client} client
     * @param {Object} data 
    */
    constructor(client, data) {
        super(client, data)

        /**
         * componentType
         * @type {Number}
         */
        this.componentType = data.data.component_type

        /**
         * selectMenuId
         * @type {string}
         * @deprecated
         */
        this.selectMenuId = data.data.values ? data.data.custom_id : undefined;

        /**
         * valueId
         * @type {Array}
         * @deprecated
         */
        this.valueId = data.data.values ? data.data.values : undefined;

        /**
         * id
         * @type {Number}
         */
        this.id = data.data.custom_id;

        /**
         * values
         * @type {Array}
         */
        this.values = data.data.values ? data.data.values : undefined

        /**
         * clicker
         * @type {InteractionEventClicker}
         */
        this.clicker = {
            member: this.member,
            user: this.author,
            id: this.author.id,
        };

        /**
         * message
         * @type {GMessage}
         */
        this.message = new Message(this.client, data.message, this.channel)
    }
}

module.exports = InteractionEvent;