const InteractionEvent = require("../../structures/InteractionEvent");

module.exports = (client) => {
    client.ws.on('INTERACTION_CREATE', data => {
        if (!data.message) return;
        
        if(data.data.component_type) {
            const dropdown = new InteractionEvent(client, data)

            client.emit(data.data.component_type == 3 ? `selectMenu` : `clickButton`, dropdown)
            client.emit("interaction", dropdown)
        }
    });
}