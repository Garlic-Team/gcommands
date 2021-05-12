module.exports = {
    GCommands: require("./main/GCommands.js"),
    GEvents: require("./main/GEvents"),
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