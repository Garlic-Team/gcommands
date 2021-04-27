module.exports = {
	name: "ping",
	description: "Check bot ping",
	cooldown: 3,
	run: async(client, slash, message) => {
		if(message) {
			return message.channel.send("My ping is `" + Math.round(client.ws.ping) + "ms`")
		}

		return "My ping is " + Math.round(client.ws.ping) + "ms"
	}
};
