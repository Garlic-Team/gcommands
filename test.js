const Discord = require("discord.js");
const client = new Discord.Client();
const { GCommands } = require("./src/index");
const axios = require("axios")

client.on("ready", () => {
    new GCommands(client, {
        cmdDir: "commands",
        eventDir: "events", //when you want event handler
        language: "czech",
        ownEvents: false,
        slash: {
           slash: 'both', //true = slash only, false = only normal, both = slash and normal
           prefix: '.' 
        },
        cooldown: {
            default: 3
        },
        database: {
            type: "mongodb", //sqlite/mongodb
            url: "mongodb+srv://" //mongourl
        }
    })
})

client.on("gDebug", (debug) => {console.log(debug)})

client.login("token")