module.exports = {
	name: "ping",
	description: "Check bot ping",
	run: async(client, cmd) => {
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
