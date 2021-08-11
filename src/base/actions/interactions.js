const CommandInteraction = require('../../structures/CommandInteraction');
const ContextMenuInteraction = require('../../structures/ContextMenuInteraction');
const ButtonInteraction = require('../../structures/ButtonInteraction');
const SelectMenuInteraction = require('../../structures/SelectMenuInteraction');
const { interactionRefactor, inhibit } = require('../../util/util');
const { InteractionTypes, ApplicationCommandTypes, MessageComponentTypes } = require('../../util/Constants');

module.exports = client => {
    client.ws.on('INTERACTION_CREATE', async data => {
        let InteractionType;
        switch (data.type) {
            case InteractionTypes.APPLICATION_COMMAND:
                switch (data.data.type) {
                    case ApplicationCommandTypes.CHAT_INPUT:
                        InteractionType = CommandInteraction;
                        break;
                    case ApplicationCommandTypes.USER:
                    case ApplicationCommandTypes.MESSAGE:
                        InteractionType = ContextMenuInteraction;
                        break;
                }
                break;
            case InteractionTypes.MESSAGE_COMPONENT:
                switch (data.data.component_type) {
                    case MessageComponentTypes.BUTTON:
                        InteractionType = ButtonInteraction;
                        break;
                    case MessageComponentTypes.SELECT_MENU:
                        InteractionType = SelectMenuInteraction;
                        break;
                }
        }

        const interaction = new InteractionType(client, data);

        client.emit('GInteraction', interaction);
        if (data.data.component_type) {
            let member = interaction.clicker.member, guild = interaction.guild, channel = interaction.channel;
            let inhibitReturn = await inhibit(client, interactionRefactor(interaction), {
                interaction, member,
                guild: guild,
                channel: channel,
                respond: result => interaction.slashRespond(result),
                edit: (result, update = false) => interaction.slashEdit(result, update),
            });
            if (inhibitReturn === false) return;

            client.emit(data.data.component_type === 3 ? 'selectMenu' : 'clickButton', interaction);
        }
    });
};
