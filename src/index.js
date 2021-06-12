'use strict';

module.exports = {
    // Root classes
    GCommandsBase: require("./base/GCommandsBase"),
    GCommands: require("./base/GCommands.js"),
    GEvents: require("./base/GEvents"),
    GCommandsDispatcher: require("./base/GCommandsDispatcher"),

    // Loaders
    GEventLoader: require("./managers/GEventLoader"),
    GCommandLoader: require("./managers/GCommandLoader"),
    GDatabaseLoader: require("./managers/GDatabaseLoader"),

    // Structures
    GCommandsGuild: require("./structures/guild"),
    GCommandsMessage: require("./structures/message"),
    GNewsChannel: require("./structures/NewsChannel"),
    GTextChannel: require("./structures/TextChannel"),
    GDMChannel: require("./structures/DMChannel"),
    MessageButton: require("./structures/MessageButton"),
    MessageActionRow: require("./structures/MessageActionRow"),
    
    ButtonCollectorV12: require("./structures/v13/ButtonCollector"),
    ButtonCollectorV13: require("./structures/v12/ButtonCollector"),

    // Other
    Color: require("./structures/Color"),
    Util: require("./util/util"),
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