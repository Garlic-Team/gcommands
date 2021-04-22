module.exports = {
	name: "test",
	description: "Test",
    expectedArgs: "<name>",
    minArgs: 1,
	run: async(client, cmd) => {
		client.api.interactions(cmd.id, cmd.token).callback.post({
			data: {
				type: 4,
				data: {
					content: "My ping is `" + Math.round(client.ws.ping) + "ms`"
				}
			}
		})
	}
};