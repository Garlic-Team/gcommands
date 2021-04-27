const {Collection} = require("discord.js")
const Color = require("../color/Color");

module.exports = {
    reply: async function() {
        if (this.data) {
            return this;
        }
    
        console.log(this)
        /*Object.assign(this.data, {
            message_reference: {
                message_id: this.channel.lastMessageID
            }
        })*/
    
        this.data.components = [
            {
                type: 1,
                components: this.options.buttons
            }
        ];
    
        delete this.options;
        return this;
    }
}