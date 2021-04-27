const { DiscordAPIError, MessageEmbed } = require("discord.js");

module.exports = {
	name: "guu",
	description: "Test",
	expectedArgs: '<enable> <test>',
	subCommandGroup: "group",
	subCommand: ["button;<enable> <test>","pog;<disable> <button>"],
	minArgs: 1,
	cooldown: 3,
	guildOnly: "id",
	ownerOnly: "id",
	requiredPermission: "ADMINISTRATOR",
	requiredPermissionMessage: "You need have ADMINISTRATOR perms.",
	run: async(client, slash, message, args) => {
		if(message) {
			if(args[0]) {
				return message.channel.send("My ping is `" + Math.round(client.ws.ping) + "ms`")
			} else {
				return message.channel.send("Need args")
			}
		}

		//return "My ping is `" + Math.round(client.ws.ping) + "ms`";
		client.api.interactions(slash.id, slash.token).callback.post({
			data: {
				type: 4,
				data: {
					content: "My ping is `" + Math.round(client.ws.ping) + "ms`"
				}
			}
		})
	}
};