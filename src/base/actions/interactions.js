const InteractionEvent = require('../../structures/InteractionEvent');
const { inhibit, interactionRefactor } = require('../../util/util')

module.exports = (client) => {
    client.ws.on('INTERACTION_CREATE', async(data) => {
        if (!data.message) return;
        
        if(data.data.component_type) {
            const interaction = new InteractionEvent(client, data)

            let member = interaction.clicker.member, guild = interaction.guild, channel = interaction.channel
            let inhibitReturn = await inhibit(client, interactionRefactor(client, interaction), {
                interaction, member,
                guild: guild, 
                channel: channel,
                respond: async(result) => {
                    return interaction.slashRespond(result)
                },
                edit: async(result, update = false) => {
                    return interaction.slashEdit(result, update);
                }
            })
            if(inhibitReturn == false) return;

            client.emit(data.data.component_type == 3 ? `selectMenu` : `clickButton`, interaction)
            client.emit('interaction', interaction)
        }
    });
}