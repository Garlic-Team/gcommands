const Discord = require("discord.js");
const client = new Discord.Client();
const { GCommands } = require("./src/index");

client.on("ready", () => {
    new GCommands(client, {
        cmdDir: "commands",
        errorMessage: "Error :(",
        slash: {
           slash: 'both', //true = slash only, false = only normal, both = slash and normal
           prefix: '.' 
        },
        cooldown: {
            message: "Please wait {cooldown} more second(s) before reusing the \`{cmdname}\` command.",
            default: 3
        }
    })
})

client.login("NzQ1NTk5NjQ4MTEwMjE1MjYw.Xz0HyA.Lxd8ICJec55ZbLW3dprLn2XKBqg")