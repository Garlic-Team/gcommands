const { GCommands } = require("./src/index");
const Discord = require("discord.js");

const client = new Discord.Client();

client.on("ready", () => {
    new GCommands(client, {
        cmdDir: "commands",
        ignoreBots: true,
        errorMessage: "Error :("
    })
})

client.login("ODM0MDYzNTA3NDI2NjM5OTUz.YH7cLA.1zxmOUGwwT0vkqNgRZhDLsASnqk")