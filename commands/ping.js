module.exports = {
	name: "ping",
	description: "Check bot ping",
	run: async(client, slash, message) => {
		if(message) {
			return message.channel.send("My ping is `" + Math.round(client.ws.ping) + "ms`")
		}

		client.api.interactions(slash.id, slash.token).callback.post({
			data: {
				type: 4,
				data: {
					content: "My ping is " + Math.round(client.ws.ping) + "ms"
				}
			}
		})
	}
};
