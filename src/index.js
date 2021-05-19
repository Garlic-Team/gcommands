module.exports = {
    GCommands: require("./GCommands.js"),
    GEvents: require("./GEvents"),
    GCommandsDispatcher: require("./GCommandsDispatcher"),
    GCommandsGuild: require("./extentions/guild"),
    GCommandsMessage: require("./extentions/message"),
    Color: require("./utils/color/Color"),
    Buttons: require("./utils/Buttons"),
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