module.exports = {
    GCommands: require("./main/GCommands.js"),
    GEvents: require("./main/GEvents"),
    GCommandsDispatcher: require("./main/GCommandsDispatcher"),
    GCommandsGuild: require("./structures/GuildStructure"),
    GCommandsMessage: require("./structures/MessageStructure"),
    Color: require("./color/Color"),
    Buttons: require("./main/Buttons"),
    SlashCommand: {
        STRING: 3,
        INTEGER: 4,
        BOOLEAN: 5,
        USER: 6,
        CHANNEL: 7,
        ROLE: 8,
        MENTIONABLE: 9
    }
}