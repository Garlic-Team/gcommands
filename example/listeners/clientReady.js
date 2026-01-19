const { Listener } = require('../../dist');

new Listener({
	name: 'client-ready',
	event: 'clientReady',
	once: true,
	run: client => {
		return console.log(
			`Ready! Initialized with ${client.guilds.cache.size} guilds`,
		);
	},
});
