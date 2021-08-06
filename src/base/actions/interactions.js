const CommandInteraction = require('../../structures/CommandInteraction');
const ButtonInteraction = require('../../structures/ButtonInteraction');
const SelectMenuInteraction = require('../../structures/SelectMenuInteraction');
const { interactionRefactor, inhibit } = require('../../util/util');

module.exports = client => {
    client.ws.on('INTERACTION_CREATE', async (data) => {
        let InteractionType;
        switch (data.type) {
            case 2:
                InteractionType = CommandInteraction;
                break;
            case 3:
                switch (data.data.component_type) {
                    case 2:
                        InteractionType = ButtonInteraction;
                        break;
                    case 3:
                        InteractionType = SelectMenuInteraction;
                        break;
                }
        }

        const interaction = new InteractionType(client, data);

        client.emit('GInteraction', interaction);
        if (data.data.component_type) {
            let member = interaction.clicker.member, guild = interaction.guild, channel = interaction.channel;
            let inhibitReturn = await inhibit(client, interactionRefactor(client, interaction), {
                interaction, member,
                guild: guild,
                channel: channel,
                respond: result => interaction.slashRespond(result),
                edit: (result, update = false) => interaction.slashEdit(result, update)
            });
            if (inhibitReturn === false) return;

            client.emit(data.data.component_type === 3 ? `selectMenu` : `clickButton`, interaction);
        }
    });
};
