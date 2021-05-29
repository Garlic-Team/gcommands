const Discord = require("discord.js");
const { GCommands } = require("./src/index");
const MessageButton = require("./src/utils/MessageButton")
const client = new Discord.Client();

const axios = require("axios")

client.on("ready", () => {
    const GCommandsClient = new GCommands(client, {
        cmdDir: "commands",
        eventDir: "events", //when you want event handler
        language: "czech", //english, spanish, portuguese, russian, german, czech, slovak,
        unkownCommandMessage: false, //send unkown command message true/false
        slash: {
           slash: 'both', //true = slash only, false = only normal, both = slash and normal
           prefix: '.' 
        },
        defaultCooldown: 3,
        database: {
            type: "mongodb", //sqlite/mongodb
            url: "mongodb+srv://" //mongourl
        }
    })
    GCommandsClient.on('debug', (debug) => {console.log(debug)} );


    client.dispatcher.addInhibitor((cmd, {message, member, guild, channel, respond, edit}) => {
        if(member.id == "126454") {
            respond("blacklisted")
            return false;
        }
    })
})

client.on("clickButton", (button) => {
    const buttonEdit = new MessageButton().setStyle("gray").setLabel("poag").setID("redbutton").setDisabled()

    button.edit({
        content: new Discord.MessageEmbed().setTitle("hello"),
        components: buttonEdit,
        edited: false
    })
    //button.edit("a")
    //button.edit("hai", [[buttonEdit, buttonEdit], [buttonEdit, buttonEdit]])
})

client.login("token")