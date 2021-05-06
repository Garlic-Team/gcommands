module.exports = {
	name: "test",
	description: "Test",
	expectedArgs: '<enable:6:description> <test>',
	subCommandGroup: "group",
	subCommand: ["button;<enable:6:imgood> <test>","pog;<disable> <button>"],
	minArgs: 1,
	cooldown: 3,
	guildOnly: "id",
	ownerOnly: "id",
	requiredPermission: "ADMINISTRATOR",
	requiredPermissionMessage: "You need have ADMINISTRATOR perms.",
	requiredRole: "ROLE ID",
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

		console.log(slash.data.resolved.users)
		return "My ping is `" + Math.round(client.ws.ping) + "ms`"
		/*client.api.interactions(slash.id, slash.token).callback.post({
			data: {
				type: 4,
				data: {
					content: "My ping is `" + Math.round(client.ws.ping) + "ms`"
				}
			}
		})*/
	}
};

