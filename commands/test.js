//const { SlashCommand } = require("gcommands")
const MessageButton = require("../src/utils/MessageButton")

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
	run: async({client, message, respond, edit}, args) => {
	//run: async(client, slash, message, args) => {
		const button = new MessageButton().setStyle("gray").setLabel("test").setID("custom_id").toJSON()
		const button1 = new MessageButton().setStyle("gray").setLabel("po").setID("custom_id").toJSON()

		if(message) {
			console.log(await message.guild.getCommandPrefix())

			respond("hi", {
				components: [
					button, button1
				]
			})

			setTimeout(() => {
				edit("hello")
			}, 1000)
			/*if(args[0]) {
				return message.channel.send("My ping is `" + Math.round(client.ws.ping) + "ms`")
			} else {
				return message.inlineReply("Need args")
			}*/
			return;
		}

		respond({
			content: "My ping is `" + Math.round(client.ws.ping) + "ms`",
			ephemeral: true,
			allowedMentions: { parse: [], repliedUser: true },
			components: [button,button1]
		})

		setTimeout(() => {
			edit("hi")
		}, 3000)

		/*
						CAN USE
		return "My ping is `" + Math.round(client.ws.ping) + "ms`"
		*/
	}
};
