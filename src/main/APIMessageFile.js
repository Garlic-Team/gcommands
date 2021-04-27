const {APIMessage} = require("discord.js");

class replyAPIMessage extends APIMessage {
    resolveData() {

        if (this.data) {
            return this;
        }

        super.resolveData();

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

module.exports = {
    replyAPIMessage: replyAPIMessage
}