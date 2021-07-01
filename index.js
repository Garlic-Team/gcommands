const Discord = require("discord.js");
const { GCommands } = require("./slash cmd/src");
const { MessageSelectMenu } = require("./src");
const client = new Discord.Client({intents: ["GUILDS","GUILD_MESSAGES"]});

client.on("ready", () => {
    const GCommandsClient = new GCommands(client, {
        cmdDir: "commands/",
        //eventDir: "events/",
        unkownCommandMessage: false, // true of false | send unkownCommand Message
        language: "english", //english, spanish, portuguese, russian, german, czech
        slash: {
           slash: 'both', //true = slash only, false = only normal, both = slash and normal
           prefix: ['.',"-"] // for normal commands
        },
        defaultCooldown: "3s",
        database: "mongodb://root:lsabqg6aQh05sAAy@hyrobotlistdiscord-shard-00-00.ckko0.mongodb.net:27017,hyrobotlistdiscord-shard-00-01.ckko0.mongodb.net:27017,hyrobotlistdiscord-shard-00-02.ckko0.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=hyrobotlistdiscord-shard-0&authSource=admin&retryWrites=true&w=majority"
        /*database: {
            type: "mongodb",
            url: "mongodb+srv://root:lsabqg6aQh05sAAy@hyrobotlistdiscord-ckko0.mongodb.net/GiveawayBot?retryWrites=true&w=majority",
        }*/
    })
    
    GCommandsClient.on("debug", (debug)=>{
        console.log(debug)
    })

    GCommandsClient.on("log", (log)=>{
        console.log(log)
    })

    console.log("Ready")
})

client.on("debug", (debug) => console.log(debug))

client.on("selectMenu", (menu) => {
    //menu.edit({
      //  content: "teeest"
    //})

    //console.log(menu.selectMenuId, menu.valueId)
})

client.login("NzQ1NTk5NjQ4MTEwMjE1MjYw.Xz0HyA.u4oeK3dz58QrgUkXvdL1dMwFziA")