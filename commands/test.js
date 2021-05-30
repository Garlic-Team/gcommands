//const { SlashCommand } = require("gcommands")
const { MessageEmbed, DiscordAPIError, Message } = require("discord.js");
const { MessageActionRow } = require("../src");
const MessageButton = require("../src/utils/buttons/MessageButton")

module.exports = {
	name: "test",
	aliases: ["ccc"],
	description: "Test",
	expectedArgs: '<enable:6:description> <test>',
	/*expectedArgs: [
		{
			name: "list",
			type: 3,//SlashCommand.STRING,
			description: "helllo",
			required: true,
			choices: [
				{
					name: "Hyro Dog",
					value: "dogik"
				},
				{
					name: "Pancucha",
					value: "pancier"
				}
			]
		},
		{
			name: "user",
			type: 6,//SlashCommand.USER,
			description: "select user",
			required: false
		}
	],*/
	/*expectedArgs: [
        {
            name: "user",
            description: "Get or edit permissions for a user",
            type: 2, // 2 is type SUB_COMMAND_GROUP
            options: [
                {
                    name: "get",
                    description: "Get permissions for a user",
                    type: 1, // 1 is type SUB_COMMAND
                    options: [
                        {
                            name: "user",
                        	description: "The user to get",
                            type: 6,
                            required: true
                        }
                    ]
                },
                {
                    name: "edit",
                    description: "Edit permissions for a user",
                    type: 1
                }
            ]
        },
        {
            name: "role",
            description: "Get or edit permissions for a role",
            type: 2,
            options: [
                {
                    name: "get",
                    description: "Get permissions for a role",
                    type: 1
                },
                {
                    name: "edit",
                    description: "Edit permissions for a role",
                    type: 1
                }
            ]
        }
	],*/

	minArgs: 1,
	cooldown: 3,
	guildOnly: "747526604116459691", //["id","id2"]
	//userOnly: "id", //["id","id2"]
	//channelOnly: "id", //["id","id2"]
	//userRequiredPermissions: ["ADMINISTRATOR","MANAGE_GUILD"],
	//clientRequiredPermissions: ["ADMINISTRATOR"],
	//usage: "usage lol",
	//requiredRole: "ROLE ID",
	//slash: false,
	run: async({client, message, respond, edit, member, interaction}, args) => {
	//run: async(client, slash, message, args) => {

        const button = new MessageButton().setStyle("red").setLabel("pog").setID("redbutton").setEmoji("<a:PepeHehe:780344679647936562>").toJSON()
		const buttont = new MessageButton().setStyle("gray").setLabel("poag").setID("redbutton").setDisabled().setEmoji("💔").toJSON()
        const buttonURL = new MessageButton().setStyle("url").setLabel("po").setURL("https://thedevelopers.tk").toJSON()

		const testing = new MessageActionRow()
			.addComponent(button)
			.addComponent(buttont)

		const testing2 = new MessageActionRow()
			.addComponent(buttonURL)

		if(message) {
			console.log(await message.guild.getCommandPrefix())

			let msg = await respond({
				content: new MessageEmbed().setTitle("a"),
				components: [testing, testing2]
			})


			const filter = (button) => button.clicker.user.id === member.id;
			const collector = msg.createButtonCollector(filter, { max: 1, time: 60000, errors: ['time'] });
			
			collector.on('collect', async(b) => {
			});
			collector.on('end', collected => console.log(`Collected ${collected.size} items`));

			/*setTimeout(() => {
				edit({
					content: "hello",
					components: buttont
				})
			}, 1000)*/
			/*if(args[0]) {
				return message.channel.send("My ping is `" + Math.round(client.ws.ping) + "ms`")
			} else {
				return message.inlineReply("Need args")
			}*/
			return;
		}

		var msg = await respond({
			content: "My ping is `" + Math.round(client.ws.ping) + "ms`",
			allowedMentions: { parse: [], repliedUser: true },
			thinking: false,
			components: [testing, testing2]
		})

		/*setTimeout(async() => {

		}, 1000)*/

		/*let msg = await edit({
			content: new MessageEmbed().setTitle("hello"),
			components: button
		})*/

		/*const filter = (respond) => respond.clicker.user.id === member.user.id;
		const collector = await msg.createButtonCollector(filter, { max: 1, time: 10000, errors: ['time'] });
		collector.on("collect", async(b) => {
			console.log(b)
		})*/

		/*
						CAN USE
		return "My ping is `" + Math.round(client.ws.ping) + "ms`"
		*/
	}
};