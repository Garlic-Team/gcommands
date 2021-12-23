const {Listener} = require('../../dist');

new Listener('ready', {
	name: 'ready',
	run: (client) => {
		return console.log(`Ready! Initialized with ${client.guilds.cache.size} guilds`);
	}
});
