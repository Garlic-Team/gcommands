const {Listener} = require('../../dist');

new Listener({
	name: 'ready',
	event: 'ready',
	once: true,
	run: (client) => {
		return console.log(`Ready! Initialized with ${client.guilds.cache.size} guilds`);
	}
});
