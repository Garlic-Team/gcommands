module.exports = client => {
    client.on('interactionCreate', interaction => {
        if (interaction.isButton()) {
            client.emit('clickButton', interaction);
        }
        if (interaction.isSelectMenu()) {
            client.emit('selectMenu', interaction);
        }
    });
};
