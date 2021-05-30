module.exports = {
    // Root classes
    GCommandsBase: require("./GCommandsBase"),
    GCommands: require("./GCommands.js"),
    GEvents: require("./GEvents"),

    // Loaders, dispatcher
    GCommandsEventLoader: require("./utils/EventLoader"),
    GCommandsDispatcher: require("./GCommandsDispatcher"),
    GUpdater: require("./utils/updater"),

    // Structures
    GCommandsGuild: require("./extentions/guild"),
    GCommandsMessage: require("./extentions/message"),
    MessageButton: require("./utils/buttons/MessageButton"),
    MessageActionRow: require("./utils/buttons/MessageActionRow"),
    
    ButtonCollectorV12: require("./utils/buttons/ButtonCollectorV12"),
    ButtonCollectorV13: require("./utils/buttons/ButtonCollectorV13"),

    // Other
    Color: require("./utils/color/Color"),
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
    ButtonTypes: {
        blurple: "blurple",
        gray: "gray",
        grey: "gray",
        green: "green",
        red: "red",
        url: "url"
    },
    version: require("../package.json").version
}