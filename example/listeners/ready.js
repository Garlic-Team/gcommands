const {Listener} = require('../../dist');

new Listener('ready', {
	name: 'ready',
	once: true,
	run: (client) => {
		return console.log(`Ready! Initialized with ${client.guilds.cache.size} guilds`);
	}
});
