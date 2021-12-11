const {Listener} = require('../../../../dist');

new Listener('commandRegister', {
	name: 'command-register',
	run: (command) => {
		return console.log(`Command "${command.name}" registered`);
	}
});
