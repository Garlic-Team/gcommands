const {Listener} = require('../../../../dist');

new Listener('pluginRegister', {
	name: 'plugin-register',
	run: (plugin) => {
		return console.log(`Plugin "${plugin.name}" registered`);
	}
});
