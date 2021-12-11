const {Listener} = require('../../../../dist');

new Listener('pluginLoaded', {
	name: 'plugin-loaded',
	run: (plugin) => {
		return console.log(`Plugin "${plugin.name}" loaded`);
	}
});
