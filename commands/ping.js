module.exports = {
	name: "ping",
	description: "Check bot ping",
	run: async(client, cmd, message) => {
		if(message) {
			return message.channel.send("My ping is `" + Math.round(client.ws.ping) + "ms`")
		}

		client.api.interactions(cmd.id, cmd.token).callback.post({
			data: {
				type: 4,
				data: {
					content: "My ping is " + Math.round(client.ws.ping) + "ms"
				}
			}
		})
	}
};
