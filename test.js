const { GCommands } = require("./src/index");
const Discord = require("discord.js");

const client = new Discord.Client();

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

client.login("NzQ1NTk5NjQ4MTEwMjE1MjYw.Xz0HyA.mt9KTcD9mIFskhMTQ2YeZxd8S9s")