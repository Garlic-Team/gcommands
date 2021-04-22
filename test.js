const { GCommands } = require("./src/index");
const Discord = require("discord.js");

const client = new Discord.Client();

client.on("ready", () => {
    new GCommands(client, {
        cmdDir: "commands",
        ignoreBots: true,
        errorMessage: "Error :(",
        slash: {
           slash: 'both', //true = slash only, false = only normal, both = slash and normal
           prefix: '.' 
        },
        cooldownMessage: "Please wait {cooldown} more second(s) before reusing the \`{cmdname}\` command."
    })
})

client.login("token")