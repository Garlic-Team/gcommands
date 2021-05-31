const ButtonEvent = require("../../structures/ButtonEvent")
 
module.exports = (client) => {
    client.ws.on('INTERACTION_CREATE', data => {
        if (!data.message) return;
        
        if (data.data.component_type === 2) {
            const button = new ButtonEvent(client, data);

            client.emit('clickButton', button);
        }
    });
}