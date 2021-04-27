const {Collection} = require("discord.js")
const Color = require("../color/Color");

module.exports = {
    reply: async function() {
        const g = await this;
        if (this.data) {
            return this;
        }
    
        console.log(g)
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