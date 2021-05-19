module.exports = {
    GCommandsBase: require("./GCommandsBase"),
    GCommands: require("./GCommands.js"),
    GEvents: require("./GEvents"),
    GCommandsDispatcher: require("./GCommandsDispatcher"),
    GCommandsGuild: require("./extentions/guild"),
    GCommandsMessage: require("./extentions/message"),
    GUpdater: require("./utils/updater"),
    Color: require("./utils/color/Color"),
    Buttons: require("./utils/Buttons"),
    SlashCommand: {
        SUB_COMMAND: 1,
        SUB_COMMAND_GROUP: 2,
        STRING: 3,
        INTEGER: 4,
        BOOLEAN: 5,
        USER: 6,
        CHANNEL: 7,
        ROLE: 8,
        MENTIONABLE: 9
    },
    version: "3.1.1-beta"
}