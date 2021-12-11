const {Listener} = require('../../../../dist');

new Listener('listenerRegister', {
	name: 'listener-register',
	run: (listener) => {
		return console.log(`Listener "${listener.name}" listing to "${listener.event}" registered`);
	}
});
