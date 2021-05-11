const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "test",
	aliases: ["ccc"],
	description: "Test",
	expectedArgs: '<enable:6:description> <test>',
	subCommandGroup: "group",
	subCommand: ["button;<enable:6:imgood> <test>","pog;<disable> <button>"],
	minArgs: 1,
	cooldown: 3,
	guildOnly: "747526604116459691",
	//ownerOnly: "id",
	requiredPermission: "ADMINISTRATOR",
	requiredPermissionMessage: "You need have ADMINISTRATOR perms.",
	//requiredRole: "ROLE ID",
	requiredRoleMessage: "You doesn't have role!",
	//slash: false,
	run: async(client, slash, message, args) => {
		if(message) {
			if(args[0]) {
				return message.channel.send("My ping is `" + Math.round(client.ws.ping) + "ms`")
			} else {
				return message.channel.send("Need args")
			}
			return;
		}

		return {
			content: "My ping is `" + Math.round(client.ws.ping) + "ms`",
			ephemeral: true,
			allowedMentions: { parse: [], repliedUser: true }
		}

		/*
						CAN USE
		return "My ping is `" + Math.round(client.ws.ping) + "ms`"
		*/
	}
};

