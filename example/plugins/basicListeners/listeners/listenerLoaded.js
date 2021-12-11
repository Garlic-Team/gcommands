const {Listener} = require('../../../../dist');

new Listener('listenerLoaded', {
	name: 'listener-loaded',
	run: (listener) => {
		return console.log(`Listener "${listener.name}" listing to "${listener.event}" registered`);
	}
});
