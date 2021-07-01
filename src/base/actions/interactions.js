const ButtonEvent = require("../../structures/ButtonEvent");
const SelectMenuEvent = require("../../structures/SelectMenuEvent");

module.exports = (client) => {
    client.ws.on('INTERACTION_CREATE', data => {
        if (!data.message) return;
        
        if(data.data.component_type == 3) {
            const dropdown = new SelectMenuEvent(client, data)

            client.emit(`selectMenu`, dropdown)
            client.emit("interaction", dropdown)
        }

        if (data.data.component_type == 2) {
            const button = new ButtonEvent(client, data);

            client.emit('clickButton', button);
            client.emit("interaction", button)
        }
    });
}