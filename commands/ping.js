module.exports = {
	name: "ping",
	description: "Check bot ping",
	cooldown: 3,
	run: async({client, respond}) => {
		respond("My ping is " + Math.round(client.ws.ping) + "ms")
	}
};
